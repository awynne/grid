# Repository Guidelines

## Project Structure & Modules
- `app/`: React Router v7 app (routes, layouts, components, loaders/actions).
- `prisma/`: Prisma schema, migrations, and `seed.ts`.
- `database/`: DB setup helpers (TimescaleDB features).
- `docs/`: Project process, coding standards, and specs.
- `scripts/`: DX, database, and deploy scripts.
- `build/`: Production build output (server/client).
- `infrastructure/`: Environment and deployment assets.

## Build, Test, and Dev Commands
- `npm run dev`: Start React Router dev server.
- `npm run build`: Build server/client to `build/`.
- `npm start`: Serve built app (`react-router-serve`).
- `npm run typegen`: Generate route types.
- `npm run typecheck`: Typegen + TypeScript check.
- `npm run lint`: Lint `.ts/.tsx` files.
- `npm run db:setup`: Full DB init (generate, migrate, Timescale features, seed).
- `npm run db:reset`: Reset schema and reseed (local/dev).
- `npm run db:studio`: Open Prisma Studio.

Example local flow:
```bash
cp .env.example .env  # set DATABASE_URL
npm install
npm run db:setup
npm run dev
```

## Coding Style & Naming
- TypeScript strict mode; prefer explicit types and `zod` validation at boundaries.
- Components, hooks, utils: PascalCase files (e.g., `ProjectCard.tsx`).
- Routes: define in `app/routes.ts` or `app/routes/*` using React Router v7 patterns.
- Imports: use `@/*` alias for app code (see `tsconfig.json`).
- Styling: Tailwind + shadcn/ui; keep variants via `cva`, co-locate UI with domain components under `app/components/`.

## Testing Guidelines
- No unit test runner is configured. Validate changes via:
  - `npm run typecheck` and `npm run lint`.
  - Route loader/action behavior with dev server.
  - DB with `scripts/test-local-setup.js` and Prisma Studio.
- Keep tests and examples inside route modules where practical; follow docs in `docs/coding*.md`.

## Commit & PR Guidelines
- Conventional Commits with scope, reference ticket/spec: `feat(auth): add session rotation (GRID-123, #45)`.
- Open focused PRs with:
  - Context and linked issue/spec (GRID-XXX), checklist of changes.
  - Instructions to validate (commands, env requirements), screenshots if UI.
- Squash-merge after review; keep branches `type/GRID-XXX-short-description`.

## Security & Configuration
- Node >= 20; configure `.env` from `.env.example`.
- Required: `DATABASE_URL` (Postgres; TimescaleDB optional).
- Do not commit secrets; prefer Railway or environment-scoped variables.
