# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1.2.7
WORKDIR /usr/src/app
COPY ui/package*.json .
RUN bun install
COPY ui/. .

# Copy shared code into a subfolder inside the image
COPY shared/src ../shared/src
COPY shared/tsconfig.json ../shared/tsconfig.json


# Install nodemon globally
RUN bun add -g nodemon

CMD ["bun", "dev"]