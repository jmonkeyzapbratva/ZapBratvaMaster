const axios = require('axios');
const settings = require('../config/settings');

const HEADER = `╔♡━━━━━━━━━━━━━━━━━━━━━━♡╗
║  🇨🇦 *ALIANCA BRATVA* 🇨🇦  ║
╚♡━━━━━━━━━━━━━━━━━━━━━━♡╝`;

const downloadCommands = {

    async play(ctx) {
        const { sock, msg, args } = ctx;
        const remoteJid = msg.key.remoteJid;

        if (!args[0]) {
            return await sock.sendMessage(remoteJid, {
                text: `❌ Informe o nome da música!\n\n*Uso:* ${settings.prefix}play nome da musica`
            });
        }

        const query = args.join(' ');
        
        await sock.sendMessage(remoteJid, {
            text: `${HEADER}
╭━━━⪩ 🎵 *BAIXANDO* ⪨━━━
│🇨🇦 *${query}*
│🇨🇦 Aguarde...
╰━━━━━─「🇨🇦」─━━━━━`
        });

        try {
            // Método 1: Tenta API gratuita de busca YouTube
            let videoUrl = null;
            
            // Busca via scraping simples do YouTube
            const searchResponse = await axios.get(
                `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
                { 
                    headers: { 'User-Agent': 'Mozilla/5.0' },
                    timeout: 10000 
                }
            ).catch(() => null);
            
            if (searchResponse?.data) {
                // Extrai videoId do HTML
                const match = searchResponse.data.match(/\/watch\?v=([a-zA-Z0-9_-]{11})/);
                if (match?.[1]) {
                    videoUrl = `https://www.youtube.com/watch?v=${match[1]}`;
                }
            }
            
            if (videoUrl) {
                // Tenta baixar via cobalt
                const cobaltRes = await axios.post('https://co.wuk.sh/api/json', {
                    url: videoUrl,
                    aFormat: 'mp3',
                    isAudioOnly: true
                }, {
                    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                    timeout: 30000
                }).catch(() => null);

                if (cobaltRes?.data?.url) {
                    await sock.sendMessage(remoteJid, {
                        audio: { url: cobaltRes.data.url },
                        mimetype: 'audio/mpeg',
                        ptt: false
                    });
                    return;
                }
            }

            // Fallback: link de busca
            await sock.sendMessage(remoteJid, {
                text: `${HEADER}
╭━━━⪩ 🎵 *MÚSICA* ⪨━━━
│🇨🇦 *${query}*
│🇨🇦 
│🇨🇦 🔗 Clique para ouvir:
│🇨🇦 https://www.youtube.com/results?search_query=${encodeURIComponent(query + ' música')}
╰━━━━━─「🇨🇦」─━━━━━`
            });

        } catch (error) {
            console.log('[PLAY] Erro:', error.message);
            await sock.sendMessage(remoteJid, {
                text: `${HEADER}
╭━━━⪩ 🎵 *MÚSICA* ⪨━━━
│🇨🇦 *${query}*
│🇨🇦 
│🇨🇦 🔗 Clique para ouvir:
│🇨🇦 https://www.youtube.com/results?search_query=${encodeURIComponent(query + ' música')}
╰━━━━━─「🇨🇦」─━━━━━`
            });
        }
    },

    async video(ctx) {
        const { sock, msg, args } = ctx;
        const remoteJid = msg.key.remoteJid;

        if (!args[0]) {
            return await sock.sendMessage(remoteJid, {
                text: `❌ Informe o nome ou link do vídeo!\n\n*Uso:* ${settings.prefix}video nome do video`
            });
        }

        const query = args.join(' ');

        await sock.sendMessage(remoteJid, {
            text: `${HEADER}
╭━━━⪩ 🎬 *VIDEO* ⪨━━━
│🇨🇦 "${query}"
│🇨🇦 
│🇨🇦 ⚠️ Download de vídeo
│🇨🇦 temporariamente indisponível.
│🇨🇦 
│🇨🇦 Busque no YouTube!
╰━━━━━─「🇨🇦」─━━━━━`
        });
    },

    async tiktok(ctx) {
        const { sock, msg, args } = ctx;
        const remoteJid = msg.key.remoteJid;

        if (!args[0]) {
            return await sock.sendMessage(remoteJid, {
                text: `❌ Informe o link do TikTok!\n\n*Uso:* ${settings.prefix}tiktok [link]`
            });
        }

        const url = args[0];

        if (!url.includes('tiktok.com')) {
            return await sock.sendMessage(remoteJid, {
                text: `❌ Link inválido! Use um link do TikTok.`
            });
        }

        try {
            await sock.sendMessage(remoteJid, {
                text: `${HEADER}
╭━━━⪩ 📱 *TIKTOK* ⪨━━━
│🇨🇦 Baixando...
╰━━━━━─「🇨🇦」─━━━━━`
            });

            // Tenta cobalt primeiro
            const cobaltRes = await axios.post('https://co.wuk.sh/api/json', {
                url: url,
                vCodec: 'h264',
                vQuality: '720'
            }, {
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                timeout: 30000
            }).catch(() => null);

            if (cobaltRes?.data?.url) {
                await sock.sendMessage(remoteJid, {
                    video: { url: cobaltRes.data.url },
                    caption: `${HEADER}
╭━━━⪩ 📱 *TIKTOK* ⪨━━━
│🇨🇦 Download concluído!
╰━━━━━─「🇨🇦」─━━━━━`
                });
                return;
            }

            // Fallback tiklydown
            const apiUrl = `https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(url)}`;
            const res = await axios.get(apiUrl, { timeout: 30000 });

            if (res.data && res.data.video) {
                const videoUrl = res.data.video.noWatermark || res.data.video.watermark;
                
                await sock.sendMessage(remoteJid, {
                    video: { url: videoUrl },
                    caption: `${HEADER}
╭━━━⪩ 📱 *TIKTOK* ⪨━━━
│🇨🇦 *Autor:* ${res.data.author?.name || 'N/A'}
│🇨🇦 *Desc:* ${(res.data.title || '').substring(0, 100)}
╰━━━━━─「🇨🇦」─━━━━━`
                });
            } else {
                throw new Error('Vídeo não encontrado');
            }

        } catch (error) {
            console.error('[DOWNLOAD] Erro TikTok:', error.message);
            await sock.sendMessage(remoteJid, {
                text: `❌ Erro ao baixar TikTok. Tente novamente mais tarde.`
            });
        }
    },

    // Alias para TikTok
    async ttk(ctx) {
        return await downloadCommands.tiktok(ctx);
    },

    async instagram(ctx) {
        const { sock, msg, args } = ctx;
        const remoteJid = msg.key.remoteJid;

        if (!args[0]) {
            return await sock.sendMessage(remoteJid, {
                text: `❌ Informe o link do Instagram!\n\n*Uso:* ${settings.prefix}insta [link]`
            });
        }

        const url = args[0];

        if (!url.includes('instagram.com')) {
            return await sock.sendMessage(remoteJid, {
                text: `❌ Link inválido! Use um link do Instagram.`
            });
        }

        try {
            await sock.sendMessage(remoteJid, {
                text: `${HEADER}
╭━━━⪩ 📷 *INSTAGRAM* ⪨━━━
│🇨🇦 Baixando...
╰━━━━━─「🇨🇦」─━━━━━`
            });

            // Tenta cobalt
            const cobaltRes = await axios.post('https://co.wuk.sh/api/json', {
                url: url,
                vCodec: 'h264',
                vQuality: '720'
            }, {
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                timeout: 30000
            }).catch(() => null);

            if (cobaltRes?.data?.url) {
                // Detecta se é imagem ou vídeo
                const mediaUrl = cobaltRes.data.url;
                if (mediaUrl.includes('.jpg') || mediaUrl.includes('.png') || mediaUrl.includes('image')) {
                    await sock.sendMessage(remoteJid, {
                        image: { url: mediaUrl },
                        caption: `${HEADER}
╭━━━⪩ 📷 *INSTAGRAM* ⪨━━━
│🇨🇦 Download concluído!
╰━━━━━─「🇨🇦」─━━━━━`
                    });
                } else {
                    await sock.sendMessage(remoteJid, {
                        video: { url: mediaUrl },
                        caption: `${HEADER}
╭━━━⪩ 📷 *INSTAGRAM* ⪨━━━
│🇨🇦 Download concluído!
╰━━━━━─「🇨🇦」─━━━━━`
                    });
                }
                return;
            }

            // Fallback
            await sock.sendMessage(remoteJid, {
                text: `${HEADER}
╭━━━⪩ 📷 *INSTAGRAM* ⪨━━━
│🇨🇦 ⚠️ Não foi possível baixar
│🇨🇦 
│🇨🇦 Tente: saveinsta.app
╰━━━━━─「🇨🇦」─━━━━━`
            });

        } catch (error) {
            console.log('[INSTA] Erro:', error.message);
            await sock.sendMessage(remoteJid, {
                text: `❌ Erro ao baixar do Instagram. Tente novamente.`
            });
        }
    },

    async ig(ctx) {
        return await downloadCommands.instagram(ctx);
    },

    async insta(ctx) {
        return await downloadCommands.instagram(ctx);
    },

    async twitter(ctx) {
        const { sock, msg, args } = ctx;
        const remoteJid = msg.key.remoteJid;

        if (!args[0]) {
            return await sock.sendMessage(remoteJid, {
                text: `❌ Informe o link do Twitter/X!\n\n*Uso:* ${settings.prefix}twitter [link]`
            });
        }

        await sock.sendMessage(remoteJid, {
            text: `${HEADER}
╭━━━⪩ 🐦 *TWITTER/X* ⪨━━━
│🇨🇦 ⚠️ Download Twitter
│🇨🇦 temporariamente indisponível.
│🇨🇦 
│🇨🇦 Tente: ssstwitter.com
╰━━━━━─「🇨🇦」─━━━━━`
        });
    },

    async x(ctx) {
        return await downloadCommands.twitter(ctx);
    },

    async facebook(ctx) {
        const { sock, msg, args } = ctx;
        const remoteJid = msg.key.remoteJid;

        if (!args[0]) {
            return await sock.sendMessage(remoteJid, {
                text: `❌ Informe o link do Facebook!\n\n*Uso:* ${settings.prefix}face [link]`
            });
        }

        const url = args[0];

        if (!url.includes('facebook.com') && !url.includes('fb.watch')) {
            return await sock.sendMessage(remoteJid, {
                text: `❌ Link inválido! Use um link do Facebook.`
            });
        }

        try {
            await sock.sendMessage(remoteJid, {
                text: `${HEADER}
╭━━━⪩ 📘 *FACEBOOK* ⪨━━━
│🇨🇦 Baixando...
╰━━━━━─「🇨🇦」─━━━━━`
            });

            // Tenta cobalt
            const cobaltRes = await axios.post('https://co.wuk.sh/api/json', {
                url: url,
                vCodec: 'h264',
                vQuality: '720'
            }, {
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                timeout: 30000
            }).catch(() => null);

            if (cobaltRes?.data?.url) {
                await sock.sendMessage(remoteJid, {
                    video: { url: cobaltRes.data.url },
                    caption: `${HEADER}
╭━━━⪩ 📘 *FACEBOOK* ⪨━━━
│🇨🇦 Download concluído!
╰━━━━━─「🇨🇦」─━━━━━`
                });
                return;
            }

            // Fallback
            await sock.sendMessage(remoteJid, {
                text: `${HEADER}
╭━━━⪩ 📘 *FACEBOOK* ⪨━━━
│🇨🇦 ⚠️ Não foi possível baixar
│🇨🇦 
│🇨🇦 Tente: fbdown.net
╰━━━━━─「🇨🇦」─━━━━━`
            });

        } catch (error) {
            console.log('[FACE] Erro:', error.message);
            await sock.sendMessage(remoteJid, {
                text: `❌ Erro ao baixar do Facebook. Tente novamente.`
            });
        }
    },

    async fb(ctx) {
        return await downloadCommands.facebook(ctx);
    },

    async face(ctx) {
        return await downloadCommands.facebook(ctx);
    },

    async pinterest(ctx) {
        const { sock, msg, args } = ctx;
        const remoteJid = msg.key.remoteJid;

        if (!args[0]) {
            return await sock.sendMessage(remoteJid, {
                text: `❌ Informe o link ou termo de busca!\n\n*Uso:* ${settings.prefix}pinterest [link ou termo]`
            });
        }

        const query = args.join(' ');

        await sock.sendMessage(remoteJid, {
            text: `${HEADER}
╭━━━⪩ 📌 *PINTEREST* ⪨━━━
│🇨🇦 Buscando: "${query}"
│🇨🇦 
│🇨🇦 ⚠️ Download Pinterest
│🇨🇦 temporariamente indisponível.
│🇨🇦 
│🇨🇦 Acesse: pinterest.com
╰━━━━━─「🇨🇦」─━━━━━`
        });
    },

    async spotify(ctx) {
        const { sock, msg, args } = ctx;
        const remoteJid = msg.key.remoteJid;

        if (!args[0]) {
            return await sock.sendMessage(remoteJid, {
                text: `❌ Informe o link do Spotify!\n\n*Uso:* ${settings.prefix}spotify [link]`
            });
        }

        await sock.sendMessage(remoteJid, {
            text: `${HEADER}
╭━━━⪩ 🎵 *SPOTIFY* ⪨━━━
│🇨🇦 ⚠️ Download Spotify
│🇨🇦 não disponível (DRM).
│🇨🇦 
│🇨🇦 Use: ${settings.prefix}play [nome]
│🇨🇦 para buscar músicas!
╰━━━━━─「🇨🇦」─━━━━━`
        });
    },

    async letra(ctx) {
        const { sock, msg, args } = ctx;
        const remoteJid = msg.key.remoteJid;

        if (!args[0]) {
            return await sock.sendMessage(remoteJid, {
                text: `❌ Informe a música!\n\n*Uso:* ${settings.prefix}letra nome da musica`
            });
        }

        const query = args.join(' ');

        try {
            const res = await axios.get(`https://some-random-api.com/lyrics?title=${encodeURIComponent(query)}`);
            
            if (res.data && res.data.lyrics) {
                const lyrics = res.data.lyrics.substring(0, 3000);
                
                await sock.sendMessage(remoteJid, {
                    text: `${HEADER}
╭━━━⪩ 🎤 *LETRA* ⪨━━━
│🇨🇦 *${res.data.title || query}*
│🇨🇦 *${res.data.author || 'Artista desconhecido'}*
╰━━━━━─「🇨🇦」─━━━━━

${lyrics}${res.data.lyrics.length > 3000 ? '\n\n[...continua]' : ''}`
                });
            } else {
                throw new Error('Letra não encontrada');
            }

        } catch (error) {
            await sock.sendMessage(remoteJid, {
                text: `❌ Letra não encontrada para "${query}".`
            });
        }
    },

    async img(ctx) {
        const { sock, msg, args } = ctx;
        const remoteJid = msg.key.remoteJid;

        if (!args[0]) {
            return await sock.sendMessage(remoteJid, {
                text: `❌ Informe o que buscar!\n\n*Uso:* ${settings.prefix}img cachorro fofo`
            });
        }

        const query = args.join(' ');

        try {
            await sock.sendMessage(remoteJid, {
                text: `🔍 Buscando imagens de "${query}"...`
            });

            const res = await axios.get(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&client_id=your_unsplash_key`);
            
            if (res.data.results && res.data.results.length > 0) {
                const img = res.data.results[0];
                
                await sock.sendMessage(remoteJid, {
                    image: { url: img.urls.regular },
                    caption: `${HEADER}
╭━━━⪩ 🖼️ *IMAGEM* ⪨━━━
│🇨🇦 "${query}"
│🇨🇦 Por: ${img.user?.name || 'Desconhecido'}
╰━━━━━─「🇨🇦」─━━━━━`
                });
            } else {
                throw new Error('Imagem não encontrada');
            }

        } catch (error) {
            await sock.sendMessage(remoteJid, {
                text: `${HEADER}
╭━━━⪩ 🖼️ *BUSCAR IMAGEM* ⪨━━━
│🇨🇦 "${query}"
│🇨🇦 
│🇨🇦 Busque em:
│🇨🇦 • google.com/imagens
│🇨🇦 • unsplash.com
│🇨🇦 • pexels.com
╰━━━━━─「🇨🇦」─━━━━━`
            });
        }
    },

    async menudownloads(ctx) {
        const { sock, msg } = ctx;
        const remoteJid = msg.key.remoteJid;
        const prefix = settings.prefix;

        const menu = `${HEADER}
╭━━━⪩ 🎵 *MÚSICA* ⪨━━━
│🇨🇦 ${prefix}play [nome] - baixa áudio
│🇨🇦 ${prefix}letra [nome]
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ 🎬 *REDES SOCIAIS* ⪨━━━
│🇨🇦 ${prefix}ttk [link] - TikTok
│🇨🇦 ${prefix}insta [link] - Instagram
│🇨🇦 ${prefix}face [link] - Facebook
│🇨🇦 ${prefix}twitter [link] - Twitter/X
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ 🖼️ *IMAGEM* ⪨━━━
│🇨🇦 ${prefix}img [termo]
│🇨🇦 ${prefix}pinterest [termo]
╰━━━━━─「🇨🇦」─━━━━━`;

        await sock.sendMessage(remoteJid, { text: menu });
    }
};

module.exports = downloadCommands;
