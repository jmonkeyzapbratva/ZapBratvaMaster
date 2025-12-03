const helpers = require('../utils/helpers');

const piadas = [
    "Por que o livro de matemática foi ao psicólogo? Porque tinha muitos problemas!",
    "O que o zero disse para o oito? Que cinto legal!",
    "Por que o elétron nunca ganha no poker? Porque ele é sempre negativo!",
    "O que um DNA disse para o outro? Somos geneticamente parecidos!",
    "Por que o computador foi ao médico? Porque estava com vírus!",
    "O que a porta disse para a chave? Você me completa!",
    "Por que o livro de matemática ficou triste? Porque tinha muitos problemas!",
    "Qual é o animal mais antigo? A zebra, porque é em preto e branco!",
    "Por que o fantasma mente? Porque ele é transparente!",
    "O que o pato disse para a pata? Vem quá!"
];

const frases = [
    "O sucesso é a soma de pequenos esforços repetidos dia após dia. - Robert Collier",
    "Acredite em você mesmo e todo o resto virá naturalmente.",
    "O único modo de fazer um excelente trabalho é amar o que você faz. - Steve Jobs",
    "Não espere por oportunidades extraordinárias. Agarre ocasiões comuns e as faça grandes.",
    "O pessimista vê dificuldade em cada oportunidade. O otimista vê oportunidade em cada dificuldade.",
    "A persistência é o caminho do êxito. - Charles Chaplin",
    "Você é mais corajoso do que acredita, mais forte do que parece e mais inteligente do que pensa.",
    "O maior erro que você pode cometer é ter medo de cometer erros.",
    "Sonhos determinam o que você quer. Ação determina o que você conquista.",
    "Seja a mudança que você quer ver no mundo. - Gandhi"
];

const cantadas = [
    "Você é Wi-Fi? Porque estou sentindo uma conexão!",
    "Você é um empréstimo? Porque você tem o meu interesse!",
    "Você é uma câmera? Porque toda vez que te olho, eu sorrio!",
    "Você é um mapa? Porque me perdi nos seus olhos!",
    "Você é um ímã? Porque me sinto atraído por você!",
    "Você é Google? Porque tem tudo o que eu procuro!",
    "Você é Netflix? Porque eu poderia passar horas olhando pra você!",
    "Você é um dicionário? Porque você dá significado à minha vida!",
    "Você é um semáforo? Porque quando te vejo, paro!",
    "Você é café? Porque você me deixa acordado à noite pensando em você!"
];

const zoeiras = [
    "Você é tão sem graça que até o corretor do celular te ignora!",
    "Se burrice fosse talento, você seria um gênio!",
    "Você é tipo Windows Vista... Ninguém pediu e ninguém quer!",
    "Você é tão lerdo que perdeu uma corrida para uma tartaruga... em câmera lenta!",
    "Se você fosse um processador, seria um 386... ultrapassado!",
    "Você é tipo Internet Explorer... Sempre atrasado!",
    "Se você fosse um pássaro, seria uma galinha... Não consegue voar!",
    "Você é tão confuso que se perdeu seguindo o GPS!",
    "Se inteligência fosse vírus, você seria imune!",
    "Você é tipo update do Windows... Aparece na hora errada e ninguém quer!"
];

const verdades = [
    "Qual foi a maior mentira que você já contou?",
    "Qual é o seu maior medo?",
    "Você já teve uma crush em alguém desse grupo?",
    "Qual foi a coisa mais constrangedora que você já fez?",
    "Qual é o segredo que você nunca contou para ninguém?",
    "Você já fingiu gostar de alguém?",
    "Qual foi a pior coisa que você já fez escondido?",
    "Você já stalkeou alguém nas redes sociais?",
    "Qual é a sua maior insegurança?",
    "Você já se arrependeu de algo que disse?"
];

