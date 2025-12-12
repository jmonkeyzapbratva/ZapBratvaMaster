# 🇨🇦 ALIANCA BRATVA - WhatsApp Bot Profissional

## Visão Geral
Bot de WhatsApp da Alianca BRATVA com sistema de menus interativos, comandos de brincadeiras, administração de grupos, comandos exclusivos do dono e sistema completo de venda de números virtuais SMS.

## Estrutura do Projeto

```
/
├── index.js              # Arquivo principal do bot
├── package.json          # Dependências e scripts
├── config/
│   ├── settings.js       # Configurações (dono, prefixo, etc)
│   └── messages.js       # Mensagens padrão
├── commands/
│   ├── menu.js           # Comandos de menu
│   ├── fun.js            # Brincadeiras e jogos
│   ├── admin.js          # Administração de grupos
│   ├── owner.js          # Comandos do dono (NUKE, etc)
│   └── utils.js          # Utilidades
├── handlers/
│   ├── message.js        # Processador de mensagens
│   └── group.js          # Eventos de grupo
├── utils/
│   ├── logger.js         # Sistema de logs
│   └── helpers.js        # Funções auxiliares
├── storage/
│   ├── database.js       # Banco de dados JSON
│   └── data/             # Arquivos de dados
├── GUIA-COMPLETO.md      # Documentação técnica detalhada
└── Arquivos de Deploy    # fly.toml, railway.json, etc
```

## Configuração

### Configurar Número do Dono
1. Edite `config/settings.js`
2. Altere `ownerNumber` para seu número (formato: 5511999999999)
3. Altere `ownerName` para seu nome

### Prefixo dos Comandos
- Padrão: `!`
- Altere em `config/settings.js` → `prefix`

## Execução

```bash
# Instalar dependências
npm install

# Iniciar o bot
node index.js
```

## Comandos Principais

### Menus
- `!menu` - Menu principal
- `!menubrincadeiras` - Jogos e diversão
- `!menuadmin` - Administração
- `!menudono` - Comandos do dono

### Dono
- `!nuke` - Remove todos os membros
- `!bc [msg]` - Broadcast
- `!addadmin @user` - Adiciona admin do bot

### Admin
- `!ban @user` - Bane usuário
- `!kick @user` - Remove usuário
- `!mute` - Silencia grupo

## Tecnologias

- Node.js 20+
- @whiskeysockets/baileys (WhatsApp API)
- Express (Keep-alive)
- Chalk (Logs coloridos)

## Deploy 24/7

O bot está configurado para deploy em:
- Replit (nativo)
- Fly.io
- Railway
- Render

## Sistema SMS Virtual

### Provedor
- **5sim.net** - Preços em rublos (RUB)
- Taxa de conversão: RUB × 0.065 × 2.0 = preço final em BRL
- Margem de lucro: 100%

### Comandos SMS
- `!sms` - Menu principal do sistema SMS
- `!paises` - Lista países disponíveis
- `!servicos` - Lista serviços (WhatsApp, Telegram, etc)
- `!precos [país]` - Ver preços do país
- `!comprar [serviço] [país]` - Comprar número virtual
- `!meusnumeros` - Ver números ativos
- `!saldo` - Ver saldo da carteira
- `!historico` - Histórico de compras
- `!cancelar [ID]` - Cancelar e reembolsar

### Comandos Dono (SMS)
- `!addsaldo [número] [valor]` - Adicionar saldo ao usuário
- `!saldoapi` - Ver saldo da conta 5sim

## Mudanças Recentes

- **Dezembro 2024**: Sistema SMS Virtual com 5sim.net
  - Integração com API 5sim.net
  - Sistema de carteira virtual por usuário
  - Conversão RUB → BRL com margem 100%
  - Correção do bug @lid nas menções
  - Polling automático para receber códigos SMS

- **Dezembro 2024**: Criação inicial do bot
  - Sistema completo de menus
  - Comandos de brincadeiras
  - Sistema de administração
  - Comando NUKE (exclusivo dono)
  - Documentação técnica completa
