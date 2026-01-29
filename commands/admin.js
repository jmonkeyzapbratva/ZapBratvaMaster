const messages = require('../config/messages');
const helpers = require('../utils/helpers');
const db = require('../storage/database');

const HEADER = `╔♡━━━━━━━━━━━━━━━━━━━━━━♡╗
║  🇨🇦 *ALIANCA BRATVA* 🇨🇦  ║
╚♡━━━━━━━━━━━━━━━━━━━━━━♡╝`;

// Info sobre comandos de proteção
const commandInfos = {
    antilink: {
        name: 'ANTILINK',
        emoji: '🔗',
        desc: 'Bloqueia envio de links no grupo',
        effect: 'Quando ativado, qualquer membro que enviar um link será BANIDO automaticamente e terá sua mensagem apagada.',
        usage: '!antilink 1 (ativar) ou !antilink 0 (desativar)'
    },
    antilocf: {
        name: 'ANTI-LOCALIZAÇÃO',
        emoji: '📍',
        desc: 'Bloqueia envio de localização no grupo',
        effect: 'Quando ativado, qualquer membro que enviar localização será BANIDO automaticamente e terá sua mensagem apagada.',
        usage: '!antilocf 1 (ativar) ou !antilocf 0 (desativar)'
    },
    antipag: {
        name: 'ANTI-PAGAMENTO',
        emoji: '💳',
        desc: 'Bloqueia links de pagamento (Pix, PicPay, etc)',
        effect: 'Quando ativado, links de pagamento como Pix, PicPay, MercadoPago, PayPal serão bloqueados e a mensagem apagada.',
        usage: '!antipag 1 (ativar) ou !antipag 0 (desativar)'
    },
    antiflood: {
        name: 'ANTI-FLOOD',
        emoji: '🌊',
        desc: 'Bloqueia spam de mensagens rápidas',
        effect: 'Quando ativado, membros que enviarem muitas mensagens rapidamente serão avisados.',
        usage: '!antiflood 1 (ativar) ou !antiflood 0 (desativar)'
    },
    welcome: {
        name: 'BEM-VINDO',
        emoji: '👋',
        desc: 'Mensagem de boas-vindas para novos membros',
        effect: 'Quando ativado, envia uma mensagem automática quando alguém entra no grupo.',
        usage: '!welcome 1 (ativar) ou !welcome 0 (desativar)\n!setwelcome [mensagem] para personalizar'
    },
    d: {
        name: 'DELETAR',
        emoji: '🗑️',
        desc: 'Apaga mensagem selecionada',
        effect: 'Responda a uma mensagem e use o comando para apagá-la.',
        usage: '!d (respondendo a mensagem)'
    },
    band: {
        name: 'BAN + DELETE',
        emoji: '🚫',
        desc: 'Bane usuário e apaga mensagem',
        effect: 'Responda a uma mensagem, o bot apaga a mensagem e bane o usuário.',
        usage: '!band (respondendo a mensagem)'
    }
};

