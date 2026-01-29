const settings = require('../config/settings');
const messages = require('../config/messages');
const logger = require('../utils/logger');
const helpers = require('../utils/helpers');
const db = require('../storage/database');

const menuCommand = require('../commands/menu');
const funCommands = require('../commands/fun');
const adminCommands = require('../commands/admin');
const ownerCommands = require('../commands/owner');
const utilCommands = require('../commands/utils');
const smsCommands = require('../commands/sms');
const consultaCommands = require('../commands/consultas');
const guerraCommands = require('../commands/guerra');
const jogosCommands = require('../commands/jogos');
const brincadeirasCommands = require('../commands/brincadeiras');
const downloadCommands = require('../commands/downloads');
const stickerCommands = require('../commands/stickers');
const economiaCommands = require('../commands/economia');

const floodControl = new Map();

// Comandos por nível de permissão
// DONO: Pode usar TODOS os comandos
const OWNER_COMMANDS = [
    'addadmin', 'rmadmin', 'listadmins', 'bc', 'bcgroups', 'nuke', 'leave', 'leaveall',
    'join', 'setprefix', 'setstatus', 'eval', 'shell', 'addsaldo', 'saldoapi',
    'stats', 'grupos', 'limpar', 'block', 'unblock', 'setpp', 'setname', 'restart',
    'bangp', 'unbangp', 'setmenufoto', 'setmenutexto', 'comprar', 'saldo', 'meusnumeros',
    'paises', 'servicos', 'sms'
];

// ADMIN: Pode usar comandos de moderação + livres
const ADMIN_COMMANDS = [
    'ban', 'kick', 'add', 'promote', 'demote', 'mute', 'unmute', 'link', 'revoke',
    'tagall', 'hidetag', 'destrava', 'banghost', 'antilink', 'antiflood', 'antifake',
    'antilocf', 'antipag', 'd', 'band',
    'welcome', 'goodbye', 'setwelcome', 'setgoodbye', 'regras', 'setregras',
    'advertir', 'advertidos', 'resetadvertencias'
];

// MEMBROS: Todos os outros comandos (menus, jogos, brincadeiras, downloads, economia, consultas, stickers)

