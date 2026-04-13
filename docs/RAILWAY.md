# Deploy på Railway (QuickSlot)

Projekt på Railway: **quickslot** (`e11a4966-a176-442e-9f0a-cf9cf9a971d4`).

## Services

- **Postgres** — database med `DATABASE_URL` (intern) og `DATABASE_PUBLIC_URL` (proxy til lokale værktøjer).
- **quickslot** (Next.js) — skal have **`DATABASE_URL`** sat til reference fra Postgres: `${{Postgres.DATABASE_URL}}` (eller tilsvarende i Variables).

## Build og start

- **Build:** `npm run build` (kører `prisma generate && next build` via `package.json`).
- **Start:** repo indeholder en **`Procfile`** med:
  ```bash
  npx prisma migrate deploy && npm run start
  ```
  Så kører migrationer mod produktions-DB ved hver deploy, derefter Next.js.

Hvis `Procfile` ikke respekteres af builderen, sæt **Custom Start Command** i Railway til samme kommando og brug `next start -p $PORT` hvis platformen kræver det eksplicit:
`npx prisma migrate deploy && npx next start -p $PORT`

## Lokalt

1. Link Postgres: `railway service link Postgres`
2. Eksporter `DATABASE_URL` fra `DATABASE_PUBLIC_URL` (proxy) eller kopier fra `railway variables --json`.
3. `npx prisma migrate dev` og `npm run db:seed` efter behov.

## GitHub → Railway

Forbind GitHub-repoet til **quickslot**-servicen; deploy ved push til `main`.

Data ligger i **PostgreSQL** og overlever deploys (modsat den tidligere in-memory demo).
