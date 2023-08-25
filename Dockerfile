#base image
FROM node:16-alpine

RUN mkdir -p /usr/app/
WORKDIR /usr/app/

#copy from to
COPY . .

RUN npm cache clean --force
RUN rm -rf node_modules

RUN npm install && npm run build

EXPOSE 3000

CMD [ "npm", "start" ]