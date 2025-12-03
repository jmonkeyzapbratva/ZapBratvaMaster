# 🤖 BRATVA BOT - GUIA TÉCNICO COMPLETO

> **O GUIA MAIS DETALHADO PARA CRIAR SEU BOT DE WHATSAPP DO ZERO**
> 
> Este documento explica TUDO sobre o bot, linha por linha, para que qualquer pessoa consiga replicar e entender completamente.

---

## 📋 ÍNDICE

1. [Introdução](#-introdução)
2. [Requisitos](#-requisitos)
3. [Estrutura do Projeto](#-estrutura-do-projeto)
4. [Explicação de Cada Arquivo](#-explicação-de-cada-arquivo)
5. [Como Funciona o Bot](#-como-funciona-o-bot)
6. [Instalação Local (Termux/PC)](#-instalação-local)
7. [Deploy no Replit](#-deploy-no-replit)
8. [Deploy no Fly.io](#-deploy-no-flyio)
9. [Deploy no Railway](#-deploy-no-railway)
10. [Deploy no Render](#-deploy-no-render)
11. [Conectando ao WhatsApp](#-conectando-ao-whatsapp)
12. [Lista Completa de Comandos](#-lista-completa-de-comandos)
13. [Como Adicionar Novos Comandos](#-como-adicionar-novos-comandos)
14. [Personalização](#-personalização)
15. [Troubleshooting](#-troubleshooting)
16. [FAQ](#-faq)
17. [Glossário](#-glossário)

---

## 📖 INTRODUÇÃO

O **BRATVA BOT** é um bot de WhatsApp completo e profissional desenvolvido em Node.js usando a biblioteca Baileys. Ele possui:

- ✅ Sistema de menus interativos
- ✅ Comandos de brincadeiras e jogos
- ✅ Administração completa de grupos
- ✅ Comandos exclusivos para o dono
- ✅ Sistema de permissões em 4 níveis
- ✅ Proteções automáticas (anti-link, anti-flood, anti-palavrões)
- ✅ Mensagens automáticas de boas-vindas e despedida
- ✅ Backup automático de dados
- ✅ Preparado para deploy 24/7 em múltiplas plataformas

### O que é Baileys?

Baileys é uma biblioteca JavaScript que permite conectar ao WhatsApp Web sem precisar de um navegador. Ela "imita" o comportamento do WhatsApp Web, permitindo enviar e receber mensagens programaticamente.

---

## 💻 REQUISITOS

### Para Rodar Localmente:

| Requisito | Versão Mínima | Como Instalar |
|-----------|---------------|---------------|
| Node.js | 18.0.0 | [nodejs.org](https://nodejs.org) |
| NPM | 8.0.0 | Vem com Node.js |
| Git | Qualquer | [git-scm.com](https://git-scm.com) |

### Para Termux (Android):

```bash
# Atualize o Termux
pkg update && pkg upgrade

# Instale Node.js e Git
pkg install nodejs git

# Verifique as versões
node --version
npm --version
git --version
```

### Para Windows:

1. Baixe Node.js em [nodejs.org](https://nodejs.org)
2. Escolha a versão LTS (recomendada)
3. Execute o instalador
4. Marque a opção "Add to PATH"
5. Abra o CMD e verifique: `node --version`

### Para Linux/Mac:

```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Mac (com Homebrew)
brew install node
```

---

## 📁 ESTRUTURA DO PROJETO

```
bratva-bot-whatsapp/
│
├── 📄 index.js              # Arquivo principal que inicia o bot
├── 📄 package.json          # Configurações e dependências do projeto
├── 📄 .gitignore           # Arquivos ignorados pelo Git
├── 📄 GUIA-COMPLETO.md     # Este guia que você está lendo
│
├── 📁 config/              # Configurações do bot
│   ├── settings.js         # Configurações gerais (dono, prefixo, etc)
│   └── messages.js         # Mensagens padrão do bot
│
├── 📁 commands/            # Todos os comandos do bot
│   ├── menu.js             # Comandos de menu
│   ├── fun.js              # Comandos de brincadeiras
│   ├── admin.js            # Comandos de administração
│   ├── owner.js            # Comandos do dono
│   └── utils.js            # Comandos utilitários
│
├── 📁 handlers/            # Processadores de eventos
│   ├── message.js          # Processa todas as mensagens
│   └── group.js            # Processa eventos de grupo
│
├── 📁 utils/               # Funções auxiliares
│   ├── logger.js           # Sistema de logs coloridos
│   └── helpers.js          # Funções utilitárias
│
├── 📁 storage/             # Armazenamento de dados
│   ├── database.js         # Sistema de banco de dados JSON
│   └── data/               # Pasta com os arquivos de dados
│       ├── groups.json     # Configurações dos grupos
│       ├── bot-admins.json # Admins do bot
│       ├── banned.json     # Usuários banidos
│       └── stats.json      # Estatísticas
│
├── 📁 auth_info/           # Credenciais do WhatsApp (NÃO COMPARTILHE!)
│
└── 📁 Arquivos de Deploy   # Configurações para cada plataforma
    ├── fly.toml            # Fly.io
    ├── railway.json        # Railway
    ├── render.yaml         # Render
    ├── Dockerfile          # Docker
    └── Procfile            # Heroku
```

---

## 📝 EXPLICAÇÃO DE CADA ARQUIVO

### 1. index.js (Arquivo Principal)

Este é o coração do bot. Ele faz o seguinte:

```javascript
// IMPORTAÇÕES - Trazem código de outros arquivos
const { default: makeWASocket, ... } = require('@whiskeysockets/baileys');
// makeWASocket: Função que cria a conexão com WhatsApp
// useMultiFileAuthState: Gerencia as credenciais de login
// DisconnectReason: Códigos de desconexão

const express = require('express');
// Express: Cria um servidor web (necessário para keep-alive)

// VARIÁVEIS GLOBAIS
let sock = null;           // Armazena a conexão do WhatsApp
const PORT = 5000;         // Porta do servidor HTTP

// FUNÇÃO PRINCIPAL
const startBot = async () => {
    // 1. Carrega as credenciais salvas
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    
    // 2. Cria a conexão com WhatsApp
    sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,  // Mostra QR Code no terminal
        // ... outras configurações
    });
    
    // 3. Escuta eventos de conexão
    sock.ev.on('connection.update', async (update) => {
        if (connection === 'open') {
            // Bot conectado!
        } else if (connection === 'close') {
            // Reconecta automaticamente
        }
    });
    
    // 4. Escuta novas mensagens
    sock.ev.on('messages.upsert', async ({ messages }) => {
        // Processa cada mensagem
        handleMessage(sock, msg);
    });
};
```

**O que cada parte faz:**

| Parte | Função |
|-------|--------|
| `makeWASocket()` | Cria conexão com WhatsApp Web |
| `useMultiFileAuthState()` | Salva/carrega credenciais de login |
| `connection.update` | Monitora status da conexão |
| `messages.upsert` | Recebe novas mensagens |
| `group-participants.update` | Detecta entrada/saída de membros |

---

### 2. config/settings.js (Configurações)

```javascript
const settings = {
    // DADOS DO BOT
    botName: '🤖 BRATVA BOT',     // Nome exibido nos menus
    ownerNumber: '5511999999999', // SEU número (código país + DDD + número)
    ownerName: 'Dono',            // Seu nome/apelido
    prefix: '!',                   // Caractere antes dos comandos (!menu)
    
    // AUTOMAÇÕES
    autoRead: true,      // Marcar mensagens como lidas
    autoTyping: true,    // Mostrar "digitando..." ao responder
    
    // MENSAGENS AUTOMÁTICAS
    welcomeEnabled: true,   // Enviar boas-vindas
    goodbyeEnabled: true,   // Enviar despedida
    
    // PROTEÇÕES (valores padrão para novos grupos)
    antiLink: false,       // Bloquear links
    antiFlood: false,      // Bloquear spam
    antiBadWords: false,   // Bloquear palavrões
    
    // CONFIGURAÇÕES DE ANTI-FLOOD
    floodMessages: 5,      // Quantas mensagens para detectar flood
    floodTime: 5000,       // Em qual intervalo (5000ms = 5 segundos)
    
    // BACKUP
    backupInterval: 6 * 60 * 60 * 1000,  // 6 horas em milissegundos
    
    // PALAVRAS BLOQUEADAS
    badWords: ['palavrão1', 'palavrão2'],  // Adicione palavras aqui
    
    // LINKS PERMITIDOS (não são bloqueados pelo anti-link)
    allowedLinks: ['youtube.com', 'youtu.be']
};
```

**Como Editar:**

1. Abra o arquivo `config/settings.js`
2. Altere os valores entre aspas
3. **IMPORTANTE**: O `ownerNumber` deve ser SEU número com código do país (55 para Brasil)
4. Salve o arquivo
5. Reinicie o bot

---

### 3. handlers/message.js (Processador de Mensagens)

Este arquivo é o "cérebro" que decide o que fazer com cada mensagem:

```javascript
const handleMessage = async (sock, msg) => {
    // 1. IGNORA mensagens sem conteúdo ou enviadas pelo próprio bot
    if (!msg.message) return;
    if (msg.key.fromMe) return;
    
    // 2. EXTRAI informações importantes
    const isGroup = msg.key.remoteJid.endsWith('@g.us');
    const sender = isGroup ? msg.key.participant : msg.key.remoteJid;
    const senderNumber = sender.replace('@s.whatsapp.net', '');
    
    // 3. VERIFICA se usuário está banido
    if (db.isBanned(senderNumber)) return;  // Ignora banidos
    
    // 4. APLICA proteções (se estiver em grupo)
    if (isGroup) {
        // Anti-link: detecta URLs e remove
        if (groupSettings.antiLink && helpers.isUrl(text)) {
            await sock.sendMessage(groupId, { delete: msg.key });
            return;
        }
        // Anti-flood: detecta spam
        // Anti-palavrões: detecta palavras proibidas
    }
    
    // 5. VERIFICA se é um comando (começa com prefixo)
    if (!text.startsWith(settings.prefix)) return;
    
    // 6. SEPARA o comando dos argumentos
    const args = text.slice(1).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    // Exemplo: "!ban @user motivo" 
    // command = "ban"
    // args = ["@user", "motivo"]
    
    // 7. VERIFICA permissões
    const isOwner = senderNumber === settings.ownerNumber;
    const isBotAdmin = db.isBotAdmin(senderNumber) || isOwner;
    const isGroupAdmin = /* verifica se é admin do grupo */;
    
    // 8. EXECUTA o comando
    if (allCommands[command]) {
        await allCommands[command](context);
    }
};
```

**Fluxo Visual:**

```
Mensagem Recebida
       ↓
É mensagem válida? → NÃO → Ignora
       ↓ SIM
Usuário banido? → SIM → Ignora
       ↓ NÃO
É grupo? → SIM → Aplica proteções
       ↓
Começa com prefixo? → NÃO → Ignora
       ↓ SIM
Verifica permissões
       ↓
Executa comando
       ↓
Envia resposta
```

---

### 4. commands/fun.js (Comandos de Brincadeiras)

Exemplo de como um comando funciona:

```javascript
// COMANDO: !dado - Rola um dado de 6 faces
dado: async (ctx) => {
    // ctx contém tudo que precisamos:
    // - sock: conexão do WhatsApp
    // - msg: mensagem original
    // - args: argumentos do comando
    
    const { sock, msg } = ctx;
    
    // Gera número aleatório de 1 a 6
    const resultado = helpers.randomInt(1, 6);
    
    // Emojis dos dados
    const dados = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
    
    // Envia resposta
    await sock.sendMessage(msg.key.remoteJid, {
        text: `🎲 *DADO ROLADO*\n\n${dados[resultado - 1]} Resultado: *${resultado}*`
    });
},

// COMANDO: !ship @pessoa1 @pessoa2 - Calcula compatibilidade
ship: async (ctx) => {
    const { sock, msg, isGroup, groupMetadata } = ctx;
    
    // Só funciona em grupos
    if (!isGroup) {
        return await sock.sendMessage(msg.key.remoteJid, {
            text: '❌ Este comando só funciona em grupos!'
        });
    }
    
    // Pega as pessoas mencionadas
    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    
    if (mentioned.length < 2) {
        return await sock.sendMessage(msg.key.remoteJid, {
            text: '❌ Marque duas pessoas!'
        });
    }
    
    // Gera porcentagem aleatória
    const porcentagem = helpers.randomInt(0, 100);
    
    // Define status baseado na porcentagem
    let status;
    if (porcentagem >= 80) status = '💕 AMOR VERDADEIRO!';
    else if (porcentagem >= 60) status = '💖 Bom casal!';
    else status = '💔 Não combina...';
    
    // Envia resposta com menções
    await sock.sendMessage(msg.key.remoteJid, {
        text: `💕 *SHIP*\n\n@${n1} ❤️ @${n2}\n\nCompatibilidade: *${porcentagem}%*\n${status}`,
        mentions: mentioned
    });
}
```

---

### 5. commands/owner.js (Comandos do Dono)

O comando NUKE (sem confirmação, como solicitado):

```javascript
nuke: async (ctx) => {
    const { sock, msg, isOwner, isGroup, groupId, isBotGroupAdmin, groupMetadata } = ctx;
    
    // VERIFICAÇÃO 1: Só o dono pode usar
    if (!isOwner) {
        return await sock.sendMessage(msg.key.remoteJid, { 
            text: '❌ Apenas o *DONO DO BOT* pode usar este comando!' 
        });
    }
    
    // VERIFICAÇÃO 2: Só funciona em grupos
    if (!isGroup) {
        return await sock.sendMessage(msg.key.remoteJid, { 
            text: '❌ Este comando só funciona em *GRUPOS*!' 
        });
    }
    
    // VERIFICAÇÃO 3: Bot precisa ser admin
    if (!isBotGroupAdmin) {
        return await sock.sendMessage(msg.key.remoteJid, { 
            text: '❌ O bot precisa ser *ADMIN* do grupo!' 
        });
    }
    
    // AVISA que vai começar
    await sock.sendMessage(msg.key.remoteJid, { 
        text: '💥 *NUKE INICIADO*! Removendo todos os membros...' 
    });
    
    // PEGA todos os participantes
    const participants = groupMetadata.participants;
    
    // IDs que NÃO serão removidos
    const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    const ownerJid = settings.ownerNumber + '@s.whatsapp.net';
    
    // FILTRA quem será removido (todos menos bot, dono e superadmins)
    const toRemove = participants.filter(p => 
        p.id !== botId && 
        p.id !== ownerJid && 
        p.admin !== 'superadmin'
    );
    
    // REMOVE um por um
    let removed = 0;
    for (const participant of toRemove) {
        try {
            await sock.groupParticipantsUpdate(groupId, [participant.id], 'remove');
            removed++;
            await helpers.sleep(500);  // Espera 500ms entre cada remoção
        } catch (error) {
            continue;  // Se falhar, continua para o próximo
        }
    }
    
    // ENVIA resultado
    await sock.sendMessage(msg.key.remoteJid, {
        text: `💥 *NUKE COMPLETO*! ${removed} membros removidos.`
    });
}
```

---

### 6. storage/database.js (Banco de Dados)

O bot usa arquivos JSON para armazenar dados:

```javascript
// ARQUIVOS DE DADOS
const dbFiles = {
    groups: 'storage/data/groups.json',      // Configs dos grupos
    botAdmins: 'storage/data/bot-admins.json', // Admins do bot
    banned: 'storage/data/banned.json',       // Usuários banidos
    stats: 'storage/data/stats.json'          // Estatísticas
};

// FUNÇÕES PRINCIPAIS

// Carrega dados de um arquivo
const loadData = (type) => {
    const file = dbFiles[type];
    if (fs.existsSync(file)) {
        return JSON.parse(fs.readFileSync(file));
    }
    return defaultData[type];
};

// Salva dados em um arquivo
const saveData = (type, data) => {
    const file = dbFiles[type];
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
};

// EXEMPLOS DE USO

// Verificar se alguém é admin do bot
db.isBotAdmin('5511999999999');  // retorna true ou false

// Adicionar admin do bot
db.addBotAdmin('5511888888888');

// Pegar configurações de um grupo
db.getGroup('123456789@g.us');

// Alterar configuração de um grupo
db.setGroup('123456789@g.us', 'antiLink', true);

// Fazer backup
db.backup();  // Cria pasta com timestamp em storage/backups/
```

---

## 🔄 COMO FUNCIONA O BOT

### Fluxo Completo de uma Mensagem

```
1. USUÁRIO envia "!ban @fulano" no grupo

2. WHATSAPP WEB recebe a mensagem

3. BAILEYS intercepta e passa para o bot

4. MESSAGE HANDLER processa:
   ├── Extrai: comando = "ban", args = ["@fulano"]
   ├── Verifica: É grupo? ✓
   ├── Verifica: Usuário é admin do grupo? ✓
   └── Verifica: Bot é admin do grupo? ✓

5. COMANDO BAN é executado:
   ├── Pega o JID do @fulano
   ├── Chama sock.groupParticipantsUpdate()
   └── Envia mensagem de confirmação

6. RESPOSTA aparece no grupo
```

### Sistema de Permissões

```
NÍVEL 4: DONO DO BOT (ownerNumber em settings.js)
   └── Pode usar TODOS os comandos
   └── Acesso ao menu do dono
   └── Comandos: nuke, broadcast, gban, etc

NÍVEL 3: ADMIN DO BOT (adicionados com !addadmin)
   └── Pode usar comandos de admin em qualquer grupo
   └── Não pode usar comandos exclusivos do dono

NÍVEL 2: ADMIN DO GRUPO (admins do WhatsApp)
   └── Pode usar comandos de admin no seu grupo
   └── Comandos: ban, kick, mute, antilink, etc

NÍVEL 1: MEMBRO COMUM
   └── Pode usar comandos básicos e brincadeiras
   └── Comandos: menu, dado, piada, sticker, etc
```

---

## 📱 INSTALAÇÃO LOCAL

### No Termux (Android)

```bash
# 1. ABRA O TERMUX

# 2. ATUALIZE OS PACOTES
pkg update && pkg upgrade -y

# 3. INSTALE DEPENDÊNCIAS
pkg install nodejs git -y

# 4. CLONE O REPOSITÓRIO
git clone https://github.com/seu-usuario/bratva-bot-whatsapp.git

# 5. ENTRE NA PASTA
cd bratva-bot-whatsapp

# 6. INSTALE AS DEPENDÊNCIAS DO NODE
npm install

# 7. CONFIGURE O DONO
# Abra config/settings.js e altere:
# - ownerNumber: seu número
# - ownerName: seu nome
nano config/settings.js

# 8. INICIE O BOT
node index.js

# 9. ESCANEIE O QR CODE
# Abra WhatsApp > Dispositivos Conectados > Conectar Dispositivo
# Aponte a câmera para o QR Code no terminal
```

### No Windows

```powershell
# 1. ABRA O PROMPT DE COMANDO (CMD) ou PowerShell

# 2. CLONE O REPOSITÓRIO
git clone https://github.com/seu-usuario/bratva-bot-whatsapp.git

# 3. ENTRE NA PASTA
cd bratva-bot-whatsapp

# 4. INSTALE AS DEPENDÊNCIAS
npm install

# 5. CONFIGURE (edite config/settings.js com Notepad ou VS Code)

# 6. INICIE
node index.js

# 7. ESCANEIE O QR CODE
```

### No Linux/Mac

```bash
# Clone, instale e execute
git clone https://github.com/seu-usuario/bratva-bot-whatsapp.git
cd bratva-bot-whatsapp
npm install
node index.js
```

---

## ☁️ DEPLOY NO REPLIT

### Passo a Passo Detalhado

```
1. CRIE UMA CONTA
   └── Acesse replit.com
   └── Clique em "Sign Up"
   └── Use Google, GitHub ou email

2. CRIE UM NOVO REPL
   └── Clique no botão "+ Create Repl"
   └── Escolha "Import from GitHub"
   └── Cole a URL do seu repositório
   └── Clique em "Import from GitHub"

3. CONFIGURE O DONO
   └── Abra config/settings.js
   └── Altere ownerNumber para seu número
   └── Salve (Ctrl+S)

4. INSTALE DEPENDÊNCIAS (se necessário)
   └── Abra o Shell
   └── Digite: npm install
   └── Aguarde finalizar

5. INICIE O BOT
   └── Clique no botão "Run" verde no topo
   └── O QR Code aparecerá no console
   └── Escaneie com seu WhatsApp

6. MANTENHA ONLINE 24/7
   └── Com plano pago: Use "Always On"
   └── Gratuito: Use um serviço de ping externo
```

### Serviços de Ping Gratuitos (para manter acordado)

- [UptimeRobot](https://uptimerobot.com) - Gratuito, pinga a cada 5 minutos
- [Cron-Job.org](https://cron-job.org) - Gratuito, pinga a cada minuto
- [Freshping](https://freshping.io) - Gratuito, monitoramento

**Como Configurar:**
1. Pegue a URL do seu Repl (aparece na aba Webview)
2. Cadastre-se no serviço de ping
3. Adicione a URL para monitorar
4. Configure intervalo de 5 minutos

---

## ✈️ DEPLOY NO FLY.IO

### Pré-requisitos

- Conta no Fly.io (gratuita)
- Fly CLI instalado

### Passo a Passo

```bash
# 1. INSTALE O FLY CLI

# Windows (PowerShell como Admin)
powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"

# Mac
brew install flyctl

# Linux
curl -L https://fly.io/install.sh | sh

# 2. FAÇA LOGIN
fly auth login

# 3. CRIE O APP (na pasta do projeto)
fly launch

# Responda as perguntas:
# - App name: bratva-bot (ou outro nome)
# - Region: gru (São Paulo)
# - Would you like to set up Postgres? No
# - Would you like to deploy now? Yes

# 4. SE PRECISAR FAZER DEPLOY NOVAMENTE
fly deploy

# 5. VER LOGS
fly logs

# 6. VER STATUS
fly status
```

### Arquivo fly.toml (já incluído)

```toml
app = "bratva-bot-whatsapp"
primary_region = "gru"  # São Paulo

[http_service]
  internal_port = 5000
  auto_stop_machines = false   # IMPORTANTE: não parar
  min_machines_running = 1     # Sempre 1 rodando

[[vm]]
  memory_mb = 512  # 512MB de RAM
```

---

## 🚂 DEPLOY NO RAILWAY

### Passo a Passo

```
1. ACESSE railway.app

2. FAÇA LOGIN
   └── Use GitHub para login

3. CRIE NOVO PROJETO
   └── Clique em "New Project"
   └── Escolha "Deploy from GitHub repo"
   └── Autorize o Railway no GitHub
   └── Selecione seu repositório

4. CONFIGURE
   └── Railway detecta automaticamente Node.js
   └── Clique em "Add Variables" se precisar
   └── Não são necessárias variáveis especiais

5. DEPLOY AUTOMÁTICO
   └── Railway faz deploy automaticamente
   └── Acompanhe nos logs

6. VEJA OS LOGS
   └── Clique na aba "Deployments"
   └── Clique no deployment ativo
   └── Clique em "View Logs"
   └── O QR Code aparecerá aqui

7. CONECTE
   └── Escaneie o QR Code
   └── Bot online!
```

### Plano Gratuito Railway

- $5 de crédito grátis por mês
- ~500 horas de execução
- Suficiente para bot 24/7

---

## 🎨 DEPLOY NO RENDER

### Passo a Passo

```
1. ACESSE render.com

2. CRIE CONTA
   └── Use GitHub para login rápido

3. NOVO WEB SERVICE
   └── Clique em "New +"
   └── Escolha "Web Service"
   └── Conecte ao GitHub
   └── Selecione seu repositório

4. CONFIGURE
   └── Name: bratva-bot
   └── Region: Oregon (ou mais próximo)
   └── Branch: main
   └── Build Command: npm install
   └── Start Command: node index.js
   └── Instance Type: Free

5. DEPLOY
   └── Clique em "Create Web Service"
   └── Aguarde o build
   └── Acesse os logs para ver o QR Code

6. ESCANEIE
   └── O QR Code aparece nos logs
   └── Escaneie com WhatsApp
```

### Limitação do Plano Gratuito

- O serviço "dorme" após 15 minutos sem requisições
- Use UptimeRobot para manter acordado
- Demora ~30 segundos para acordar

---

## 📱 CONECTANDO AO WHATSAPP

### Primeiro Acesso (QR Code)

1. **Inicie o bot** (`node index.js`)
2. **Aguarde** o QR Code aparecer no terminal
3. **Abra o WhatsApp** no celular
4. **Vá em** Configurações > Dispositivos Conectados
5. **Toque em** "Conectar um dispositivo"
6. **Aponte a câmera** para o QR Code
7. **Pronto!** Bot conectado

### Reconexão Automática

O bot reconecta automaticamente quando:
- A conexão cai
- O servidor reinicia
- Há instabilidade de rede

As credenciais são salvas em `auth_info/` - **NÃO DELETE ESTA PASTA** se não quiser escanear novamente.

### Desconectar Permanentemente

1. No WhatsApp: Configurações > Dispositivos > Selecione o bot > Desconectar
2. Ou delete a pasta `auth_info/`

---

## 📋 LISTA COMPLETA DE COMANDOS

### 📱 MENU PRINCIPAL
| Comando | Descrição |
|---------|-----------|
| `!menu` | Menu principal com todas as categorias |
| `!menubrincadeiras` | Menu de jogos e diversão |
| `!menuadmin` | Menu de administração |
| `!menudono` | Menu exclusivo do dono |
| `!menuutils` | Menu de utilidades |
| `!info` | Informações do bot |
| `!ping` | Testa velocidade do bot |
| `!criador` | Informações do criador |

### 🎮 BRINCADEIRAS
| Comando | Descrição |
|---------|-----------|
| `!dado` | Rola um dado de 6 faces |
| `!moeda` | Cara ou coroa |
| `!ppt [escolha]` | Pedra, papel ou tesoura |
| `!slot` | Caça-níqueis |
| `!quiz` | Pergunta aleatória |
| `!advinha [número]` | Adivinhe o número de 1 a 10 |
| `!forca` | Jogo da forca |
| `!piada` | Conta uma piada |
| `!frase` | Frase motivacional |
| `!cantada` | Cantada aleatória |
| `!zoeira` | Zoeira aleatória |
| `!verdade` | Verdade para jogar |
| `!desafio` | Desafio aleatório |
| `!ship @p1 @p2` | Calcula compatibilidade |
| `!casal` | Sorteia um casal do grupo |
| `!gay @user` | Teste gay (brincadeira) |
| `!gado @user` | Teste de gado |
| `!sorteia` | Sorteia um membro |

### 👮 ADMINISTRAÇÃO (Admins do Grupo)
| Comando | Descrição |
|---------|-----------|
| `!ban @user` | Bane usuário do grupo |
| `!kick @user` | Remove usuário do grupo |
| `!add 55xxx` | Adiciona número ao grupo |
| `!promote @user` | Promove a admin |
| `!demote @user` | Rebaixa de admin |
| `!mute` | Silencia o grupo |
| `!unmute` | Abre o grupo |
| `!link` | Mostra link do grupo |
| `!revoke` | Reseta link do grupo |
| `!rename [nome]` | Renomeia o grupo |
| `!desc [texto]` | Altera descrição |
| `!antilink` | Liga/desliga anti-link |
| `!antiflood` | Liga/desliga anti-flood |
| `!antibadwords` | Liga/desliga filtro |
| `!welcome on/off` | Liga/desliga boas-vindas |
| `!goodbye on/off` | Liga/desliga despedida |
| `!setwelcome [msg]` | Define mensagem de boas-vindas |
| `!setgoodbye [msg]` | Define mensagem de saída |
| `!admins` | Lista admins do grupo |
| `!membros` | Conta membros |
| `!grupo` | Info do grupo |

### 👑 COMANDOS DO DONO
| Comando | Descrição |
|---------|-----------|
| `!addadmin @user` | Adiciona admin do bot |
| `!rmadmin @user` | Remove admin do bot |
| `!listadmins` | Lista admins do bot |
| `!bc [msg]` | Broadcast para todos os grupos |
| `!nuke` | Remove TODOS os membros |
| `!leave` | Sai do grupo |
| `!stats` | Estatísticas do bot |
| `!grupos` | Lista todos os grupos |
| `!uptime` | Tempo online |
| `!backup` | Backup manual |
| `!gban @user` | Ban global |
| `!gunban @user` | Desban global |
| `!listban` | Lista banidos |
| `!setprefix [x]` | Muda prefixo |
| `!setowner [num]` | Muda dono |
| `!setname [nome]` | Muda nome do bot |
| `!restart` | Reinicia o bot |

### 🛠️ UTILIDADES
| Comando | Descrição |
|---------|-----------|
| `!sticker` | Cria sticker de imagem/vídeo |
| `!toimg` | Converte sticker para imagem |
| `!play [nome]` | Baixa música* |
| `!video [nome]` | Baixa vídeo* |
| `!google [texto]` | Link de pesquisa Google |
| `!img [texto]` | Link de busca de imagens |
| `!traduzir [texto]` | Traduz texto |
| `!clima [cidade]` | Previsão do tempo* |
| `!perfil` | Seu perfil |
| `!foto @user` | Foto de perfil |

*Requer configuração de APIs externas

---

## ➕ COMO ADICIONAR NOVOS COMANDOS

### Template de Comando

```javascript
// Em commands/fun.js (ou outro arquivo)

nomeDoComando: async (ctx) => {
    // 1. EXTRAIA o que precisa do contexto
    const { 
        sock,           // Conexão do WhatsApp
        msg,            // Mensagem original
        args,           // Argumentos após o comando
        sender,         // JID do remetente
        senderNumber,   // Número limpo
        groupId,        // ID do grupo (null se privado)
        isGroup,        // É grupo? true/false
        isOwner,        // É o dono? true/false
        isBotAdmin,     // É admin do bot? true/false
        isGroupAdmin,   // É admin do grupo? true/false
        groupMetadata   // Dados do grupo
    } = ctx;
    
    // 2. VALIDE se necessário
    if (!isGroup) {
        return await sock.sendMessage(msg.key.remoteJid, {
            text: '❌ Este comando só funciona em grupos!'
        });
    }
    
    // 3. PROCESSE os argumentos
    if (!args[0]) {
        return await sock.sendMessage(msg.key.remoteJid, {
            text: '❌ Informe algo!\n\nExemplo: !comando argumento'
        });
    }
    
    const argumento = args.join(' ');
    
    // 4. EXECUTE a lógica do comando
    const resultado = await fazerAlgo(argumento);
    
    // 5. ENVIE a resposta
    await sock.sendMessage(msg.key.remoteJid, {
        text: `✅ Resultado: ${resultado}`
    });
},
```

### Exemplo: Comando !abraço

```javascript
// Adicione em commands/fun.js

abraco: async (ctx) => {
    const { sock, msg } = ctx;
    
    // Pega menção
    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    
    if (mentioned.length === 0) {
        return await sock.sendMessage(msg.key.remoteJid, {
            text: '❌ Marque alguém para abraçar!\n\nExemplo: !abraco @pessoa'
        });
    }
    
    const target = mentioned[0];
    const number = target.replace('@s.whatsapp.net', '');
    
    // Mensagens aleatórias
    const abracos = [
        '🤗 que abraço apertado!',
        '🫂 um abraço cheio de carinho!',
        '💕 abraço de urso!',
        '🤗 aconchego total!'
    ];
    
    const mensagem = abracos[Math.floor(Math.random() * abracos.length)];
    
    await sock.sendMessage(msg.key.remoteJid, {
        text: `🤗 *ABRAÇO*\n\n@${ctx.senderNumber} abraçou @${number}\n\n${mensagem}`,
        mentions: [ctx.sender, target]
    });
},
```

### Registrando o Comando

O comando é registrado automaticamente! Basta adicionar no arquivo e ele funcionará com `!abraco`.

---

## 🎨 PERSONALIZAÇÃO

### Alterar Mensagens

Edite `config/messages.js`:

```javascript
const messages = {
    welcome: {
        title: '👋 BEM-VINDO!',  // Altere o título
        text: 'Olá {user}!'       // Altere a mensagem
    },
    // ...
};
```

### Variáveis Disponíveis

| Variável | Substitui por |
|----------|---------------|
| `{user}` | @menção do usuário |
| `{group}` | Nome do grupo |
| `{count}` | Número/contagem |
| `{time}` | Tempo/segundos |

### Alterar Visual dos Menus

Edite `commands/menu.js`:

```javascript
menu: async (ctx) => {
    const menuText = `
    Seu texto aqui...
    Pode usar emojis 🎮
    E formatação *negrito*
    `.trim();
    
    await sock.sendMessage(msg.key.remoteJid, { text: menuText });
},
```

---

## 🔧 TROUBLESHOOTING

### ❌ Problema: "Cannot find module"

**Causa:** Dependências não instaladas

**Solução:**
```bash
npm install
```

### ❌ Problema: QR Code não aparece

**Causas possíveis:**
1. Erro de conexão
2. Credenciais corrompidas

**Solução:**
```bash
# Delete credenciais antigas
rm -rf auth_info

# Reinicie
node index.js
```

### ❌ Problema: Bot não responde

**Verifique:**
1. Bot está rodando? (veja logs)
2. Mensagem tem prefixo correto? (`!`)
3. Usuário está banido? (verifique `storage/data/banned.json`)
4. Erro no console?

### ❌ Problema: "Connection closed"

**Causa:** WhatsApp desconectou

**Solução:** O bot reconecta automaticamente. Se persistir:
```bash
rm -rf auth_info
node index.js
# Escaneie novamente
```

### ❌ Problema: "Rate limit exceeded"

**Causa:** Muitas mensagens enviadas rapidamente

**Solução:**
- O bot já tem delays automáticos
- Aguarde alguns minutos
- Evite spam de comandos

### ❌ Problema: Comandos de admin não funcionam

**Verifique:**
1. O bot é admin do grupo?
2. Você é admin do grupo?
3. O comando existe?

### ❌ Problema: Bot muito lento

**Soluções:**
1. Verifique conexão de internet
2. Reduza quantidade de grupos
3. Aumente recursos do servidor

---

## ❓ FAQ

### P: Posso usar em mais de um número?

**R:** Sim! Basta criar outra instância do bot com pasta `auth_info` diferente.

### P: O bot lê minhas mensagens privadas?

**R:** O bot processa mensagens para detectar comandos, mas não armazena o conteúdo das conversas.

### P: É seguro?

**R:** Sim, desde que você:
- Não compartilhe a pasta `auth_info`
- Não deixe o código público com seu número
- Use senhas fortes no servidor

### P: WhatsApp pode banir meu número?

**R:** Há risco se você:
- Enviar muitas mensagens muito rápido
- Adicionar muitas pessoas sem consentimento
- For denunciado por spam

Use com moderação e siga as regras do WhatsApp.

### P: Como atualizar o bot?

**R:**
```bash
git pull origin main
npm install
# Reinicie o bot
```

### P: Posso vender o bot?

**R:** O código é livre para uso pessoal. Consulte a licença para uso comercial.

### P: Funciona em grupos grandes?

**R:** Sim, mas comandos como `!nuke` podem demorar em grupos com muitos membros.

### P: Posso rodar 24/7 no celular?

**R:** Tecnicamente sim (com Termux), mas não é recomendado:
- Consome bateria
- Celular pode desligar
- WhatsApp pode desconectar

Use servidores para 24/7.

---

## 📚 GLOSSÁRIO

| Termo | Significado |
|-------|-------------|
| **API** | Interface que permite programas se comunicarem |
| **Baileys** | Biblioteca para conectar ao WhatsApp Web |
| **Bot** | Programa automático que responde mensagens |
| **CLI** | Interface de linha de comando (terminal) |
| **Deploy** | Colocar o programa para rodar em um servidor |
| **Handler** | Função que processa eventos |
| **JID** | Identificador único do WhatsApp (número@s.whatsapp.net) |
| **JSON** | Formato de arquivo para armazenar dados |
| **Keep-alive** | Sistema para manter servidor acordado |
| **Node.js** | Ambiente para rodar JavaScript no servidor |
| **NPM** | Gerenciador de pacotes do Node.js |
| **Prefixo** | Caractere antes dos comandos (ex: !) |
| **QR Code** | Código de barras 2D para conectar |
| **Socket** | Conexão em tempo real |
| **Webhook** | URL que recebe notificações |

---

## 🏆 CRÉDITOS

- **Baileys**: [@whiskeysockets/baileys](https://github.com/WhiskeySockets/Baileys)
- **Node.js**: [nodejs.org](https://nodejs.org)
- **Inspiração**: NaufraBot e comunidade de bots de WhatsApp

---

## 📞 SUPORTE

Se tiver problemas:

1. Leia este guia completamente
2. Verifique a seção de Troubleshooting
3. Procure no FAQ
4. Revise os logs de erro

---

*Documentação criada com 💚 para a comunidade*

**Versão do Guia:** 2.0.0
**Última Atualização:** Dezembro 2024
