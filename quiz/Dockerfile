FROM ubuntu:16.04

RUN apt-get update && \
    apt-get install -y git curl

RUN curl -sl https://deb.nodesource.com/setup_10.x | bash - && \
    apt-get install -y nodejs

RUN git clone https://github.com/ivanvazq/quiz_microservices

WORKDIR ./quiz_microservices/quiz

RUN npm install

EXPOSE 3001

CMD node server.js