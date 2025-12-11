const axios = require('axios');

const BASE_URL = 'https://api.sms-activate.ae/stubs/handler_api.php';

class SMSActivateService {
    constructor(apiKey) {
        this.apiKey = apiKey;
    }

    async request(params) {
        try {
            const response = await axios.get(BASE_URL, {
                params: { api_key: this.apiKey, ...params },
                timeout: 30000
            });
            return response.data;
        } catch (error) {
            console.error('[SMS-Activate] Erro na requisição:', error.message);
            throw error;
        }
    }

    async getBalance() {
        const data = await this.request({ action: 'getBalance' });
        if (data.includes('ACCESS_BALANCE:')) {
            return parseFloat(data.split(':')[1]);
        }
        return parseFloat(data) || 0;
    }

    async getCountries() {
        const data = await this.request({ action: 'getCountries' });
        return typeof data === 'object' ? data : {};
    }

    async getServices(country = 0) {
        const data = await this.request({ action: 'getNumbersStatus', country });
        return typeof data === 'object' ? data : {};
    }

    async getPrices(country = 0, service = null) {
        const params = { action: 'getPrices', country };
        if (service) params.service = service;
        const data = await this.request(params);
        return typeof data === 'object' ? data : {};
    }

    async getNumber(service, country = 0) {
        const data = await this.request({ 
            action: 'getNumber', 
            service, 
            country 
        });

        if (data.includes('ACCESS_NUMBER:')) {
            const parts = data.split(':');
            return {
                success: true,
                activationId: parts[1],
                phoneNumber: parts[2]
            };
        }

        return {
            success: false,
            error: data
        };
    }

    async getNumberV2(service, country = 0) {
        const data = await this.request({ 
            action: 'getNumberV2', 
            service, 
            country 
        });

        if (data.activationId) {
            return {
                success: true,
                ...data
            };
        }

        return {
            success: false,
            error: data
        };
    }

    async getStatus(activationId) {
        const data = await this.request({ 
            action: 'getStatus', 
            id: activationId 
        });

        if (data.includes('STATUS_OK:')) {
            return {
                status: 'CODE_RECEIVED',
                code: data.split(':')[1]
            };
        } else if (data.includes('FULL_SMS:')) {
            return {
                status: 'FULL_SMS',
                message: data.split(':')[1]
            };
        } else if (data === 'STATUS_WAIT_CODE') {
            return { status: 'WAITING' };
        } else if (data === 'STATUS_WAIT_RETRY') {
            return { status: 'WAITING_RETRY' };
        } else if (data === 'STATUS_CANCEL') {
            return { status: 'CANCELLED' };
        }

        return { status: 'UNKNOWN', raw: data };
    }

    async setStatus(activationId, status) {
        return await this.request({ 
            action: 'setStatus', 
            id: activationId, 
            status 
        });
    }

    async markReady(activationId) {
        return await this.setStatus(activationId, 1);
    }

    async requestResend(activationId) {
        return await this.setStatus(activationId, 3);
    }

    async markComplete(activationId) {
        return await this.setStatus(activationId, 6);
    }

    async cancelActivation(activationId) {
        return await this.setStatus(activationId, 8);
    }

    async waitForCode(activationId, timeoutMs = 300000, intervalMs = 5000) {
        const startTime = Date.now();

        return new Promise((resolve, reject) => {
            const check = async () => {
                if (Date.now() - startTime > timeoutMs) {
                    reject(new Error('Tempo esgotado aguardando código SMS'));
                    return;
                }

                try {
                    const result = await this.getStatus(activationId);
                    
                    if (result.status === 'CODE_RECEIVED') {
                        resolve(result);
                    } else if (result.status === 'FULL_SMS') {
                        resolve(result);
                    } else if (result.status === 'CANCELLED') {
                        reject(new Error('Ativação cancelada'));
                    } else {
                        setTimeout(check, intervalMs);
                    }
                } catch (error) {
                    reject(error);
                }
            };

            check();
        });
    }
}

const POPULAR_SERVICES = {
    'wa': { name: 'WhatsApp', emoji: '💬' },
    'tg': { name: 'Telegram', emoji: '✈️' },
    'go': { name: 'Google', emoji: '🔍' },
    'fb': { name: 'Facebook', emoji: '📘' },
    'ig': { name: 'Instagram', emoji: '📸' },
    'tw': { name: 'Twitter/X', emoji: '🐦' },
    'oi': { name: 'OpenAI/ChatGPT', emoji: '🤖' },
    'ds': { name: 'Discord', emoji: '🎮' },
    'vk': { name: 'VKontakte', emoji: '🔵' },
    'vi': { name: 'Viber', emoji: '💜' },
    'ub': { name: 'Uber', emoji: '🚗' },
    'nf': { name: 'Netflix', emoji: '🎬' },
    'sp': { name: 'Spotify', emoji: '🎵' },
    'tt': { name: 'TikTok', emoji: '🎵' },
    'am': { name: 'Amazon', emoji: '📦' },
    'ya': { name: 'Yahoo', emoji: '📧' },
    'mi': { name: 'Microsoft', emoji: '🪟' },
    'ao': { name: 'AliExpress', emoji: '🛒' }
};

const POPULAR_COUNTRIES = {
    0: { name: 'Rússia', emoji: '🇷🇺', code: '+7' },
    1: { name: 'Ucrânia', emoji: '🇺🇦', code: '+380' },
    2: { name: 'Cazaquistão', emoji: '🇰🇿', code: '+7' },
    3: { name: 'China', emoji: '🇨🇳', code: '+86' },
    4: { name: 'Filipinas', emoji: '🇵🇭', code: '+63' },
    5: { name: 'Myanmar', emoji: '🇲🇲', code: '+95' },
    6: { name: 'Indonésia', emoji: '🇮🇩', code: '+62' },
    7: { name: 'Malásia', emoji: '🇲🇾', code: '+60' },
    12: { name: 'Índia', emoji: '🇮🇳', code: '+91' },
    16: { name: 'USA', emoji: '🇺🇸', code: '+1' },
    22: { name: 'Vietnã', emoji: '🇻🇳', code: '+84' },
    73: { name: 'Brasil', emoji: '🇧🇷', code: '+55' },
    117: { name: 'Portugal', emoji: '🇵🇹', code: '+351' },
    34: { name: 'Espanha', emoji: '🇪🇸', code: '+34' },
    56: { name: 'Argentina', emoji: '🇦🇷', code: '+54' },
    151: { name: 'Colômbia', emoji: '🇨🇴', code: '+57' },
    152: { name: 'México', emoji: '🇲🇽', code: '+52' }
};

module.exports = { 
    SMSActivateService, 
    POPULAR_SERVICES, 
    POPULAR_COUNTRIES 
};
