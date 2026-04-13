FROM node:20-slim AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
RUN npm ci

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Re-create the user if needed, or just use node user
# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 expressjs

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Ensure the app runs as a non-root user for security
USER node

EXPOSE 3001

ENV PORT=3001

CMD ["node", "src/index.js"]
