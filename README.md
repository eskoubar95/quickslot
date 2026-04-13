# QuickSlot

Mini bookingsystem med **Next.js** (App Router), **TypeScript**, **Tailwind**, **shadcn/ui**, **Framer Motion**, **Prisma** og **PostgreSQL** på **Railway**. Demonstrerer **GitHub** (PR’er, branches), **CI** og **CD**.

## Funktioner

- **PostgreSQL** — slots og bookinger gemmes i databasen (overlever deploys).
- **Book med navn** — `POST /api/slots` med `slotId` og `guestName`.
- **UI** — design tokens, kort, faner pr. dag, toast-bekræftelse, diskrete animationer.

## Kommandoer

```bash
npm install
cp .env.example .env   # sæt DATABASE_URL fra Railway (Postgres → DATABASE_PUBLIC_URL lokalt)
npm run dev              # http://localhost:3000
npm run lint
npm run test
npm run build
npm run db:seed          # efter migrate (valgfrit)
npm start                # production; på Railway kører Procfile migrate + start
```

## A–Z: fra repo til live

1. **skills.sh** — [docs/SKILLS.md](./docs/SKILLS.md), [docs/SKILLS_EXTENSIONS.md](./docs/SKILLS_EXTENSIONS.md).
2. **GitHub** — CI på PR/push til `main` (`.github/workflows/ci.yml`).
3. **Railway** — [docs/RAILWAY.md](./docs/RAILWAY.md): Postgres + `DATABASE_URL` på app-servicen, **Procfile** kører `prisma migrate deploy` ved start.
4. Valgfrit: **Branch protection** på `main`.

## API

| Metode | Sti           | Beskrivelse                                                |
|--------|---------------|------------------------------------------------------------|
| `GET`  | `/api/slots`  | Ledige slots (uden booking)                                |
| `POST` | `/api/slots`  | Body: `{ "slotId": string, "guestName": string }` — book   |

Fejl: `400` (ugyldig body / tid i fortiden), `404` (ukendt id), `409` (allerede booket).

## CI

![CI](https://github.com/eskoubar95/quickslot/actions/workflows/ci.yml/badge.svg)

## Licens

Privat / kursusprojekt.

## Pull requests

Brug feature branches og åbn PR mod `main`; CI skal være grøn før merge.
