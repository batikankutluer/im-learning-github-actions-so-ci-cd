# Bun runtime kullanarak multi-stage build
FROM oven/bun:1 AS base

# Çalışma dizinini ayarla
WORKDIR /app

# Package dosyalarını kopyala
COPY package.json bun.lock* ./

# Bağımlılıkları kur
FROM base AS deps
# NODE_ENV'i build argument olarak al (default: production)
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# NODE_ENV'e göre bağımlılıkları kur
RUN if [ "$NODE_ENV" = "production" ] ; then bun install --production --frozen-lockfile ; else bun install --frozen-lockfile ; fi

# Builder stage
FROM base AS builder
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# TypeScript tiplerini oluştur
RUN bun run build

# Production image
FROM base AS runner
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Sistem kullanıcısı oluştur
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Next.js dosyalarını kopyala
COPY --from=builder /app/public ./public

# Statik dosyalar için doğru izinleri ayarla
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Build çıktılarını kopyala
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["bun", "server.js"] 