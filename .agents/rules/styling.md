# Styling & Design Rules (Tailwind CSS)

## Design Philosophy
- **Dark-mode first** — deep navy backgrounds, light text, glowing accents
- **Glassmorphism** — semi-transparent cards with backdrop-blur
- **Micro-animations** — every interaction gives visual feedback
- **Premium feel** — this should look like a $10K design, not a hackathon project

## Color Palette

### Primary
| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#0a0f1e` | Page background |
| `--bg-surface` | `rgba(255,255,255,0.05)` | Card backgrounds |
| `--bg-surface-hover` | `rgba(255,255,255,0.08)` | Card hover state |
| `--accent` | `#3b82f6` | Primary buttons, links, highlights |
| `--accent-glow` | `rgba(59,130,246,0.3)` | Button glow, focus rings |

### Semantic (Attention Score)
| Score | Color | Hex | Usage |
|-------|-------|-----|-------|
| 1–3 | Green | `#22c55e` | "Looks Standard" badge |
| 4–6 | Amber | `#f59e0b` | "Worth Reviewing" badge |
| 7–10 | Red | `#ef4444` | "Needs Attention" badge |

### Text
| Token | Value | Usage |
|-------|-------|-------|
| `--text-primary` | `#f8fafc` | Headings, important text |
| `--text-secondary` | `rgba(248,250,252,0.7)` | Body text |
| `--text-muted` | `rgba(248,250,252,0.4)` | Helper text, timestamps |

## Typography
- **Font**: Inter (Google Fonts) — clean, modern, excellent readability
- **Headings**: `font-bold`, use `text-4xl` to `text-6xl` for hero, `text-2xl` for sections
- **Body**: `text-base` (16px), `leading-relaxed` for long text
- **Code/clauses**: `font-mono`, used for section numbers and contract excerpts

## Component Styling Patterns

### Cards (Glassmorphism)
```css
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
}
```

### Buttons
- Primary: filled with `--accent`, white text, glow on hover
- Secondary: transparent, border, accent text
- All buttons have `transition-all duration-200` and hover scale (`hover:scale-105`)
- Disabled state: `opacity-50 cursor-not-allowed`, no hover effects

### Input Fields
- Dark background (`bg-white/5`), subtle border (`border-white/10`)
- Focus: accent border + glow ring (`ring-2 ring-blue-500/30`)
- Placeholder text in muted color

## Animation Rules

### Entrance Animations
- Score badge: `scale(0) → scale(1)` with elastic easing + glow pulse
- Summary: word-by-word reveal with typing cursor
- Key points: staggered fade-in (100ms delay between each)
- Red flags: slide-in from right with slight bounce

### Micro-Interactions
- All buttons: `hover:scale-105 active:scale-95` (200ms transition)
- Cards: `hover:border-white/20` subtle border brighten
- Navigation links: underline slide-in on hover
- Loading: skeleton pulse animation on all content areas

### Performance Rules
- Use CSS transitions/animations only — no JS animation libraries at MVP
- Use `will-change` sparingly — only on elements that actually animate
- Prefer `transform` and `opacity` for animations (GPU-accelerated)
- Duration: 150–300ms for micro-interactions, 400–600ms for entrances

## Responsive Design
- **Mobile-first** — design for 375px, scale up
- Breakpoints: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px)
- Max content width: `max-w-5xl mx-auto` for pages
- Analyzer textarea: full-width on mobile, 2/3 on desktop
- Pricing cards: stack on mobile, side-by-side on `md`+
- Navbar: hamburger menu on mobile (< `md`)

## Never Do
- ❌ Inline styles — always use Tailwind classes
- ❌ `!important` — fix specificity properly
- ❌ Generic colors (`red-500`, `blue-500`) without semantic meaning
- ❌ Default browser fonts — always load Inter
- ❌ Placeholder images — generate real ones or use CSS patterns
- ❌ Unstyled scrollbars — style or hide where appropriate
