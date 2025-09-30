# ====== Stage 1: Build (compila TypeScript) ======
FROM node:20-alpine AS builder

# Variables de entorno para mejorar rendimiento de npm
ENV NODE_ENV=development \
    NPM_CONFIG_UPDATE_NOTIFIER=false \
    CI=true

# Directorio de trabajo
WORKDIR /app

# Copiamos manifiestos primero para aprovechar cache
COPY package*.json ./

# Instala TODAS las dependencias (incluye dev) para compilar
RUN npm ci

# Copiamos el resto del código (incluye .ts)
COPY . .

# Compilar a dist/
RUN npx tsc

# Opcional: quitar devDependencies para reducir tamaño
RUN npm prune --omit=dev


# ====== Stage 2: Runtime (sólo lo necesario para correr) ======
FROM node:20-alpine AS runtime

ENV NODE_ENV=production \
    PORT=3003

WORKDIR /app

# Copiamos sólo lo mínimo desde el builder:
#  - node_modules ya sin devDeps
#  - package.json (útil para inspección)
#  - código compilado en dist/
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/dist ./dist

# Seguridad básica: usar usuario no root
USER node

# Expone el puerto de la app
EXPOSE 3003

# Ejecuta la app compilada
CMD ["node", "dist/index.js"]

