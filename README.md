# Nativo (étape 1 : fondations)

Prérequis : Node 20+, pnpm 9, Docker.

```bash
cp .env.example apps/api/.env && cp .env.example packages/db/.env && cp .env.example apps/web/.env.local
pnpm install
pnpm infra:up          # Postgres, Redis, MinIO
pnpm db:generate && pnpm db:migrate
pnpm dev               # web : http://localhost:3000  api : http://localhost:4000
```

Sécurité : aucun secret côté web (seule `NEXT_PUBLIC_API_URL` est publique). Sessions : cookie HttpOnly,
hash SHA-256 en base, argon2id, en-tête anti-CSRF `x-nativo-csrf`, rate limiting (10 req/min sur /auth).
