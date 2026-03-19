import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Rocket, Settings, Cpu, Search, ChevronDown, ChevronUp, ChevronRight,
  Menu, X, Phone, Mail, MessageSquare, Bell, RefreshCw, CheckCircle,
  AlertTriangle, AlertCircle, Info, Lightbulb, Star, ExternalLink,
  BookOpen, ArrowRight, ArrowDown, Circle, Zap, Shield, Clock, Users,
  FileText, Database, Activity, BarChart3, Target, PhoneCall, Monitor,
  Hash, Layers, Eye, ClipboardList, Volume2, Sun, Moon, ArrowLeft
} from 'lucide-react';
import Footer from './src/Footer.jsx';

// ══════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ══════════════════════════════════════════════════════════════
// Theme-sensitive colors use CSS custom properties so they switch automatically.
// Accent colors stay as hex constants (same in both themes).
const C = {
  bg1: 'var(--bg1)', bg2: 'var(--bg2)', bg3: 'var(--bg3)', bg4: 'var(--bg4)',
  t1: 'var(--t1)', t2: 'var(--t2)', t3: 'var(--t3)',
  orange: '#F97316', blue: '#3B82F6', purple: '#8B5CF6',
  green: '#10B981', red: '#EF4444', yellow: '#F59E0B',
  border: 'var(--border)', borderActive: '#3B82F6',
};

const THEME_VARS = {
  dark: {
    '--bg1': '#0B0F1A', '--bg2': '#111827', '--bg3': '#1F2937', '--bg4': '#374151',
    '--t1': '#F9FAFB', '--t2': '#9CA3AF', '--t3': '#6B7280',
    '--border': '#1F2937', '--bg1-alpha': '#0B0F1Aee',
    '--code-bg': '#1F2937', '--code-fg': '#10B981',
  },
  light: {
    '--bg1': '#F8FAFC', '--bg2': '#FFFFFF', '--bg3': '#F1F5F9', '--bg4': '#E2E8F0',
    '--t1': '#0F172A', '--t2': '#475569', '--t3': '#64748B',
    '--border': '#E2E8F0', '--bg1-alpha': '#F8FAFCee',
    '--code-bg': '#F1F5F9', '--code-fg': '#047857',
  },
};
const MONO = "'JetBrains Mono', monospace";
const SANS = "'IBM Plex Sans', sans-serif";
const TIER_COLORS = ['#F97316', '#3B82F6', '#8B5CF6'];
const TIER_NAMES = ['Foundations', 'Configuration & Operations', 'Advanced & Technical'];
const TIER_SUBTITLES = [
  'The Big Picture — What Is Outbound and Why Does It Matter?',
  'How It All Fits Together — Building and Running Campaigns',
  'Under the Hood — Architecture, Algorithms, and Edge Cases',
];
const TIER_AUDIENCES = [
  'For everyone — no experience needed',
  'For administrators & team leads',
  'For engineers, architects & power users',
];
const TIER_ICONS_KEYS = ['Rocket', 'Settings', 'Cpu'];

// ══════════════════════════════════════════════════════════════
// SECTION METADATA (all tiers)
// ══════════════════════════════════════════════════════════════
const SECTIONS = [
  { tier: 0, id: 't1s1', title: 'What Is Outbound Dialing?' },
  { tier: 0, id: 't1s2', title: 'The Building Blocks — What Makes Up a Campaign' },
  { tier: 0, id: 't1s3', title: 'The Six Dialing Modes — Explained Simply' },
  { tier: 0, id: 't1s4', title: 'The Life of an Outbound Call — Step by Step' },
  { tier: 0, id: 't1s5', title: 'Key Terminology Glossary' },
  { tier: 1, id: 't2s1', title: 'Prerequisites — What You Need Before Building a Campaign' },
  { tier: 1, id: 't2s2', title: 'Contact Lists — The Fuel for Your Campaign' },
  { tier: 1, id: 't2s3', title: 'DNC Lists & Compliance Controls' },
  { tier: 1, id: 't2s4', title: 'Call Analysis Response Sets' },
  { tier: 1, id: 't2s5', title: 'Wrap-Up Codes & Mappings' },
  { tier: 1, id: 't2s6', title: 'Rule Sets — Automating Before and After Every Call' },
  { tier: 1, id: 't2s7', title: 'Campaign Sequences & Campaign Rules' },
  { tier: 1, id: 't2s8', title: 'Running & Monitoring a Campaign' },
  { tier: 2, id: 't3s1', title: 'Telephony Architecture' },
  { tier: 2, id: 't3s2', title: 'The Predictive Algorithm' },
  { tier: 2, id: 't3s3', title: 'AMD — The Three-Layer Detection System' },
  { tier: 2, id: 't3s4', title: 'Architect Outbound Flows' },
  { tier: 2, id: 't3s5', title: 'Scripts & the Set Stage Action' },
  { tier: 2, id: 't3s6', title: 'API & Integration Architecture' },
  { tier: 2, id: 't3s7', title: 'Platform Limits — The Complete Reference' },
  { tier: 2, id: 't3s8', title: 'Licensing & Feature Matrix' },
  { tier: 2, id: 't3s9', title: 'Troubleshooting Decision Tree' },
];

// ══════════════════════════════════════════════════════════════
// T1 DATA
// ══════════════════════════════════════════════════════════════
const USE_CASES = [
  { icon: 'Phone', label: 'Collections', desc: 'Contacting customers about past-due accounts' },
  { icon: 'ClipboardList', label: 'Surveys', desc: 'Post-interaction satisfaction surveys' },
  { icon: 'Megaphone', label: 'Sales/Telemarketing', desc: 'Outbound sales campaigns' },
  { icon: 'Bell', label: 'Notifications', desc: 'Appointment reminders, service alerts' },
  { icon: 'RefreshCw', label: 'Customer Retention', desc: 'Win-back and renewal campaigns' },
  { icon: 'CheckCircle', label: 'Verification', desc: 'Identity or information confirmation calls' },
];

const MAP_NODES = [
  { id: 'contactList', label: 'CONTACT LIST', sub: 'Who to call', x: 400, y: 60 },
  { id: 'queue', label: 'QUEUE', sub: 'Agent group', x: 130, y: 150 },
  { id: 'dnc', label: 'DNC LISTS', sub: 'Who NOT to call', x: 670, y: 150 },
  { id: 'script', label: 'SCRIPT', sub: 'Agent screen', x: 80, y: 310 },
  { id: 'dialingMode', label: 'DIALING MODE', sub: 'How fast to dial', x: 110, y: 450 },
  { id: 'contactTime', label: 'TIME SETS', sub: 'When to call', x: 300, y: 540 },
  { id: 'carSet', label: 'CAR SET', sub: 'Call analysis responses', x: 720, y: 310 },
  { id: 'ruleSets', label: 'RULE SETS', sub: 'Automation logic', x: 690, y: 450 },
  { id: 'wrapUp', label: 'WRAP-UP CODES', sub: 'Call outcomes', x: 500, y: 540 },
];
const MAP_CENTER = { x: 400, y: 300 };

const NODE_TOOLTIPS = {
  contactList: { explanation: 'A spreadsheet of people to call — names, phone numbers, and any other data', analogy: 'Your address book' },
  queue: { explanation: 'A group of agents assigned to handle the campaign\'s calls', analogy: 'The team roster' },
  dnc: { explanation: 'Lists of phone numbers that must NEVER be called (legal requirement)', analogy: 'The "do not disturb" list' },
  script: { explanation: 'The screen that pops up for the agent showing contact info and a talk track', analogy: 'The agent\'s cheat sheet' },
  carSet: { explanation: 'Rules for what to do when a call connects — is it a person? A voicemail? A busy signal?', analogy: 'The "if this, then that" rulebook' },
  dialingMode: { explanation: 'How aggressively the system dials — from cautious (Preview) to maximum speed (Predictive)', analogy: 'The speed dial on a car' },
  ruleSets: { explanation: 'Automated logic that runs before or after each call — skip certain contacts, retry others, update data', analogy: 'The autopilot rules' },
  contactTime: { explanation: 'Windows of time when you\'re allowed to call, based on the contact\'s time zone', analogy: 'Business hours by time zone' },
  wrapUp: { explanation: 'Labels agents assign after each call to classify the outcome (e.g., "Sale", "No Answer", "Callback")', analogy: 'Filing the call result' },
};

const DIALING_MODES = [
  {
    name: 'Preview Dialing', speed: 1, abandon: 'None',
    best: 'High-value calls, complex accounts, sensitive situations, small teams',
    agents: 'Any (even 1 agent)', analogy: 'Reading the file before making the call',
    how: 'The system sends a contact record to the agent\'s screen. The agent reads the info, then decides whether to call or skip. The call is placed only when the agent clicks "Dial."',
    note: null,
  },
  {
    name: 'Progressive Dialing', speed: 2, abandon: 'Nearly zero',
    best: 'Compliance-sensitive campaigns, smaller teams (under 15 agents)',
    agents: '1+', analogy: 'One ball per juggler — safe and steady',
    how: 'When an agent becomes idle, the system immediately places exactly ONE call for that agent. 6 idle agents = 6 simultaneous calls. Strict 1:1 ratio.',
    note: null,
  },
  {
    name: 'Power Dialing', speed: 3, abandon: 'Low-Medium (system-managed)',
    best: 'Medium teams wanting higher throughput with compliance control',
    agents: '10–15 minimum recommended', analogy: 'A few balls per juggler — faster, but the system catches any drops',
    how: 'When an agent becomes idle, the system places MULTIPLE calls for that agent based on a configurable ratio (e.g., 3 calls per agent). The system adjusts the ratio in real time to stay under the abandon rate limit.',
    note: null,
  },
  {
    name: 'Predictive Dialing', speed: 5, abandon: 'Medium (algorithm-managed)',
    best: 'Large teams focused on maximum contacts per hour',
    agents: '15+ minimum (Genesys recommendation)', analogy: 'The system is playing chess three moves ahead',
    how: 'The system uses a statistical algorithm to predict WHEN each agent will finish their current call, and starts dialing BEFORE the agent is free — timing it so a live answer arrives just as the agent becomes available. This is the fastest mode.',
    note: 'Requires the agent script to have "Set Stage" actions configured, or it degrades to Power mode behavior',
  },
  {
    name: 'Agentless Dialing', speed: 4, abandon: 'N/A (no agents)',
    best: 'Notifications, reminders, surveys, voicemail drops',
    agents: '0', analogy: 'A robocall — but a legal, smart one',
    how: 'The system dials contacts with no agents involved at all. Live answers are routed to an automated IVR flow (Architect) that can play messages, collect input, or offer a transfer to a live agent.',
    note: null,
  },
  {
    name: 'External Calling', speed: 1, abandon: 'None',
    best: 'Strict TCPA manual-dial compliance requirements',
    agents: '1+', analogy: 'Using the system as a Rolodex while you make the call yourself',
    how: 'The system presents a contact record to the agent (like Preview), but the agent copies the number and dials using a separate third-party dialer or phone. Genesys Cloud does NOT place the call.',
    note: 'Genesys Cloud loses call recording, analytics, and interaction detail for these calls',
  },
];

const LIFECYCLE_STEPS = [
  { step: 1, title: 'CAMPAIGN TURNED ON', desc: 'Admin starts the campaign', color: C.green, icon: 'Zap' },
  {
    step: 2, title: 'CONTACT FILTERING', color: C.red, icon: 'Shield',
    desc: 'System checks each contact against:',
    checks: [
      'DNC List — Is this number blocked? → SKIP',
      'Contactable Time Set — Is it within calling hours? → SKIP (try later)',
      'Attempt Controls — Already called max times? → SKIP',
      'Callable Status — Marked uncallable by previous wrap-up? → SKIP',
      'Contact List Filter — Does contact match filter criteria? → SKIP',
      'Pre-Call Rules — Any rules say "don\'t dial"? → SKIP',
    ],
  },
  { step: 3, title: 'DIALING', desc: 'System places the call based on the dialing mode (Preview waits for agent, Predictive pre-dials, etc.)', color: C.blue, icon: 'PhoneCall' },
  {
    step: 4, title: 'CALL ANALYSIS (What happened?)', color: C.yellow, icon: 'Activity',
    desc: 'System detects what answered:',
    checks: [
      'Live Voice Detected → Route to Agent (or Flow)',
      'Fax/Modem → Hang up, mark number',
      'No Answer → Hang up after timeout (30 sec default)',
      'Busy Signal → Hang up, retry later',
      'Answering Machine → Hang up, play message, or route to flow',
      'SIT Tones → Hang up, permanently mark number as uncallable',
      'Disconnect/Error → Log and move on',
    ],
  },
  { step: 5, title: 'AGENT INTERACTION', desc: 'Agent sees the Script with contact info. Agent talks to the customer. Agent finishes and selects a Wrap-Up Code.', color: C.green, icon: 'Users' },
  {
    step: 6, title: 'POST-CALL PROCESSING', color: C.orange, icon: 'RefreshCw',
    desc: 'Wrap-Up Rules execute and Wrap-Up Code Mapping updates contact status:',
    checks: [
      '"Right Party Contact" → Contact is done (success)',
      '"Contact Uncallable" → Entire contact removed from future dialing',
      '"Number Uncallable" → Just this number removed, other numbers still active',
      'Default → Contact may be retried',
    ],
  },
  { step: 7, title: 'NEXT CONTACT', desc: 'System moves to the next eligible contact. Repeat until all contacts processed or campaign stopped.', color: C.blue, icon: 'ArrowRight' },
];

