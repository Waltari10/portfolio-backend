FROM node:10
# Create app directory
WORKDIR /usr/src/app
COPY . .

RUN npm ci

EXPOSE 3001

CMD [ "npm", "run", "start" ]