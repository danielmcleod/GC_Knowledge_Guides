# Genesys Cloud Outbound Dialer — Interactive Knowledge Guide
## Complete Build Specification for Claude Code

> **Instructions to Claude Code**: Build this entire project as a **single-page React application** (one `.jsx` file) that renders an interactive, tiered knowledge guide for Genesys Cloud Outbound Dialing. The app must be fully self-contained with no external API calls, no backend, and no localStorage. All content is embedded in the code. Use only Tailwind CSS utility classes, lucide-react for icons, and React hooks. The final output should be a single `.jsx` artifact file.

---

## 1. PROJECT OVERVIEW

### What This Is
An interactive, web-based learning guide that teaches Genesys Cloud CX Outbound Dialing from zero to expert. It is NOT a reference dump — it is a structured curriculum with progressive disclosure, visual diagrams, and contextual explanations that build knowledge layer by layer.

### Core Design Philosophy
- **Progressive disclosure**: Users start at Tier 1 (Foundations) and unlock complexity as they scroll/navigate deeper
- **Visual-first**: Every concept should have a diagram, flowchart, or visual representation before any dense text
- **Contextual**: Each component is explained in terms of HOW it connects to other components, not in isolation
- **Opinionated**: The guide should tell users what matters most, what to configure first, and what the common pitfalls are — not just what exists

### Target Audience
Contact center administrators, workforce managers, IT engineers, and consultants who need to understand, configure, or troubleshoot Genesys Cloud Outbound campaigns. They may have general contact center experience but little to no Genesys Cloud-specific outbound knowledge.

---

## 2. AESTHETIC DIRECTION & DESIGN SYSTEM

### Theme: "Mission Control" — Dark, Technical, Professional
Think NASA mission control meets Bloomberg terminal meets a premium developer docs site. This is a tool for professionals doing serious work — the design should feel authoritative, precise, and high-information-density without being cluttered.

### Color Palette (CSS Variables)
```
--bg-primary: #0B0F1A          (deep navy-black, main background)
--bg-secondary: #111827        (slightly lighter panels/cards)
--bg-tertiary: #1F2937         (hover states, active elements)
--bg-elevated: #374151         (tooltips, dropdowns)

--text-primary: #F9FAFB        (main text, high contrast)
--text-secondary: #9CA3AF      (descriptions, secondary info)
--text-muted: #6B7280          (timestamps, labels)

--accent-orange: #F97316       (Genesys brand-adjacent, primary CTAs, Tier 1 indicator)
--accent-blue: #3B82F6         (links, Tier 2 indicator, interactive elements)
--accent-purple: #8B5CF6       (Tier 3 indicator, advanced concepts)
--accent-green: #10B981        (success states, "connected" indicators)
--accent-red: #EF4444          (warnings, DNC/compliance highlights)
--accent-yellow: #F59E0B       (caution callouts, tips)

--border-subtle: #1F2937       (card borders, dividers)
--border-active: #3B82F6       (focused/active element borders)

--gradient-tier1: linear-gradient(135deg, #F97316, #FB923C)
--gradient-tier2: linear-gradient(135deg, #3B82F6, #60A5FA)
--gradient-tier3: linear-gradient(135deg, #8B5CF6, #A78BFA)
```

### Typography
- **Headings**: `JetBrains Mono` from Google Fonts (monospace, technical feel) — import via `<link>` in the JSX
- **Body text**: `IBM Plex Sans` from Google Fonts (clean, professional, highly legible)
- **Code/data**: `JetBrains Mono` at smaller sizes
- Import both from Google Fonts CDN: `https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap`

### Spacing & Layout
- Max content width: 1200px, centered
- Section padding: 80px vertical
- Card padding: 24px–32px
- Border radius: 8px for cards, 12px for major containers, 4px for small elements
- All cards should have a subtle `border: 1px solid var(--border-subtle)` and a very subtle glow/shadow on hover

### Micro-interactions
- Tier tab switches: smooth crossfade (300ms ease)
- Card hovers: slight translateY(-2px) + border color change + subtle box-shadow
- Expandable sections: height animation with chevron rotation
- Scroll-triggered fade-in for major sections (use IntersectionObserver)
- Diagram nodes: pulse animation on hover, tooltip on click

---

## 3. APPLICATION STRUCTURE

### Top-Level Layout

```
┌─────────────────────────────────────────────────────┐
│  STICKY HEADER / NAVIGATION BAR                      │
│  [Logo/Title]  [Tier 1] [Tier 2] [Tier 3] [Search]  │
├─────────────────────────────────────────────────────┤
│                                                       │
│  HERO SECTION (visible on load)                       │
│  Title + Subtitle + Tier Selection Cards              │
│                                                       │
├─────────────────────────────────────────────────────┤
│                                                       │
│  ACTIVE TIER CONTENT                                  │
│  (switches based on selected tier)                    │
│                                                       │
│  ┌─ LEFT SIDEBAR ──┐  ┌─ MAIN CONTENT ─────────┐   │
│  │ Section Nav      │  │ Current Section         │   │
│  │ (sticky scroll)  │  │ with all subsections    │   │
│  │                  │  │                          │   │
│  │ ● Overview       │  │                          │   │
│  │ ● Components     │  │                          │   │
│  │ ● Dialing Modes  │  │                          │   │
│  │ ● Contact Lists  │  │                          │   │
│  │ ● Compliance     │  │                          │   │
│  │ ● etc.           │  │                          │   │
│  └──────────────────┘  └──────────────────────────┘  │
│                                                       │
├─────────────────────────────────────────────────────┤
│  FOOTER                                               │
└─────────────────────────────────────────────────────┘
```

### Navigation Behavior
- **Sticky header** with tier tabs that highlight the active tier (orange/blue/purple gradient underline)
- **Left sidebar** (desktop only, collapses on mobile) shows section list for the active tier, with the current section highlighted as user scrolls
- **Mobile**: Sidebar becomes a horizontal scrollable tab bar below the header, or a hamburger menu
- Clicking a tier tab smoothly transitions the content area to that tier
- Each tier's sections are independently scrollable — switching tiers resets scroll to top

---

## 4. CONTENT STRUCTURE BY TIER

Below is the complete content for each tier. Every section includes the actual text content, visual diagram descriptions, and interactive element specifications. Claude Code should embed ALL of this content directly in the JSX.

---

### TIER 1: FOUNDATIONS (Color: Orange #F97316)
**Subtitle**: "The Big Picture — What Is Outbound and Why Does It Matter?"
**Icon**: lucide `Rocket`
**Target audience label**: "For everyone — no experience needed"

---

#### T1 Section 1: "What Is Outbound Dialing?"

**Content**:
Outbound dialing is the process of a contact center proactively reaching out to customers, rather than waiting for customers to call in. Think of inbound as a restaurant where customers walk in — outbound is a food truck that drives to the customers.

In Genesys Cloud, "Outbound" refers to a built-in campaign engine that automates the process of calling (or texting, or emailing) a list of contacts. Instead of agents manually looking up phone numbers and dialing one by one, the system does the dialing for them — finding the right contacts, calling at the right times, filtering out numbers that shouldn't be called, and connecting live answers to available agents.

**Key use cases** (render as icon cards in a 2x3 grid):
- 📞 **Collections** — Contacting customers about past-due accounts
- 📋 **Surveys** — Post-interaction satisfaction surveys
- 📣 **Sales/Telemarketing** — Outbound sales campaigns
- 🔔 **Notifications** — Appointment reminders, service alerts
- 🔄 **Customer Retention** — Win-back and renewal campaigns
- ✅ **Verification** — Identity or information confirmation calls

