# Lead Distribution Router

Un système de distribution de leads. Le dépôt est un petit monorepo :

```
api/   — Express + Prisma + PostgreSQL
web/   — Frontend Next.js
```

## Démarrage

Il faut Node 18+ (20 recommandé), Docker et npm.

### 1. Base de données

Lance PostgreSQL avec Docker :

```bash
docker compose up -d
```

 Elle tourne sur `localhost:5434`, utilisateur/mot de passe `router`/`router`, base `router_db`. Les données sont persistées dans un volume Docker, elles survivent aux redémarrages.

Pour tout effacer : `docker compose down -v`.

### 2. Installer les dépendances

```bash
npm install
```

Installe tout pour les deux workspaces.

### 3. Variables d'environnement

Le dépôt contient déjà les fichiers env dont tu as besoin :

- `api/.env` — pointe le backend vers la base locale et définit le secret JWT
- `web/.env.local` — l'URL de l'API que le frontend appelle

Modifie-les si tu changes les identifiants de la base ou les ports.

### 4. Migrations et seed

Depuis la racine du dépôt :

```bash
npm run prisma:generate -w api
npm run prisma:migrate -w api
npm run prisma:seed -w api
```

Le seed crée deux comptes admin :

- `admin@example.com` / `admin123`
- `ops@example.com` / `admin456`

Il ajoute aussi les verticals,clients, deliveries de démo, ainsi qu'environ 300 leads répartis sur les 30 derniers jours — certains routés, d'autres rejetés.

Pour fouiller dans la base : `npm run prisma:studio -w api` ouvre Prisma Studio.

### 5. Lancer

```bash
npm run dev
```

Démarre l'API et le frontend en même temps :

- API : http://localhost:3200/api
- Web : http://localhost:3005
- Swagger : http://localhost:3200/api/docs

Un seul à la fois ? `npm run dev:api` et `npm run dev:web`.

## Build de production

```bash
npm run build
npm run start:api
npm run start:web
```

## Divers

- Lint : `npm run lint`
- Stopper la base : `docker compose down`