const GLOSSARY = [
  { term: 'Campaign', def: 'The master configuration that combines all components to execute outbound dialing', tier: 'Tier 2' },
  { term: 'Contact List', def: 'A data table (uploaded as CSV) containing customer records with phone numbers and metadata', tier: 'Tier 2' },
  { term: 'DNC (Do Not Contact)', def: 'A list of phone numbers or emails legally prohibited from being contacted', tier: 'Tier 2' },
  { term: 'CAR Set', def: 'Configuration defining what the system does when it detects a live voice, machine, busy, etc.', tier: 'Tier 2' },
  { term: 'AMD', def: 'Technology that analyzes audio after a call connects to determine if a person or machine answered', tier: 'Tier 3' },
  { term: 'ATZM', def: 'System that automatically determines a contact\'s time zone from their phone number area code or zip code', tier: 'Tier 2' },
  { term: 'Wrap-Up Code', def: 'A label an agent assigns after a call to categorize the outcome', tier: 'Tier 2' },
  { term: 'Rule Set', def: 'A collection of conditional rules that execute before (pre-call) or after (wrap-up) each call', tier: 'Tier 2' },
  { term: 'Campaign Sequence', def: 'A chain of campaigns that run one after another automatically', tier: 'Tier 2' },
  { term: 'Architect Flow', def: 'A visual IVR/routing design tool in Genesys Cloud used to build automated call handling logic', tier: 'Tier 3' },
  { term: 'Script', def: 'The UI page presented to agents during an outbound interaction showing contact data and action buttons', tier: 'Tier 2' },
  { term: 'Edge / Site', def: 'The telephony infrastructure (hardware or cloud) that originates outbound calls', tier: 'Tier 3' },
  { term: 'BYOC', def: '"Bring Your Own Carrier" — using your own SIP trunking provider instead of Genesys Cloud Voice', tier: 'Tier 3' },
  { term: 'CPS', def: 'Calls Per Second — the rate at which the organization can place outbound calls', tier: 'Tier 3' },
  { term: 'Set Stage', def: 'A script action essential for Predictive dialing that tells the algorithm where the agent is in their call flow', tier: 'Tier 3' },
  { term: 'Right Party Contact (RPC)', def: 'A successful connection with the intended person (the "right party")', tier: 'Tier 2' },
  { term: 'Abandon Rate', def: 'The percentage of calls where a contact answers but no agent is available within the compliance window', tier: 'Tier 2' },
  { term: 'Skills-Based Dialing', def: 'Routing contacts to agents with matching skills (e.g., language, product expertise)', tier: 'Tier 3' },
];

// ══════════════════════════════════════════════════════════════
// T2 DATA
// ══════════════════════════════════════════════════════════════
const PREREQUISITES = [
  { title: 'Telephony Configured', detail: 'You need a working voice connection. This is either Genesys Cloud Voice (easiest — built-in), BYOC Cloud (your SIP provider connected to Genesys\'s cloud), or BYOC Premises (on-prem Edge appliances). Without this, no calls can be placed. Your telephony "Site" or "Edge Group" is what you\'ll select in the campaign as the dialing infrastructure.' },
  { title: 'Phone Numbers Provisioned', detail: 'You need at least one phone number to display as Caller ID on outbound calls. This can be a Genesys Cloud Voice DID, a number from your BYOC carrier, or a number from your Genesys Edge. Campaigns require a Caller ID — they won\'t start without one.' },
  { title: 'Queue Created', detail: 'A queue is a container for a group of agents. For agent-based campaigns, you need a queue with agents assigned as members. The queue determines which agents receive outbound calls. You can use a dedicated outbound queue or a blended queue that handles both inbound and outbound.' },
  { title: 'Wrap-Up Codes Created', detail: 'You need at least one wrap-up code (beyond the defaults) for agents to disposition their calls. Then, in Outbound Settings → Wrap-Up Code Mappings, each code must be mapped to one of four categories: Right Party Contact (with a business category of Success, Neutral, or Failure), Contact Uncallable, Number Uncallable, or Default (retryable). This mapping drives all campaign retry logic.' },
  { title: 'Permissions Assigned', detail: 'Users who manage outbound need the Outbound Administrator role or granular permissions: Outbound > Campaign/Contact List/DNC List/Rule Set/etc. > Add/Edit/Delete/View. Agents need Outbound > Contact > View/Edit. Architect authors need Architect > Flow > Add/Edit/View.' },
  { title: 'Outbound Settings Reviewed', detail: 'Under Admin → Outbound → Settings, verify the organization-level defaults: Max Calls Per Agent (default 1.0), Max Line Utilization (default 70%), and the Number of Outbound Lines Per Campaign (default Lines or Weight mode).' },
];

const SETUP_SEQUENCE = ['Telephony', 'Numbers', 'Queue', 'Wrap-ups', 'Wrap-up Mappings', 'Contact List', 'DNC', 'CAR Set', 'Script', 'Rules', 'Campaign'];

const FORMAT_RULES = [
  'Phone numbers: minimum 10 digits; the system strips dashes and parentheses but keeps leading +',
  'For SMS: must be strict E.164 format (e.g., +18005551234)',
  'Empty fields: keep the comma placeholder — don\'t delete it',
  'Text with commas/spaces: wrap in double quotes',
  'Encoding: UTF-8 (important for international characters)',
  'Max per list: 1 million contacts, 50 columns, 10 phone number columns, 10 email columns',
];

const COLUMN_TABS = [
  { name: 'Phone Columns', content: 'Up to 10. Each has a Phone Type (Home, Work, Cell, Main) and optional paired Time Zone Column. Phone columns are dialed in order (column 1 first, then 2, etc.) unless a callback is scheduled on a specific number.' },
  { name: 'Email Columns', content: 'Up to 10. Each has an Email Type (Personal, Work). Used for email campaigns only.' },
  { name: 'Special Columns', content: 'Zip Code Column (enables ATZM), Unique Identifier Column (for dedup and append-matching, alphanumeric, max 100 chars), Skill Columns (up to 2, for skills-based dialing), Agent Owned Column (assigns contacts to specific agents by email/ID), Preview Mode Column (forces preview treatment per-contact).' },
  { name: 'System-Generated', content: 'Genesys automatically creates tracking columns: inin-outbound-id (UUID), ContactCallable (1/0), Callable–PhoneName (per-number), CallRecordLastAttempt–PhoneName, CallRecordLastResult–PhoneName, AutomaticTimeZone–PhoneName. These are read-only and updated by the system.' },
];

const DNC_TYPES = [
  { name: 'Internal DNC', desc: 'You upload a CSV of phone numbers or email addresses. Optional expiration date column (UTC format, max 180 days). Use for your organization\'s internal opt-out list. Numbers must match the exact format in your contact list (including +1 prefix if used).' },
  { name: 'Internal Custom DNC', desc: 'Uses custom column values instead of phone/email. Example: block all contacts with AccountID = "CLOSED-001". More flexible matching.' },
  { name: 'DNC.com Integration', desc: 'Real-time scrub against Contact Center Compliance Corporation\'s database. Provides federal DNC, state DNC, state holiday restrictions, time-of-day restrictions, and wireless/VoIP identification. Requires a DNC.com account and license key.' },
  { name: 'Gryphon Networks Integration', desc: 'Real-time TCPA, CFPB, FDCPA compliance scrubbing. Enforces state-specific and federal regulations dynamically. Requires Gryphon account.' },
];

const DNC_RULES = [
  'DNC lists have NO effect until assigned to a specific campaign',
  'Scheduled callbacks bypass DNC checking (by design — the contact consented)',
  'Phone format must match exactly between contact list and DNC list',
  'DNC lists can hold up to 1 million records each, 2 million per org total',
];

const WRAP_UP_MAPPINGS = [
  { code: 'Sale Complete', category: 'RIGHT PARTY CONTACT (Success)', effect: 'Contact DONE — won\'t be called again', icon: '✅' },
  { code: 'Not Interested', category: 'RIGHT PARTY CONTACT (Failure)', effect: 'Contact DONE — won\'t be called again', icon: '✅' },
  { code: 'Callback Request', category: 'RIGHT PARTY CONTACT (Neutral)', effect: 'Contact DONE (unless callback scheduled)', icon: '✅' },
  { code: 'Wrong Number', category: 'NUMBER UNCALLABLE', effect: 'THIS number removed, other numbers still active', icon: '⚠️' },
  { code: 'Deceased', category: 'CONTACT UNCALLABLE', effect: 'ALL numbers removed, contact fully excluded', icon: '❌' },
  { code: 'No Answer', category: 'DEFAULT', effect: 'Contact stays in the pool for retry', icon: '🔄' },
  { code: 'Busy', category: 'DEFAULT', effect: 'Contact stays in the pool for retry', icon: '🔄' },
];

const SYSTEM_WRAPUPS = [
  'ININ-OUTBOUND-BUSY — Busy signal detected',
  'ININ-OUTBOUND-MACHINE — Answering machine detected',
  'ININ-OUTBOUND-LIVE-VOICE — Live voice detected (when routed to flow, not agent)',
  'ININ-OUTBOUND-SIT-UNCALLABLE — SIT tones (permanently uncallable)',
  'ININ-OUTBOUND-DISCONNECT — Call disconnected',
  'ININ-OUTBOUND-ABANDON — Contact answered but no agent available in time',
  'And ~16 more covering various scenarios',
];

const EXAMPLE_RULES = [
  { title: 'VIP Treatment', type: 'Pre-Call', condition: 'IF column "AccountTier" equals "Platinum"', action: 'Switch to Preview mode (so agent can prepare before calling a high-value customer)' },
  { title: 'Retry Busy After 30 Minutes', type: 'Wrap-Up', condition: 'IF system disposition equals "ININ-OUTBOUND-BUSY"', action: 'Schedule Callback in 30 minutes' },
  { title: 'Caller ID by State', type: 'Pre-Call', condition: 'IF column "State" equals "CA"', action: 'Set Caller ID to "+14155551234" (local California number to improve answer rates)' },
  { title: 'Update CRM After Sale', type: 'Wrap-Up', condition: 'IF wrap-up code equals "Sale Complete"', action: 'Execute Data Action → Salesforce Update → Set Opportunity Status = "Closed Won"' },
];

const CAMPAIGN_RULE_CARDS = [
  { title: 'Auto-Recycle at 100% Progress', condition: 'Campaign Progress = 100%', action: 'Recycle Campaign (reset to beginning)', use: '"Always running" campaigns that never stop' },
  { title: 'Ramp Up When Agents Join', condition: 'Agent Count ≥ 20', action: 'Change Dialing Mode to Predictive', use: 'Start in Progressive mode for small early shift, switch to Predictive when full staff arrives' },
  { title: 'Alert on High Abandon Rate', condition: 'Compliance Abandon Rate ≥ 4.5%', action: 'Set Max Calls Per Agent to 1.5 (reduce aggression)', use: 'Automatic compliance safety valve' },
];

const CAMPAIGN_METRICS = [
  { metric: 'Connect Rate', healthy: '> 15%', warning: '5–15%', critical: '< 5% (bad data or exhausted list)' },
  { metric: 'Compliance Abandon Rate', healthy: '< 3%', warning: '3–5%', critical: '> 5% (legal risk!)' },
  { metric: 'Idle Agents', healthy: '0–2', warning: '3–5', critical: '> 5 (campaign can\'t keep up)' },
  { metric: 'Progress', healthy: 'Steadily increasing', warning: 'Flat (filters too aggressive?)', critical: 'Stuck at 0 (config error)' },
  { metric: 'Adj. Calls/Agent', healthy: '1.0–3.0', warning: '> 5.0 (very aggressive)', critical: '< 1.0 (campaign starved)' },
];

// ══════════════════════════════════════════════════════════════
// T3 DATA
// ══════════════════════════════════════════════════════════════
const CAPACITY_TABLE = [
  { model: 'Edge Micro', calls: '30', use: 'Small/remote sites' },
  { model: 'Small CHS', calls: '60', use: 'Small campaigns' },
  { model: 'Medium CHS', calls: '120', use: 'Medium campaigns' },
  { model: 'Large CHS', calls: '380', use: 'Large operations' },
  { model: 'Cloud Voice / BYOC Cloud', calls: 'Autoscaling (no fixed limit)', use: 'Any size' },
];

