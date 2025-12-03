const settings = require('../config/settings');
const messages = require('../config/messages');
const helpers = require('../utils/helpers');
const db = require('../storage/database');

const commands = {
    addadmin: async (ctx) => {
        const { sock, msg, isOwner, args } = ctx;
        
        if (!isOwner) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notOwner });
        
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        let target = mentioned[0];
        
        if (!target && args[0]) {
            target = helpers.formatNumber(args[0]);
        }
        
        if (!target) {
            return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.userNotFound });
        }
        
        const number = helpers.extractNumber(target);
        db.addBotAdmin(number);
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: messages.success.botAdminAdded.replace('{user}', `@${number}`),
            mentions: [target]
        });
    },
    
    rmadmin: async (ctx) => {
        const { sock, msg, isOwner, args } = ctx;
        
        if (!isOwner) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notOwner });
        
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        let target = mentioned[0];
        
        if (!target && args[0]) {
            target = helpers.formatNumber(args[0]);
        }
        
        if (!target) {
            return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.userNotFound });
        }
        
        const number = helpers.extractNumber(target);
        db.removeBotAdmin(number);
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: messages.success.botAdminRemoved.replace('{user}', `@${number}`),
            mentions: [target]
        });
    },
    
    listadmins: async (ctx) => {
        const { sock, msg, isOwner } = ctx;
        
        if (!isOwner) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notOwner });
        
        const admins = db.getBotAdmins();
        
        if (admins.length === 0) {
            return await sock.sendMessage(msg.key.remoteJid, {
                text: '👮 *ADMINS DO BOT*\n\nNenhum admin cadastrado.'
            });
        }
        
        let text = `👮 *ADMINS DO BOT*\n\n`;
        const mentions = [];
        
        admins.forEach((admin, i) => {
            const jid = admin + '@s.whatsapp.net';
            text += `${i + 1}. @${admin}\n`;
            mentions.push(jid);
        });
        
        text += `\n📊 Total: ${admins.length} admin(s)`;
        
        await sock.sendMessage(msg.key.remoteJid, { text, mentions });
    },
    
    bc: async (ctx) => {
        const { sock, msg, isOwner, args } = ctx;
        
        if (!isOwner) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notOwner });
        
        if (!args[0]) {
            return await sock.sendMessage(msg.key.remoteJid, {
                text: '❌ Informe a mensagem!\n\nExemplo: !bc Mensagem para todos'
            });
        }
        
        const message = args.join(' ');
        const groups = await sock.groupFetchAllParticipating();
        const groupIds = Object.keys(groups);
        
        let sent = 0;
        for (const groupId of groupIds) {
            try {
                await sock.sendMessage(groupId, {
                    text: `📢 *BROADCAST*\n\n${message}\n\n_- ${settings.ownerName}_`
                });
                sent++;
                await helpers.sleep(1000);
            } catch (error) {
                continue;
            }
        }
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: messages.success.broadcastSent.replace('{count}', sent)
        });
    },
    
    bcgroups: async (ctx) => {
        return await commands.bc(ctx);
    },
    
    nuke: async (ctx) => {
        const { sock, msg, isOwner, isGroup, groupId, isBotGroupAdmin, groupMetadata } = ctx;
        
        if (!isOwner) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notOwner });
        if (!isGroup) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notInGroup });
        if (!isBotGroupAdmin) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.botNotAdmin });
        
        await sock.sendMessage(msg.key.remoteJid, { text: messages.success.nukeStarted });
        
        const participants = groupMetadata.participants;
        const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
        const ownerJid = settings.ownerNumber + '@s.whatsapp.net';
        
        const toRemove = participants.filter(p => 
            p.id !== botId && 
            p.id !== ownerJid && 
            p.admin !== 'superadmin'
        );
        
        let removed = 0;
        for (const participant of toRemove) {
            try {
                await sock.groupParticipantsUpdate(groupId, [participant.id], 'remove');
                removed++;
                await helpers.sleep(500);
            } catch (error) {
                continue;
            }
        }
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: messages.success.nukeComplete.replace('{count}', removed)
        });
    },
    
    leave: async (ctx) => {
        const { sock, msg, isOwner, isGroup, groupId } = ctx;
        
        if (!isOwner) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notOwner });
        if (!isGroup) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notInGroup });
        
        await sock.sendMessage(msg.key.remoteJid, { text: '👋 Saindo do grupo...' });
        await sock.groupLeave(groupId);
    },
    
    stats: async (ctx) => {
        const { sock, msg, isOwner } = ctx;
        
        if (!isOwner) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notOwner });
        
        const stats = db.getStats();
        const uptime = helpers.formatUptime((Date.now() - stats.startTime) / 1000);
        const groups = await sock.groupFetchAllParticipating();
        const groupCount = Object.keys(groups).length;
        
        const memory = process.memoryUsage();
        const memoryUsed = helpers.formatBytes(memory.heapUsed);
        const memoryTotal = helpers.formatBytes(memory.heapTotal);
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: `📊 *ESTATÍSTICAS DO BOT*\n\n` +
                  `⏱️ Uptime: ${uptime}\n` +
                  `📨 Mensagens: ${stats.messagesReceived}\n` +
                  `🔧 Comandos: ${stats.commandsUsed}\n` +
                  `👥 Grupos: ${groupCount}\n\n` +
                  `💾 *MEMÓRIA*\n` +
                  `Usada: ${memoryUsed}\n` +
                  `Total: ${memoryTotal}\n\n` +
                  `🤖 Bot: ${settings.botName}\n` +
                  `📌 Versão: 2.0.0`
        });
    },
    
    grupos: async (ctx) => {
        const { sock, msg, isOwner } = ctx;
        
        if (!isOwner) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notOwner });
        
        const groups = await sock.groupFetchAllParticipating();
        const groupList = Object.values(groups);
        
        let text = `📋 *LISTA DE GRUPOS*\n\n`;
        
        groupList.forEach((group, i) => {
            text += `${i + 1}. ${group.subject}\n   👥 ${group.participants.length} membros\n\n`;
        });
        
        text += `📊 Total: ${groupList.length} grupo(s)`;
        
        await sock.sendMessage(msg.key.remoteJid, { text });
    },
    
    uptime: async (ctx) => {
        const { sock, msg, isOwner } = ctx;
        
        if (!isOwner) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notOwner });
        
        const stats = db.getStats();
        const uptime = helpers.formatUptime((Date.now() - stats.startTime) / 1000);
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: `⏱️ *UPTIME*\n\n` +
                  `O bot está online há: *${uptime}*`
        });
    },
    
    backup: async (ctx) => {
        const { sock, msg, isOwner } = ctx;
        
        if (!isOwner) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notOwner });
        
        const backupPath = db.backup();
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: `${messages.success.backupComplete}\n\n📁 Local: ${backupPath}`
        });
    },
    
    gban: async (ctx) => {
        const { sock, msg, isOwner, args } = ctx;
        
        if (!isOwner) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notOwner });
        
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        let target = mentioned[0];
        
        if (!target && args[0]) {
            target = helpers.formatNumber(args[0]);
        }
        
        if (!target) {
            return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.userNotFound });
        }
        
        const number = helpers.extractNumber(target);
        db.banUser(number);
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: `🚫 @${number} foi *BANIDO GLOBALMENTE*!\n\nEle não poderá mais usar o bot.`,
            mentions: [target]
        });
    },
    
    gunban: async (ctx) => {
        const { sock, msg, isOwner, args } = ctx;
        
        if (!isOwner) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notOwner });
        
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        let target = mentioned[0];
        
        if (!target && args[0]) {
            target = helpers.formatNumber(args[0]);
        }
        
        if (!target) {
            return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.userNotFound });
        }
        
        const number = helpers.extractNumber(target);
        db.unbanUser(number);
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: `✅ @${number} foi *DESBANIDO*!`,
            mentions: [target]
        });
    },
    
    listban: async (ctx) => {
        const { sock, msg, isOwner } = ctx;
        
        if (!isOwner) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notOwner });
        
        const banned = db.getBotAdmins();
        
        if (banned.length === 0) {
            return await sock.sendMessage(msg.key.remoteJid, {
                text: '🚫 *LISTA DE BANIDOS*\n\nNenhum usuário banido.'
            });
        }
        
        let text = `🚫 *LISTA DE BANIDOS*\n\n`;
        
        banned.forEach((user, i) => {
            text += `${i + 1}. ${user}\n`;
        });
        
        text += `\n📊 Total: ${banned.length} banido(s)`;
        
        await sock.sendMessage(msg.key.remoteJid, { text });
    },
    
    setprefix: async (ctx) => {
        const { sock, msg, isOwner, args } = ctx;
        
        if (!isOwner) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notOwner });
        
        if (!args[0]) {
            return await sock.sendMessage(msg.key.remoteJid, {
                text: '❌ Informe o novo prefixo!\n\nExemplo: !setprefix /'
            });
        }
        
        const newPrefix = args[0];
        db.setSetting('prefix', newPrefix);
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: `✅ Prefixo alterado para: *${newPrefix}*\n\n⚠️ Reinicie o bot para aplicar.`
        });
    },
    
    setowner: async (ctx) => {
        const { sock, msg, isOwner, args } = ctx;
        
        if (!isOwner) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notOwner });
        
        if (!args[0]) {
            return await sock.sendMessage(msg.key.remoteJid, {
                text: '❌ Informe o novo número do dono!\n\nExemplo: !setowner 5511999999999'
            });
        }
        
        const newOwner = helpers.cleanNumber(args[0]);
        db.setSetting('ownerNumber', newOwner);
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: `✅ Dono alterado para: *${newOwner}*\n\n⚠️ Reinicie o bot para aplicar.`
        });
    },
    
    setname: async (ctx) => {
        const { sock, msg, isOwner, args } = ctx;
        
        if (!isOwner) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notOwner });
        
        if (!args[0]) {
            return await sock.sendMessage(msg.key.remoteJid, {
                text: '❌ Informe o novo nome do bot!\n\nExemplo: !setname MeuBot'
            });
        }
        
        const newName = args.join(' ');
        db.setSetting('botName', newName);
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: `✅ Nome do bot alterado para: *${newName}*\n\n⚠️ Reinicie o bot para aplicar.`
        });
    },
    
    restart: async (ctx) => {
        const { sock, msg, isOwner } = ctx;
        
        if (!isOwner) return await sock.sendMessage(msg.key.remoteJid, { text: messages.errors.notOwner });
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: '🔄 Reiniciando o bot...'
        });
        
        process.exit(0);
    }
};

module.exports = commands;
