const settings = require('../config/settings');
const db = require('../storage/database');

const HEADER = `╔♡━━━━━━━━━━━━━━━━━━━━━━♡╗
║  🇨🇦 *ALIANCA BRATVA* 🇨🇦  ║
╚♡━━━━━━━━━━━━━━━━━━━━━━♡╝`;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const guerraCommands = {

    async nuke(ctx) {
        const { sock, msg, isOwner, isAdmin, isBotAdmin, isGroup } = ctx;
        const remoteJid = msg.key.remoteJid;

        if (!isGroup) {
            return await sock.sendMessage(remoteJid, { text: '❌ Apenas em grupos!' });
        }

        if (!isOwner && !isAdmin) {
            return await sock.sendMessage(remoteJid, { text: '❌ Apenas admins!' });
        }

        if (!isBotAdmin) {
            return await sock.sendMessage(remoteJid, { text: '❌ Preciso ser admin!' });
        }

        try {
            await sock.sendMessage(remoteJid, { text: '💥 *NUKE ATIVADO!*\n\n⚠️ Removendo todos os membros...' });

            const groupMetadata = await sock.groupMetadata(remoteJid);
            const participants = groupMetadata.participants;
            const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';
            const ownerJid = settings.ownerNumber + '@s.whatsapp.net';

            let removed = 0;

            for (const p of participants) {
                if (p.id !== botNumber && p.id !== ownerJid && !p.id.includes(settings.ownerNumber)) {
                    try {
                        await sock.groupParticipantsUpdate(remoteJid, [p.id], 'remove');
                        removed++;
                        await sleep(1000);
                    } catch (e) {
                        console.log(`Erro ao remover ${p.id}:`, e.message);
                    }
                }
            }

            try {
                await sock.groupUpdateSubject(remoteJid, '[ GRUPO ARQUIVADO - BRATVA ]');
                await sock.groupUpdateDescription(remoteJid, `[ ARQUIVADO PELO BOT ${settings.botName} ]`);
            } catch (e) {}

            await sock.sendMessage(remoteJid, {
                text: `${HEADER}
╭━━━⪩ 💥 *NUKE CONCLUIDO* ⪨━━━
│🇨🇦 Removidos: *${removed}*
│🇨🇦 Status: *ARQUIVADO*
╰━━━━━─「🇨🇦」─━━━━━`
            });

        } catch (error) {
            await sock.sendMessage(remoteJid, { text: `❌ Erro: ${error.message}` });
        }
    },

    async destrava(ctx) {
        const { sock, msg, isAdmin, isBotAdmin, isGroup } = ctx;
        const remoteJid = msg.key.remoteJid;

        if (!isGroup) {
            return await sock.sendMessage(remoteJid, { text: '❌ Apenas em grupos!' });
        }

        if (!isAdmin) {
            return await sock.sendMessage(remoteJid, { text: '❌ Apenas admins!' });
        }

        try {
            await sock.sendMessage(remoteJid, { text: '🔓 *DESTRAVA ATIVADO!*\n\n⚠️ Limpando mensagens problemáticas...' });

            for (let i = 0; i < 5; i++) {
                await sock.sendMessage(remoteJid, { text: '.' });
                await sleep(200);
            }

            await sock.sendMessage(remoteJid, {
                text: `${HEADER}
╭━━━⪩ 🔓 *DESTRAVA* ⪨━━━
│🇨🇦 Status: *Executado*
│🇨🇦 Grupo destravado!
╰━━━━━─「🇨🇦」─━━━━━

Se ainda estiver travado, use:
• Limpar conversa
• Sair e voltar ao grupo`
            });

        } catch (error) {
            await sock.sendMessage(remoteJid, { text: `❌ Erro: ${error.message}` });
        }
    },

    async banghost(ctx) {
        const { sock, msg, isAdmin, isBotAdmin, isGroup } = ctx;
        const remoteJid = msg.key.remoteJid;

        if (!isGroup) {
            return await sock.sendMessage(remoteJid, { text: '❌ Apenas em grupos!' });
        }

        if (!isAdmin) {
            return await sock.sendMessage(remoteJid, { text: '❌ Apenas admins!' });
        }

        if (!isBotAdmin) {
            return await sock.sendMessage(remoteJid, { text: '❌ Preciso ser admin!' });
        }

        try {
            await sock.sendMessage(remoteJid, { text: '👻 *Buscando membros fantasmas...*' });

            const groupMetadata = await sock.groupMetadata(remoteJid);
            const participants = groupMetadata.participants;
            const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';

            let removed = 0;
            const fantasmas = [];

            for (const p of participants) {
                if (p.id !== botNumber && !p.admin) {
                    try {
                        const pic = await sock.profilePictureUrl(p.id, 'image').catch(() => null);
                        if (!pic) {
                            fantasmas.push(p.id);
                        }
                    } catch (e) {
                        fantasmas.push(p.id);
                    }
                }
            }

            if (fantasmas.length === 0) {
                return await sock.sendMessage(remoteJid, {
                    text: `✅ Nenhum membro fantasma encontrado!`
                });
            }

            for (const ghost of fantasmas.slice(0, 10)) {
                try {
                    await sock.groupParticipantsUpdate(remoteJid, [ghost], 'remove');
                    removed++;
                    await sleep(1000);
                } catch (e) {}
            }

            await sock.sendMessage(remoteJid, {
                text: `${HEADER}
╭━━━⪩ 👻 *BANGHOST* ⪨━━━
│🇨🇦 Encontrados: *${fantasmas.length}*
│🇨🇦 Removidos: *${removed}*
╰━━━━━─「🇨🇦」─━━━━━`
            });

        } catch (error) {
            await sock.sendMessage(remoteJid, { text: `❌ Erro: ${error.message}` });
        }
    },

    async ban(ctx) {
        const { sock, msg, args, isAdmin, isBotAdmin, isGroup, mentions } = ctx;
        const remoteJid = msg.key.remoteJid;

        if (!isGroup) return await sock.sendMessage(remoteJid, { text: '❌ Apenas em grupos!' });
        if (!isAdmin) return await sock.sendMessage(remoteJid, { text: '❌ Apenas admins!' });
        if (!isBotAdmin) return await sock.sendMessage(remoteJid, { text: '❌ Preciso ser admin!' });

        const quoted = msg.message?.extendedTextMessage?.contextInfo?.participant;
        let userToBan = mentions?.[0] || quoted;

        if (!userToBan && args[0]) {
            userToBan = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
        }

        if (!userToBan) {
            return await sock.sendMessage(remoteJid, { text: '❌ Marque alguém para banir!' });
        }

        try {
            await sock.groupParticipantsUpdate(remoteJid, [userToBan], 'remove');
            const numero = userToBan.split('@')[0];
            await sock.sendMessage(remoteJid, {
                text: `${HEADER}
╭━━━⪩ 🔨 *BAN* ⪨━━━
│🇨🇦 Usuario: *@${numero}*
│🇨🇦 Status: *BANIDO*
╰━━━━━─「🇨🇦」─━━━━━`,
                mentions: [userToBan]
            });
        } catch (error) {
            await sock.sendMessage(remoteJid, { text: `❌ Erro: ${error.message}` });
        }
    },

    async kick(ctx) {
        return await guerraCommands.ban(ctx);
    },

    async add(ctx) {
        const { sock, msg, args, isAdmin, isBotAdmin, isGroup } = ctx;
        const remoteJid = msg.key.remoteJid;

        if (!isGroup) return await sock.sendMessage(remoteJid, { text: '❌ Apenas em grupos!' });
        if (!isAdmin) return await sock.sendMessage(remoteJid, { text: '❌ Apenas admins!' });
        if (!isBotAdmin) return await sock.sendMessage(remoteJid, { text: '❌ Preciso ser admin!' });

        if (!args[0]) {
            return await sock.sendMessage(remoteJid, {
                text: `❌ Informe o número!\n\n*Uso:* ${settings.prefix}add 5511999999999`
            });
        }

        const numero = args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';

        try {
            await sock.groupParticipantsUpdate(remoteJid, [numero], 'add');
            await sock.sendMessage(remoteJid, {
                text: `✅ @${args[0].replace(/[^0-9]/g, '')} adicionado!`,
                mentions: [numero]
            });
        } catch (error) {
            await sock.sendMessage(remoteJid, { text: `❌ Não foi possível adicionar. Número pode ter privacidade.` });
        }
    },

    async promote(ctx) {
        const { sock, msg, isAdmin, isBotAdmin, isGroup, mentions } = ctx;
        const remoteJid = msg.key.remoteJid;

        if (!isGroup) return await sock.sendMessage(remoteJid, { text: '❌ Apenas em grupos!' });
        if (!isAdmin) return await sock.sendMessage(remoteJid, { text: '❌ Apenas admins!' });
        if (!isBotAdmin) return await sock.sendMessage(remoteJid, { text: '❌ Preciso ser admin!' });

        const quoted = msg.message?.extendedTextMessage?.contextInfo?.participant;
        const userToPromote = mentions?.[0] || quoted;

        if (!userToPromote) {
            return await sock.sendMessage(remoteJid, { text: '❌ Marque alguém para promover!' });
        }

        try {
            await sock.groupParticipantsUpdate(remoteJid, [userToPromote], 'promote');
            await sock.sendMessage(remoteJid, {
                text: `✅ @${userToPromote.split('@')[0]} agora é *ADMIN*!`,
                mentions: [userToPromote]
            });
        } catch (error) {
            await sock.sendMessage(remoteJid, { text: `❌ Erro: ${error.message}` });
        }
    },

    async demote(ctx) {
        const { sock, msg, isAdmin, isBotAdmin, isGroup, mentions } = ctx;
        const remoteJid = msg.key.remoteJid;

        if (!isGroup) return await sock.sendMessage(remoteJid, { text: '❌ Apenas em grupos!' });
        if (!isAdmin) return await sock.sendMessage(remoteJid, { text: '❌ Apenas admins!' });
        if (!isBotAdmin) return await sock.sendMessage(remoteJid, { text: '❌ Preciso ser admin!' });

        const quoted = msg.message?.extendedTextMessage?.contextInfo?.participant;
        const userToDemote = mentions?.[0] || quoted;

        if (!userToDemote) {
            return await sock.sendMessage(remoteJid, { text: '❌ Marque alguém para rebaixar!' });
        }

        try {
            await sock.groupParticipantsUpdate(remoteJid, [userToDemote], 'demote');
            await sock.sendMessage(remoteJid, {
                text: `✅ @${userToDemote.split('@')[0]} não é mais admin!`,
                mentions: [userToDemote]
            });
        } catch (error) {
            await sock.sendMessage(remoteJid, { text: `❌ Erro: ${error.message}` });
        }
    },

    async mute(ctx) {
        const { sock, msg, isAdmin, isBotAdmin, isGroup } = ctx;
        const remoteJid = msg.key.remoteJid;

        if (!isGroup) return await sock.sendMessage(remoteJid, { text: '❌ Apenas em grupos!' });
        if (!isAdmin) return await sock.sendMessage(remoteJid, { text: '❌ Apenas admins!' });
        if (!isBotAdmin) return await sock.sendMessage(remoteJid, { text: '❌ Preciso ser admin!' });

        try {
            await sock.groupSettingUpdate(remoteJid, 'announcement');
            await sock.sendMessage(remoteJid, {
                text: `${HEADER}
╭━━━⪩ 🔇 *GRUPO MUTADO* ⪨━━━
│🇨🇦 Apenas admins podem falar
│🇨🇦 Use: ${settings.prefix}unmute
╰━━━━━─「🇨🇦」─━━━━━`
            });
        } catch (error) {
            await sock.sendMessage(remoteJid, { text: `❌ Erro: ${error.message}` });
        }
    },

    async unmute(ctx) {
        const { sock, msg, isAdmin, isBotAdmin, isGroup } = ctx;
        const remoteJid = msg.key.remoteJid;

        if (!isGroup) return await sock.sendMessage(remoteJid, { text: '❌ Apenas em grupos!' });
        if (!isAdmin) return await sock.sendMessage(remoteJid, { text: '❌ Apenas admins!' });
        if (!isBotAdmin) return await sock.sendMessage(remoteJid, { text: '❌ Preciso ser admin!' });

        try {
            await sock.groupSettingUpdate(remoteJid, 'not_announcement');
            await sock.sendMessage(remoteJid, {
                text: `${HEADER}
╭━━━⪩ 🔊 *GRUPO ABERTO* ⪨━━━
│🇨🇦 Todos podem falar!
╰━━━━━─「🇨🇦」─━━━━━`
            });
        } catch (error) {
            await sock.sendMessage(remoteJid, { text: `❌ Erro: ${error.message}` });
        }
    },

    async link(ctx) {
        const { sock, msg, isAdmin, isBotAdmin, isGroup } = ctx;
        const remoteJid = msg.key.remoteJid;

        if (!isGroup) return await sock.sendMessage(remoteJid, { text: '❌ Apenas em grupos!' });
        if (!isAdmin) return await sock.sendMessage(remoteJid, { text: '❌ Apenas admins!' });
        if (!isBotAdmin) return await sock.sendMessage(remoteJid, { text: '❌ Preciso ser admin!' });

        try {
            const code = await sock.groupInviteCode(remoteJid);
            await sock.sendMessage(remoteJid, {
                text: `${HEADER}
╭━━━⪩ 🔗 *LINK DO GRUPO* ⪨━━━
│🇨🇦 https://chat.whatsapp.com/${code}
╰━━━━━─「🇨🇦」─━━━━━`
            });
        } catch (error) {
            await sock.sendMessage(remoteJid, { text: `❌ Erro: ${error.message}` });
        }
    },

    async revoke(ctx) {
        const { sock, msg, isAdmin, isBotAdmin, isGroup } = ctx;
        const remoteJid = msg.key.remoteJid;

        if (!isGroup) return await sock.sendMessage(remoteJid, { text: '❌ Apenas em grupos!' });
        if (!isAdmin) return await sock.sendMessage(remoteJid, { text: '❌ Apenas admins!' });
        if (!isBotAdmin) return await sock.sendMessage(remoteJid, { text: '❌ Preciso ser admin!' });

        try {
            await sock.groupRevokeInvite(remoteJid);
            await sock.sendMessage(remoteJid, { text: `✅ Link do grupo revogado!` });
        } catch (error) {
            await sock.sendMessage(remoteJid, { text: `❌ Erro: ${error.message}` });
        }
    },

    async admins(ctx) {
        const { sock, msg, isGroup } = ctx;
        const remoteJid = msg.key.remoteJid;

        if (!isGroup) return await sock.sendMessage(remoteJid, { text: '❌ Apenas em grupos!' });

        try {
            const groupMetadata = await sock.groupMetadata(remoteJid);
            const admins = groupMetadata.participants.filter(p => p.admin);

            let lista = `${HEADER}
╭━━━⪩ 👑 *ADMINS* ⪨━━━
│🇨🇦 Grupo: *${groupMetadata.subject}*
│🇨🇦 Total: *${admins.length}*
╰━━━━━─「🇨🇦」─━━━━━\n`;

            const mentions = [];
            for (const admin of admins) {
                const tipo = admin.admin === 'superadmin' ? '👑' : '⭐';
                lista += `│${tipo} @${admin.id.split('@')[0]}\n`;
                mentions.push(admin.id);
            }

            lista += `╰━━━━━─「🇨🇦」─━━━━━`;

            await sock.sendMessage(remoteJid, { text: lista, mentions });

        } catch (error) {
            await sock.sendMessage(remoteJid, { text: `❌ Erro: ${error.message}` });
        }
    },

    async grupo(ctx) {
        const { sock, msg, isGroup } = ctx;
        const remoteJid = msg.key.remoteJid;

        if (!isGroup) return await sock.sendMessage(remoteJid, { text: '❌ Apenas em grupos!' });

        try {
            const groupMetadata = await sock.groupMetadata(remoteJid);
            const admins = groupMetadata.participants.filter(p => p.admin).length;
            const members = groupMetadata.participants.length;

            const resultado = `${HEADER}
╭━━━⪩ 📊 *INFO GRUPO* ⪨━━━
│🇨🇦 Nome: *${groupMetadata.subject}*
│🇨🇦 ID: *${remoteJid}*
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ 👥 *MEMBROS* ⪨━━━
│🇨🇦 Total: *${members}*
│🇨🇦 Admins: *${admins}*
│🇨🇦 Membros: *${members - admins}*
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ 📝 *DESCRICAO* ⪨━━━
│🇨🇦 ${groupMetadata.desc || 'Sem descrição'}
╰━━━━━─「🇨🇦」─━━━━━`;

            await sock.sendMessage(remoteJid, { text: resultado });

        } catch (error) {
            await sock.sendMessage(remoteJid, { text: `❌ Erro: ${error.message}` });
        }
    },

    async membros(ctx) {
        const { sock, msg, isGroup } = ctx;
        const remoteJid = msg.key.remoteJid;

        if (!isGroup) return await sock.sendMessage(remoteJid, { text: '❌ Apenas em grupos!' });

        try {
            const groupMetadata = await sock.groupMetadata(remoteJid);
            const members = groupMetadata.participants;

            await sock.sendMessage(remoteJid, {
                text: `${HEADER}
╭━━━⪩ 👥 *MEMBROS* ⪨━━━
│🇨🇦 Grupo: *${groupMetadata.subject}*
│🇨🇦 Total: *${members.length}*
╰━━━━━─「🇨🇦」─━━━━━`
            });

        } catch (error) {
            await sock.sendMessage(remoteJid, { text: `❌ Erro: ${error.message}` });
        }
    },

    async hidetag(ctx) {
        const { sock, msg, args, isAdmin, isGroup } = ctx;
        const remoteJid = msg.key.remoteJid;

        if (!isGroup) return await sock.sendMessage(remoteJid, { text: '❌ Apenas em grupos!' });
        if (!isAdmin) return await sock.sendMessage(remoteJid, { text: '❌ Apenas admins!' });

        const texto = args.join(' ') || 'Atenção!';

        try {
            const groupMetadata = await sock.groupMetadata(remoteJid);
            const mentions = groupMetadata.participants.map(p => p.id);

            await sock.sendMessage(remoteJid, {
                text: texto,
                mentions
            });

        } catch (error) {
            await sock.sendMessage(remoteJid, { text: `❌ Erro: ${error.message}` });
        }
    },

    async tagall(ctx) {
        const { sock, msg, args, isAdmin, isGroup } = ctx;
        const remoteJid = msg.key.remoteJid;

        if (!isGroup) return await sock.sendMessage(remoteJid, { text: '❌ Apenas em grupos!' });
        if (!isAdmin) return await sock.sendMessage(remoteJid, { text: '❌ Apenas admins!' });

        const texto = args.join(' ') || '📢 Atenção todos!';

        try {
            const groupMetadata = await sock.groupMetadata(remoteJid);
            const mentions = groupMetadata.participants.map(p => p.id);

            let lista = `${HEADER}
╭━━━⪩ 📢 *MARCANDO TODOS* ⪨━━━
│🇨🇦 ${texto}
╰━━━━━─「🇨🇦」─━━━━━\n`;

            for (const m of mentions) {
                lista += `│🇨🇦 @${m.split('@')[0]}\n`;
            }

            lista += `╰━━━━━─「🇨🇦」─━━━━━`;

            await sock.sendMessage(remoteJid, { text: lista, mentions });

        } catch (error) {
            await sock.sendMessage(remoteJid, { text: `❌ Erro: ${error.message}` });
        }
    },

    async menuguerra(ctx) {
        const { sock, msg } = ctx;
        const remoteJid = msg.key.remoteJid;
        const prefix = settings.prefix;

        const menu = `${HEADER}
╭━━━⪩ ⚔️ *GUERRA* ⪨━━━
│🇨🇦 ${prefix}nuke
│🇨🇦 ${prefix}destrava
│🇨🇦 ${prefix}banghost
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ 👤 *MEMBROS* ⪨━━━
│🇨🇦 ${prefix}ban @user
│🇨🇦 ${prefix}kick @user
│🇨🇦 ${prefix}add [numero]
│🇨🇦 ${prefix}promote @user
│🇨🇦 ${prefix}demote @user
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ ⚙️ *GRUPO* ⪨━━━
│🇨🇦 ${prefix}mute
│🇨🇦 ${prefix}unmute
│🇨🇦 ${prefix}link
│🇨🇦 ${prefix}revoke
│🇨🇦 ${prefix}grupo
│🇨🇦 ${prefix}admins
│🇨🇦 ${prefix}membros
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ 📢 *MARCAR* ⪨━━━
│🇨🇦 ${prefix}tagall [msg]
│🇨🇦 ${prefix}hidetag [msg]
╰━━━━━─「🇨🇦」─━━━━━`;

        await sock.sendMessage(remoteJid, { text: menu });
    }
};

module.exports = guerraCommands;
