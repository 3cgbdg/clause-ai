# Database Rules (Supabase / PostgreSQL)

## Schema Design

### Tables
```sql
-- Users (synced from Clerk auth)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_id TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'pro')),
    stripe_customer_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Analyses (core data)
CREATE TABLE analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    contract_text TEXT NOT NULL,
    contract_type TEXT,
    attention_score INTEGER CHECK (attention_score BETWEEN 1 AND 10),
    score_label TEXT,
    summary TEXT,
    key_points JSONB DEFAULT '[]',
    red_flags JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Usage tracking (rate limiting)
CREATE TABLE usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    month TEXT NOT NULL,  -- '2026-03' format
    analysis_count INTEGER NOT NULL DEFAULT 0,
    UNIQUE(user_id, month)
);
```

### Naming Conventions
- Table names: **snake_case**, plural (`users`, `analyses`)
- Column names: **snake_case** (`created_at`, `attention_score`)
- Foreign keys: `<referenced_table_singular>_id` (`user_id`)
- Indexes: `idx_<table>_<column>` (`idx_analyses_user_id`)

## Indexing Strategy

### Always Index
```sql
-- Queries by user are the most common
CREATE INDEX idx_analyses_user_id ON analyses(user_id);
CREATE INDEX idx_analyses_created_at ON analyses(created_at DESC);
CREATE INDEX idx_usage_user_month ON usage(user_id, month);
CREATE INDEX idx_users_clerk_id ON users(clerk_id);
```

### When to Add an Index
- Any column used in `WHERE` clauses
- Any column used in `ORDER BY`
- Any foreign key column
- Composite indexes for queries that filter + sort on multiple columns

### When NOT to Index
- Columns rarely queried (like `contract_text`)
- Tables with < 1,000 rows (full scan is faster than index lookup)
- Columns with very low cardinality (like `plan` with only 2 values)

## Query Optimization

### Rules
- **Never `SELECT *`** — explicitly list needed columns
- **Always paginate** list queries — `LIMIT 20 OFFSET 0`
- **Use `EXPLAIN ANALYZE`** before deploying any new query pattern
- **Batch inserts** when possible — never loop single inserts
- **Avoid N+1 queries** — use JOINs or batch fetches

```python
# ✅ GOOD — specific columns, paginated
query = """
SELECT id, contract_type, attention_score, score_label, created_at
FROM analyses
WHERE user_id = $1
ORDER BY created_at DESC
LIMIT $2 OFFSET $3
"""

# ❌ BAD — select all, no limit
query = "SELECT * FROM analyses WHERE user_id = $1"
```

### Connection Management
- Use connection pooling (Supabase handles this automatically)
- Never hold a connection open during AI analysis (long-running)
- Pattern: open connection → read/write → close → do AI work → open → save result

## Data Integrity

### Constraints
- All foreign keys have `ON DELETE CASCADE` or `ON DELETE SET NULL` (decide per-relation)
- Use `CHECK` constraints for enums (`plan IN ('free', 'pro')`)
- Use `NOT NULL` on everything that must exist — don't rely on app code
- `UNIQUE` on natural keys (`clerk_id`, `(user_id, month)`)

### Timestamps
- Always `TIMESTAMPTZ` (with timezone), never `TIMESTAMP`
- `created_at` defaults to `now()`, never set by app code
- `updated_at` updated via trigger or app code on every modification

## Supabase-Specific Rules
- Use **Row Level Security (RLS)** — users can only read their own data
- Use Supabase client library for frontend reads (when needed)
- Use raw SQL or Supabase REST API for backend writes
- Keep Supabase Edge Functions for later — start with FastAPI handling everything

## Migrations
- One migration file per schema change
- Migrations are **forward-only** in production — never edit a deployed migration
- Test migrations on a staging database before production
- Name format: `001_create_users.sql`, `002_create_analyses.sql`

## Security
- **Never** store contract text longer than necessary — add retention policy later
- **Never** log contract text in production (PII risk)
- Row Level Security: users see only their own analyses
- Service role key (backend) bypasses RLS — guard it carefully
