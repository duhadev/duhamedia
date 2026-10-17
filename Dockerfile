# syntax=docker/dockerfile:1
# Based on templates/with-postgres/Dockerfile at payload v3.91.0
# (itself from vercel/next.js examples/with-docker). Requires
# `output: 'standalone'` in next.config.ts.
#
# Built in GitHub Actions with NO database and NO secrets: every frontend route
# is force-dynamic, and all config is read from env at runtime.

FROM node:24-alpine AS base
ENV PNPM_VERSION=11.28.3
RUN npm install -g pnpm@${PNPM_VERSION} && npm cache clean --force

# ---- deps: install exactly what the lockfile says
FROM base AS deps
# https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# ---- builder: next build (standalone)
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# --network=none proves the build needs no database (or any network).
RUN --network=none pnpm run build

# ---- runner: minimal runtime image
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    NODE_OPTIONS=--max-old-space-size=384 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 -G nodejs nextjs

COPY --from=builder /app/public ./public

# Prerender cache + default media dir (used only when MEDIA_DIR is unset;
# staging/production bind-mount their own directory at MEDIA_DIR).
RUN mkdir .next media && chown nextjs:nodejs .next media

# Output file tracing: only the files the server needs
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# Polling health also triggers Payload init (and therefore prodMigrations)
# shortly after start, without waiting for the first real visitor.
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:3000/api/health || exit 1

# server.js is created by next build from the standalone output
CMD ["node", "server.js"]
