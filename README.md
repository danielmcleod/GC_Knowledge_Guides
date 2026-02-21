# Genesys Cloud CX — Interactive Knowledge Guides

A comprehensive, open-source collection of interactive knowledge guides for Genesys Cloud CX. Built as a single-page web application with tiered progressive disclosure, interactive diagrams, and dark/light theme support.

> **Disclaimer:** This project is for educational purposes only. It is not affiliated with, endorsed by, or connected to Genesys in any capacity. It is not intended for certification preparation and is not an official resource or replacement for any information or products provided by Genesys.

## Overview

This application provides 18 in-depth knowledge guides covering every major Genesys Cloud CX module. Each guide uses a tiered structure to progressively disclose information from foundational concepts through advanced technical details.

### Guide Modules

**Core Guides (15)**

| Guide | Tiers | Description |
|-------|-------|-------------|
| Inbound Routing & ACD | 3 | Queues, skills-based routing, Architect flows, priority handling |
| Outbound Dialing | 3 | Campaign engine, dialing modes, compliance, automation |
| Architect Flows | 3 | Flow builder, expressions, data actions, error handling, reusable modules |
| Digital & Omnichannel | 3 | Web messaging, SMS, WhatsApp, email routing, channel management |
| Bots & Conversational AI | 3 | Bot flows, NLU, Dialog Engine, third-party bots, knowledge workbench |
| Workforce Management | 3 | Forecasting, scheduling, adherence, intraday management |
| Analytics & Reporting | 3 | Dashboards, views, data exports, performance metrics |
| Quality Management | 3 | Evaluation forms, calibration, coaching, speech analytics |
| Security & Compliance | 3 | Roles, permissions, PCI, GDPR, audit logging |
| Telephony & Edge | 3 | Cloud Voice, BYOC, SIP trunking, Edge appliances, WebRTC |
| Knowledge Management | 2 | Knowledge bases, articles, search tuning, agent-facing knowledge |
| Journey Management | 2 | Customer journey tracking, predictive engagement, proactive offers |
| Workforce Engagement | 2 | Gamification, performance management, leaderboards, agent development |
| Directory & People | 2 | User management, groups, locations, presence, SCIM provisioning |
| Agent Desktop & Scripts | 3 | Agent UI, interaction handling, script designer, screen pops, agent assist |

**Advanced & Developer Guides (3)**

| Guide | Tiers | Description |
|-------|-------|-------------|
| Integrations & Data Actions | 2 | Integration framework, premium apps, data action contracts, OAuth, AppFoundry |
| Platform API & SDK | 2 | REST API patterns, notification service, client libraries, rate limits |
| CX as Code / DevOps | 2 | Terraform provider, Archy CLI, CI/CD pipelines, configuration management |

### Tier Structure

Each guide organizes content into progressive tiers:

- **Tier 1 — Foundations:** Core concepts, terminology, prerequisites, and getting started
- **Tier 2 — Configuration & Operations:** Hands-on setup, day-to-day management, and best practices
- **Tier 3 — Advanced & Technical:** Architecture deep dives, troubleshooting, edge cases, and optimization

### Features

- **Progressive disclosure** — Content organized into expandable tiers and sections so you can go as deep as needed
- **Interactive SVG diagrams** — Visual architecture and flow diagrams with hover tooltips
- **In-page search** — Search across section titles, glossary terms, metrics, methods, and more within each guide
- **Dark / Light theme** — Full theme toggle with design token system
- **Responsive layout** — Works on desktop and mobile viewports
- **Self-contained guides** — Each guide is a single JSX file with embedded data, components, and styling

## Tech Stack

- [React 18](https://react.dev/) — UI framework
- [Vite](https://vite.dev/) — Build tool and dev server
- [Tailwind CSS](https://tailwindcss.com/) — Utility-first CSS framework
- [Lucide React](https://lucide.dev/) — Icon library
- [JetBrains Mono](https://www.jetbrains.com/lp/mono/) — Monospace font for headings and technical content
- [IBM Plex Sans](https://www.ibm.com/plex/) — Body text font

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm (included with Node.js)

### Installation

```bash
git clone https://github.com/danielmcleod/GenesysCloudKnowledge.git
cd GenesysCloudKnowledge
npm install
```

### Development

```bash
npm run dev
```

Opens a local dev server (default: `http://localhost:5173`).

### Build

```bash
npm run build
```

Outputs production files to the `dist/` directory.

### Preview

```bash
npm run preview
```

Serves the production build locally for testing.

## Project Structure

```
GenesysCloudKnowledge/
├── src/
│   ├── App.jsx           # Landing page, guide routing, theme management
│   ├── Footer.jsx        # Shared footer with disclaimer
│   ├── main.jsx          # React entry point
│   └── index.css         # Global styles, scrollbar, Tailwind directives
├── Genesys*Guide.jsx     # 18 self-contained guide modules
├── index.html            # HTML shell
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind configuration
├── postcss.config.js     # PostCSS configuration
├── package.json          # Dependencies and scripts
└── LICENSE               # MIT License
```

## Contributing

Contributions are welcome. If you'd like to improve an existing guide, fix a bug, or add a new module:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-change`)
3. Commit your changes
4. Push to your fork and open a pull request

When adding or modifying guide content, follow the existing tier structure and component patterns found in any of the `Genesys*Guide.jsx` files.

## License

This project is licensed under the [MIT License](LICENSE).
