const settings = require('../config/settings');
const db = require('../storage/database');

const HEADER = `╔♡━━━━━━━━━━━━━━━━━━━━━━♡╗
║  🇨🇦 *ALIANCA BRATVA* 🇨🇦  ║
╚♡━━━━━━━━━━━━━━━━━━━━━━♡╝`;

const economyData = new Map();

const getUser = (number) => {
    if (!economyData.has(number)) {
        economyData.set(number, {
            saldo: 0,
            banco: 0,
            xp: 0,
            nivel: 1,
            lastDaily: 0,
            lastWork: 0,
            lastCrime: 0,
            lastRob: 0
        });
    }
    return economyData.get(number);
};

const formatMoney = (value) => {
    return value.toLocaleString('pt-BR');
};

const economiaCommands = {

    async carteira(ctx) {
        const { sock, msg, senderNumber, mentions } = ctx;
        const remoteJid = msg.key.remoteJid;

        const quoted = msg.message?.extendedTextMessage?.contextInfo?.participant;
        let targetNumber = mentions?.[0]?.split('@')[0] || quoted?.split('@')[0] || senderNumber;

        const user = getUser(targetNumber);
        const total = user.saldo + user.banco;

        await sock.sendMessage(remoteJid, {
            text: `${HEADER}
╭━━━⪩ 💰 *CARTEIRA* ⪨━━━
│🇨🇦 Usuário: *@${targetNumber}*
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ 💵 *SALDO* ⪨━━━
│🇨🇦 Carteira: *R$ ${formatMoney(user.saldo)}*
│🇨🇦 Banco: *R$ ${formatMoney(user.banco)}*
│🇨🇦 Total: *R$ ${formatMoney(total)}*
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ 📊 *STATUS* ⪨━━━
│🇨🇦 Nível: *${user.nivel}*
│🇨🇦 XP: *${user.xp}/${user.nivel * 100}*
╰━━━━━─「🇨🇦」─━━━━━`,
            mentions: [targetNumber + '@s.whatsapp.net']
        });
    },

    async saldo(ctx) {
        return await economiaCommands.carteira(ctx);
    },

    async daily(ctx) {
        const { sock, msg, senderNumber } = ctx;
        const remoteJid = msg.key.remoteJid;

        const user = getUser(senderNumber);
        const now = Date.now();
        const cooldown = 24 * 60 * 60 * 1000;

        if (now - user.lastDaily < cooldown) {
            const remaining = cooldown - (now - user.lastDaily);
            const hours = Math.floor(remaining / (60 * 60 * 1000));
            const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
            
            return await sock.sendMessage(remoteJid, {
                text: `❌ Você já coletou seu daily!\n\n⏰ Volte em *${hours}h ${minutes}m*`
            });
        }

        const reward = Math.floor(Math.random() * 500) + 200;
        const xpGain = Math.floor(Math.random() * 50) + 25;

        user.saldo += reward;
        user.xp += xpGain;
        user.lastDaily = now;

        if (user.xp >= user.nivel * 100) {
            user.xp -= user.nivel * 100;
            user.nivel++;
        }

        await sock.sendMessage(remoteJid, {
            text: `${HEADER}
╭━━━⪩ 🎁 *DAILY* ⪨━━━
│🇨🇦 Você coletou seu prêmio diário!
│🇨🇦 
│🇨🇦 💰 +R$ ${formatMoney(reward)}
│🇨🇦 ⭐ +${xpGain} XP
│🇨🇦 
│🇨🇦 Saldo: *R$ ${formatMoney(user.saldo)}*
╰━━━━━─「🇨🇦」─━━━━━`
        });
    },

    async trabalhar(ctx) {
        const { sock, msg, senderNumber } = ctx;
        const remoteJid = msg.key.remoteJid;

        const user = getUser(senderNumber);
        const now = Date.now();
        const cooldown = 60 * 60 * 1000;

        if (now - user.lastWork < cooldown) {
            const remaining = cooldown - (now - user.lastWork);
            const minutes = Math.floor(remaining / (60 * 1000));
            
            return await sock.sendMessage(remoteJid, {
                text: `❌ Você está cansado!\n\n⏰ Descanse mais *${minutes} minutos*`
            });
        }

        const trabalhos = [
            { nome: 'Entregador', min: 50, max: 150 },
            { nome: 'Programador', min: 100, max: 300 },
            { nome: 'Médico', min: 200, max: 500 },
            { nome: 'Motorista', min: 80, max: 200 },
            { nome: 'Chef', min: 100, max: 250 },
            { nome: 'Youtuber', min: 50, max: 400 },
            { nome: 'Streamer', min: 100, max: 350 }
        ];

        const trabalho = trabalhos[Math.floor(Math.random() * trabalhos.length)];
        const reward = Math.floor(Math.random() * (trabalho.max - trabalho.min)) + trabalho.min;
        const xpGain = Math.floor(Math.random() * 30) + 10;

        user.saldo += reward;
        user.xp += xpGain;
        user.lastWork = now;

        if (user.xp >= user.nivel * 100) {
            user.xp -= user.nivel * 100;
            user.nivel++;
        }

        await sock.sendMessage(remoteJid, {
            text: `${HEADER}
╭━━━⪩ 💼 *TRABALHO* ⪨━━━
│🇨🇦 Você trabalhou como *${trabalho.nome}*!
│🇨🇦 
│🇨🇦 💰 +R$ ${formatMoney(reward)}
│🇨🇦 ⭐ +${xpGain} XP
│🇨🇦 
│🇨🇦 Saldo: *R$ ${formatMoney(user.saldo)}*
╰━━━━━─「🇨🇦」─━━━━━`
        });
    },

    async work(ctx) {
        return await economiaCommands.trabalhar(ctx);
    },

    async crime(ctx) {
        const { sock, msg, senderNumber } = ctx;
        const remoteJid = msg.key.remoteJid;

        const user = getUser(senderNumber);
        const now = Date.now();
        const cooldown = 2 * 60 * 60 * 1000;

        if (now - user.lastCrime < cooldown) {
            const remaining = cooldown - (now - user.lastCrime);
            const hours = Math.floor(remaining / (60 * 60 * 1000));
            const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
            
            return await sock.sendMessage(remoteJid, {
                text: `❌ A polícia está te vigiando!\n\n⏰ Espere *${hours}h ${minutes}m*`
            });
        }

        const success = Math.random() > 0.4;
        user.lastCrime = now;

        if (success) {
            const reward = Math.floor(Math.random() * 800) + 200;
            const xpGain = Math.floor(Math.random() * 50) + 20;

            user.saldo += reward;
            user.xp += xpGain;

            await sock.sendMessage(remoteJid, {
                text: `${HEADER}
╭━━━⪩ 🦹 *CRIME* ⪨━━━
│🇨🇦 Você cometeu um crime e
│🇨🇦 escapou da polícia!
│🇨🇦 
│🇨🇦 💰 +R$ ${formatMoney(reward)}
│🇨🇦 ⭐ +${xpGain} XP
│🇨🇦 
│🇨🇦 Saldo: *R$ ${formatMoney(user.saldo)}*
╰━━━━━─「🇨🇦」─━━━━━`
            });
        } else {
            const multa = Math.floor(user.saldo * 0.2);
            user.saldo -= multa;

            await sock.sendMessage(remoteJid, {
                text: `${HEADER}
╭━━━⪩ 🚔 *PRESO!* ⪨━━━
│🇨🇦 Você foi pego pela polícia!
│🇨🇦 
│🇨🇦 💸 Multa: -R$ ${formatMoney(multa)}
│🇨🇦 
│🇨🇦 Saldo: *R$ ${formatMoney(user.saldo)}*
╰━━━━━─「🇨🇦」─━━━━━`
            });
        }
    },

    async depositar(ctx) {
        const { sock, msg, args, senderNumber } = ctx;
        const remoteJid = msg.key.remoteJid;

        const user = getUser(senderNumber);

        if (!args[0]) {
            return await sock.sendMessage(remoteJid, {
                text: `❌ Informe o valor!\n\n*Uso:* ${settings.prefix}depositar 1000\n*Ou:* ${settings.prefix}depositar tudo`
            });
        }

        let valor;
        if (args[0].toLowerCase() === 'tudo' || args[0].toLowerCase() === 'all') {
            valor = user.saldo;
        } else {
            valor = parseInt(args[0]);
        }

        if (isNaN(valor) || valor <= 0) {
            return await sock.sendMessage(remoteJid, { text: '❌ Valor inválido!' });
        }

        if (valor > user.saldo) {
            return await sock.sendMessage(remoteJid, { text: `❌ Você só tem R$ ${formatMoney(user.saldo)} na carteira!` });
        }

        user.saldo -= valor;
        user.banco += valor;

        await sock.sendMessage(remoteJid, {
            text: `${HEADER}
╭━━━⪩ 🏦 *DEPÓSITO* ⪨━━━
│🇨🇦 Depositado: *R$ ${formatMoney(valor)}*
│🇨🇦 
│🇨🇦 Carteira: *R$ ${formatMoney(user.saldo)}*
│🇨🇦 Banco: *R$ ${formatMoney(user.banco)}*
╰━━━━━─「🇨🇦」─━━━━━`
        });
    },

    async dep(ctx) {
        return await economiaCommands.depositar(ctx);
    },

    async sacar(ctx) {
        const { sock, msg, args, senderNumber } = ctx;
        const remoteJid = msg.key.remoteJid;

        const user = getUser(senderNumber);

        if (!args[0]) {
            return await sock.sendMessage(remoteJid, {
                text: `❌ Informe o valor!\n\n*Uso:* ${settings.prefix}sacar 1000\n*Ou:* ${settings.prefix}sacar tudo`
            });
        }

        let valor;
        if (args[0].toLowerCase() === 'tudo' || args[0].toLowerCase() === 'all') {
            valor = user.banco;
        } else {
            valor = parseInt(args[0]);
        }

        if (isNaN(valor) || valor <= 0) {
            return await sock.sendMessage(remoteJid, { text: '❌ Valor inválido!' });
        }

        if (valor > user.banco) {
            return await sock.sendMessage(remoteJid, { text: `❌ Você só tem R$ ${formatMoney(user.banco)} no banco!` });
        }

        user.banco -= valor;
        user.saldo += valor;

        await sock.sendMessage(remoteJid, {
            text: `${HEADER}
╭━━━⪩ 🏦 *SAQUE* ⪨━━━
│🇨🇦 Sacado: *R$ ${formatMoney(valor)}*
│🇨🇦 
│🇨🇦 Carteira: *R$ ${formatMoney(user.saldo)}*
│🇨🇦 Banco: *R$ ${formatMoney(user.banco)}*
╰━━━━━─「🇨🇦」─━━━━━`
        });
    },

    async transferir(ctx) {
        const { sock, msg, args, senderNumber, mentions } = ctx;
        const remoteJid = msg.key.remoteJid;

        const quoted = msg.message?.extendedTextMessage?.contextInfo?.participant;
        let targetNumber = mentions?.[0]?.split('@')[0] || quoted?.split('@')[0];

        if (!targetNumber) {
            return await sock.sendMessage(remoteJid, {
                text: `❌ Marque alguém!\n\n*Uso:* ${settings.prefix}transferir @user 1000`
            });
        }

        if (targetNumber === senderNumber) {
            return await sock.sendMessage(remoteJid, { text: '❌ Você não pode transferir para si mesmo!' });
        }

        const valorArg = args.find(a => !a.includes('@'));
        const valor = parseInt(valorArg);

        if (!valor || isNaN(valor) || valor <= 0) {
            return await sock.sendMessage(remoteJid, { text: '❌ Informe um valor válido!' });
        }

        const sender = getUser(senderNumber);
        const target = getUser(targetNumber);

        if (valor > sender.saldo) {
            return await sock.sendMessage(remoteJid, { text: `❌ Você só tem R$ ${formatMoney(sender.saldo)}!` });
        }

        sender.saldo -= valor;
        target.saldo += valor;

        await sock.sendMessage(remoteJid, {
            text: `${HEADER}
╭━━━⪩ 💸 *TRANSFERÊNCIA* ⪨━━━
│🇨🇦 De: *@${senderNumber}*
│🇨🇦 Para: *@${targetNumber}*
│🇨🇦 Valor: *R$ ${formatMoney(valor)}*
╰━━━━━─「🇨🇦」─━━━━━`,
            mentions: [senderNumber + '@s.whatsapp.net', targetNumber + '@s.whatsapp.net']
        });
    },

    async pix(ctx) {
        return await economiaCommands.transferir(ctx);
    },

    async ranking(ctx) {
        const { sock, msg } = ctx;
        const remoteJid = msg.key.remoteJid;

        const users = Array.from(economyData.entries())
            .map(([number, data]) => ({ number, total: data.saldo + data.banco, nivel: data.nivel }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 10);

        if (users.length === 0) {
            return await sock.sendMessage(remoteJid, { text: '❌ Nenhum usuário no ranking ainda!' });
        }

        const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
        let lista = `${HEADER}
╭━━━⪩ 🏆 *RANKING* ⪨━━━\n`;

        users.forEach((u, i) => {
            lista += `│${medals[i]} @${u.number}\n│    💰 R$ ${formatMoney(u.total)} | Nv ${u.nivel}\n`;
        });

        lista += `╰━━━━━─「🇨🇦」─━━━━━`;

        await sock.sendMessage(remoteJid, {
            text: lista,
            mentions: users.map(u => u.number + '@s.whatsapp.net')
        });
    },

    async top(ctx) {
        return await economiaCommands.ranking(ctx);
    },

    async menueconomia(ctx) {
        const { sock, msg } = ctx;
        const remoteJid = msg.key.remoteJid;
        const prefix = settings.prefix;

        const menu = `${HEADER}
╭━━━⪩ 💰 *GANHAR* ⪨━━━
│🇨🇦 ${prefix}daily
│🇨🇦 ${prefix}trabalhar
│🇨🇦 ${prefix}crime
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ 🏦 *BANCO* ⪨━━━
│🇨🇦 ${prefix}carteira
│🇨🇦 ${prefix}saldo
│🇨🇦 ${prefix}depositar [valor]
│🇨🇦 ${prefix}sacar [valor]
│🇨🇦 ${prefix}transferir @user [valor]
│🇨🇦 ${prefix}pix @user [valor]
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ 🏆 *RANKING* ⪨━━━
│🇨🇦 ${prefix}ranking
│🇨🇦 ${prefix}top
╰━━━━━─「🇨🇦」─━━━━━`;

        await sock.sendMessage(remoteJid, { text: menu });
    }
};

module.exports = economiaCommands;
