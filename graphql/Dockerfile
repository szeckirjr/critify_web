FROM node:14-slim

WORKDIR /workspace

COPY . ./

RUN npm ci -only=production

RUN npm run build

ENV PORT 4000
EXPOSE 4000

ENTRYPOINT ["npm", "start"]