const PREDICTIVE_PRACTICES = [
  { good: true, text: 'Minimum 15 agents (20+ ideal)' },
  { good: true, text: 'Set Stage actions on every script page transition' },
  { good: true, text: 'Auto-answer enabled for agents (eliminates agent ring time variability)' },
  { good: true, text: 'Persistent connections (WebRTC or Polycom recommended)' },
  { good: true, text: 'Randomize contact list order (prevents clustering of bad numbers)' },
  { good: true, text: 'Set compliance abandon rate to 3% (provides buffer below the common 5% regulatory limit)' },
  { good: true, text: 'Start with a 10-minute warm-up period where the algorithm calibrates' },
  { good: false, text: 'Don\'t use with fewer than 10 agents' },
  { good: false, text: 'Don\'t mix very short and very long call types in the same campaign' },
  { good: false, text: 'Don\'t set Max Calls Per Agent too low (overrides the algorithm\'s optimization)' },
];

const ARCHITECT_CAPABILITIES = [
  'call.contact.[ColumnName] — Access any contact list column',
  'Play Audio / Play Audio on Silence — Audio playback',
  'Detect Silence — Wait for silence (machine beep detection)',
  'Collect Input — DTMF collection',
  'Call Data Action — CRM integration mid-flow',
  'Transfer to ACD — Transfer to live agent queue',
  'Transfer to Number/User/Group — Direct transfers',
  'Call Bot Flow — Connect to Dialogflow/Lex bot',
  'Set Wrap-Up Code — Assign outcome before disconnect',
  'Set Participant Data — Pass data to the next handler',
];

const SCRIPT_VARIABLES = [
  ['{{Outbound.Campaign ID}}', 'UUID of the current campaign'],
  ['{{Outbound.Campaign Name}}', 'Name of the current campaign'],
  ['{{Outbound.Contact ID}}', 'UUID of the current contact record'],
  ['{{Outbound.Contact List ID}}', 'UUID of the contact list'],
  ['{{Outbound.Contact List Name}}', 'Name of the contact list'],
  ['{{Outbound.<ColumnName>}}', 'Any contact list column value'],
  ['{{Scripter.Agent Name}}', 'Current agent\'s name'],
  ['{{Scripter.Queue Name}}', 'Current queue name'],
];

const API_ENDPOINTS = [
  { method: 'GET', path: '/api/v2/outbound/campaigns', use: 'List all campaigns' },
  { method: 'PUT', path: '/api/v2/outbound/campaigns/{id}', use: 'Update campaign (including start/stop via campaignStatus)' },
  { method: 'POST', path: '/api/v2/outbound/contactlists/{id}/contacts', use: 'Add/update contacts (bulk, works while campaign runs)' },
  { method: 'DELETE', path: '/api/v2/outbound/contactlists/{id}/contacts', use: 'Remove specific contacts' },
  { method: 'POST', path: '/api/v2/outbound/contactlists/{id}/clear', use: 'Remove ALL contacts (5-second wait before re-adding)' },
  { method: 'GET', path: '/api/v2/outbound/campaigns/{id}/progress', use: 'Get campaign progress' },
  { method: 'DELETE', path: '/api/v2/outbound/campaigns/{id}/progress', use: 'Recycle campaign (reset progress)' },
  { method: 'POST', path: '/api/v2/outbound/dnclists/{id}/phonenumbers', use: 'Add numbers to DNC list' },
  { method: 'POST', path: '/api/v2/outbound/contactlists/{id}/contacts/bulk', use: 'Bulk contact operations' },
];

const CRM_INTEGRATIONS = [
  { name: 'CX Cloud for Salesforce', desc: 'Bidirectional sync: Salesforce campaigns ↔ Genesys campaigns, Salesforce leads ↔ contact lists. Supports click-to-dial, screen pop, auto-logging, and disposition sync.' },
  { name: 'Data Actions', desc: 'REST/GraphQL integration with any external system. Used in pre-call rules (CRM lookup before dialing), wrap-up rules (CRM update after call), and Architect flows (mid-call data operations). Supports Salesforce, Zendesk, Microsoft Dynamics, and generic REST connectors.' },
  { name: 'Contact Management API', desc: 'External Event Lists and External Data Sources for real-time contact state management across systems. Supports Contact Merge operations for deduplication.' },
];

const PLATFORM_LIMITS = [
  ['Concurrent voice campaigns', '50 per org', ''],
  ['Concurrent digital campaigns', '25 per org', 'SMS + email combined'],
  ['Skills-based dialing campaigns', '5 active', '10 total including inactive'],
  ['Dynamic Queueing campaigns', '5 concurrent', '10 total including inactive'],
  ['Contacts per org', '5,000,000', 'Across all lists'],
  ['Contacts per list', '1,000,000', ''],
  ['Columns per list', '50', ''],
  ['Phone columns per list', '10', ''],
  ['Email columns per list', '10', ''],
  ['DNC records per list', '1,000,000', ''],
  ['DNC records per org', '2,000,000', ''],
  ['Campaign members (agents)', '1,000', '500 for skills-based, 200 for agent-owned'],
  ['Default CPS', '15 per org', 'Increasable via Genesys Care'],
  ['Max CPS per campaign', '50', ''],
  ['Rule sets per org', '1,000', ''],
  ['Campaign rules per org', '1,000', ''],
  ['Sequences per org', '1,000', ''],
  ['Data action conditions per rule', '2 max', ''],
  ['Data action executions per rule set', '10 per campaign', ''],
  ['Data action timeout', '20 seconds', ''],
  ['Contact list filters per org', '1,000', '1 per campaign'],
  ['Filter conditions per filter', '10', ''],
  ['Contactable time sets per org', '1,000', ''],
  ['CAR sets per org', '1,000', ''],
  ['Responses per CAR set', '1,000', ''],
  ['Campaign entities per type', '1,000 each', ''],
  ['SMS rate (short code)', '1,200/min', 'Up to 6,000 on request'],
  ['SMS rate (toll-free)', '180/min', ''],
  ['SMS rate (10DLC)', '70/min', ''],
  ['Email rate', '1,200/min', 'Org-wide'],
  ['Callback schedule max', '43,200 min (~30 days)', ''],
  ['Attempt controls max', '100 attempts', ''],
  ['Attempt reset period', '2–30 days', ''],
];

const LICENSE_MATRIX = [
  ['Outbound voice campaigns', true, true, true],
  ['Preview dialing', true, true, true],
  ['Progressive dialing', true, true, true],
  ['Power dialing', true, true, true],
  ['Predictive dialing', true, true, true],
  ['Agentless dialing', true, true, true],
  ['Inbound/outbound blending', true, true, true],
  ['Scheduled callbacks', true, true, true],
  ['Campaign sequences', true, true, true],
  ['SMS campaigns', 'add-on', true, true],
  ['Email campaigns', 'add-on', true, true],
  ['Proactive notifications', 'add-on', true, true],
  ['Agentless API', 'add-on', true, true],
];

const TROUBLESHOOTING = [
  { symptom: 'Campaign won\'t start', investigation: 'Check: Is the campaign status INVALID? Look at the error banner — common issues: no CAR set assigned (non-preview), no contact list, no queue, no caller ID, no Site/Edge Group, Edge is offline, no agents in queue, contact list has no phone columns, CAR set missing Transfer to Flow (agentless).' },
  { symptom: 'Campaign is running but not dialing', investigation: 'Check: Are there callable contacts? (Progress may be 100% or all contacts filtered) → Check contactable time sets (is it within the calling window for ALL contacts?) → Check DNC lists (are they blocking everyone?) → Check attempt controls (already maxed?) → Check contact list filter (too restrictive?) → Check Edge/Site capacity (Max Line Utilization at 0%?).' },
  { symptom: 'High abandon rate', investigation: 'Reduce Max Calls Per Agent → Increase agent count → Switch from Predictive to Power or Progressive → Check if agents are spending too long in ACW → Verify compliance abandon threshold is appropriate for your contact/answer rate.' },
  { symptom: 'AMD misclassifying live people as machines', investigation: 'Set ALSD to a lower sensitivity (or Disabled) → Accept slightly longer detection delay in exchange for accuracy → Understand that no AMD system is 100% — there is always a trade-off between speed and accuracy.' },
  { symptom: 'Agents getting dead air / silence on connect', investigation: 'This is AMD working — the detection delay creates a brief silence before the system classifies and routes. ALSD on Medium/High reduces this. Enabling auto-answer eliminates agent-side ring delay. If persistent, check SIP trunk media settings (ensure media method is "normal" not "proxy").' },
];

// ══════════════════════════════════════════════════════════════
// SEARCH INDEX
// ══════════════════════════════════════════════════════════════
export const SEARCH_INDEX = (() => {
  const idx = [];
  SECTIONS.forEach(s => idx.push({ text: s.title, label: s.title, sectionId: s.id, tier: s.tier, type: 'Section' }));
  USE_CASES.forEach(u => idx.push({ text: `${u.label} ${u.desc}`, label: u.label, sectionId: 't1s1', tier: 0, type: 'Use Case' }));
  MAP_NODES.forEach(n => idx.push({ text: `${n.label} ${n.sub}`, label: n.label, sectionId: 't1s2', tier: 0, type: 'Component' }));
  Object.entries(NODE_TOOLTIPS).forEach(([k, v]) => idx.push({ text: `${k} ${v.explanation} ${v.analogy}`, label: k.toUpperCase(), sectionId: 't1s2', tier: 0, type: 'Component' }));
  DIALING_MODES.forEach(m => idx.push({ text: `${m.name} ${m.how} ${m.best} ${m.analogy} ${m.note || ''}`, label: m.name, sectionId: 't1s3', tier: 0, type: 'Dialing Mode' }));
  LIFECYCLE_STEPS.forEach(s => idx.push({ text: `${s.title} ${s.desc} ${(s.checks || []).join(' ')}`, label: s.title, sectionId: 't1s4', tier: 0, type: 'Lifecycle Step' }));
  GLOSSARY.forEach(g => idx.push({ text: `${g.term} ${g.def}`, label: g.term, sectionId: 't1s5', tier: 0, type: 'Glossary' }));
  PREREQUISITES.forEach(p => idx.push({ text: `${p.title} ${p.detail}`, label: p.title, sectionId: 't2s1', tier: 1, type: 'Prerequisite' }));
  SETUP_SEQUENCE.forEach(s => idx.push({ text: s, label: s, sectionId: 't2s1', tier: 1, type: 'Setup Step' }));
  FORMAT_RULES.forEach(r => idx.push({ text: r, label: r.substring(0, 50), sectionId: 't2s2', tier: 1, type: 'Format Rule' }));
  COLUMN_TABS.forEach(c => idx.push({ text: `${c.name} ${c.content}`, label: c.name, sectionId: 't2s2', tier: 1, type: 'Column Type' }));
  DNC_TYPES.forEach(d => idx.push({ text: `${d.name} ${d.desc}`, label: d.name, sectionId: 't2s3', tier: 1, type: 'DNC Type' }));
  DNC_RULES.forEach(r => idx.push({ text: r, label: r.substring(0, 50), sectionId: 't2s3', tier: 1, type: 'DNC Rule' }));
  WRAP_UP_MAPPINGS.forEach(w => idx.push({ text: `${w.code} ${w.category} ${w.effect}`, label: w.code, sectionId: 't2s5', tier: 1, type: 'Wrap-Up Mapping' }));
  SYSTEM_WRAPUPS.forEach(w => idx.push({ text: w, label: w.substring(0, 40), sectionId: 't2s5', tier: 1, type: 'System Wrap-Up' }));
  EXAMPLE_RULES.forEach(r => idx.push({ text: `${r.title} ${r.type} ${r.condition} ${r.action}`, label: r.title, sectionId: 't2s6', tier: 1, type: 'Rule Example' }));
  CAMPAIGN_RULE_CARDS.forEach(r => idx.push({ text: `${r.title} ${r.condition} ${r.action} ${r.use}`, label: r.title, sectionId: 't2s7', tier: 1, type: 'Campaign Rule' }));
  CAMPAIGN_METRICS.forEach(m => idx.push({ text: `${m.metric} ${m.healthy} ${m.warning} ${m.critical}`, label: m.metric, sectionId: 't2s8', tier: 1, type: 'Metric' }));
  CAPACITY_TABLE.forEach(c => idx.push({ text: `${c.model} ${c.calls} ${c.use}`, label: c.model, sectionId: 't3s1', tier: 2, type: 'Capacity' }));
  PREDICTIVE_PRACTICES.forEach(p => idx.push({ text: p.text, label: p.text.substring(0, 50), sectionId: 't3s2', tier: 2, type: 'Practice' }));
  ARCHITECT_CAPABILITIES.forEach(c => idx.push({ text: c, label: c.substring(0, 50), sectionId: 't3s4', tier: 2, type: 'Flow Capability' }));
  SCRIPT_VARIABLES.forEach(v => idx.push({ text: `${v[0]} ${v[1]}`, label: v[0], sectionId: 't3s5', tier: 2, type: 'Script Variable' }));
  API_ENDPOINTS.forEach(a => idx.push({ text: `${a.method} ${a.path} ${a.use}`, label: `${a.method} ${a.path}`, sectionId: 't3s6', tier: 2, type: 'API' }));
  CRM_INTEGRATIONS.forEach(c => idx.push({ text: `${c.name} ${c.desc}`, label: c.name, sectionId: 't3s6', tier: 2, type: 'Integration' }));
  PLATFORM_LIMITS.forEach(l => idx.push({ text: `${l[0]} ${l[1]} ${l[2]}`, label: l[0], sectionId: 't3s7', tier: 2, type: 'Platform Limit' }));
  LICENSE_MATRIX.forEach(l => idx.push({ text: `${l[0]}`, label: l[0], sectionId: 't3s8', tier: 2, type: 'License Feature' }));
  TROUBLESHOOTING.forEach(t => idx.push({ text: `${t.symptom} ${t.investigation}`, label: t.symptom, sectionId: 't3s9', tier: 2, type: 'Troubleshooting' }));
  return idx;
})();

