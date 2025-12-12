const settings = require('../config/settings');
const helpers = require('../utils/helpers');
const db = require('../storage/database');

const HEADER = `
   ╭━━━━━━━━━━━━━━━━━━━━╮
   │  🇨🇦 *ALIANCA BRATVA* 🇨🇦  │
   ╰━━━━━━━━━━━━━━━━━━━━╯`;

const commands = {
    menu: async (ctx) => {
        const { sock, msg, prefix } = ctx;
        
        const menuText = `${HEADER}

  ┌─────────────────────┐
  │    *MENU PRINCIPAL*      │
  └─────────────────────┘

  Ola! Bem-vindo ao *BRATVA*!
  Escolha uma categoria:

  ╭───────────────────────╮
  │ *${prefix}menubrincadeiras*     │
  │  Jogos e diversao           │
  ├───────────────────────┤
  │ *${prefix}menuadmin*            │
  │  Administracao de grupos    │
  ├───────────────────────┤
  │ *${prefix}menudono*             │
  │  Comandos do dono           │
  ├───────────────────────┤
  │ *${prefix}menuutils*            │
  │  Ferramentas uteis          │
  ├───────────────────────┤
  │ *${prefix}sms*                  │
  │  Numeros virtuais SMS       │
  ├───────────────────────┤
  │ *${prefix}info*                 │
  │  Informacoes do bot         │
  ╰───────────────────────╯

  *Prefixo:* ${prefix}
  *Dono:* ${settings.ownerName}
        `.trim();
        
        await sock.sendMessage(msg.key.remoteJid, { text: menuText });
    },
    
    menubrincadeiras: async (ctx) => {
        const { sock, msg, prefix } = ctx;
        
        const menuText = `${HEADER}

  ┌─────────────────────┐
  │   *MENU BRINCADEIRAS*    │
  └─────────────────────┘

  *JOGOS*
  ╭───────────────────────╮
  │ ${prefix}dado      - Rola um dado     │
  │ ${prefix}moeda     - Cara ou coroa    │
  │ ${prefix}ppt       - Pedra papel tesoura │
  │ ${prefix}slot      - Caca-niqueis     │
  │ ${prefix}quiz      - Perguntas        │
  │ ${prefix}advinha   - Adivinhe numero  │
  │ ${prefix}forca     - Jogo da forca    │
  ╰───────────────────────╯

  *DIVERSAO*
  ╭───────────────────────╮
  │ ${prefix}piada     - Conta piada      │
  │ ${prefix}frase     - Frase motivacional │
  │ ${prefix}cantada   - Cantada aleatoria │
  │ ${prefix}zoeira    - Zoeira aleatoria │
  │ ${prefix}verdade   - Verdade aleatoria │
  │ ${prefix}desafio   - Desafio aleatorio │
  ╰───────────────────────╯

  *INTERACAO*
  ╭───────────────────────╮
  │ ${prefix}ship @u1 @u2 - Shippa       │
  │ ${prefix}casal     - Sorteia casal   │
  │ ${prefix}gay @user - Teste gay       │
  │ ${prefix}gado @user - Teste gado     │
  │ ${prefix}sorteia   - Sorteia membro  │
  ╰───────────────────────╯
        `.trim();
        
        await sock.sendMessage(msg.key.remoteJid, { text: menuText });
    },
    
    menuadmin: async (ctx) => {
        const { sock, msg, prefix } = ctx;
        
        const menuText = `${HEADER}

  ┌─────────────────────┐
  │     *MENU ADMIN*         │
  └─────────────────────┘

  *MEMBROS*
  ╭───────────────────────╮
  │ ${prefix}ban @user  - Bane usuario   │
  │ ${prefix}kick @user - Remove usuario │
  │ ${prefix}add 55xxx  - Adiciona       │
  │ ${prefix}promote    - Promove admin  │
  │ ${prefix}demote     - Rebaixa admin  │
  ╰───────────────────────╯

  *GRUPO*
  ╭───────────────────────╮
  │ ${prefix}mute       - Silencia grupo │
  │ ${prefix}unmute     - Abre grupo     │
  │ ${prefix}link       - Link do grupo  │
  │ ${prefix}revoke     - Reseta link    │
  │ ${prefix}rename     - Renomeia grupo │
  │ ${prefix}desc       - Muda descricao │
  ╰───────────────────────╯

  *PROTECAO*
  ╭───────────────────────╮
  │ ${prefix}antilink   - Anti-link      │
  │ ${prefix}antiflood  - Anti-flood     │
  │ ${prefix}antibadwords - Anti-palavrao │
  ╰───────────────────────╯

  *AUTOMACAO*
  ╭───────────────────────╮
  │ ${prefix}welcome    - Boas-vindas    │
  │ ${prefix}goodbye    - Despedida      │
  │ ${prefix}setwelcome - Msg de entrada │
  │ ${prefix}setgoodbye - Msg de saida   │
  ╰───────────────────────╯

  *INFO*
  ╭───────────────────────╮
  │ ${prefix}admins     - Lista admins   │
  │ ${prefix}membros    - Total membros  │
  │ ${prefix}grupo      - Info do grupo  │
  ╰───────────────────────╯
        `.trim();
        
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

  ┌─────────────────────┐
  │     *MENU DONO*          │
  └─────────────────────┘

  *ADMINISTRACAO*
  ╭───────────────────────╮
  │ ${prefix}addadmin @user - Add admin  │
  │ ${prefix}rmadmin @user  - Remove     │
  │ ${prefix}listadmins     - Lista      │
  ╰───────────────────────╯

  *BROADCAST*
  ╭───────────────────────╮
  │ ${prefix}bc [msg]    - Envia p/ todos │
  │ ${prefix}bcgroups    - So grupos      │
  ╰───────────────────────╯

  *COMANDOS PERIGOSOS*
  ╭───────────────────────╮
  │ ${prefix}nuke        - Remove todos   │
  │ ${prefix}leave       - Sai do grupo   │
  ╰───────────────────────╯

  *ESTATISTICAS*
  ╭───────────────────────╮
  │ ${prefix}stats       - Estatisticas   │
  │ ${prefix}grupos      - Lista grupos   │
  │ ${prefix}uptime      - Tempo online   │
  ╰───────────────────────╯

  *SISTEMA*
  ╭───────────────────────╮
  │ ${prefix}restart     - Reinicia bot   │
  │ ${prefix}setprefix   - Muda prefixo   │
  │ ${prefix}setowner    - Muda dono      │
  │ ${prefix}setname     - Nome do bot    │
  │ ${prefix}backup      - Backup manual  │
  ╰───────────────────────╯

  *BANIMENTOS*
  ╭───────────────────────╮
  │ ${prefix}gban @user  - Ban global     │
  │ ${prefix}gunban      - Desban global  │
  │ ${prefix}listban     - Lista banidos  │
  ╰───────────────────────╯

  *SMS ADMIN*
  ╭───────────────────────╮
  │ ${prefix}addsaldo    - Add saldo user │
  │ ${prefix}saldoapi    - Saldo da API   │
  ╰───────────────────────╯
        `.trim();
        
        await sock.sendMessage(msg.key.remoteJid, { text: menuText });
    },
    
    menuutils: async (ctx) => {
        const { sock, msg, prefix } = ctx;
        
        const menuText = `${HEADER}

  ┌─────────────────────┐
  │   *MENU UTILIDADES*      │
  └─────────────────────┘

  *STICKERS*
  ╭───────────────────────╮
  │ ${prefix}sticker    - Cria sticker    │
  │ ${prefix}toimg      - Sticker p/ img  │
  ╰───────────────────────╯

  *DOWNLOADS*
  ╭───────────────────────╮
  │ ${prefix}play [nome] - Baixa musica   │
  │ ${prefix}video [nome] - Baixa video   │
  ╰───────────────────────╯

  *PESQUISA*
  ╭───────────────────────╮
  │ ${prefix}google [txt] - Pesquisa      │
  │ ${prefix}img [texto]  - Busca imagem  │
  ╰───────────────────────╯

  *TRADUCAO*
  ╭───────────────────────╮
  │ ${prefix}traduzir [txt] - Traduz      │
  ╰───────────────────────╯

  *CLIMA*
  ╭───────────────────────╮
  │ ${prefix}clima [cidade] - Previsao    │
  ╰───────────────────────╯

  *INFORMACOES*
  ╭───────────────────────╮
  │ ${prefix}ping       - Velocidade      │
  │ ${prefix}info       - Info do bot     │
  │ ${prefix}criador    - Criador do bot  │
  ╰───────────────────────╯

  *PERFIL*
  ╭───────────────────────╮
  │ ${prefix}perfil     - Seu perfil      │
  │ ${prefix}foto @user - Foto do user    │
  ╰───────────────────────╯
        `.trim();
        
        await sock.sendMessage(msg.key.remoteJid, { text: menuText });
    },
    
    info: async (ctx) => {
        const { sock, msg } = ctx;
        const stats = db.getStats();
        const uptime = helpers.formatUptime((Date.now() - stats.startTime) / 1000);
        
        const infoText = `${HEADER}

  ┌─────────────────────┐
  │   *INFORMACOES*          │
  └─────────────────────┘

  *BOT*
  ╭───────────────────────╮
  │ Nome: ${settings.botName}          │
  │ Versao: ${settings.botVersion}            │
  │ Dono: ${settings.ownerName}          │
  ╰───────────────────────╯

  *ESTATISTICAS*
  ╭───────────────────────╮
  │ Uptime: ${uptime}         │
  │ Mensagens: ${stats.messagesReceived}      │
  │ Comandos: ${stats.commandsUsed}        │
  ╰───────────────────────╯

  *SISTEMA*
  ╭───────────────────────╮
  │ Prefixo: ${settings.prefix}             │
  │ Idioma: ${settings.language}        │
  ╰───────────────────────╯
        `.trim();
        
        await sock.sendMessage(msg.key.remoteJid, { text: infoText });
    },
    
    ping: async (ctx) => {
        const { sock, msg } = ctx;
        const start = Date.now();
        
        await sock.sendMessage(msg.key.remoteJid, { text: 'Pong!' });
        
        const end = Date.now();
        const latency = end - start;
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: `*PONG!*\n\nLatencia: ${latency}ms`
        });
    },
    
    criador: async (ctx) => {
        const { sock, msg } = ctx;
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: `${HEADER}

  *CRIADOR DO BOT*

  Nome: ${settings.ownerName}
  Numero: ${settings.ownerNumber}

  Bot da Alianca BRATVA!`
        });
    }
};

module.exports = commands;
