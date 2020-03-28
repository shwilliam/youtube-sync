FROM node:11
ARG PORT=3000
ENV PORT $PORT

WORKDIR /usr/src/app

COPY ./package.json .
COPY ./yarn.lock .
COPY ./packages/www/package.json ./packages/www/
COPY ./packages/server/package.json ./packages/server/
COPY ./packages/www/.env.development ./packages/www/

RUN npm i -g yarn
RUN yarn install --production
COPY . .

RUN cd ./packages/www && yarn build && mv ./build ../server

EXPOSE $PORT
CMD cd ./packages/server && yarn start
