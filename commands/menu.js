const settings = require('../config/settings');
const helpers = require('../utils/helpers');
const db = require('../storage/database');

const HEADER = `╔♡━━━━━━━━━━━━━━━━━━━━━━♡╗
║  🇨🇦 *ALIANCA BRATVA* 🇨🇦  ║
╚♡━━━━━━━━━━━━━━━━━━━━━━♡╝`;

const commands = {
    menu: async (ctx) => {
        const { sock, msg, prefix, senderNumber } = ctx;
        
        const menuText = `${HEADER}

🇨🇦 Prefixo: *[${prefix}]*

╭━━━⪩ *MENUS* ⪨━━━
│🇨🇦 ${prefix}menubrincadeiras
│🇨🇦 ${prefix}menuadmin
│🇨🇦 ${prefix}menudono
│🇨🇦 ${prefix}menuutils
│🇨🇦 ${prefix}menudownloads
│🇨🇦 ${prefix}menustickers
│🇨🇦 ${prefix}menujogos
│🇨🇦 ${prefix}menueconomia
│🇨🇦 ${prefix}menuconsultas
│🇨🇦 ${prefix}menuguerra
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ *DIVERSOS* ⪨━━━
│🇨🇦 ${prefix}ping
│🇨🇦 ${prefix}info
│🇨🇦 ${prefix}criador
│🇨🇦 ${prefix}dados
│🇨🇦 ${prefix}clima [cidade]
│🇨🇦 ${prefix}traduzir [texto]
│🇨🇦 ${prefix}calcular [conta]
│🇨🇦 ${prefix}encurtar [link]
│🇨🇦 ${prefix}qrcode [texto]
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ *FRASES* ⪨━━━
│🇨🇦 ${prefix}piada
│🇨🇦 ${prefix}cantada
│🇨🇦 ${prefix}frase
│🇨🇦 ${prefix}motivacional
│🇨🇦 ${prefix}conselho
│🇨🇦 ${prefix}fato
│🇨🇦 ${prefix}curiosidade
╰━━━━━─「🇨🇦」─━━━━━`;
        
        await sock.sendMessage(msg.key.remoteJid, { text: menuText });
    },
    
    menubrincadeiras: async (ctx) => {
        const { sock, msg, prefix } = ctx;
        
        const menuText = `${HEADER}
╭━━━⪩ 🎮 *JOGOS* ⪨━━━
│🇨🇦 ${prefix}dado
│🇨🇦 ${prefix}moeda
│🇨🇦 ${prefix}ppt [pedra/papel/tesoura]
│🇨🇦 ${prefix}slot
│🇨🇦 ${prefix}cassino [valor]
│🇨🇦 ${prefix}roleta
│🇨🇦 ${prefix}forca
│🇨🇦 ${prefix}quiz
│🇨🇦 ${prefix}adivinha
│🇨🇦 ${prefix}akinator
│🇨🇦 ${prefix}velha
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ 😂 *DIVERSAO* ⪨━━━
│🇨🇦 ${prefix}piada
│🇨🇦 ${prefix}cantada
│🇨🇦 ${prefix}zoeira
│🇨🇦 ${prefix}verdade
│🇨🇦 ${prefix}desafio
│🇨🇦 ${prefix}pegadinha
│🇨🇦 ${prefix}conselho
│🇨🇦 ${prefix}fato
│🇨🇦 ${prefix}curiosidade
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ 👥 *INTERACAO* ⪨━━━
│🇨🇦 ${prefix}ship @user1 @user2
│🇨🇦 ${prefix}casal
│🇨🇦 ${prefix}gay @user
│🇨🇦 ${prefix}gado @user
│🇨🇦 ${prefix}corno @user
│🇨🇦 ${prefix}gostoso @user
│🇨🇦 ${prefix}sorteia
│🇨🇦 ${prefix}voto [opcao]
│🇨🇦 ${prefix}beijar @user
│🇨🇦 ${prefix}tapa @user
│🇨🇦 ${prefix}matar @user
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ 🏆 *RANKING* ⪨━━━
│🇨🇦 ${prefix}rankgay
│🇨🇦 ${prefix}rankgado
│🇨🇦 ${prefix}rankcorno
│🇨🇦 ${prefix}rankativo
╰━━━━━─「🇨🇦」─━━━━━`;
        
        await sock.sendMessage(msg.key.remoteJid, { text: menuText });
    },
    
    menuadmin: async (ctx) => {
        const { sock, msg, prefix } = ctx;
        
        const menuText = `${HEADER}
╭━━━⪩ 👤 *MEMBROS* ⪨━━━
│🇨🇦 ${prefix}ban @user
│🇨🇦 ${prefix}kick @user
│🇨🇦 ${prefix}add 55xxxx
│🇨🇦 ${prefix}promote @user
│🇨🇦 ${prefix}demote @user
│🇨🇦 ${prefix}d - apagar msg
│🇨🇦 ${prefix}band - ban + apagar
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ ⚙️ *GRUPO* ⪨━━━
│🇨🇦 ${prefix}mute
│🇨🇦 ${prefix}unmute
│🇨🇦 ${prefix}link
│🇨🇦 ${prefix}revoke
│🇨🇦 ${prefix}rename [nome]
│🇨🇦 ${prefix}desc [texto]
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ 🛡️ *PROTECAO* ⪨━━━
│🇨🇦 ${prefix}antilink 1/0
│🇨🇦 ${prefix}antilocf 1/0
│🇨🇦 ${prefix}antipag 1/0
│🇨🇦 ${prefix}antiflood 1/0
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ ❓ *INFO COMANDOS* ⪨━━━
│🇨🇦 ${prefix}infoantilink
│🇨🇦 ${prefix}infoantiloc
│🇨🇦 ${prefix}infoantipag
│🇨🇦 ${prefix}infod
│🇨🇦 ${prefix}infoband
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ 📝 *AUTOMACAO* ⪨━━━
│🇨🇦 ${prefix}welcome 1/0
│🇨🇦 ${prefix}goodbye 1/0
│🇨🇦 ${prefix}setwelcome [msg]
│🇨🇦 ${prefix}setgoodbye [msg]
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ 📊 *INFO* ⪨━━━
│🇨🇦 ${prefix}admins
│🇨🇦 ${prefix}membros
│🇨🇦 ${prefix}grupo
╰━━━━━─「🇨🇦」─━━━━━`;
        
        await sock.sendMessage(msg.key.remoteJid, { text: menuText });
    },
    
    menudono: async (ctx) => {
        const { sock, msg, prefix, isOwner } = ctx;
        
        if (!isOwner) {
            return await sock.sendMessage(msg.key.remoteJid, {
                text: 'Apenas o *DONO* pode ver este menu!'
            });
        }
        
        const menuText = `${HEADER}
╭━━━⪩ 👑 *ADMINISTRACAO* ⪨━━━
│🇨🇦 ${prefix}addadmin @user
│🇨🇦 ${prefix}rmadmin @user
│🇨🇦 ${prefix}listadmins
│🇨🇦 ${prefix}addpremium @user
│🇨🇦 ${prefix}rmpremium @user
│🇨🇦 ${prefix}listpremium
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ 📢 *BROADCAST* ⪨━━━
│🇨🇦 ${prefix}bc [msg]
│🇨🇦 ${prefix}bcgroups [msg]
│🇨🇦 ${prefix}bcprivado [msg]
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ 💥 *PERIGOSOS* ⪨━━━
│🇨🇦 ${prefix}nuke
│🇨🇦 ${prefix}leave
│🇨🇦 ${prefix}destroy
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ 📊 *ESTATISTICAS* ⪨━━━
│🇨🇦 ${prefix}stats
│🇨🇦 ${prefix}grupos
│🇨🇦 ${prefix}uptime
│🇨🇦 ${prefix}ping
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ 🔧 *SISTEMA* ⪨━━━
│🇨🇦 ${prefix}restart
│🇨🇦 ${prefix}setprefix [x]
│🇨🇦 ${prefix}setowner [num]
│🇨🇦 ${prefix}setname [nome]
│🇨🇦 ${prefix}backup
│🇨🇦 ${prefix}eval [codigo]
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ 🚫 *BANIMENTOS* ⪨━━━
│🇨🇦 ${prefix}gban @user
│🇨🇦 ${prefix}gunban @user
│🇨🇦 ${prefix}listban
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ 💰 *SMS ADMIN* ⪨━━━
│🇨🇦 ${prefix}addsaldo [num] [valor]
│🇨🇦 ${prefix}saldoapi
│🇨🇦 ${prefix}usuarios
╰━━━━━─「🇨🇦」─━━━━━`;
        
        await sock.sendMessage(msg.key.remoteJid, { text: menuText });
    },
    
    menuutils: async (ctx) => {
        const { sock, msg, prefix } = ctx;
        
        const menuText = `${HEADER}
╭━━━⪩ 🖼️ *STICKERS* ⪨━━━
│🇨🇦 ${prefix}sticker
│🇨🇦 ${prefix}stickergif
│🇨🇦 ${prefix}toimg
│🇨🇦 ${prefix}tovideo
│🇨🇦 ${prefix}rename [pack|autor]
│🇨🇦 ${prefix}attp [texto]
│🇨🇦 ${prefix}ttp [texto]
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ 🔊 *AUDIO* ⪨━━━
│🇨🇦 ${prefix}bass
│🇨🇦 ${prefix}grave
│🇨🇦 ${prefix}agudo
│🇨🇦 ${prefix}rapido
│🇨🇦 ${prefix}lento
│🇨🇦 ${prefix}reverso
│🇨🇦 ${prefix}tomp3
│🇨🇦 ${prefix}toaudio
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ 🔧 *FERRAMENTAS* ⪨━━━
│🇨🇦 ${prefix}traduzir [texto]
│🇨🇦 ${prefix}clima [cidade]
│🇨🇦 ${prefix}calcular [conta]
│🇨🇦 ${prefix}encurtar [link]
│🇨🇦 ${prefix}qrcode [texto]
│🇨🇦 ${prefix}tohd [imagem]
│🇨🇦 ${prefix}removebg [imagem]
│🇨🇦 ${prefix}ocr [imagem]
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ 👤 *PERFIL* ⪨━━━
│🇨🇦 ${prefix}perfil
│🇨🇦 ${prefix}foto @user
│🇨🇦 ${prefix}bio
│🇨🇦 ${prefix}nivel
╰━━━━━─「🇨🇦」─━━━━━`;
        
        await sock.sendMessage(msg.key.remoteJid, { text: menuText });
    },
    
    menudownloads: async (ctx) => {
        const { sock, msg, prefix } = ctx;
        
        const menuText = `${HEADER}
╭━━━⪩ 🎵 *MUSICA* ⪨━━━
│🇨🇦 ${prefix}play [nome]
│🇨🇦 ${prefix}play2 [nome]
│🇨🇦 ${prefix}spotify [nome]
│🇨🇦 ${prefix}letra [nome]
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ 🎬 *VIDEO* ⪨━━━
│🇨🇦 ${prefix}video [nome]
│🇨🇦 ${prefix}ytmp4 [link]
│🇨🇦 ${prefix}ytmp3 [link]
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ 📱 *REDES SOCIAIS* ⪨━━━
│🇨🇦 ${prefix}tiktok [link]
│🇨🇦 ${prefix}instagram [link]
│🇨🇦 ${prefix}twitter [link]
│🇨🇦 ${prefix}facebook [link]
│🇨🇦 ${prefix}pinterest [busca]
│🇨🇦 ${prefix}kwai [link]
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ 📲 *APPS* ⪨━━━
│🇨🇦 ${prefix}playstore [app]
│🇨🇦 ${prefix}happymod [app]
│🇨🇦 ${prefix}aptoide [app]
╰━━━━━─「🇨🇦」─━━━━━`;
        
        await sock.sendMessage(msg.key.remoteJid, { text: menuText });
    },
    
    menulogos: async (ctx) => {
        const { sock, msg, prefix } = ctx;
        
        const menuText = `${HEADER}
╭━━━⪩ ✨ *LOGOS TEXTO* ⪨━━━
│🇨🇦 ${prefix}logo [texto]
│🇨🇦 ${prefix}logo2 [texto]
│🇨🇦 ${prefix}logo3 [texto]
│🇨🇦 ${prefix}neon [texto]
│🇨🇦 ${prefix}glitch [texto]
│🇨🇦 ${prefix}glow [texto]
│🇨🇦 ${prefix}fire [texto]
│🇨🇦 ${prefix}thunder [texto]
│🇨🇦 ${prefix}smoke [texto]
│🇨🇦 ${prefix}3d [texto]
│🇨🇦 ${prefix}blackpink [texto]
│🇨🇦 ${prefix}underwater [texto]
│🇨🇦 ${prefix}gold [texto]
│🇨🇦 ${prefix}wolf [texto]
│🇨🇦 ${prefix}anime1 [texto]
│🇨🇦 ${prefix}ff1 [texto]
│🇨🇦 ${prefix}ff2 [texto]
╰━━━━━─「🇨🇦」─━━━━━`;
        
        await sock.sendMessage(msg.key.remoteJid, { text: menuText });
    },
    
    menuefeitos: async (ctx) => {
        const { sock, msg, prefix } = ctx;
        
        const menuText = `${HEADER}
╭━━━⪩ 🎨 *EFEITOS IMG* ⪨━━━
│🇨🇦 ${prefix}pixelate [img]
│🇨🇦 ${prefix}blur [img]
│🇨🇦 ${prefix}invert [img]
│🇨🇦 ${prefix}grayscale [img]
│🇨🇦 ${prefix}sepia [img]
│🇨🇦 ${prefix}mirror [img]
│🇨🇦 ${prefix}flip [img]
│🇨🇦 ${prefix}circle [img]
│🇨🇦 ${prefix}removebg [img]
│🇨🇦 ${prefix}tohd [img]
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ 😂 *MEMES* ⪨━━━
│🇨🇦 ${prefix}rip @user
│🇨🇦 ${prefix}jail @user
│🇨🇦 ${prefix}gay @user
│🇨🇦 ${prefix}corno @user
│🇨🇦 ${prefix}bolsonaro @user
│🇨🇦 ${prefix}lgbt @user
│🇨🇦 ${prefix}comunismo @user
│🇨🇦 ${prefix}bebado @user
│🇨🇦 ${prefix}gado @user
╰━━━━━─「🇨🇦」─━━━━━`;
        
        await sock.sendMessage(msg.key.remoteJid, { text: menuText });
    },
    
    menujogos: async (ctx) => {
        const { sock, msg, prefix } = ctx;
        
        const menuText = `${HEADER}
╭━━━⪩ 🎰 *CASSINO* ⪨━━━
│🇨🇦 ${prefix}slot
│🇨🇦 ${prefix}roleta
│🇨🇦 ${prefix}cassino [valor]
│🇨🇦 ${prefix}daily
│🇨🇦 ${prefix}saldo
│🇨🇦 ${prefix}transfer @user [valor]
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ 🎮 *JOGOS* ⪨━━━
│🇨🇦 ${prefix}dado
│🇨🇦 ${prefix}moeda
│🇨🇦 ${prefix}ppt [opcao]
│🇨🇦 ${prefix}forca
│🇨🇦 ${prefix}quiz
│🇨🇦 ${prefix}adivinha
│🇨🇦 ${prefix}velha
│🇨🇦 ${prefix}akinator
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ 🏆 *RANKING* ⪨━━━
│🇨🇦 ${prefix}ranking
│🇨🇦 ${prefix}top10
│🇨🇦 ${prefix}nivel
╰━━━━━─「🇨🇦」─━━━━━`;
        
        await sock.sendMessage(msg.key.remoteJid, { text: menuText });
    },
    
    menupesquisa: async (ctx) => {
        const { sock, msg, prefix } = ctx;
        
        const menuText = `${HEADER}
╭━━━⪩ 🔍 *PESQUISAS* ⪨━━━
│🇨🇦 ${prefix}google [texto]
│🇨🇦 ${prefix}youtube [texto]
│🇨🇦 ${prefix}img [texto]
│🇨🇦 ${prefix}pinterest [texto]
│🇨🇦 ${prefix}noticias [texto]
│🇨🇦 ${prefix}wiki [texto]
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ 📱 *STALKER* ⪨━━━
│🇨🇦 ${prefix}instastalk [user]
│🇨🇦 ${prefix}tiktokstalk [user]
│🇨🇦 ${prefix}twitterstalk [user]
│🇨🇦 ${prefix}youtubestalk [canal]
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ 🎮 *GAMES* ⪨━━━
│🇨🇦 ${prefix}ffinfo [id]
│🇨🇦 ${prefix}ffstalk [id]
│🇨🇦 ${prefix}minecraft [user]
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ 🌐 *OUTROS* ⪨━━━
│🇨🇦 ${prefix}clima [cidade]
│🇨🇦 ${prefix}cep [cep]
│🇨🇦 ${prefix}ddd [ddd]
│🇨🇦 ${prefix}pais [pais]
│🇨🇦 ${prefix}anime [nome]
│🇨🇦 ${prefix}pokemon [nome]
│🇨🇦 ${prefix}filme [nome]
╰━━━━━─「🇨🇦」─━━━━━`;
        
        await sock.sendMessage(msg.key.remoteJid, { text: menuText });
    },
    
    info: async (ctx) => {
        const { sock, msg } = ctx;
        const stats = db.getStats();
        const uptime = helpers.formatUptime((Date.now() - stats.startTime) / 1000);
        
        const infoText = `${HEADER}
╭━━━⪩ 🤖 *BOT* ⪨━━━
│🇨🇦 Nome: *${settings.botName}*
│🇨🇦 Versao: *${settings.botVersion}*
│🇨🇦 Dono: *${settings.ownerName}*
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ 📊 *STATS* ⪨━━━
│🇨🇦 Uptime: *${uptime}*
│🇨🇦 Msgs: *${stats.messagesReceived}*
│🇨🇦 Cmds: *${stats.commandsUsed}*
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ ⚙️ *SISTEMA* ⪨━━━
│🇨🇦 Prefixo: *${settings.prefix}*
│🇨🇦 Idioma: *${settings.language}*
╰━━━━━─「🇨🇦」─━━━━━`;
        
        await sock.sendMessage(msg.key.remoteJid, { text: infoText });
    },
    
    ping: async (ctx) => {
        const { sock, msg } = ctx;
        const start = Date.now();
        
        await sock.sendMessage(msg.key.remoteJid, { text: '🏓 Pong!' });
        
        const end = Date.now();
        const latency = end - start;
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: `${HEADER}
╭━━━⪩ 🏓 *PING* ⪨━━━
│🇨🇦 Latencia: *${latency}ms*
│🇨🇦 Status: *Online*
╰━━━━━─「🇨🇦」─━━━━━`
        });
    },
    
    criador: async (ctx) => {
        const { sock, msg } = ctx;
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: `${HEADER}
╭━━━⪩ 👑 *CRIADOR* ⪨━━━
│🇨🇦 Nome: *${settings.ownerName}*
│🇨🇦 Numero: *${settings.ownerNumber}*
│🇨🇦 Bot: *ALIANCA BRATVA*
╰━━━━━─「🇨🇦」─━━━━━`
        });
    }
};

module.exports = commands;
