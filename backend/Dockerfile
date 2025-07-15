# Bun runtime kullanarak multi-stage build
FROM oven/bun:1 AS base

# Çalışma dizinini ayarla
WORKDIR /app

# NODE_ENV'i build argument olarak al (default: production)
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Package dosyalarını kopyala
COPY package.json bun.lock* ./

# NODE_ENV'e göre bağımlılıkları kur
RUN if [ "$NODE_ENV" = "production" ] ; then bun install --production --frozen-lockfile ; else bun install --frozen-lockfile ; fi

# Kaynak kodları kopyala
COPY . .

# Production image
FROM oven/bun:1 AS runner
WORKDIR /app

# NODE_ENV'i build argument olarak al (default: production)
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Sistem kullanıcısı oluştur
RUN addgroup --system --gid 1001 bunjs
RUN adduser --system --uid 1001 bunjs

# Package dosyalarını kopyala
COPY package.json bun.lock* ./

# NODE_ENV'e göre bağımlılıkları kur
RUN if [ "$NODE_ENV" = "production" ] ; then bun install --production --frozen-lockfile ; else bun install --frozen-lockfile ; fi

# Kaynak kodları kopyala
COPY index.ts ./
COPY tsconfig.json ./

USER bunjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["bun", "run", "index.ts"] 