**Visual: "Inbound vs Outbound" comparison diagram**
Render as two side-by-side panels:
```
INBOUND                          OUTBOUND
Customer → Phone → Queue → Agent    Campaign Engine → Phone → Customer ← Agent
"Customer initiates"              "Organization initiates"
Reactive                          Proactive
Routing decides WHO answers       Dialing decides WHO to call and WHEN
```

---

#### T1 Section 2: "The Building Blocks — What Makes Up a Campaign"

**Content**:
A campaign in Genesys Cloud is like a recipe — it combines specific ingredients to produce the outreach you want. No single component works alone; they must all be assembled together. Here are the essential building blocks:

**Visual: Interactive Component Map (THE KEY DIAGRAM)**
This is the most important visual in the entire guide. Render as an SVG-style interactive diagram showing a central "CAMPAIGN" node with lines connecting to surrounding component nodes. Each node should be clickable to expand a brief description tooltip/popover.

```
Layout (render as connected node diagram):

                    ┌──────────────┐
                    │  CONTACT LIST │
                    │  (Who to call)│
                    └──────┬───────┘
                           │
    ┌──────────────┐       │       ┌──────────────────┐
    │    QUEUE     │       │       │   DNC LISTS       │
    │(Agent group) ├───────┼───────┤(Who NOT to call)  │
    └──────────────┘       │       └──────────────────┘
                           │
              ┌────────────┴────────────┐
              │        CAMPAIGN          │
              │    (The orchestrator)    │
              └────────────┬────────────┘
                           │
    ┌──────────────┐       │       ┌──────────────────┐
    │   SCRIPT     │       │       │  CALL ANALYSIS    │
    │(Agent screen)├───────┼───────┤  RESPONSE SET     │
    └──────────────┘       │       │(What happens when │
                           │       │ someone answers)  │
    ┌──────────────┐       │       └──────────────────┘
    │ DIALING MODE │       │
    │(How fast to  ├───────┤       ┌──────────────────┐
    │  dial)       │       │       │  RULE SETS        │
    └──────────────┘       ├───────┤(Automation logic) │
                           │       └──────────────────┘
    ┌──────────────┐       │
    │ CONTACTABLE  │       │       ┌──────────────────┐
    │ TIME SETS    ├───────┘       │  WRAP-UP CODES    │
    │(When to call)│               │(Call outcomes)    │
    └──────────────┘               └──────────────────┘
```

**For EACH node, show this tooltip on click** (embed these descriptions):

| Component | Simple Explanation | Analogy |
|---|---|---|
| Contact List | A spreadsheet of people to call — names, phone numbers, and any other data | Your address book |
| Queue | A group of agents assigned to handle the campaign's calls | The team roster |
| DNC Lists | Lists of phone numbers that must NEVER be called (legal requirement) | The "do not disturb" list |
| Script | The screen that pops up for the agent showing contact info and a talk track | The agent's cheat sheet |
| Call Analysis Response Set | Rules for what to do when a call connects — is it a person? A voicemail? A busy signal? | The "if this, then that" rulebook |
| Dialing Mode | How aggressively the system dials — from cautious (Preview) to maximum speed (Predictive) | The speed dial on a car |
| Rule Sets | Automated logic that runs before or after each call — skip certain contacts, retry others, update data | The autopilot rules |
| Contactable Time Sets | Windows of time when you're allowed to call, based on the contact's time zone | Business hours by time zone |
| Wrap-Up Codes | Labels agents assign after each call to classify the outcome (e.g., "Sale", "No Answer", "Callback") | Filing the call result |

---

#### T1 Section 3: "The Six Dialing Modes — Explained Simply"

**Content intro**:
The dialing mode is the single most important decision when creating a campaign. It determines the speed, efficiency, compliance risk, and agent experience. Genesys Cloud offers six modes, which fall on a spectrum from "agent controls everything" to "the system controls everything."

**Visual: Dialing Mode Spectrum (horizontal bar/slider visual)**
Render as a horizontal gradient bar from left (orange, "Agent Control") to right (purple, "System Control") with the six modes placed along it:

```
AGENT CONTROL ◄──────────────────────────────────────────► SYSTEM CONTROL

 Preview    External    Progressive    Power    Predictive    Agentless
   ●           ●            ●           ●          ●            ●
 Agent      Agent        1 call per  Multiple   System       No agents
 reviews    copies #     idle agent  calls per  predicts     at all —
 first,     to own       at 1:1     idle agent  when agents  IVR or
 decides    dialer       ratio      ratio      will be free  voicemail
 to call                                        & pre-dials   only
```

**Render as 6 expandable cards** (click to expand), each with:

**Preview Dialing**
- **How it works**: The system sends a contact record to the agent's screen. The agent reads the info, then decides whether to call or skip. The call is placed only when the agent clicks "Dial."
- **Speed**: ⭐☆☆☆☆ (Slowest)
- **Abandon risk**: None — agent is always there before the call
- **Best for**: High-value calls, complex accounts, sensitive situations, small teams
- **Agent count needed**: Any (even 1 agent)
- **Think of it as**: Reading the file before making the call

**Progressive Dialing**
- **How it works**: When an agent becomes idle, the system immediately places exactly ONE call for that agent. 6 idle agents = 6 simultaneous calls. Strict 1:1 ratio.
- **Speed**: ⭐⭐☆☆☆
- **Abandon risk**: Nearly zero
- **Best for**: Compliance-sensitive campaigns, smaller teams (under 15 agents)
- **Agent count needed**: 1+
- **Think of it as**: One ball per juggler — safe and steady

**Power Dialing**
- **How it works**: When an agent becomes idle, the system places MULTIPLE calls for that agent based on a configurable ratio (e.g., 3 calls per agent). The system adjusts the ratio in real time to stay under the abandon rate limit.
- **Speed**: ⭐⭐⭐☆☆
- **Abandon risk**: Low-Medium (system-managed)
- **Best for**: Medium teams wanting higher throughput with compliance control
- **Agent count needed**: 10–15 minimum recommended
- **Think of it as**: A few balls per juggler — faster, but the system catches any drops

**Predictive Dialing**
- **How it works**: The system uses a statistical algorithm to predict WHEN each agent will finish their current call, and starts dialing BEFORE the agent is free — timing it so a live answer arrives just as the agent becomes available. This is the fastest mode.
- **Speed**: ⭐⭐⭐⭐⭐ (Fastest)
- **Abandon risk**: Medium (algorithm-managed, configurable threshold)
- **Best for**: Large teams focused on maximum contacts per hour
- **Agent count needed**: 15+ minimum (Genesys recommendation)
- **Think of it as**: The system is playing chess three moves ahead
- **⚠️ Critical note**: Requires the agent script to have "Set Stage" actions configured, or it degrades to Power mode behavior

**Agentless Dialing**
- **How it works**: The system dials contacts with no agents involved at all. Live answers are routed to an automated IVR flow (Architect) that can play messages, collect input, or offer a transfer to a live agent. Voicemail answers can receive automated message drops.
- **Speed**: ⭐⭐⭐⭐☆ (Very fast, limited by line count)
- **Abandon risk**: N/A (no agents to abandon to)
- **Best for**: Notifications, reminders, surveys, voicemail drops
- **Agent count needed**: 0
- **Think of it as**: A robocall — but a legal, smart one

**External Calling**
- **How it works**: The system presents a contact record to the agent (like Preview), but the agent copies the number and dials using a separate third-party dialer or phone. Genesys Cloud does NOT place the call.
- **Speed**: ⭐☆☆☆☆
- **Abandon risk**: None
- **Best for**: Strict TCPA manual-dial compliance requirements (e.g., calling cell phones without prior express consent)
- **Agent count needed**: 1+
- **Think of it as**: Using the system as a Rolodex while you make the call yourself
- **⚠️ Trade-off**: Genesys Cloud loses call recording, analytics, and interaction detail for these calls

