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
│   ├── utils.js          # Utilidades
│   ├── sms.js            # Sistema SMS Virtual
│   ├── consultas.js      # Consultas (IP, CEP, DDD, DNS)
│   ├── guerra.js         # Comandos de guerra/admin grupo
│   ├── jogos.js          # Jogos (dado, slot, roleta)
│   ├── brincadeiras.js   # Brincadeiras (ship, gay, etc)
│   ├── downloads.js      # Downloads (TikTok, música)
│   ├── stickers.js       # Criação de stickers
│   └── economia.js       # Sistema de economia
├── handlers/
│   ├── message.js        # Processador de mensagens
│   └── group.js          # Eventos de grupo
├── utils/
│   ├── logger.js         # Sistema de logs
│   └── helpers.js        # Funções auxiliares
├── storage/
│   ├── database.js       # Banco de dados JSON
│   ├── userWallet.js     # Carteira SMS (PostgreSQL)
│   └── data/             # Arquivos de dados
├── services/
│   └── fivesim.js        # Integração 5sim.net
└── GUIA-COMPLETO.md      # Documentação técnica
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
npm install
node index.js
```

## Comandos Disponíveis

### 📋 Menus
- `!menu` - Menu principal
- `!menubrincadeiras` - Jogos e diversão
- `!menuadmin` - Administração de grupos
- `!menudono` - Comandos do dono
- `!menudownloads` - Downloads de mídia
- `!menustickers` - Criação de stickers
- `!menujogos` - Jogos e cassino
- `!menueconomia` - Sistema de economia
- `!menuconsultas` - Consultas (IP, CEP, etc)
- `!menuguerra` - Comandos de guerra

### 🔍 Consultas
- `!ip [ip]` - Consulta informações de IP
- `!cep [cep]` - Consulta CEP
- `!ddd [ddd]` - Consulta DDD
- `!dns [dominio]` - Consulta DNS
- `!clima [cidade]` - Consulta clima
- `!whois [dominio]` - Consulta WHOIS
- `!calcular [expr]` - Calculadora
- `!encurtar [link]` - Encurtador de URL

### ⚔️ Guerra/Admin
- `!nuke` - Remove todos os membros (dono)
- `!destrava` - Destrava grupo
- `!banghost` - Remove membros fantasmas
- `!ban @user` - Bane usuário
- `!kick @user` - Remove usuário
- `!add [numero]` - Adiciona membro
- `!promote @user` - Promove a admin
- `!demote @user` - Rebaixa admin
- `!mute` - Muta grupo
- `!unmute` - Desmuta grupo
- `!link` - Link do grupo
- `!tagall` - Marca todos
- `!hidetag` - Marca todos (oculto)

### 🎲 Jogos
- `!dado` - Joga dado
- `!moeda` - Cara ou coroa
- `!ppt [opcao]` - Pedra, papel, tesoura
- `!slot` - Caça-níquel
- `!roleta` - Roleta russa
- `!sorteio` - Sorteia membro
- `!chance [texto]` - Porcentagem aleatória
- `!escolher [op1,op2]` - Escolhe opção
- `!verdade` - Verdade aleatória
- `!desafio` - Desafio aleatório

### 😂 Brincadeiras
- `!piada` - Piada aleatória
- `!cantada` - Cantada aleatória
- `!frase` - Frase motivacional
- `!fato` - Fato curioso
- `!ship` - Shipa pessoas
- `!gay @user` - Gaymetro
- `!gado @user` - Gadometro
- `!corno @user` - Cornometro
- `!beijar @user` - Beija alguém
- `!tapa @user` - Dá tapa

### 💰 Economia
- `!daily` - Prêmio diário
- `!trabalhar` - Trabalha por dinheiro
- `!crime` - Comete crime
- `!carteira` - Ver saldo
- `!depositar [valor]` - Deposita no banco
- `!sacar [valor]` - Saca do banco
- `!transferir @user [valor]` - Transfere
- `!ranking` - Top ricos

### 🎨 Stickers
- `!sticker` - Cria sticker
- `!s` - Atalho sticker
- `!toimg` - Sticker para imagem
- `!emojimix [e1] [e2]` - Mistura emojis

### 📥 Downloads
- `!play [nome]` - Busca música
- `!tiktok [link]` - Baixa TikTok
- `!letra [musica]` - Letra de música

### 📱 SMS Virtual
- `!sms` - Menu SMS
- `!paises` - Lista países
- `!servicos` - Lista serviços
- `!comprar [servico] [pais]` - Compra número
- `!meusnumeros` - Números ativos
- `!saldo` - Saldo carteira

## Sistema SMS Virtual

### Provedor
- **5sim.net** - Preços em rublos (RUB)
- Taxa de conversão: RUB × 0.065 × 2.0 = preço final em BRL
- Margem de lucro: 100%

### Comandos Dono (SMS)
- `!addsaldo [número] [valor]` - Adicionar saldo
- `!saldoapi` - Ver saldo 5sim

## Mudanças Recentes

### Dezembro 2024 - Expansão Massiva
- Sistema completo de consultas (IP, CEP, DDD, DNS, clima)
- Comandos de guerra (nuke, destrava, banghost)
- Sistema de economia (daily, trabalhar, crime, banco)
- Jogos expandidos (slot, roleta, sorteio)
- Brincadeiras (ship, gay, gado, corno, metros)
- Sistema de stickers (criar, converter)
- Downloads (TikTok, música)
- Menus elegantes estilo BRATVA 🇨🇦

### Sistema SMS Virtual
- Integração com API 5sim.net
- Sistema de carteira virtual
- Conversão RUB → BRL com margem 100%

## Tecnologias

- Node.js 20+
- @whiskeysockets/baileys (WhatsApp API)
- Express (Keep-alive)
- PostgreSQL (Carteiras SMS)
- Axios (Requisições HTTP)
- Chalk (Logs coloridos)
