const settings = require('../config/settings');
const helpers = require('../utils/helpers');
const db = require('../storage/database');

const commands = {
    menu: async (ctx) => {
        const { sock, msg, prefix } = ctx;
        
        const menuText = `
╔══════════════════════════════════════╗
║       🤖 *${settings.botName}* 🤖       ║
╠══════════════════════════════════════╣
║                                      ║
║  Olá! Eu sou o ${settings.botName}!   ║
║  Escolha uma categoria abaixo:       ║
║                                      ║
╠══════════════════════════════════════╣
║                                      ║
║  🎮 *${prefix}menubrincadeiras*       ║
║     Jogos e diversão                 ║
║                                      ║
║  👮 *${prefix}menuadmin*              ║
║     Administração de grupos          ║
║                                      ║
║  👑 *${prefix}menudono*               ║
║     Comandos do dono                 ║
║                                      ║
║  🛠️ *${prefix}menuutils*              ║
║     Ferramentas úteis                ║
║                                      ║
║  📱 *${prefix}sms*                    ║
║     Números virtuais SMS             ║
║                                      ║
║  ℹ️ *${prefix}info*                   ║
║     Informações do bot               ║
║                                      ║
╠══════════════════════════════════════╣
║  Prefixo: *${prefix}*                  ║
║  Dono: ${settings.ownerName}          ║
╚══════════════════════════════════════╝
        `.trim();
        
        await sock.sendMessage(msg.key.remoteJid, { text: menuText });
    },
    
    menubrincadeiras: async (ctx) => {
        const { sock, msg, prefix } = ctx;
        
        const menuText = `
╔══════════════════════════════════════╗
║     🎮 *MENU DE BRINCADEIRAS* 🎮     ║
╠══════════════════════════════════════╣
║                                      ║
║  🎲 *JOGOS*                          ║
║  ${prefix}dado - Rola um dado        ║
║  ${prefix}moeda - Cara ou coroa      ║
║  ${prefix}ppt - Pedra, papel, tesoura║
║  ${prefix}slot - Caça-níqueis        ║
║  ${prefix}quiz - Perguntas aleatórias║
║  ${prefix}advinha - Adivinhe o número║
║  ${prefix}forca - Jogo da forca      ║
║                                      ║
║  😂 *DIVERSÃO*                       ║
║  ${prefix}piada - Conta uma piada    ║
║  ${prefix}frase - Frase motivacional ║
║  ${prefix}cantada - Cantada aleatória║
║  ${prefix}zoeira - Zoeira aleatória  ║
║  ${prefix}verdade - Verdade aleatória║
║  ${prefix}desafio - Desafio aleatório║
║                                      ║
║  🎭 *INTERAÇÃO*                      ║
║  ${prefix}ship @user1 @user2 - Shippa║
║  ${prefix}casal - Sorteia um casal   ║
║  ${prefix}gay @user - Teste gay      ║
║  ${prefix}gado @user - Teste de gado ║
║  ${prefix}sorteia - Sorteia membro   ║
║                                      ║
╚══════════════════════════════════════╝
        `.trim();
        
        await sock.sendMessage(msg.key.remoteJid, { text: menuText });
    },
    
    menuadmin: async (ctx) => {
        const { sock, msg, prefix } = ctx;
        
        const menuText = `
╔══════════════════════════════════════╗
║      👮 *MENU DE ADMIN* 👮           ║
╠══════════════════════════════════════╣
║                                      ║
║  👤 *MEMBROS*                        ║
║  ${prefix}ban @user - Bane usuário   ║
║  ${prefix}kick @user - Remove usuário║
║  ${prefix}add 55xxxxx - Adiciona     ║
║  ${prefix}promote @user - Promove    ║
║  ${prefix}demote @user - Rebaixa     ║
║                                      ║
║  ⚙️ *GRUPO*                          ║
║  ${prefix}mute - Silencia grupo      ║
║  ${prefix}unmute - Abre grupo        ║
║  ${prefix}link - Link do grupo       ║
║  ${prefix}revoke - Reseta link       ║
║  ${prefix}rename [nome] - Renomeia   ║
║  ${prefix}desc [texto] - Descrição   ║
║                                      ║
║  🛡️ *PROTEÇÃO*                       ║
║  ${prefix}antilink - Anti-link on/off║
║  ${prefix}antiflood - Anti-flood     ║
║  ${prefix}antibadwords - Anti-palavrão║
║                                      ║
║  📝 *AUTOMAÇÃO*                      ║
║  ${prefix}welcome on/off - Boas-vindas║
║  ${prefix}goodbye on/off - Despedida ║
║  ${prefix}setwelcome [msg] - Msg bv  ║
║  ${prefix}setgoodbye [msg] - Msg saída║
║                                      ║
║  📋 *INFO*                           ║
║  ${prefix}admins - Lista admins      ║
║  ${prefix}membros - Total de membros ║
║  ${prefix}grupo - Info do grupo      ║
║                                      ║
╚══════════════════════════════════════╝
        `.trim();
        
        await sock.sendMessage(msg.key.remoteJid, { text: menuText });
    },
    
    menudono: async (ctx) => {
        const { sock, msg, prefix, isOwner } = ctx;
        
        if (!isOwner) {
            return await sock.sendMessage(msg.key.remoteJid, {
                text: '❌ Apenas o *DONO DO BOT* pode ver este menu!'
            });
        }
        
        const menuText = `
╔══════════════════════════════════════╗
║       👑 *MENU DO DONO* 👑           ║
╠══════════════════════════════════════╣
║                                      ║
║  🔧 *ADMINISTRAÇÃO DO BOT*           ║
║  ${prefix}addadmin @user - Add admin ║
║  ${prefix}rmadmin @user - Remove admin║
║  ${prefix}listadmins - Lista admins  ║
║                                      ║
║  📢 *BROADCAST*                      ║
║  ${prefix}bc [msg] - Envia para todos║
║  ${prefix}bcgroups [msg] - Só grupos ║
║                                      ║
║  💥 *COMANDOS PERIGOSOS*             ║
║  ${prefix}nuke - Remove todos membros║
║  ${prefix}leave - Sai do grupo       ║
║                                      ║
║  📊 *ESTATÍSTICAS*                   ║
║  ${prefix}stats - Estatísticas       ║
║  ${prefix}grupos - Lista grupos      ║
║  ${prefix}uptime - Tempo online      ║
║                                      ║
║  💾 *BACKUP*                         ║
║  ${prefix}backup - Backup manual     ║
║                                      ║
║  🔄 *SISTEMA*                        ║
║  ${prefix}restart - Reinicia bot     ║
║  ${prefix}setprefix [x] - Muda prefix║
║  ${prefix}setowner [num] - Muda dono ║
║  ${prefix}setname [nome] - Nome bot  ║
║                                      ║
║  🚫 *BANIMENTOS*                     ║
║  ${prefix}gban @user - Ban global    ║
║  ${prefix}gunban @user - Desban glob.║
║  ${prefix}listban - Lista banidos    ║
║                                      ║
╚══════════════════════════════════════╝
        `.trim();
        
        await sock.sendMessage(msg.key.remoteJid, { text: menuText });
    },
    
    menuutils: async (ctx) => {
        const { sock, msg, prefix } = ctx;
        
        const menuText = `
╔══════════════════════════════════════╗
║      🛠️ *MENU UTILIDADES* 🛠️         ║
╠══════════════════════════════════════╣
║                                      ║
║  🖼️ *STICKERS*                       ║
║  ${prefix}sticker - Cria sticker     ║
║  ${prefix}toimg - Sticker para imagem║
║                                      ║
║  📥 *DOWNLOADS*                      ║
║  ${prefix}play [nome] - Baixa música ║
║  ${prefix}video [nome] - Baixa vídeo ║
║                                      ║
║  🔍 *PESQUISA*                       ║
║  ${prefix}google [texto] - Pesquisa  ║
║  ${prefix}img [texto] - Busca imagem ║
║                                      ║
║  🌐 *TRADUÇÃO*                       ║
║  ${prefix}traduzir [texto] - Traduz  ║
║                                      ║
║  🌤️ *CLIMA*                          ║
║  ${prefix}clima [cidade] - Previsão  ║
║                                      ║
║  ℹ️ *INFORMAÇÕES*                    ║
║  ${prefix}ping - Velocidade do bot   ║
║  ${prefix}info - Info do bot         ║
║  ${prefix}criador - Criador do bot   ║
║                                      ║
║  👤 *PERFIL*                         ║
║  ${prefix}perfil - Seu perfil        ║
║  ${prefix}foto @user - Foto do user  ║
║                                      ║
╚══════════════════════════════════════╝
        `.trim();
        
        await sock.sendMessage(msg.key.remoteJid, { text: menuText });
    },
    
    info: async (ctx) => {
        const { sock, msg } = ctx;
        const stats = db.getStats();
        const uptime = helpers.formatUptime((Date.now() - stats.startTime) / 1000);
        
        const infoText = `
╔══════════════════════════════════════╗
║      ℹ️ *INFORMAÇÕES DO BOT* ℹ️       ║
╠══════════════════════════════════════╣
║                                      ║
║  🤖 Nome: ${settings.botName}         ║
║  📌 Versão: 2.0.0                    ║
║  👑 Dono: ${settings.ownerName}       ║
║                                      ║
║  📊 *ESTATÍSTICAS*                   ║
║  ⏱️ Uptime: ${uptime}                ║
║  📨 Mensagens: ${stats.messagesReceived}║
║  🔧 Comandos: ${stats.commandsUsed}   ║
║                                      ║
║  ⚙️ *SISTEMA*                        ║
║  📝 Prefixo: ${settings.prefix}       ║
║  🌐 Idioma: ${settings.language}      ║
║                                      ║
╚══════════════════════════════════════╝
        `.trim();
        
        await sock.sendMessage(msg.key.remoteJid, { text: infoText });
    },
    
    ping: async (ctx) => {
        const { sock, msg } = ctx;
        const start = Date.now();
        
        await sock.sendMessage(msg.key.remoteJid, { text: '🏓 Pong!' });
        
        const end = Date.now();
        const latency = end - start;
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: `🏓 *PONG!*\n\n⚡ Latência: ${latency}ms`
        });
    },
    
    criador: async (ctx) => {
        const { sock, msg } = ctx;
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: `👑 *CRIADOR DO BOT*\n\n` +
                  `📛 Nome: ${settings.ownerName}\n` +
                  `📱 Número: ${settings.ownerNumber}\n\n` +
                  `🤖 Bot desenvolvido com muito café e código!`
        });
    }
};

module.exports = commands;
