# -------- STAGE 1: Build (with dev dependencies) --------
FROM node:20-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm@9.4
COPY package*.json .
RUN pnpm install
COPY . .
RUN pnpm run build

# -------- STAGE 2: Dependencies only (prod) --------
FROM node:20-alpine AS deps
WORKDIR /app
RUN npm install -g pnpm@9.4
COPY package*.json ./
COPY pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod --ignore-scripts

# -------- STAGE 3: Runtime --------
FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package*.json ./
CMD ["node", "dist/main.js"]
