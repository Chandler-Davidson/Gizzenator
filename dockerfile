# syntax=docker/dockerfile:1

FROM node:16-alpine
# RUN apk add --no-cache python2 g++ make
RUN npm install pm2 -g
COPY . /

WORKDIR app
RUN npm install --production

WORKDIR discord-bot
RUN npm install --production

WORKDIR lyrics-runner
RUN npm install --production

WORKDIR lib/database
RUN npm install --production

WORKDIR lib/genius
RUN npm install --production

WORKDIR lib/logger
RUN npm install --production

WORKDIR lib/queue
RUN npm install --production

WORKDIR /

# CMD ["node", "src/index.js"]
CMD ["pm2-runtime", "start", "pm2.json"]
EXPOSE 3000