// ══════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ══════════════════════════════════════════════════════════════
const FontLoader = () => (
  <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');`}</style>
);

const ThemeStyle = ({ isDark }) => (
  <style>{`
    body { background-color: ${isDark ? '#0B0F1A' : '#F8FAFC'}; transition: background-color 0.3s ease; }
    ::-webkit-scrollbar-track { background: ${isDark ? '#111827' : '#F1F5F9'}; }
    ::-webkit-scrollbar-thumb { background: ${isDark ? '#374151' : '#CBD5E1'}; }
    ::-webkit-scrollbar-thumb:hover { background: ${isDark ? '#4B5563' : '#94A3B8'}; }
  `}</style>
);

const CalloutBox = ({ type = 'info', children }) => {
  const cfg = { info: { border: C.blue, Icon: Info }, warning: { border: C.yellow, Icon: AlertTriangle }, critical: { border: C.red, Icon: AlertCircle }, tip: { border: C.green, Icon: Lightbulb } }[type];
  return (
    <div className="rounded-lg p-4 my-4 flex gap-3" style={{ backgroundColor: C.bg2, borderLeft: `4px solid ${cfg.border}` }}>
      <cfg.Icon size={20} style={{ color: cfg.border, flexShrink: 0, marginTop: 2 }} />
      <div style={{ color: C.t2, fontFamily: SANS, fontSize: 14, lineHeight: 1.6 }}>{children}</div>
    </div>
  );
};

const ExpandableCard = ({ title, defaultOpen = false, accent = C.orange, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-lg overflow-hidden my-2 self-start transition-all duration-300" style={{ backgroundColor: C.bg2, border: `1px solid ${open ? accent : C.border}` }}>
      <button className="w-full flex items-center justify-between p-4 text-left cursor-pointer" onClick={() => setOpen(!open)} style={{ fontFamily: MONO, color: C.t1, fontSize: 14 }}>
        <span className="flex items-center gap-2">{open && <div className="w-1 h-6 rounded" style={{ backgroundColor: accent }} />}{title}</span>
        {open ? <ChevronUp size={18} style={{ color: C.t3 }} /> : <ChevronDown size={18} style={{ color: C.t3 }} />}
      </button>
      <div className="transition-all duration-300" style={{ maxHeight: open ? 2000 : 0, overflow: 'hidden', opacity: open ? 1 : 0 }}>
        <div className="px-4 pb-4" style={{ color: C.t2, fontFamily: SANS, fontSize: 14, lineHeight: 1.7 }}>{children}</div>
      </div>
    </div>
  );
};

const StarRating = ({ count, max = 5 }) => (
  <span className="inline-flex gap-0.5">{Array.from({ length: max }, (_, i) => <Star key={i} size={14} fill={i < count ? C.yellow : 'transparent'} style={{ color: i < count ? C.yellow : C.bg4 }} />)}</span>
);

const InteractiveTable = ({ headers, rows, searchable = false }) => {
  const [q, setQ] = useState('');
  const filtered = q ? rows.filter(r => r.some(c => String(c).toLowerCase().includes(q.toLowerCase()))) : rows;
  return (
    <div className="my-4">
      {searchable && <input className="w-full mb-3 px-3 py-2 rounded text-sm" style={{ backgroundColor: C.bg3, border: `1px solid ${C.border}`, color: C.t1, fontFamily: SANS }} placeholder="Search..." value={q} onChange={e => setQ(e.target.value)} />}
      <div className="overflow-x-auto rounded-lg" style={{ border: `1px solid ${C.border}` }}>
        <table className="w-full text-sm" style={{ fontFamily: SANS }}>
          <thead><tr>{headers.map((h, i) => <th key={i} className="text-left px-4 py-3 font-semibold" style={{ backgroundColor: C.bg3, color: C.t1, borderBottom: `1px solid ${C.border}`, fontFamily: MONO, fontSize: 12 }}>{h}</th>)}</tr></thead>
          <tbody>{filtered.map((row, ri) => <tr key={ri} className="transition-colors duration-150" style={{ backgroundColor: ri % 2 === 0 ? C.bg2 : C.bg1 }} onMouseEnter={e => e.currentTarget.style.backgroundColor = C.bg3} onMouseLeave={e => e.currentTarget.style.backgroundColor = ri % 2 === 0 ? C.bg2 : C.bg1}>{row.map((cell, ci) => <td key={ci} className="px-4 py-3" style={{ color: C.t2, borderBottom: `1px solid ${C.border}`, fontSize: 13 }}>{cell === true ? <span style={{ color: C.green }}>✅</span> : cell === false ? <span style={{ color: C.red }}>❌</span> : cell === 'add-on' ? <span style={{ color: C.yellow }}>Add-on</span> : cell}</td>)}</tr>)}</tbody>
        </table>
      </div>
    </div>
  );
};

const SectionHeading = ({ children, id }) => (
  <h2 id={id} className="text-xl md:text-2xl font-bold mb-4 mt-2" style={{ fontFamily: MONO, color: C.t1 }}>{children}</h2>
);

const Paragraph = ({ children }) => (
  <p className="mb-4" style={{ fontFamily: SANS, color: C.t2, fontSize: 15, lineHeight: 1.8 }}>{children}</p>
);

const SubHeading = ({ children }) => (
  <h3 className="text-base md:text-lg font-semibold mb-3 mt-6" style={{ fontFamily: MONO, color: C.t1 }}>{children}</h3>
);

const CodeBlock = ({ children }) => (
  <pre className="rounded-lg p-4 my-4 overflow-x-auto text-xs md:text-sm" style={{ backgroundColor: 'var(--code-bg)', color: 'var(--code-fg)', fontFamily: MONO, border: `1px solid ${C.border}`, lineHeight: 1.6 }}>{children}</pre>
);

