FROM node:22

WORKDIR /app

COPY package*.json ./

COPY nest-cli.json ./

COPY tsconfig*.json ./

RUN npm install

COPY . .

EXPOSE 4000

CMD [ "npm", "run", "start" ]