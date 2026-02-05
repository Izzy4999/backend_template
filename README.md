# Backend Template (Express + TypeScript)

A minimal, production-ready backend starter built with Express 5, TypeScript, path aliases, environment validation, and Swagger docs powered by a YAML OpenAPI spec.

## Tech Stack
- Node.js + Express 5 (TypeScript)
- Path aliases for clean imports (tsconfig-paths in dev, tsc-alias in build)
- Environment validation with envalid (dotenv loaded before validation)
- JWT utilities for auth, simple in-memory refresh token store
- Nodemailer for email
- Swagger UI served from a YAML OpenAPI file

## Getting Started
1) Install dependencies
- npm install

2) Configure environment variables
- Copy .env.example to .env and fill all values
- The server will not boot if any required variable is missing

3) Run locally
- npm run dev
- API base path: /api
- Health check: GET /

4) Build and run production build
- npm run build
- npm start

## Scripts
- dev: Start the dev server with ts-node-dev and tsconfig-paths
- build: Compile TypeScript and rewrite path aliases (tsc + tsc-alias)
- start: Run the compiled server from dist

## Environment Variables
Required (see .env.example):
- NODE_ENV: development | production | test
- PORT: Server port (default 4000 in validation)
- JWT_SECRET: Secret for access tokens
- REFRESH_SECRET: Secret for refresh tokens
- AUTH_SESSION_MODE: `single` (one refresh token per user, logout logs out everywhere) or `multi` (multiple refresh tokens, logout only revokes the one sent). Default `single`.
- EMAIL_USER: SMTP username (e.g., Gmail)
- EMAIL_PASS: SMTP password/app password
- EMAIL_FROM: From email address

Notes:
- dotenv is loaded automatically before validation
- envalid enforces required values and will terminate boot with a clear error if any are missing

## API Documentation (Swagger)
Documentation is powered by a single YAML file at docs/openapi.yaml.
- Swagger UI: http://localhost:PORT/docs
- Raw OpenAPI JSON: http://localhost:PORT/docs.json

Servers configuration inside the YAML uses url: /api so a path like /auth/refresh is served as /api/auth/refresh at runtime.

Updating the docs:
- Edit docs/openapi.yaml
- Optionally split into multiple files with $ref as your API grows

## Project Structure
- src/
  - app.ts: Express app setup, Swagger UI mounting
  - server.ts: App bootstrap
  - routes/: Feature routes (mounted under /api)
  - controllers/: Route handlers
  - middlewares/: Reusable middleware (e.g., auth)
  - utils/: Helpers (jwt, mailer, token store, env)
  - types/: Global and shared TypeScript types
- docs/
  - openapi.yaml: Single source of truth for API docs

## Path Aliases
Configured in tsconfig.json with baseUrl=src and aliases like @utils/*.
- Dev: ts-node-dev -r tsconfig-paths/register resolves aliases
- Build: tsc-alias rewrites import paths in dist after tsc runs

## Auth Overview
- utils/jwt.ts contains helpers to sign/verify access and refresh tokens
- utils/tokenStore.ts is a simple in-memory store for refresh tokens (replace with Redis/DB in production)
- **Session mode:** This repo supports three options (see `templates/README.md`). **(1) Env-based** (default): `src/` uses `AUTH_SESSION_MODE` in `.env` to switch single vs multi. **(2) Single-only:** copy `templates/single/` into `src/` for fixed single-session auth. **(3) Multi-only:** copy `templates/multi/` into `src/` for fixed multi-session auth.

## Email
- utils/mailer.ts uses nodemailer with provided SMTP credentials
- For development, consider using a test SMTP service (e.g., Mailtrap) or a mock transport

## Common Tasks
- Add a new route: Create a file in src/routes, register it in src/routes/index.ts, implement handlers in src/controllers
- Document the new route: Update docs/openapi.yaml paths with your endpoint definition

## Security Notes
- Use strong secrets for JWT_SECRET and REFRESH_SECRET
- Never commit .env to version control
- Consider rate limiting and CORS configuration appropriate to your deployment

## License
ISC
