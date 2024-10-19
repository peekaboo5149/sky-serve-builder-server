FROM ubuntu:focal

LABEL AUTHOR="Tanmay Kumar"
LABEL EMAIL="ktanmay5149@gmail.com"

RUN apt-get update
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get upgrade -y
RUN apt-get install -y nodejs
RUN apt-get install tree -y

RUN apt-get install git -y

RUN apt-get remove --purge curl -y
RUN apt-get autoremove -y

WORKDIR /home/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npm prune --production && rm -rf src

RUN chmod -R +x /home/app/dist
RUN chmod +x /home/app/main.sh



ENTRYPOINT [ "/home/app/main.sh" ]
