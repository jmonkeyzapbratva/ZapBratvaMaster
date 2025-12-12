const axios = require('axios');
const settings = require('../config/settings');

const HEADER = `╔♡━━━━━━━━━━━━━━━━━━━━━━♡╗
║  🇨🇦 *ALIANCA BRATVA* 🇨🇦  ║
╚♡━━━━━━━━━━━━━━━━━━━━━━♡╝`;

const consultaCommands = {

    async ip(ctx) {
        const { sock, msg, args } = ctx;
        const remoteJid = msg.key.remoteJid;

        if (!args[0]) {
            return await sock.sendMessage(remoteJid, {
                text: `❌ Informe um IP!\n\n*Uso:* ${settings.prefix}ip 8.8.8.8`
            });
        }

        const ip = args[0];
        
        try {
            const res = await axios.get(`https://ipwho.is/${ip}`);
            const data = res.data;

            if (!data.success) {
                return await sock.sendMessage(remoteJid, {
                    text: `❌ IP inválido ou não encontrado.`
                });
            }

            const resultado = `${HEADER}
╭━━━⪩ 🌐 *CONSULTA IP* ⪨━━━
│🇨🇦 *IP:* ${ip}
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ 📍 *LOCALIZACAO* ⪨━━━
│🇨🇦 Cidade: *${data.city || 'N/A'}*
│🇨🇦 Regiao: *${data.region || 'N/A'}*
│🇨🇦 Pais: *${data.country || 'N/A'}* ${data.flag?.emoji || ''}
│🇨🇦 Continente: *${data.continent || 'N/A'}*
│🇨🇦 Latitude: *${data.latitude || 'N/A'}*
│🇨🇦 Longitude: *${data.longitude || 'N/A'}*
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ 📶 *CONEXAO* ⪨━━━
│🇨🇦 Provedor: *${data.connection?.isp || 'N/A'}*
│🇨🇦 Org: *${data.connection?.org || 'N/A'}*
│🇨🇦 ASN: *${data.connection?.asn || 'N/A'}*
│🇨🇦 Tipo: *${data.type || 'N/A'}*
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ 🕐 *FUSO* ⪨━━━
│🇨🇦 Timezone: *${data.timezone?.id || 'N/A'}*
│🇨🇦 UTC: *${data.timezone?.utc || 'N/A'}*
╰━━━━━─「🇨🇦」─━━━━━`;

            await sock.sendMessage(remoteJid, { text: resultado });

        } catch (error) {
            console.error('[CONSULTA] Erro IP:', error.message);
            await sock.sendMessage(remoteJid, {
                text: `❌ Erro ao consultar IP: ${error.message}`
            });
        }
    },

    async cep(ctx) {
        const { sock, msg, args } = ctx;
        const remoteJid = msg.key.remoteJid;

        if (!args[0]) {
            return await sock.sendMessage(remoteJid, {
                text: `❌ Informe um CEP!\n\n*Uso:* ${settings.prefix}cep 01001000`
            });
        }

        const cep = args[0].replace(/\D/g, '');
        
        if (cep.length !== 8) {
            return await sock.sendMessage(remoteJid, {
                text: `❌ CEP inválido! Use 8 dígitos.`
            });
        }

        try {
            const res = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
            const data = res.data;

            if (data.erro) {
                return await sock.sendMessage(remoteJid, {
                    text: `❌ CEP não encontrado.`
                });
            }

            const resultado = `${HEADER}
╭━━━⪩ 📮 *CONSULTA CEP* ⪨━━━
│🇨🇦 *CEP:* ${data.cep}
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ 📍 *ENDERECO* ⪨━━━
│🇨🇦 Rua: *${data.logradouro || 'N/A'}*
│🇨🇦 Bairro: *${data.bairro || 'N/A'}*
│🇨🇦 Cidade: *${data.localidade || 'N/A'}*
│🇨🇦 Estado: *${data.uf || 'N/A'}*
│🇨🇦 IBGE: *${data.ibge || 'N/A'}*
│🇨🇦 DDD: *${data.ddd || 'N/A'}*
╰━━━━━─「🇨🇦」─━━━━━`;

            await sock.sendMessage(remoteJid, { text: resultado });

        } catch (error) {
            console.error('[CONSULTA] Erro CEP:', error.message);
            await sock.sendMessage(remoteJid, {
                text: `❌ Erro ao consultar CEP: ${error.message}`
            });
        }
    },

    async ddd(ctx) {
        const { sock, msg, args } = ctx;
        const remoteJid = msg.key.remoteJid;

        if (!args[0]) {
            return await sock.sendMessage(remoteJid, {
                text: `❌ Informe um DDD!\n\n*Uso:* ${settings.prefix}ddd 11`
            });
        }

        const ddd = args[0].replace(/\D/g, '');
        
        const ddds = {
            '11': { cidade: 'São Paulo', estado: 'SP', regiao: 'Sudeste' },
            '12': { cidade: 'São José dos Campos', estado: 'SP', regiao: 'Sudeste' },
            '13': { cidade: 'Santos', estado: 'SP', regiao: 'Sudeste' },
            '14': { cidade: 'Bauru', estado: 'SP', regiao: 'Sudeste' },
            '15': { cidade: 'Sorocaba', estado: 'SP', regiao: 'Sudeste' },
            '16': { cidade: 'Ribeirão Preto', estado: 'SP', regiao: 'Sudeste' },
            '17': { cidade: 'São José do Rio Preto', estado: 'SP', regiao: 'Sudeste' },
            '18': { cidade: 'Presidente Prudente', estado: 'SP', regiao: 'Sudeste' },
            '19': { cidade: 'Campinas', estado: 'SP', regiao: 'Sudeste' },
            '21': { cidade: 'Rio de Janeiro', estado: 'RJ', regiao: 'Sudeste' },
            '22': { cidade: 'Campos', estado: 'RJ', regiao: 'Sudeste' },
            '24': { cidade: 'Volta Redonda', estado: 'RJ', regiao: 'Sudeste' },
            '27': { cidade: 'Vitória', estado: 'ES', regiao: 'Sudeste' },
            '28': { cidade: 'Cachoeiro', estado: 'ES', regiao: 'Sudeste' },
            '31': { cidade: 'Belo Horizonte', estado: 'MG', regiao: 'Sudeste' },
            '32': { cidade: 'Juiz de Fora', estado: 'MG', regiao: 'Sudeste' },
            '33': { cidade: 'Governador Valadares', estado: 'MG', regiao: 'Sudeste' },
            '34': { cidade: 'Uberlândia', estado: 'MG', regiao: 'Sudeste' },
            '35': { cidade: 'Poços de Caldas', estado: 'MG', regiao: 'Sudeste' },
            '37': { cidade: 'Divinópolis', estado: 'MG', regiao: 'Sudeste' },
            '38': { cidade: 'Montes Claros', estado: 'MG', regiao: 'Sudeste' },
            '41': { cidade: 'Curitiba', estado: 'PR', regiao: 'Sul' },
            '42': { cidade: 'Ponta Grossa', estado: 'PR', regiao: 'Sul' },
            '43': { cidade: 'Londrina', estado: 'PR', regiao: 'Sul' },
            '44': { cidade: 'Maringá', estado: 'PR', regiao: 'Sul' },
            '45': { cidade: 'Foz do Iguaçu', estado: 'PR', regiao: 'Sul' },
            '46': { cidade: 'Francisco Beltrão', estado: 'PR', regiao: 'Sul' },
            '47': { cidade: 'Joinville', estado: 'SC', regiao: 'Sul' },
            '48': { cidade: 'Florianópolis', estado: 'SC', regiao: 'Sul' },
            '49': { cidade: 'Chapecó', estado: 'SC', regiao: 'Sul' },
            '51': { cidade: 'Porto Alegre', estado: 'RS', regiao: 'Sul' },
            '53': { cidade: 'Pelotas', estado: 'RS', regiao: 'Sul' },
            '54': { cidade: 'Caxias do Sul', estado: 'RS', regiao: 'Sul' },
            '55': { cidade: 'Santa Maria', estado: 'RS', regiao: 'Sul' },
            '61': { cidade: 'Brasília', estado: 'DF', regiao: 'Centro-Oeste' },
            '62': { cidade: 'Goiânia', estado: 'GO', regiao: 'Centro-Oeste' },
            '63': { cidade: 'Palmas', estado: 'TO', regiao: 'Norte' },
            '64': { cidade: 'Rio Verde', estado: 'GO', regiao: 'Centro-Oeste' },
            '65': { cidade: 'Cuiabá', estado: 'MT', regiao: 'Centro-Oeste' },
            '66': { cidade: 'Rondonópolis', estado: 'MT', regiao: 'Centro-Oeste' },
            '67': { cidade: 'Campo Grande', estado: 'MS', regiao: 'Centro-Oeste' },
            '68': { cidade: 'Rio Branco', estado: 'AC', regiao: 'Norte' },
            '69': { cidade: 'Porto Velho', estado: 'RO', regiao: 'Norte' },
            '71': { cidade: 'Salvador', estado: 'BA', regiao: 'Nordeste' },
            '73': { cidade: 'Ilhéus', estado: 'BA', regiao: 'Nordeste' },
            '74': { cidade: 'Juazeiro', estado: 'BA', regiao: 'Nordeste' },
            '75': { cidade: 'Feira de Santana', estado: 'BA', regiao: 'Nordeste' },
            '77': { cidade: 'Barreiras', estado: 'BA', regiao: 'Nordeste' },
            '79': { cidade: 'Aracaju', estado: 'SE', regiao: 'Nordeste' },
            '81': { cidade: 'Recife', estado: 'PE', regiao: 'Nordeste' },
            '82': { cidade: 'Maceió', estado: 'AL', regiao: 'Nordeste' },
            '83': { cidade: 'João Pessoa', estado: 'PB', regiao: 'Nordeste' },
            '84': { cidade: 'Natal', estado: 'RN', regiao: 'Nordeste' },
            '85': { cidade: 'Fortaleza', estado: 'CE', regiao: 'Nordeste' },
            '86': { cidade: 'Teresina', estado: 'PI', regiao: 'Nordeste' },
            '87': { cidade: 'Petrolina', estado: 'PE', regiao: 'Nordeste' },
            '88': { cidade: 'Juazeiro do Norte', estado: 'CE', regiao: 'Nordeste' },
            '89': { cidade: 'Picos', estado: 'PI', regiao: 'Nordeste' },
            '91': { cidade: 'Belém', estado: 'PA', regiao: 'Norte' },
            '92': { cidade: 'Manaus', estado: 'AM', regiao: 'Norte' },
            '93': { cidade: 'Santarém', estado: 'PA', regiao: 'Norte' },
            '94': { cidade: 'Marabá', estado: 'PA', regiao: 'Norte' },
            '95': { cidade: 'Boa Vista', estado: 'RR', regiao: 'Norte' },
            '96': { cidade: 'Macapá', estado: 'AP', regiao: 'Norte' },
            '97': { cidade: 'Coari', estado: 'AM', regiao: 'Norte' },
            '98': { cidade: 'São Luís', estado: 'MA', regiao: 'Nordeste' },
            '99': { cidade: 'Imperatriz', estado: 'MA', regiao: 'Nordeste' }
        };

        const info = ddds[ddd];

        if (!info) {
            return await sock.sendMessage(remoteJid, {
                text: `❌ DDD ${ddd} não encontrado.`
            });
        }

        const resultado = `${HEADER}
╭━━━⪩ 📞 *CONSULTA DDD* ⪨━━━
│🇨🇦 *DDD:* ${ddd}
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ 📍 *INFO* ⪨━━━
│🇨🇦 Cidade: *${info.cidade}*
│🇨🇦 Estado: *${info.estado}*
│🇨🇦 Região: *${info.regiao}*
╰━━━━━─「🇨🇦」─━━━━━`;

        await sock.sendMessage(remoteJid, { text: resultado });
    },

    async dns(ctx) {
        const { sock, msg, args } = ctx;
        const remoteJid = msg.key.remoteJid;

        if (!args[0]) {
            return await sock.sendMessage(remoteJid, {
                text: `❌ Informe um domínio!\n\n*Uso:* ${settings.prefix}dns google.com`
            });
        }

        let domain = args[0].replace(/^https?:\/\//, '').replace(/\/.*/g, '');
        
        try {
            const res = await axios.get(`https://dns.google/resolve?name=${domain}&type=A`);
            const data = res.data;

            if (!data.Answer || data.Answer.length === 0) {
                return await sock.sendMessage(remoteJid, {
                    text: `❌ Não foi possível resolver o DNS.`
                });
            }

            const ips = data.Answer.filter(a => a.type === 1).map(a => a.data);

            const resultado = `${HEADER}
╭━━━⪩ 🌐 *CONSULTA DNS* ⪨━━━
│🇨🇦 *Domínio:* ${domain}
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ 📡 *REGISTROS A* ⪨━━━
${ips.map(ip => `│🇨🇦 IP: *${ip}*`).join('\n')}
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ 📊 *INFO* ⪨━━━
│🇨🇦 Status: *${data.Status === 0 ? 'OK' : 'Erro'}*
│🇨🇦 TTL: *${data.Answer[0]?.TTL || 'N/A'}s*
╰━━━━━─「🇨🇦」─━━━━━`;

            await sock.sendMessage(remoteJid, { text: resultado });

        } catch (error) {
            console.error('[CONSULTA] Erro DNS:', error.message);
            await sock.sendMessage(remoteJid, {
                text: `❌ Erro ao consultar DNS: ${error.message}`
            });
        }
    },

    async rastrear(ctx) {
        const { sock, msg, args } = ctx;
        const remoteJid = msg.key.remoteJid;

        if (!args[0]) {
            return await sock.sendMessage(remoteJid, {
                text: `❌ Informe o código de rastreio!\n\n*Uso:* ${settings.prefix}rastrear CODIGO123`
            });
        }

        const codigo = args[0].toUpperCase();

        try {
            const resultado = `${HEADER}
╭━━━⪩ 📦 *RASTREIO* ⪨━━━
│🇨🇦 *Código:* ${codigo}
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ 📍 *STATUS* ⪨━━━
│🇨🇦 ⚠️ Sistema de rastreio
│🇨🇦 em manutenção.
│🇨🇦  
│🇨🇦 Use: *correios.com.br*
╰━━━━━─「🇨🇦」─━━━━━`;

            await sock.sendMessage(remoteJid, { text: resultado });

        } catch (error) {
            await sock.sendMessage(remoteJid, {
                text: `❌ Erro: ${error.message}`
            });
        }
    },

    async clima(ctx) {
        const { sock, msg, args } = ctx;
        const remoteJid = msg.key.remoteJid;

        if (!args[0]) {
            return await sock.sendMessage(remoteJid, {
                text: `❌ Informe uma cidade!\n\n*Uso:* ${settings.prefix}clima São Paulo`
            });
        }

        const cidade = args.join(' ');

        try {
            const res = await axios.get(`https://wttr.in/${encodeURIComponent(cidade)}?format=j1`);
            const data = res.data;
            const current = data.current_condition[0];
            const area = data.nearest_area[0];

            const resultado = `${HEADER}
╭━━━⪩ 🌤️ *CLIMA* ⪨━━━
│🇨🇦 *${area.areaName[0].value}*
│🇨🇦 ${area.region[0].value}, ${area.country[0].value}
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ 🌡️ *AGORA* ⪨━━━
│🇨🇦 Temp: *${current.temp_C}°C*
│🇨🇦 Sensação: *${current.FeelsLikeC}°C*
│🇨🇦 Umidade: *${current.humidity}%*
│🇨🇦 Vento: *${current.windspeedKmph} km/h*
│🇨🇦 Descrição: *${current.weatherDesc[0].value}*
╰━━━━━─「🇨🇦」─━━━━━`;

            await sock.sendMessage(remoteJid, { text: resultado });

        } catch (error) {
            console.error('[CONSULTA] Erro clima:', error.message);
            await sock.sendMessage(remoteJid, {
                text: `❌ Cidade não encontrada.`
            });
        }
    },

    async whois(ctx) {
        const { sock, msg, args } = ctx;
        const remoteJid = msg.key.remoteJid;

        if (!args[0]) {
            return await sock.sendMessage(remoteJid, {
                text: `❌ Informe um domínio!\n\n*Uso:* ${settings.prefix}whois google.com`
            });
        }

        const domain = args[0].replace(/^https?:\/\//, '').replace(/\/.*/g, '');

        try {
            const res = await axios.get(`https://api.domainsdb.info/v1/domains/search?domain=${domain}`);
            const data = res.data;

            if (!data.domains || data.domains.length === 0) {
                return await sock.sendMessage(remoteJid, {
                    text: `❌ Domínio não encontrado.`
                });
            }

            const info = data.domains[0];

            const resultado = `${HEADER}
╭━━━⪩ 🌐 *WHOIS* ⪨━━━
│🇨🇦 *Domínio:* ${info.domain}
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ 📊 *INFO* ⪨━━━
│🇨🇦 Criado: *${info.create_date || 'N/A'}*
│🇨🇦 Atualizado: *${info.update_date || 'N/A'}*
│🇨🇦 País: *${info.country || 'N/A'}*
│🇨🇦 Status: *Ativo*
╰━━━━━─「🇨🇦」─━━━━━`;

            await sock.sendMessage(remoteJid, { text: resultado });

        } catch (error) {
            await sock.sendMessage(remoteJid, {
                text: `❌ Erro ao consultar WHOIS.`
            });
        }
    },

    async calcular(ctx) {
        const { sock, msg, args } = ctx;
        const remoteJid = msg.key.remoteJid;

        if (!args[0]) {
            return await sock.sendMessage(remoteJid, {
                text: `❌ Informe uma expressão!\n\n*Uso:* ${settings.prefix}calcular 10+5*2`
            });
        }

        const expressao = args.join(' ').replace(/[^0-9+\-*/().%\s]/g, '');

        try {
            const resultado = eval(expressao);
            
            await sock.sendMessage(remoteJid, {
                text: `${HEADER}
╭━━━⪩ 🧮 *CALCULADORA* ⪨━━━
│🇨🇦 *Expressão:* ${expressao}
│🇨🇦 *Resultado:* ${resultado}
╰━━━━━─「🇨🇦」─━━━━━`
            });

        } catch (error) {
            await sock.sendMessage(remoteJid, {
                text: `❌ Expressão inválida!`
            });
        }
    },

    async encurtar(ctx) {
        const { sock, msg, args } = ctx;
        const remoteJid = msg.key.remoteJid;

        if (!args[0]) {
            return await sock.sendMessage(remoteJid, {
                text: `❌ Informe um link!\n\n*Uso:* ${settings.prefix}encurtar https://google.com`
            });
        }

        const url = args[0];

        try {
            const res = await axios.get(`https://is.gd/create.php?format=json&url=${encodeURIComponent(url)}`);
            
            if (res.data.shorturl) {
                await sock.sendMessage(remoteJid, {
                    text: `${HEADER}
╭━━━⪩ 🔗 *ENCURTADOR* ⪨━━━
│🇨🇦 *Original:* ${url.substring(0, 50)}...
│🇨🇦 *Curto:* ${res.data.shorturl}
╰━━━━━─「🇨🇦」─━━━━━`
                });
            } else {
                throw new Error('Falha ao encurtar');
            }

        } catch (error) {
            await sock.sendMessage(remoteJid, {
                text: `❌ Erro ao encurtar link.`
            });
        }
    },

    async menuconsultas(ctx) {
        const { sock, msg } = ctx;
        const remoteJid = msg.key.remoteJid;
        const prefix = settings.prefix;

        const menu = `${HEADER}
╭━━━⪩ 🔍 *CONSULTAS* ⪨━━━
│🇨🇦 ${prefix}ip [ip]
│🇨🇦 ${prefix}cep [cep]
│🇨🇦 ${prefix}ddd [ddd]
│🇨🇦 ${prefix}dns [dominio]
│🇨🇦 ${prefix}whois [dominio]
│🇨🇦 ${prefix}clima [cidade]
│🇨🇦 ${prefix}rastrear [codigo]
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ 🔧 *FERRAMENTAS* ⪨━━━
│🇨🇦 ${prefix}calcular [expr]
│🇨🇦 ${prefix}encurtar [link]
╰━━━━━─「🇨🇦」─━━━━━
╭━━━⪩ 🔜 *EM BREVE* ⪨━━━
│🇨🇦 ${prefix}cpf [cpf]
│🇨🇦 ${prefix}placa [placa]
│🇨🇦 ${prefix}telefone [num]
│🇨🇦 (Requer API premium)
╰━━━━━─「🇨🇦」─━━━━━`;

        await sock.sendMessage(remoteJid, { text: menu });
    }
};

module.exports = consultaCommands;
