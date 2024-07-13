# Especifica a imagem base do Node.js
FROM node:18-alpine

# Define o diretório de trabalho no contêiner
WORKDIR /app

# Copia o arquivo package.json e package-lock.json (se disponível)
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia os arquivos do projeto para o diretório de trabalho
COPY . .

# Constrói a aplicação para produção
RUN npm run build

# Expõe a porta 3000
EXPOSE 4343

# Comando para rodar a aplicação
CMD ["npm", "start"]
