const settings = require('../config/settings');
const db = require('../storage/database');

const HEADER = `╔♡━━━━━━━━━━━━━━━━━━━━━━♡╗
║  🇨🇦 *ALIANCA BRATVA* 🇨🇦  ║
╚♡━━━━━━━━━━━━━━━━━━━━━━♡╝`;

// Função auxiliar para pegar 5 membros aleatórios
async function getRandomMembers(sock, groupId, count = 5) {
    try {
        const metadata = await sock.groupMetadata(groupId);
        const members = metadata.participants.map(p => p.id);
        const shuffled = members.sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(count, members.length));
    } catch (e) {
        return [];
    }
}

// Frases para sorte alta (70-100)
const frasesAltas = [
    "🔥 VAI NA FÉ! Hoje é seu dia de glória!",
    "⭐ Tá abençoado demais! Aproveita!",
    "🎯 Pode ir sem medo, a sorte tá do seu lado!",
    "💎 Tá com a estrela brilhando forte!",
    "🚀 Nada vai te parar hoje! Manda ver!",
    "🏆 Campeão! Sua sorte tá nas alturas!",
    "✨ O universo conspira a seu favor!",
    "🎰 Aposta que hoje você ganha!",
    "👑 Rei da sorte! Vai com tudo!",
    "🌟 Hoje você é intocável!"
];

// Frases para sorte média (40-69)
const frasesMedias = [
    "😎 Tá no caminho certo, segue firme!",
    "🤔 Pode arriscar, mas com cuidado...",
    "⚖️ Meio a meio, vai no feeling!",
    "🎲 Dá pra tentar, mas não exagera!",
    "🌤️ Tá ok, não é o melhor dia mas dá pra ir!",
    "💭 Pensa bem antes de agir!",
    "🔮 A sorte tá neutra, depende de você!",
    "🎯 50/50, vai na sua intuição!"
];

// Frases para sorte baixa (0-39)
const frasesBaixas = [
    "💀 Para tudo! Hoje não é seu dia!",
    "⚠️ Melhor ficar quietinho hoje...",
    "🚫 Nem pensa em arriscar agora!",
    "😬 Eita, melhor esperar outro dia!",
    "🙏 Reza forte e fica em casa!",
    "❌ O universo disse NÃO!",
    "🥶 Tá azarado demais, cuidado!",
    "💔 Não vai dar certo, desiste!",
    "🌧️ Dia nublado pra você...",
    "🐢 Vai devagar hoje, sem pressa!"
];

