# Deploy på Railway

1. Opret konto på [Railway](https://railway.app/) og vælg **New Project** → **Deploy from GitHub repo**.
2. Vælg **`eskoubar95/quickslot`** (eller dit fork) og godkend GitHub-app adgang.
3. Sæt **Root** til repo-roden (standard). Production branch: **`main`**.
4. Railway bruger typisk **Nixpacks**: install → `npm run build`, start → `npm start`.
5. Hvis appen ikke lytter på den forventede port, sæt **Start Command** til:
   ```bash
   npx next start -p $PORT
   ```
6. Åbn den genererede **public URL** og test booking-flowet.

**Bemærk:** In-memory data nulstilles ved nye deploys eller når servicen genstartes.
