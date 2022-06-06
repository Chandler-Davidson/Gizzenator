# syntax=docker/dockerfile:1

FROM node:16-alpine

RUN npm install pm2 -g

COPY . /

WORKDIR app
RUN npm install --production

WORKDIR ../discord-bot
RUN npm install --production

WORKDIR ../lyrics-runner
RUN npm install --production

WORKDIR ../lib/database
RUN npm install --production

WORKDIR ../genius
RUN npm install --production

WORKDIR ../logger
RUN npm install --production

WORKDIR ../queue
RUN npm install --production

WORKDIR ../../

CMD ["pm2-runtime", "pm2.json"]

EXPOSE 3000