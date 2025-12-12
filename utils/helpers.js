const fs = require('fs');
const path = require('path');

const helpers = {
    sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
    
    formatNumber: (number) => {
        if (!number) return null;
        let formatted = number.replace(/[^0-9]/g, '');
        if (!formatted.includes('@s.whatsapp.net')) {
            formatted = formatted + '@s.whatsapp.net';
        }
        return formatted;
    },
    
    extractNumber: (jid) => {
        if (!jid) return null;
        let number = jid;
        if (number.includes(':')) {
            number = number.split(':')[0];
        }
        number = number
            .replace('@s.whatsapp.net', '')
            .replace('@g.us', '')
            .replace('@lid', '')
            .replace('lid', '');
        const digits = number.replace(/\D/g, '');
        return digits || number;
    },
    
    isGroup: (jid) => {
        return jid.endsWith('@g.us');
    },
    
    randomInt: (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    randomChoice: (array) => {
        return array[Math.floor(Math.random() * array.length)];
    },
    
    shuffleArray: (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },
    
    formatBytes: (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
    
    formatUptime: (seconds) => {
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        let result = '';
        if (days > 0) result += `${days}d `;
        if (hours > 0) result += `${hours}h `;
        if (minutes > 0) result += `${minutes}m `;
        result += `${secs}s`;
        
        return result;
    },
    
    ensureDir: (dirPath) => {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
    },
    
    readJSON: (filePath) => {
        try {
            if (fs.existsSync(filePath)) {
                const data = fs.readFileSync(filePath, 'utf-8');
                return JSON.parse(data);
            }
            return null;
        } catch (error) {
            return null;
        }
    },
    
    writeJSON: (filePath, data) => {
        try {
            const dir = path.dirname(filePath);
            helpers.ensureDir(dir);
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
            return true;
        } catch (error) {
            return false;
        }
    },
    
    isUrl: (text) => {
        const urlRegex = /(https?:\/\/[^\s]+)/gi;
        return urlRegex.test(text);
    },
    
    extractUrls: (text) => {
        const urlRegex = /(https?:\/\/[^\s]+)/gi;
        return text.match(urlRegex) || [];
    },
    
    capitalize: (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },
    
    cleanNumber: (number) => {
        return number.replace(/\D/g, '');
    }
};

module.exports = helpers;
