# Testing Rules

## Philosophy
- Test **behavior**, not implementation
- Tests must run **without** external services (no real OpenAI calls, no real DB)
- Tests are **documentation** — a new developer should understand the feature by reading its tests
- Aim for **confidence**, not coverage percentage — test the critical paths

## Backend Testing (pytest + httpx)

### Setup
- Tool: `pytest` + `pytest-asyncio` + `httpx`
- Test directory: `backend/tests/`
- Config in `pyproject.toml` under `[tool.pytest.ini_options]`
- Run: `cd backend && python -m pytest -v`

### Structure
```python
# test_analyze.py

import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac

@pytest.fixture
def sample_contract():
    return "This lease agreement is entered into by..."

class TestAnalyzeEndpoint:
    """Tests for POST /api/analyze"""

    async def test_valid_text_returns_sse_stream(self, client, sample_contract):
        ...

    async def test_empty_text_returns_422(self, client):
        ...

    async def test_text_too_long_returns_400(self, client):
        ...
```

### What to Test (Backend)
| Category | Test | Priority |
|----------|------|----------|
| **Analyze endpoint** | Valid text → SSE stream with all sections | Critical |
| **Analyze endpoint** | Empty text → 422 validation error | Critical |
| **Analyze endpoint** | Text > 50K chars → 400 error | High |
| **Analyze endpoint** | OpenAI failure → graceful error event | High |
| **PDF service** | Digital PDF → extracted text | Critical |
| **PDF service** | Scanned/empty PDF → clear error message | High |
| **Health** | GET /api/health → 200 with status ok | Low |
| **Rate limiting** | 4th request from same source → 429 | Medium |

### Mocking
- **Always mock OpenAI** — use `unittest.mock.patch` or `pytest-mock`
- Mock returns a predictable JSON structure matching the real API
- For streaming tests, mock the async generator that yields SSE chunks
- Never mock Python builtins or Pydantic — test those at full fidelity

```python
@pytest.fixture
def mock_openai(mocker):
    """Returns a mock that yields predetermined analysis results."""
    mock = mocker.patch("app.services.ai_service.client.chat.completions.create")
    mock.return_value = MockStreamResponse(chunks=[...])
    return mock
```

## Frontend Testing (Vitest + React Testing Library)

### Setup
- Tool: `vitest` + `@testing-library/react` + `@testing-library/jest-dom` + `jsdom`
- Test directory: `frontend/src/__tests__/`
- Config in `vite.config.ts` under `test` block
- Run: `cd frontend && npm test` (single run) or `npm run test:watch` (watch mode)

### Vitest Config
```typescript
// vite.config.ts
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/__tests__/setup.ts',
    css: false, // don't process CSS in tests
  }
});
```

### Component Tests
```tsx
// ScoreBadge.test.tsx
import { render, screen } from '@testing-library/react';
import ScoreBadge from '../components/ScoreBadge';

describe('ScoreBadge', () => {
  it('renders green with "Looks Standard" for score 1-3', () => {
    render(<ScoreBadge score={2} label="Looks Standard" />);
    expect(screen.getByText('Looks Standard')).toBeInTheDocument();
    expect(screen.getByTestId('score-badge')).toHaveClass('bg-green-500');
  });

  it('renders red with "Needs Attention" for score 7-10', () => {
    render(<ScoreBadge score={8} label="Needs Attention" />);
    expect(screen.getByText('Needs Attention')).toBeInTheDocument();
  });
});
```

### What to Test (Frontend)
| Category | Test | Priority |
|----------|------|----------|
| **ScoreBadge** | Correct color/label for each score range | Critical |
| **Analyzer** | Renders textarea and analyze button | Critical |
| **Analyzer** | Analyze button disabled when input empty | High |
| **useAnalyze** | State transitions: idle → analyzing → streaming → complete | Critical |
| **useAnalyze** | Error state on fetch failure | High |
| **RedFlagCard** | Renders clause, concern, severity | Medium |
| **FileUpload** | Shows filename after file selection | Medium |
| **Disclaimer** | Renders legal text | Low |
| **Navbar** | All navigation links present | Low |

### Hook Tests
```typescript
// useAnalyze.test.ts
import { renderHook, act } from '@testing-library/react';
import { useAnalyze } from '../hooks/useAnalyze';

describe('useAnalyze', () => {
  it('starts in idle status', () => {
    const { result } = renderHook(() => useAnalyze());
    expect(result.current.status).toBe('idle');
  });

  it('transitions to analyzing when analyze is called', async () => {
    const { result } = renderHook(() => useAnalyze());
    await act(() => result.current.analyze('contract text'));
    expect(result.current.status).toBe('analyzing');
  });
});
```

### Mocking API Calls
- Mock `fetch` globally in test setup or per-test
- For SSE streams: mock a `ReadableStream` that emits predetermined events
- **Never** hit the real backend in frontend tests

## Testing Anti-Patterns — Never Do
- ❌ Testing CSS class names as the primary assertion (brittle)
- ❌ Testing internal state directly instead of rendered output
- ❌ Writing tests after a bug without first reproducing the bug
- ❌ Snapshot tests for anything that changes frequently
- ❌ Tests that depend on execution order
- ❌ Tests that share mutable state between cases
- ❌ `sleep()` or hardcoded waits — use `waitFor` or proper async
