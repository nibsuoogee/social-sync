# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1.2.7
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ui/package*.json .
RUN bun install
COPY ui/. .

# Copy backend model types
COPY backend/src/models ../backend/src/models
COPY backend/tsconfig.json ../backend/tsconfig.json

# Copy auth model types
COPY auth/src/models ../auth/src/models
COPY auth/tsconfig.json ../auth/tsconfig.json

RUN bun run build