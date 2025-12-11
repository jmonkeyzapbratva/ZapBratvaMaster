const { SMSActivateService, POPULAR_SERVICES, POPULAR_COUNTRIES } = require('../services/smsActivate');
const wallet = require('../storage/userWallet');
const settings = require('../config/settings');

const smsService = new SMSActivateService(process.env.SMS_ACTIVATE_API_KEY);

const activePolling = new Map();

const formatMoney = (value) => {
    return `R$ ${parseFloat(value).toFixed(2)}`;
};

const smsCommands = {
    async sms(ctx) {
        const { sock, msg, senderNumber } = ctx;
        const remoteJid = msg.key.remoteJid;

        await wallet.createUser(senderNumber);
        const balance = await wallet.getBalance(senderNumber);

        const menu = `
╔══════════════════════════════════════╗
║   📱 *SMS VIRTUAL - NÚMEROS TEMP*    ║
╠══════════════════════════════════════╣
║                                      ║
║  💰 *Seu Saldo:* ${formatMoney(balance).padEnd(15)}    ║
║                                      ║
╠══════════════════════════════════════╣
║  📋 *COMANDOS DISPONÍVEIS:*          ║
║                                      ║
║  ${settings.prefix}paises                       ║
║  └ Ver países disponíveis            ║
║                                      ║
║  ${settings.prefix}servicos                     ║
║  └ Ver serviços (WhatsApp, etc)      ║
║                                      ║
║  ${settings.prefix}comprar [serviço] [país]     ║
║  └ Comprar número virtual            ║
║  └ Ex: ${settings.prefix}comprar wa 0            ║
║                                      ║
║  ${settings.prefix}meusnumeros                  ║
║  └ Ver números ativos                ║
║                                      ║
║  ${settings.prefix}saldo                        ║
║  └ Ver seu saldo                     ║
║                                      ║
║  ${settings.prefix}historico                    ║
║  └ Histórico de compras              ║
║                                      ║
║  ${settings.prefix}addsaldo [valor]             ║
║  └ Adicionar saldo (admin)           ║
║                                      ║
╚══════════════════════════════════════╝

💡 *Dica:* Para receber códigos SMS, primeiro adicione saldo!
`;

        await sock.sendMessage(remoteJid, { text: menu });
    },

    async paises(ctx) {
        const { sock, msg } = ctx;
        const remoteJid = msg.key.remoteJid;

        let lista = `
╔══════════════════════════════════════╗
║   🌍 *PAÍSES DISPONÍVEIS*            ║
╠══════════════════════════════════════╣
`;

        for (const [code, info] of Object.entries(POPULAR_COUNTRIES)) {
            lista += `║  ${info.emoji} *${info.name}*\n`;
            lista += `║  └ Código: ${code} | Tel: ${info.code}\n║\n`;
        }

        lista += `╚══════════════════════════════════════╝

📝 *Como usar:*
${settings.prefix}comprar wa 0
└ Compra número da Rússia para WhatsApp

${settings.prefix}comprar tg 73
└ Compra número do Brasil para Telegram
`;

        await sock.sendMessage(remoteJid, { text: lista });
    },

    async servicos(ctx) {
        const { sock, msg } = ctx;
        const remoteJid = msg.key.remoteJid;

        let lista = `
╔══════════════════════════════════════╗
║   📱 *SERVIÇOS DISPONÍVEIS*          ║
╠══════════════════════════════════════╣
`;

        for (const [code, info] of Object.entries(POPULAR_SERVICES)) {
            lista += `║  ${info.emoji} *${info.name}*\n`;
            lista += `║  └ Código: ${code}\n║\n`;
        }

        lista += `╚══════════════════════════════════════╝

📝 *Como usar:*
${settings.prefix}comprar wa 0
└ wa = WhatsApp, 0 = Rússia

${settings.prefix}comprar tg 6
└ tg = Telegram, 6 = Indonésia
`;

        await sock.sendMessage(remoteJid, { text: lista });
    },

    async comprar(ctx) {
        const { sock, msg, args, senderNumber } = ctx;
        const remoteJid = msg.key.remoteJid;

        if (args.length < 1) {
            await sock.sendMessage(remoteJid, {
                text: `❌ *Uso correto:*\n${settings.prefix}comprar [serviço] [país]\n\nExemplo: ${settings.prefix}comprar wa 0`
            });
            return;
        }

        const service = args[0].toLowerCase();
        const country = parseInt(args[1]) || 0;

        if (!POPULAR_SERVICES[service]) {
            await sock.sendMessage(remoteJid, {
                text: `❌ Serviço "${service}" não encontrado!\n\nUse ${settings.prefix}servicos para ver a lista.`
            });
            return;
        }

        const serviceInfo = POPULAR_SERVICES[service];
        const countryInfo = POPULAR_COUNTRIES[country] || { name: `País ${country}`, emoji: '🌍' };

        await sock.sendMessage(remoteJid, {
            text: `⏳ Buscando número ${serviceInfo.emoji} ${serviceInfo.name} em ${countryInfo.emoji} ${countryInfo.name}...`
        });

        try {
            const prices = await smsService.getPrices(country, service);
            let price = 15.00;
            
            if (prices && prices[service] && prices[service][country]) {
                price = parseFloat(prices[service][country].cost) || 15.00;
            }

            price = price * 1.3;

            const balance = await wallet.getBalance(senderNumber);
            if (balance < price) {
                await sock.sendMessage(remoteJid, {
                    text: `❌ *Saldo insuficiente!*\n\n💰 Seu saldo: ${formatMoney(balance)}\n💵 Preço: ${formatMoney(price)}\n\nUse ${settings.prefix}pix para adicionar saldo.`
                });
                return;
            }

            const result = await smsService.getNumber(service, country);

            if (!result.success) {
                let errorMsg = '❌ Erro ao obter número.';
                if (result.error === 'NO_NUMBERS') {
                    errorMsg = '❌ Nenhum número disponível no momento. Tente outro país.';
                } else if (result.error === 'NO_BALANCE') {
                    errorMsg = '❌ Sistema sem saldo. Entre em contato com o administrador.';
                }
                await sock.sendMessage(remoteJid, { text: errorMsg });
                return;
            }

            await wallet.deductBalance(senderNumber, price, `Número ${service.toUpperCase()} - ${countryInfo.name}`);
            await wallet.saveActivation(senderNumber, result.activationId, result.phoneNumber, service, country, price);
            
            await smsService.markReady(result.activationId);

            const successMsg = `
✅ *NÚMERO OBTIDO COM SUCESSO!*

📱 *Número:* +${result.phoneNumber}
${serviceInfo.emoji} *Serviço:* ${serviceInfo.name}
${countryInfo.emoji} *País:* ${countryInfo.name}
💵 *Custo:* ${formatMoney(price)}

⏳ *Aguardando SMS...*
O código será enviado aqui automaticamente!

⚠️ *Tempo limite:* 20 minutos
Use ${settings.prefix}cancelar ${result.activationId} para cancelar e reembolsar.
`;

            await sock.sendMessage(remoteJid, { text: successMsg });

            pollForSMS(sock, remoteJid, senderNumber, result.activationId, serviceInfo);

        } catch (error) {
            console.error('[SMS] Erro ao comprar:', error);
            await sock.sendMessage(remoteJid, {
                text: `❌ Erro ao processar compra: ${error.message}`
            });
        }
    },

    async cancelar(ctx) {
        const { sock, msg, args, senderNumber } = ctx;
        const remoteJid = msg.key.remoteJid;

        if (!args[0]) {
            await sock.sendMessage(remoteJid, {
                text: `❌ Use: ${settings.prefix}cancelar [ID da ativação]`
            });
            return;
        }

        const activationId = args[0];

        try {
            if (activePolling.has(activationId)) {
                clearInterval(activePolling.get(activationId));
                activePolling.delete(activationId);
            }

            await smsService.cancelActivation(activationId);
            
            const activations = await wallet.getActiveActivations(senderNumber);
            const activation = activations.find(a => a.activation_id === activationId);
            
            if (activation) {
                await wallet.refundBalance(senderNumber, parseFloat(activation.cost) * 0.9, 'Reembolso cancelamento');
                await wallet.updateActivationStatus(activationId, 'cancelled');
            }

            await sock.sendMessage(remoteJid, {
                text: `✅ Ativação ${activationId} cancelada!\n💰 90% do valor foi reembolsado.`
            });

        } catch (error) {
            await sock.sendMessage(remoteJid, {
                text: `❌ Erro ao cancelar: ${error.message}`
            });
        }
    },

    async saldo(ctx) {
        const { sock, msg, senderNumber } = ctx;
        const remoteJid = msg.key.remoteJid;

        const balance = await wallet.getBalance(senderNumber);
        const user = await wallet.getUser(senderNumber);

        await sock.sendMessage(remoteJid, {
            text: `
💰 *SEU SALDO*

💵 Disponível: ${formatMoney(balance)}
📊 Total gasto: ${formatMoney(user?.total_spent || 0)}

Use ${settings.prefix}pix para adicionar mais saldo!
`
        });
    },

    async meusnumeros(ctx) {
        const { sock, msg, senderNumber } = ctx;
        const remoteJid = msg.key.remoteJid;

        const activations = await wallet.getActiveActivations(senderNumber);

        if (activations.length === 0) {
            await sock.sendMessage(remoteJid, {
                text: `📱 Você não tem números ativos no momento.\n\nUse ${settings.prefix}comprar para obter um número!`
            });
            return;
        }

        let lista = `📱 *SEUS NÚMEROS ATIVOS*\n\n`;

        for (const act of activations) {
            const serviceInfo = POPULAR_SERVICES[act.service] || { name: act.service, emoji: '📱' };
            lista += `${serviceInfo.emoji} *${serviceInfo.name}*\n`;
            lista += `├ Número: +${act.phone_number}\n`;
            lista += `├ ID: ${act.activation_id}\n`;
            lista += `├ Status: ${act.status}\n`;
            lista += `└ Código: ${act.sms_code || 'Aguardando...'}\n\n`;
        }

        lista += `\n📝 Para cancelar: ${settings.prefix}cancelar [ID]`;

        await sock.sendMessage(remoteJid, { text: lista });
    },

    async historico(ctx) {
        const { sock, msg, senderNumber } = ctx;
        const remoteJid = msg.key.remoteJid;

        const history = await wallet.getActivationHistory(senderNumber);

        if (history.length === 0) {
            await sock.sendMessage(remoteJid, {
                text: `📜 Você ainda não fez nenhuma compra.\n\nUse ${settings.prefix}comprar para começar!`
            });
            return;
        }

        let lista = `📜 *HISTÓRICO DE COMPRAS*\n\n`;

        for (const act of history.slice(0, 10)) {
            const serviceInfo = POPULAR_SERVICES[act.service] || { name: act.service, emoji: '📱' };
            const date = new Date(act.created_at).toLocaleDateString('pt-BR');
            lista += `${serviceInfo.emoji} ${serviceInfo.name} - ${date}\n`;
            lista += `└ ${act.status === 'completed' ? '✅' : act.status === 'cancelled' ? '❌' : '⏳'} ${formatMoney(act.cost)}\n\n`;
        }

        await sock.sendMessage(remoteJid, { text: lista });
    },

    async addsaldo(ctx) {
        const { sock, msg, args, senderNumber, isOwner } = ctx;
        const remoteJid = msg.key.remoteJid;

        if (!isOwner) {
            await sock.sendMessage(remoteJid, {
                text: `❌ Apenas o dono pode usar este comando!`
            });
            return;
        }

        if (args.length < 2) {
            await sock.sendMessage(remoteJid, {
                text: `❌ Uso: ${settings.prefix}addsaldo [número] [valor]\n\nExemplo: ${settings.prefix}addsaldo 5511999999999 50`
            });
            return;
        }

        const targetNumber = args[0].replace(/\D/g, '');
        const amount = parseFloat(args[1]);

        if (isNaN(amount) || amount <= 0) {
            await sock.sendMessage(remoteJid, { text: `❌ Valor inválido!` });
            return;
        }

        await wallet.addBalance(targetNumber, amount, 'Crédito manual');
        const newBalance = await wallet.getBalance(targetNumber);

        await sock.sendMessage(remoteJid, {
            text: `✅ *Saldo adicionado!*\n\n👤 Usuário: ${targetNumber}\n💵 Adicionado: ${formatMoney(amount)}\n💰 Novo saldo: ${formatMoney(newBalance)}`
        });
    },

    async saldoapi(ctx) {
        const { sock, msg, isOwner } = ctx;
        const remoteJid = msg.key.remoteJid;

        if (!isOwner) {
            await sock.sendMessage(remoteJid, { text: `❌ Apenas o dono!` });
            return;
        }

        try {
            const balance = await smsService.getBalance();
            await sock.sendMessage(remoteJid, {
                text: `💳 *Saldo API SMS-Activate:* ${formatMoney(balance)}`
            });
        } catch (error) {
            await sock.sendMessage(remoteJid, {
                text: `❌ Erro ao consultar API: ${error.message}`
            });
        }
    }
};

