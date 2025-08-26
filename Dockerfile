# Dockerfile (Nest.js)
FROM node:18-alpine
WORKDIR /sop-insight-cerdas
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/main"]

