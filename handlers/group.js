const settings = require('../config/settings');
const messages = require('../config/messages');
const logger = require('../utils/logger');
const helpers = require('../utils/helpers');
const db = require('../storage/database');

const handleGroupParticipants = async (sock, update) => {
    try {
        const { id, participants, action } = update;
        
        const groupSettings = db.getGroup(id);
        const groupMetadata = await sock.groupMetadata(id);
        const groupName = groupMetadata.subject;
        
        for (const participant of participants) {
            const number = helpers.extractNumber(participant);
            
            if (action === 'add') {
                logger.info(`${number} entrou no grupo ${groupName}`);
                
                if (groupSettings.welcome) {
                    let welcomeText = groupSettings.welcomeMsg || messages.welcome.text;
                    welcomeText = welcomeText
                        .replace(/{user}/g, `@${number}`)
                        .replace(/{group}/g, groupName);
                    
                    await sock.sendMessage(id, {
                        text: `${messages.welcome.title}\n\n${welcomeText}`,
                        mentions: [participant]
                    });
                }
            }
            
            if (action === 'remove') {
                logger.info(`${number} saiu do grupo ${groupName}`);
                
                if (groupSettings.goodbye) {
                    let goodbyeText = groupSettings.goodbyeMsg || messages.goodbye.text;
                    goodbyeText = goodbyeText.replace(/{user}/g, `@${number}`);
                    
                    await sock.sendMessage(id, {
                        text: `${messages.goodbye.title}\n\n${goodbyeText}`,
                        mentions: [participant]
                    });
                }
            }
            
            if (action === 'promote') {
                logger.info(`${number} foi promovido a admin em ${groupName}`);
                await sock.sendMessage(id, {
                    text: `🎉 *NOVO ADMIN*\n\n@${number} foi promovido a administrador!`,
                    mentions: [participant]
                });
            }
            
            if (action === 'demote') {
                logger.info(`${number} foi rebaixado de admin em ${groupName}`);
                await sock.sendMessage(id, {
                    text: `📉 *REBAIXADO*\n\n@${number} não é mais administrador.`,
                    mentions: [participant]
                });
            }
        }
    } catch (error) {
        logger.error(`Erro no handler de grupo: ${error.message}`);
    }
};

module.exports = { handleGroupParticipants };
