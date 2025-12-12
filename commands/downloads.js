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

        try {
            await sock.sendMessage(remoteJid, {
                text: `${HEADER}
╭━━━⪩ 🎵 *BUSCANDO* ⪨━━━
│🇨🇦 "${query}"
│🇨🇦 Aguarde...
╰━━━━━─「🇨🇦」─━━━━━`
            });

            const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=1&key=AIzaSyAa8yy0GdcGPHdtD083HiGGx_S0vMPScDM`;
            
            try {
                const searchRes = await axios.get(searchUrl);
                if (searchRes.data.items && searchRes.data.items.length > 0) {
                    const video = searchRes.data.items[0];
                    const videoId = video.id.videoId;
                    const title = video.snippet.title;
                    const channel = video.snippet.channelTitle;

                    await sock.sendMessage(remoteJid, {
                        text: `${HEADER}
╭━━━⪩ 🎵 *MÚSICA ENCONTRADA* ⪨━━━
│🇨🇦 *Título:* ${title}
│🇨🇦 *Canal:* ${channel}
│🇨🇦 *Link:* https://youtu.be/${videoId}
╰━━━━━─「🇨🇦」─━━━━━

⚠️ *Nota:* Download direto desabilitado.
Use o link acima para ouvir!`
                    });
                } else {
                    throw new Error('Nenhum resultado');
                }
            } catch (e) {
                await sock.sendMessage(remoteJid, {
                    text: `${HEADER}
╭━━━⪩ 🎵 *BUSCAR MÚSICA* ⪨━━━
│🇨🇦 "${query}"
│🇨🇦 
│🇨🇦 Busque em:
│🇨🇦 • youtube.com
│🇨🇦 • spotify.com
│🇨🇦 • deezer.com
╰━━━━━─「🇨🇦」─━━━━━`
                });
            }

        } catch (error) {
            console.error('[DOWNLOAD] Erro play:', error.message);
            await sock.sendMessage(remoteJid, {
                text: `❌ Erro ao buscar música.`
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
│🇨🇦 Processando...
╰━━━━━─「🇨🇦」─━━━━━`
            });

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

    async instagram(ctx) {
        const { sock, msg, args } = ctx;
        const remoteJid = msg.key.remoteJid;

        if (!args[0]) {
            return await sock.sendMessage(remoteJid, {
                text: `❌ Informe o link do Instagram!\n\n*Uso:* ${settings.prefix}instagram [link]`
            });
        }

        const url = args[0];

        if (!url.includes('instagram.com')) {
            return await sock.sendMessage(remoteJid, {
                text: `❌ Link inválido! Use um link do Instagram.`
            });
        }

        await sock.sendMessage(remoteJid, {
            text: `${HEADER}
╭━━━⪩ 📷 *INSTAGRAM* ⪨━━━
│🇨🇦 "${url}"
│🇨🇦 
│🇨🇦 ⚠️ Download Instagram
│🇨🇦 temporariamente indisponível.
│🇨🇦 
│🇨🇦 Tente: saveinsta.app
╰━━━━━─「🇨🇦」─━━━━━`
        });
    },

    async ig(ctx) {
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
                text: `❌ Informe o link do Facebook!\n\n*Uso:* ${settings.prefix}facebook [link]`
            });
        }

        await sock.sendMessage(remoteJid, {
            text: `${HEADER}
╭━━━⪩ 📘 *FACEBOOK* ⪨━━━
│🇨🇦 ⚠️ Download Facebook
│🇨🇦 temporariamente indisponível.
│🇨🇦 
│🇨🇦 Tente: fbdown.net
╰━━━━━─「🇨🇦」─━━━━━`
        });
    },

    async fb(ctx) {
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
│🇨🇦 ${prefix}play [nome]
│🇨🇦 ${prefix}letra [nome]
│🇨🇦 ${prefix}spotify [link]
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ 🎬 *VIDEO* ⪨━━━
│🇨🇦 ${prefix}video [nome/link]
│🇨🇦 ${prefix}tiktok [link]
│🇨🇦 ${prefix}instagram [link]
│🇨🇦 ${prefix}twitter [link]
│🇨🇦 ${prefix}facebook [link]
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ 🖼️ *IMAGEM* ⪨━━━
│🇨🇦 ${prefix}img [termo]
│🇨🇦 ${prefix}pinterest [termo]
╰━━━━━─「🇨🇦」─━━━━━

⚠️ *Alguns downloads podem estar
temporariamente indisponíveis*`;

        await sock.sendMessage(remoteJid, { text: menu });
    }
};

module.exports = downloadCommands;