const handleMessage = async (sock, msg) => {
    try {
        if (!msg.message) return;
        if (msg.key.fromMe) return;
        
        const messageType = Object.keys(msg.message)[0];
        const isGroup = helpers.isGroup(msg.key.remoteJid);
        const sender = isGroup ? msg.key.participant : msg.key.remoteJid;
        let senderNumber = helpers.extractNumber(sender);
        const groupId = isGroup ? msg.key.remoteJid : null;
        
        // Mapa global para converter LID → número real
        let lidToNumber = new Map();
        
        // Se o sender é LID, tenta obter o número real
        if (sender && sender.includes('@lid')) {
            if (isGroup) {
                try {
                    const groupMeta = await sock.groupMetadata(groupId);
                    // Cria mapa de LID para número real
                    for (const p of groupMeta.participants) {
                        if (p.lid && p.id && !p.id.includes('@lid')) {
                            lidToNumber.set(p.lid, p.id);
                        }
                    }
                    // Busca o número real do sender
                    if (lidToNumber.has(sender)) {
                        senderNumber = helpers.extractNumber(lidToNumber.get(sender));
                    }
                } catch (e) {}
            }
            
            // Se ainda é LID, usa número do dono se aplicável
            if (senderNumber.includes('lid') || senderNumber.includes('@')) {
                const botNumber = sock.user?.id?.split(':')[0] || '';
                if (settings.ownerNumber.includes(botNumber) || botNumber === settings.ownerNumber) {
                    senderNumber = settings.ownerNumber;
                }
            }
        }
        
        // Função para converter LID para número real
        const getRealNumber = (jid) => {
            if (!jid) return null;
            if (jid.includes('@lid') && lidToNumber.has(jid)) {
                return helpers.extractNumber(lidToNumber.get(jid));
            }
            return helpers.extractNumber(jid);
        };
        
        const getRealJid = (jid) => {
            if (!jid) return null;
            if (jid.includes('@lid') && lidToNumber.has(jid)) {
                return lidToNumber.get(jid);
            }
            return jid;
        };
        
        let text = '';
        if (messageType === 'conversation') {
            text = msg.message.conversation;
        } else if (messageType === 'extendedTextMessage') {
            text = msg.message.extendedTextMessage.text;
        } else if (messageType === 'imageMessage') {
            text = msg.message.imageMessage.caption || '';
        } else if (messageType === 'videoMessage') {
            text = msg.message.videoMessage.caption || '';
        }
        
        // Detecta tipos especiais de mensagem
        const isLocationMessage = messageType === 'locationMessage' || messageType === 'liveLocationMessage';
        
        db.incrementStat('messagesReceived');
        
        if (db.isBanned(senderNumber)) {
            return;
        }
        
        if (isGroup) {
            const groupSettings = db.getGroup(groupId);
            const groupMetadata = await sock.groupMetadata(groupId);
            const isAdmin = groupMetadata.participants.find(
                p => p.id === sender && (p.admin === 'admin' || p.admin === 'superadmin')
            );
            const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
            const isBotAdmin = groupMetadata.participants.some(
                p => p.id === botId && (p.admin === 'admin' || p.admin === 'superadmin')
            );
            
            // Obtém JID real do sender para ações de moderação
            const getRealSenderJid = () => {
                if (sender && sender.includes('@lid')) {
                    for (const p of groupMetadata.participants) {
                        if (p.lid === sender && p.id && !p.id.includes('@lid')) {
                            return p.id;
                        }
                    }
                }
                return sender;
            };
            const realSenderJid = getRealSenderJid();
            
            // Anti-localização - bane e apaga
            if (groupSettings.antiLocf && isLocationMessage && !isAdmin) {
                if (isBotAdmin) {
                    try {
                        await sock.sendMessage(groupId, { delete: msg.key });
                        await sock.groupParticipantsUpdate(groupId, [realSenderJid], 'remove');
                        await sock.sendMessage(groupId, { 
                            text: `📍 *ANTI-LOCALIZAÇÃO*\n\n🚫 @${senderNumber} foi banido por enviar localização!`,
                            mentions: [realSenderJid]
                        });
                    } catch (e) {
                        console.log('[ANTILOCF] Erro:', e.message);
                    }
                }
                return;
            }
            
            // Anti-pagamento - detecta links de pagamento específicos
            if (groupSettings.antiPag && !isAdmin) {
                // Regex mais específico: URLs de pagamento ou chaves Pix
                const pagRegex = /(picpay\.me|nubank\.com\.br\/pagar|mercadopago\.com|paypal\.me|bcb\.gov\.br\/pix|pix\.ae|gerarpix|qrpix|chavepix|copiaecola)/i;
                // Detecta também padrões de chave Pix (email, telefone, CPF em formato específico)
                const pixKeyRegex = /\b(pix:?\s*[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+|pix:?\s*\d{11}|\d{3}\.\d{3}\.\d{3}-\d{2})\b/i;
                
                if (pagRegex.test(text) || (text.toLowerCase().includes('pix') && pixKeyRegex.test(text))) {
                    if (isBotAdmin) {
                        await sock.sendMessage(groupId, { delete: msg.key });
                        await sock.sendMessage(groupId, { 
                            text: `💳 *ANTI-PAGAMENTO*\n\n❌ @${senderNumber}, links/chaves de pagamento não são permitidos!`,
                            mentions: [realSenderJid]
                        });
                    }
                    return;
                }
            }
            
            // Anti-link - bane e apaga
            if (groupSettings.antiLink && helpers.isUrl(text) && !isAdmin) {
                const allowedUrls = settings.allowedLinks || [];
                const urls = helpers.extractUrls(text);
                const hasBlockedUrl = urls.some(url => 
                    !allowedUrls.some(allowed => url.includes(allowed))
                );
                
                if (hasBlockedUrl && isBotAdmin) {
                    try {
                        await sock.sendMessage(groupId, { delete: msg.key });
                        await sock.groupParticipantsUpdate(groupId, [realSenderJid], 'remove');
                        await sock.sendMessage(groupId, { 
                            text: `🔗 *ANTILINK*\n\n🚫 @${senderNumber} foi banido por enviar link!`,
                            mentions: [realSenderJid]
                        });
                    } catch (e) {
                        console.log('[ANTILINK] Erro:', e.message);
                    }
                    return;
                }
            }
            
            if (groupSettings.antiFlood) {
                const floodKey = `${groupId}-${sender}`;
                const now = Date.now();
                
                if (!floodControl.has(floodKey)) {
                    floodControl.set(floodKey, { count: 1, lastTime: now });
                } else {
                    const data = floodControl.get(floodKey);
                    if (now - data.lastTime < settings.floodTime) {
                        data.count++;
                        if (data.count > settings.floodMessages) {
                            await sock.sendMessage(groupId, { 
                                text: `🌊 *ANTI-FLOOD*\n\n⚠️ @${senderNumber}, pare de enviar mensagens muito rápido!`,
                                mentions: [sender]
                            });
                            floodControl.set(floodKey, { count: 0, lastTime: now });
                            return;
                        }
                    } else {
                        floodControl.set(floodKey, { count: 1, lastTime: now });
                    }
                }
            }
            
            if (groupSettings.antiBadWords) {
                const hasBadWord = settings.badWords.some(word => 
                    text.toLowerCase().includes(word.toLowerCase())
                );
                
                if (hasBadWord) {
                    await sock.sendMessage(groupId, { 
                        text: '🚫 *FILTRO DE PALAVRAS*\n\n❌ Essa palavra não é permitida!' 
                    });
                    await sock.sendMessage(groupId, { delete: msg.key });
                    return;
                }
            }
        }
        
        if (!text.startsWith(settings.prefix)) return;
        
        const fullCommand = text.slice(settings.prefix.length).trim();
        const args = fullCommand.split(/ +/);
        let command = args.shift().toLowerCase();
        
        if (!command) return;
        
        // Detecta comando de edição de mídia (!+comando)
        const isMediaEditCommand = command.startsWith('+');
        if (isMediaEditCommand) {
            command = command.slice(1); // Remove o '+' para pegar o nome do comando
        }
        
        // Verifica se o bot está desativado no grupo (exceto comandos bangp/unbangp)
        if (isGroup) {
            const groupSettings = db.getGroup(groupId);
            if (groupSettings.botDisabled && !['bangp', 'unbangp'].includes(command)) {
                return; // Bot desativado, ignora comandos
            }
        }
        
        // Verifica se é o dono (por número OU por LID)
        const senderClean = senderNumber.replace(/\D/g, '');
        const ownerClean = settings.ownerNumber.replace(/\D/g, '');
        const ownerLID = settings.ownerLID || '';
        
        const isOwner = senderClean === ownerClean || 
                        senderNumber === settings.ownerNumber ||
                        senderClean === ownerLID || // Verifica pelo LID
                        senderNumber.includes(ownerLID); // Inclui o LID
        
        const isBotAdmin = db.isBotAdmin(senderNumber) || isOwner;
        
        let isGroupAdmin = false;
        let isBotGroupAdmin = false;
        let groupMetadata = null;
        
        if (isGroup) {
            groupMetadata = await sock.groupMetadata(groupId);
            const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
            
            isGroupAdmin = groupMetadata.participants.some(
                p => p.id === sender && (p.admin === 'admin' || p.admin === 'superadmin')
            );
            
            isBotGroupAdmin = groupMetadata.participants.some(
                p => p.id === botId && (p.admin === 'admin' || p.admin === 'superadmin')
            );
        }
        
        const mentionedJidsRaw = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        
        // Converte menções LID para números reais
        const mentionedJids = mentionedJidsRaw.map(jid => getRealJid(jid));
        
        const context = {
            sock,
            msg,
            args,
            text,
            sender: getRealJid(sender) || sender,
            senderNumber,
            groupId,
            isGroup,
            isOwner,
            isBotAdmin,
            isAdmin: isGroupAdmin || isOwner,
            isBotGroupAdmin,
            groupMetadata,
            prefix: settings.prefix,
            mentions: mentionedJids,
            getRealNumber,
            getRealJid,
            lidToNumber
        };
        
        const groupName = isGroup ? groupMetadata.subject : 'Privado';
        logger.command(senderNumber, `${settings.prefix}${command}`, groupName);
        db.incrementStat('commandsUsed');
        
        if (settings.autoRead) {
            await sock.readMessages([msg.key]);
        }
        
        if (settings.autoTyping) {
            await sock.sendPresenceUpdate('composing', msg.key.remoteJid);
        }
        
        const allCommands = {
            ...menuCommand,
            ...funCommands,
            ...adminCommands,
            ...ownerCommands,
            ...utilCommands,
            ...smsCommands,
            ...consultaCommands,
            ...guerraCommands,
            ...jogosCommands,
            ...brincadeirasCommands,
            ...downloadCommands,
            ...stickerCommands,
            ...economiaCommands
        };
        
        // Processa comando de edição de mídia (!+comando)
        if (isMediaEditCommand) {
            if (!isOwner) {
                return await sock.sendMessage(msg.key.remoteJid, {
                    text: '❌ Apenas o dono pode editar comandos!'
                });
            }
            
            // Processa mídia anexada
            const quotedMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            const hasImage = messageType === 'imageMessage' || quotedMsg?.imageMessage;
            const hasVideo = messageType === 'videoMessage' || quotedMsg?.videoMessage;
            const hasAudio = messageType === 'audioMessage' || quotedMsg?.audioMessage;
            
            // Texto customizado (args juntados)
            const customText = args.join(' ') || null;
            
            if (!hasImage && !hasVideo && !hasAudio && !customText) {
                return await sock.sendMessage(msg.key.remoteJid, {
                    text: `╔♡━━━━━━━━━━━━━━━━━━━━━━♡╗
║  🇨🇦 *ALIANCA BRATVA* 🇨🇦  ║
╚♡━━━━━━━━━━━━━━━━━━━━━━♡╝

⚙️ *EDITAR COMANDO*

📌 *Uso:* ${settings.prefix}+${command} [texto]

📸 Envie junto uma imagem/vídeo/áudio
📝 Ou responda a uma mídia

💡 *Exemplo:*
${settings.prefix}+comer {user} comeu {target}!

🔄 *Variáveis:*
• {user} = quem usou
• {target} = quem foi marcado

❌ *Remover:* ${settings.prefix}-${command}`
                });
            }
            
            // Salva mídia se houver
            let mediaData = null;
            if (hasImage || hasVideo || hasAudio) {
                const mediaMsg = hasImage ? 
                    (messageType === 'imageMessage' ? msg.message.imageMessage : quotedMsg?.imageMessage) :
                    hasVideo ?
                    (messageType === 'videoMessage' ? msg.message.videoMessage : quotedMsg?.videoMessage) :
                    (messageType === 'audioMessage' ? msg.message.audioMessage : quotedMsg?.audioMessage);
                
                if (mediaMsg) {
                    try {
                        const { downloadMediaMessage } = require('@whiskeysockets/baileys');
                        const buffer = await downloadMediaMessage(
                            quotedMsg ? { message: quotedMsg } : msg,
                            'buffer',
                            {}
                        );
                        mediaData = {
                            type: hasImage ? 'image' : hasVideo ? 'video' : 'audio',
                            data: buffer.toString('base64'),
                            mimetype: mediaMsg.mimetype
                        };
                    } catch (e) {
                        console.log('[MEDIA] Erro ao baixar mídia:', e.message);
                    }
                }
            }
            
            // Salva configuração
            db.setCustomMedia(command, {
                text: customText,
                media: mediaData,
                updatedAt: Date.now()
            });
            
            await sock.sendMessage(msg.key.remoteJid, {
                text: `✅ Comando *${settings.prefix}${command}* atualizado!

${customText ? `📝 *Texto:* ${customText}` : ''}
${mediaData ? `📎 *Mídia:* ${mediaData.type}` : ''}`
            });
            return;
        }
        
        // Processa comando de remoção de mídia (!-comando)
        if (command.startsWith('-')) {
            const cmdName = command.slice(1);
            if (!isOwner) {
                return await sock.sendMessage(msg.key.remoteJid, {
                    text: '❌ Apenas o dono pode remover customizações!'
                });
            }
            
            db.removeCustomMedia(cmdName);
            await sock.sendMessage(msg.key.remoteJid, {
                text: `✅ Customização do comando *${settings.prefix}${cmdName}* removida!`
            });
            return;
        }
        
        if (allCommands[command]) {
            // Verifica permissões
            // Dono pode usar TODOS os comandos
            if (OWNER_COMMANDS.includes(command) && !isOwner) {
                return await sock.sendMessage(msg.key.remoteJid, {
                    text: '❌ Apenas o dono pode usar este comando!'
                });
            }
            
            // Admin do grupo OU bot admin pode usar comandos de admin
            const canUseAdminCmd = isOwner || isGroupAdmin || isBotAdmin;
            if (ADMIN_COMMANDS.includes(command) && !canUseAdminCmd) {
                return await sock.sendMessage(msg.key.remoteJid, {
                    text: '❌ Apenas admins podem usar este comando!'
                });
            }
            
            // Verifica se tem mídia customizada
            const customMedia = db.getCustomMedia(command);
            if (customMedia) {
                context.customMedia = customMedia;
            }
            
            // Todos os outros comandos são livres para membros
            await allCommands[command](context);
        } else {
            await sock.sendMessage(msg.key.remoteJid, {
                text: `❌ Comando *${settings.prefix}${command}* não encontrado!\n\nUse *${settings.prefix}menu* para ver os comandos disponíveis.`
            });
        }
        
    } catch (error) {
        logger.error(`Erro no handler de mensagem: ${error.message}`);
        console.error(error);
    }
};

module.exports = { handleMessage };
