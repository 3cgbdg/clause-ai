# Code Quality & Formatting Rules

## Linting

### Python — Ruff
- **Config**: `backend/pyproject.toml`
- **Line length**: 100 characters
- **Target**: Python 3.11
- **Rule sets**:
  - `E` — pycodestyle errors
  - `F` — pyflakes (unused imports, undefined names)
  - `I` — isort (import sorting)
  - `UP` — pyupgrade (modern Python syntax)
  - `B` — flake8-bugbear (common bugs)
  - `SIM` — flake8-simplify (simplifiable code)

```toml
# pyproject.toml
[tool.ruff]
line-length = 100
target-version = "py311"

[tool.ruff.lint]
select = ["E", "F", "I", "UP", "B", "SIM"]
ignore = ["E501"]  # line length handled by formatter

[tool.ruff.format]
quote-style = "double"
```

- Run lint: `ruff check backend/`
- Run format: `ruff format backend/`
- Fix auto-fixable: `ruff check --fix backend/`

### TypeScript/JSX — ESLint v9
- **Config**: `frontend/eslint.config.js` (flat config format)
- **Plugins**: `@eslint/js`, `eslint-plugin-react`, `eslint-plugin-react-hooks`
- **Key rules**:
  - `react/react-in-jsx-scope: off` (not needed with Vite/modern React)
  - `react-hooks/rules-of-hooks: error`
  - `react-hooks/exhaustive-deps: warn`
  - `no-unused-vars: warn` (with `argsIgnorePattern: "^_"`)
  - `no-console: warn` (clean up before production)

- Run lint: `npm run lint`
- Fix auto-fixable: `npm run lint:fix`

## Formatting

### JavaScript/TypeScript — Prettier
```json
// .prettierrc
{
  "singleQuote": true,
  "semi": true,
  "trailingComma": "es5",
  "tabWidth": 2,
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```
- Format: `npm run format`
- Check (CI): `npm run format:check`
- Prettier runs **before** ESLint in lint-staged (format first, then lint)

### Python — Ruff Formatter
- Ruff's built-in formatter replaces Black
- Double quotes, consistent indentation, trailing commas
- Runs via `ruff format backend/`

## Git Hooks (Husky + lint-staged)

### Pre-commit Hook
```bash
# .husky/pre-commit
npx lint-staged
```

### lint-staged Config
```json
// .lintstagedrc.json
{
  "frontend/src/**/*.{ts,tsx}": [
    "prettier --write",
    "eslint --fix"
  ],
  "backend/**/*.py": [
    "ruff format",
    "ruff check --fix"
  ]
}
```
- Only staged files are processed — commits stay fast (< 3 seconds)
- If lint fails, the commit is **blocked** — fix the issues first

## Clean Code Principles

### Naming
- **Variables**: describe what it holds — `contractText` not `data`, `analysisResult` not `res`
- **Functions**: describe what it does — `extractTextFromPdf()` not `process()`
- **Booleans**: use `is/has/can` prefix — `isAnalyzing`, `hasRedFlags`, `canDownload`
- **Constants**: `UPPER_SNAKE_CASE` — `MAX_CONTRACT_LENGTH`, `FREE_TIER_LIMIT`

### Functions
- Max **30 lines** per function — if longer, extract helpers
- Max **4 parameters** — if more, use an options object or a Pydantic model
- Single responsibility — one function does one thing
- Pure functions where possible — same input → same output, no side effects
- Early returns for guard clauses — reduce nesting

```python
# ✅ GOOD — early return, clear name, focused
async def validate_contract_text(text: str) -> str:
    if not text or not text.strip():
        raise ValueError("Contract text cannot be empty")
    
    cleaned = text.strip()
    if len(cleaned) > MAX_CONTRACT_LENGTH:
        raise ValueError(f"Text exceeds {MAX_CONTRACT_LENGTH} character limit")
    
    return cleaned

# ❌ BAD — nested, vague name, does too much
async def process(data):
    if data:
        if data.strip():
            if len(data) < 50000:
                result = await call_ai(data)
                save_to_db(result)
                return result
```

### Error Handling
- Handle errors at **boundaries** (API routes, hook entry points)
- Use specific exception types, not bare `except:`
- Errors are part of the UX — show helpful messages, not "Something went wrong"
- Log with context: `logger.error("AI analysis failed", extra={"text_length": len(text)})`

### Comments
- Code should be self-documenting — comments explain **why**, not **what**
- Delete commented-out code — Git has history
- TODO comments must have a name and date: `# TODO(yourname, 2026-03-14): add retry logic`

### DRY vs. WET
- **Don't repeat yourself** for logic — extract shared functions
- **Write Everything Twice** for components — don't prematurely abstract
- If you've copy-pasted the same code 3 times, extract it. Twice is fine.

## Code Review Checklist
Before merging any code, verify:
- [ ] TypeScript `strict` passes with no errors or `any` usage
- [ ] ESLint + Prettier produce no warnings
- [ ] Ruff produces no warnings
- [ ] New features have corresponding tests
- [ ] No `console.log` left in production code
- [ ] No hardcoded secrets, URLs, or API keys
- [ ] Error states handled in both UI and API
- [ ] Mobile responsive verified
