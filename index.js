const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore } = require('@whiskeysockets/baileys');
const pino = require('pino');
const express = require('express');
const fs = require('fs');
const path = require('path');
const qrcodeTerminal = require('qrcode-terminal');
const QRCode = require('qrcode');

const logger = require('./utils/logger');
const helpers = require('./utils/helpers');
const settings = require('./config/settings');
const db = require('./storage/database');
const { handleMessage } = require('./handlers/message');
const { handleGroupParticipants } = require('./handlers/group');
const wallet = require('./storage/userWallet');

let currentQR = null;
let botConnected = false;

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
        
        if (qr) {
            currentQR = qr;
            botConnected = false;
            console.log('\n');
            console.log('╔══════════════════════════════════════════════════════════╗');
            console.log('║         📱 ESCANEIE O QR CODE NA PÁGINA WEB 📱          ║');
            console.log('║                                                          ║');
            console.log('║   👉 Clique na aba "Webview" ao lado para ver o QR 👈   ║');
            console.log('║                                                          ║');
            console.log('╚══════════════════════════════════════════════════════════╝');
            console.log('\n');
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
            
            currentQR = null;
            botConnected = true;
            qrDisplayed = false;
            
            const botNumber = sock.user.id.split(':')[0];
            logger.info(`Bot: ${sock.user.name || 'BRATVA BOT'}`);
            logger.info(`Número: ${botNumber}`);
            logger.info(`Dono: ${settings.ownerNumber}`);
            logger.info(`Prefixo: ${settings.prefix}`);
            logger.divider();
            
            startBackupSchedule();
            
            wallet.initDatabase().then(() => {
                logger.info('Banco de dados SMS inicializado');
            }).catch(err => {
                logger.error('Erro ao inicializar banco SMS: ' + err.message);
            });
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
    res.redirect('/qr');
});

app.get('/status', (req, res) => {
    const stats = db.getStats();
    const uptime = helpers.formatUptime((Date.now() - stats.startTime) / 1000);
    
    res.json({
        status: botConnected ? 'online' : 'aguardando_conexao',
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

app.get('/qr', async (req, res) => {
    if (botConnected) {
        return res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>BRATVA BOT - Conectado!</title>
                <meta http-equiv="refresh" content="5">
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
                    h1 { color: #00ff88; font-size: 3em; }
                    .success {
                        background: rgba(0,255,136,0.2);
                        border: 2px solid #00ff88;
                        padding: 40px;
                        border-radius: 20px;
                        text-align: center;
                    }
                    .emoji { font-size: 80px; }
                </style>
            </head>
            <body>
                <div class="success">
                    <div class="emoji">✅</div>
                    <h1>BOT CONECTADO!</h1>
                    <p style="font-size: 1.3em;">Seu WhatsApp está conectado ao BRATVA BOT</p>
                    <p>Mande <strong>!menu</strong> em qualquer conversa para testar</p>
                </div>
            </body>
            </html>
        `);
    }
    
    if (!currentQR) {
        return res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>BRATVA BOT - Aguardando</title>
                <meta http-equiv="refresh" content="3">
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
                    h1 { color: #ffaa00; }
                    .loading {
                        background: rgba(255,170,0,0.2);
                        border: 2px solid #ffaa00;
                        padding: 40px;
                        border-radius: 20px;
                        text-align: center;
                    }
                    .spinner {
                        font-size: 60px;
                        animation: spin 2s linear infinite;
                    }
                    @keyframes spin { 100% { transform: rotate(360deg); } }
                </style>
            </head>
            <body>
                <div class="loading">
                    <div class="spinner">⏳</div>
                    <h1>Gerando QR Code...</h1>
                    <p>Aguarde, a página atualiza automaticamente</p>
                </div>
            </body>
            </html>
        `);
    }
    
    try {
        const qrImage = await QRCode.toDataURL(currentQR, { width: 300, margin: 2 });
        
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>BRATVA BOT - QR Code</title>
                <meta http-equiv="refresh" content="30">
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
                        padding: 20px;
                    }
                    h1 { color: #00ff88; margin-bottom: 10px; }
                    .qr-container {
                        background: white;
                        padding: 20px;
                        border-radius: 20px;
                        margin: 20px;
                    }
                    .qr-container img { display: block; }
                    .instructions {
                        background: rgba(255,255,255,0.1);
                        padding: 20px 30px;
                        border-radius: 15px;
                        text-align: left;
                        max-width: 400px;
                    }
                    .step { margin: 10px 0; font-size: 1.1em; }
                    .highlight { color: #00ff88; font-weight: bold; }
                </style>
            </head>
            <body>
                <h1>🤖 BRATVA BOT</h1>
                <p style="color: #aaa;">Escaneie o QR Code abaixo com seu WhatsApp</p>
                
                <div class="qr-container">
                    <img src="${qrImage}" alt="QR Code" />
                </div>
                
                <div class="instructions">
                    <div class="step">1️⃣ Abra o <span class="highlight">WhatsApp</span> no celular</div>
                    <div class="step">2️⃣ Vá em <span class="highlight">Configurações</span> (⚙️)</div>
                    <div class="step">3️⃣ Toque em <span class="highlight">Dispositivos Conectados</span></div>
                    <div class="step">4️⃣ Toque em <span class="highlight">Conectar Dispositivo</span></div>
                    <div class="step">5️⃣ <span class="highlight">Aponte a câmera</span> para este QR Code</div>
                </div>
                
                <p style="color: #888; margin-top: 20px;">⏳ O QR expira em 60s - a página atualiza automaticamente</p>
            </body>
            </html>
        `);
    } catch (error) {
        res.status(500).send('Erro ao gerar QR Code');
    }
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
