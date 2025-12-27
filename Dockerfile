# Dockerfile para deploy em plataformas com suporte a Docker
# Exemplo: Railway, Fly.io, DigitalOcean, etc.

FROM node:20-alpine

# Instalar dependências do sistema
RUN apk add --no-cache \
    ffmpeg \
    python3 \
    make \
    g++ \
    git \
    && rm -rf /var/cache/apk/*

# Criar diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm install --production

# Copiar código fonte
COPY . .

# Criar diretórios necessários
RUN mkdir -p auth_info storage/data storage/backups

# Expor porta
EXPOSE 5000

# Comando de inicialização
CMD ["node", "index.js"]