const desafios = [
    "Mande um áudio cantando sua música favorita!",
    "Mande uma foto sua fazendo careta!",
    "Fique sem usar o celular por 1 hora!",
    "Mande uma mensagem em outro idioma!",
    "Faça 10 flexões e mande um áudio ofegante!",
    "Imite um animal em áudio!",
    "Mande um print do último meme que você salvou!",
    "Conte uma história embaraçosa sua em áudio!",
    "Mande uma foto do lugar onde você está agora!",
    "Mande um áudio imitando alguém famoso!"
];

const quizQuestions = [
    { pergunta: "Qual é o maior planeta do sistema solar?", resposta: "júpiter" },
    { pergunta: "Quantos ossos tem o corpo humano adulto?", resposta: "206" },
    { pergunta: "Qual é o animal mais rápido do mundo?", resposta: "guepardo" },
    { pergunta: "Em que ano o Brasil foi descoberto?", resposta: "1500" },
    { pergunta: "Qual é a capital da França?", resposta: "paris" },
    { pergunta: "Quantos continentes existem?", resposta: "7" },
    { pergunta: "Qual é o maior oceano do mundo?", resposta: "pacífico" },
    { pergunta: "Quem pintou a Mona Lisa?", resposta: "leonardo da vinci" },
    { pergunta: "Qual o símbolo químico da água?", resposta: "h2o" },
    { pergunta: "Quantas cores tem o arco-íris?", resposta: "7" }
];

