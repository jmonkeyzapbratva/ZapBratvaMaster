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

const handleMessage = async (sock, msg) => {
    try {
        if (!msg.message) return;
        if (msg.key.fromMe) return;
        
        const messageType = Object.keys(msg.message)[0];
        const isGroup = helpers.isGroup(msg.key.remoteJid);
        const sender = isGroup ? msg.key.participant : msg.key.remoteJid;
        let senderNumber = helpers.extractNumber(sender);
        const groupId = isGroup ? msg.key.remoteJid : null;
        
        // Se o sender é LID, tenta obter o número real
        if (sender && sender.includes('@lid')) {
            // Tenta obter do pushName ou verifiedBizName
            const pushName = msg.pushName || '';
            
            // Em grupos, busca o número real dos participantes
            if (isGroup) {
                try {
                    const groupMeta = await sock.groupMetadata(groupId);
                    const participant = groupMeta.participants.find(p => p.id === sender);
                    if (participant && participant.id && !participant.id.includes('@lid')) {
                        senderNumber = helpers.extractNumber(participant.id);
                    }
                } catch (e) {}
            }
            
            // Se ainda é LID, tenta usar o número do próprio bot se for o dono conectado
            if (senderNumber.includes('lid') || senderNumber.includes('@')) {
                // Verifica se o pushName corresponde ao nome do dono
                const botNumber = sock.user?.id?.split(':')[0] || '';
                // Se o bot e o dono são o mesmo número (você está testando consigo mesmo)
                if (botNumber === settings.ownerNumber.replace(/^55/, '').replace(/^0/, '') ||
                    botNumber === settings.ownerNumber ||
                    settings.ownerNumber.includes(botNumber)) {
                    senderNumber = settings.ownerNumber;
                }
            }
        }
        
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
        
        db.incrementStat('messagesReceived');
        
        if (db.isBanned(senderNumber)) {
            return;
        }
        
        if (isGroup) {
            const groupSettings = db.getGroup(groupId);
            
            if (groupSettings.antiLink && helpers.isUrl(text)) {
                const groupMetadata = await sock.groupMetadata(groupId);
                const isAdmin = groupMetadata.participants.find(
                    p => p.id === sender && (p.admin === 'admin' || p.admin === 'superadmin')
                );
                
                if (!isAdmin) {
                    const allowedUrls = settings.allowedLinks;
                    const urls = helpers.extractUrls(text);
                    const hasBlockedUrl = urls.some(url => 
                        !allowedUrls.some(allowed => url.includes(allowed))
                    );
                    
                    if (hasBlockedUrl) {
                        await sock.sendMessage(groupId, { 
                            text: '🔗 *ANTI-LINK ATIVADO*\n\n❌ Links não são permitidos neste grupo!' 
                        });
                        await sock.sendMessage(groupId, { delete: msg.key });
                        return;
                    }
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
        
        const args = text.slice(settings.prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();
        
        if (!command) return;
        
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
        
        const mentionedJids = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        
        const context = {
            sock,
            msg,
            args,
            text,
            sender,
            senderNumber,
            groupId,
            isGroup,
            isOwner,
            isBotAdmin,
            isAdmin: isGroupAdmin || isOwner,
            isBotGroupAdmin,
            groupMetadata,
            prefix: settings.prefix,
            mentions: mentionedJids
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
        
        if (allCommands[command]) {
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
