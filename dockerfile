FROM node:22

RUN mkdir /usr/src/app
WORKDIR /usr/src/app

EXPOSE 80
EXPOSE 443