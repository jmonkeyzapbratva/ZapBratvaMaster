const axios = require('axios');

const BASE_URL = 'https://5sim.net/v1';

class FiveSimService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.headers = {
            'Authorization': `Bearer ${apiKey}`,
            'Accept': 'application/json'
        };
    }

    async request(endpoint, method = 'GET', data = null) {
        try {
            const config = {
                method,
                url: `${BASE_URL}${endpoint}`,
                headers: this.headers,
                timeout: 30000
            };
            
            if (data) {
                config.data = data;
            }
            
            const response = await axios(config);
            return response.data;
        } catch (error) {
            console.error('[5sim] Erro na requisição:', error.response?.data || error.message);
            throw error;
        }
    }

    async getBalance() {
        const data = await this.request('/user/profile');
        return data.balance || 0;
    }

    async getCountries() {
        const data = await this.request('/guest/countries');
        return data || {};
    }

    async getPrices() {
        const data = await this.request('/guest/prices');
        return data || {};
    }

    async getProducts(country = 'russia', operator = 'any') {
        try {
            const data = await this.request(`/guest/products/${country}/${operator}`);
            return data || {};
        } catch (error) {
            console.error('[5sim] Erro ao buscar produtos:', error.message);
            return {};
        }
    }

    async getProductPrice(country, service) {
        try {
            const prices = await this.getPrices();
            
            if (prices[country] && prices[country][service]) {
                const operators = prices[country][service];
                let lowestCost = Infinity;
                let totalCount = 0;
                
                for (const [operatorName, info] of Object.entries(operators)) {
                    if (info.count > 0) {
                        totalCount += info.count;
                        if (info.cost < lowestCost) {
                            lowestCost = info.cost;
                        }
                    }
                }
                
                if (lowestCost < Infinity && totalCount > 0) {
                    return { 
                        priceRub: lowestCost, 
                        count: totalCount 
                    };
                }
            }
            
            return null;
        } catch (error) {
            console.error('[5sim] Erro ao buscar preço:', error.message);
            return null;
        }
    }

    async getCountryPrices(country) {
        try {
            const prices = await this.getPrices();
            const result = {};
            
            if (prices[country]) {
                for (const [service, operators] of Object.entries(prices[country])) {
                    let lowestCost = Infinity;
                    let totalCount = 0;
                    
                    for (const [operatorName, info] of Object.entries(operators)) {
                        if (info.count > 0) {
                            totalCount += info.count;
                            if (info.cost < lowestCost) {
                                lowestCost = info.cost;
                            }
                        }
                    }
                    
                    if (lowestCost < Infinity && totalCount > 0) {
                        result[service] = { 
                            priceRub: lowestCost, 
                            count: totalCount 
                        };
                    }
                }
            }
            
            return result;
        } catch (error) {
            console.error('[5sim] Erro ao buscar preços do país:', error.message);
            return {};
        }
    }

    async getNumber(service, country = 'russia', operator = 'any') {
        try {
            const data = await this.request(`/user/buy/activation/${country}/${operator}/${service}`, 'GET');
            
            if (data && data.id) {
                return {
                    success: true,
                    activationId: data.id.toString(),
                    phoneNumber: data.phone.replace('+', ''),
                    priceRub: data.price,
                    operator: data.operator,
                    country: data.country
                };
            }

            return {
                success: false,
                error: 'NO_NUMBERS'
            };
        } catch (error) {
            const errorData = error.response?.data;
            const errorMsg = typeof errorData === 'string' ? errorData : (errorData?.message || error.message);
            
            if (errorMsg.includes('no free phones') || errorMsg.includes('not enough product')) {
                return { success: false, error: 'NO_NUMBERS' };
            }
            if (errorMsg.includes('not enough user balance') || errorMsg.includes('no money')) {
                return { success: false, error: 'NO_BALANCE' };
            }
            if (errorMsg.includes('bad country') || errorMsg.includes('bad service')) {
                return { success: false, error: 'INVALID_PARAMS' };
            }
            
            return { success: false, error: errorMsg };
        }
    }

    async getStatus(activationId) {
        try {
            const data = await this.request(`/user/check/${activationId}`);
            
            if (data.sms && data.sms.length > 0) {
                const lastSms = data.sms[data.sms.length - 1];
                return {
                    status: 'CODE_RECEIVED',
                    code: lastSms.code || '',
                    message: lastSms.text || ''
                };
            }
            
            if (data.status === 'RECEIVED') {
                return {
                    status: 'CODE_RECEIVED',
                    code: data.sms?.[0]?.code || '',
                    message: data.sms?.[0]?.text || ''
                };
            }
            
            if (data.status === 'PENDING') {
                return { status: 'WAITING' };
            }
            
            if (data.status === 'CANCELED') {
                return { status: 'CANCELLED' };
            }
            
            if (data.status === 'TIMEOUT') {
                return { status: 'TIMEOUT' };
            }
            
            if (data.status === 'FINISHED') {
                return { status: 'FINISHED' };
            }

            return { status: 'WAITING', raw: data };
        } catch (error) {
            return { status: 'ERROR', error: error.message };
        }
    }

    async finishActivation(activationId) {
        return await this.request(`/user/finish/${activationId}`, 'GET');
    }

    async cancelActivation(activationId) {
        return await this.request(`/user/cancel/${activationId}`, 'GET');
    }

    async banActivation(activationId) {
        return await this.request(`/user/ban/${activationId}`, 'GET');
    }
}