// Função para enviar resposta com mídia customizada
async function sendWithCustomMedia(sock, remoteJid, defaultText, customMedia, mentions = [], replacements = {}) {
    let text = defaultText;
    
    // Usa texto customizado se disponível
    if (customMedia && customMedia.text) {
        text = customMedia.text;
        // Substitui variáveis
        for (const [key, value] of Object.entries(replacements)) {
            text = text.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
        }
    }
    
    // Se tem mídia customizada
    if (customMedia && customMedia.media) {
        try {
            const buffer = Buffer.from(customMedia.media.data, 'base64');
            const mediaType = customMedia.media.type;
            
            if (mediaType === 'image') {
                await sock.sendMessage(remoteJid, {
                    image: buffer,
                    caption: text,
                    mentions
                });
            } else if (mediaType === 'video') {
                await sock.sendMessage(remoteJid, {
                    video: buffer,
                    caption: text,
                    mentions
                });
            } else if (mediaType === 'audio') {
                await sock.sendMessage(remoteJid, { text, mentions });
                await sock.sendMessage(remoteJid, {
                    audio: buffer,
                    mimetype: customMedia.media.mimetype || 'audio/mp4'
                });
            }
            return;
        } catch (e) {
            console.log('[MEDIA] Erro ao enviar mídia customizada:', e.message);
        }
    }
    
    // Fallback: envia só texto
    await sock.sendMessage(remoteJid, { text, mentions });
}

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
        const { sock, msg, mentions, senderNumber, getRealJid } = ctx;
        const remoteJid = msg.key.remoteJid;

        const quotedRaw = msg.message?.extendedTextMessage?.contextInfo?.participant;
        const quoted = getRealJid ? getRealJid(quotedRaw) : quotedRaw;
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
        const { sock, msg, mentions, senderNumber, getRealJid } = ctx;
        const remoteJid = msg.key.remoteJid;

        const quotedRaw = msg.message?.extendedTextMessage?.contextInfo?.participant;
        const quoted = getRealJid ? getRealJid(quotedRaw) : quotedRaw;
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
        const { sock, msg, mentions, senderNumber, getRealJid } = ctx;
        const remoteJid = msg.key.remoteJid;

        const quotedRaw = msg.message?.extendedTextMessage?.contextInfo?.participant;
        const quoted = getRealJid ? getRealJid(quotedRaw) : quotedRaw;
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
        const { sock, msg, mentions, senderNumber, getRealJid } = ctx;
        const remoteJid = msg.key.remoteJid;

        const quotedRaw = msg.message?.extendedTextMessage?.contextInfo?.participant;
        const quoted = getRealJid ? getRealJid(quotedRaw) : quotedRaw;
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
        const { sock, msg, mentions, senderNumber, getRealJid, customMedia } = ctx;
        const remoteJid = msg.key.remoteJid;

        const quotedRaw = msg.message?.extendedTextMessage?.contextInfo?.participant;
        const quoted = getRealJid ? getRealJid(quotedRaw) : quotedRaw;
        let target = mentions?.[0] || quoted;

        if (!target) {
            return await sock.sendMessage(remoteJid, { text: '❌ Marque alguém para beijar!' });
        }

        const defaultText = `${HEADER}
╭━━━⪩ 💋 *BEIJO* ⪨━━━
│🇨🇦 
│🇨🇦 @${senderNumber} deu um beijo
│🇨🇦 apaixonado em @${target.split('@')[0]}!
│🇨🇦 
│🇨🇦 💋💕
╰━━━━━─「🇨🇦」─━━━━━`;

        await sendWithCustomMedia(
            sock, remoteJid, defaultText, customMedia,
            [senderNumber + '@s.whatsapp.net', target],
            { user: `@${senderNumber}`, target: `@${target.split('@')[0]}` }
        );
    },

    async tapa(ctx) {
        const { sock, msg, mentions, senderNumber, getRealJid, customMedia } = ctx;
        const remoteJid = msg.key.remoteJid;

        const quotedRaw = msg.message?.extendedTextMessage?.contextInfo?.participant;
        const quoted = getRealJid ? getRealJid(quotedRaw) : quotedRaw;
        let target = mentions?.[0] || quoted;

        if (!target) {
            return await sock.sendMessage(remoteJid, { text: '❌ Marque alguém para dar um tapa!' });
        }

        const defaultText = `${HEADER}
╭━━━⪩ 👋 *TAPA* ⪨━━━
│🇨🇦 
│🇨🇦 @${senderNumber} deu um TAPA
│🇨🇦 na cara de @${target.split('@')[0]}!
│🇨🇦 
│🇨🇦 👋💥
╰━━━━━─「🇨🇦」─━━━━━`;

        await sendWithCustomMedia(
            sock, remoteJid, defaultText, customMedia,
            [senderNumber + '@s.whatsapp.net', target],
            { user: `@${senderNumber}`, target: `@${target.split('@')[0]}` }
        );
    },

    async matar(ctx) {
        const { sock, msg, mentions, senderNumber, getRealJid, customMedia } = ctx;
        const remoteJid = msg.key.remoteJid;

        const quotedRaw = msg.message?.extendedTextMessage?.contextInfo?.participant;
        const quoted = getRealJid ? getRealJid(quotedRaw) : quotedRaw;
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

        const defaultText = `${HEADER}
╭━━━⪩ ☠️ *ASSASSINATO* ⪨━━━
│🇨🇦 
│🇨🇦 @${senderNumber} ${morte}
│🇨🇦 de @${target.split('@')[0]}!
│🇨🇦 
│🇨🇦 ☠️💀
╰━━━━━─「🇨🇦」─━━━━━`;

        await sendWithCustomMedia(
            sock, remoteJid, defaultText, customMedia,
            [senderNumber + '@s.whatsapp.net', target],
            { user: `@${senderNumber}`, target: `@${target.split('@')[0]}` }
        );
    },

    // Comando comer (para o dono customizar)
    async comer(ctx) {
        const { sock, msg, mentions, senderNumber, getRealJid, customMedia } = ctx;
        const remoteJid = msg.key.remoteJid;

        const quotedRaw = msg.message?.extendedTextMessage?.contextInfo?.participant;
        const quoted = getRealJid ? getRealJid(quotedRaw) : quotedRaw;
        let target = mentions?.[0] || quoted;

        if (!target) {
            return await sock.sendMessage(remoteJid, { text: '❌ Marque alguém!' });
        }

        const defaultText = `${HEADER}
╭━━━⪩ 🍑 *COMEU* ⪨━━━
│🇨🇦 
│🇨🇦 @${senderNumber} comeu
│🇨🇦 @${target.split('@')[0]}!
│🇨🇦 
│🇨🇦 🍑🔥
╰━━━━━─「🇨🇦」─━━━━━`;

        await sendWithCustomMedia(
            sock, remoteJid, defaultText, customMedia,
            [senderNumber + '@s.whatsapp.net', target],
            { user: `@${senderNumber}`, target: `@${target.split('@')[0]}` }
        );
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

    // ========== COMANDO SORTE ==========
    async sorte(ctx) {
        const { sock, msg, senderNumber } = ctx;
        const remoteJid = msg.key.remoteJid;

        const numero = Math.floor(Math.random() * 101);
        let frase, emoji, barra = '';
        
        // Monta barra visual
        for (let i = 0; i < 10; i++) {
            barra += i < Math.floor(numero / 10) ? '🟢' : '⚫';
        }

        if (numero >= 70) {
            frase = frasesAltas[Math.floor(Math.random() * frasesAltas.length)];
            emoji = '🍀';
        } else if (numero >= 40) {
            frase = frasesMedias[Math.floor(Math.random() * frasesMedias.length)];
            emoji = '🎲';
        } else {
            frase = frasesBaixas[Math.floor(Math.random() * frasesBaixas.length)];
            emoji = '💀';
        }

        await sock.sendMessage(remoteJid, {
            text: `${HEADER}
╭━━━⪩ ${emoji} *SUA SORTE* ⪨━━━
│🇨🇦 @${senderNumber}
│🇨🇦 
│🇨🇦 ${barra}
│🇨🇦 *${numero}%* de sorte
│🇨🇦 
│🇨🇦 ${frase}
╰━━━━━─「🇨🇦」─━━━━━`,
            mentions: [senderNumber + '@s.whatsapp.net']
        });
    },

    // ========== RANKS ==========
    async rankgay(ctx) {
        const { sock, msg, isGroup } = ctx;
        const remoteJid = msg.key.remoteJid;

        if (!isGroup) return await sock.sendMessage(remoteJid, { text: '❌ Apenas em grupos!' });

        const members = await getRandomMembers(sock, remoteJid, 5);
        if (members.length === 0) return await sock.sendMessage(remoteJid, { text: '❌ Erro ao buscar membros!' });

        let ranking = '';
        const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
        members.forEach((m, i) => {
            ranking += `│🇨🇦 ${medals[i]} @${m.split('@')[0]}\n`;
        });

        await sock.sendMessage(remoteJid, {
            text: `${HEADER}
╭━━━⪩ 🏳️‍🌈 *RANK GAY* ⪨━━━
${ranking}╰━━━━━─「🇨🇦」─━━━━━`,
            mentions: members
        });
    },

    async rankpau(ctx) {
        const { sock, msg, isGroup } = ctx;
        const remoteJid = msg.key.remoteJid;

        if (!isGroup) return await sock.sendMessage(remoteJid, { text: '❌ Apenas em grupos!' });

        const members = await getRandomMembers(sock, remoteJid, 5);
        if (members.length === 0) return await sock.sendMessage(remoteJid, { text: '❌ Erro ao buscar membros!' });

        let ranking = '';
        const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
        const sizes = ['30cm', '25cm', '22cm', '18cm', '15cm'];
        members.forEach((m, i) => {
            ranking += `│🇨🇦 ${medals[i]} @${m.split('@')[0]} - ${sizes[i]}\n`;
        });

        await sock.sendMessage(remoteJid, {
            text: `${HEADER}
╭━━━⪩ 🍆 *RANK DOTADOS* ⪨━━━
${ranking}╰━━━━━─「🇨🇦」─━━━━━`,
            mentions: members
        });
    },

    async rankxrc(ctx) {
        const { sock, msg, isGroup } = ctx;
        const remoteJid = msg.key.remoteJid;

        if (!isGroup) return await sock.sendMessage(remoteJid, { text: '❌ Apenas em grupos!' });

        const members = await getRandomMembers(sock, remoteJid, 5);
        if (members.length === 0) return await sock.sendMessage(remoteJid, { text: '❌ Erro ao buscar membros!' });

        let ranking = '';
        const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
        members.forEach((m, i) => {
            ranking += `│🇨🇦 ${medals[i]} @${m.split('@')[0]}\n`;
        });

        await sock.sendMessage(remoteJid, {
            text: `${HEADER}
╭━━━⪩ ❄️ *RANK CHEIRADORES* ⪨━━━
${ranking}╰━━━━━─「🇨🇦」─━━━━━`,
            mentions: members
        });
    },

    async rankhetero(ctx) {
        const { sock, msg, isGroup } = ctx;
        const remoteJid = msg.key.remoteJid;

        if (!isGroup) return await sock.sendMessage(remoteJid, { text: '❌ Apenas em grupos!' });

        const members = await getRandomMembers(sock, remoteJid, 5);
        if (members.length === 0) return await sock.sendMessage(remoteJid, { text: '❌ Erro ao buscar membros!' });

        let ranking = '';
        const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
        members.forEach((m, i) => {
            ranking += `│🇨🇦 ${medals[i]} @${m.split('@')[0]}\n`;
        });

        await sock.sendMessage(remoteJid, {
            text: `${HEADER}
╭━━━⪩ 💪 *RANK HÉTEROS* ⪨━━━
${ranking}╰━━━━━─「🇨🇦」─━━━━━`,
            mentions: members
        });
    },

    async rankcorno(ctx) {
        const { sock, msg, isGroup } = ctx;
        const remoteJid = msg.key.remoteJid;

        if (!isGroup) return await sock.sendMessage(remoteJid, { text: '❌ Apenas em grupos!' });

        const members = await getRandomMembers(sock, remoteJid, 5);
        if (members.length === 0) return await sock.sendMessage(remoteJid, { text: '❌ Erro ao buscar membros!' });

        let ranking = '';
        const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
        const chifres = ['🦌🦌🦌🦌🦌', '🦌🦌🦌🦌', '🦌🦌🦌', '🦌🦌', '🦌'];
        members.forEach((m, i) => {
            ranking += `│🇨🇦 ${medals[i]} @${m.split('@')[0]} ${chifres[i]}\n`;
        });

        await sock.sendMessage(remoteJid, {
            text: `${HEADER}
╭━━━⪩ 🦌 *RANK CORNOS* ⪨━━━
${ranking}╰━━━━━─「🇨🇦」─━━━━━`,
            mentions: members
        });
    },

    async rankgado(ctx) {
        const { sock, msg, isGroup } = ctx;
        const remoteJid = msg.key.remoteJid;

        if (!isGroup) return await sock.sendMessage(remoteJid, { text: '❌ Apenas em grupos!' });

        const members = await getRandomMembers(sock, remoteJid, 5);
        if (members.length === 0) return await sock.sendMessage(remoteJid, { text: '❌ Erro ao buscar membros!' });

        let ranking = '';
        const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
        members.forEach((m, i) => {
            ranking += `│🇨🇦 ${medals[i]} @${m.split('@')[0]}\n`;
        });

        await sock.sendMessage(remoteJid, {
            text: `${HEADER}
╭━━━⪩ 🐂 *RANK GADOS* ⪨━━━
${ranking}╰━━━━━─「🇨🇦」─━━━━━`,
            mentions: members
        });
    },

    async rankfeio(ctx) {
        const { sock, msg, isGroup } = ctx;
        const remoteJid = msg.key.remoteJid;

        if (!isGroup) return await sock.sendMessage(remoteJid, { text: '❌ Apenas em grupos!' });

        const members = await getRandomMembers(sock, remoteJid, 5);
        if (members.length === 0) return await sock.sendMessage(remoteJid, { text: '❌ Erro ao buscar membros!' });

        let ranking = '';
        const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
        members.forEach((m, i) => {
            ranking += `│🇨🇦 ${medals[i]} @${m.split('@')[0]}\n`;
        });

        await sock.sendMessage(remoteJid, {
            text: `${HEADER}
╭━━━⪩ 🤢 *RANK FEIOS* ⪨━━━
${ranking}╰━━━━━─「🇨🇦」─━━━━━`,
            mentions: members
        });
    },

    async rankbonito(ctx) {
        const { sock, msg, isGroup } = ctx;
        const remoteJid = msg.key.remoteJid;

        if (!isGroup) return await sock.sendMessage(remoteJid, { text: '❌ Apenas em grupos!' });

        const members = await getRandomMembers(sock, remoteJid, 5);
        if (members.length === 0) return await sock.sendMessage(remoteJid, { text: '❌ Erro ao buscar membros!' });

        let ranking = '';
        const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
        members.forEach((m, i) => {
            ranking += `│🇨🇦 ${medals[i]} @${m.split('@')[0]}\n`;
        });

        await sock.sendMessage(remoteJid, {
            text: `${HEADER}
╭━━━⪩ 😍 *RANK BONITOS* ⪨━━━
${ranking}╰━━━━━─「🇨🇦」─━━━━━`,
            mentions: members
        });
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
│🇨🇦 ${prefix}zoeira
│🇨🇦 ${prefix}pegadinha
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ 🎲 *SORTE* ⪨━━━
│🇨🇦 ${prefix}sorte
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ 🏆 *RANKS* ⪨━━━
│🇨🇦 ${prefix}rankgay
│🇨🇦 ${prefix}rankpau
│🇨🇦 ${prefix}rankxrc
│🇨🇦 ${prefix}rankhetero
│🇨🇦 ${prefix}rankcorno
│🇨🇦 ${prefix}rankgado
│🇨🇦 ${prefix}rankfeio
│🇨🇦 ${prefix}rankbonito
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ 👥 *INTERACAO* ⪨━━━
│🇨🇦 ${prefix}ship
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
