---
trigger: always_on
---

# Architecture Rules

## Project Identity
- **Product**: ClauseAI — contract analysis in plain English
- **Backend**: FastAPI (Python 3.11+)
- **Frontend**: React 18 + Vite + Tailwind + TypeScript
- **Database**: Supabase (Postgres)
- **AI**: OpenAI API (gpt-4o-mini)

## Monorepo Layout
```
backend/       → Python API (independently deployable)
frontend/      → React SPA (independently deployable)
.agents/       → Project rules and workflows
.husky/        → Git hooks
```
- Backend and frontend are **fully independent** — never import across boundaries
- Communication is **only** via HTTP/SSE over `/api/*` prefix
- Each side has its own `.env`, `.gitignore`, dependency manifest

## Layered Architecture (Backend)
```
Routers  →  handle HTTP, validate input, return responses
Services →  business logic, AI calls, PDF parsing
Models   →  Pydantic schemas, type definitions
Prompts  →  AI prompt templates (separated from logic)
Config   →  environment variables via pydantic-settings
```
- **Never** put business logic in routers — routers are thin wrappers
- **Never** put HTTP concerns in services — services don't know about FastAPI
- **Never** hardcode config — everything flows through `config.py`

## Layered Architecture (Frontend)
```
Pages       →  route-level components, compose other components
Components  →  reusable UI building blocks, no API calls
Hooks       →  business logic, state management, API integration
Lib         →  utility functions, API client, helpers
```
- Components are **pure UI** — they receive props, render output, emit events
- Hooks own all side effects: API calls, SSE streams, localStorage
- Pages compose components + hooks into a working screen
- `lib/api.ts` is the **only file** that talks to the backend

## Data Flow (Core Analysis)
```
User input → api.ts → POST /api/analyze → Router → AI Service → OpenAI (stream)
                                                         ↓
User sees results ← useAnalyze hook ← SSE events ← StreamingResponse
```
- AI returns sections in priority order: `score → summary → key_points → red_flags`
- Frontend renders each section the instant it arrives
- Perceived speed target: **< 3 seconds** to first content

## Dependency Direction
```
Pages → Components → (nothing)
Pages → Hooks → Lib
Hooks → Lib → (nothing)
```
- Components **never** import hooks or lib directly
- Hooks **never** import components
- Lib **never** imports anything from the app — it's pure utility

## Environment Boundaries
- `.env` files are **never** committed — only `.env.example`
- Frontend env vars must start with `VITE_` (Vite requirement)
- Backend reads env via `pydantic-settings` — never `os.getenv()` directly
