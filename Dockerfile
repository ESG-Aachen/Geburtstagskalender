FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Environment Variables
ARG UCS_BASE_URL
ARG UCS_USERNAME
ARG UCS_PASSWORD

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

# Uncomment and fill out the following lines in case you need to trust a self-signed certificate
# COPY <local-path-to-certificate> ./custom-certificate.cer
# ENV NODE_EXTRA_CA_CERTS=custom-certificate.cer

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner

WORKDIR /app

ENV NODE_ENV production

# Environment Variables
ARG UCS_BASE_URL
ARG UCS_USERNAME
ARG UCS_PASSWORD
ENV UCS_BASE_URL=${UCS_BASE_URL}
ENV UCS_USERNAME=${UCS_USERNAME}
ENV UCS_PASSWORD=${UCS_PASSWORD}

# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Uncomment the following lines in case you want to trust a self-signed certificate
# COPY <local-path-to-certificate> ./custom-certificate.cer
# ENV NODE_EXTRA_CA_CERTS=custom-certificate.cer

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"]