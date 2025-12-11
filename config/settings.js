const settings = {
    botName: '🤖 BRATVA BOT',
    ownerNumber: '5551991015034',
    ownerName: 'BRATVA',
    prefix: '!',
    language: 'pt-BR',
    
    autoRead: true,
    autoTyping: true,
    
    welcomeEnabled: true,
    goodbyeEnabled: true,
    
    antiLink: false,
    antiFlood: false,
    antiBadWords: false,
    
    floodMessages: 5,
    floodTime: 5000,
    
    backupInterval: 6 * 60 * 60 * 1000,
    
    badWords: [
        'palavrão1',
        'palavrão2'
    ],
    
    allowedLinks: [
        'youtube.com',
        'youtu.be'
    ],
    
    colors: {
        primary: '#00ff00',
        secondary: '#0099ff',
        danger: '#ff0000',
        warning: '#ffff00'
    }
};

module.exports = settings;
