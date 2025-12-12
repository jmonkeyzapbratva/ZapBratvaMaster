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
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃    *SMS VIRTUAL*          ┃
┃    Numeros Temporarios    ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃                           ┃
┃  *Seu Saldo:* ${formatMoney(balance)}
┃                           ┃
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
┃  *COMANDOS:*              ┃
┃                           ┃
┃  *${settings.prefix}paises*              ┃
┃  Ver paises disponiveis   ┃
┃                           ┃
┃  *${settings.prefix}servicos*            ┃
┃  WhatsApp, Telegram...    ┃
┃                           ┃
┃  *${settings.prefix}precos* [pais]       ┃
┃  Ver tabela de precos     ┃
┃                           ┃
┃  *${settings.prefix}comprar* [srv] [pais]┃
┃  Comprar numero virtual   ┃
┃                           ┃
┃  *${settings.prefix}meusnumeros*         ┃
┃  Ver numeros ativos       ┃
┃                           ┃
┃  *${settings.prefix}saldo*               ┃
┃  Consultar saldo          ┃
┃                           ┃
┃  *${settings.prefix}historico*           ┃
┃  Suas compras anteriores  ┃
┃                           ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

*Exemplo:* ${settings.prefix}comprar whatsapp russia
`;

        await sock.sendMessage(remoteJid, { text: menu });
    },

    async paises(ctx) {
        const { sock, msg } = ctx;
        const remoteJid = msg.key.remoteJid;

        let lista = `
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   *PAISES DISPONIVEIS*    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

