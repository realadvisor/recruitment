FROM node:8-alpine

WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./

RUN apk update \
  && apk add --no-cache curl bash \
  && sh -c "curl -o- -L https://yarnpkg.com/install.sh | bash" \
  && yarn install

EXPOSE 8080
CMD [ "yarn", "dev" ]
