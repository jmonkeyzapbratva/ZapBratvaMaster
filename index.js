const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore } = require('@whiskeysockets/baileys');
const pino = require('pino');
const express = require('express');
const fs = require('fs');
const path = require('path');

const logger = require('./utils/logger');
const helpers = require('./utils/helpers');
const settings = require('./config/settings');
const db = require('./storage/database');
const { handleMessage } = require('./handlers/message');
const { handleGroupParticipants } = require('./handlers/group');

const app = express();
const PORT = process.env.PORT || 5000;

let sock = null;
let qrDisplayed = false;

const authFolder = path.join(__dirname, 'auth_info');
helpers.ensureDir(authFolder);

const startBot = async () => {
    logger.banner();
    logger.divider();
    
    const { state, saveCreds } = await useMultiFileAuthState(authFolder);
    const { version } = await fetchLatestBaileysVersion();
    
    logger.info(`WhatsApp Web Version: ${version.join('.')}`);
    
    sock = makeWASocket({
        version,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' }))
        },
        printQRInTerminal: true,
        logger: pino({ level: 'silent' }),
        browser: ['BRATVA BOT', 'Chrome', '120.0.0'],
        connectTimeoutMs: 60000,
        defaultQueryTimeoutMs: 0,
        keepAliveIntervalMs: 10000,
        emitOwnEvents: false,
        fireInitQueries: true,
        generateHighQualityLinkPreview: true,
        syncFullHistory: false,
        markOnlineOnConnect: true
    });
    
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (qr && !qrDisplayed) {
            logger.info('QR Code gerado! Escaneie com seu WhatsApp.');
            qrDisplayed = true;
        }
        
        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            
            logger.connection('close');
            
            if (shouldReconnect) {
                logger.info('Reconectando em 5 segundos...');
                setTimeout(startBot, 5000);
            } else {
                logger.error('Desconectado permanentemente. Delete a pasta auth_info e reinicie.');
            }
        } else if (connection === 'connecting') {
            logger.connection('connecting');
        } else if (connection === 'open') {
            logger.connection('open');
            logger.success('Bot conectado com sucesso!');
            logger.divider();
            
            qrDisplayed = false;
            
            const botNumber = sock.user.id.split(':')[0];
            logger.info(`Bot: ${sock.user.name || 'BRATVA BOT'}`);
            logger.info(`Número: ${botNumber}`);
            logger.info(`Dono: ${settings.ownerNumber}`);
            logger.info(`Prefixo: ${settings.prefix}`);
            logger.divider();
            
            startBackupSchedule();
        }
    });
    
    sock.ev.on('creds.update', saveCreds);
    
    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return;
        
        for (const msg of messages) {
            await handleMessage(sock, msg);
        }
    });
    
    sock.ev.on('group-participants.update', async (update) => {
        await handleGroupParticipants(sock, update);
    });
    
    sock.ev.on('groups.update', async (updates) => {
        for (const update of updates) {
            logger.info(`Grupo atualizado: ${update.subject || update.id}`);
        }
    });
    
    return sock;
};

const startBackupSchedule = () => {
    setInterval(() => {
        logger.info('Executando backup automático...');
        db.backup();
    }, settings.backupInterval);
    
    logger.info(`Backup automático configurado (a cada ${settings.backupInterval / 1000 / 60 / 60} horas)`);
};

app.get('/', (req, res) => {
    const stats = db.getStats();
    const uptime = helpers.formatUptime((Date.now() - stats.startTime) / 1000);
    
    res.json({
        status: 'online',
        bot: settings.botName,
        version: '2.0.0',
        uptime,
        stats: {
            messages: stats.messagesReceived,
            commands: stats.commandsUsed
        },
        timestamp: new Date().toISOString()
    });
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy' });
});

app.get('/qr', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>BRATVA BOT - QR Code</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                    color: white;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    margin: 0;
                }
                h1 { color: #00ff88; }
                .info {
                    background: rgba(255,255,255,0.1);
                    padding: 20px;
                    border-radius: 10px;
                    margin: 20px;
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <h1>🤖 BRATVA BOT</h1>
            <div class="info">
                <p>📱 O QR Code é exibido no console/terminal</p>
                <p>✅ Escaneie com seu WhatsApp para conectar</p>
                <p>🔄 Após escanear, o bot estará online!</p>
            </div>
        </body>
        </html>
    `);
});

app.listen(PORT, '0.0.0.0', () => {
    logger.info(`Servidor HTTP iniciado na porta ${PORT}`);
    logger.info(`Acesse: http://localhost:${PORT}`);
});

process.on('uncaughtException', (err) => {
    logger.error(`Exceção não capturada: ${err.message}`);
    console.error(err);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error(`Promise rejeitada: ${reason}`);
});

startBot().catch((err) => {
    logger.error(`Erro ao iniciar bot: ${err.message}`);
    console.error(err);
});