---

#### T1 Section 4: "The Life of an Outbound Call — Step by Step"

**Content intro**:
Every outbound call follows the same lifecycle, regardless of dialing mode. Understanding this flow is key to understanding why each component exists.

**Visual: Vertical timeline / flowchart (THE LIFECYCLE DIAGRAM)**
Render as a vertical step-by-step timeline with numbered steps, connecting lines, and icons at each step. Use color coding: green for "go" steps, orange for decision points, red for stop/filter steps.

```
STEP 1: CAMPAIGN TURNED ON
  │ Admin starts the campaign
  ▼
STEP 2: CONTACT FILTERING
  │ System checks each contact against:
  │  🔴 DNC List — Is this number blocked? → SKIP
  │  🔴 Contactable Time Set — Is it within calling hours? → SKIP (try later)
  │  🔴 Attempt Controls — Already called max times? → SKIP
  │  🔴 Callable Status — Marked uncallable by previous wrap-up? → SKIP
  │  🔴 Contact List Filter — Does contact match filter criteria? → SKIP
  │  🟡 Pre-Call Rules — Any rules say "don't dial"? → SKIP
  ▼
STEP 3: DIALING
  │ System places the call based on the dialing mode
  │ (Preview waits for agent, Predictive pre-dials, etc.)
  ▼
STEP 4: CALL ANALYSIS (What happened?)
  │  📞 Live Voice Detected → Route to Agent (or Flow)
  │  📠 Fax/Modem → Hang up, mark number
  │  🔇 No Answer → Hang up after timeout (30 sec default)
  │  📵 Busy Signal → Hang up, retry later
  │  🤖 Answering Machine → Hang up, play message, or route to flow
  │  ⚠️ SIT Tones → Hang up, permanently mark number as uncallable
  │  ❌ Disconnect/Error → Log and move on
  ▼
STEP 5: AGENT INTERACTION (if live voice → agent)
  │ Agent sees the Script with contact info
  │ Agent talks to the customer
  │ Agent finishes and selects a Wrap-Up Code
  ▼
STEP 6: POST-CALL PROCESSING
  │ Wrap-Up Rules execute (retry? update data? add to DNC?)
  │ Wrap-Up Code Mapping updates contact status:
  │   "Right Party Contact" → Contact is done (success)
  │   "Contact Uncallable" → Entire contact removed from future dialing
  │   "Number Uncallable" → Just this number removed, other numbers still active
  │   Default → Contact may be retried
  ▼
STEP 7: NEXT CONTACT
  │ System moves to the next eligible contact
  │ Repeat until all contacts processed or campaign stopped
  ▼
CAMPAIGN COMPLETE (or recycle to start over)
```

---

#### T1 Section 5: "Key Terminology Glossary"

Render as a searchable/filterable card grid (2 columns on desktop, 1 on mobile). Each card shows the term, a one-sentence definition, and which tier covers it in depth.

| Term | Definition | Deep dive |
|---|---|---|
| Campaign | The master configuration that combines all components to execute outbound dialing | Tier 2 |
| Contact List | A data table (uploaded as CSV) containing customer records with phone numbers and metadata | Tier 2 |
| DNC (Do Not Contact) | A list of phone numbers or emails legally prohibited from being contacted | Tier 2 |
| CAR Set (Call Analysis Response Set) | Configuration defining what the system does when it detects a live voice, machine, busy, etc. | Tier 2 |
| AMD (Answering Machine Detection) | Technology that analyzes audio after a call connects to determine if a person or machine answered | Tier 3 |
| ATZM (Automatic Time Zone Mapping) | System that automatically determines a contact's time zone from their phone number area code or zip code | Tier 2 |
| Wrap-Up Code | A label an agent assigns after a call to categorize the outcome | Tier 2 |
| Rule Set | A collection of conditional rules that execute before (pre-call) or after (wrap-up) each call | Tier 2 |
| Campaign Sequence | A chain of campaigns that run one after another automatically | Tier 2 |
| Architect Flow | A visual IVR/routing design tool in Genesys Cloud used to build automated call handling logic | Tier 3 |
| Script | The UI page presented to agents during an outbound interaction showing contact data and action buttons | Tier 2 |
| Edge / Site | The telephony infrastructure (hardware or cloud) that originates outbound calls | Tier 3 |
| BYOC | "Bring Your Own Carrier" — using your own SIP trunking provider instead of Genesys Cloud Voice | Tier 3 |
| CPS | Calls Per Second — the rate at which the organization can place outbound calls | Tier 3 |
| Set Stage | A script action essential for Predictive dialing that tells the algorithm where the agent is in their call flow | Tier 3 |
| Right Party Contact (RPC) | A successful connection with the intended person (the "right party") | Tier 2 |
| Abandon Rate | The percentage of calls where a contact answers but no agent is available within the compliance window | Tier 2 |
| Skills-Based Dialing | Routing contacts to agents with matching skills (e.g., language, product expertise) | Tier 3 |

---

### TIER 2: CONFIGURATION & OPERATIONS (Color: Blue #3B82F6)
**Subtitle**: "How It All Fits Together — Building and Running Campaigns"
**Icon**: lucide `Settings`
**Target audience label**: "For administrators & team leads"

---

#### T2 Section 1: "Prerequisites — What You Need Before Building a Campaign"

**Content**:
Before creating your first outbound campaign, these platform-level components must already exist. Think of this as the foundation that all campaigns are built on.

**Visual: Prerequisite Checklist (interactive checklist UI with expandable details)**

Each item renders as a card with a checkbox icon, the item name, and expandable detail:

