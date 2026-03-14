# Frontend Rules (React + TypeScript + Vite)

## TypeScript Standards
- **Strict mode** enabled in `tsconfig.json` — `"strict": true`
- No `any` — use `unknown` and narrow types, or define proper interfaces
- All component props have a dedicated `interface` (not inline types)
- All API responses have typed interfaces matching backend schemas
- Prefer `type` for unions/intersections, `interface` for object shapes

```typescript
// ✅ GOOD — explicit prop interface
interface ScoreBadgeProps {
  score: number;
  label: string;
}

export default function ScoreBadge({ score, label }: ScoreBadgeProps) { ... }

// ❌ BAD — inline or any
export default function ScoreBadge(props: any) { ... }
```

## Component Rules

### File Structure
- **One component per file** — filename matches component name
- Default export for components: `export default function Navbar()`
- Named export for hooks: `export function useAnalyze()`
- Named export for utilities: `export function formatScore()`

### Component Size
- If a component exceeds **100 lines**, break it into sub-components
- If a component has **more than 5 props**, consider splitting or using composition
- If a component renders **more than 3 conditional branches**, extract them

### Component Patterns
```tsx
// ✅ GOOD — small, focused, typed, destructured
interface KeyPointCardProps {
  point: string;
  index: number;
}

export default function KeyPointCard({ point, index }: KeyPointCardProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <span className="text-blue-400 font-mono text-sm">0{index + 1}</span>
      <p className="text-white/80 mt-1">{point}</p>
    </div>
  );
}
```

### Component Categories
| Type | Location | Characteristics |
|------|----------|----------------|
| **Page** | `src/pages/` | Route-level, composes components + hooks, full-screen layout |
| **Component** | `src/components/` | Reusable, receives props, no direct API calls |
| **Layout** | `src/components/` | Structural (Navbar, Footer, Sidebar) |

### Props Rules
- Props flow **down**, events flow **up**
- Never mutate props
- Use children for composition, not props for everything
- Boolean props default to `false`: `<Card highlighted />` not `<Card highlighted={true} />`

## Hooks Rules

### Custom Hook Conventions
- All custom hooks start with `use` prefix
- Hooks return objects (not arrays) when returning > 2 values
- Hooks own side effects — components never call `useEffect` for API data

```typescript
// ✅ GOOD — hook owns all logic
export function useAnalyze() {
  const [status, setStatus] = useState<AnalysisStatus>('idle');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  // ... all SSE logic here
  return { status, result, analyze, reset };
}

// ❌ BAD — logic scattered in component
function Analyzer() {
  const [status, setStatus] = useState('idle');
  useEffect(() => { /* 40 lines of SSE logic */ }, []);
}
```

### State Management
- Use React state + hooks for everything at MVP
- No Redux, Zustand, or other state libraries yet
- If state needs to be shared across 3+ unrelated components → add Context
- Auth state lives in `AuthContext` via `useAuth()` hook

## Import Order
1. React / React-related (`react`, `react-router-dom`)
2. Third-party libraries
3. Local components
4. Local hooks
5. Local lib/utils
6. Types/interfaces
7. CSS (only in entry point)

## File Naming
- Components: `PascalCase.tsx` — `ScoreBadge.tsx`, `RedFlagCard.tsx`
- Hooks: `camelCase.ts` — `useAnalyze.ts`, `useAuth.ts`
- Utilities: `camelCase.ts` — `api.ts`, `formatters.ts`
- Tests: `ComponentName.test.tsx` or `hookName.test.ts`
- Pages: `PascalCase.tsx` — `Landing.tsx`, `Analyzer.tsx`
