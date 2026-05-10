FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

# Ensure service account is present at build (or mount as secret)
# COPY firebase-service-account.json ./

EXPOSE 4000

CMD ["node", "index.js"]
