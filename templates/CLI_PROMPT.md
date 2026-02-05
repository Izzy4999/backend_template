# Prompt: CLI to set up the three auth modes

Use the following prompt when building the CLI that configures auth mode for this backend template.

---

## Prompt (copy below)

Build a CLI for a Node/Express backend template that lets the user choose one of three auth modes when bootstrapping a project. The CLI runs from the template repo root (or from a copy of it).

**Flags and modes**

- **`-s`** or **`--auth-mode=single`** → **single** mode  
- **`-m`** or **`--auth-mode=multi`** → **multi** mode  
- **`--auth-mode=env`** or **no flag** (default) → **env** mode  

**Behavior by mode**

1. **env mode**  
   - Leave all source files unchanged.  
   - Optionally ensure `AUTH_SESSION_MODE` exists in `.env.example` (and `.env` if present), e.g. set to `single` or `multi` as desired, or leave as-is.  
   - Auth behavior is then controlled at runtime via `AUTH_SESSION_MODE` in the environment.

2. **single mode** (when user passes `-s` or `--auth-mode=single`)  
   - Copy template files into `src/` so auth is fixed to single-session (one refresh token per user; logout logs out everywhere).  
   - Copy these files (overwrite existing):  
     - `templates/single/utils/tokenStore.ts` → `src/utils/tokenStore.ts`  
     - `templates/single/utils/env.ts` → `src/utils/env.ts`  
     - `templates/single/controllers/auth.controller.ts` → `src/controllers/auth.controller.ts`  
   - Do not add or require `AUTH_SESSION_MODE` in env for this mode.

3. **multi mode** (when user passes `-m` or `--auth-mode=multi`)  
   - Copy template files into `src/` so auth is fixed to multi-session (multiple refresh tokens; logout only revokes the token sent).  
   - Copy these files (overwrite existing):  
     - `templates/multi/utils/tokenStore.ts` → `src/utils/tokenStore.ts`  
     - `templates/multi/utils/env.ts` → `src/utils/env.ts`  
     - `templates/multi/controllers/auth.controller.ts` → `src/controllers/auth.controller.ts`  
   - Do not add or require `AUTH_SESSION_MODE` in env for this mode.

**Summary**

- **env**: no file copies; auth switched by `AUTH_SESSION_MODE` in `.env`.  
- **single**: overwrite `src/utils/tokenStore.ts`, `src/utils/env.ts`, `src/controllers/auth.controller.ts` with `templates/single/` versions.  
- **multi**: overwrite the same three paths with `templates/multi/` versions.  

The CLI should resolve paths relative to the current working directory (assumed to be the template project root). Print a short confirmation of which mode was applied (e.g. "Auth mode set to single." or "Auth mode set to env (use AUTH_SESSION_MODE in .env).").
