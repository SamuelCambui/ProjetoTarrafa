# Usar uma imagem Node.js oficial como base
FROM node:18-alpine

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar o restante dos arquivos do frontend
COPY . .
COPY .env.producao .env

# Construir a aplicação para produção
# RUN npm run build

# Expor a porta que o Next.js usa 
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "run", "dev"]