1. **Telephony Configured** — You need a working voice connection. This is either Genesys Cloud Voice (easiest — built-in), BYOC Cloud (your SIP provider connected to Genesys's cloud), or BYOC Premises (on-prem Edge appliances). Without this, no calls can be placed. Your telephony "Site" or "Edge Group" is what you'll select in the campaign as the dialing infrastructure.

2. **Phone Numbers Provisioned** — You need at least one phone number to display as Caller ID on outbound calls. This can be a Genesys Cloud Voice DID, a number from your BYOC carrier, or a number from your Genesys Edge. Campaigns require a Caller ID — they won't start without one.

3. **Queue Created** — A queue is a container for a group of agents. For agent-based campaigns, you need a queue with agents assigned as members. The queue determines which agents receive outbound calls. You can use a dedicated outbound queue or a blended queue that handles both inbound and outbound.

4. **Wrap-Up Codes Created** — You need at least one wrap-up code (beyond the defaults) for agents to disposition their calls. Then, in Outbound Settings → Wrap-Up Code Mappings, each code must be mapped to one of four categories: Right Party Contact (with a business category of Success, Neutral, or Failure), Contact Uncallable, Number Uncallable, or Default (retryable). This mapping drives all campaign retry logic.

5. **Permissions Assigned** — Users who manage outbound need the Outbound Administrator role or granular permissions: Outbound > Campaign/Contact List/DNC List/Rule Set/etc. > Add/Edit/Delete/View. Agents need Outbound > Contact > View/Edit. Architect authors need Architect > Flow > Add/Edit/View.

6. **Outbound Settings Reviewed** — Under Admin → Outbound → Settings, verify the organization-level defaults: Max Calls Per Agent (default 1.0), Max Line Utilization (default 70%), and the Number of Outbound Lines Per Campaign (default Lines or Weight mode).

**Visual: Setup Sequence Flowchart**
A horizontal flow showing the recommended order:
```
Telephony → Numbers → Queue → Wrap-ups → Wrap-up Mappings → Contact List → DNC → CAR Set → Script → Rules → Campaign
```

---

#### T2 Section 2: "Contact Lists — The Fuel for Your Campaign"

**Content**:

**Uploading & Formatting**:
Contact lists are uploaded as CSV or Excel files. The first row must be column headers. Key formatting rules:
- Phone numbers: minimum 10 digits; the system strips dashes and parentheses but keeps leading `+`
- For SMS: must be strict E.164 format (e.g., +18005551234)
- Empty fields: keep the comma placeholder — don't delete it
- Text with commas/spaces: wrap in double quotes
- Encoding: UTF-8 (important for international characters)
- Max per list: 1 million contacts, 50 columns, 10 phone number columns, 10 email columns

**Visual: Sample CSV Diagram**
Render as a code block styled as a spreadsheet:
```
FirstName, LastName, HomePhone, CellPhone, Email,      ZipCode, AccountID, Balance
John,      Smith,    5551234567, 5559876543, john@x.com, 30101,   A-1001,    250.00
Jane,      Doe,      5552345678, 5558765432, jane@x.com, 90210,   A-1002,    125.50
"Bob, Jr", Wilson,   5553456789, ,           bob@x.com,  10001,   A-1003,    0.00
```

Highlight with annotations:
- Arrow pointing to "HomePhone" → "This becomes a Phone Column (type: Home)"
- Arrow pointing to "CellPhone" → "This becomes a Phone Column (type: Cell)"
- Arrow pointing to empty cell → "Empty field — comma placeholder keeps alignment"
- Arrow pointing to `"Bob, Jr"` → "Quotes needed because the value contains a comma"
- Arrow pointing to ZipCode → "Used for Automatic Time Zone Mapping"
- Arrow pointing to AccountID → "Good candidate for Unique Identifier Column"

**Column Types Explained** (render as a tabbed panel with 4 tabs):

Tab 1: **Phone Columns** — Up to 10. Each has a Phone Type (Home, Work, Cell, Main) and optional paired Time Zone Column. Phone columns are dialed in order (column 1 first, then 2, etc.) unless a callback is scheduled on a specific number.

Tab 2: **Email Columns** — Up to 10. Each has an Email Type (Personal, Work). Used for email campaigns only.

Tab 3: **Special Columns** — Zip Code Column (enables ATZM), Unique Identifier Column (for dedup and append-matching, alphanumeric, max 100 chars), Skill Columns (up to 2, for skills-based dialing), Agent Owned Column (assigns contacts to specific agents by email/ID), Preview Mode Column (forces preview treatment per-contact).

Tab 4: **System-Generated Columns** — Genesys automatically creates tracking columns you can see when downloading: `inin-outbound-id` (UUID), `ContactCallable` (1/0), `Callable–PhoneName` (per-number), `CallRecordLastAttempt–PhoneName`, `CallRecordLastResult–PhoneName`, `AutomaticTimeZone–PhoneName`. These are read-only and updated by the system.

**Contact List Filters** (subsection):
Filters let you target a subset of your contact list without creating a new list. Up to 10 conditions per filter using AND/OR logic. Conditions compare column values (equals, not equals, contains, greater than, less than, between, is set, is not set). Only ONE filter can be active per campaign. Use case: "Only dial contacts where State = 'CA' AND Balance > 100."

---

#### T2 Section 3: "DNC Lists & Compliance Controls"

**Content**:

**Four types of DNC lists** (render as 4 stacked cards):

1. **Internal DNC** — You upload a CSV of phone numbers or email addresses. Optional expiration date column (UTC format, max 180 days). Use for your organization's internal opt-out list. Numbers must match the exact format in your contact list (including +1 prefix if used).

2. **Internal Custom DNC** — Uses custom column values instead of phone/email. Example: block all contacts with AccountID = "CLOSED-001". More flexible matching.

3. **DNC.com Integration** — Real-time scrub against Contact Center Compliance Corporation's database. Provides federal DNC, state DNC, state holiday restrictions, time-of-day restrictions, and wireless/VoIP identification. Requires a DNC.com account and license key configured in Genesys Cloud.

4. **Gryphon Networks Integration** — Real-time TCPA, CFPB, FDCPA compliance scrubbing. Enforces state-specific and federal regulations dynamically. Requires Gryphon account.

**Important rules** (render as a yellow-bordered callout box):
- DNC lists have NO effect until assigned to a specific campaign
- Scheduled callbacks bypass DNC checking (by design — the contact consented)
- Phone format must match exactly between contact list and DNC list
- DNC lists can hold up to 1 million records each, 2 million per org total

**Contactable Time Sets** (subsection):
Define per-timezone calling windows. Default: 8:00 AM – 9:00 PM in the contact's local time (with a buffer stopping at 8:59 PM). Supports any IANA timezone. Works with ATZM or manual timezone columns. Key rule: if a contact's timezone makes them uncallable right now, ALL their phone numbers are skipped until the window opens — even if other numbers are in callable timezones.

**Attempt Controls** (subsection):
Limit how many times a contact or specific phone number is attempted. Configurable per campaign. Max 100 attempts with a reset period of 2–30 days. Example: "Try each phone number up to 3 times with 2 hours between attempts, and try the contact a maximum of 9 times total."

---

#### T2 Section 4: "Call Analysis Response Sets — What Happens When Someone Picks Up"

**Content intro**:
The Call Analysis Response (CAR) Set is the decision engine that runs the instant a call connects. It classifies WHAT answered the phone and then executes your configured action. Every campaign (except Preview) requires a CAR set.

**Visual: Call Classification Decision Tree**
Render as a tree diagram:

```
CALL PLACED
    │
    ├── Pre-Connect Detection (before audio analysis)
    │   ├── SIT Tones → Auto-mark UNCALLABLE (permanent) ❌
    │   ├── Busy Signal → Log as Busy, retry later 🔄
    │   ├── Fax/Modem → Log, mark number 📠
    │   └── No Answer (timeout) → Log, retry later ⏰
    │
    └── Post-Connect Detection (audio analysis after answer)
        ├── Live Voice → YOUR CONFIGURED ACTION:
        │   ├── Transfer to Queue (agent handles) 👤
        │   ├── Transfer to Outbound Flow (IVR handles) 🤖
        │   └── Hangup ❌
        │
        └── Answering Machine → YOUR CONFIGURED ACTION:
            ├── Hangup ❌
            ├── Transfer to Queue (agent handles) 👤
            └── Transfer to Outbound Flow (voicemail drop) 📩
                └── [Optional] Wait for Beep before playing message
```

**Key configuration options** (render as a settings-style form mockup):

- **Live Voice Action**: Transfer to Queue (most common), Transfer to Flow, or Hangup
- **Answering Machine Action**: Hangup (most common for compliance), Transfer to Flow (for voicemail drops)
- **Beep Detection**: Enable to wait for the answering machine beep before starting the flow message. Recommended: increase no-answer timeout to 60 seconds when using beep detection.
- **AMD Sensitivity (ALSD)**: Disabled (most accurate, slowest detection), Low, Medium, High (fastest, least accurate)

**Important note** (render as a blue info callout):
Even with AMD fully disabled, Genesys Cloud's voiceprint database and tone detection still catch approximately 2/3 of answering machines. "Disabling AMD" only disables the speech-duration analysis — the other two detection layers remain active. This is a commonly misunderstood behavior.

---

#### T2 Section 5: "Wrap-Up Codes & Mappings — Driving Campaign Retry Logic"

**Content**:
Wrap-up codes are labels agents select after finishing a call. In outbound, they do more than just categorize — they directly control whether the contact gets called again.

**Visual: Wrap-Up Code Mapping Diagram**
Render as a flow diagram showing the four mapping categories and their effects:

```
Agent selects wrap-up code → Mapping category determines what happens:

"Sale Complete"     → RIGHT PARTY CONTACT (Success)  → Contact DONE ✅ (won't be called again)
"Not Interested"    → RIGHT PARTY CONTACT (Failure)  → Contact DONE ✅ (won't be called again)  
"Callback Request"  → RIGHT PARTY CONTACT (Neutral)  → Contact DONE ✅ (unless callback scheduled)
"Wrong Number"      → NUMBER UNCALLABLE              → THIS number removed, other numbers still active
"Deceased"          → CONTACT UNCALLABLE             → ALL numbers removed, contact fully excluded
"No Answer"         → DEFAULT                        → Contact stays in the pool for retry 🔄
"Busy"              → DEFAULT                        → Contact stays in the pool for retry 🔄
```

**System-assigned wrap-up codes** (render as a collapsible section):
The dialer automatically assigns these codes when no agent is involved:
- `ININ-OUTBOUND-BUSY` — Busy signal detected
- `ININ-OUTBOUND-MACHINE` — Answering machine detected  
- `ININ-OUTBOUND-LIVE-VOICE` — Live voice detected (when routed to flow, not agent)
- `ININ-OUTBOUND-SIT-UNCALLABLE` — SIT tones (permanently uncallable)
- `ININ-OUTBOUND-DISCONNECT` — Call disconnected
- `ININ-OUTBOUND-ABANDON` — Contact answered but no agent available in time
- And ~16 more covering various scenarios

These system codes should also be mapped in the Wrap-Up Code Mappings page to ensure proper retry behavior.

---

#### T2 Section 6: "Rule Sets — Automating Before and After Every Call"

**Content intro**:
Rule sets are collections of IF/THEN logic that execute automatically. There are two types: pre-call rules (run before the dial) and wrap-up rules (run after the call ends). They're your automation engine.

**Visual: Pre-Call vs Wrap-Up Rules Side-by-Side**
Render as two columns:

```
PRE-CALL RULES                          WRAP-UP RULES
(Before the call is placed)              (After the call ends)

CONDITIONS you can check:                CONDITIONS you can check:
• Contact list column values             • Everything from pre-call, PLUS:
• Time since last attempt                • Call analysis result (busy, machine, person)
• Phone number type (home/cell)          • System disposition (22 system codes)
• Time of day / day of week              • Agent-assigned wrap-up code
• Data Action result (CRM lookup)        • Data Action result

ACTIONS you can take:                    ACTIONS you can take:
• Don't Dial (skip this contact)         • Schedule Callback (5 min – 30 days)
• Switch to Preview mode                 • Add number to DNC list
• Set Caller ID (from column or static)  • Mark contact/number uncallable
• Route based on Skills                  • Update contact column
• Update contact column                  • Execute Data Action (CRM update)
• Execute Data Action                    • All pre-call actions too
• Mark contact/number uncallable
```

**Example rules** (render as styled "recipe cards"):

**Example 1: "VIP Treatment"**
- Type: Pre-Call
- Condition: IF column "AccountTier" equals "Platinum"
- Action: Switch to Preview mode (so agent can prepare before calling a high-value customer)

**Example 2: "Retry Busy After 30 Minutes"**  
- Type: Wrap-Up
- Condition: IF system disposition equals "ININ-OUTBOUND-BUSY"
- Action: Schedule Callback in 30 minutes

**Example 3: "Caller ID by State"**
- Type: Pre-Call
- Condition: IF column "State" equals "CA"
- Action: Set Caller ID to "+14155551234" (local California number to improve answer rates)

**Example 4: "Update CRM After Sale"**
- Type: Wrap-Up
- Condition: IF wrap-up code equals "Sale Complete"
- Action: Execute Data Action → Salesforce Update → Set Opportunity Status = "Closed Won"

---

#### T2 Section 7: "Campaign Sequences & Campaign Rules"

**Campaign Sequences**:
A sequence chains 2+ campaigns to run back-to-back. When Campaign A finishes (all contacts processed), Campaign B starts automatically. Use cases: run a morning "first attempt" campaign, then an afternoon "retry" campaign on a different contact list. The "Repeat" option loops the sequence indefinitely.

**Campaign Rules** (different from Rule Sets):
Campaign rules operate at the organization level and monitor campaign-level metrics (not individual calls). They can automatically adjust campaigns based on performance.

**Visual: Campaign Rules example scenarios** (render as 3 cards):

Card 1: **"Auto-Recycle at 100% Progress"**
- Condition: Campaign Progress = 100%
- Action: Recycle Campaign (reset to beginning)
- Use: "Always running" campaigns that never stop

Card 2: **"Ramp Up When Agents Join"**  
- Condition: Agent Count ≥ 20
- Action: Change Dialing Mode to Predictive
- Use: Start in Progressive mode for small early shift, switch to Predictive when full staff arrives

Card 3: **"Alert on High Abandon Rate"**
- Condition: Compliance Abandon Rate ≥ 4.5%
- Action: Set Max Calls Per Agent to 1.5 (reduce aggression)
- Use: Automatic compliance safety valve

---

#### T2 Section 8: "Running & Monitoring a Campaign"

**Campaign states** (render as a state machine diagram):
```
OFF → (admin starts) → ON → (running...) → STOPPING → COMPLETE
                        │                                  │
                        └── (admin stops) → STOPPING ──────┘
                                                           │
INVALID ← (configuration error)                   ← RECYCLE (reset)
```

**The Campaigns Dashboard** — real-time view showing:
- Connect Rate (live voice ÷ total dials, 10-minute rolling window)
- Compliance Abandon Rate and True Abandon Rate
- Campaign Progress %
- Idle Agents, Effective Idle Agents, Outstanding Calls
- Adjusted Calls Per Agent (current pacing)
- Outbound Lines utilization

**Key metrics to watch** (render as a 2x3 metric card grid with green/yellow/red indicators):

| Metric | Healthy | Warning | Critical |
|---|---|---|---|
| Connect Rate | > 15% | 5–15% | < 5% (bad data or exhausted list) |
| Compliance Abandon Rate | < 3% | 3–5% | > 5% (legal risk!) |
| Idle Agents | 0–2 | 3–5 | > 5 (campaign can't keep up) |
| Progress | Steadily increasing | Flat (filters too aggressive?) | Stuck at 0 (config error) |
| Adj. Calls/Agent | 1.0–3.0 | > 5.0 (very aggressive) | < 1.0 (campaign starved) |

---

### TIER 3: ADVANCED & TECHNICAL (Color: Purple #8B5CF6)
**Subtitle**: "Under the Hood — Architecture, Algorithms, and Edge Cases"
**Icon**: lucide `Cpu`
**Target audience label**: "For engineers, architects & power users"

---

#### T3 Section 1: "Telephony Architecture — How Calls Actually Get Placed"

**Content intro**:
Understanding the telephony layer is critical for troubleshooting call quality, capacity planning, and network design. Genesys Cloud outbound calls traverse a specific technical path that varies by telephony model.

**Visual: Three Telephony Models Architecture Diagram**
Render as 3 side-by-side architecture diagrams:

```
MODEL 1: GENESYS CLOUD VOICE               
┌──────────┐    ┌───────────────┐    ┌──────────────┐
│ Genesys  │    │ AWS Media     │    │ Tier-1       │
│ Campaign │───▶│ Microservices │───▶│ Carrier      │───▶ PSTN
│ Engine   │    │ (autoscaling) │    │ (GenesysOwnedGateway)│
└──────────┘    └───────────────┘    └──────────────┘
• Self-service number provisioning
• No hardware required
• Simplest setup

MODEL 2: BYOC CLOUD                         
┌──────────┐    ┌───────────────┐    ┌──────────────┐
│ Genesys  │    │ AWS Media     │    │ YOUR SIP     │
│ Campaign │───▶│ Microservices │───▶│ Provider     │───▶ PSTN
│ Engine   │    │ (autoscaling) │    │ (public internet) │
└──────────┘    └───────────────┘    └──────────────┘
• Your carrier, your numbers
• SIP trunk config required (FQDN/TGRP/DNIS)
• Large, dynamic pool of AWS public IPs

MODEL 3: BYOC PREMISES                      
┌──────────┐    ┌───────────────┐    ┌──────────────┐
│ Genesys  │    │ ON-PREM EDGE  │    │ YOUR SIP     │
│ Campaign │───▶│ APPLIANCE(S)  │───▶│ PROVIDER     │───▶ PSTN
│ Engine   │    │ (your datacenter)│  │ (private network)│
└──────────┘    └───────────────┘    └──────────────┘
• Fixed capacity per Edge (30–380 concurrent calls)
• Edge handles SIP, media, AND call analysis locally
• N+1 recommended for redundancy
• Separate inbound/outbound SIP trunks recommended
• ⚠️ GHS (Genesys Hardware Solution) Edges deprecated Dec 2026
```

**Capacity Planning Table** (render as a styled table):

| Edge Model | Max Concurrent Calls | Use Case |
|---|---|---|
| Edge Micro | 30 | Small/remote sites |
| Small CHS | 60 | Small campaigns |
| Medium CHS | 120 | Medium campaigns |
| Large CHS | 380 | Large operations |
| Cloud Voice / BYOC Cloud | Autoscaling (no fixed limit) | Any size |

**Org-level limits** (render as a callout):
- Default CPS: 15 per organization (increase via Genesys Care request)
- Max CPS per campaign: 50
- Max Line Utilization: Configurable percentage of total Edge/site capacity reserved for outbound

---

#### T3 Section 2: "The Predictive Algorithm — How It Actually Works"

**Content intro**:
The Genesys Cloud predictive dialer uses a patented stage-based prediction mechanism. Understanding it is essential for optimizing campaign performance and troubleshooting pacing issues.

**Visual: Predictive Algorithm Flow (detailed technical diagram)**

```
ALGORITHM INPUTS (per agent, real-time):
┌─────────────────────────────────────────────┐
│ • Average Handle Time (AHT)                  │
│ • After-Call Work (ACW) duration             │
│ • Current script STAGE (from Set Stage)      │
│ • Historical stage durations for this agent  │
│ • Current idle time                          │
│ • Recent contact list answer rate            │
│ • Current compliance abandon rate            │
│ • Number of outstanding (ringing) calls      │
└─────────────────────────────────────────────┘
          │
          ▼
PREDICTION ENGINE:
┌─────────────────────────────────────────────┐
│ For each agent on a call:                    │
│  1. Read current script stage                │
│  2. Look up this agent's historical time     │
│     remaining from this stage to call end    │
│  3. Factor in ACW estimate                   │
│  4. Calculate predicted "available at" time  │
│                                              │
│ For the contact list:                        │
│  5. Estimate time-to-answer based on         │
│     recent answer rate + avg ring time       │
│  6. Estimate time-to-classify (AMD delay)    │
│                                              │
│ DIAL DECISION:                               │
│  7. If predicted_available_time ≈             │
│     time_to_answer + time_to_classify:       │
│     → PLACE THE CALL NOW                     │
│                                              │
│  8. Simultaneously check: will placing this  │
│     call push abandon rate over threshold?   │
│     → If yes, WAIT                           │
└─────────────────────────────────────────────┘
          │
          ▼
OUTPUT: Number of calls to place THIS SECOND
```

**Why Set Stage is critical** (render as a red-bordered warning box):
Without Set Stage actions in the script, the algorithm has no visibility into where the agent is in their call. It cannot predict when the call will end. Result: the algorithm falls back to Power mode behavior — waiting for the agent to become idle before dialing, rather than pre-dialing. This can reduce contacts-per-hour by 30–50%.

**Best practices for Predictive** (render as a checklist):
- ✅ Minimum 15 agents (20+ ideal)
- ✅ Set Stage actions on every script page transition
- ✅ Auto-answer enabled for agents (eliminates agent ring time variability)
- ✅ Persistent connections (WebRTC or Polycom recommended)
- ✅ Randomize contact list order (prevents clustering of bad numbers)
- ✅ Set compliance abandon rate to 3% (provides buffer below the common 5% regulatory limit)
- ✅ Start with a 10-minute warm-up period where the algorithm calibrates (expect lower throughput initially)
- ❌ Don't use with fewer than 10 agents
- ❌ Don't mix very short and very long call types in the same campaign
- ❌ Don't set Max Calls Per Agent too low (overrides the algorithm's optimization)

---

#### T3 Section 3: "AMD — The Three-Layer Detection System"

**Content**:
Answering Machine Detection in Genesys Cloud is not a single technology — it's three independent systems working in parallel. Understanding each layer explains seemingly contradictory behaviors (like "AMD is disabled but machines are still being caught").

**Visual: AMD Three-Layer Diagram**
Render as three horizontal layers stacked:

```
LAYER 3: GENERAL SPEECH ANALYSIS (Togglable — this is what "AMD" toggle controls)
┌─────────────────────────────────────────────────────────────────┐
│ Measures speech duration after connect:                          │
│ • < 2,200ms speech + 700ms+ silence → LIVE PERSON               │
│ • > 2,200ms continuous speech → ANSWERING MACHINE                │
│ • ALSD enhancement: uses ringback count to accelerate decision   │
│                                                                  │
│ ⏱️ Detection delay: ~2.5 seconds (Disabled ALSD) to ~0.8s (High)│
│ ⚙️ This is what the AMD ON/OFF toggle controls                   │
└─────────────────────────────────────────────────────────────────┘

LAYER 2: TONE DETECTION (Always active — cannot be disabled)
┌─────────────────────────────────────────────────────────────────┐
│ Listens for the answering machine "beep" tone                    │
│ • Detected beep → ANSWERING MACHINE                              │
│ • No beep within window → No determination from this layer       │
│                                                                  │
│ 🔊 Works independently of speech analysis                        │
└─────────────────────────────────────────────────────────────────┘

LAYER 1: AUDIO FINGERPRINT / VOICEPRINT (Always active — cannot be disabled)
┌─────────────────────────────────────────────────────────────────┐
│ Compares audio against Genesys proprietary database of known:    │
│ • Carrier recorded messages ("The number you dialed...")         │
│ • Common voicemail greetings                                     │
│ • Network announcements                                          │
│                                                                  │
│ 🎵 Catches ~65% of machine answers even with AMD "disabled"      │
└─────────────────────────────────────────────────────────────────┘

KEY INSIGHT: "Disabling AMD" only disables Layer 3.
Layers 1 and 2 remain active ALWAYS.
This is why ~2/3 of machines are still caught with AMD "off."
```

**ALSD (Adjustable Live Speaker Detection) modes** (render as a horizontal scale):
```
Disabled ←──── Low ←──── Medium ←──── High
Most accurate                    Fastest detection
Longest delay                    Most misclassifications
(~2.5 sec)                      (~0.8 sec)
```

ALSD works by analyzing the count of ringback tones before the call is answered. Fewer rings typically correlate with a person answering; many rings followed by a connect often indicate voicemail. This heuristic accelerates the classification before speech analysis completes.

---

#### T3 Section 4: "Architect Outbound Flows — Building Agentless Logic"

**Content**:
Architect outbound flows are the IVR brain behind agentless campaigns and answering machine handling. They execute after the CAR set routes a call to "Transfer to Flow."

**Visual: Architect Outbound Flow example**
Render as a flowchart representing a typical agentless appointment reminder flow:

```
FLOW START (call connected, contact data available via call.contact variable)
    │
    ├── Decision: Was AMD result = Answering Machine?
    │   ├── YES → Play Audio: "This is a reminder for {{call.contact.FirstName}}..."
    │   │         → Detect Silence (wait for beep)
    │   │         → Play Audio on Silence: Leave voicemail message
    │   │         → Disconnect (wrap-up: "VM Left")
    │   │
    │   └── NO (Live Person) →
    │       Play Audio: "Hello, this is a reminder for {{call.contact.FirstName}}
    │                     about your appointment on {{call.contact.ApptDate}}."
    │       │
    │       ├── Collect Input: "Press 1 to confirm, 2 to reschedule, 3 to cancel"
    │       │   ├── 1 → Data Action: Update CRM → Disconnect ("Confirmed")
    │       │   ├── 2 → Transfer to ACD Queue ("Scheduling")
    │       │   └── 3 → Data Action: Cancel Appt → Disconnect ("Cancelled")
    │       │
    │       └── No Input / Timeout → Disconnect ("No Response")
```

**Key Architect capabilities for outbound** (render as a feature grid):
- `call.contact.[ColumnName]` — Access any contact list column
- `Play Audio` / `Play Audio on Silence` — Audio playback
- `Detect Silence` — Wait for silence (machine beep detection)
- `Collect Input` — DTMF collection
- `Call Data Action` — CRM integration mid-flow
- `Transfer to ACD` — Transfer to live agent queue
- `Transfer to Number/User/Group` — Direct transfers
- `Call Bot Flow` — Connect to Dialogflow/Lex bot
- `Set Wrap-Up Code` — Assign outcome before disconnect
- `Set Participant Data` — Pass data to the next handler

**Flow requirements**: Every outbound flow must have a **default contact list** and **default wrap-up code** configured. The flow will fail validation without these.

---

#### T3 Section 5: "Scripts & the Set Stage Action — The Predictive Fuel"

**Content**:
Scripts are the agent-facing UI during outbound calls. Beyond showing data, they are the feedback mechanism for the predictive algorithm.

**Visual: Script Architecture Diagram**

```
SCRIPT DESIGNER (no-code visual editor)
    │
    ├── Pages (multi-page layout, each page = a "stage" for Predictive)
    │   ├── Page 1: "Greeting" — Show name, account info
    │   │   └── Set Stage: "Greeting" ← FIRES ON PAGE LOAD
    │   │
    │   ├── Page 2: "Qualification" — Verify identity, present offer
    │   │   └── Set Stage: "Qualification" ← FIRES ON PAGE LOAD
    │   │
    │   ├── Page 3: "Closing" — Process sale/outcome
    │   │   └── Set Stage: "Closing" ← FIRES ON PAGE LOAD
    │   │
    │   └── Page 4: "Wrap-Up" — Select code, add notes
    │       └── Set Stage: "WrapUp" ← FIRES ON PAGE LOAD
    │
    ├── Data Binding: {{Outbound.FirstName}}, {{Outbound.AccountID}}, etc.
    │
    ├── Outbound Actions (enabled via script Outbound property):
    │   ├── Set Stage ← THE critical action for Predictive
    │   ├── Add to DNC List
    │   ├── Set Contact Column (update data on the fly)
    │   ├── Update Contact (commit changes to contact list)
    │   └── Schedule Callback (agent or campaign-level)
    │
    └── General Actions:
        ├── Execute Data Action (CRM screen pop, lookup)
        ├── Invoke Secure Flow (PCI payment processing)
        ├── Blind/Consult Transfer
        └── Open URL (launch external web app)
```

**Built-in script variables for outbound** (render as a code reference table):
```
{{Outbound.Campaign ID}}      — UUID of the current campaign
{{Outbound.Campaign Name}}    — Name of the current campaign  
{{Outbound.Contact ID}}       — UUID of the current contact record
{{Outbound.Contact List ID}}  — UUID of the contact list
{{Outbound.Contact List Name}}— Name of the contact list
{{Outbound.<ColumnName>}}     — Any contact list column value
{{Scripter.Agent Name}}       — Current agent's name
{{Scripter.Queue Name}}       — Current queue name
```

---

#### T3 Section 6: "API & Integration Architecture"

**Content**:
The Outbound API provides complete programmatic control over every outbound entity. This enables CRM-driven campaign management, real-time contact list updates, and custom analytics.

**Key API endpoints** (render as an API reference table with method, path, description):

| Method | Endpoint | Use |
|---|---|---|
| GET | `/api/v2/outbound/campaigns` | List all campaigns |
| PUT | `/api/v2/outbound/campaigns/{id}` | Update campaign (including start/stop via `campaignStatus: "ON"/"OFF"`) |
| POST | `/api/v2/outbound/contactlists/{id}/contacts` | Add/update contacts (bulk, works while campaign runs) |
| DELETE | `/api/v2/outbound/contactlists/{id}/contacts` | Remove specific contacts |
| POST | `/api/v2/outbound/contactlists/{id}/clear` | Remove ALL contacts (5-second wait before re-adding) |
| GET | `/api/v2/outbound/campaigns/{id}/progress` | Get campaign progress |
| DELETE | `/api/v2/outbound/campaigns/{id}/progress` | Recycle campaign (reset progress) |
| POST | `/api/v2/outbound/dnclists/{id}/phonenumbers` | Add numbers to DNC list |
| POST | `/api/v2/outbound/contactlists/{id}/contacts/bulk` | Bulk contact operations |

**Notification API for real-time events**:
Subscribe to `v2.outbound.campaigns.{id}` topic for real-time campaign state changes. Recommended over polling since campaign stop is indeterminate.

**CRM Integration Options** (render as 3 integration cards):

1. **CX Cloud for Salesforce** — Bidirectional sync: Salesforce campaigns ↔ Genesys campaigns, Salesforce leads ↔ contact lists. Supports click-to-dial, screen pop, auto-logging, and disposition sync.

2. **Data Actions** — REST/GraphQL integration with any external system. Used in pre-call rules (CRM lookup before dialing), wrap-up rules (CRM update after call), and Architect flows (mid-call data operations). Supports Salesforce, Zendesk, Microsoft Dynamics, and generic REST connectors.

3. **Contact Management API** — External Event Lists and External Data Sources for real-time contact state management across systems. Supports Contact Merge operations for deduplication.

---

#### T3 Section 7: "Platform Limits — The Complete Reference"

**Content**:
Render as a comprehensive, sortable/searchable reference table:

| Resource | Limit | Notes |
|---|---|---|
| Concurrent voice campaigns | 50 per org | |
| Concurrent digital campaigns | 25 per org | SMS + email combined |
| Skills-based dialing campaigns | 5 active | 10 total including inactive |
| Dynamic Queueing campaigns | 5 concurrent | 10 total including inactive |
| Contacts per org | 5,000,000 | Across all lists |
| Contacts per list | 1,000,000 | |
| Columns per list | 50 | |
| Phone columns per list | 10 | |
| Email columns per list | 10 | |
| DNC records per list | 1,000,000 | |
| DNC records per org | 2,000,000 | |
| Campaign members (agents) | 1,000 | 500 for skills-based, 200 for agent-owned |
| Default CPS | 15 per org | Increasable via Genesys Care |
| Max CPS per campaign | 50 | |
| Rule sets per org | 1,000 | |
| Campaign rules per org | 1,000 | |
| Sequences per org | 1,000 | |
| Data action conditions per rule | 2 max | |
| Data action executions per rule set | 10 per campaign | |
| Data action timeout | 20 seconds | |
| Contact list filters per org | 1,000 | 1 per campaign |
| Filter conditions per filter | 10 | |
| Contactable time sets per org | 1,000 | |
| CAR sets per org | 1,000 | |
| Responses per CAR set | 1,000 | |
| Campaign entities per type | 1,000 each | |
| SMS rate (short code) | 1,200/min | Up to 6,000 on request |
| SMS rate (toll-free) | 180/min | |
| SMS rate (10DLC) | 70/min | |
| Email rate | 1,200/min org-wide | |
| Callback schedule max | 43,200 min (~30 days) | |
| Attempt controls max | 100 attempts | |
| Attempt reset period | 2–30 days | |

---

#### T3 Section 8: "Licensing & Feature Matrix"

Render as a comparison table:

| Feature | GC1 | GC2 | GC3 |
|---|---|---|---|
| Outbound voice campaigns | ✅ | ✅ | ✅ |
| Preview dialing | ✅ | ✅ | ✅ |
| Progressive dialing | ✅ | ✅ | ✅ |
| Power dialing | ✅ | ✅ | ✅ |
| Predictive dialing | ✅ | ✅ | ✅ |
| Agentless dialing | ✅ | ✅ | ✅ |
| Inbound/outbound blending | ✅ | ✅ | ✅ |
| Scheduled callbacks | ✅ | ✅ | ✅ |
| Campaign sequences | ✅ | ✅ | ✅ |
| SMS campaigns | ❌ (add-on) | ✅ | ✅ |
| Email campaigns | ❌ (add-on) | ✅ | ✅ |
| Proactive notifications | ❌ (add-on) | ✅ | ✅ |
| Agentless API | ❌ (add-on) | ✅ | ✅ |

---

#### T3 Section 9: "Troubleshooting Decision Tree"

**Visual: Interactive troubleshooting flowchart**
Render as an expandable decision tree where clicking each symptom reveals the investigation path:

**"Campaign won't start"**
→ Check: Is the campaign status INVALID? → Look at the error banner — common issues: no CAR set assigned (non-preview), no contact list, no queue, no caller ID, no Site/Edge Group, Edge is offline, no agents in queue, contact list has no phone columns, CAR set missing Transfer to Flow (agentless)

**"Campaign is running but not dialing"**
→ Check: Are there callable contacts? (Progress may be 100% or all contacts filtered) → Check contactable time sets (is it within the calling window for ALL contacts?) → Check DNC lists (are they blocking everyone?) → Check attempt controls (already maxed?) → Check contact list filter (too restrictive?) → Check Edge/Site capacity (Max Line Utilization at 0%?)

**"High abandon rate"**
→ Reduce Max Calls Per Agent → Increase agent count → Switch from Predictive to Power or Progressive → Check if agents are spending too long in ACW → Verify compliance abandon threshold is appropriate for your contact/answer rate

**"AMD misclassifying live people as machines"**
→ Set ALSD to a lower sensitivity (or Disabled) → Accept slightly longer detection delay in exchange for accuracy → Understand that no AMD system is 100% — there is always a trade-off between speed and accuracy

**"Agents getting dead air / silence on connect"**
→ This is AMD working — the detection delay creates a brief silence before the system classifies and routes. ALSD on Medium/High reduces this. Enabling auto-answer eliminates agent-side ring delay. If persistent, check SIP trunk media settings (ensure media method is "normal" not "proxy").

---

## 5. INTERACTIVE ELEMENT SPECIFICATIONS

### 5.1 Tier Navigation Tabs
- Three tabs at top of the page (or in sticky header): Foundations (orange), Configuration (blue), Advanced (purple)
- Active tab has a gradient bottom border in the tier color, text is white, inactive tabs are muted gray
- Clicking a tab shows only that tier's content sections, with a smooth CSS transition

### 5.2 Component Map (T1 Section 2)
- Build as an SVG rendered in React with positioned nodes
- Each node is a rounded rectangle with an icon and label
- Lines connect each node to the central CAMPAIGN node
- On hover: node border glows in the tier color, subtle scale(1.05)
- On click: a popover/tooltip appears below the node with the description text from the table
- Use React state to track which node is expanded

### 5.3 Expandable/Collapsible Sections
- Throughout the guide, longer content blocks should be collapsible
- Header row with chevron icon (lucide ChevronDown/ChevronUp)
- Smooth height transition (max-height animation)
- Default state: first section in each tier is expanded, rest are collapsed

### 5.4 Dialing Mode Cards (T1 Section 3)
- 6 cards in a 2x3 grid (1 column on mobile)
- Each card has: mode name, speed rating (star icons), abandon risk badge, "Best for" tag
- Click to expand full description with the detail text
- Active/expanded card has a left border in tier color

### 5.5 Interactive Tables
- All tables should have alternating row shading
- On hover: row highlights
- Where specified as "searchable": include a text input above the table that filters rows

### 5.6 Callout Boxes
- **Info** (blue border + blue icon): General important information
- **Warning** (yellow/amber border + triangle icon): Common pitfalls
- **Critical** (red border + alert icon): Compliance/legal implications
- **Tip** (green border + lightbulb icon): Best practices

### 5.7 Progress Indicator
- In the left sidebar, show a visual indicator of how far the user has scrolled through the current tier
- Small dots or bars next to each section name, filled/unfilled based on scroll position

### 5.8 Search
- A search input in the header that filters across ALL tiers
- Shows matching section titles and a brief snippet
- Clicking a result jumps to that section and switches to the appropriate tier

---

## 6. RESPONSIVE BEHAVIOR

### Desktop (>1024px)
- Full sidebar + main content layout
- All grids at full column count
- Diagrams at full size

### Tablet (768–1024px)
- Sidebar collapses to a top horizontal scroll bar
- Grids reduce to 2 columns
- Diagrams scale down proportionally

### Mobile (<768px)
- No sidebar — tier tabs + section dropdown in header
- All grids go to 1 column
- Diagrams stack vertically or simplify
- Tables become horizontally scrollable
- Card expansions become full-width accordions

---

## 7. IMPLEMENTATION NOTES FOR CLAUDE CODE

1. **Single file**: The entire app must be in one `.jsx` file with a default export
2. **Data as constants**: All content (section text, table data, glossary entries, etc.) should be defined as JavaScript constants at the top of the file
3. **State management**: Use `useState` for active tier, expanded sections, search query, active sidebar section. Use `useEffect` + `IntersectionObserver` for scroll tracking
4. **No localStorage**: All state resets on page refresh — that's fine
5. **Fonts**: Import Google Fonts via a `<style>` tag in the component
6. **Icons**: Use lucide-react for all icons
7. **Tailwind only**: No custom CSS classes — use Tailwind utilities. For custom colors, use inline styles with the hex values from the design system
8. **SVG diagrams**: The component map and flowcharts should be rendered as inline SVG with React event handlers for interactivity
9. **Performance**: Use React.memo for heavy diagram components. Lazy-render off-screen tier content
10. **Accessibility**: All interactive elements need focus states, proper aria labels, and keyboard navigation support

---

## 8. FINAL QUALITY CHECKLIST

Before delivery, verify:
- [ ] All three tiers load and switch correctly
- [ ] Every section from this spec is present with all content
- [ ] Component map is interactive (click nodes for tooltips)
- [ ] Dialing mode cards expand/collapse
- [ ] Lifecycle flowchart is visible and readable
- [ ] Search filters across all tiers
- [ ] Sidebar tracks scroll position
- [ ] Mobile responsive (test at 375px width)
- [ ] All diagrams render legibly
- [ ] All tables are present with correct data
- [ ] Callout boxes use correct color coding
- [ ] Fonts load from Google Fonts CDN
- [ ] Dark theme is consistent throughout
- [ ] No horizontal scroll on any viewport width
