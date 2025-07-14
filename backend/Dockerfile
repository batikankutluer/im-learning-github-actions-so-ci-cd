# Bun runtime kullanarak multi-stage build
FROM oven/bun:1 AS base

# Çalışma dizinini ayarla
WORKDIR /app

# Package dosyalarını kopyala
COPY package.json bun.lock* ./

# Bağımlılıkları kur
RUN bun install --frozen-lockfile

# Kaynak kodları kopyala
COPY . .

# Production image
FROM oven/bun:1 AS runner
WORKDIR /app

ENV NODE_ENV=production

# Sistem kullanıcısı oluştur
RUN addgroup --system --gid 1001 bunjs
RUN adduser --system --uid 1001 bunjs

# Package dosyalarını kopyala
COPY package.json bun.lock* ./

# Production bağımlılıklarını kur
RUN bun install --production --frozen-lockfile

# Kaynak kodları kopyala
COPY index.ts ./
COPY tsconfig.json ./

USER bunjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["bun", "run", "index.ts"] 