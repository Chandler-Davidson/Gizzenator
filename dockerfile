# syntax=docker/dockerfile:1

FROM node:16-alpine
# RUN apk add --no-cache python2 g++ make
RUN npm install pm2 -g
WORKDIR /app
COPY . .
RUN npm install --production
# CMD ["node", "src/index.js"]
CMD ["pm2-runtime", "start", "pm2.json"]
EXPOSE 3000