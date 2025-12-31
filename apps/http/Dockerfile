FROM oven/bun:1.3.0-alpine AS builder
WORKDIR /app

# Copy dependency files first (cached unless package.json changes)
COPY package.json bun.lock ./
COPY lib/package.json ./lib/package.json
COPY apps/http/package.json ./apps/http/package.json

# Install dependencies (cached layer)
RUN bun install 

# Copy source code (only invalidates cache when code changes)
COPY lib ./lib
COPY apps/http ./apps/http

# Build (only runs when source changes)
RUN cd apps/http && bun run build

# Production
FROM oven/bun:1.3.0-alpine
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/apps/http/dist ./dist

EXPOSE 3002
CMD ["bun", "dist/index.js"]
