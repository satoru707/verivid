FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Generate Prisma client
RUN pnpm run prisma:generate

# Build
RUN pnpm run build

# Expose port
EXPOSE 3001

# Run migrations and start
CMD ["sh", "-c", "pnpm run prisma:migrate -- --skip-generate && pnpm start"]
