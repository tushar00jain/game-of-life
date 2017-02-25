FROM node:7.2.0

RUN mkdir -p /app
WORKDIR /app
ENV HOME="/app"

ENV NODE_ENV production

ADD package.json .
RUN npm install

ADD . .

CMD ["npm", "start"]
