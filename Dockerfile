FROM node:15

WORKDIR /app

COPY package*.json ./

RUN npm install && npm install -g

COPY . ./

CMD ["npm", "run", "build"]
