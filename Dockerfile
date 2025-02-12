FROM node:22.8.0-slim

RUN mkdir -p /home/node/app && chown -R node:node /home/node/app

USER node

WORKDIR /home/node/app

CMD [ "tail", "-f", "/dev/null" ]