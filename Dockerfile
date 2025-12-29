FROM oven/bun:1.3.0-alpine

WORKDIR /app

# Copy package files only
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Run the worker
CMD ["bun", "run", "worker"]
