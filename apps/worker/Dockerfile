FROM oven/bun:1.3.0-alpine AS builder
WORKDIR /app

# Copy dependency files first (cached unless package.json changes)
COPY package.json bun.lock ./
COPY lib/package.json ./lib/package.json
COPY apps/worker/package.json ./apps/worker/package.json

# Install dependencies (cached layer)
RUN bun install

# Copy source code (only invalidates cache when code changes)
COPY lib ./lib
COPY apps/worker ./apps/worker

# Build (only runs when source changes)
RUN cd apps/worker && bun run build

# Production
FROM oven/bun:1.3.0-alpine
WORKDIR /app

# Copy built app, dependencies, and lib
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/apps/worker/dist ./dist

CMD ["bun", "dist/whatsapp-worker.js"]
