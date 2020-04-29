FROM ubuntu:16.04

RUN apt-get update && \
    apt-get install -y git curl

RUN curl -sl https://deb.nodesource.com/setup_10.15.1 | bash - && \
    apt-get install -y nodejs

RUN git clone

WORKDIR

RUN npm install

EXPOSE 3005

CMD npm start