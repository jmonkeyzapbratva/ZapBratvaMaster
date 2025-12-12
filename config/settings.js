const settings = {
    botName: 'BRATVA',
    botVersion: '3.0.0',
    ownerNumber: '555191015034',
    ownerLID: '177829396402359',
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
        'palavrao1',
        'palavrao2'
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