const commands = {
    dado: async (ctx) => {
        const { sock, msg } = ctx;
        const resultado = helpers.randomInt(1, 6);
        const dados = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: `🎲 *DADO ROLADO*\n\n${dados[resultado - 1]} Resultado: *${resultado}*`
        });
    },
    
    moeda: async (ctx) => {
        const { sock, msg } = ctx;
        const resultado = helpers.randomChoice(['Cara', 'Coroa']);
        const emoji = resultado === 'Cara' ? '🪙' : '💿';
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: `${emoji} *MOEDA LANÇADA*\n\nResultado: *${resultado}*!`
        });
    },
    
    ppt: async (ctx) => {
        const { sock, msg, args } = ctx;
        const escolhas = ['pedra', 'papel', 'tesoura'];
        const emojis = { pedra: '🪨', papel: '📄', tesoura: '✂️' };
        
        if (!args[0] || !escolhas.includes(args[0].toLowerCase())) {
            return await sock.sendMessage(msg.key.remoteJid, {
                text: '❌ Escolha: pedra, papel ou tesoura!\n\nExemplo: !ppt pedra'
            });
        }
        
        const jogador = args[0].toLowerCase();
        const bot = helpers.randomChoice(escolhas);
        
        let resultado;
        if (jogador === bot) {
            resultado = '🤝 *EMPATE!*';
        } else if (
            (jogador === 'pedra' && bot === 'tesoura') ||
            (jogador === 'papel' && bot === 'pedra') ||
            (jogador === 'tesoura' && bot === 'papel')
        ) {
            resultado = '🎉 *VOCÊ VENCEU!*';
        } else {
            resultado = '😢 *VOCÊ PERDEU!*';
        }
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: `🎮 *PEDRA, PAPEL, TESOURA*\n\n` +
                  `Você: ${emojis[jogador]} ${jogador}\n` +
                  `Bot: ${emojis[bot]} ${bot}\n\n` +
                  `${resultado}`
        });
    },
    
    slot: async (ctx) => {
        const { sock, msg } = ctx;
        const simbolos = ['🍎', '🍊', '🍋', '🍇', '🍒', '💎', '7️⃣', '🔔'];
        
        const s1 = helpers.randomChoice(simbolos);
        const s2 = helpers.randomChoice(simbolos);
        const s3 = helpers.randomChoice(simbolos);
        
        let resultado;
        if (s1 === s2 && s2 === s3) {
            resultado = '🎉 *JACKPOT!* Você ganhou!';
        } else if (s1 === s2 || s2 === s3 || s1 === s3) {
            resultado = '😊 *QUASE!* Dois iguais!';
        } else {
            resultado = '😢 *PERDEU!* Tente novamente!';
        }
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: `🎰 *CAÇA-NÍQUEIS*\n\n` +
                  `╔═══════════╗\n` +
                  `║ ${s1} │ ${s2} │ ${s3} ║\n` +
                  `╚═══════════╝\n\n` +
                  `${resultado}`
        });
    },
    
    quiz: async (ctx) => {
        const { sock, msg } = ctx;
        const question = helpers.randomChoice(quizQuestions);
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: `🧠 *QUIZ*\n\n` +
                  `❓ ${question.pergunta}\n\n` +
                  `💡 Responda com a resposta correta!\n` +
                  `(Resposta: ||${question.resposta}||)`
        });
    },
    
    advinha: async (ctx) => {
        const { sock, msg, args } = ctx;
        const numero = helpers.randomInt(1, 10);
        
        if (!args[0]) {
            return await sock.sendMessage(msg.key.remoteJid, {
                text: '🔢 *ADIVINHE O NÚMERO*\n\n' +
                      'Estou pensando em um número de 1 a 10!\n' +
                      'Use: !advinha [número]'
            });
        }
        
        const palpite = parseInt(args[0]);
        
        if (isNaN(palpite) || palpite < 1 || palpite > 10) {
            return await sock.sendMessage(msg.key.remoteJid, {
                text: '❌ Digite um número de 1 a 10!'
            });
        }
        
        if (palpite === numero) {
            await sock.sendMessage(msg.key.remoteJid, {
                text: `🎉 *ACERTOU!*\n\nO número era *${numero}*! Parabéns!`
            });
        } else {
            await sock.sendMessage(msg.key.remoteJid, {
                text: `😢 *ERROU!*\n\nO número era *${numero}*! Tente novamente!`
            });
        }
    },
    
    piada: async (ctx) => {
        const { sock, msg } = ctx;
        const piada = helpers.randomChoice(piadas);
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: `😂 *PIADA*\n\n${piada}`
        });
    },
    
    frase: async (ctx) => {
        const { sock, msg } = ctx;
        const frase = helpers.randomChoice(frases);
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: `💭 *FRASE MOTIVACIONAL*\n\n"${frase}"`
        });
    },
    
    cantada: async (ctx) => {
        const { sock, msg } = ctx;
        const cantada = helpers.randomChoice(cantadas);
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: `💕 *CANTADA*\n\n${cantada}`
        });
    },
    
    zoeira: async (ctx) => {
        const { sock, msg } = ctx;
        const zoeira = helpers.randomChoice(zoeiras);
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: `😈 *ZOEIRA*\n\n${zoeira}`
        });
    },
    
    verdade: async (ctx) => {
        const { sock, msg } = ctx;
        const verdade = helpers.randomChoice(verdades);
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: `🤔 *VERDADE*\n\n${verdade}`
        });
    },
    
    desafio: async (ctx) => {
        const { sock, msg } = ctx;
        const desafio = helpers.randomChoice(desafios);
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: `🎯 *DESAFIO*\n\n${desafio}`
        });
    },
    
    ship: async (ctx) => {
        const { sock, msg, isGroup, groupMetadata } = ctx;
        
        if (!isGroup) {
            return await sock.sendMessage(msg.key.remoteJid, {
                text: '❌ Este comando só funciona em grupos!'
            });
        }
        
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        
        if (mentioned.length < 2) {
            return await sock.sendMessage(msg.key.remoteJid, {
                text: '❌ Marque duas pessoas!\n\nExemplo: !ship @pessoa1 @pessoa2'
            });
        }
        
        const porcentagem = helpers.randomInt(0, 100);
        let status;
        
        if (porcentagem >= 80) status = '💕 AMOR VERDADEIRO!';
        else if (porcentagem >= 60) status = '💖 Bom casal!';
        else if (porcentagem >= 40) status = '💛 Talvez dê certo...';
        else if (porcentagem >= 20) status = '💔 Improvável...';
        else status = '💀 Sem chance!';
        
        const n1 = helpers.extractNumber(mentioned[0]);
        const n2 = helpers.extractNumber(mentioned[1]);
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: `💕 *SHIP*\n\n` +
                  `@${n1} ❤️ @${n2}\n\n` +
                  `Compatibilidade: *${porcentagem}%*\n` +
                  `${status}`,
            mentions: mentioned
        });
    },
    
    casal: async (ctx) => {
        const { sock, msg, isGroup, groupMetadata } = ctx;
        
        if (!isGroup) {
            return await sock.sendMessage(msg.key.remoteJid, {
                text: '❌ Este comando só funciona em grupos!'
            });
        }
        
        const participants = groupMetadata.participants;
        if (participants.length < 2) {
            return await sock.sendMessage(msg.key.remoteJid, {
                text: '❌ O grupo precisa ter pelo menos 2 membros!'
            });
        }
        
        const shuffled = helpers.shuffleArray(participants);
        const p1 = shuffled[0].id;
        const p2 = shuffled[1].id;
        const n1 = helpers.extractNumber(p1);
        const n2 = helpers.extractNumber(p2);
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: `💕 *CASAL SORTEADO*\n\n` +
                  `@${n1} ❤️ @${n2}\n\n` +
                  `Agora é oficial!`,
            mentions: [p1, p2]
        });
    },
    
    gay: async (ctx) => {
        const { sock, msg } = ctx;
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        const target = mentioned[0] || msg.key.participant || msg.key.remoteJid;
        const number = helpers.extractNumber(target);
        const porcentagem = helpers.randomInt(0, 100);
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: `🏳️‍🌈 *TESTE GAY*\n\n` +
                  `@${number} é *${porcentagem}%* gay!`,
            mentions: [target]
        });
    },
    
    gado: async (ctx) => {
        const { sock, msg } = ctx;
        const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        const target = mentioned[0] || msg.key.participant || msg.key.remoteJid;
        const number = helpers.extractNumber(target);
        const porcentagem = helpers.randomInt(0, 100);
        
        let status;
        if (porcentagem >= 80) status = '🐂 SUPER GADO!';
        else if (porcentagem >= 60) status = '🐄 Gado demais!';
        else if (porcentagem >= 40) status = '🐮 Gadinho...';
        else if (porcentagem >= 20) status = '🐃 Quase livre...';
        else status = '🦁 LIVRE!';
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: `🐄 *TESTE DE GADO*\n\n` +
                  `@${number} é *${porcentagem}%* gado!\n` +
                  `${status}`,
            mentions: [target]
        });
    },
    
    sorteia: async (ctx) => {
        const { sock, msg, isGroup, groupMetadata } = ctx;
        
        if (!isGroup) {
            return await sock.sendMessage(msg.key.remoteJid, {
                text: '❌ Este comando só funciona em grupos!'
            });
        }
        
        const participants = groupMetadata.participants;
        const sorteado = helpers.randomChoice(participants);
        const number = helpers.extractNumber(sorteado.id);
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: `🎲 *SORTEIO*\n\n` +
                  `O sorteado foi: @${number}!`,
            mentions: [sorteado.id]
        });
    },
    
    forca: async (ctx) => {
        const { sock, msg } = ctx;
        const palavras = ['banana', 'computador', 'whatsapp', 'programacao', 'javascript', 'brasil', 'cachorro', 'elefante'];
        const palavra = helpers.randomChoice(palavras);
        const dica = '_'.repeat(palavra.length).split('').join(' ');
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: `🎮 *JOGO DA FORCA*\n\n` +
                  `Palavra: ${dica}\n` +
                  `Letras: ${palavra.length}\n\n` +
                  `Dica: A palavra tem ${palavra.length} letras!\n` +
                  `(Resposta: ||${palavra}||)`
        });
    }
};

module.exports = commands;
