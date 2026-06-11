FROM node:22-alpine AS base
RUN apk add --no-cache python3 make g++ \
  && npm install -g pnpm@10
WORKDIR /app

FROM base AS build
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY packages/server/package.json ./packages/server/package.json
RUN pnpm install --frozen-lockfile

COPY packages/server ./packages/server
RUN pnpm --filter server db:generate
RUN pnpm --filter server build

FROM base AS runtime
ENV NODE_ENV=production
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY packages/server/package.json ./packages/server/package.json
RUN pnpm install --frozen-lockfile

COPY --from=build /app/packages/server/dist ./packages/server/dist
COPY --from=build /app/packages/server/prisma.config.ts ./packages/server/prisma.config.ts
COPY --from=build /app/packages/server/src/db/schema.prisma ./packages/server/src/db/schema.prisma
COPY --from=build /app/packages/server/src/db/migrations ./packages/server/src/db/migrations

WORKDIR /app/packages/server

EXPOSE 8000

CMD ["sh", "-c", "pnpm db:deploy && node dist/src/server.js"]
