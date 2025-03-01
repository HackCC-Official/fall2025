# syntax=docker.io/docker/dockerfile:1

FROM node:18-alpine AS base

# Step 1. Rebuild the source code only when needed
FROM base AS builder

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
# Install dependencies using the package manager with conflict resolution fix
RUN \
  if [ -f yarn.lock ]; then \
  yarn install --frozen-lockfile; \
  elif [ -f package-lock.json ]; then \
  npm ci --legacy-peer-deps; \
  elif [ -f pnpm-lock.yaml ]; then \
  corepack enable pnpm && pnpm install; \
  else \
  echo "Warning: Lockfile not found. It is recommended to commit lockfiles to version control." && yarn install; \
  fi

# Copy application source files
COPY . .

# Set environment variable to disable ESLint during the build process
ARG NEXT_PUBLIC_QR_SERVICE_URL
ENV NEXT_PUBLIC_QR_SERVICE_URL=${NEXT_PUBLIC_QR_SERVICE_URL}
ARG NEXT_PUBLIC_OUTREACH_SERVICE_URL
ENV NEXT_PUBLIC_OUTREACH_SERVICE_URL=${NEXT_PUBLIC_OUTREACH_SERVICE_URL}
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
ARG NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ARG NEXT_PUBLIC_PRODUCTION
ENV NEXT_PUBLIC_PRODUCTION=${NEXT_PUBLIC_PRODUCTION}

# Build Next.js app
RUN \
  if [ -f yarn.lock ]; then \
  NODE_ENV=production yarn build; \
  elif [ -f package-lock.json ]; then \
  NODE_ENV=production npm run build; \
  elif [ -f pnpm-lock.yaml ]; then \
  NODE_ENV=production pnpm build; \
  else \
  NODE_ENV=production npm run build; \
  fi

# Step 2. Production image, copy only necessary files
FROM base AS runner

WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
  adduser --system --uid 1001 nextjs && \
  chown -R nextjs:nodejs /app

USER nextjs

# Copy built application and static files from the builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./.next/standalone
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Re-define runtime environment variables
ARG NEXT_PUBLIC_QR_SERVICE_URL
ENV NEXT_PUBLIC_QR_SERVICE_URL=${NEXT_PUBLIC_QR_SERVICE_URL}
ARG NEXT_PUBLIC_OUTREACH_SERVICE_URL
ENV NEXT_PUBLIC_OUTREACH_SERVICE_URL=${NEXT_PUBLIC_OUTREACH_SERVICE_URL}
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
ARG NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ARG NEXT_PUBLIC_PRODUCTION
ENV NEXT_PUBLIC_PRODUCTION=${NEXT_PUBLIC_PRODUCTION}

# Expose the necessary port for the app
EXPOSE 3000

# Start the Next.js app in production mode
CMD ["node", ".next/standalone/server.js"]