`;

        const entries = Object.entries(POPULAR_COUNTRIES);
        for (let i = 0; i < entries.length; i++) {
            const [code, info] = entries[i];
            lista += `${info.emoji} *${info.name}*\n`;
            lista += `   Codigo: \`${code}\`\n\n`;
        }

        lista += `━━━━━━━━━━━━━━━━━━━━━━━━━━━

*Como usar:*
${settings.prefix}precos russia
${settings.prefix}comprar whatsapp russia
`;

        await sock.sendMessage(remoteJid, { text: lista });
    },

    async servicos(ctx) {
        const { sock, msg } = ctx;
        const remoteJid = msg.key.remoteJid;

        let lista = `
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   *SERVICOS DISPONIVEIS*  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

`;

        for (const [code, info] of Object.entries(POPULAR_SERVICES)) {
            lista += `${info.emoji} *${info.name}*\n`;
            lista += `   Codigo: \`${code}\`\n\n`;
        }

        lista += `━━━━━━━━━━━━━━━━━━━━━━━━━━━

*Como usar:*
${settings.prefix}comprar whatsapp russia
${settings.prefix}comprar telegram brazil
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
                text: `Pais "${country}" nao encontrado!\n\nUse ${settings.prefix}paises para ver a lista.`
            });
            return;
        }

        await sock.sendMessage(remoteJid, {
            text: `Buscando precos para ${countryInfo.emoji} ${countryInfo.name}...`
        });

        try {
            const countryPrices = await smsService.getCountryPrices(country);
            
            const priceList = [];
            
            for (const [serviceCode, serviceInfo] of Object.entries(POPULAR_SERVICES)) {
                if (countryPrices[serviceCode]) {
                    const priceInfo = countryPrices[serviceCode];
                    const brlPrice = convertRubToBrl(priceInfo.priceRub);
                    priceList.push({
                        code: serviceCode,
                        name: serviceInfo.name,
                        emoji: serviceInfo.emoji,
                        price: brlPrice,
                        count: priceInfo.count
                    });
                }
            }

            priceList.sort((a, b) => a.price - b.price);

            let lista = `
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ${countryInfo.emoji} *${countryInfo.name.toUpperCase()}*
┃  Ordenado por preco       ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

`;

            if (priceList.length === 0) {
                lista += `Nenhum servico disponivel\n\n`;
                
                const otherPrices = [];
                for (const [svc, priceInfo] of Object.entries(countryPrices)) {
                    const brlPrice = convertRubToBrl(priceInfo.priceRub);
                    otherPrices.push({ code: svc, price: brlPrice, count: priceInfo.count });
                }
                otherPrices.sort((a, b) => a.price - b.price);
                
                if (otherPrices.length > 0) {
                    lista += `*Outros servicos:*\n`;
                    for (const item of otherPrices.slice(0, 10)) {
                        lista += `  ${item.code}: ${formatMoney(item.price)}\n`;
                    }
                }
            } else {
                for (let i = 0; i < priceList.length; i++) {
                    const item = priceList[i];
                    const rank = i + 1;
                    lista += `*${rank}.* ${item.emoji} ${item.name}\n`;
                    lista += `   ${formatMoney(item.price)} (${item.count} disp)\n\n`;
                }
            }

            lista += `━━━━━━━━━━━━━━━━━━━━━━━━━━━
*Comprar:* ${settings.prefix}comprar [servico] ${country}
`;

            await sock.sendMessage(remoteJid, { text: lista });

        } catch (error) {
            console.error('[SMS] Erro ao buscar precos:', error);
            await sock.sendMessage(remoteJid, {
                text: `Erro ao buscar precos: ${error.message}`
            });
        }
    },

    async comprar(ctx) {
        const { sock, msg, args, senderNumber } = ctx;
        const remoteJid = msg.key.remoteJid;

        if (args.length < 1) {
            await sock.sendMessage(remoteJid, {
                text: `*Uso correto:*\n${settings.prefix}comprar [servico] [pais]\n\nExemplo: ${settings.prefix}comprar whatsapp russia`
            });
            return;
        }

        const service = args[0].toLowerCase();
        const country = args[1]?.toLowerCase() || 'russia';

        if (!POPULAR_SERVICES[service]) {
            await sock.sendMessage(remoteJid, {
                text: `Servico "${service}" nao encontrado!\n\nUse ${settings.prefix}servicos para ver a lista.`
            });
            return;
        }

        const countryInfo = POPULAR_COUNTRIES[country];
        if (!countryInfo) {
            await sock.sendMessage(remoteJid, {
                text: `Pais "${country}" nao encontrado!\n\nUse ${settings.prefix}paises para ver a lista.`
            });
            return;
        }

        const serviceInfo = POPULAR_SERVICES[service];

        await sock.sendMessage(remoteJid, {
            text: `Buscando ${serviceInfo.emoji} ${serviceInfo.name} em ${countryInfo.emoji} ${countryInfo.name}...`
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
                    text: `*Saldo insuficiente!*\n\nSeu saldo: ${formatMoney(balance)}\nPreco: ${formatMoney(estimatedPrice)}\n\nPeca ao admin para adicionar saldo.`
                });
                return;
            }

            const result = await smsService.getNumber(service, country, 'any');

            if (!result.success) {
                let errorMsg = 'Erro ao obter numero.';
                if (result.error === 'NO_NUMBERS') {
                    errorMsg = 'Nenhum numero disponivel. Tente outro pais.';
                } else if (result.error === 'NO_BALANCE') {
                    errorMsg = 'Sistema sem saldo. Contate o administrador.';
                } else if (result.error === 'INVALID_PARAMS') {
                    errorMsg = 'Servico ou pais invalido.';
                } else {
                    errorMsg = `Erro: ${result.error}`;
                }
                await sock.sendMessage(remoteJid, { text: errorMsg });
                return;
            }

            const actualPrice = result.priceRub ? convertRubToBrl(result.priceRub) : estimatedPrice;

            await wallet.deductBalance(senderNumber, actualPrice, `${service.toUpperCase()} - ${countryInfo.name}`);
            await wallet.saveActivation(senderNumber, result.activationId, result.phoneNumber, service, country, actualPrice);

            const successMsg = `
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   *NUMERO OBTIDO*         ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

*Numero:* +${result.phoneNumber}

${serviceInfo.emoji} *Servico:* ${serviceInfo.name}
${countryInfo.emoji} *Pais:* ${countryInfo.name}
*Custo:* ${formatMoney(actualPrice)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━

*Aguardando SMS...*
O codigo sera enviado automaticamente!

*Tempo limite:* 15 minutos

Para cancelar e reembolsar:
${settings.prefix}cancelar ${result.activationId}
`;

            await sock.sendMessage(remoteJid, { text: successMsg });

            pollForSMS(sock, remoteJid, senderNumber, result.activationId, serviceInfo);

        } catch (error) {
            console.error('[SMS] Erro ao comprar:', error);
            await sock.sendMessage(remoteJid, {
                text: `Erro ao processar compra: ${error.message}`
            });
        }
    },

    async cancelar(ctx) {
        const { sock, msg, args, senderNumber } = ctx;
        const remoteJid = msg.key.remoteJid;

        if (!args[0]) {
            await sock.sendMessage(remoteJid, {
                text: `Use: ${settings.prefix}cancelar [ID]`
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
                await wallet.refundBalance(senderNumber, parseFloat(activation.cost) * 0.9, 'Reembolso');
                await wallet.updateActivationStatus(activationId, 'cancelled');
            }

            await sock.sendMessage(remoteJid, {
                text: `Ativacao ${activationId} cancelada!\n90% do valor foi reembolsado.`
            });

        } catch (error) {
            await sock.sendMessage(remoteJid, {
                text: `Erro ao cancelar: ${error.message}`
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
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃      *SEU SALDO*          ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

*Disponivel:* ${formatMoney(balance)}
*Total gasto:* ${formatMoney(user?.total_spent || 0)}

Para adicionar saldo, fale com o admin!
`
        });
    },

    async meusnumeros(ctx) {
        const { sock, msg, senderNumber } = ctx;
        const remoteJid = msg.key.remoteJid;

        const activations = await wallet.getActiveActivations(senderNumber);

        if (activations.length === 0) {
            await sock.sendMessage(remoteJid, {
                text: `Voce nao tem numeros ativos.\n\nUse ${settings.prefix}comprar para obter um!`
            });
            return;
        }

        let lista = `
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   *NUMEROS ATIVOS*        ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

`;

        for (const act of activations) {
            const serviceInfo = POPULAR_SERVICES[act.service] || { name: act.service, emoji: '' };
            lista += `${serviceInfo.emoji} *${serviceInfo.name}*\n`;
            lista += `   Numero: +${act.phone_number}\n`;
            lista += `   ID: \`${act.activation_id}\`\n`;
            lista += `   Status: ${act.status}\n`;
            lista += `   Codigo: ${act.sms_code || 'Aguardando...'}\n\n`;
        }

        lista += `━━━━━━━━━━━━━━━━━━━━━━━━━━━
Para cancelar: ${settings.prefix}cancelar [ID]`;

        await sock.sendMessage(remoteJid, { text: lista });
    },

    async historico(ctx) {
        const { sock, msg, senderNumber } = ctx;
        const remoteJid = msg.key.remoteJid;

        const history = await wallet.getActivationHistory(senderNumber);

        if (history.length === 0) {
            await sock.sendMessage(remoteJid, {
                text: `Voce ainda nao fez compras.\n\nUse ${settings.prefix}comprar para comecar!`
            });
            return;
        }

        let lista = `
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   *HISTORICO*             ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

`;

        for (const act of history.slice(0, 10)) {
            const serviceInfo = POPULAR_SERVICES[act.service] || { name: act.service, emoji: '' };
            const date = new Date(act.created_at).toLocaleDateString('pt-BR');
            const statusIcon = act.status === 'completed' ? '[OK]' : act.status === 'cancelled' ? '[X]' : '[...]';
            lista += `${serviceInfo.emoji} ${serviceInfo.name}\n`;
            lista += `   ${date} ${statusIcon} ${formatMoney(act.cost)}\n\n`;
        }

        await sock.sendMessage(remoteJid, { text: lista });
    },

    async addsaldo(ctx) {
        const { sock, msg, args, senderNumber, isOwner } = ctx;
        const remoteJid = msg.key.remoteJid;

        if (!isOwner) {
            await sock.sendMessage(remoteJid, {
                text: `Apenas o dono pode usar este comando!`
            });
            return;
        }

        if (args.length < 2) {
            await sock.sendMessage(remoteJid, {
                text: `Uso: ${settings.prefix}addsaldo [numero] [valor]\n\nEx: ${settings.prefix}addsaldo 5511999999999 50`
            });
            return;
        }

        const targetNumber = args[0].replace(/\D/g, '');
        const amount = parseFloat(args[1]);

        if (isNaN(amount) || amount <= 0) {
            await sock.sendMessage(remoteJid, { text: `Valor invalido!` });
            return;
        }

        await wallet.addBalance(targetNumber, amount, 'Credito manual');
        const newBalance = await wallet.getBalance(targetNumber);

        await sock.sendMessage(remoteJid, {
            text: `*Saldo adicionado!*\n\nUsuario: ${targetNumber}\nAdicionado: ${formatMoney(amount)}\nNovo saldo: ${formatMoney(newBalance)}`
        });
    },

    async saldoapi(ctx) {
        const { sock, msg, isOwner } = ctx;
        const remoteJid = msg.key.remoteJid;

        if (!isOwner) {
            await sock.sendMessage(remoteJid, { text: `Apenas o dono!` });
            return;
        }

        try {
            const balance = await smsService.getBalance();
            const rubToBrl = balance * RUB_TO_BRL;
            await sock.sendMessage(remoteJid, {
                text: `*Saldo API 5sim.net*\n\n${balance.toFixed(2)} RUB\n${formatMoney(rubToBrl)}`
            });
        } catch (error) {
            await sock.sendMessage(remoteJid, {
                text: `Erro ao consultar API: ${error.message}`
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
                text: `*Tempo esgotado!*\n\nNenhum SMS recebido para ${activationId}.\nO numero expirou.`
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
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   *CODIGO RECEBIDO*       ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

${serviceInfo.emoji} *Servico:* ${serviceInfo.name}

*CODIGO:* ${code}

Ativacao concluida!
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
