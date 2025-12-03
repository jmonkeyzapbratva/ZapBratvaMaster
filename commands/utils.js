const axios = require('axios');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const helpers = require('../utils/helpers');

const commands = {
    sticker: async (ctx) => {
        const { sock, msg } = ctx;
        
        const quotedMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const isImage = msg.message?.imageMessage || quotedMsg?.imageMessage;
        const isVideo = msg.message?.videoMessage || quotedMsg?.videoMessage;
        
        if (!isImage && !isVideo) {
            return await sock.sendMessage(msg.key.remoteJid, {
                text: '❌ Envie ou responda uma imagem/vídeo com o comando !sticker\n\n💡 *Dica:* Envie uma imagem com a legenda !sticker'
            });
        }
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: '⏳ Criando sticker...'
        });
        
        try {
            let mediaMsg;
            if (quotedMsg?.imageMessage) {
                mediaMsg = { message: { imageMessage: quotedMsg.imageMessage }, key: msg.key };
            } else if (quotedMsg?.videoMessage) {
                mediaMsg = { message: { videoMessage: quotedMsg.videoMessage }, key: msg.key };
            } else {
                mediaMsg = msg;
            }
            
            const media = await downloadMediaMessage(mediaMsg, 'buffer', {});
            
            await sock.sendMessage(msg.key.remoteJid, {
                sticker: media
            }, { quoted: msg });
            
        } catch (error) {
            console.error('Erro sticker:', error.message);
            await sock.sendMessage(msg.key.remoteJid, {
                text: '❌ Erro ao criar sticker!\n\n💡 *Possíveis causas:*\n• Arquivo muito grande\n• Formato não suportado\n• Vídeo muito longo (máx. 10s)'
            });
        }
    },
    
    toimg: async (ctx) => {
        const { sock, msg } = ctx;
        
        const quotedMsg = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const isSticker = quotedMsg?.stickerMessage;
        
        if (!isSticker) {
            return await sock.sendMessage(msg.key.remoteJid, {
                text: '❌ Responda um sticker com o comando !toimg\n\n💡 *Dica:* Responda (reply) um sticker existente'
            });
        }
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: '⏳ Convertendo sticker...'
        });
        
        try {
            const stickerMsg = { 
                message: { stickerMessage: quotedMsg.stickerMessage },
                key: msg.key
            };
            
            const media = await downloadMediaMessage(stickerMsg, 'buffer', {});
            
            await sock.sendMessage(msg.key.remoteJid, {
                image: media,
                caption: '🖼️ Sticker convertido para imagem!'
            }, { quoted: msg });
            
        } catch (error) {
            console.error('Erro toimg:', error.message);
            await sock.sendMessage(msg.key.remoteJid, {
                text: '❌ Erro ao converter sticker!\n\n💡 Stickers animados podem não ser convertidos.'
            });
        }
    },
    
    play: async (ctx) => {
        const { sock, msg, args } = ctx;
        
        if (!args[0]) {
            return await sock.sendMessage(msg.key.remoteJid, {
                text: '❌ Informe o nome da música!\n\nExemplo: !play Despacito'
            });
        }
        
        const query = args.join(' ');
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: `🎵 *DOWNLOAD DE MÚSICA*\n\n` +
                  `🔍 Buscando: ${query}\n\n` +
                  `⚠️ Esta funcionalidade requer integração com API externa.\n` +
                  `Configure uma API de música para habilitar este recurso.`
        });
    },
    
    video: async (ctx) => {
        const { sock, msg, args } = ctx;
        
        if (!args[0]) {
            return await sock.sendMessage(msg.key.remoteJid, {
                text: '❌ Informe o nome do vídeo!\n\nExemplo: !video Tutorial React'
            });
        }
        
        const query = args.join(' ');
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: `🎬 *DOWNLOAD DE VÍDEO*\n\n` +
                  `🔍 Buscando: ${query}\n\n` +
                  `⚠️ Esta funcionalidade requer integração com API externa.\n` +
                  `Configure uma API de vídeo para habilitar este recurso.`
        });
    },
    
    google: async (ctx) => {
        const { sock, msg, args } = ctx;
        
        if (!args[0]) {
            return await sock.sendMessage(msg.key.remoteJid, {
                text: '❌ Informe o que deseja pesquisar!\n\nExemplo: !google Como fazer bolo'
            });
        }
        
        const query = encodeURIComponent(args.join(' '));
        const url = `https://www.google.com/search?q=${query}`;
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: `🔍 *PESQUISA GOOGLE*\n\n` +
                  `📝 Pesquisa: ${args.join(' ')}\n\n` +
                  `🔗 Link: ${url}`
        });
    },
    
    img: async (ctx) => {
        const { sock, msg, args } = ctx;
        
        if (!args[0]) {
            return await sock.sendMessage(msg.key.remoteJid, {
                text: '❌ Informe o que deseja buscar!\n\nExemplo: !img gatinho fofo'
            });
        }
        
        const query = encodeURIComponent(args.join(' '));
        const url = `https://www.google.com/search?tbm=isch&q=${query}`;
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: `🖼️ *BUSCA DE IMAGENS*\n\n` +
                  `📝 Busca: ${args.join(' ')}\n\n` +
                  `🔗 Link: ${url}`
        });
    },
    
    traduzir: async (ctx) => {
        const { sock, msg, args } = ctx;
        
        if (!args[0]) {
            return await sock.sendMessage(msg.key.remoteJid, {
                text: '❌ Informe o texto para traduzir!\n\nExemplo: !traduzir Hello world'
            });
        }
        
        const text = args.join(' ');
        
        try {
            const response = await axios.get(
                `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|pt`
            );
            
            const translated = response.data.responseData.translatedText;
            
            await sock.sendMessage(msg.key.remoteJid, {
                text: `🌐 *TRADUÇÃO*\n\n` +
                      `📝 Original: ${text}\n\n` +
                      `🇧🇷 Tradução: ${translated}`
            });
        } catch (error) {
            await sock.sendMessage(msg.key.remoteJid, {
                text: '❌ Erro ao traduzir! Tente novamente.'
            });
        }
    },
    
    clima: async (ctx) => {
        const { sock, msg, args } = ctx;
        
        if (!args[0]) {
            return await sock.sendMessage(msg.key.remoteJid, {
                text: '❌ Informe a cidade!\n\nExemplo: !clima São Paulo'
            });
        }
        
        const cidade = args.join(' ');
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: `🌤️ *CLIMA*\n\n` +
                  `🏙️ Cidade: ${cidade}\n\n` +
                  `⚠️ Esta funcionalidade requer uma API de clima.\n` +
                  `Configure uma API (OpenWeather, etc) para habilitar.`
        });
    },
    
    perfil: async (ctx) => {
        const { sock, msg, sender, senderNumber } = ctx;
        
        try {
            const profilePic = await sock.profilePictureUrl(sender, 'image').catch(() => null);
            
            const text = `👤 *SEU PERFIL*\n\n` +
                        `📱 Número: ${senderNumber}\n` +
                        `📷 Foto: ${profilePic ? 'Disponível' : 'Sem foto'}\n`;
            
            if (profilePic) {
                await sock.sendMessage(msg.key.remoteJid, {
                    image: { url: profilePic },
                    caption: text
                });
            } else {
                await sock.sendMessage(msg.key.remoteJid, { text });
            }
        } catch (error) {
            await sock.sendMessage(msg.key.remoteJid, {
                text: `👤 *SEU PERFIL*\n\n📱 Número: ${senderNumber}`
            });
        }
    },
    
    foto: async (ctx) => {
        const { sock, msg } = ctx;
        
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        const target = mentioned[0] || msg.key.participant || msg.key.remoteJid;
        const number = helpers.extractNumber(target);
        
        try {
            const profilePic = await sock.profilePictureUrl(target, 'image');
            
            await sock.sendMessage(msg.key.remoteJid, {
                image: { url: profilePic },
                caption: `📷 Foto de @${number}`,
                mentions: [target]
            });
        } catch (error) {
            await sock.sendMessage(msg.key.remoteJid, {
                text: `❌ @${number} não tem foto de perfil ou é privada!`,
                mentions: [target]
            });
        }
    }
};

module.exports = commands;
