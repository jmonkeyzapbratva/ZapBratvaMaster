const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');
const helpers = require('../utils/helpers');

const dataDir = path.join(__dirname, 'data');

helpers.ensureDir(dataDir);

const dbFiles = {
    groups: path.join(dataDir, 'groups.json'),
    botAdmins: path.join(dataDir, 'bot-admins.json'),
    banned: path.join(dataDir, 'banned.json'),
    stats: path.join(dataDir, 'stats.json'),
    settings: path.join(dataDir, 'settings.json')
};

const defaultData = {
    groups: {},
    botAdmins: [],
    banned: [],
    stats: {
        commandsUsed: 0,
        messagesReceived: 0,
        groupsJoined: 0,
        startTime: Date.now()
    },
    settings: {}
};

const loadData = (type) => {
    const file = dbFiles[type];
    if (!file) return null;
    
    const data = helpers.readJSON(file);
    if (data === null) {
        saveData(type, defaultData[type]);
        return defaultData[type];
    }
    return data;
};

const saveData = (type, data) => {
    const file = dbFiles[type];
    if (!file) return false;
    return helpers.writeJSON(file, data);
};

const db = {
    getGroup: (groupId) => {
        const groups = loadData('groups');
        if (!groups[groupId]) {
            groups[groupId] = {
                welcome: true,
                goodbye: true,
                antiLink: false,
                antiFlood: false,
                antiBadWords: false,
                muted: false,
                welcomeMsg: null,
                goodbyeMsg: null,
                rules: null,
                botDisabled: false
            };
            saveData('groups', groups);
        }
        return groups[groupId];
    },
    
    setGroup: (groupId, key, value) => {
        const groups = loadData('groups');
        if (!groups[groupId]) {
            groups[groupId] = {};
        }
        groups[groupId][key] = value;
        return saveData('groups', groups);
    },
    
    getAllGroups: () => {
        return loadData('groups');
    },
    
    isBotAdmin: (number) => {
        const admins = loadData('botAdmins');
        return admins.includes(number);
    },
    
    addBotAdmin: (number) => {
        const admins = loadData('botAdmins');
        if (!admins.includes(number)) {
            admins.push(number);
            return saveData('botAdmins', admins);
        }
        return true;
    },
    
    removeBotAdmin: (number) => {
        let admins = loadData('botAdmins');
        admins = admins.filter(a => a !== number);
        return saveData('botAdmins', admins);
    },
    
    getBotAdmins: () => {
        return loadData('botAdmins');
    },
    
    isBanned: (number) => {
        const banned = loadData('banned');
        return banned.includes(number);
    },
    
    banUser: (number) => {
        const banned = loadData('banned');
        if (!banned.includes(number)) {
            banned.push(number);
            return saveData('banned', banned);
        }
        return true;
    },
    
    unbanUser: (number) => {
        let banned = loadData('banned');
        banned = banned.filter(b => b !== number);
        return saveData('banned', banned);
    },
    
    getStats: () => {
        return loadData('stats');
    },
    
    incrementStat: (key) => {
        const stats = loadData('stats');
        if (typeof stats[key] === 'number') {
            stats[key]++;
            saveData('stats', stats);
        }
        return stats;
    },
    
    backup: () => {
        const backupDir = path.join(__dirname, 'backups');
        helpers.ensureDir(backupDir);
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = path.join(backupDir, `backup-${timestamp}`);
        helpers.ensureDir(backupPath);
        
        Object.keys(dbFiles).forEach(type => {
            const data = loadData(type);
            helpers.writeJSON(path.join(backupPath, `${type}.json`), data);
        });
        
        logger.success(`Backup criado: ${backupPath}`);
        return backupPath;
    },
    
    getSetting: (key) => {
        const settings = loadData('settings');
        return settings[key];
    },
    
    setSetting: (key, value) => {
        const settings = loadData('settings');
        settings[key] = value;
        return saveData('settings', settings);
    }
};

module.exports = db;
