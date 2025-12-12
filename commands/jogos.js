const settings = require('../config/settings');

const HEADER = `╔♡━━━━━━━━━━━━━━━━━━━━━━♡╗
║  🇨🇦 *ALIANCA BRATVA* 🇨🇦  ║
╚♡━━━━━━━━━━━━━━━━━━━━━━♡╝`;

const jogosCommands = {

    async dado(ctx) {
        const { sock, msg } = ctx;
        const remoteJid = msg.key.remoteJid;

        const resultado = Math.floor(Math.random() * 6) + 1;
        const dados = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

        await sock.sendMessage(remoteJid, {
            text: `${HEADER}
╭━━━⪩ 🎲 *DADO* ⪨━━━
│🇨🇦 Resultado: *${dados[resultado - 1]} ${resultado}*
╰━━━━━─「🇨🇦」─━━━━━`
        });
    },

    async moeda(ctx) {
        const { sock, msg } = ctx;
        const remoteJid = msg.key.remoteJid;

        const resultado = Math.random() < 0.5 ? 'CARA' : 'COROA';
        const emoji = resultado === 'CARA' ? '🪙' : '💰';

        await sock.sendMessage(remoteJid, {
            text: `${HEADER}
╭━━━⪩ 🪙 *MOEDA* ⪨━━━
│🇨🇦 Resultado: *${emoji} ${resultado}*
╰━━━━━─「🇨🇦」─━━━━━`
        });
    },

    async ppt(ctx) {
        const { sock, msg, args } = ctx;
        const remoteJid = msg.key.remoteJid;

        const opcoes = ['pedra', 'papel', 'tesoura'];
        const emojis = { pedra: '🪨', papel: '📄', tesoura: '✂️' };

        if (!args[0] || !opcoes.includes(args[0].toLowerCase())) {
            return await sock.sendMessage(remoteJid, {
                text: `❌ Escolha: pedra, papel ou tesoura\n\n*Uso:* ${settings.prefix}ppt pedra`
            });
        }

        const jogador = args[0].toLowerCase();
        const bot = opcoes[Math.floor(Math.random() * 3)];

        let resultado;
        if (jogador === bot) {
            resultado = '🤝 *EMPATE!*';
        } else if (
            (jogador === 'pedra' && bot === 'tesoura') ||
            (jogador === 'papel' && bot === 'pedra') ||
            (jogador === 'tesoura' && bot === 'papel')
        ) {
            resultado = '🎉 *VOCÊ GANHOU!*';
        } else {
            resultado = '😢 *VOCÊ PERDEU!*';
        }

        await sock.sendMessage(remoteJid, {
            text: `${HEADER}
╭━━━⪩ ✂️ *PEDRA PAPEL TESOURA* ⪨━━━
│🇨🇦 Você: ${emojis[jogador]} *${jogador.toUpperCase()}*
│🇨🇦 Bot: ${emojis[bot]} *${bot.toUpperCase()}*
│🇨🇦 
│🇨🇦 ${resultado}
╰━━━━━─「🇨🇦」─━━━━━`
        });
    },

    async slot(ctx) {
        const { sock, msg } = ctx;
        const remoteJid = msg.key.remoteJid;

        const simbolos = ['🍒', '🍊', '🍋', '🍇', '⭐', '💎', '7️⃣'];
        const s1 = simbolos[Math.floor(Math.random() * simbolos.length)];
        const s2 = simbolos[Math.floor(Math.random() * simbolos.length)];
        const s3 = simbolos[Math.floor(Math.random() * simbolos.length)];

        let resultado;
        let premio = 0;

        if (s1 === s2 && s2 === s3) {
            if (s1 === '7️⃣') {
                resultado = '🎰 *JACKPOT!!! VOCÊ GANHOU!*';
                premio = 1000;
            } else if (s1 === '💎') {
                resultado = '💎 *DIAMANTE TRIPLO! GRANDE PRÊMIO!*';
                premio = 500;
            } else {
                resultado = '🎉 *TRIPLO! VOCÊ GANHOU!*';
                premio = 100;
            }
        } else if (s1 === s2 || s2 === s3 || s1 === s3) {
            resultado = '✨ *DUPLO! Pequeno prêmio!*';
            premio = 20;
        } else {
            resultado = '😢 *Tente novamente!*';
        }

        await sock.sendMessage(remoteJid, {
            text: `${HEADER}
╭━━━⪩ 🎰 *SLOT MACHINE* ⪨━━━
│🇨🇦 
│🇨🇦 ╔═══════════╗
│🇨🇦 ║ ${s1} │ ${s2} │ ${s3} ║
│🇨🇦 ╚═══════════╝
│🇨🇦 
│🇨🇦 ${resultado}
${premio > 0 ? `│🇨🇦 Prêmio: *${premio} moedas*` : ''}
╰━━━━━─「🇨🇦」─━━━━━`
        });
    },

    async roleta(ctx) {
        const { sock, msg } = ctx;
        const remoteJid = msg.key.remoteJid;

        const numeros = Array.from({ length: 37 }, (_, i) => i);
        const resultado = numeros[Math.floor(Math.random() * numeros.length)];
        const cor = resultado === 0 ? '🟢' : (resultado % 2 === 0 ? '⚫' : '🔴');
        const parImpar = resultado === 0 ? 'ZERO' : (resultado % 2 === 0 ? 'PAR' : 'ÍMPAR');

        await sock.sendMessage(remoteJid, {
            text: `${HEADER}
╭━━━⪩ 🎡 *ROLETA* ⪨━━━
│🇨🇦 
│🇨🇦 A bola caiu no...
│🇨🇦 
│🇨🇦 ${cor} *${resultado}* ${cor}
│🇨🇦 
│🇨🇦 Tipo: *${parImpar}*
╰━━━━━─「🇨🇦」─━━━━━`
        });
    },

    async sorteio(ctx) {
        const { sock, msg, isGroup } = ctx;
        const remoteJid = msg.key.remoteJid;

        if (!isGroup) {
            return await sock.sendMessage(remoteJid, { text: '❌ Apenas em grupos!' });
        }

        try {
            const groupMetadata = await sock.groupMetadata(remoteJid);
            const participants = groupMetadata.participants;
            const sorteado = participants[Math.floor(Math.random() * participants.length)];

            await sock.sendMessage(remoteJid, {
                text: `${HEADER}
╭━━━⪩ 🎉 *SORTEIO* ⪨━━━
│🇨🇦 
│🇨🇦 O sorteado foi...
│🇨🇦 
│🇨🇦 🎊 @${sorteado.id.split('@')[0]} 🎊
│🇨🇦 
│🇨🇦 Parabéns!
╰━━━━━─「🇨🇦」─━━━━━`,
                mentions: [sorteado.id]
            });

        } catch (error) {
            await sock.sendMessage(remoteJid, { text: `❌ Erro: ${error.message}` });
        }
    },

    async chance(ctx) {
        const { sock, msg, args } = ctx;
        const remoteJid = msg.key.remoteJid;

        if (!args[0]) {
            return await sock.sendMessage(remoteJid, {
                text: `❌ Informe algo!\n\n*Uso:* ${settings.prefix}chance de ser rico`
            });
        }

        const texto = args.join(' ');
        const porcentagem = Math.floor(Math.random() * 101);

        let barra = '';
        for (let i = 0; i < 10; i++) {
            barra += i < Math.floor(porcentagem / 10) ? '🟩' : '⬜';
        }

        await sock.sendMessage(remoteJid, {
            text: `${HEADER}
╭━━━⪩ 📊 *CHANCE* ⪨━━━
│🇨🇦 "${texto}"
│🇨🇦 
│🇨🇦 ${barra}
│🇨🇦 *${porcentagem}%*
╰━━━━━─「🇨🇦」─━━━━━`
        });
    },

    async escolher(ctx) {
        const { sock, msg, args } = ctx;
        const remoteJid = msg.key.remoteJid;

        if (!args[0] || !args.join(' ').includes(',')) {
            return await sock.sendMessage(remoteJid, {
                text: `❌ Informe opções separadas por vírgula!\n\n*Uso:* ${settings.prefix}escolher pizza, hamburguer, sushi`
            });
        }

        const opcoes = args.join(' ').split(',').map(o => o.trim()).filter(o => o);
        const escolhido = opcoes[Math.floor(Math.random() * opcoes.length)];

        await sock.sendMessage(remoteJid, {
            text: `${HEADER}
╭━━━⪩ 🤔 *ESCOLHER* ⪨━━━
│🇨🇦 Opções: *${opcoes.length}*
│🇨🇦 
│🇨🇦 Eu escolho...
│🇨🇦 
│🇨🇦 🎯 *${escolhido}*
╰━━━━━─「🇨🇦」─━━━━━`
        });
    },

    async verdade(ctx) {
        const { sock, msg } = ctx;
        const remoteJid = msg.key.remoteJid;

        const verdades = [
            "Qual foi a maior mentira que você já contou?",
            "Qual é seu maior medo?",
            "Já traiu alguém?",
            "Qual foi a coisa mais vergonhosa que você já fez?",
            "Qual é seu maior segredo?",
            "Já fingiu gostar de alguém?",
            "Qual foi a pior coisa que você já fez bêbado?",
            "Você já stalkeou alguém nas redes sociais?",
            "Qual foi a maior burrada que você já fez?",
            "Já se arrependeu de algum relacionamento?",
            "Qual foi a maior fofoca que você já espalhou?",
            "Você já ficou com alguém comprometido?",
            "Qual é a coisa mais estranha que você já comeu?",
            "Já mentiu em uma entrevista de emprego?",
            "Qual foi o momento mais constrangedor da sua vida?"
        ];

        const verdade = verdades[Math.floor(Math.random() * verdades.length)];

        await sock.sendMessage(remoteJid, {
            text: `${HEADER}
╭━━━⪩ ❓ *VERDADE* ⪨━━━
│🇨🇦 
│🇨🇦 ${verdade}
│🇨🇦 
╰━━━━━─「🇨🇦」─━━━━━`
        });
    },

    async desafio(ctx) {
        const { sock, msg } = ctx;
        const remoteJid = msg.key.remoteJid;

        const desafios = [
            "Mande um áudio cantando sua música favorita",
            "Mande uma foto fazendo careta",
            "Fale 'eu te amo' para a última pessoa que te mandou mensagem",
            "Imite um animal por áudio",
            "Conte uma piada",
            "Mande uma selfie agora",
            "Dance uma música e mande o vídeo",
            "Fale algo em outro idioma",
            "Mande um áudio imitando um famoso",
            "Faça 10 flexões agora",
            "Poste uma foto constrangedora no status",
            "Mande um áudio gritando",
            "Fale com sotaque de outro estado",
            "Mande uma foto do seu pé",
            "Faça uma declaração para alguém do grupo"
        ];

        const desafio = desafios[Math.floor(Math.random() * desafios.length)];

        await sock.sendMessage(remoteJid, {
            text: `${HEADER}
╭━━━⪩ 🎯 *DESAFIO* ⪨━━━
│🇨🇦 
│🇨🇦 ${desafio}
│🇨🇦 
╰━━━━━─「🇨🇦」─━━━━━`
        });
    },

    async numero(ctx) {
        const { sock, msg, args } = ctx;
        const remoteJid = msg.key.remoteJid;

        let min = 1;
        let max = 100;

        if (args[0] && args[1]) {
            min = parseInt(args[0]) || 1;
            max = parseInt(args[1]) || 100;
        } else if (args[0]) {
            max = parseInt(args[0]) || 100;
        }

        const numero = Math.floor(Math.random() * (max - min + 1)) + min;

        await sock.sendMessage(remoteJid, {
            text: `${HEADER}
╭━━━⪩ 🔢 *NÚMERO ALEATÓRIO* ⪨━━━
│🇨🇦 Min: *${min}*
│🇨🇦 Max: *${max}*
│🇨🇦 
│🇨🇦 Número: *${numero}*
╰━━━━━─「🇨🇦」─━━━━━`
        });
    },

    async par(ctx) {
        const { sock, msg } = ctx;
        const remoteJid = msg.key.remoteJid;

        const resultado = Math.random() < 0.5 ? 'PAR' : 'ÍMPAR';
        const emoji = resultado === 'PAR' ? '✌️' : '☝️';

        await sock.sendMessage(remoteJid, {
            text: `${HEADER}
╭━━━⪩ ✌️ *PAR OU ÍMPAR* ⪨━━━
│🇨🇦 Resultado: ${emoji} *${resultado}*
╰━━━━━─「🇨🇦」─━━━━━`
        });
    },

    async menujogos(ctx) {
        const { sock, msg } = ctx;
        const remoteJid = msg.key.remoteJid;
        const prefix = settings.prefix;

        const menu = `${HEADER}
╭━━━⪩ 🎲 *JOGOS* ⪨━━━
│🇨🇦 ${prefix}dado
│🇨🇦 ${prefix}moeda
│🇨🇦 ${prefix}ppt [opcao]
│🇨🇦 ${prefix}par
│🇨🇦 ${prefix}numero [max]
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ 🎰 *CASSINO* ⪨━━━
│🇨🇦 ${prefix}slot
│🇨🇦 ${prefix}roleta
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ 🎉 *GRUPO* ⪨━━━
│🇨🇦 ${prefix}sorteio
│🇨🇦 ${prefix}verdade
│🇨🇦 ${prefix}desafio
│🇨🇦 ${prefix}chance [texto]
│🇨🇦 ${prefix}escolher [op1,op2]
╰━━━━━─「🇨🇦」─━━━━━`;

        await sock.sendMessage(remoteJid, { text: menu });
    }
};

module.exports = jogosCommands;
