const settings = require('../config/settings');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');

const HEADER = `╔♡━━━━━━━━━━━━━━━━━━━━━━♡╗
║  🇨🇦 *ALIANCA BRATVA* 🇨🇦  ║
╚♡━━━━━━━━━━━━━━━━━━━━━━♡╝`;

const stickerCommands = {

    async sticker(ctx) {
        const { sock, msg, args } = ctx;
        const remoteJid = msg.key.remoteJid;

        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const messageType = Object.keys(msg.message || {})[0];
        
        let mediaMessage = null;
        let mediaType = null;

        if (quoted) {
            if (quoted.imageMessage) {
                mediaMessage = { message: { imageMessage: quoted.imageMessage } };
                mediaType = 'image';
            } else if (quoted.videoMessage) {
                mediaMessage = { message: { videoMessage: quoted.videoMessage } };
                mediaType = 'video';
            }
        } else if (messageType === 'imageMessage') {
            mediaMessage = msg;
            mediaType = 'image';
        } else if (messageType === 'videoMessage') {
            mediaMessage = msg;
            mediaType = 'video';
        }

        if (!mediaMessage) {
            return await sock.sendMessage(remoteJid, {
                text: `❌ Envie ou responda uma imagem/vídeo!\n\n*Uso:* ${settings.prefix}sticker [nome] [autor]\n\nOu responda uma imagem com ${settings.prefix}s`
            });
        }

        try {
            await sock.sendMessage(remoteJid, { text: '⏳ Criando sticker...' });

            const buffer = await downloadMediaMessage(mediaMessage, 'buffer', {});

            const packName = args[0] || 'BRATVA';
            const author = args[1] || '🇨🇦';

            await sock.sendMessage(remoteJid, {
                sticker: buffer,
                mimetype: 'image/webp',
                isAnimated: mediaType === 'video'
            }, {
                quoted: msg
            });

        } catch (error) {
            console.error('[STICKER] Erro:', error.message);
            await sock.sendMessage(remoteJid, {
                text: `❌ Erro ao criar sticker: ${error.message}`
            });
        }
    },

    async s(ctx) {
        return await stickerCommands.sticker(ctx);
    },

    async fig(ctx) {
        return await stickerCommands.sticker(ctx);
    },

    async figurinha(ctx) {
        return await stickerCommands.sticker(ctx);
    },

    async toimg(ctx) {
        const { sock, msg } = ctx;
        const remoteJid = msg.key.remoteJid;

        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

        if (!quoted?.stickerMessage) {
            return await sock.sendMessage(remoteJid, {
                text: `❌ Responda um sticker!\n\n*Uso:* Responda um sticker com ${settings.prefix}toimg`
            });
        }

        try {
            const buffer = await downloadMediaMessage(
                { message: { stickerMessage: quoted.stickerMessage } },
                'buffer',
                {}
            );

            await sock.sendMessage(remoteJid, {
                image: buffer,
                caption: `${HEADER}
╭━━━⪩ 🖼️ *STICKER → IMAGEM* ⪨━━━
│🇨🇦 Convertido com sucesso!
╰━━━━━─「🇨🇦」─━━━━━`
            });

        } catch (error) {
            console.error('[STICKER] Erro toimg:', error.message);
            await sock.sendMessage(remoteJid, {
                text: `❌ Erro ao converter sticker.`
            });
        }
    },

    async emojimix(ctx) {
        const { sock, msg, args } = ctx;
        const remoteJid = msg.key.remoteJid;

        if (!args[0] || !args[1]) {
            return await sock.sendMessage(remoteJid, {
                text: `❌ Informe dois emojis!\n\n*Uso:* ${settings.prefix}emojimix 😀 😎`
            });
        }

        try {
            const emoji1 = args[0];
            const emoji2 = args[1];

            const codePoints1 = [...emoji1].map(e => e.codePointAt(0).toString(16)).join('-');
            const codePoints2 = [...emoji2].map(e => e.codePointAt(0).toString(16)).join('-');

            const url = `https://www.gstatic.com/android/keyboard/emojikitchen/20210831/u${codePoints1}/u${codePoints1}_u${codePoints2}.png`;

            await sock.sendMessage(remoteJid, {
                sticker: { url },
                mimetype: 'image/webp'
            });

        } catch (error) {
            await sock.sendMessage(remoteJid, {
                text: `❌ Não foi possível misturar esses emojis.`
            });
        }
    },

    async attp(ctx) {
        const { sock, msg, args } = ctx;
        const remoteJid = msg.key.remoteJid;

        if (!args[0]) {
            return await sock.sendMessage(remoteJid, {
                text: `❌ Informe o texto!\n\n*Uso:* ${settings.prefix}attp texto aqui`
            });
        }

        const texto = args.join(' ');

        await sock.sendMessage(remoteJid, {
            text: `${HEADER}
╭━━━⪩ ✨ *ATTP* ⪨━━━
│🇨🇦 *${texto}*
│🇨🇦 
│🇨🇦 ⚠️ Sticker de texto
│🇨🇦 temporariamente indisponível.
╰━━━━━─「🇨🇦」─━━━━━`
        });
    },

    async ttp(ctx) {
        const { sock, msg, args } = ctx;
        const remoteJid = msg.key.remoteJid;

        if (!args[0]) {
            return await sock.sendMessage(remoteJid, {
                text: `❌ Informe o texto!\n\n*Uso:* ${settings.prefix}ttp texto aqui`
            });
        }

        const texto = args.join(' ');

        await sock.sendMessage(remoteJid, {
            text: `${HEADER}
╭━━━⪩ 📝 *TTP* ⪨━━━
│🇨🇦 *${texto}*
│🇨🇦 
│🇨🇦 ⚠️ Sticker de texto
│🇨🇦 temporariamente indisponível.
╰━━━━━─「🇨🇦」─━━━━━`
        });
    },

    async renomear(ctx) {
        const { sock, msg, args } = ctx;
        const remoteJid = msg.key.remoteJid;

        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

        if (!quoted?.stickerMessage) {
            return await sock.sendMessage(remoteJid, {
                text: `❌ Responda um sticker!\n\n*Uso:* ${settings.prefix}renomear [pack] [autor]`
            });
        }

        const packName = args[0] || 'BRATVA';
        const author = args[1] || '🇨🇦';

        try {
            const buffer = await downloadMediaMessage(
                { message: { stickerMessage: quoted.stickerMessage } },
                'buffer',
                {}
            );

            await sock.sendMessage(remoteJid, {
                sticker: buffer,
                mimetype: 'image/webp'
            });

            await sock.sendMessage(remoteJid, {
                text: `✅ Sticker renomeado!\n\n*Pack:* ${packName}\n*Autor:* ${author}`
            });

        } catch (error) {
            await sock.sendMessage(remoteJid, {
                text: `❌ Erro ao renomear sticker.`
            });
        }
    },

    async menustickers(ctx) {
        const { sock, msg } = ctx;
        const remoteJid = msg.key.remoteJid;
        const prefix = settings.prefix;

        const menu = `${HEADER}
╭━━━⪩ 🎨 *CRIAR* ⪨━━━
│🇨🇦 ${prefix}sticker
│🇨🇦 ${prefix}s (atalho)
│🇨🇦 ${prefix}fig (atalho)
│🇨🇦 ${prefix}figurinha
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ 🔄 *CONVERTER* ⪨━━━
│🇨🇦 ${prefix}toimg
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ ✏️ *TEXTO* ⪨━━━
│🇨🇦 ${prefix}ttp [texto]
│🇨🇦 ${prefix}attp [texto]
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ 🎭 *OUTROS* ⪨━━━
│🇨🇦 ${prefix}emojimix [e1] [e2]
│🇨🇦 ${prefix}renomear [pack] [autor]
╰━━━━━─「🇨🇦」─━━━━━

💡 Envie ou responda uma
imagem/vídeo com ${prefix}s`;

        await sock.sendMessage(remoteJid, { text: menu });
    }
};

module.exports = stickerCommands;