const POPULAR_SERVICES = {
    'whatsapp': { name: 'WhatsApp', emoji: '💬', code: 'whatsapp' },
    'telegram': { name: 'Telegram', emoji: '✈️', code: 'telegram' },
    'google': { name: 'Google', emoji: '🔍', code: 'google' },
    'facebook': { name: 'Facebook', emoji: '📘', code: 'facebook' },
    'instagram': { name: 'Instagram', emoji: '📸', code: 'instagram' },
    'twitter': { name: 'Twitter/X', emoji: '🐦', code: 'twitter' },
    'openai': { name: 'OpenAI/ChatGPT', emoji: '🤖', code: 'openai' },
    'discord': { name: 'Discord', emoji: '🎮', code: 'discord' },
    'tiktok': { name: 'TikTok', emoji: '🎵', code: 'tiktok' },
    'uber': { name: 'Uber', emoji: '🚗', code: 'uber' },
    'netflix': { name: 'Netflix', emoji: '🎬', code: 'netflix' },
    'spotify': { name: 'Spotify', emoji: '🎵', code: 'spotify' },
    'amazon': { name: 'Amazon', emoji: '📦', code: 'amazon' },
    'microsoft': { name: 'Microsoft', emoji: '🪟', code: 'microsoft' },
    'yahoo': { name: 'Yahoo', emoji: '📧', code: 'yahoo' },
    'tinder': { name: 'Tinder', emoji: '🔥', code: 'tinder' },
    'snapchat': { name: 'Snapchat', emoji: '👻', code: 'snapchat' },
    'linkedin': { name: 'LinkedIn', emoji: '💼', code: 'linkedin' }
};

const POPULAR_COUNTRIES = {
    'russia': { name: 'Rússia', emoji: '🇷🇺', code: '+7' },
    'ukraine': { name: 'Ucrânia', emoji: '🇺🇦', code: '+380' },
    'kazakhstan': { name: 'Cazaquistão', emoji: '🇰🇿', code: '+7' },
    'china': { name: 'China', emoji: '🇨🇳', code: '+86' },
    'philippines': { name: 'Filipinas', emoji: '🇵🇭', code: '+63' },
    'indonesia': { name: 'Indonésia', emoji: '🇮🇩', code: '+62' },
    'malaysia': { name: 'Malásia', emoji: '🇲🇾', code: '+60' },
    'india': { name: 'Índia', emoji: '🇮🇳', code: '+91' },
    'usa': { name: 'EUA', emoji: '🇺🇸', code: '+1' },
    'england': { name: 'Inglaterra', emoji: '🇬🇧', code: '+44' },
    'vietnam': { name: 'Vietnã', emoji: '🇻🇳', code: '+84' },
    'brazil': { name: 'Brasil', emoji: '🇧🇷', code: '+55' },
    'portugal': { name: 'Portugal', emoji: '🇵🇹', code: '+351' },
    'spain': { name: 'Espanha', emoji: '🇪🇸', code: '+34' },
    'argentina': { name: 'Argentina', emoji: '🇦🇷', code: '+54' },
    'colombia': { name: 'Colômbia', emoji: '🇨🇴', code: '+57' },
    'mexico': { name: 'México', emoji: '🇲🇽', code: '+52' },
    'netherlands': { name: 'Holanda', emoji: '🇳🇱', code: '+31' },
    'poland': { name: 'Polônia', emoji: '🇵🇱', code: '+48' },
    'romania': { name: 'Romênia', emoji: '🇷🇴', code: '+40' }
};

module.exports = { 
    FiveSimService, 
    POPULAR_SERVICES, 
    POPULAR_COUNTRIES 
};
