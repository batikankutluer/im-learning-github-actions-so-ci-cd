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

RUN bun install --frozen-lockfile
COPY . .

# Public klasörünü oluştur (yoksa)
RUN mkdir -p ./public

# NODE_ENV'e göre build veya dev modunu ayarla
RUN if [ "$NODE_ENV" = "development" ] ; then echo "Development mode - skipping build" ; else bun run build ; fi

# Production image
FROM base AS runner
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Sistem kullanıcısı oluştur
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Public klasörünü oluştur ve kopyala
RUN mkdir -p ./public
COPY --from=builder /app/public ./public

# Statik dosyalar için doğru izinleri ayarla
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Development için kaynak kodları kopyala, production için build çıktılarını kopyala
RUN if [ "$NODE_ENV" = "development" ] ; then \
      echo "Development mode" ; \
    else \
      echo "Production mode" ; \
    fi

COPY --from=builder --chown=nextjs:nodejs /app ./

# Development modunda tüm dosyalara yazma izni ver
RUN chmod -R 777 /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# NODE_ENV'e göre farklı komut çalıştır
CMD if [ "$NODE_ENV" = "development" ] ; then bun run dev --turbopack ; else node server.js ; fi 