FROM node:10
# Create app directory
WORKDIR /usr/src/app
COPY . .

RUN npm ci

EXPOSE $PORT

CMD [ "npm", "run", "start" ]