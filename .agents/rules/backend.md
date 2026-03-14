# Backend Rules (Python / FastAPI)

## Python Standards
- **Version**: Python 3.11+
- **Type hints** on every function signature — no exceptions
- **Docstrings** on all public functions (one-liner is fine for simple ones)
- Use `async def` for anything that does I/O (API calls, DB queries, file reads)
- Use `from __future__ import annotations` at the top of every file

## FastAPI Patterns

### Route Handlers
```python
# ✅ GOOD — thin router, delegates to service
@router.post("/analyze")
async def analyze_contract(request: AnalyzeRequest):
    return StreamingResponse(
        ai_service.analyze_stream(request.text),
        media_type="text/event-stream"
    )

# ❌ BAD — business logic in router
@router.post("/analyze")
async def analyze_contract(request: AnalyzeRequest):
    client = openai.AsyncClient()
    response = await client.chat.completions.create(...)
    # 50 more lines of logic
```

### Pydantic Models
- Every request body has a Pydantic model — no raw dicts
- Every response has a Pydantic model — enforce output shape
- Use `Field(...)` with descriptions for API docs
- Validate at the boundary, trust internally

```python
class AnalyzeRequest(BaseModel):
    text: str = Field(..., min_length=50, max_length=50000,
                      description="Contract text to analyze")
```

### Error Handling
- Use `HTTPException` for expected errors (validation, not found)
- Use try/except in services, convert to clean error events for SSE
- **Never** expose stack traces, internal paths, or API keys to clients
- Log errors server-side with `logging` — structured JSON in production

### SSE Streaming
- Use `StreamingResponse` with `text/event-stream`
- Each event: `data: {json}\n\n`
- Send sections in order: `score` → `summary` → `key_points` → `red_flags` → `done`
- On error mid-stream: send `{"section": "error", "data": {"message": "..."}}`
- Always send a `done` event — the frontend relies on it to exit streaming state

## API Design

### URL Conventions
- All routes under `/api/` prefix
- RESTful nouns: `/api/analyze`, `/api/history`, `/api/health`
- No trailing slashes

### Response Conventions
- `200` — success
- `400` — bad request (input too long, invalid format)
- `422` — validation error (Pydantic catches automatically)
- `429` — rate limited (free tier exceeded)
- `500` — internal error (always return a clean JSON body, never raw traceback)

### CORS
- Allow only the frontend origin (`FRONTEND_URL` from config)
- Allow credentials for auth cookies
- Explicit allowed methods and headers — never use `*` in production

## File Organization
```
app/
├── main.py         → App creation, middleware, router mounting
├── config.py       → Settings class, env vars
├── routers/        → One file per resource (analyze.py, health.py)
├── services/       → One file per domain (ai_service.py, pdf_service.py)
├── models/         → Pydantic schemas
└── prompts/        → AI prompt templates
```
- One router per file, one service per file
- Routers import services, services import models
- **Never** circular imports — if you need one, your architecture is wrong
