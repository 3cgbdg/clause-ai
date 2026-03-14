# UX & Product Rules

## The One Golden Rule
> Show value before asking for anything. The first analysis is free, no signup, no credit card.

## User Journey
```
1. Landing page → sees headline + demo → clicks "Analyze your contract"
2. Analyzer page → pastes text or uploads PDF → clicks "Analyze"
3. Results appear (streaming) → sees score, summary, red flags
4. "Want to save this?" → signup prompt (AFTER they've seen value)
5. Free tier: 3/month → hits limit → upgrade to Pro $7/month
```
- Step 3 is the **magic moment** — this is where conversion happens
- Never interrupt before step 3. No modals, no popups, no cookie banners blocking the UI.

## Results Page Design

### Visual Hierarchy
```
┌─────────────────────────────────────┐
│  [ 7 ]  Needs Attention    Lease   │  ← Score badge (BIG, colored, first thing)
│                                     │
│  Summary                           │  ← 2-3 sentences, streamed in
│  "This lease contains several..."  │
│                                     │
│  Key Points                        │  ← Max 5, numbered, clean cards
│  01  Monthly rent is €1,200...     │
│  02  Lease term is 12 months...    │
│  03  ...                           │
│                                     │
│  ⚠ Red Flags                       │  ← Max 3, red accent, warning icon
│  🔴 Auto-renewal clause...        │
│  🟡 Broad non-compete...          │
│                                     │
│  ┌─────────┐  ┌──────────────┐     │
│  │  Share  │  │ Analyze New  │     │  ← Action buttons
│  └─────────┘  └──────────────┘     │
│                                     │
│  ⚖ Not legal advice. Consult...   │  ← Disclaimer (always visible)
└─────────────────────────────────────┘
```

### Score Badge
- **Dominant visual element** — the user's eye goes here first
- Circle, large number, background color matching score range
- Animated entrance (scale-in + glow pulse)
- Screenshot-worthy — people will share this

### Streaming Results
- Skeleton loaders visible the instant user clicks Analyze
- Score = first thing that appears (~1-2 seconds)
- Summary = streams word-by-word
- Key points = appear one-by-one with stagger
- Red flags = last to appear, with slide-in animation
- **Never** wait for full completion — show what you have

## Attention Score (Not "Risk Score")
| Range | Label | Color | Meaning |
|-------|-------|-------|---------|
| 1–3 | Looks Standard | 🟢 Green | Typical contract, nothing unusual |
| 4–6 | Worth Reviewing | 🟡 Amber | Some clauses deserve careful reading |
| 7–10 | Needs Attention | 🔴 Red | Unusual or potentially unfavorable terms |

- **Never** say "High Risk" — that's a legal judgment, not an informational summary
- Score invites action ("review this"), not panic ("don't sign")

## Copywriting
- **Headlines**: active, specific, benefit-driven
  - ✅ "Understand any contract in 10 seconds"
  - ❌ "AI-powered contract analysis tool"
- **Buttons**: action verbs
  - ✅ "Analyze My Contract"
  - ❌ "Submit" / "Process"
- **Error messages**: helpful and human
  - ✅ "This PDF appears to be scanned. Try pasting the text instead."
  - ❌ "Error: PDF extraction failed"
- **Empty states**: guide next action
  - ✅ "No analyses yet. Paste your first contract to get started."
  - ❌ "No data found."

## Accessibility (a11y)
- All interactive elements have unique `id` attributes
- All images have `alt` text
- All buttons have visible labels (no icon-only buttons without `aria-label`)
- Color is never the **only** way to convey info — score has both color AND label
- Focus visible on all interactive elements (don't remove outline)
- Semantic HTML: `<main>`, `<nav>`, `<header>`, `<footer>`, `<section>`

## Error UX
| Error | What user sees | What happens |
|-------|---------------|-------------|
| Empty input | "Paste a contract to get started" | Button stays disabled |
| Input too short | "This seems too short. Paste the full contract text." | Inline message |
| AI timeout | "Analysis is taking longer than expected. Trying again..." | Auto-retry once |
| AI failure | "We couldn't analyze this contract. Please try again." | Show retry button |
| PDF too large | "This file is over 10MB. Try a shorter document." | File rejected |
| Rate limit (free) | "You've used your 3 free analyses this month. Upgrade to Pro for unlimited." | Show pricing CTA |

## Mobile UX
- Analyzer = full-screen textarea, thumb-friendly Analyze button
- Results = single column, full-width cards
- Score badge = large enough to read at arm's length
- Share button = prominent, native share sheet on mobile
- Navigation = hamburger menu with slide-in panel
