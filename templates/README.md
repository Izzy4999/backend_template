# Auth templates (for CLI / scaffolder)

Three ways to pick auth behavior when bootstrapping from this template:

| Option | CLI flag (example) | What to use | Difference |
|--------|---------------------|-------------|-------------|
| **env** | `--auth-mode=env` or default | Project **as-is** (`src/`) | Auth behavior is switched by `AUTH_SESSION_MODE` in `.env` (single vs multi). |
| **single** | `-s` or `--auth-mode=single` | Copy **`templates/single/`** into `src/` | Auth is fixed to single session (one refresh token per user; logout logs out everywhere). No `AUTH_SESSION_MODE` in env. |
| **multi** | `-m` or `--auth-mode=multi` | Copy **`templates/multi/`** into `src/` | Auth is fixed to multi session (multiple refresh tokens; logout only revokes the one sent). No `AUTH_SESSION_MODE` in env. |

**Copy rules for single/multi:**

- `templates/single/utils/tokenStore.ts` → `src/utils/tokenStore.ts`
- `templates/single/utils/env.ts` → `src/utils/env.ts`
- `templates/single/controllers/auth.controller.ts` → `src/controllers/auth.controller.ts`

(Same paths for `templates/multi/`.)

For **env**, do nothing: keep existing `src/` and set `AUTH_SESSION_MODE=single` or `AUTH_SESSION_MODE=multi` in `.env` / `.env.example` as needed.
