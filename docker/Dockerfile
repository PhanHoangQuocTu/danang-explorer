# syntax=docker/dockerfile:1.7
ARG NODE_VERSION=26.13.1

# ---- deps: install with a cached pnpm store ---------------------------------
FROM node:${NODE_VERSION}-alpine AS build-base
RUN npm install --global corepack@0.36.0 && corepack enable

FROM build-base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --ignore-scripts

# ---- builder ----------------------------------------------------------------
FROM build-base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* values are inlined at build time, so they must be build args.
ARG NEXT_PUBLIC_APP_ENV=production
ARG NEXT_PUBLIC_APP_URL=https://dn-explorer.phanhoangquoctu.io.vn
ARG NEXT_PUBLIC_API_URL=https://jsonplaceholder.typicode.com
ARG NEXT_PUBLIC_OWNER_NAME="Phan Hoàng Quốc Tú"
ARG NEXT_PUBLIC_OWNER_EMAIL=tuphan694@gmail.com
ARG NEXT_PUBLIC_OWNER_FACEBOOK_URL=https://www.facebook.com/phanhoangquoctu/
ARG NEXT_PUBLIC_OWNER_LINKEDIN_URL=https://www.linkedin.com/in/phanhoangquoctu/
ENV NEXT_PUBLIC_APP_ENV=$NEXT_PUBLIC_APP_ENV \
    NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL \
    NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_OWNER_NAME=$NEXT_PUBLIC_OWNER_NAME \
    NEXT_PUBLIC_OWNER_EMAIL=$NEXT_PUBLIC_OWNER_EMAIL \
    NEXT_PUBLIC_OWNER_FACEBOOK_URL=$NEXT_PUBLIC_OWNER_FACEBOOK_URL \
    NEXT_PUBLIC_OWNER_LINKEDIN_URL=$NEXT_PUBLIC_OWNER_LINKEDIN_URL \
    NEXT_TELEMETRY_DISABLED=1

RUN pnpm build

# ---- runner -----------------------------------------------------------------
FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

# Standalone output already contains the traced node_modules and server.js.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/api/health || exit 1

CMD ["node", "server.js"]
