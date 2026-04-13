# QuickSlot

Mini bookingsystem bygget med **Next.js** (App Router), **TypeScript** og **Tailwind**. Formålet er at demonstrere **GitHub** (PR’er, branches), **CI** (lint, test, build) og **deploy** (fx **Railway**).

## Funktioner

- Viser **ledige tidsrum** (30 minutter) fra en **in-memory** butik (nulstilles ved deploy/genstart på Railway).
- **Book** et slot via `POST /api/slots` med `{ "slotId": "..." }`.
- **UI** med loading-, fejl- og tom tilstand.

## Kommandoer

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run test
npm run build
npm start        # production (bruges på Railway)
```

## A–Z: fra repo til live

1. **skills.sh** — Se [docs/SKILLS.md](./docs/SKILLS.md) for hvilke agent-skills der er valgt til projektet.
2. **GitHub** — Push til `main`; CI kører på hver PR og push til `main` (`.github/workflows/ci.yml`).
3. **Railway** — Se [docs/RAILWAY.md](./docs/RAILWAY.md) for trin-for-trin (GitHub-integration, build/start, `PORT`). Kort: **Deploy from GitHub** → dette repo → branch `main` → åbn den **public URL** Railway giver.
4. Valgfrit: **Branch protection** på `main` (Settings → Branches): kræv at workflow **CI** er grøn før merge.

## API

| Metode | Sti           | Beskrivelse                          |
|--------|---------------|--------------------------------------|
| `GET`  | `/api/slots`  | Liste over ledige slots (JSON)       |
| `POST` | `/api/slots`  | Body: `{ "slotId": string }` — book  |

Fejl: `400` (ugyldig body / tid i fortiden), `404` (ukendt id), `409` (allerede booket).

## CI

![CI](https://github.com/eskoubar95/quickslot/actions/workflows/ci.yml/badge.svg)

*(Badge forudsætter at repo hedder `eskoubar95/quickslot` — ret bruger/repo i URL hvis dit navn er anderledes.)*

## Licens

Privat / kursusprojekt.

## Pull requests

Brug feature branches og åbn PR mod `main`; CI skal være grøn før merge.
