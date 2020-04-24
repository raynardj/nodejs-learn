FROM node:latest
ADD app/ /root
WORKDIR /root/app
RUN npm install -g nodemon
RUN npm install --save sequelize
RUN npm install --save sqlite3
RUN npm install body-parser
RUN npm install --save nunjucks
RUN npm install --save express
EXPOSE 3000