const settings = require('../config/settings');

const HEADER = `╔♡━━━━━━━━━━━━━━━━━━━━━━♡╗
║  🇨🇦 *ALIANCA BRATVA* 🇨🇦  ║
╚♡━━━━━━━━━━━━━━━━━━━━━━♡╝`;

const brincadeirasCommands = {

    async piada(ctx) {
        const { sock, msg } = ctx;
        const remoteJid = msg.key.remoteJid;

        const piadas = [
            "Por que o pato não compra ChapStick? Porque ele já tem o bico.",
            "O que o zero disse para o oito? Belo cinto!",
            "Por que a vaca foi pro espaço? Pra ver a vaca-láctea!",
            "O que o tomate foi fazer no banco? Foi tirar extrato!",
            "Por que a galinha atravessou a rua? Para chegar do outro lado!",
            "O que a impressora disse pro computador? Esse papel é meu!",
            "Por que o computador foi ao médico? Porque tinha um vírus!",
            "O que o café disse pro açúcar? Sem você minha vida é amarga!",
            "Por que o livro de matemática se suicidou? Porque tinha muitos problemas!",
            "O que a esquerda disse pra direita? Você não me entende!"
        ];

        const piada = piadas[Math.floor(Math.random() * piadas.length)];

        await sock.sendMessage(remoteJid, {
            text: `${HEADER}
╭━━━⪩ 😂 *PIADA* ⪨━━━
│🇨🇦 
│🇨🇦 ${piada}
│🇨🇦 
╰━━━━━─「🇨🇦」─━━━━━`
        });
    },

    async cantada(ctx) {
        const { sock, msg } = ctx;
        const remoteJid = msg.key.remoteJid;

        const cantadas = [
            "Você é Wi-Fi? Porque estou sentindo uma conexão!",
            "Você é Google? Porque tem tudo que eu procuro!",
            "Se beleza fosse tempo, você seria a eternidade!",
            "Você é uma câmera? Porque toda vez que te vejo, eu sorrio!",
            "Você deve ser um ímã, porque está me atraindo!",
            "Se você fosse uma fruta, seria uma fina-maça!",
            "Você é um terremoto? Porque balançou meu mundo!",
            "Eu não sou fotógrafo, mas posso te imaginar do meu lado!",
            "Você é um semáforo? Porque quando te vejo, eu paro!",
            "Se olhar matasse, você seria uma arma de destruição em massa!"
        ];

        const cantada = cantadas[Math.floor(Math.random() * cantadas.length)];

        await sock.sendMessage(remoteJid, {
            text: `${HEADER}
╭━━━⪩ 💕 *CANTADA* ⪨━━━
│🇨🇦 
│🇨🇦 ${cantada}
│🇨🇦 
╰━━━━━─「🇨🇦」─━━━━━`
        });
    },

    async frase(ctx) {
        const { sock, msg } = ctx;
        const remoteJid = msg.key.remoteJid;

        const frases = [
            "A vida é o que acontece enquanto você está ocupado fazendo outros planos. - John Lennon",
            "Seja a mudança que você quer ver no mundo. - Mahatma Gandhi",
            "O sucesso é ir de fracasso em fracasso sem perder o entusiasmo. - Winston Churchill",
            "A imaginação é mais importante que o conhecimento. - Albert Einstein",
            "Você nunca é velho demais para definir um novo objetivo ou sonhar um novo sonho. - C.S. Lewis",
            "O único limite para nossa realização de amanhã são nossas dúvidas de hoje. - Franklin D. Roosevelt",
            "A melhor maneira de prever o futuro é criá-lo. - Peter Drucker",
            "Não espere por uma crise para descobrir o que é importante em sua vida. - Platão",
            "O segredo do sucesso é a constância do propósito. - Benjamin Disraeli",
            "Acredite em você e tudo será possível."
        ];

        const frase = frases[Math.floor(Math.random() * frases.length)];

        await sock.sendMessage(remoteJid, {
            text: `${HEADER}
╭━━━⪩ 💭 *FRASE* ⪨━━━
│🇨🇦 
│🇨🇦 ${frase}
│🇨🇦 
╰━━━━━─「🇨🇦」─━━━━━`
        });
    },

    async motivacional(ctx) {
        const { sock, msg } = ctx;
        const remoteJid = msg.key.remoteJid;

        const frases = [
            "Você é mais forte do que imagina! 💪",
            "Não desista, os dias difíceis fazem os dias bons serem melhores!",
            "Cada passo, não importa quão pequeno, é um progresso!",
            "Acredite em você, você é capaz de coisas incríveis!",
            "O sucesso é a soma de pequenos esforços repetidos dia após dia.",
            "Sua única limitação é você mesmo!",
            "Transforme seus sonhos em metas e suas metas em realidade!",
            "Não tenha medo de falhar, tenha medo de não tentar!",
            "Você não precisa ser perfeito, apenas consistente!",
            "O começo é sempre agora!"
        ];

        const frase = frases[Math.floor(Math.random() * frases.length)];

        await sock.sendMessage(remoteJid, {
            text: `${HEADER}
╭━━━⪩ 💪 *MOTIVACIONAL* ⪨━━━
│🇨🇦 
│🇨🇦 ${frase}
│🇨🇦 
╰━━━━━─「🇨🇦」─━━━━━`
        });
    },

    async conselho(ctx) {
        const { sock, msg } = ctx;
        const remoteJid = msg.key.remoteJid;

        const conselhos = [
            "Beba mais água! Seu corpo agradece.",
            "Durma bem, o descanso é fundamental.",
            "Cuide da sua saúde mental, ela é tão importante quanto a física.",
            "Ligue para alguém que você ama hoje.",
            "Aprenda algo novo todos os dias.",
            "Não leve a vida tão a sério, ninguém sai vivo dela mesmo.",
            "Faça exercícios, seu corpo precisa se movimentar.",
            "Leia mais livros, menos redes sociais.",
            "Seja gentil, todo mundo está lutando batalhas que você não conhece.",
            "Invista em você, você é seu maior ativo."
        ];

        const conselho = conselhos[Math.floor(Math.random() * conselhos.length)];

        await sock.sendMessage(remoteJid, {
            text: `${HEADER}
╭━━━⪩ 💡 *CONSELHO* ⪨━━━
│🇨🇦 
│🇨🇦 ${conselho}
│🇨🇦 
╰━━━━━─「🇨🇦」─━━━━━`
        });
    },

    async fato(ctx) {
        const { sock, msg } = ctx;
        const remoteJid = msg.key.remoteJid;

        const fatos = [
            "O mel nunca estraga. Arqueólogos encontraram mel de 3000 anos ainda comestível!",
            "As abelhas podem reconhecer rostos humanos.",
            "O coração de uma baleia-azul é tão grande que um humano pode nadar por suas artérias.",
            "Os polvos têm três corações e sangue azul.",
            "Uma nuvem média pesa cerca de 500 toneladas.",
            "Os golfinhos dormem com um olho aberto.",
            "O DNA humano é 50% igual ao de uma banana.",
            "Os tubarões existem há mais tempo que as árvores.",
            "Uma pulga pode pular 150 vezes sua própria altura.",
            "O Universo tem aproximadamente 13.8 bilhões de anos."
        ];

        const fato = fatos[Math.floor(Math.random() * fatos.length)];

        await sock.sendMessage(remoteJid, {
            text: `${HEADER}
╭━━━⪩ 🧠 *FATO* ⪨━━━
│🇨🇦 
│🇨🇦 ${fato}
│🇨🇦 
╰━━━━━─「🇨🇦」─━━━━━`
        });
    },

    async curiosidade(ctx) {
        return await brincadeirasCommands.fato(ctx);
    },

    async ship(ctx) {
        const { sock, msg, mentions, isGroup } = ctx;
        const remoteJid = msg.key.remoteJid;

        if (!isGroup) {
            return await sock.sendMessage(remoteJid, { text: '❌ Apenas em grupos!' });
        }

        let user1, user2;

        if (mentions && mentions.length >= 2) {
            user1 = mentions[0];
            user2 = mentions[1];
        } else {
            try {
                const groupMetadata = await sock.groupMetadata(remoteJid);
                const participants = groupMetadata.participants;
                user1 = participants[Math.floor(Math.random() * participants.length)].id;
                user2 = participants[Math.floor(Math.random() * participants.length)].id;
                while (user1 === user2) {
                    user2 = participants[Math.floor(Math.random() * participants.length)].id;
                }
            } catch (e) {
                return await sock.sendMessage(remoteJid, { text: '❌ Erro ao buscar membros!' });
            }
        }

        const porcentagem = Math.floor(Math.random() * 101);
        let emoji, status;

        if (porcentagem >= 80) {
            emoji = '💕💕💕';
            status = 'CASAL PERFEITO!';
        } else if (porcentagem >= 60) {
            emoji = '💕💕';
            status = 'Combinam muito!';
        } else if (porcentagem >= 40) {
            emoji = '💕';
            status = 'Pode rolar algo!';
        } else if (porcentagem >= 20) {
            emoji = '💔';
            status = 'Difícil, mas possível...';
        } else {
            emoji = '💔💔';
            status = 'Não foi dessa vez!';
        }

        let barra = '';
        for (let i = 0; i < 10; i++) {
            barra += i < Math.floor(porcentagem / 10) ? '❤️' : '🖤';
        }

        await sock.sendMessage(remoteJid, {
            text: `${HEADER}
╭━━━⪩ 💕 *SHIP* ⪨━━━
│🇨🇦 @${user1.split('@')[0]}
│🇨🇦        ${emoji}
│🇨🇦 @${user2.split('@')[0]}
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ 📊 *RESULTADO* ⪨━━━
│🇨🇦 ${barra}
│🇨🇦 *${porcentagem}%* - ${status}
╰━━━━━─「🇨🇦」─━━━━━`,
            mentions: [user1, user2]
        });
    },

    async casal(ctx) {
        return await brincadeirasCommands.ship(ctx);
    },

    async gay(ctx) {
        const { sock, msg, mentions, senderNumber } = ctx;
        const remoteJid = msg.key.remoteJid;

        const quoted = msg.message?.extendedTextMessage?.contextInfo?.participant;
        let target = mentions?.[0] || quoted || (senderNumber + '@s.whatsapp.net');

        const porcentagem = Math.floor(Math.random() * 101);
        const emoji = porcentagem > 50 ? '🏳️‍🌈' : '👤';

        await sock.sendMessage(remoteJid, {
            text: `${HEADER}
╭━━━⪩ 🏳️‍🌈 *GAYMETRO* ⪨━━━
│🇨🇦 @${target.split('@')[0]}
│🇨🇦 
│🇨🇦 ${emoji} *${porcentagem}%* gay
╰━━━━━─「🇨🇦」─━━━━━`,
            mentions: [target]
        });
    },

    async gado(ctx) {
        const { sock, msg, mentions, senderNumber } = ctx;
        const remoteJid = msg.key.remoteJid;

        const quoted = msg.message?.extendedTextMessage?.contextInfo?.participant;
        let target = mentions?.[0] || quoted || (senderNumber + '@s.whatsapp.net');

        const porcentagem = Math.floor(Math.random() * 101);
        const emoji = porcentagem > 50 ? '🐂' : '👤';

        await sock.sendMessage(remoteJid, {
            text: `${HEADER}
╭━━━⪩ 🐂 *GADOMETRO* ⪨━━━
│🇨🇦 @${target.split('@')[0]}
│🇨🇦 
│🇨🇦 ${emoji} *${porcentagem}%* gado
╰━━━━━─「🇨🇦」─━━━━━`,
            mentions: [target]
        });
    },

    async corno(ctx) {
        const { sock, msg, mentions, senderNumber } = ctx;
        const remoteJid = msg.key.remoteJid;

        const quoted = msg.message?.extendedTextMessage?.contextInfo?.participant;
        let target = mentions?.[0] || quoted || (senderNumber + '@s.whatsapp.net');

        const porcentagem = Math.floor(Math.random() * 101);
        const chifres = Math.floor(porcentagem / 20);
        let emoji = '';
        for (let i = 0; i < chifres; i++) emoji += '🦌';
        if (emoji === '') emoji = '👤';

        await sock.sendMessage(remoteJid, {
            text: `${HEADER}
╭━━━⪩ 🦌 *CORNOMETRO* ⪨━━━
│🇨🇦 @${target.split('@')[0]}
│🇨🇦 
│🇨🇦 ${emoji} *${porcentagem}%* corno
╰━━━━━─「🇨🇦」─━━━━━`,
            mentions: [target]
        });
    },

    async gostoso(ctx) {
        const { sock, msg, mentions, senderNumber } = ctx;
        const remoteJid = msg.key.remoteJid;

        const quoted = msg.message?.extendedTextMessage?.contextInfo?.participant;
        let target = mentions?.[0] || quoted || (senderNumber + '@s.whatsapp.net');

        const porcentagem = Math.floor(Math.random() * 101);
        const emoji = porcentagem > 70 ? '🔥🔥🔥' : porcentagem > 40 ? '🔥🔥' : '🔥';

        await sock.sendMessage(remoteJid, {
            text: `${HEADER}
╭━━━⪩ 🔥 *GOSTOSOMETRO* ⪨━━━
│🇨🇦 @${target.split('@')[0]}
│🇨🇦 
│🇨🇦 ${emoji} *${porcentagem}%* gostoso(a)
╰━━━━━─「🇨🇦」─━━━━━`,
            mentions: [target]
        });
    },

    async beijar(ctx) {
        const { sock, msg, mentions, senderNumber } = ctx;
        const remoteJid = msg.key.remoteJid;

        const quoted = msg.message?.extendedTextMessage?.contextInfo?.participant;
        let target = mentions?.[0] || quoted;

        if (!target) {
            return await sock.sendMessage(remoteJid, { text: '❌ Marque alguém para beijar!' });
        }

        await sock.sendMessage(remoteJid, {
            text: `${HEADER}
╭━━━⪩ 💋 *BEIJO* ⪨━━━
│🇨🇦 
│🇨🇦 @${senderNumber} deu um beijo
│🇨🇦 apaixonado em @${target.split('@')[0]}!
│🇨🇦 
│🇨🇦 💋💕
╰━━━━━─「🇨🇦」─━━━━━`,
            mentions: [senderNumber + '@s.whatsapp.net', target]
        });
    },

    async tapa(ctx) {
        const { sock, msg, mentions, senderNumber } = ctx;
        const remoteJid = msg.key.remoteJid;

        const quoted = msg.message?.extendedTextMessage?.contextInfo?.participant;
        let target = mentions?.[0] || quoted;

        if (!target) {
            return await sock.sendMessage(remoteJid, { text: '❌ Marque alguém para dar um tapa!' });
        }

        await sock.sendMessage(remoteJid, {
            text: `${HEADER}
╭━━━⪩ 👋 *TAPA* ⪨━━━
│🇨🇦 
│🇨🇦 @${senderNumber} deu um TAPA
│🇨🇦 na cara de @${target.split('@')[0]}!
│🇨🇦 
│🇨🇦 👋💥
╰━━━━━─「🇨🇦」─━━━━━`,
            mentions: [senderNumber + '@s.whatsapp.net', target]
        });
    },

    async matar(ctx) {
        const { sock, msg, mentions, senderNumber } = ctx;
        const remoteJid = msg.key.remoteJid;

        const quoted = msg.message?.extendedTextMessage?.contextInfo?.participant;
        let target = mentions?.[0] || quoted;

        if (!target) {
            return await sock.sendMessage(remoteJid, { text: '❌ Marque alguém!' });
        }

        const mortes = [
            'jogou de um penhasco',
            'envenenou a comida',
            'atropelou com um caminhão',
            'empurrou na lava',
            'mandou pro espaço',
            'afogou na privada',
            'eliminou com um tiro certeiro',
            'explodiu com TNT'
        ];

        const morte = mortes[Math.floor(Math.random() * mortes.length)];

        await sock.sendMessage(remoteJid, {
            text: `${HEADER}
╭━━━⪩ ☠️ *ASSASSINATO* ⪨━━━
│🇨🇦 
│🇨🇦 @${senderNumber} ${morte}
│🇨🇦 de @${target.split('@')[0]}!
│🇨🇦 
│🇨🇦 ☠️💀
╰━━━━━─「🇨🇦」─━━━━━`,
            mentions: [senderNumber + '@s.whatsapp.net', target]
        });
    },

    async zoeira(ctx) {
        const { sock, msg } = ctx;
        const remoteJid = msg.key.remoteJid;

        const zoeiras = [
            "Seu cachorro late e foge de você! 🐕",
            "Até o GPS desiste de te ajudar! 🗺️",
            "Você é tão lerdo que perdeu pro caracol! 🐌",
            "Sua mãe te ama... por obrigação! 😂",
            "Você é a prova de que Darwin estava errado! 🐒",
            "Se beleza desse dinheiro, você estaria devendo! 💸",
            "Você é tão sem graça que até o TikTok te bloqueia! 📱",
            "Quando você nasceu, até o médico pediu desculpas! 👨‍⚕️",
            "Você é a ovelha negra... do rebanho errado! 🐑",
            "Se fosse inteligência, você seria uma torrada queimada! 🍞"
        ];

        const zoeira = zoeiras[Math.floor(Math.random() * zoeiras.length)];

        await sock.sendMessage(remoteJid, {
            text: `${HEADER}
╭━━━⪩ 🤣 *ZOEIRA* ⪨━━━
│🇨🇦 
│🇨🇦 ${zoeira}
│🇨🇦 
╰━━━━━─「🇨🇦」─━━━━━`
        });
    },

    async pegadinha(ctx) {
        const { sock, msg } = ctx;
        const remoteJid = msg.key.remoteJid;

        const pegadinhas = [
            "🚨 URGENTE: O grupo foi denunciado e será banido em 24h! (mentira kk)",
            "📢 O WhatsApp vai começar a cobrar R$5/mês! Compartilhe! (fake)",
            "⚠️ Seu número foi clonado! Ligue 190 agora! (brinks)",
            "🎁 Você ganhou um iPhone 15! Clique aqui para resgatar! (sqn)",
            "💀 Esse grupo foi hackeado... (zuera kkkk)",
            "🔴 ATENÇÃO: O admin vai apagar o grupo! (mentira)",
            "📱 O WhatsApp detectou vírus no seu celular! (calma, é fake)",
            "⚡ Sua conta foi suspensa por spam! (brincadeira)",
            "🎭 O grupo mudou de nome para 'Fãs do Felipe Neto'! (pegadinha)",
            "💣 Uma bomba de glitter vai explodir aqui em 3... 2... 1... 🎊"
        ];

        const pegadinha = pegadinhas[Math.floor(Math.random() * pegadinhas.length)];

        await sock.sendMessage(remoteJid, { text: pegadinha });
    },

    async menubrincadeiras(ctx) {
        const { sock, msg } = ctx;
        const remoteJid = msg.key.remoteJid;
        const prefix = settings.prefix;

        const menu = `${HEADER}
╭━━━⪩ 😂 *TEXTO* ⪨━━━
│🇨🇦 ${prefix}piada
│🇨🇦 ${prefix}cantada
│🇨🇦 ${prefix}frase
│🇨🇦 ${prefix}motivacional
│🇨🇦 ${prefix}conselho
│🇨🇦 ${prefix}fato
│🇨🇦 ${prefix}curiosidade
│🇨🇦 ${prefix}zoeira
│🇨🇦 ${prefix}pegadinha
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ 👥 *INTERACAO* ⪨━━━
│🇨🇦 ${prefix}ship
│🇨🇦 ${prefix}casal
│🇨🇦 ${prefix}gay @user
│🇨🇦 ${prefix}gado @user
│🇨🇦 ${prefix}corno @user
│🇨🇦 ${prefix}gostoso @user
│🇨🇦 ${prefix}beijar @user
│🇨🇦 ${prefix}tapa @user
│🇨🇦 ${prefix}matar @user
╰━━━━━─「🇨🇦」─━━━━━`;

        await sock.sendMessage(remoteJid, { text: menu });
    }
};

module.exports = brincadeirasCommands;