// ══════════════════════════════════════════════════════════════
// COMPONENT MAP SVG (T1S2)
// ══════════════════════════════════════════════════════════════
const ComponentMapSVG = () => {
  const [active, setActive] = useState(null);
  return (
    <div className="my-6 overflow-x-auto">
      <svg viewBox="0 0 800 600" className="w-full" style={{ maxWidth: 800, minWidth: 600 }}>
        <defs>
          <filter id="glow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        {MAP_NODES.map(n => (
          <line key={`line-${n.id}`} x1={MAP_CENTER.x} y1={MAP_CENTER.y} x2={n.x} y2={n.y} stroke={C.border} strokeWidth="2" strokeDasharray="6,4" />
        ))}
        <g>
          <rect x={MAP_CENTER.x - 80} y={MAP_CENTER.y - 30} width={160} height={60} rx={12} fill={C.bg3} stroke={C.orange} strokeWidth={2} />
          <text x={MAP_CENTER.x} y={MAP_CENTER.y - 5} textAnchor="middle" fill={C.t1} fontFamily={MONO} fontSize={13} fontWeight="bold">CAMPAIGN</text>
          <text x={MAP_CENTER.x} y={MAP_CENTER.y + 15} textAnchor="middle" fill={C.t3} fontFamily={SANS} fontSize={10}>The orchestrator</text>
        </g>
        {MAP_NODES.map(n => {
          const isActive = active === n.id;
          const tooltip = NODE_TOOLTIPS[n.id];
          return (
            <g key={n.id} className="cursor-pointer" onClick={() => setActive(isActive ? null : n.id)} style={{ transition: 'transform 0.2s' }}>
              <rect x={n.x - 70} y={n.y - 25} width={140} height={50} rx={8} fill={C.bg2} stroke={isActive ? C.orange : C.border} strokeWidth={isActive ? 2 : 1} filter={isActive ? 'url(#glow)' : undefined} />
              <text x={n.x} y={n.y - 4} textAnchor="middle" fill={C.t1} fontFamily={MONO} fontSize={11} fontWeight="600">{n.label}</text>
              <text x={n.x} y={n.y + 12} textAnchor="middle" fill={C.t3} fontFamily={SANS} fontSize={9}>{n.sub}</text>
              {isActive && tooltip && (() => {
                const tw = 280;
                const tx = Math.max(8, Math.min(n.x - tw / 2, 800 - tw - 8));
                const above = n.y > 350;
                const ty = above ? n.y - 135 : n.y + 30;
                return (
                  <foreignObject x={tx} y={ty} width={tw} height={130}>
                    <div xmlns="http://www.w3.org/1999/xhtml" style={{ background: 'var(--bg3)', border: `1px solid ${C.orange}`, borderRadius: 8, padding: '10px 12px', boxSizing: 'border-box' }}>
                      <div style={{ color: 'var(--t1)', fontSize: 11, fontFamily: SANS, lineHeight: 1.5, marginBottom: 6 }}>{tooltip.explanation}</div>
                      <div style={{ color: C.yellow, fontSize: 10, fontFamily: MONO }}>Analogy: {tooltip.analogy}</div>
                    </div>
                  </foreignObject>
                );
              })()}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// TIER 1 CONTENT
// ══════════════════════════════════════════════════════════════
const Tier1Content = ({ sectionRefs }) => {
  const iconMap = { Phone, ClipboardList, Megaphone: Bell, Bell, RefreshCw, CheckCircle };
  return (
    <div className="space-y-16">
      {/* T1S1 */}
      <section ref={el => sectionRefs.current['t1s1'] = el} id="t1s1">
        <SectionHeading>What Is Outbound Dialing?</SectionHeading>
        <Paragraph>Outbound dialing is the process of a contact center proactively reaching out to customers, rather than waiting for customers to call in. Think of inbound as a restaurant where customers walk in — outbound is a food truck that drives to the customers.</Paragraph>
        <Paragraph>In Genesys Cloud, "Outbound" refers to a built-in campaign engine that automates the process of calling (or texting, or emailing) a list of contacts. Instead of agents manually looking up phone numbers and dialing one by one, the system does the dialing for them — finding the right contacts, calling at the right times, filtering out numbers that shouldn't be called, and connecting live answers to available agents.</Paragraph>
        <SubHeading>Key Use Cases</SubHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 my-4">
          {USE_CASES.map((uc, i) => (
            <div key={i} className="rounded-lg p-4 flex items-start gap-3 transition-all duration-200 hover:-translate-y-0.5" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
              <Phone size={20} style={{ color: C.orange, flexShrink: 0 }} />
              <div><div className="font-semibold text-sm" style={{ color: C.t1, fontFamily: MONO }}>{uc.label}</div><div className="text-xs mt-1" style={{ color: C.t2, fontFamily: SANS }}>{uc.desc}</div></div>
            </div>
          ))}
        </div>
        <SubHeading>Inbound vs Outbound</SubHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          {[
            { title: 'INBOUND', items: ['Customer → Phone → Queue → Agent', 'Customer initiates', 'Reactive', 'Routing decides WHO answers'], color: C.blue },
            { title: 'OUTBOUND', items: ['Campaign Engine → Phone → Customer ← Agent', 'Organization initiates', 'Proactive', 'Dialing decides WHO to call and WHEN'], color: C.orange },
          ].map((panel, i) => (
            <div key={i} className="rounded-lg p-5" style={{ backgroundColor: C.bg2, borderTop: `3px solid ${panel.color}` }}>
              <div className="font-bold mb-3 text-sm" style={{ color: panel.color, fontFamily: MONO }}>{panel.title}</div>
              {panel.items.map((item, j) => <div key={j} className="text-sm mb-1.5" style={{ color: C.t2, fontFamily: SANS }}>{item}</div>)}
            </div>
          ))}
        </div>
      </section>

      {/* T1S2 */}
      <section ref={el => sectionRefs.current['t1s2'] = el} id="t1s2">
        <SectionHeading>The Building Blocks — What Makes Up a Campaign</SectionHeading>
        <Paragraph>A campaign in Genesys Cloud is like a recipe — it combines specific ingredients to produce the outreach you want. No single component works alone; they must all be assembled together.</Paragraph>
        <CalloutBox type="tip">Click any node in the diagram below to see what it does and a simple analogy.</CalloutBox>
        <ComponentMapSVG />
        <SubHeading>Component Reference</SubHeading>
        <InteractiveTable
          headers={['Component', 'Simple Explanation', 'Analogy']}
          rows={Object.entries(NODE_TOOLTIPS).map(([k, v]) => {
            const node = MAP_NODES.find(n => n.id === k);
            return [node?.label || k, v.explanation, v.analogy];
          })}
        />
      </section>

      {/* T1S3 */}
      <section ref={el => sectionRefs.current['t1s3'] = el} id="t1s3">
        <SectionHeading>The Six Dialing Modes — Explained Simply</SectionHeading>
        <Paragraph>The dialing mode is the single most important decision when creating a campaign. It determines the speed, efficiency, compliance risk, and agent experience. Genesys Cloud offers six modes, which fall on a spectrum from "agent controls everything" to "the system controls everything."</Paragraph>
        <div className="my-6 rounded-lg p-4 overflow-x-auto" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
          <div className="flex items-center justify-between mb-2 min-w-[500px]">
            <span className="text-xs font-bold" style={{ color: C.orange, fontFamily: MONO }}>AGENT CONTROL</span>
            <span className="text-xs font-bold" style={{ color: C.purple, fontFamily: MONO }}>SYSTEM CONTROL</span>
          </div>
          <div className="h-2 rounded-full min-w-[500px]" style={{ background: `linear-gradient(90deg, ${C.orange}, ${C.blue}, ${C.purple})` }} />
          <div className="flex justify-between mt-2 min-w-[500px]">
            {DIALING_MODES.map((m, i) => <span key={i} className="text-[10px] text-center" style={{ color: C.t3, fontFamily: MONO, width: 80 }}>{m.name.split(' ')[0]}</span>)}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {DIALING_MODES.map((m, i) => (
            <ExpandableCard key={i} title={m.name} accent={C.orange}>
              <div className="space-y-2">
                <div><strong style={{ color: C.t1 }}>How it works:</strong> {m.how}</div>
                <div className="flex items-center gap-2"><strong style={{ color: C.t1 }}>Speed:</strong> <StarRating count={m.speed} /></div>
                <div><strong style={{ color: C.t1 }}>Abandon risk:</strong> <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: C.bg3, color: m.abandon === 'None' ? C.green : m.abandon.includes('N/A') ? C.blue : C.yellow }}>{m.abandon}</span></div>
                <div><strong style={{ color: C.t1 }}>Best for:</strong> {m.best}</div>
                <div><strong style={{ color: C.t1 }}>Agents needed:</strong> {m.agents}</div>
                <div><strong style={{ color: C.t1 }}>Think of it as:</strong> <em>{m.analogy}</em></div>
                {m.note && <CalloutBox type="warning">{m.note}</CalloutBox>}
              </div>
            </ExpandableCard>
          ))}
        </div>
      </section>

      {/* T1S4 */}
      <section ref={el => sectionRefs.current['t1s4'] = el} id="t1s4">
        <SectionHeading>The Life of an Outbound Call — Step by Step</SectionHeading>
        <Paragraph>Every outbound call follows the same lifecycle, regardless of dialing mode. Understanding this flow is key to understanding why each component exists.</Paragraph>
        <div className="my-6 space-y-0">
          {LIFECYCLE_STEPS.map((s, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: s.color + '22', color: s.color, border: `2px solid ${s.color}`, fontFamily: MONO }}>{s.step}</div>
                {i < LIFECYCLE_STEPS.length - 1 && <div className="w-0.5 flex-1 my-1" style={{ backgroundColor: C.border }} />}
              </div>
              <div className="pb-6 flex-1">
                <div className="font-bold text-sm mb-1" style={{ color: C.t1, fontFamily: MONO }}>{s.title}</div>
                <div className="text-sm" style={{ color: C.t2, fontFamily: SANS }}>{s.desc}</div>
                {s.checks && (
                  <div className="mt-2 space-y-1 pl-2" style={{ borderLeft: `2px solid ${s.color}33` }}>
                    {s.checks.map((c, ci) => <div key={ci} className="text-xs" style={{ color: C.t3, fontFamily: SANS }}>• {c}</div>)}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div className="flex gap-4 items-center">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: C.green + '22', border: `2px solid ${C.green}` }}>
              <CheckCircle size={16} style={{ color: C.green }} />
            </div>
            <div className="font-bold text-sm" style={{ color: C.green, fontFamily: MONO }}>CAMPAIGN COMPLETE (or recycle to start over)</div>
          </div>
        </div>
      </section>

      {/* T1S5 */}
      <section ref={el => sectionRefs.current['t1s5'] = el} id="t1s5">
        <SectionHeading>Key Terminology Glossary</SectionHeading>
        <InteractiveTable
          searchable
          headers={['Term', 'Definition', 'Deep Dive']}
          rows={GLOSSARY.map(g => [g.term, g.def, g.tier])}
        />
      </section>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// TIER 2 CONTENT
// ══════════════════════════════════════════════════════════════
const Tier2Content = ({ sectionRefs }) => {
  const [activeColTab, setActiveColTab] = useState(0);
  return (
    <div className="space-y-16">
      {/* T2S1 */}
      <section ref={el => sectionRefs.current['t2s1'] = el} id="t2s1">
        <SectionHeading>Prerequisites — What You Need Before Building a Campaign</SectionHeading>
        <Paragraph>Before creating your first outbound campaign, these platform-level components must already exist. Think of this as the foundation that all campaigns are built on.</Paragraph>
        <div className="space-y-3 my-4">
          {PREREQUISITES.map((p, i) => (
            <ExpandableCard key={i} title={`${i + 1}. ${p.title}`} accent={C.blue}>
              {p.detail}
            </ExpandableCard>
          ))}
        </div>
        <SubHeading>Recommended Setup Sequence</SubHeading>
        <div className="flex flex-wrap items-center gap-1 my-4 overflow-x-auto">
          {SETUP_SEQUENCE.map((s, i) => (
            <React.Fragment key={i}>
              <span className="px-3 py-1.5 rounded text-xs whitespace-nowrap" style={{ backgroundColor: C.bg3, color: C.t1, fontFamily: MONO, border: `1px solid ${C.border}` }}>{s}</span>
              {i < SETUP_SEQUENCE.length - 1 && <ArrowRight size={14} style={{ color: C.t3, flexShrink: 0 }} />}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* T2S2 */}
      <section ref={el => sectionRefs.current['t2s2'] = el} id="t2s2">
        <SectionHeading>Contact Lists — The Fuel for Your Campaign</SectionHeading>
        <Paragraph>Contact lists are uploaded as CSV or Excel files. The first row must be column headers.</Paragraph>
        <SubHeading>Formatting Rules</SubHeading>
        <ul className="space-y-1.5 my-3">
          {FORMAT_RULES.map((r, i) => <li key={i} className="text-sm flex items-start gap-2" style={{ color: C.t2, fontFamily: SANS }}><span style={{ color: C.blue }}>•</span> {r}</li>)}
        </ul>
        <SubHeading>Sample CSV</SubHeading>
        <CodeBlock>{`FirstName, LastName, HomePhone,    CellPhone,   Email,      ZipCode, AccountID, Balance
John,      Smith,    5551234567,  5559876543,  john@x.com, 30101,   A-1001,    250.00
Jane,      Doe,      5552345678,  5558765432,  jane@x.com, 90210,   A-1002,    125.50
"Bob, Jr", Wilson,   5553456789,  ,            bob@x.com,  10001,   A-1003,    0.00`}</CodeBlock>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-3 text-xs" style={{ fontFamily: SANS, color: C.t3 }}>
          <div className="p-2 rounded" style={{ backgroundColor: C.bg3 }}>↑ <strong style={{ color: C.blue }}>HomePhone</strong> → Phone Column (type: Home)</div>
          <div className="p-2 rounded" style={{ backgroundColor: C.bg3 }}>↑ <strong style={{ color: C.blue }}>CellPhone</strong> → Phone Column (type: Cell)</div>
          <div className="p-2 rounded" style={{ backgroundColor: C.bg3 }}>↑ Empty field → comma placeholder keeps alignment</div>
          <div className="p-2 rounded" style={{ backgroundColor: C.bg3 }}>↑ <strong style={{ color: C.blue }}>"Bob, Jr"</strong> → Quotes needed for commas in values</div>
          <div className="p-2 rounded" style={{ backgroundColor: C.bg3 }}>↑ <strong style={{ color: C.blue }}>ZipCode</strong> → Used for Automatic Time Zone Mapping</div>
          <div className="p-2 rounded" style={{ backgroundColor: C.bg3 }}>↑ <strong style={{ color: C.blue }}>AccountID</strong> → Good candidate for Unique Identifier</div>
        </div>
        <SubHeading>Column Types</SubHeading>
        <div className="flex gap-1 mb-3 overflow-x-auto">
          {COLUMN_TABS.map((t, i) => (
            <button key={i} className="px-3 py-1.5 rounded text-xs whitespace-nowrap cursor-pointer transition-colors" onClick={() => setActiveColTab(i)} style={{ backgroundColor: activeColTab === i ? C.blue : C.bg3, color: activeColTab === i ? '#fff' : C.t2, fontFamily: MONO }}>{t.name}</button>
          ))}
        </div>
        <div className="p-4 rounded-lg text-sm" style={{ backgroundColor: C.bg2, color: C.t2, fontFamily: SANS, border: `1px solid ${C.border}`, lineHeight: 1.7 }}>{COLUMN_TABS[activeColTab].content}</div>
        <SubHeading>Contact List Filters</SubHeading>
        <Paragraph>Filters let you target a subset of your contact list without creating a new list. Up to 10 conditions per filter using AND/OR logic. Conditions compare column values (equals, not equals, contains, greater than, less than, between, is set, is not set). Only ONE filter can be active per campaign. Use case: "Only dial contacts where State = 'CA' AND Balance {'>'} 100."</Paragraph>
      </section>

      {/* T2S3 */}
      <section ref={el => sectionRefs.current['t2s3'] = el} id="t2s3">
        <SectionHeading>DNC Lists & Compliance Controls</SectionHeading>
        <SubHeading>Four Types of DNC Lists</SubHeading>
        <div className="space-y-3 my-4">
          {DNC_TYPES.map((d, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
              <div className="font-semibold text-sm mb-2" style={{ color: C.t1, fontFamily: MONO }}>{i + 1}. {d.name}</div>
              <div className="text-sm" style={{ color: C.t2, fontFamily: SANS }}>{d.desc}</div>
            </div>
          ))}
        </div>
        <CalloutBox type="warning">
          <ul className="space-y-1">{DNC_RULES.map((r, i) => <li key={i}>• {r}</li>)}</ul>
        </CalloutBox>
        <SubHeading>Contactable Time Sets</SubHeading>
        <Paragraph>Define per-timezone calling windows. Default: 8:00 AM – 9:00 PM in the contact's local time (with a buffer stopping at 8:59 PM). Supports any IANA timezone. Works with ATZM or manual timezone columns. Key rule: if a contact's timezone makes them uncallable right now, ALL their phone numbers are skipped until the window opens — even if other numbers are in callable timezones.</Paragraph>
        <SubHeading>Attempt Controls</SubHeading>
        <Paragraph>Limit how many times a contact or specific phone number is attempted. Configurable per campaign. Max 100 attempts with a reset period of 2–30 days. Example: "Try each phone number up to 3 times with 2 hours between attempts, and try the contact a maximum of 9 times total."</Paragraph>
      </section>

      {/* T2S4 */}
      <section ref={el => sectionRefs.current['t2s4'] = el} id="t2s4">
        <SectionHeading>Call Analysis Response Sets</SectionHeading>
        <Paragraph>The Call Analysis Response (CAR) Set is the decision engine that runs the instant a call connects. It classifies WHAT answered the phone and then executes your configured action. Every campaign (except Preview) requires a CAR set.</Paragraph>
        <SubHeading>Call Classification Decision Tree</SubHeading>
        <div className="my-4 p-4 rounded-lg space-y-3" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
          <div className="font-bold text-sm" style={{ color: C.t1, fontFamily: MONO }}>CALL PLACED</div>
          <div className="pl-4" style={{ borderLeft: `2px solid ${C.border}` }}>
            <div className="font-semibold text-xs mb-2" style={{ color: C.yellow, fontFamily: MONO }}>Pre-Connect Detection</div>
            {['SIT Tones → Auto-mark UNCALLABLE (permanent) ❌', 'Busy Signal → Log as Busy, retry later 🔄', 'Fax/Modem → Log, mark number 📠', 'No Answer (timeout) → Log, retry later ⏰'].map((item, i) => (
              <div key={i} className="text-xs mb-1" style={{ color: C.t3, fontFamily: SANS }}>├── {item}</div>
            ))}
          </div>
          <div className="pl-4" style={{ borderLeft: `2px solid ${C.border}` }}>
            <div className="font-semibold text-xs mb-2" style={{ color: C.green, fontFamily: MONO }}>Post-Connect Detection (audio analysis)</div>
            <div className="pl-4 space-y-2">
              <div>
                <div className="text-xs font-semibold mb-1" style={{ color: C.t1, fontFamily: MONO }}>Live Voice → YOUR ACTION:</div>
                {['Transfer to Queue (agent handles) 👤', 'Transfer to Outbound Flow (IVR handles) 🤖', 'Hangup ❌'].map((a, i) => (
                  <div key={i} className="text-xs ml-4" style={{ color: C.t3 }}>• {a}</div>
                ))}
              </div>
              <div>
                <div className="text-xs font-semibold mb-1" style={{ color: C.t1, fontFamily: MONO }}>Answering Machine → YOUR ACTION:</div>
                {['Hangup ❌', 'Transfer to Queue (agent handles) 👤', 'Transfer to Outbound Flow (voicemail drop) 📩', '  └── [Optional] Wait for Beep before playing message'].map((a, i) => (
                  <div key={i} className="text-xs ml-4" style={{ color: C.t3 }}>• {a}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <SubHeading>Key Configuration Options</SubHeading>
        <div className="space-y-2 my-3">
          {[
            ['Live Voice Action', 'Transfer to Queue (most common), Transfer to Flow, or Hangup'],
            ['Answering Machine Action', 'Hangup (most common for compliance), Transfer to Flow (for voicemail drops)'],
            ['Beep Detection', 'Enable to wait for the answering machine beep before starting the flow message. Recommended: increase no-answer timeout to 60 seconds when using beep detection.'],
            ['AMD Sensitivity (ALSD)', 'Disabled (most accurate, slowest detection), Low, Medium, High (fastest, least accurate)'],
          ].map(([label, desc], i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-1 p-3 rounded" style={{ backgroundColor: C.bg2 }}>
              <span className="text-xs font-semibold whitespace-nowrap min-w-[180px]" style={{ color: C.blue, fontFamily: MONO }}>{label}:</span>
              <span className="text-xs" style={{ color: C.t2, fontFamily: SANS }}>{desc}</span>
            </div>
          ))}
        </div>
        <CalloutBox type="info">Even with AMD fully disabled, Genesys Cloud's voiceprint database and tone detection still catch approximately 2/3 of answering machines. "Disabling AMD" only disables the speech-duration analysis — the other two detection layers remain active. This is a commonly misunderstood behavior.</CalloutBox>
      </section>

      {/* T2S5 */}
      <section ref={el => sectionRefs.current['t2s5'] = el} id="t2s5">
        <SectionHeading>Wrap-Up Codes & Mappings — Driving Campaign Retry Logic</SectionHeading>
        <Paragraph>Wrap-up codes are labels agents select after finishing a call. In outbound, they do more than just categorize — they directly control whether the contact gets called again.</Paragraph>
        <SubHeading>Wrap-Up Code Mapping</SubHeading>
        <div className="space-y-2 my-4">
          {WRAP_UP_MAPPINGS.map((w, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 rounded-lg text-xs" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}`, fontFamily: SANS }}>
              <span className="font-semibold min-w-[130px]" style={{ color: C.t1, fontFamily: MONO }}>"{w.code}"</span>
              <ArrowRight size={12} style={{ color: C.t3 }} className="hidden sm:block" />
              <span className="min-w-[220px]" style={{ color: C.blue }}>{w.category}</span>
              <ArrowRight size={12} style={{ color: C.t3 }} className="hidden sm:block" />
              <span style={{ color: C.t2 }}>{w.icon} {w.effect}</span>
            </div>
          ))}
        </div>
        <ExpandableCard title="System-Assigned Wrap-Up Codes" accent={C.blue}>
          <div className="space-y-1">
            <div className="text-sm mb-2" style={{ color: C.t2 }}>The dialer automatically assigns these codes when no agent is involved:</div>
            {SYSTEM_WRAPUPS.map((s, i) => <div key={i} className="text-xs" style={{ color: C.t3, fontFamily: MONO }}>• {s}</div>)}
            <div className="text-sm mt-2" style={{ color: C.t2 }}>These system codes should also be mapped in the Wrap-Up Code Mappings page to ensure proper retry behavior.</div>
          </div>
        </ExpandableCard>
      </section>

      {/* T2S6 */}
      <section ref={el => sectionRefs.current['t2s6'] = el} id="t2s6">
        <SectionHeading>Rule Sets — Automating Before and After Every Call</SectionHeading>
        <Paragraph>Rule sets are collections of IF/THEN logic that execute automatically. There are two types: pre-call rules (run before the dial) and wrap-up rules (run after the call ends). They're your automation engine.</Paragraph>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="rounded-lg p-4" style={{ backgroundColor: C.bg2, borderTop: `3px solid ${C.orange}` }}>
            <div className="font-bold text-sm mb-3" style={{ color: C.orange, fontFamily: MONO }}>PRE-CALL RULES</div>
            <div className="text-xs mb-2 font-semibold" style={{ color: C.t1 }}>CONDITIONS:</div>
            {['Contact list column values', 'Time since last attempt', 'Phone number type (home/cell)', 'Time of day / day of week', 'Data Action result (CRM lookup)'].map((c, i) => <div key={i} className="text-xs mb-1" style={{ color: C.t3 }}>• {c}</div>)}
            <div className="text-xs mb-2 mt-3 font-semibold" style={{ color: C.t1 }}>ACTIONS:</div>
            {['Don\'t Dial (skip this contact)', 'Switch to Preview mode', 'Set Caller ID (from column or static)', 'Route based on Skills', 'Update contact column', 'Execute Data Action', 'Mark contact/number uncallable'].map((a, i) => <div key={i} className="text-xs mb-1" style={{ color: C.t3 }}>• {a}</div>)}
          </div>
          <div className="rounded-lg p-4" style={{ backgroundColor: C.bg2, borderTop: `3px solid ${C.blue}` }}>
            <div className="font-bold text-sm mb-3" style={{ color: C.blue, fontFamily: MONO }}>WRAP-UP RULES</div>
            <div className="text-xs mb-2 font-semibold" style={{ color: C.t1 }}>CONDITIONS (everything from pre-call, PLUS):</div>
            {['Call analysis result (busy, machine, person)', 'System disposition (22 system codes)', 'Agent-assigned wrap-up code', 'Data Action result'].map((c, i) => <div key={i} className="text-xs mb-1" style={{ color: C.t3 }}>• {c}</div>)}
            <div className="text-xs mb-2 mt-3 font-semibold" style={{ color: C.t1 }}>ACTIONS:</div>
            {['Schedule Callback (5 min – 30 days)', 'Add number to DNC list', 'Mark contact/number uncallable', 'Update contact column', 'Execute Data Action (CRM update)', 'All pre-call actions too'].map((a, i) => <div key={i} className="text-xs mb-1" style={{ color: C.t3 }}>• {a}</div>)}
          </div>
        </div>
        <SubHeading>Example Rules</SubHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
          {EXAMPLE_RULES.map((r, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
              <div className="font-bold text-sm mb-2" style={{ color: C.t1, fontFamily: MONO }}>"{r.title}"</div>
              <div className="text-xs mb-1" style={{ color: C.t3 }}><span style={{ color: r.type === 'Pre-Call' ? C.orange : C.blue }}>Type:</span> {r.type}</div>
              <div className="text-xs mb-1" style={{ color: C.t3 }}><span style={{ color: C.yellow }}>Condition:</span> {r.condition}</div>
              <div className="text-xs" style={{ color: C.t3 }}><span style={{ color: C.green }}>Action:</span> {r.action}</div>
            </div>
          ))}
        </div>
      </section>

      {/* T2S7 */}
      <section ref={el => sectionRefs.current['t2s7'] = el} id="t2s7">
        <SectionHeading>Campaign Sequences & Campaign Rules</SectionHeading>
        <SubHeading>Campaign Sequences</SubHeading>
        <Paragraph>A sequence chains 2+ campaigns to run back-to-back. When Campaign A finishes (all contacts processed), Campaign B starts automatically. Use cases: run a morning "first attempt" campaign, then an afternoon "retry" campaign on a different contact list. The "Repeat" option loops the sequence indefinitely.</Paragraph>
        <SubHeading>Campaign Rules</SubHeading>
        <Paragraph>Campaign rules operate at the organization level and monitor campaign-level metrics (not individual calls). They can automatically adjust campaigns based on performance.</Paragraph>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
          {CAMPAIGN_RULE_CARDS.map((c, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
              <div className="font-bold text-sm mb-3" style={{ color: C.t1, fontFamily: MONO }}>"{c.title}"</div>
              <div className="text-xs mb-1" style={{ color: C.t3 }}><span style={{ color: C.yellow }}>Condition:</span> {c.condition}</div>
              <div className="text-xs mb-1" style={{ color: C.t3 }}><span style={{ color: C.green }}>Action:</span> {c.action}</div>
              <div className="text-xs mt-2 p-2 rounded" style={{ backgroundColor: C.bg3, color: C.t2 }}>Use: {c.use}</div>
            </div>
          ))}
        </div>
      </section>

      {/* T2S8 */}
      <section ref={el => sectionRefs.current['t2s8'] = el} id="t2s8">
        <SectionHeading>Running & Monitoring a Campaign</SectionHeading>
        <SubHeading>Campaign States</SubHeading>
        <div className="flex flex-wrap items-center gap-2 my-4">
          {['OFF', 'ON', 'STOPPING', 'COMPLETE', 'INVALID'].map((state, i) => (
            <React.Fragment key={i}>
              <span className="px-3 py-1.5 rounded text-xs font-bold" style={{
                backgroundColor: state === 'ON' ? C.green + '22' : state === 'INVALID' ? C.red + '22' : state === 'COMPLETE' ? C.blue + '22' : C.bg3,
                color: state === 'ON' ? C.green : state === 'INVALID' ? C.red : state === 'COMPLETE' ? C.blue : C.t1,
                border: `1px solid ${state === 'ON' ? C.green : state === 'INVALID' ? C.red : state === 'COMPLETE' ? C.blue : C.border}`,
                fontFamily: MONO,
              }}>{state}</span>
              {i < 3 && <ArrowRight size={14} style={{ color: C.t3 }} />}
            </React.Fragment>
          ))}
        </div>
        <SubHeading>The Campaigns Dashboard</SubHeading>
        <Paragraph>Real-time view showing: Connect Rate (live voice ÷ total dials, 10-minute rolling window), Compliance Abandon Rate and True Abandon Rate, Campaign Progress %, Idle Agents, Effective Idle Agents, Outstanding Calls, Adjusted Calls Per Agent, and Outbound Lines utilization.</Paragraph>
        <SubHeading>Key Metrics to Watch</SubHeading>
        <InteractiveTable
          headers={['Metric', 'Healthy', 'Warning', 'Critical']}
          rows={CAMPAIGN_METRICS.map(m => [m.metric, m.healthy, m.warning, m.critical])}
        />
      </section>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// TIER 3 CONTENT
// ══════════════════════════════════════════════════════════════
const Tier3Content = ({ sectionRefs }) => (
  <div className="space-y-16">
    {/* T3S1 */}
    <section ref={el => sectionRefs.current['t3s1'] = el} id="t3s1">
      <SectionHeading>Telephony Architecture — How Calls Actually Get Placed</SectionHeading>
      <Paragraph>Understanding the telephony layer is critical for troubleshooting call quality, capacity planning, and network design. Genesys Cloud outbound calls traverse a specific technical path that varies by telephony model.</Paragraph>
      <SubHeading>Three Telephony Models</SubHeading>
      <div className="space-y-4 my-4">
        {[
          { name: 'Genesys Cloud Voice', color: C.green, steps: ['Genesys Campaign Engine', 'AWS Media Microservices (autoscaling)', 'Tier-1 Carrier (Genesys-Owned)', 'PSTN'], bullets: ['Self-service number provisioning', 'No hardware required', 'Simplest setup'] },
          { name: 'BYOC Cloud', color: C.blue, steps: ['Genesys Campaign Engine', 'AWS Media Microservices (autoscaling)', 'YOUR SIP Provider (public internet)', 'PSTN'], bullets: ['Your carrier, your numbers', 'SIP trunk config required (FQDN/TGRP/DNIS)', 'Large, dynamic pool of AWS public IPs'] },
          { name: 'BYOC Premises', color: C.purple, steps: ['Genesys Campaign Engine', 'ON-PREM EDGE APPLIANCE(S) (your datacenter)', 'YOUR SIP PROVIDER (private network)', 'PSTN'], bullets: ['Fixed capacity per Edge (30–380 concurrent calls)', 'Edge handles SIP, media, AND call analysis locally', 'N+1 recommended for redundancy', 'Separate inbound/outbound SIP trunks recommended', '⚠️ GHS Edges deprecated Dec 2026'] },
        ].map((m, i) => (
          <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, borderLeft: `4px solid ${m.color}` }}>
            <div className="font-bold text-sm mb-3" style={{ color: m.color, fontFamily: MONO }}>{m.name}</div>
            <div className="flex flex-wrap items-center gap-1 mb-3">
              {m.steps.map((s, j) => (
                <React.Fragment key={j}>
                  <span className="px-2 py-1 rounded text-[10px]" style={{ backgroundColor: C.bg3, color: C.t1, fontFamily: MONO }}>{s}</span>
                  {j < m.steps.length - 1 && <ArrowRight size={12} style={{ color: C.t3 }} />}
                </React.Fragment>
              ))}
            </div>
            <div className="space-y-1">{m.bullets.map((b, j) => <div key={j} className="text-xs" style={{ color: C.t3 }}>• {b}</div>)}</div>
          </div>
        ))}
      </div>
      <SubHeading>Capacity Planning</SubHeading>
      <InteractiveTable headers={['Edge Model', 'Max Concurrent Calls', 'Use Case']} rows={CAPACITY_TABLE.map(c => [c.model, c.calls, c.use])} />
      <CalloutBox type="info">
        <strong>Org-level limits:</strong> Default CPS: 15 per organization (increase via Genesys Care request). Max CPS per campaign: 50. Max Line Utilization: Configurable percentage of total Edge/site capacity reserved for outbound.
      </CalloutBox>
    </section>

    {/* T3S2 */}
    <section ref={el => sectionRefs.current['t3s2'] = el} id="t3s2">
      <SectionHeading>The Predictive Algorithm — How It Actually Works</SectionHeading>
      <Paragraph>The Genesys Cloud predictive dialer uses a patented stage-based prediction mechanism. Understanding it is essential for optimizing campaign performance and troubleshooting pacing issues.</Paragraph>
      <SubHeading>Algorithm Inputs & Prediction Engine</SubHeading>
      <div className="my-4 rounded-lg p-4 space-y-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
        <div>
          <div className="font-bold text-xs mb-2" style={{ color: C.purple, fontFamily: MONO }}>ALGORITHM INPUTS (per agent, real-time):</div>
          {['Average Handle Time (AHT)', 'After-Call Work (ACW) duration', 'Current script STAGE (from Set Stage)', 'Historical stage durations for this agent', 'Current idle time', 'Recent contact list answer rate', 'Current compliance abandon rate', 'Number of outstanding (ringing) calls'].map((item, i) => (
            <div key={i} className="text-xs" style={{ color: C.t3 }}>• {item}</div>
          ))}
        </div>
        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
          <div className="font-bold text-xs mb-2" style={{ color: C.purple, fontFamily: MONO }}>PREDICTION ENGINE:</div>
          {[
            '1. Read current script stage for each agent on a call',
            '2. Look up this agent\'s historical time remaining from this stage to call end',
            '3. Factor in ACW estimate',
            '4. Calculate predicted "available at" time',
            '5. Estimate time-to-answer based on recent answer rate + avg ring time',
            '6. Estimate time-to-classify (AMD delay)',
            '7. If predicted_available_time ≈ time_to_answer + time_to_classify → PLACE CALL NOW',
            '8. Check: will this call push abandon rate over threshold? If yes → WAIT',
          ].map((step, i) => <div key={i} className="text-xs mb-1" style={{ color: C.t2, fontFamily: MONO }}>{step}</div>)}
        </div>
        <div className="text-xs font-bold text-center p-2 rounded" style={{ backgroundColor: C.purple + '22', color: C.purple, fontFamily: MONO }}>OUTPUT: Number of calls to place THIS SECOND</div>
      </div>
      <CalloutBox type="critical">
        <strong>Why Set Stage is critical:</strong> Without Set Stage actions in the script, the algorithm has no visibility into where the agent is in their call. It cannot predict when the call will end. Result: the algorithm falls back to Power mode behavior — waiting for the agent to become idle before dialing, rather than pre-dialing. This can reduce contacts-per-hour by 30–50%.
      </CalloutBox>
      <SubHeading>Best Practices for Predictive</SubHeading>
      <div className="space-y-1 my-3">
        {PREDICTIVE_PRACTICES.map((p, i) => (
          <div key={i} className="text-xs flex items-start gap-2" style={{ color: p.good ? C.green : C.red, fontFamily: SANS }}>
            <span>{p.good ? '✅' : '❌'}</span><span style={{ color: C.t2 }}>{p.text}</span>
          </div>
        ))}
      </div>
    </section>

    {/* T3S3 */}
    <section ref={el => sectionRefs.current['t3s3'] = el} id="t3s3">
      <SectionHeading>AMD — The Three-Layer Detection System</SectionHeading>
      <Paragraph>Answering Machine Detection in Genesys Cloud is not a single technology — it's three independent systems working in parallel. Understanding each layer explains seemingly contradictory behaviors (like "AMD is disabled but machines are still being caught").</Paragraph>
      <div className="space-y-3 my-4">
        {[
          { layer: 3, name: 'GENERAL SPEECH ANALYSIS', toggle: 'Togglable — this is what "AMD" toggle controls', color: C.purple, lines: ['Measures speech duration after connect:', '• < 2,200ms speech + 700ms+ silence → LIVE PERSON', '• > 2,200ms continuous speech → ANSWERING MACHINE', '• ALSD enhancement: uses ringback count to accelerate decision', '', '⏱️ Detection delay: ~2.5 seconds (Disabled ALSD) to ~0.8s (High)', '⚙️ This is what the AMD ON/OFF toggle controls'] },
          { layer: 2, name: 'TONE DETECTION', toggle: 'Always active — cannot be disabled', color: C.blue, lines: ['Listens for the answering machine "beep" tone', '• Detected beep → ANSWERING MACHINE', '• No beep within window → No determination from this layer', '', '🔊 Works independently of speech analysis'] },
          { layer: 1, name: 'AUDIO FINGERPRINT / VOICEPRINT', toggle: 'Always active — cannot be disabled', color: C.green, lines: ['Compares audio against Genesys proprietary database of known:', '• Carrier recorded messages ("The number you dialed...")', '• Common voicemail greetings', '• Network announcements', '', '🎵 Catches ~65% of machine answers even with AMD "disabled"'] },
        ].map((l, i) => (
          <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, borderLeft: `4px solid ${l.color}` }}>
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <span className="font-bold text-sm" style={{ color: l.color, fontFamily: MONO }}>LAYER {l.layer}: {l.name}</span>
              <span className="text-[10px] px-2 py-0.5 rounded" style={{ backgroundColor: C.bg3, color: C.t3 }}>{l.toggle}</span>
            </div>
            {l.lines.map((line, j) => <div key={j} className="text-xs" style={{ color: C.t3, fontFamily: line.startsWith('•') ? SANS : MONO }}>{line || '\u00A0'}</div>)}
          </div>
        ))}
      </div>
      <CalloutBox type="warning">
        <strong>KEY INSIGHT:</strong> "Disabling AMD" only disables Layer 3. Layers 1 and 2 remain active ALWAYS. This is why ~2/3 of machines are still caught with AMD "off."
      </CalloutBox>
      <SubHeading>ALSD Modes</SubHeading>
      <div className="my-4 rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs" style={{ color: C.green, fontFamily: MONO }}>Most accurate / Longest delay</span>
          <span className="text-xs" style={{ color: C.red, fontFamily: MONO }}>Fastest / Most misclassifications</span>
        </div>
        <div className="h-2 rounded-full" style={{ background: `linear-gradient(90deg, ${C.green}, ${C.yellow}, ${C.red})` }} />
        <div className="flex justify-between mt-2">
          {['Disabled (~2.5s)', 'Low', 'Medium', 'High (~0.8s)'].map((m, i) => <span key={i} className="text-[10px]" style={{ color: C.t3, fontFamily: MONO }}>{m}</span>)}
        </div>
        <Paragraph>ALSD works by analyzing the count of ringback tones before the call is answered. Fewer rings typically correlate with a person answering; many rings followed by a connect often indicate voicemail.</Paragraph>
      </div>
    </section>

    {/* T3S4 */}
    <section ref={el => sectionRefs.current['t3s4'] = el} id="t3s4">
      <SectionHeading>Architect Outbound Flows — Building Agentless Logic</SectionHeading>
      <Paragraph>Architect outbound flows are the IVR brain behind agentless campaigns and answering machine handling. They execute after the CAR set routes a call to "Transfer to Flow."</Paragraph>
      <SubHeading>Example: Appointment Reminder Flow</SubHeading>
      <div className="my-4 p-4 rounded-lg" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
        {[
          { indent: 0, text: 'FLOW START (call connected, contact data available)', color: C.green },
          { indent: 1, text: 'Decision: Was AMD result = Answering Machine?', color: C.yellow },
          { indent: 2, text: 'YES → Play Audio: "This is a reminder for {{FirstName}}..."', color: C.t3 },
          { indent: 3, text: '→ Detect Silence (wait for beep)', color: C.t3 },
          { indent: 3, text: '→ Play Audio on Silence: Leave voicemail message', color: C.t3 },
          { indent: 3, text: '→ Disconnect (wrap-up: "VM Left")', color: C.red },
          { indent: 2, text: 'NO (Live Person) →', color: C.green },
          { indent: 3, text: 'Play Audio: "Hello, reminder about your appointment..."', color: C.t3 },
          { indent: 3, text: 'Collect Input: "Press 1 to confirm, 2 to reschedule, 3 to cancel"', color: C.blue },
          { indent: 4, text: '1 → Data Action: Update CRM → Disconnect ("Confirmed")', color: C.green },
          { indent: 4, text: '2 → Transfer to ACD Queue ("Scheduling")', color: C.blue },
          { indent: 4, text: '3 → Data Action: Cancel Appt → Disconnect ("Cancelled")', color: C.red },
          { indent: 3, text: 'No Input / Timeout → Disconnect ("No Response")', color: C.t3 },
        ].map((line, i) => (
          <div key={i} className="text-xs" style={{ paddingLeft: line.indent * 20, color: line.color, fontFamily: MONO, marginBottom: 2 }}>{line.text}</div>
        ))}
      </div>
      <SubHeading>Key Architect Capabilities for Outbound</SubHeading>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-3">
        {ARCHITECT_CAPABILITIES.map((c, i) => (
          <div key={i} className="text-xs p-2 rounded" style={{ backgroundColor: C.bg2, color: C.t2, fontFamily: MONO }}>• {c}</div>
        ))}
      </div>
      <CalloutBox type="warning">Every outbound flow must have a default contact list and default wrap-up code configured. The flow will fail validation without these.</CalloutBox>
    </section>

    {/* T3S5 */}
    <section ref={el => sectionRefs.current['t3s5'] = el} id="t3s5">
      <SectionHeading>Scripts & the Set Stage Action — The Predictive Fuel</SectionHeading>
      <Paragraph>Scripts are the agent-facing UI during outbound calls. Beyond showing data, they are the feedback mechanism for the predictive algorithm.</Paragraph>
      <SubHeading>Script Architecture</SubHeading>
      <div className="my-4 p-4 rounded-lg space-y-3" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
        <div className="font-bold text-xs" style={{ color: C.purple, fontFamily: MONO }}>SCRIPT DESIGNER (no-code visual editor)</div>
        <div className="pl-4" style={{ borderLeft: `2px solid ${C.purple}33` }}>
          <div className="text-xs font-semibold mb-2" style={{ color: C.t1 }}>Pages (each page = a "stage" for Predictive):</div>
          {['Page 1: "Greeting" — Show name, account info → Set Stage: "Greeting"', 'Page 2: "Qualification" — Verify identity, present offer → Set Stage: "Qualification"', 'Page 3: "Closing" — Process sale/outcome → Set Stage: "Closing"', 'Page 4: "Wrap-Up" — Select code, add notes → Set Stage: "WrapUp"'].map((p, i) => (
            <div key={i} className="text-xs mb-1" style={{ color: C.t3, fontFamily: MONO }}>├── {p}</div>
          ))}
        </div>
        <div className="pl-4" style={{ borderLeft: `2px solid ${C.blue}33` }}>
          <div className="text-xs font-semibold mb-2" style={{ color: C.t1 }}>Outbound Actions:</div>
          {['Set Stage ← THE critical action for Predictive', 'Add to DNC List', 'Set Contact Column (update data on the fly)', 'Update Contact (commit changes to contact list)', 'Schedule Callback (agent or campaign-level)'].map((a, i) => (
            <div key={i} className="text-xs mb-1" style={{ color: C.t3 }}>• {a}</div>
          ))}
        </div>
        <div className="pl-4" style={{ borderLeft: `2px solid ${C.green}33` }}>
          <div className="text-xs font-semibold mb-2" style={{ color: C.t1 }}>General Actions:</div>
          {['Execute Data Action (CRM screen pop, lookup)', 'Invoke Secure Flow (PCI payment processing)', 'Blind/Consult Transfer', 'Open URL (launch external web app)'].map((a, i) => (
            <div key={i} className="text-xs mb-1" style={{ color: C.t3 }}>• {a}</div>
          ))}
        </div>
      </div>
      <SubHeading>Built-in Script Variables</SubHeading>
      <InteractiveTable headers={['Variable', 'Description']} rows={SCRIPT_VARIABLES} />
    </section>

    {/* T3S6 */}
    <section ref={el => sectionRefs.current['t3s6'] = el} id="t3s6">
      <SectionHeading>API & Integration Architecture</SectionHeading>
      <Paragraph>The Outbound API provides complete programmatic control over every outbound entity. This enables CRM-driven campaign management, real-time contact list updates, and custom analytics.</Paragraph>
      <SubHeading>Key API Endpoints</SubHeading>
      <InteractiveTable searchable headers={['Method', 'Endpoint', 'Use']} rows={API_ENDPOINTS.map(e => [e.method, e.path, e.use])} />
      <CalloutBox type="info">
        <strong>Notification API:</strong> Subscribe to <code style={{ fontFamily: MONO }}>v2.outbound.campaigns.{'{id}'}</code> topic for real-time campaign state changes. Recommended over polling since campaign stop is indeterminate.
      </CalloutBox>
      <SubHeading>CRM Integration Options</SubHeading>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
        {CRM_INTEGRATIONS.map((c, i) => (
          <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
            <div className="font-bold text-sm mb-2" style={{ color: C.t1, fontFamily: MONO }}>{c.name}</div>
            <div className="text-xs" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.6 }}>{c.desc}</div>
          </div>
        ))}
      </div>
    </section>

    {/* T3S7 */}
    <section ref={el => sectionRefs.current['t3s7'] = el} id="t3s7">
      <SectionHeading>Platform Limits — The Complete Reference</SectionHeading>
      <InteractiveTable searchable headers={['Resource', 'Limit', 'Notes']} rows={PLATFORM_LIMITS} />
    </section>

    {/* T3S8 */}
    <section ref={el => sectionRefs.current['t3s8'] = el} id="t3s8">
      <SectionHeading>Licensing & Feature Matrix</SectionHeading>
      <InteractiveTable headers={['Feature', 'GC1', 'GC2', 'GC3']} rows={LICENSE_MATRIX} />
    </section>

    {/* T3S9 */}
    <section ref={el => sectionRefs.current['t3s9'] = el} id="t3s9">
      <SectionHeading>Troubleshooting Decision Tree</SectionHeading>
      <Paragraph>Click each symptom to reveal the investigation path.</Paragraph>
      <div className="space-y-3 my-4">
        {TROUBLESHOOTING.map((t, i) => (
          <ExpandableCard key={i} title={t.symptom} accent={C.purple}>
            <div className="text-sm" style={{ lineHeight: 1.7 }}>{t.investigation}</div>
          </ExpandableCard>
        ))}
      </div>
    </section>
  </div>
);

// ══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════
const GenesysOutboundGuide = ({ onBack, isDark: isDarkProp, setIsDark: setIsDarkProp, initialNav }) => {
  const [activeTier, setActiveTier] = useState(initialNav?.tier ?? 0);
  const [activeSection, setActiveSection] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [visibleSections, setVisibleSections] = useState({});
  const [isDarkLocal, setIsDarkLocal] = useState(true);
  const sectionRefs = useRef({});
  const contentRef = useRef(null);

  // Use parent theme state when provided, otherwise own local state (standalone usage)
  const isDark = isDarkProp !== undefined ? isDarkProp : isDarkLocal;
  const setIsDark = setIsDarkProp || setIsDarkLocal;

  const themeVars = isDark ? THEME_VARS.dark : THEME_VARS.light;

  const tierSections = useMemo(() => SECTIONS.filter(s => s.tier === activeTier), [activeTier]);

  // IntersectionObserver for scroll tracking
  useEffect(() => {
    const observers = [];
    const currentRefs = sectionRefs.current;
    tierSections.forEach(s => {
      const el = currentRefs[s.id];
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          setVisibleSections(prev => ({ ...prev, [s.id]: entry.isIntersecting }));
          if (entry.isIntersecting) setActiveSection(s.id);
        },
        { threshold: 0.2, rootMargin: '-80px 0px -60% 0px' }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, [activeTier, tierSections]);

  // Reset scroll on tier change
  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveSection(tierSections[0]?.id || null);
  }, [activeTier, tierSections]);

  // Search across all tiers
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    const seen = new Set();
    return SEARCH_INDEX.filter(entry => {
      if (!entry.text.toLowerCase().includes(q)) return false;
      const key = `${entry.sectionId}-${entry.label}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 12);
  }, [searchQuery]);

  const scrollToSection = (id) => {
    const el = sectionRefs.current[id] || document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setSearchOpen(false);
    setSearchQuery('');
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    if (initialNav?.sectionId) {
      const timer = setTimeout(() => {
        const el = sectionRefs.current[initialNav.sectionId] || document.getElementById(initialNav.sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleTierSwitch = (tier) => {
    setActiveTier(tier);
    setMobileMenuOpen(false);
  };

  const TierIcon = ({ tier, size = 18 }) => {
    const icons = [Rocket, Settings, Cpu];
    const Icon = icons[tier];
    return <Icon size={size} />;
  };

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ ...themeVars, backgroundColor: C.bg1, color: C.t1, fontFamily: SANS }}>
      <FontLoader />
      <ThemeStyle isDark={isDark} />

      {/* STICKY HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-md" style={{ backgroundColor: 'var(--bg1-alpha)', borderBottom: `1px solid ${C.border}` }}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            {onBack && (
              <button className="p-1 cursor-pointer rounded transition-colors" onClick={onBack} style={{ color: C.t3 }} aria-label="Back to guides">
                <ArrowLeft size={18} />
              </button>
            )}
            <button className="lg:hidden p-1 cursor-pointer" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <span className="font-bold text-sm hidden sm:block" style={{ fontFamily: MONO, color: C.orange }}>GENESYS OUTBOUND GUIDE</span>
            <span className="font-bold text-sm sm:hidden" style={{ fontFamily: MONO, color: C.orange }}>GC OUTBOUND</span>
          </div>
          <div className="flex items-center gap-1">
            {[0, 1, 2].map(tier => (
              <button key={tier} onClick={() => handleTierSwitch(tier)}
                className="px-2 sm:px-3 py-1.5 rounded text-xs font-semibold transition-all duration-300 cursor-pointer flex items-center gap-1"
                style={{
                  fontFamily: MONO,
                  color: activeTier === tier ? TIER_COLORS[tier] : C.t3,
                  backgroundColor: activeTier === tier ? TIER_COLORS[tier] + '22' : 'transparent',
                  borderBottom: activeTier === tier ? `2px solid ${TIER_COLORS[tier]}` : '2px solid transparent',
                }}>
                <TierIcon tier={tier} size={14} />
                <span className="hidden sm:inline">{TIER_NAMES[tier].split(' ')[0]}</span>
                <span className="sm:hidden">T{tier + 1}</span>
              </button>
            ))}
            <button onClick={() => setIsDark(!isDark)} className="p-1.5 rounded cursor-pointer ml-2 transition-colors duration-300" style={{ color: C.t3 }} aria-label="Toggle theme">
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <div className="relative ml-1">
              <button onClick={() => setSearchOpen(!searchOpen)} className="p-1.5 rounded cursor-pointer" style={{ color: C.t3 }}>
                <Search size={16} />
              </button>
                {searchOpen && (
                  <div className="absolute right-0 top-10 w-80 rounded-lg shadow-xl p-3 z-50" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
                    <input autoFocus className="w-full px-3 py-2 rounded text-sm mb-2" style={{ backgroundColor: C.bg3, border: `1px solid ${C.border}`, color: C.t1, fontFamily: SANS }} placeholder="Search all content..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                    <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                      {searchResults.map((r, i) => (
                        <button key={i} onClick={() => { handleTierSwitch(r.tier); setTimeout(() => scrollToSection(r.sectionId), 100); }}
                          className="w-full text-left px-3 py-2 rounded text-xs cursor-pointer transition-colors" style={{ color: C.t2, fontFamily: SANS }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = C.bg3} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                          <div className="flex items-center gap-2">
                            <span className="inline-block w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: TIER_COLORS[r.tier] }} />
                            <span className="truncate font-medium" style={{ color: C.t1 }}>{r.label}</span>
                          </div>
                          <div className="ml-4 mt-0.5 text-[10px]" style={{ color: C.t3, fontFamily: MONO }}>{r.type} · Tier {r.tier + 1}</div>
                        </button>
                      ))}
                      {searchQuery.trim() && searchResults.length === 0 && (
                        <div className="text-xs px-3 py-4 text-center" style={{ color: C.t3 }}>No results for "{searchQuery}"</div>
                      )}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </header>

      {/* HERO */}
      <div className="py-12 md:py-20 text-center px-4" style={{ background: `linear-gradient(180deg, ${C.bg2} 0%, ${C.bg1} 100%)` }}>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-4" style={{ backgroundColor: TIER_COLORS[activeTier] + '22', color: TIER_COLORS[activeTier], fontFamily: MONO }}>
          <TierIcon tier={activeTier} size={14} />
          {TIER_AUDIENCES[activeTier]}
        </div>
        <h1 className="text-2xl md:text-4xl font-bold mb-3" style={{ fontFamily: MONO }}>
          <span style={{ color: TIER_COLORS[activeTier] }}>Tier {activeTier + 1}:</span> {TIER_NAMES[activeTier]}
        </h1>
        <p className="text-sm md:text-base max-w-2xl mx-auto" style={{ color: C.t2, fontFamily: SANS }}>{TIER_SUBTITLES[activeTier]}</p>
        <div className="flex justify-center gap-3 mt-8">
          {[0, 1, 2].map(tier => (
            <button key={tier} onClick={() => handleTierSwitch(tier)}
              className="px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-300"
              style={{
                fontFamily: MONO,
                backgroundColor: activeTier === tier ? TIER_COLORS[tier] : C.bg2,
                color: activeTier === tier ? '#fff' : C.t3,
                border: `1px solid ${activeTier === tier ? TIER_COLORS[tier] : C.border}`,
              }}>
              Tier {tier + 1}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="max-w-7xl mx-auto px-4 pb-20 flex gap-6">
        {/* SIDEBAR - desktop */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <div className="sticky top-16 space-y-1 py-4">
            <div className="text-[10px] uppercase tracking-wider mb-3 px-2" style={{ color: C.t3, fontFamily: MONO }}>Sections</div>
            {tierSections.map(s => (
              <button key={s.id} onClick={() => scrollToSection(s.id)}
                className="w-full text-left px-3 py-2 rounded text-xs cursor-pointer transition-all flex items-center gap-2"
                style={{
                  fontFamily: SANS,
                  color: activeSection === s.id ? C.t1 : C.t3,
                  backgroundColor: activeSection === s.id ? C.bg3 : 'transparent',
                  borderLeft: activeSection === s.id ? `2px solid ${TIER_COLORS[activeTier]}` : '2px solid transparent',
                }}>
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: visibleSections[s.id] ? TIER_COLORS[activeTier] : C.bg4 }} />
                {s.title.length > 35 ? s.title.substring(0, 35) + '...' : s.title}
              </button>
            ))}
          </div>
        </aside>

        {/* MOBILE SIDEBAR */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setMobileMenuOpen(false)}>
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute left-0 top-14 bottom-0 w-64 p-4 space-y-1 overflow-y-auto" style={{ backgroundColor: C.bg2 }} onClick={e => e.stopPropagation()}>
              {tierSections.map(s => (
                <button key={s.id} onClick={() => scrollToSection(s.id)}
                  className="w-full text-left px-3 py-2 rounded text-xs cursor-pointer"
                  style={{ fontFamily: SANS, color: activeSection === s.id ? C.t1 : C.t3, backgroundColor: activeSection === s.id ? C.bg3 : 'transparent' }}>
                  {s.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* CONTENT */}
        <main className="flex-1 min-w-0" ref={contentRef}>
          <div className="transition-opacity duration-300" style={{ opacity: 1 }}>
            {activeTier === 0 && <Tier1Content sectionRefs={sectionRefs} />}
            {activeTier === 1 && <Tier2Content sectionRefs={sectionRefs} />}
            {activeTier === 2 && <Tier3Content sectionRefs={sectionRefs} />}
          </div>
        </main>
      </div>

      {/* FOOTER */}
      <Footer title="Genesys Cloud Outbound Dialing — Interactive Knowledge Guide" />
    </div>
  );
};

export default GenesysOutboundGuide;
