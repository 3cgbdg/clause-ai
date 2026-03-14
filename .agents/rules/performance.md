# Performance & Optimization Rules

## Backend Performance

### API Response Times
| Endpoint | Target | Strategy |
|----------|--------|----------|
| `GET /api/health` | < 50ms | No I/O, instant |
| `POST /api/analyze` | < 2s to first SSE event | Streaming, fast model |
| `GET /api/history` | < 200ms | Indexed queries, pagination |

### OpenAI Optimization
- Use `gpt-4o-mini` — fastest and cheapest model that's good enough for contract analysis
- Set `max_tokens` to cap response size (~800 tokens keeps analysis concise)
- Set `temperature: 0.1` — contracts need precision, not creativity
- Stream: `stream=True` — first token arrives in ~500ms vs. 5–10s for full response
- Set timeout: **30 seconds** — fail fast, show error, let user retry

### PDF Processing
- `pdfplumber` is synchronous — run in a thread pool: `asyncio.to_thread(extract_text, file)`
- Don't process PDFs larger than **10MB** — reject with a clear error
- Limit to **50 pages** — anything longer is probably not what users want to analyze at once

### Caching (Month 2+)
- Cache AI prompts (system prompt never changes, no need to send processing instructions on every call)
- Consider caching analysis results for identical contract text (SHA256 hash as key)
- Don't over-cache at MVP — premature optimization kills velocity

## Frontend Performance

### Bundle Size
- Tailwind CSS v4 purges unused classes automatically — no config needed
- Code-split pages with `React.lazy()`:
```tsx
const Landing = lazy(() => import('./pages/Landing'));
const Analyzer = lazy(() => import('./pages/Analyzer'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
```
- Wrap in `<Suspense fallback={<PageSkeleton />}>` for loading states
- Don't import heavy libraries at top level — lazy load when needed

### Rendering
- **Avoid unnecessary re-renders**:
  - Use `React.memo()` on components that receive stable props (Navbar, Footer)
  - Use `useMemo()` for expensive computations (formatting large text)
  - Use `useCallback()` for event handlers passed to child components
- **Don't overuse** — memo everything = worse performance. Only optimize when profiler shows a problem.

### Images & Assets
- Use WebP format for all images
- Lazy load below-the-fold images: `loading="lazy"`
- Inline SVG icons (no icon font libraries at MVP)
- Preload the Inter font:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" as="style" />
```

### SSE Stream Performance
- Use `TextDecoderStream` for efficient chunk processing
- Don't re-parse the entire accumulated text on every chunk — append only
- Use `requestAnimationFrame` batching if updates come faster than 60fps (unlikely with AI streaming, but good practice)
- Clean up stream on component unmount — cancel `AbortController`

```typescript
// ✅ GOOD — cancellable stream
const controller = new AbortController();
const response = await fetch('/api/analyze', {
  method: 'POST',
  signal: controller.signal,
  body: JSON.stringify({ text }),
});

// On unmount:
controller.abort();
```

## Perceived Performance (UX Tricks)

### Skeleton Loading
- Show skeleton UI immediately on "Analyze" click — before the first byte arrives
- Skeleton matches the shape of the real result (score circle, text lines, card outlines)
- Pulse animation (`animate-pulse`) on all skeleton elements

### Progressive Rendering
```
0.0s → Click "Analyze"     → Show skeleton
0.3s → Score arrives        → Animate score badge in, replace skeleton
1.0s → Summary streaming    → Words appear one by one
2.5s → Key points arrive    → Cards animate in with stagger
4.0s → Red flags arrive     → Slide in with warning styling
5.0s → Done event           → Show "Share" + "Analyze another" buttons
```
- User sees meaningful content in **< 1 second** even if full analysis takes 10

### Optimistic UI
- "Analyze" button shows spinner immediately (don't wait for server ACK)
- Textarea dims and becomes read-only during analysis
- Scroll smoothly to results section as first content appears

## Web Vitals Targets
| Metric | Target | How |
|--------|--------|-----|
| **LCP** (Largest Contentful Paint) | < 2.5s | Preload font, no blocking JS |
| **FID** (First Input Delay) | < 100ms | No heavy JS on load |
| **CLS** (Cumulative Layout Shift) | < 0.1 | Fixed-size skeleton placeholders |
| **TTFB** (Time to First Byte) | < 200ms | Vercel edge, no SSR needed |
