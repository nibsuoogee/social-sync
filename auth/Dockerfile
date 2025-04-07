FROM oven/bun:1.2.7
WORKDIR /usr/src/app
COPY auth/package*.json .
RUN bun install
COPY auth/. .

# Copy shared code into a subfolder inside the image
COPY shared/src ../shared/src

# Install nodemon globally
RUN bun add -g nodemon

CMD ["bun", "run", "dev"]