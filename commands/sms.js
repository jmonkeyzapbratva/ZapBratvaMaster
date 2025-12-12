const { FiveSimService, POPULAR_SERVICES, POPULAR_COUNTRIES } = require('../services/fivesim');
const wallet = require('../storage/userWallet');
const settings = require('../config/settings');

const smsService = new FiveSimService(process.env.FIVESIM_API_KEY);

const activePolling = new Map();

const RUB_TO_BRL = 0.065;
const PROFIT_MARGIN = 2.0;

const formatMoney = (value) => {
    return `R$ ${parseFloat(value).toFixed(2)}`;
};

const convertRubToBrl = (rubPrice) => {
    const brlPrice = rubPrice * RUB_TO_BRL * PROFIT_MARGIN;
    return Math.max(Math.ceil(brlPrice * 100) / 100, 0.50);
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
║  ${settings.prefix}precos [país]                ║
║  └ Ver preços do país                ║
║  └ Ex: ${settings.prefix}precos russia          ║
║                                      ║
║  ${settings.prefix}comprar [serviço] [país]     ║
║  └ Comprar número virtual            ║
║  └ Ex: ${settings.prefix}comprar whatsapp russia║
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
${settings.prefix}comprar whatsapp russia
└ Compra número da Rússia para WhatsApp

${settings.prefix}precos brazil
└ Ver preços do Brasil
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
${settings.prefix}comprar whatsapp russia
└ whatsapp = serviço, russia = país

${settings.prefix}comprar telegram brazil
└ telegram = serviço, brazil = Brasil
`;

        await sock.sendMessage(remoteJid, { text: lista });
    },

    async precos(ctx) {
        const { sock, msg, args } = ctx;
        const remoteJid = msg.key.remoteJid;

        const country = args[0]?.toLowerCase() || 'russia';
        const countryInfo = POPULAR_COUNTRIES[country];

        if (!countryInfo) {
            await sock.sendMessage(remoteJid, {
                text: `❌ País "${country}" não encontrado!\n\nUse ${settings.prefix}paises para ver a lista.`
            });
            return;
        }

        await sock.sendMessage(remoteJid, {
            text: `⏳ Buscando preços para ${countryInfo.emoji} ${countryInfo.name}...`
        });

        try {
            const countryPrices = await smsService.getCountryPrices(country);
            
            let lista = `
╔══════════════════════════════════════╗
║  ${countryInfo.emoji} *PREÇOS - ${countryInfo.name.toUpperCase()}*
╠══════════════════════════════════════╣
`;

            let found = 0;
            
            for (const [serviceCode, serviceInfo] of Object.entries(POPULAR_SERVICES)) {
                if (countryPrices[serviceCode]) {
                    const priceInfo = countryPrices[serviceCode];
                    const brlPrice = convertRubToBrl(priceInfo.priceRub);
                    
                    lista += `║  ${serviceInfo.emoji} *${serviceInfo.name}*\n`;
                    lista += `║  └ ${formatMoney(brlPrice)} (${priceInfo.count} disponíveis)\n║\n`;
                    found++;
                }
            }

            if (found === 0) {
                lista += `║  ⚠️ Nenhum serviço disponível\n║\n`;
                
                const otherServices = Object.keys(countryPrices).slice(0, 5);
                if (otherServices.length > 0) {
                    lista += `║  Outros serviços:\n`;
                    for (const svc of otherServices) {
                        const priceInfo = countryPrices[svc];
                        const brlPrice = convertRubToBrl(priceInfo.priceRub);
                        lista += `║  • ${svc}: ${formatMoney(brlPrice)}\n`;
                    }
                }
            }

            lista += `╚══════════════════════════════════════╝

📝 *Comprar:* ${settings.prefix}comprar [serviço] ${country}
`;

            await sock.sendMessage(remoteJid, { text: lista });

        } catch (error) {
            console.error('[SMS] Erro ao buscar preços:', error);
            await sock.sendMessage(remoteJid, {
                text: `❌ Erro ao buscar preços: ${error.message}`
            });
        }
    },

    async comprar(ctx) {
        const { sock, msg, args, senderNumber } = ctx;
        const remoteJid = msg.key.remoteJid;

        if (args.length < 1) {
            await sock.sendMessage(remoteJid, {
                text: `❌ *Uso correto:*\n${settings.prefix}comprar [serviço] [país]\n\nExemplo: ${settings.prefix}comprar whatsapp russia`
            });
            return;
        }

        const service = args[0].toLowerCase();
        const country = args[1]?.toLowerCase() || 'russia';

        if (!POPULAR_SERVICES[service]) {
            await sock.sendMessage(remoteJid, {
                text: `❌ Serviço "${service}" não encontrado!\n\nUse ${settings.prefix}servicos para ver a lista.`
            });
            return;
        }

        const countryInfo = POPULAR_COUNTRIES[country];
        if (!countryInfo) {
            await sock.sendMessage(remoteJid, {
                text: `❌ País "${country}" não encontrado!\n\nUse ${settings.prefix}paises para ver a lista.`
            });
            return;
        }

        const serviceInfo = POPULAR_SERVICES[service];

        await sock.sendMessage(remoteJid, {
            text: `⏳ Buscando número ${serviceInfo.emoji} ${serviceInfo.name} em ${countryInfo.emoji} ${countryInfo.name}...`
        });

        try {
            const priceInfo = await smsService.getProductPrice(country, service);
            let estimatedPrice = 5.00;
            
            if (priceInfo && priceInfo.priceRub) {
                estimatedPrice = convertRubToBrl(priceInfo.priceRub);
            }

            const balance = await wallet.getBalance(senderNumber);
            if (balance < estimatedPrice) {
                await sock.sendMessage(remoteJid, {
                    text: `❌ *Saldo insuficiente!*\n\n💰 Seu saldo: ${formatMoney(balance)}\n💵 Preço estimado: ${formatMoney(estimatedPrice)}\n\nPeça ao administrador para adicionar saldo.`
                });
                return;
            }

            const result = await smsService.getNumber(service, country, 'any');

            if (!result.success) {
                let errorMsg = '❌ Erro ao obter número.';
                if (result.error === 'NO_NUMBERS') {
                    errorMsg = '❌ Nenhum número disponível no momento. Tente outro país.';
                } else if (result.error === 'NO_BALANCE') {
                    errorMsg = '❌ Sistema sem saldo. Entre em contato com o administrador.';
                } else if (result.error === 'INVALID_PARAMS') {
                    errorMsg = '❌ Serviço ou país inválido.';
                } else {
                    errorMsg = `❌ Erro: ${result.error}`;
                }
                await sock.sendMessage(remoteJid, { text: errorMsg });
                return;
            }

            const actualPrice = result.priceRub ? convertRubToBrl(result.priceRub) : estimatedPrice;

            await wallet.deductBalance(senderNumber, actualPrice, `Número ${service.toUpperCase()} - ${countryInfo.name}`);
            await wallet.saveActivation(senderNumber, result.activationId, result.phoneNumber, service, country, actualPrice);

            const successMsg = `
✅ *NÚMERO OBTIDO COM SUCESSO!*

📱 *Número:* +${result.phoneNumber}
${serviceInfo.emoji} *Serviço:* ${serviceInfo.name}
${countryInfo.emoji} *País:* ${countryInfo.name}
💵 *Custo:* ${formatMoney(actualPrice)}

⏳ *Aguardando SMS...*
O código será enviado aqui automaticamente!

⚠️ *Tempo limite:* 15 minutos
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

Peça ao administrador para adicionar saldo!
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
            const rubToBrl = balance * RUB_TO_BRL;
            await sock.sendMessage(remoteJid, {
                text: `💳 *Saldo API 5sim.net:* ₽${balance.toFixed(2)} RUB\n\n💵 Em reais: ${formatMoney(rubToBrl)}`
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
    const maxAttempts = 90;

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

            if (status.status === 'CODE_RECEIVED') {
                clearInterval(interval);
                activePolling.delete(activationId);

                const code = status.code || status.message;
                
                await wallet.updateActivationStatus(activationId, 'completed', code);
                await smsService.finishActivation(activationId);

                await sock.sendMessage(remoteJid, {
                    text: `
🎉 *CÓDIGO SMS RECEBIDO!*

${serviceInfo.emoji} *Serviço:* ${serviceInfo.name}
🔢 *Código:* ${code}

✅ Ativação concluída com sucesso!
`
                });
            } else if (status.status === 'CANCELLED' || status.status === 'TIMEOUT') {
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
