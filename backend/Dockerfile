FROM node:22-alpine

WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Compilar TypeScript
RUN npm run build

# Crear directorio para logs
RUN mkdir -p logs

# Puerto expuesto
EXPOSE 3000

# Comando de inicio
CMD ["node", "dist/index.js"]
