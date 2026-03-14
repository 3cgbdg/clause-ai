# Security Rules

## Secrets Management
- **Never** commit API keys, database credentials, or Stripe secrets
- All secrets in `.env` files, `.env` in `.gitignore`
- `.env.example` contains variable names with placeholder values only
- In production: use platform's secret management (Fly.io secrets, Vercel env vars)

## Input Validation

### Contract Text
- Max length: **50,000 characters** — reject longer with 400 error
- Min length: **50 characters** — too short to be a real contract
- Strip HTML/script tags before processing — prevent XSS via stored analysis
- Validate on both frontend (UX) and backend (security)

### File Upload
- Accept only: `.pdf` (MIME type `application/pdf`)
- Max file size: **10MB**
- Validate MIME type server-side — don't trust the content-type header alone
- Process in an isolated temp directory, clean up after extraction

### API Inputs
- All inputs validated via Pydantic models — never access raw request body
- Reject unexpected fields (Pydantic `model_config = ConfigDict(extra="forbid")`)
- Sanitize all user-generated content before storing in DB

## Authentication & Authorization

### Clerk Auth
- Verify JWT tokens on every authenticated endpoint
- Extract `user_id` from token — never trust a user_id sent in the request body
- Session tokens expire with reasonable TTL — Clerk handles this

### Rate Limiting
- Free tier: **3 analyses per month** (tracked in `usage` table)
- Unauthenticated: **1 analysis per session** (client-side, validated server-side by IP)
- Apply rate limiting at the **router level** before any processing
- Return `429 Too Many Requests` with a clear message and upgrade CTA

## CORS
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],   # explicit origin, never "*"
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Authorization"],
)
```
- **Never** use `allow_origins=["*"]` in production
- Restrict methods to what's actually used
- Allow credentials for auth cookies

## Data Protection

### Contract Text (PII Risk)
- Contracts contain personal data: names, addresses, salaries, SSNs
- **Never** log contract text to console or file logging
- **Never** include contract text in error reports
- Store in DB encrypted at rest (Supabase provides this)
- Add data retention policy (month 3+): auto-delete analyses older than 12 months for free users

### User Data
- Store only what's needed: email, plan, usage count
- Clerk handles password hashing — never store passwords yourself
- Stripe handles payment data — never store card numbers

## HTTP Security Headers
Add via middleware or reverse proxy:
```python
# Response headers
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 0  # modern browsers use CSP instead
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'; script-src 'self'
```

## Dependency Security
- Run `npm audit` regularly
- Pin major versions — don't auto-upgrade across majors
- Review `pip-audit` for Python dependencies
- Keep dependencies minimal — fewer deps = smaller attack surface

## Legal Disclaimer
- **Every** analysis result must display the disclaimer
- Use the `<Disclaimer />` component — never manually type the text
- Text: *"ClauseAI provides informational summaries only. This is not legal advice. For legally binding decisions, consult a qualified attorney."*
- Include in Terms of Service — users agree to this on signup
- Consider a brief disclaimer checkbox before first analysis