const commands = {
    // Comando info genérico
    infoantilink: async (ctx) => {
        const info = commandInfos.antilink;
        await ctx.sock.sendMessage(ctx.msg.key.remoteJid, {
            text: `${HEADER}
╭━━━⪩ ${info.emoji} *${info.name}* ⪨━━━
│🇨🇦 
│🇨🇦 *Descrição:*
│🇨🇦 ${info.desc}
│🇨🇦 
│🇨🇦 *Efeito:*
│🇨🇦 ${info.effect}
│🇨🇦 
│🇨🇦 *Uso:*
│🇨🇦 ${info.usage}
╰━━━━━─「🇨🇦」─━━━━━`
        });
    },

    infoantiloc: async (ctx) => {
        const info = commandInfos.antilocf;
        await ctx.sock.sendMessage(ctx.msg.key.remoteJid, {
            text: `${HEADER}
╭━━━⪩ ${info.emoji} *${info.name}* ⪨━━━
│🇨🇦 
│🇨🇦 *Descrição:*
│🇨🇦 ${info.desc}
│🇨🇦 
│🇨🇦 *Efeito:*
│🇨🇦 ${info.effect}
│🇨🇦 
│🇨🇦 *Uso:*
│🇨🇦 ${info.usage}
╰━━━━━─「🇨🇦」─━━━━━`
        });
    },

    infoantipag: async (ctx) => {
        const info = commandInfos.antipag;
        await ctx.sock.sendMessage(ctx.msg.key.remoteJid, {
            text: `${HEADER}
╭━━━⪩ ${info.emoji} *${info.name}* ⪨━━━
│🇨🇦 
│🇨🇦 *Descrição:*
│🇨🇦 ${info.desc}
│🇨🇦 
│🇨🇦 *Efeito:*
│🇨🇦 ${info.effect}
│🇨🇦 
│🇨🇦 *Uso:*
│🇨🇦 ${info.usage}
╰━━━━━─「🇨🇦」─━━━━━`
        });
    },

    infoantiflood: async (ctx) => {
        const info = commandInfos.antiflood;
        await ctx.sock.sendMessage(ctx.msg.key.remoteJid, {
            text: `${HEADER}
╭━━━⪩ ${info.emoji} *${info.name}* ⪨━━━
│🇨🇦 
│🇨🇦 *Descrição:*
│🇨🇦 ${info.desc}
│🇨🇦 
│🇨🇦 *Efeito:*
│🇨🇦 ${info.effect}
│🇨🇦 
│🇨🇦 *Uso:*
│🇨🇦 ${info.usage}
╰━━━━━─「🇨🇦」─━━━━━`
        });
    },

    infowelcome: async (ctx) => {
        const info = commandInfos.welcome;
        await ctx.sock.sendMessage(ctx.msg.key.remoteJid, {
            text: `${HEADER}
╭━━━⪩ ${info.emoji} *${info.name}* ⪨━━━
│🇨🇦 
│🇨🇦 *Descrição:*
│🇨🇦 ${info.desc}
│🇨🇦 
│🇨🇦 *Efeito:*
│🇨🇦 ${info.effect}
│🇨🇦 
│🇨🇦 *Uso:*
│🇨🇦 ${info.usage}
╰━━━━━─「🇨🇦」─━━━━━`
        });
    },

    infod: async (ctx) => {
        const info = commandInfos.d;
        await ctx.sock.sendMessage(ctx.msg.key.remoteJid, {
            text: `${HEADER}
╭━━━⪩ ${info.emoji} *${info.name}* ⪨━━━
│🇨🇦 
│🇨🇦 *Descrição:*
│🇨🇦 ${info.desc}
│🇨🇦 
│🇨🇦 *Efeito:*
│🇨🇦 ${info.effect}
│🇨🇦 
│🇨🇦 *Uso:*
│🇨🇦 ${info.usage}
╰━━━━━─「🇨🇦」─━━━━━`
        });
    },

    infoband: async (ctx) => {
        const info = commandInfos.band;
        await ctx.sock.sendMessage(ctx.msg.key.remoteJid, {
            text: `${HEADER}
╭━━━⪩ ${info.emoji} *${info.name}* ⪨━━━
│🇨🇦 
│🇨🇦 *Descrição:*
│🇨🇦 ${info.desc}
│🇨🇦 
│🇨🇦 *Efeito:*
│🇨🇦 ${info.effect}
│🇨🇦 
│🇨🇦 *Uso:*
│🇨🇦 ${info.usage}
╰━━━━━─「🇨🇦」─━━━━━`
        });
    },

    ban: async (ctx) => {
        const { sock, msg, isGroup, isGroupAdmin, isBotGroupAdmin, groupId, args } = ctx;
        
        if (!isGroup) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notInGroup });
        if (!isGroupAdmin) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notGroupAdmin });
        if (!isBotGroupAdmin) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.botNotAdmin });
        
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        let target = mentioned[0];
        
        if (!target && args[0]) {
            target = helpers.formatNumber(args[0]);
        }
        
        if (!target) {
            return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.userNotFound });
        }
        
        const number = helpers.extractNumber(target);
        
        try {
            await sock.groupParticipantsUpdate(groupId, [target], 'remove');
            await sock.sendMessage(msg.key.remoteJid, {
                text: messages.success.banned.replace('{user}', `@${number}`),
                mentions: [target]
            });
        } catch (error) {
            await sock.sendMessage(msg.key.remoteJid, {
                text: `❌ Não foi possível banir @${number}`,
                mentions: [target]
            });
        }
    },
    
    kick: async (ctx) => {
        const { sock, msg, isGroup, isGroupAdmin, isBotGroupAdmin, groupId, args } = ctx;
        
        if (!isGroup) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notInGroup });
        if (!isGroupAdmin) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notGroupAdmin });
        if (!isBotGroupAdmin) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.botNotAdmin });
        
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        let target = mentioned[0];
        
        if (!target && args[0]) {
            target = helpers.formatNumber(args[0]);
        }
        
        if (!target) {
            return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.userNotFound });
        }
        
        const number = helpers.extractNumber(target);
        
        try {
            await sock.groupParticipantsUpdate(groupId, [target], 'remove');
            await sock.sendMessage(msg.key.remoteJid, {
                text: messages.success.kicked.replace('{user}', `@${number}`),
                mentions: [target]
            });
        } catch (error) {
            await sock.sendMessage(msg.key.remoteJid, {
                text: `❌ Não foi possível remover @${number}`,
                mentions: [target]
            });
        }
    },
    
    add: async (ctx) => {
        const { sock, msg, isGroup, isGroupAdmin, isBotGroupAdmin, groupId, args } = ctx;
        
        if (!isGroup) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notInGroup });
        if (!isGroupAdmin) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notGroupAdmin });
        if (!isBotGroupAdmin) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.botNotAdmin });
        
        if (!args[0]) {
            return await sock.sendMessage(msg.key.remoteJid, {
                text: '❌ Informe o número!\n\nExemplo: !add 5511999999999'
            });
        }
        
        const target = helpers.formatNumber(args[0]);
        const number = helpers.extractNumber(target);
        
        try {
            await sock.groupParticipantsUpdate(groupId, [target], 'add');
            await sock.sendMessage(msg.key.remoteJid, {
                text: `✅ @${number} foi adicionado ao grupo!`,
                mentions: [target]
            });
        } catch (error) {
            await sock.sendMessage(msg.key.remoteJid, {
                text: `❌ Não foi possível adicionar @${number}. Verifique se o número está correto e se a pessoa permite ser adicionada.`,
                mentions: [target]
            });
        }
    },
    
    promote: async (ctx) => {
        const { sock, msg, isGroup, isGroupAdmin, isBotGroupAdmin, groupId } = ctx;
        
        if (!isGroup) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notInGroup });
        if (!isGroupAdmin) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notGroupAdmin });
        if (!isBotGroupAdmin) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.botNotAdmin });
        
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        const target = mentioned[0];
        
        if (!target) {
            return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.userNotFound });
        }
        
        const number = helpers.extractNumber(target);
        
        try {
            await sock.groupParticipantsUpdate(groupId, [target], 'promote');
            await sock.sendMessage(msg.key.remoteJid, {
                text: messages.success.promoted.replace('{user}', `@${number}`),
                mentions: [target]
            });
        } catch (error) {
            await sock.sendMessage(msg.key.remoteJid, {
                text: `❌ Não foi possível promover @${number}`,
                mentions: [target]
            });
        }
    },
    
    demote: async (ctx) => {
        const { sock, msg, isGroup, isGroupAdmin, isBotGroupAdmin, groupId } = ctx;
        
        if (!isGroup) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notInGroup });
        if (!isGroupAdmin) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notGroupAdmin });
        if (!isBotGroupAdmin) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.botNotAdmin });
        
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        const target = mentioned[0];
        
        if (!target) {
            return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.userNotFound });
        }
        
        const number = helpers.extractNumber(target);
        
        try {
            await sock.groupParticipantsUpdate(groupId, [target], 'demote');
            await sock.sendMessage(msg.key.remoteJid, {
                text: messages.success.demoted.replace('{user}', `@${number}`),
                mentions: [target]
            });
        } catch (error) {
            await sock.sendMessage(msg.key.remoteJid, {
                text: `❌ Não foi possível rebaixar @${number}`,
                mentions: [target]
            });
        }
    },
    
    mute: async (ctx) => {
        const { sock, msg, isGroup, isGroupAdmin, isBotGroupAdmin, groupId } = ctx;
        
        if (!isGroup) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notInGroup });
        if (!isGroupAdmin) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notGroupAdmin });
        if (!isBotGroupAdmin) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.botNotAdmin });
        
        try {
            await sock.groupSettingUpdate(groupId, 'announcement');
            db.setGroup(groupId, 'muted', true);
            await sock.sendMessage(msg.key.remoteJid, { text: messages.success.muted });
        } catch (error) {
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ Erro ao silenciar o grupo!' });
        }
    },
    
    unmute: async (ctx) => {
        const { sock, msg, isGroup, isGroupAdmin, isBotGroupAdmin, groupId } = ctx;
        
        if (!isGroup) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notInGroup });
        if (!isGroupAdmin) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notGroupAdmin });
        if (!isBotGroupAdmin) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.botNotAdmin });
        
        try {
            await sock.groupSettingUpdate(groupId, 'not_announcement');
            db.setGroup(groupId, 'muted', false);
            await sock.sendMessage(msg.key.remoteJid, { text: messages.success.unmuted });
        } catch (error) {
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ Erro ao abrir o grupo!' });
        }
    },
    
    link: async (ctx) => {
        const { sock, msg, isGroup, isGroupAdmin, isBotGroupAdmin, groupId } = ctx;
        
        if (!isGroup) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notInGroup });
        if (!isGroupAdmin) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notGroupAdmin });
        if (!isBotGroupAdmin) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.botNotAdmin });
        
        try {
            const code = await sock.groupInviteCode(groupId);
            await sock.sendMessage(msg.key.remoteJid, {
                text: `🔗 *LINK DO GRUPO*\n\nhttps://chat.whatsapp.com/${code}`
            });
        } catch (error) {
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ Erro ao obter link do grupo!' });
        }
    },
    
    revoke: async (ctx) => {
        const { sock, msg, isGroup, isGroupAdmin, isBotGroupAdmin, groupId } = ctx;
        
        if (!isGroup) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notInGroup });
        if (!isGroupAdmin) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notGroupAdmin });
        if (!isBotGroupAdmin) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.botNotAdmin });
        
        try {
            await sock.groupRevokeInvite(groupId);
            await sock.sendMessage(msg.key.remoteJid, { text: '✅ Link do grupo resetado!' });
        } catch (error) {
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ Erro ao resetar link!' });
        }
    },
    
    rename: async (ctx) => {
        const { sock, msg, isGroup, isGroupAdmin, isBotGroupAdmin, groupId, args } = ctx;
        
        if (!isGroup) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notInGroup });
        if (!isGroupAdmin) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notGroupAdmin });
        if (!isBotGroupAdmin) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.botNotAdmin });
        
        if (!args[0]) {
            return await sock.sendMessage(msg.key.remoteJid, {
                text: '❌ Informe o novo nome!\n\nExemplo: !rename Novo Nome do Grupo'
            });
        }
        
        const newName = args.join(' ');
        
        try {
            await sock.groupUpdateSubject(groupId, newName);
            await sock.sendMessage(msg.key.remoteJid, {
                text: `✅ Nome do grupo alterado para: *${newName}*`
            });
        } catch (error) {
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ Erro ao renomear grupo!' });
        }
    },
    
    desc: async (ctx) => {
        const { sock, msg, isGroup, isGroupAdmin, isBotGroupAdmin, groupId, args } = ctx;
        
        if (!isGroup) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notInGroup });
        if (!isGroupAdmin) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notGroupAdmin });
        if (!isBotGroupAdmin) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.botNotAdmin });
        
        if (!args[0]) {
            return await sock.sendMessage(msg.key.remoteJid, {
                text: '❌ Informe a nova descrição!\n\nExemplo: !desc Nova descrição do grupo'
            });
        }
        
        const newDesc = args.join(' ');
        
        try {
            await sock.groupUpdateDescription(groupId, newDesc);
            await sock.sendMessage(msg.key.remoteJid, {
                text: `✅ Descrição do grupo atualizada!`
            });
        } catch (error) {
            await sock.sendMessage(msg.key.remoteJid, { text: '❌ Erro ao atualizar descrição!' });
        }
    },
    
    antilink: async (ctx) => {
        const { sock, msg, isGroup, isGroupAdmin, groupId, args } = ctx;
        
        if (!isGroup) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notInGroup });
        if (!isGroupAdmin) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notGroupAdmin });
        
        // Aceita 1/0 ou toggle
        let newValue;
        if (args[0] === '1') {
            newValue = true;
        } else if (args[0] === '0') {
            newValue = false;
        } else {
            newValue = !db.getGroup(groupId).antiLink;
        }
        
        db.setGroup(groupId, 'antiLink', newValue);
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: newValue 
                ? '🔗 *ANTILINK* ativado!\n\n⚠️ Quem mandar link será *BANIDO* e terá a mensagem apagada!'
                : '🔗 *ANTILINK* desativado!'
        });
    },

    antilocf: async (ctx) => {
        const { sock, msg, isGroup, isGroupAdmin, groupId, args } = ctx;
        
        if (!isGroup) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notInGroup });
        if (!isGroupAdmin) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notGroupAdmin });
        
        let newValue;
        if (args[0] === '1') {
            newValue = true;
        } else if (args[0] === '0') {
            newValue = false;
        } else {
            newValue = !db.getGroup(groupId).antiLocf;
        }
        
        db.setGroup(groupId, 'antiLocf', newValue);
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: newValue 
                ? '📍 *ANTI-LOCALIZAÇÃO* ativado!\n\n⚠️ Quem mandar localização será *BANIDO*!'
                : '📍 *ANTI-LOCALIZAÇÃO* desativado!'
        });
    },

    antipag: async (ctx) => {
        const { sock, msg, isGroup, isGroupAdmin, groupId, args } = ctx;
        
        if (!isGroup) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notInGroup });
        if (!isGroupAdmin) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notGroupAdmin });
        
        let newValue;
        if (args[0] === '1') {
            newValue = true;
        } else if (args[0] === '0') {
            newValue = false;
        } else {
            newValue = !db.getGroup(groupId).antiPag;
        }
        
        db.setGroup(groupId, 'antiPag', newValue);
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: newValue 
                ? '💳 *ANTI-PAGAMENTO* ativado!\n\n⚠️ Links de pagamento (Pix, PicPay, etc) serão bloqueados!'
                : '💳 *ANTI-PAGAMENTO* desativado!'
        });
    },

    // Comando para deletar mensagem respondida
    d: async (ctx) => {
        const { sock, msg, isGroup, isGroupAdmin, isBotGroupAdmin } = ctx;
        
        if (!isGroup) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notInGroup });
        if (!isGroupAdmin) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notGroupAdmin });
        if (!isBotGroupAdmin) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.botNotAdmin });
        
        const quotedMsg = msg.message?.extendedTextMessage?.contextInfo;
        if (!quotedMsg?.stanzaId) {
            return await sock.sendMessage(msg.key.remoteJid, {
                text: '❌ Responda a mensagem que deseja apagar!'
            });
        }
        
        try {
            await sock.sendMessage(msg.key.remoteJid, {
                delete: {
                    remoteJid: msg.key.remoteJid,
                    fromMe: false,
                    id: quotedMsg.stanzaId,
                    participant: quotedMsg.participant
                }
            });
        } catch (error) {
            await sock.sendMessage(msg.key.remoteJid, {
                text: '❌ Não foi possível apagar a mensagem!'
            });
        }
    },

    // Comando para deletar mensagem e banir usuário
    band: async (ctx) => {
        const { sock, msg, isGroup, isGroupAdmin, isBotGroupAdmin, groupId } = ctx;
        
        if (!isGroup) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notInGroup });
        if (!isGroupAdmin) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notGroupAdmin });
        if (!isBotGroupAdmin) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.botNotAdmin });
        
        const quotedMsg = msg.message?.extendedTextMessage?.contextInfo;
        if (!quotedMsg?.stanzaId || !quotedMsg?.participant) {
            return await sock.sendMessage(msg.key.remoteJid, {
                text: '❌ Responda a mensagem da pessoa que deseja banir!'
            });
        }
        
        const target = quotedMsg.participant;
        const number = helpers.extractNumber(target);
        
        try {
            // Apaga a mensagem
            await sock.sendMessage(msg.key.remoteJid, {
                delete: {
                    remoteJid: msg.key.remoteJid,
                    fromMe: false,
                    id: quotedMsg.stanzaId,
                    participant: target
                }
            });
            
            // Bane o usuário
            await sock.groupParticipantsUpdate(groupId, [target], 'remove');
            
            await sock.sendMessage(msg.key.remoteJid, {
                text: `🚫 @${number} foi banido e teve sua mensagem apagada!`,
                mentions: [target]
            });
        } catch (error) {
            await sock.sendMessage(msg.key.remoteJid, {
                text: `❌ Erro ao banir @${number}`,
                mentions: [target]
            });
        }
    },
    
    antiflood: async (ctx) => {
        const { sock, msg, isGroup, isGroupAdmin, groupId } = ctx;
        
        if (!isGroup) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notInGroup });
        if (!isGroupAdmin) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notGroupAdmin });
        
        const current = db.getGroup(groupId).antiFlood;
        const newValue = !current;
        db.setGroup(groupId, 'antiFlood', newValue);
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: newValue ? messages.success.antiFloodOn : messages.success.antiFloodOff
        });
    },
    
    antibadwords: async (ctx) => {
        const { sock, msg, isGroup, isGroupAdmin, groupId } = ctx;
        
        if (!isGroup) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notInGroup });
        if (!isGroupAdmin) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notGroupAdmin });
        
        const current = db.getGroup(groupId).antiBadWords;
        const newValue = !current;
        db.setGroup(groupId, 'antiBadWords', newValue);
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: newValue ? '🚫 *Anti-palavrões* ATIVADO!' : '🚫 *Anti-palavrões* DESATIVADO!'
        });
    },
    
    welcome: async (ctx) => {
        const { sock, msg, isGroup, isGroupAdmin, groupId, args } = ctx;
        
        if (!isGroup) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notInGroup });
        if (!isGroupAdmin) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notGroupAdmin });
        
        if (args[0] === 'on' || args[0] === 'off') {
            const newValue = args[0] === 'on';
            db.setGroup(groupId, 'welcome', newValue);
            await sock.sendMessage(msg.key.remoteJid, {
                text: `✅ Mensagem de boas-vindas ${newValue ? 'ATIVADA' : 'DESATIVADA'}!`
            });
        } else {
            const current = db.getGroup(groupId).welcome;
            await sock.sendMessage(msg.key.remoteJid, {
                text: `👋 *BEM-VINDO*\n\nStatus: ${current ? 'ATIVADO' : 'DESATIVADO'}\n\nUse: !welcome on/off`
            });
        }
    },
    
    goodbye: async (ctx) => {
        const { sock, msg, isGroup, isGroupAdmin, groupId, args } = ctx;
        
        if (!isGroup) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notInGroup });
        if (!isGroupAdmin) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notGroupAdmin });
        
        if (args[0] === 'on' || args[0] === 'off') {
            const newValue = args[0] === 'on';
            db.setGroup(groupId, 'goodbye', newValue);
            await sock.sendMessage(msg.key.remoteJid, {
                text: `✅ Mensagem de despedida ${newValue ? 'ATIVADA' : 'DESATIVADA'}!`
            });
        } else {
            const current = db.getGroup(groupId).goodbye;
            await sock.sendMessage(msg.key.remoteJid, {
                text: `👋 *DESPEDIDA*\n\nStatus: ${current ? 'ATIVADO' : 'DESATIVADO'}\n\nUse: !goodbye on/off`
            });
        }
    },
    
    setwelcome: async (ctx) => {
        const { sock, msg, isGroup, isGroupAdmin, groupId, args } = ctx;
        
        if (!isGroup) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notInGroup });
        if (!isGroupAdmin) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notGroupAdmin });
        
        if (!args[0]) {
            return await sock.sendMessage(msg.key.remoteJid, {
                text: '❌ Informe a mensagem de boas-vindas!\n\nUse {user} para mencionar o usuário\nUse {group} para o nome do grupo\n\nExemplo: !setwelcome Olá {user}, bem-vindo ao {group}!'
            });
        }
        
        const welcomeMsg = args.join(' ');
        db.setGroup(groupId, 'welcomeMsg', welcomeMsg);
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: `✅ Mensagem de boas-vindas atualizada!\n\n*Preview:*\n${welcomeMsg.replace('{user}', '@exemplo').replace('{group}', 'Nome do Grupo')}`
        });
    },
    
    setgoodbye: async (ctx) => {
        const { sock, msg, isGroup, isGroupAdmin, groupId, args } = ctx;
        
        if (!isGroup) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notInGroup });
        if (!isGroupAdmin) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notGroupAdmin });
        
        if (!args[0]) {
            return await sock.sendMessage(msg.key.remoteJid, {
                text: '❌ Informe a mensagem de despedida!\n\nUse {user} para mencionar o usuário\n\nExemplo: !setgoodbye {user} saiu do grupo. Até mais!'
            });
        }
        
        const goodbyeMsg = args.join(' ');
        db.setGroup(groupId, 'goodbyeMsg', goodbyeMsg);
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: `✅ Mensagem de despedida atualizada!\n\n*Preview:*\n${goodbyeMsg.replace('{user}', '@exemplo')}`
        });
    },
    
    admins: async (ctx) => {
        const { sock, msg, isGroup, groupMetadata } = ctx;
        
        if (!isGroup) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notInGroup });
        
        const admins = groupMetadata.participants.filter(p => p.admin);
        let text = `👮 *ADMINS DO GRUPO*\n\n`;
        
        const mentions = [];
        admins.forEach((admin, i) => {
            const number = helpers.extractNumber(admin.id);
            const role = admin.admin === 'superadmin' ? '👑 Dono' : '⭐ Admin';
            text += `${i + 1}. @${number} (${role})\n`;
            mentions.push(admin.id);
        });
        
        text += `\n📊 Total: ${admins.length} admin(s)`;
        
        await sock.sendMessage(msg.key.remoteJid, { text, mentions });
    },
    
    membros: async (ctx) => {
        const { sock, msg, isGroup, groupMetadata } = ctx;
        
        if (!isGroup) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notInGroup });
        
        const total = groupMetadata.participants.length;
        const admins = groupMetadata.participants.filter(p => p.admin).length;
        const members = total - admins;
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: `📊 *MEMBROS DO GRUPO*\n\n` +
                  `👥 Total: ${total}\n` +
                  `👮 Admins: ${admins}\n` +
                  `👤 Membros: ${members}`
        });
    },
    
    grupo: async (ctx) => {
        const { sock, msg, isGroup, groupId, groupMetadata } = ctx;
        
        if (!isGroup) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notInGroup });
        
        const groupSettings = db.getGroup(groupId);
        const owner = groupMetadata.owner || 'Desconhecido';
        const created = groupMetadata.creation ? new Date(groupMetadata.creation * 1000).toLocaleString('pt-BR') : 'Desconhecido';
        
        const infoText = `
📋 *INFORMAÇÕES DO GRUPO*

📛 Nome: ${groupMetadata.subject}
📝 Descrição: ${groupMetadata.desc || 'Sem descrição'}
👑 Criador: @${helpers.extractNumber(owner)}
📅 Criado em: ${created}
👥 Membros: ${groupMetadata.participants.length}

⚙️ *CONFIGURAÇÕES*
🔗 Anti-link: ${groupSettings.antiLink ? '✅' : '❌'}
🌊 Anti-flood: ${groupSettings.antiFlood ? '✅' : '❌'}
🚫 Anti-palavrões: ${groupSettings.antiBadWords ? '✅' : '❌'}
👋 Boas-vindas: ${groupSettings.welcome ? '✅' : '❌'}
👋 Despedida: ${groupSettings.goodbye ? '✅' : '❌'}
        `.trim();
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: infoText,
            mentions: [owner]
        });
    }
};

module.exports = commands;
