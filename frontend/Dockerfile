# Bun runtime kullanarak multi-stage build
FROM oven/bun:1 AS base

# Çalışma dizinini ayarla
WORKDIR /app

# Package dosyalarını kopyala
COPY package.json bun.lock* ./

# Bağımlılıkları kur
FROM base AS deps
RUN bun install --frozen-lockfile

# Builder stage
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# TypeScript tiplerini oluştur
RUN bun run build

# Production image
FROM base AS runner
ENV NODE_ENV=production

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