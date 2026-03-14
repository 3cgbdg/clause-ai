# Git & Workflow Rules

## Branch Strategy
```
main        → production code, always deployable
  └── dev   → active development, merged to main when stable
       ├── feature/analyzer-page
       ├── feature/pdf-upload
       ├── fix/sse-timeout
       └── refactor/api-cleanup
```

- `main` is **protected** — no direct pushes, merge via PR only (once team > 1)
- `dev` is the default working branch
- Feature branches: `feature/<name>`, `fix/<name>`, `refactor/<name>`, `test/<name>`
- Keep branches short-lived — merge within **1–2 days**
- Delete branches after merging

## Commit Messages
```
type: short imperative description (max 72 chars)
```

### Types
| Type | When |
|------|------|
| `feat` | New feature or functionality |
| `fix` | Bug fix |
| `refactor` | Code restructure, no behavior change |
| `style` | Formatting, whitespace, semicolons (no logic change) |
| `test` | Adding or updating tests |
| `docs` | Documentation, README, comments |
| `chore` | Build config, deps, tooling |
| `perf` | Performance improvement |

### Examples
```
feat: add SSE streaming to analyze endpoint
fix: handle empty PDF extraction gracefully
refactor: extract AI prompt into separate module
test: add ScoreBadge rendering tests
chore: configure Husky pre-commit hooks
style: format backend with Ruff
docs: add API endpoint documentation
perf: lazy load Analyzer page component
```

### Rules
- Use **imperative mood**: "add" not "added" or "adds"
- No period at the end
- First word lowercase after the type
- If a commit needs a paragraph of explanation, the commit is too big — split it

## PR Conventions (When Team > 1)
- Title follows commit message format
- Description: **What** changed, **Why**, **How to test**
- Link to related issue if one exists
- Self-review before requesting review

## .gitignore Essentials
```
# Environment
.env
.env.local
.env.production

# Dependencies
node_modules/
__pycache__/
*.pyc
.venv/

# Build
dist/
build/
*.egg-info/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Test
coverage/
.pytest_cache/
```

## Release Process (Month 2+)
1. All tests pass on `dev`
2. Version bump in `package.json` and/or `pyproject.toml`
3. Merge `dev` → `main`
4. Tag: `git tag v0.1.0`
5. Auto-deploy via Vercel (frontend) and Fly.io (backend)
