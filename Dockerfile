FROM node:21-alpine

WORKDIR /usr/src/app

RUN npm install -g sequelize-cli mysql2 nodemon

COPY ["package.json", "./"]

RUN npm install

COPY . .

EXPOSE 8000

CMD [ "nodemon", "server" ]