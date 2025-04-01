FROM oven/bun:1.2.7
WORKDIR /usr/src/app
COPY package*.json .
RUN bun install
COPY . .
CMD ["bun", "run", "dev"]