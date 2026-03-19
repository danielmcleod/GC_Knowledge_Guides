# Genesys Cloud Knowledge Guides

Interactive educational knowledge guide for Genesys Cloud CX. **Not affiliated with Genesys** — for educational purposes only.

## Tech Stack

React 18 + Vite + Tailwind CSS. Deployed to GitHub Pages via `.github/workflows/deploy.yml`.

## Project Structure

- `src/App.jsx` — Landing page, guide routing, theme toggle. Contains `GUIDES` and `ADVANCED_GUIDES` arrays with metadata (id, title, topics, tier/section counts).
- `src/Footer.jsx`, `src/main.jsx`, `src/index.css` — Shared components and styles.
- `Genesys*Guide.jsx` (18 files, root) — Self-contained guide modules. Each is 80-113KB.
- `scripts/` — Feature indexing and release note scanning system (see below).

## Guide File Convention

Every `Genesys*Guide.jsx` follows this structure:

```
Lines   1-10   Imports (React, lucide-react icons, Footer)
Lines  10-40   Design tokens (C, THEME_VARS, MONO, SANS, TIER_COLORS, TIER_NAMES)
Lines  40-80   const SECTIONS = [{ tier, id, title }]  ← section metadata
Lines  80-500  Data arrays (const FEATURE_LIST = [...], const GLOSSARY = [...], etc.)
Lines 450-550  Shared UI components (CalloutBox, SectionHeading, Paragraph, SubHeading, etc.)
Lines 550+     Main React component with <section> blocks keyed by IDs
```

### Section Rendering Pattern

Sections are rendered as:
```jsx
<section ref={el => sectionRefs.current['t2s5'] = el} id="t2s5">
  <SectionHeading>Section Title</SectionHeading>
  <Paragraph>Content text...</Paragraph>
  <SubHeading>Sub-topic</SubHeading>
  <Paragraph>More content...</Paragraph>
  <CalloutBox type="tip">Helpful note</CalloutBox>
</section>
```

### Available UI Components

| Component | Usage |
|-----------|-------|
| `<SectionHeading>` | Top-level heading for each section |
| `<SubHeading>` | Sub-topic heading within a section |
| `<Paragraph>` | Body text (uses IBM Plex Sans, 15px, 1.8 line-height) |
| `<CalloutBox type="info\|warning\|tip\|critical">` | Highlighted callout box |
| `<ExpandableCard title="..." accent={C.color}>` | Collapsible detail card |
| `<InteractiveTable headers={[...]} rows={[...]} searchable>` | Data table with optional search |
| `<CodeBlock>` | Monospace code display |

## Content Style Rules

When editing guide content:
- **Writing style**: Clear, analogy-rich, practical. Explain concepts like teaching a colleague.
- **New features**: Add to the relevant data array (if one exists for that section) AND add narrative JSX (Paragraph, CalloutBox, etc.) in the section.
- **New capabilities**: Use `<CalloutBox type="info">` to highlight.
- **Deprecations**: Use `<CalloutBox type="warning">` to flag.
- **Never remove existing content** unless a feature is deprecated AND replaced.
- **Preserve exact code style**: same indentation, same component usage patterns, same data array shapes.

## Release Note Scanning System

### Scripts

| Command | Purpose |
|---------|---------|
| `npm run index:build` | Parse all guide JSX files → regenerate `scripts/feature-index.json` |
| `npm run index:scan` | Scan release notes since last scan, generate update plan |
| `npm run index:scan -- --all` | Scan all visible release notes |
| `npm run index:scan -- --weeks 4` | Scan last N weeks |
| `npm run index:scan -- --since 2026-03-01` | Scan since specific date |

### Key Files

- `scripts/feature-index.json` — Index of 18 guides, 323 sections with keyword mappings
- `scripts/keyword-mappings.json` — Maps guides/sections to release note categories and keywords
- `scripts/scan-state.json` — Tracks last scan date
- `scripts/reports/update-plan-{date}.md` — Generated update reports

### Release Notes URL Pattern

- Main page: `https://help.genesys.cloud/release-notes/genesys-cloud/`
- Detail pages: `https://help.genesys.cloud/release-notes/genesys-cloud/{month-day-year}/`
  - Example: `https://help.genesys.cloud/release-notes/genesys-cloud/march-16-2026/`

### Release Note Categories

Customer engagement, Data analytics and reporting, Employee productivity, Genesys Cloud, Open platform, Self service and automation, Workforce engagement, Account management.