async function pollForSMS(sock, remoteJid, senderNumber, activationId, serviceInfo) {
    let attempts = 0;
    const maxAttempts = 120;

    const interval = setInterval(async () => {
        attempts++;

        if (attempts > maxAttempts) {
            clearInterval(interval);
            activePolling.delete(activationId);
            
            await wallet.updateActivationStatus(activationId, 'timeout');
            await sock.sendMessage(remoteJid, {
                text: `⏰ *Tempo esgotado!*\n\nNenhum SMS recebido para ativação ${activationId}.\nO número expirou.`
            });
            return;
        }

        try {
            const status = await smsService.getStatus(activationId);

            if (status.status === 'CODE_RECEIVED' || status.status === 'FULL_SMS') {
                clearInterval(interval);
                activePolling.delete(activationId);

                const code = status.code || status.message;
                
                await wallet.updateActivationStatus(activationId, 'completed', code);
                await smsService.markComplete(activationId);

                await sock.sendMessage(remoteJid, {
                    text: `
🎉 *CÓDIGO SMS RECEBIDO!*

${serviceInfo.emoji} *Serviço:* ${serviceInfo.name}
🔢 *Código:* ${code}

✅ Ativação concluída com sucesso!
`
                });
            } else if (status.status === 'CANCELLED') {
                clearInterval(interval);
                activePolling.delete(activationId);
                await wallet.updateActivationStatus(activationId, 'cancelled');
            }
        } catch (error) {
            console.error('[SMS] Erro no polling:', error.message);
        }
    }, 10000);

    activePolling.set(activationId, interval);
}

module.exports = smsCommands;
