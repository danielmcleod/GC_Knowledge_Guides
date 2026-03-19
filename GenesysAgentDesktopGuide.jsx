import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Rocket, Settings, Cpu, Search, ChevronDown, ChevronUp, ChevronRight,
  Menu, X, Phone, Mail, MessageSquare, Bell, RefreshCw, CheckCircle,
  AlertTriangle, AlertCircle, Info, Lightbulb, Star, ExternalLink,
  BookOpen, ArrowRight, ArrowDown, ArrowLeft, Circle, Zap, Shield, Clock, Users,
  FileText, Database, Activity, BarChart3, Target, PhoneCall, Monitor,
  Hash, Layers, Eye, ClipboardList, Volume2, Sun, Moon, GitBranch, Filter,
  Shuffle, UserCheck, Radio, Headphones, Globe, Calendar, Timer, TrendingUp,
  Award, Key, Lock, Unlock, MapPin
} from 'lucide-react';
import Footer from './src/Footer.jsx';

// ══════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ══════════════════════════════════════════════════════════════
const C = {
  bg1: 'var(--bg1)', bg2: 'var(--bg2)', bg3: 'var(--bg3)', bg4: 'var(--bg4)',
  t1: 'var(--t1)', t2: 'var(--t2)', t3: 'var(--t3)',
  orange: '#F97316', blue: '#3B82F6', purple: '#8B5CF6',
  green: '#10B981', red: '#EF4444', yellow: '#F59E0B',
  border: 'var(--border)', borderActive: '#F97316',
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
  'The Agent Workspace — What Agents See and Do Every Day',
  'Configuring Scripts, Screen Pops, Canned Responses & More',
  'Under the Hood — Architecture, APIs, AI, and Edge Cases',
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
  { tier: 0, id: 't1s1', title: 'What Is the Agent Desktop?' },
  { tier: 0, id: 't1s2', title: 'The Building Blocks — Key Components' },
  { tier: 0, id: 't1s3', title: 'Handling Interactions — The Agent Lifecycle' },
  { tier: 0, id: 't1s4', title: 'Channels on the Desktop' },
  { tier: 0, id: 't1s5', title: 'Key Terminology Glossary' },
  { tier: 1, id: 't2s1', title: 'Prerequisites — Before Configuring the Desktop' },
  { tier: 1, id: 't2s2', title: 'Script Designer — Deep Dive' },
  { tier: 1, id: 't2s3', title: 'Screen Pops & External URLs' },
  { tier: 1, id: 't2s4', title: 'Canned Responses & Quick Replies' },
  { tier: 1, id: 't2s5', title: 'Agent Assist & Knowledge Integration' },
  { tier: 1, id: 't2s6', title: 'Desktop Configuration & Settings' },
  { tier: 1, id: 't2s7', title: 'Supervisor Tools — Monitoring & Coaching' },
  { tier: 1, id: 't2s8', title: 'Transfers, Consults & Conferences' },
  { tier: 2, id: 't3s1', title: 'Agent Desktop Architecture — How It Really Works' },
  { tier: 2, id: 't3s2', title: 'Advanced Script Designer Patterns' },
  { tier: 2, id: 't3s3', title: 'Custom Screen Pop Integrations' },
  { tier: 2, id: 't3s4', title: 'Agent Assist Configuration — AI Features' },
  { tier: 2, id: 't3s5', title: 'API & Desktop Extensions' },
  { tier: 2, id: 't3s6', title: 'Platform Limits — The Complete Reference' },
  { tier: 2, id: 't3s7', title: 'Licensing & Feature Matrix' },
  { tier: 2, id: 't3s8', title: 'Troubleshooting Decision Tree' },
];

// ══════════════════════════════════════════════════════════════
// T1 DATA
// ══════════════════════════════════════════════════════════════
const DESKTOP_PANELS = [
  { icon: 'PhoneCall', label: 'Interaction Panel', desc: 'Displays active and alerting interactions with controls for accept, hold, mute, transfer, and disconnect' },
  { icon: 'FileText', label: 'Script Panel', desc: 'Renders agent-facing scripts with dynamic fields, prompts, and data bindings during interactions' },
  { icon: 'BookOpen', label: 'Knowledge Panel', desc: 'Surfaces relevant knowledge base articles agents can search and share during conversations' },
  { icon: 'MessageSquare', label: 'Canned Responses', desc: 'Pre-written reply templates agents can insert into chat and email with keyboard shortcuts' },
  { icon: 'Monitor', label: 'Queue Dashboard', desc: 'Real-time view of queue metrics, agents online, interactions waiting, and service levels' },
  { icon: 'Activity', label: 'Status Controls', desc: 'Controls for setting agent presence: Available, Away, Break, Meal, On Queue / Off Queue' },
];

const DESKTOP_MAP_NODES = [
  { id: 'interaction', label: 'INTERACTION PANEL', sub: 'Active conversations', x: 400, y: 60 },
  { id: 'script', label: 'SCRIPT DESIGNER', sub: 'Agent-facing forms', x: 130, y: 150 },
  { id: 'screenpop', label: 'SCREEN POPS', sub: 'Auto-open URLs / CRM', x: 670, y: 150 },
  { id: 'canned', label: 'CANNED RESPONSES', sub: 'Quick reply templates', x: 80, y: 310 },
  { id: 'agentassist', label: 'AGENT ASSIST', sub: 'AI-powered suggestions', x: 110, y: 450 },
  { id: 'status', label: 'STATUS CONTROLS', sub: 'Presence management', x: 300, y: 540 },
  { id: 'knowledge', label: 'KNOWLEDGE PANEL', sub: 'Article search & share', x: 720, y: 310 },
  { id: 'dashboard', label: 'QUEUE DASHBOARD', sub: 'Real-time metrics', x: 690, y: 450 },
];
const DESKTOP_MAP_CENTER = { x: 400, y: 300 };

const DESKTOP_NODE_TOOLTIPS = {
  interaction: { explanation: 'The central panel where agents see all active and alerting interactions with full call/chat/email controls — accept, hold, mute, transfer, conference, and disconnect', analogy: 'The control panel in a pilot\'s cockpit — every active flight instrument in one place' },
  script: { explanation: 'A form-based tool built in Script Designer that guides agents through conversations with dynamic fields, conditional questions, and data action lookups', analogy: 'A smart checklist that changes questions based on previous answers' },
  screenpop: { explanation: 'Automatically opens a URL (e.g., CRM record) when an interaction arrives, passing context like caller ID, account number, or interaction attributes', analogy: 'A secretary who pulls the customer\'s file and places it on your desk before you answer the phone' },
  canned: { explanation: 'A library of pre-written responses organized by category that agents can search, preview, and insert into chat or email with substitution variables', analogy: 'A recipe book of approved responses — pick the recipe and customize the ingredients' },
  agentassist: { explanation: 'AI-powered real-time suggestions that analyze the conversation and recommend knowledge articles, next-best actions, or suggested replies', analogy: 'A knowledgeable colleague whispering helpful answers in your ear during a meeting' },
  status: { explanation: 'Controls for managing agent presence (Available, Away, Break, Meal, Busy) and routing status (On Queue / Off Queue) across all media types', analogy: 'The "Open" / "Closed" sign on your desk — tells the system whether to send you work' },
  knowledge: { explanation: 'A searchable panel that surfaces knowledge base articles agents can read and share via link or inline content during active interactions', analogy: 'A built-in encyclopedia that auto-suggests the right page based on the conversation topic' },
  dashboard: { explanation: 'Real-time queue metrics visible to agents and supervisors — interactions waiting, agents available, service level, and average wait time', analogy: 'The departures board at an airport — shows the current state of every queue at a glance' },
};

const AGENT_LIFECYCLE = [
  { step: 1, title: 'INTERACTION ALERTS', desc: 'An inbound interaction arrives and the agent receives a toast notification with caller info, queue name, and channel type. The alerting timeout begins.', color: C.green, icon: 'Bell' },
  { step: 2, title: 'AGENT ACCEPTS', desc: 'The agent clicks Accept (or auto-answer is enabled). For voice, the WebRTC connection is established. For digital, the conversation panel opens. Screen pop fires if configured.', color: C.blue, icon: 'CheckCircle' },
  {
    step: 3, title: 'HANDLE INTERACTION', color: C.orange, icon: 'Headphones',
    desc: 'The agent works the interaction:',
    checks: [
      'Script panel loads with dynamic fields and data bindings',
      'Knowledge panel suggests relevant articles based on conversation context',
      'Agent can place on hold, mute, or initiate consult/transfer',
      'Canned responses available for chat and email channels',
      'Notes and interaction attributes can be added in real time',
    ],
  },
  { step: 4, title: 'CONSULT / TRANSFER (OPTIONAL)', desc: 'Agent may blind transfer to another queue or user, initiate a consult transfer (speak with target first), or start a conference call with an additional participant.', color: C.purple, icon: 'Users' },
  { step: 5, title: 'WRAP-UP (ACW)', desc: 'After the interaction ends, the agent enters After-Call Work: selects a wrap-up code from the queue\'s list, adds notes, completes disposition. Wrap-up can be mandatory, optional, or timed.', color: C.yellow, icon: 'ClipboardList' },
  { step: 6, title: 'AVAILABLE', desc: 'Agent returns to Available status and is ready for the next interaction. Utilization settings determine how many concurrent interactions the agent can handle per channel.', color: C.green, icon: 'UserCheck' },
];

const CHANNEL_DESKTOP = [
  { channel: 'Voice', desc: 'Full softphone controls — accept, hold, mute, blind/consult transfer, conference, DTMF keypad. WebRTC-based. One voice interaction at a time.', max: '1 concurrent', color: C.orange },
  { channel: 'Web Chat', desc: 'Real-time typing interface with canned responses, file attachments, co-browse initiation, and typing indicators. Multiple concurrent chats.', max: '1-15 concurrent (default 3)', color: C.blue },
  { channel: 'Email', desc: 'Rich-text compose/reply with templates, attachments, inline images. Email interactions can be parked and returned to later.', max: '1-15 concurrent (default 2)', color: C.green },
  { channel: 'Messaging (SMS/Social)', desc: 'Asynchronous messaging for SMS, WhatsApp, Facebook Messenger, LINE. Similar to chat but with longer idle timeouts and persistent conversation history.', max: '1-15 concurrent (default 4)', color: C.purple },
];

const GLOSSARY = [
  { term: 'Agent Desktop', def: 'The browser-based workspace where agents handle all customer interactions across voice, chat, email, and messaging channels', tier: 'Tier 1' },
  { term: 'Script', def: 'An agent-facing form designed in Script Designer with pages, variables, actions, and conditional logic shown during interactions', tier: 'Tier 2' },
  { term: 'Screen Pop', def: 'An automatic URL launch (typically a CRM record) triggered when an agent accepts an interaction, pre-populated with context data', tier: 'Tier 2' },
  { term: 'Canned Response', def: 'A pre-written template message organized in a library that agents insert into chat or email conversations, supporting substitution variables', tier: 'Tier 2' },
  { term: 'Agent Assist', def: 'AI-powered real-time suggestions that surface knowledge articles, next-best actions, or suggested replies during live interactions', tier: 'Tier 3' },
  { term: 'Wrap-Up Code', def: 'A disposition label agents assign after an interaction to categorize the outcome (e.g., "Resolved", "Escalation", "Follow-Up")', tier: 'Tier 2' },
  { term: 'ACW (After-Call Work)', def: 'The period after an interaction ends where the agent completes wrap-up tasks before becoming available again', tier: 'Tier 2' },
  { term: 'Utilization', def: 'The capacity model controlling how many simultaneous interactions an agent can handle per media type (voice, chat, email, message)', tier: 'Tier 2' },
  { term: 'Presence', def: 'An agent\'s current status in the system — Available, Away, Break, Meal, Busy, Offline — determining whether they can receive interactions', tier: 'Tier 1' },
  { term: 'On Queue', def: 'A routing status indicating the agent is active on a queue and eligible to receive routed interactions (separate from presence)', tier: 'Tier 1' },
  { term: 'WebRTC', def: 'Web Real-Time Communication — the browser-based technology used for voice calls in the Genesys Cloud softphone, eliminating the need for a desk phone', tier: 'Tier 3' },
  { term: 'Consult Transfer', def: 'A two-step transfer where the agent first speaks with the target agent/queue before completing the handoff, providing context', tier: 'Tier 1' },
  { term: 'Blind Transfer', def: 'A one-step transfer that immediately moves the interaction to the target without the originating agent speaking to the recipient first', tier: 'Tier 1' },
  { term: 'Conference', def: 'Adding a third party to an active voice call so all participants can speak simultaneously', tier: 'Tier 1' },
  { term: 'Screen Recording', def: 'Capturing the agent\'s screen activity during interactions for quality management, compliance, or training purposes', tier: 'Tier 3' },
  { term: 'Interaction Attributes', def: 'Key-value metadata attached to an interaction (e.g., customer tier, case number) accessible to scripts, screen pops, and APIs', tier: 'Tier 2' },
  { term: 'Data Action', def: 'A REST API integration callable from Architect flows or scripts to fetch or push data to external systems in real time', tier: 'Tier 2' },
  { term: 'Smart Assist', def: 'The Genesys AI capability that provides real-time transcription, knowledge suggestions, and coaching alerts during live voice interactions', tier: 'Tier 3' },
  { term: 'Embedded Client', def: 'A third-party application embedded as an iframe within the Genesys Cloud agent desktop via the AppFoundry or custom integration', tier: 'Tier 3' },
];

// ══════════════════════════════════════════════════════════════
// T2 DATA
// ══════════════════════════════════════════════════════════════
const PREREQUISITES = [
  { title: 'Users & Roles Configured', detail: 'Agent accounts must exist with the Agent role assigned. Supervisors need Supervisor or Admin roles. Key permissions: Conversation > Call/Chat/Email > Accept/Create/Transfer for agents, Scripter > Script > View/Edit/Publish for script designers, Analytics > Queue Observation > View for supervisors.' },
  { title: 'Queues & Routing Configured', detail: 'Queues must be created and agents assigned as members. Routing evaluation methods, alerting timeouts, ACW settings, and wrap-up codes must be configured on each queue. Architect flows must route interactions to these queues.' },
  { title: 'Telephony / WebRTC Ready', detail: 'For voice interactions, agents need a phone configured: WebRTC softphone (recommended — built into the browser), a SIP phone, or BYOC endpoint. WebRTC requires a compatible browser (Chrome, Edge, Firefox) with microphone permissions granted.' },
  { title: 'Knowledge Base Published (Optional)', detail: 'If using Knowledge Panel or Agent Assist, a knowledge base must be created and published with articles. Knowledge bases support FAQ, article, and how-to formats. Articles must be in "Published" status to appear in agent search results.' },
];

const SCRIPT_FEATURES = [
  { name: 'Pages', desc: 'Scripts support multiple pages that agents navigate sequentially or conditionally. Each page contains components like text fields, dropdowns, radio buttons, and display areas.', color: C.orange },
  { name: 'Variables', desc: 'Built-in and custom variables bind to interaction data. Built-in: {{Scripter.Customer Name}}, {{Scripter.ANI}}, {{Scripter.Queue Name}}. Custom variables store agent input for later use.', color: C.blue },
  { name: 'Actions', desc: 'Scripts can trigger actions: navigate to a page, set participant data, call a data action (REST API), transfer interaction, open a URL, or set wrap-up code.', color: C.green },
  { name: 'Conditional Logic', desc: 'Show/hide components or navigate pages based on variable values. Example: if customer tier = "VIP", show the VIP retention script page.', color: C.purple },
  { name: 'Data Bindings', desc: 'Components can bind to interaction attributes, participant data, or data action results. Changes flow bidirectionally — agent input updates the data, and data updates the display.', color: C.yellow },
  { name: 'Script Types', desc: 'Inbound scripts (shown on incoming calls), Outbound scripts (shown during campaign calls), and Default scripts per queue. Scripts are associated with queues or campaigns.', color: C.red },
];

const SCREENPOP_CONFIG = [
  ['URL Template', 'The URL pattern with variable placeholders, e.g., https://crm.example.com/contact?phone={{Scripter.ANI}}'],
  ['Trigger', 'When the screen pop fires: On Accept (default), On Alert, On Connect — typically On Accept for CRM lookups'],
  ['Target', 'Where the URL opens: New Browser Tab, Embedded Panel (iframe in desktop), or Custom Widget area'],
  ['Interaction Attributes', 'Key-value pairs set in Architect flows that can be passed as URL parameters: {{InteractionAttribute.caseId}}'],
  ['Context Variables', 'Flow-level variables from Architect that are accessible in screen pop URLs via participant data lookups'],
  ['Fallback URL', 'URL to display when required parameters are missing (e.g., unknown caller → generic CRM search page)'],
];

const CANNED_RESPONSE_FEATURES = [
  { feature: 'Libraries', desc: 'Organize canned responses into libraries (e.g., "Sales Greetings", "Support Closings", "Billing FAQ"). Libraries can be shared across queues.' },
  { feature: 'Categories', desc: 'Within each library, responses are grouped into categories for easy navigation. Agents can browse the tree or search.' },
  { feature: 'Substitution Variables', desc: 'Dynamic placeholders like {{customer_name}}, {{agent_name}}, {{queue_name}} that auto-populate when the response is inserted.' },
  { feature: 'Keyboard Shortcuts', desc: 'Agents type a shortcut (e.g., /greeting) in the compose area to quickly insert the associated canned response without opening the library.' },
  { feature: 'Search', desc: 'Full-text search across all available canned responses. Results show preview text and category. Agents select to insert.' },
  { feature: 'Channel Support', desc: 'Canned responses work in Web Chat, Email, and Messaging channels. Voice interactions use scripts instead of canned responses.' },
];

const AGENT_ASSIST_FEATURES = [
  { feature: 'Knowledge Suggestions', desc: 'AI analyzes the live conversation and automatically surfaces the most relevant knowledge base articles in real time. Agents can review and share.', color: C.blue },
  { feature: 'Article Search', desc: 'Agents can manually search the knowledge base during any interaction. Results are ranked by relevance and can be copied or sent as a link.', color: C.green },
  { feature: 'Smart Assist (Voice)', desc: 'Real-time voice transcription feeds into AI to suggest next-best actions, detect customer sentiment, and flag coaching moments to supervisors.', color: C.purple },
  { feature: 'Suggested Replies (Digital)', desc: 'AI recommends pre-composed replies based on conversation context. Agent reviews, edits if needed, and sends with one click.', color: C.orange },
];

const DESKTOP_CONFIG_OPTIONS = [
  ['Notification Preferences', 'Configure toast notifications for alerting interactions, missed calls, and system alerts. Options: sound alerts, visual alerts, or both'],
  ['Audio Settings', 'Select microphone, speaker, and ringer device. Adjust volume levels. Enable noise cancellation. Test audio before going on queue'],
  ['Utilization Config', 'Set maximum concurrent interactions per media type. Default: 1 voice, 3 chat, 2 email, 4 message. Admins configure at org or agent level'],
  ['Language & Locale', 'Set the desktop interface language. Supports 25+ languages. Affects labels, timestamps, and number formatting'],
  ['Do Not Disturb', 'Temporarily suppress all interaction alerts without going Off Queue. Useful for admin tasks while remaining technically available'],
  ['Workspace Layout', 'Agents can resize panels, collapse sidebars, and pin frequently used tools. Layout persists across sessions'],
];

const SUPERVISOR_TOOLS = [
  { name: 'Live Monitor (Listen)', desc: 'Silently listen to a live voice interaction without agent or customer awareness. Real-time audio stream via WebRTC.', color: C.green },
  { name: 'Whisper Coach', desc: 'Speak to the agent in real time while the customer cannot hear. Used for guiding agents through complex scenarios.', color: C.blue },
  { name: 'Barge-In', desc: 'Join the conversation as a full participant — both agent and customer can hear the supervisor. Used for escalation.', color: C.orange },
  { name: 'Agent Status Management', desc: 'View and change agent presence/status remotely. Force agents to Available, Break, or Off Queue from the supervisor view.', color: C.purple },
  { name: 'Queue Monitoring View', desc: 'Real-time dashboard with interactions waiting, agents available, SLA, abandon rate, and longest wait per queue.', color: C.yellow },
  { name: 'Interaction Details', desc: 'View active interaction details: customer info, duration, hold time, transfers, participant data, and wrap-up codes.', color: C.red },
];

const TRANSFER_TYPES = [
  { type: 'Blind Transfer', desc: 'Immediately moves the interaction to a target queue, user, or external number. The originating agent is disconnected instantly. No opportunity to brief the receiving agent.', analogy: 'Handing a letter to a mail carrier without explaining what\'s inside', color: C.orange },
  { type: 'Consult Transfer', desc: 'The agent first connects with the target (queue/user/external) to provide context while the customer waits on hold. Once briefed, the agent completes the transfer. If the target declines, the agent can retrieve the customer.', analogy: 'Walking the patient to the specialist\'s office and explaining the case before leaving', color: C.blue },
  { type: 'Conference', desc: 'Adds a third participant (another agent, supervisor, or external number) to the active call. All parties can speak. The originating agent can drop off or stay on the call.', analogy: 'Pulling a colleague into a meeting room where the conversation is already happening', color: C.purple },
];

// ══════════════════════════════════════════════════════════════
// T3 DATA
// ══════════════════════════════════════════════════════════════
const ARCHITECTURE_STEPS = [
  '1. Agent opens the Genesys Cloud web app in a supported browser (Chrome, Edge, Firefox)',
  '2. The single-page React application loads, authenticating via OAuth2 implicit grant',
  '3. WebSocket connection established to the Notification Service for real-time events',
  '4. When a voice call is accepted, a WebRTC peer connection is negotiated via SRTP/TURN servers',
  '5. Presence and routing status are managed by the Presence Service (distributed state machine)',
  '6. Interaction events (alerting, connected, disconnected, ACW) stream through the Conversation Service',
  '7. Script rendering engine fetches script definition JSON and binds interaction data to variables',
  '8. Screen pops fire via the Client App SDK or URL template engine upon interaction acceptance',
  '9. Agent Assist AI processes real-time audio/text streams and pushes suggestions via WebSocket',
  '10. All interaction events are durably logged to the Analytics Service for historical reporting',
];

const ADVANCED_SCRIPT_PATTERNS = [
  {
    title: 'Multi-Page Conditional Script',
    steps: ['Page 1: Greeting — display caller name and ANI from interaction data', 'Agent selects "Reason for Call" dropdown (Billing, Technical, Sales, Other)', 'IF Billing → navigate to Page 2A: Billing verification script', 'IF Technical → navigate to Page 2B: Technical troubleshooting tree', 'Page 3: Resolution — agent enters notes, sets wrap-up code via script action'],
  },
  {
    title: 'Data Action Integration',
    steps: ['Script loads → auto-trigger Data Action: GET /crm/customer?ani={{ANI}}', 'Data Action returns: customerName, accountTier, openCases, lastAgent', 'Bind results to script display fields (read-only text components)', 'IF accountTier = "Enterprise" → show VIP banner and escalation button', 'Agent clicks "Create Case" button → Data Action: POST /crm/cases with form data'],
  },
  {
    title: 'Outbound Campaign Script',
    steps: ['Campaign dialer connects call → outbound script loads automatically', 'Page 1: display contact name, company, campaign objective, call history', 'Agent follows guided pitch on Page 2 with objection-handling branches', 'Agent records outcome: Interested, Not Interested, Callback, Do Not Call', 'Script action sets wrap-up code and updates campaign contact list disposition'],
  },
];

const CUSTOM_SCREENPOP_PATTERNS = [
  { pattern: 'Embedded Client (iframe)', desc: 'Third-party app rendered inside the agent desktop via the Client App Integration. Uses postMessage API for bidirectional communication between the embedded app and Genesys Cloud.', color: C.blue },
  { pattern: 'AppFoundry Integration', desc: 'Pre-built integrations from the Genesys AppFoundry marketplace (e.g., Salesforce, ServiceNow, Zendesk). Installed via Admin > Integrations with guided setup.', color: C.green },
  { pattern: 'Custom URL Template', desc: 'Dynamic URLs with variable substitution: https://app.com/view?id={{participant.customField}}&phone={{Scripter.ANI}}. Opens in new tab or embedded frame.', color: C.orange },
  { pattern: 'postMessage API', desc: 'Bidirectional communication between embedded iframes and the Genesys Cloud desktop. Send/receive interaction events, participant data, and navigation commands.', color: C.purple },
];

const AI_FEATURES = [
  { feature: 'Real-Time Transcription', desc: 'Live speech-to-text transcription of voice calls displayed alongside the interaction panel. Supports multiple languages. Powers downstream AI features.', license: 'GC3' },
  { feature: 'Knowledge Suggestions', desc: 'AI analyzes transcription or chat text in real time and surfaces the top 3-5 most relevant knowledge articles. Confidence scores shown for each suggestion.', license: 'GC2+' },
  { feature: 'Suggested Responses', desc: 'AI generates recommended replies for digital channels based on conversation context and knowledge base content. Agent can accept, edit, or dismiss.', license: 'GC3' },
  { feature: 'Sentiment Analysis', desc: 'Real-time customer sentiment scoring (positive, neutral, negative) based on voice tone and word choice. Alerts supervisors when sentiment drops below threshold.', license: 'GC3' },
  { feature: 'Coaching Alerts', desc: 'Automated supervisor notifications when agent performance triggers a rule — long hold time, negative sentiment, policy keyword detected, or handle time exceeded.', license: 'GC3' },
  { feature: 'Predictive Engagement', desc: 'AI monitors website visitor behavior and predicts high-value engagement opportunities. Triggers proactive chat offers or routes web visitors to specific queues.', license: 'GC3' },
];

const API_ENDPOINTS = [
  { method: 'GET', path: '/api/v2/conversations', use: 'List active conversations for the authenticated user or org-wide' },
  { method: 'GET', path: '/api/v2/conversations/{conversationId}', use: 'Get full details of a specific conversation (participants, segments, attributes)' },
  { method: 'POST', path: '/api/v2/conversations/{conversationId}/participants/{participantId}/replace', use: 'Transfer or replace a participant in a conversation' },
  { method: 'PATCH', path: '/api/v2/conversations/{conversationId}/participants/{participantId}/attributes', use: 'Set or update interaction attributes (key-value metadata)' },
  { method: 'GET', path: '/api/v2/scripts', use: 'List all scripts with metadata (name, type, published status)' },
  { method: 'GET', path: '/api/v2/scripts/{scriptId}/pages', use: 'Get script page definitions with components and bindings' },
  { method: 'POST', path: '/api/v2/notifications/channels', use: 'Create a WebSocket notification channel for real-time events' },
  { method: 'GET', path: '/api/v2/knowledge/knowledgebases/{knowledgeBaseId}/search', use: 'Search knowledge base articles by query string with relevance ranking' },
  { method: 'GET', path: '/api/v2/responsemanagement/responses', use: 'List canned responses with library and category metadata' },
  { method: 'GET', path: '/api/v2/users/{userId}/presences', use: 'Get or set user presence (Available, Away, Break, etc.)' },
  { method: 'PATCH', path: '/api/v2/users/{userId}/routingstatus', use: 'Set routing status (On Queue / Off Queue) for an agent' },
  { method: 'GET', path: '/api/v2/recording/conversations/{conversationId}', use: 'Access screen and call recordings for a completed conversation' },
];

const PLATFORM_LIMITS = [
  ['Scripts per org', '1,000', 'Across inbound, outbound, and default types'],
  ['Pages per script', '50', ''],
  ['Components per script page', '100', 'Text fields, dropdowns, buttons, labels, etc.'],
  ['Variables per script', '200', 'Built-in + custom variables'],
  ['Data actions per script', '25', 'REST API integrations per script'],
  ['Canned response libraries per org', '200', ''],
  ['Canned responses per library', '1,000', ''],
  ['Categories per library', '100', ''],
  ['Substitution variables per response', '50', ''],
  ['Knowledge bases per org', '20', ''],
  ['Articles per knowledge base', '10,000', ''],
  ['Agent utilization — voice', '1 concurrent', 'Cannot be changed'],
  ['Agent utilization — chat', '1-15 concurrent', 'Default: 3'],
  ['Agent utilization — email', '1-15 concurrent', 'Default: 2'],
  ['Agent utilization — message', '1-15 concurrent', 'Default: 4'],
  ['Embedded client integrations', '25 per org', ''],
  ['Screen pop URL max length', '2,048 characters', 'After variable substitution'],
  ['Interaction attributes per conversation', '100 key-value pairs', 'Max key: 256 chars, max value: 2048 chars'],
  ['Wrap-up codes per queue', '200', ''],
  ['ACW timeout max', '900 seconds', '15 minutes'],
  ['WebRTC concurrent connections', '1 per browser tab', 'Multiple tabs not supported for voice'],
];

const LICENSE_MATRIX = [
  ['Agent Desktop (browser-based)', true, true, true],
  ['Voice (WebRTC softphone)', true, true, true],
  ['Web Chat handling', true, true, true],
  ['Email handling', true, true, true],
  ['Script Designer', true, true, true],
  ['Screen Pops (URL-based)', true, true, true],
  ['Canned Responses', true, true, true],
  ['Knowledge Base search (agent)', true, true, true],
  ['Blind & Consult Transfers', true, true, true],
  ['Supervisor Monitor / Whisper / Barge', true, true, true],
  ['Agent Assist — Knowledge Suggestions', false, true, true],
  ['Agent Assist — Suggested Responses', false, false, true],
  ['Real-Time Transcription', false, false, true],
  ['Sentiment Analysis', false, false, true],
  ['Predictive Engagement', false, false, true],
  ['Screen Recording', false, 'add-on', true],
  ['SMS / Messaging handling', 'add-on', true, true],
  ['Social Messaging (WhatsApp, FB)', 'add-on', 'add-on', true],
  ['Co-Browse', false, 'add-on', true],
  ['Speech & Text Analytics', false, false, true],
];

const TROUBLESHOOTING = [
  { symptom: 'Agent cannot hear caller / no audio', investigation: 'Check: Is the WebRTC softphone selected as the phone type? → Are browser microphone permissions granted? → Is the correct audio input/output device selected in Settings > Audio? → Try the audio test in Settings. → Is a VPN blocking WebRTC traffic (UDP ports 16384-32768)? → Check firewall rules for TURN/STUN servers. → Try a different browser (Chrome recommended). → Clear browser cache and reload.' },
  { symptom: 'Script not loading during interaction', investigation: 'Check: Is a script assigned to the queue the interaction is routing through? → Is the script published? (Draft scripts do not render) → Does the agent have Scripter > Script > View permission? → Are there JavaScript errors in the browser console? → Is the script type correct? (Inbound script for inbound calls, outbound for campaigns) → Try clearing browser cache and reloading.' },
  { symptom: 'Screen pop not firing', investigation: 'Check: Is the screen pop URL configured on the queue or script? → Is the trigger event correct (On Accept vs On Alert)? → Are the variable placeholders valid? (Typos in {{variable}} names cause blank URLs) → Is a popup blocker preventing new tab/window? → For embedded clients: is the integration enabled in Admin > Integrations? → Check browser console for blocked iframe errors (X-Frame-Options).' },
  { symptom: 'Canned responses not appearing', investigation: 'Check: Is the canned response library associated with the queue? → Does the agent have ResponseManagement > Response > View permission? → Is the response library published? → Is the interaction a digital channel? (Canned responses are not available for voice) → Try searching by keyword vs browsing categories. → Check if the library has responses in the correct language.' },
  { symptom: 'Agent stuck in ACW / cannot return to Available', investigation: 'Check: Is ACW set to Mandatory on the queue? (Agent must select a wrap-up code) → Has the agent selected a wrap-up code? → Is there a timed ACW that hasn\'t expired yet? → Check for ghost interactions: go to Interactions view → look for conversations in "connected" state that should have ended. → Try toggling Off Queue / On Queue. → As supervisor: force-change agent status via Admin.' },
  { symptom: 'Agent Assist / Knowledge suggestions not appearing', investigation: 'Check: Is Agent Assist enabled for the queue? → Is the knowledge base published with articles in "Published" status? → Does the agent have Knowledge > Manage > View permission? → Is the interaction on a supported channel? → For voice AI: is real-time transcription enabled and the language model correct? → Check the Agent Assist configuration in Admin > Contact Center > Agent Assist.' },
];

// ══════════════════════════════════════════════════════════════
// SEARCH INDEX
// ══════════════════════════════════════════════════════════════
export const SEARCH_INDEX = (() => {
  const idx = [];
  SECTIONS.forEach(s => idx.push({ text: s.title, label: s.title, sectionId: s.id, tier: s.tier, type: 'Section' }));
  GLOSSARY.forEach(g => idx.push({ text: `${g.term} ${g.def}`, label: g.term, sectionId: 't1s5', tier: 0, type: 'Glossary' }));
  DESKTOP_PANELS.forEach(p => idx.push({ text: `${p.label} ${p.desc}`, label: p.label, sectionId: 't1s2', tier: 0, type: 'Component' }));
  CHANNEL_DESKTOP.forEach(c => idx.push({ text: `${c.channel} ${c.desc}`, label: c.channel, sectionId: 't1s4', tier: 0, type: 'Channel' }));
  SCRIPT_FEATURES.forEach(f => idx.push({ text: `${f.name} ${f.desc}`, label: f.name, sectionId: 't2s2', tier: 1, type: 'Script Feature' }));
  SCREENPOP_CONFIG.forEach(([label, desc]) => idx.push({ text: `${label} ${desc}`, label, sectionId: 't2s3', tier: 1, type: 'Screen Pop Config' }));
  CANNED_RESPONSE_FEATURES.forEach(f => idx.push({ text: `${f.feature} ${f.desc}`, label: f.feature, sectionId: 't2s4', tier: 1, type: 'Canned Response' }));
  AGENT_ASSIST_FEATURES.forEach(f => idx.push({ text: `${f.feature} ${f.desc}`, label: f.feature, sectionId: 't2s5', tier: 1, type: 'Agent Assist' }));
  DESKTOP_CONFIG_OPTIONS.forEach(([label, desc]) => idx.push({ text: `${label} ${desc}`, label, sectionId: 't2s6', tier: 1, type: 'Config Option' }));
  SUPERVISOR_TOOLS.forEach(t => idx.push({ text: `${t.name} ${t.desc}`, label: t.name, sectionId: 't2s7', tier: 1, type: 'Supervisor Tool' }));
  TRANSFER_TYPES.forEach(t => idx.push({ text: `${t.type} ${t.desc}`, label: t.type, sectionId: 't2s8', tier: 1, type: 'Transfer Type' }));
  AI_FEATURES.forEach(f => idx.push({ text: `${f.feature} ${f.desc}`, label: f.feature, sectionId: 't3s4', tier: 2, type: 'AI Feature' }));
  API_ENDPOINTS.forEach(e => idx.push({ text: `${e.method} ${e.path} ${e.use}`, label: `${e.method} ${e.path}`, sectionId: 't3s5', tier: 2, type: 'API Endpoint' }));
  PLATFORM_LIMITS.forEach(([resource, limit]) => idx.push({ text: `${resource} ${limit}`, label: resource, sectionId: 't3s6', tier: 2, type: 'Limit' }));
  TROUBLESHOOTING.forEach(t => idx.push({ text: `${t.symptom} ${t.investigation}`, label: t.symptom, sectionId: 't3s8', tier: 2, type: 'Troubleshooting' }));
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
          <tbody>{filtered.map((row, ri) => <tr key={ri} className="transition-colors duration-150" style={{ backgroundColor: ri % 2 === 0 ? C.bg2 : C.bg1 }} onMouseEnter={e => e.currentTarget.style.backgroundColor = C.bg3} onMouseLeave={e => e.currentTarget.style.backgroundColor = ri % 2 === 0 ? C.bg2 : C.bg1}>{row.map((cell, ci) => <td key={ci} className="px-4 py-3" style={{ color: C.t2, borderBottom: `1px solid ${C.border}`, fontSize: 13 }}>{cell === true ? <span style={{ color: C.green }}>Included</span> : cell === false ? <span style={{ color: C.red }}>Not available</span> : cell === 'add-on' ? <span style={{ color: C.yellow }}>Add-on</span> : cell}</td>)}</tr>)}</tbody>
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
const DesktopComponentMapSVG = () => {
  const [active, setActive] = useState(null);
  return (
    <div className="my-6 overflow-x-auto">
      <svg viewBox="0 0 800 600" className="w-full" style={{ maxWidth: 800, minWidth: 600 }}>
        <defs>
          <filter id="glow-d"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        {DESKTOP_MAP_NODES.map(n => (
          <line key={`line-${n.id}`} x1={DESKTOP_MAP_CENTER.x} y1={DESKTOP_MAP_CENTER.y} x2={n.x} y2={n.y} stroke={C.border} strokeWidth="2" strokeDasharray="6,4" />
        ))}
        <g>
          <rect x={DESKTOP_MAP_CENTER.x - 80} y={DESKTOP_MAP_CENTER.y - 30} width={160} height={60} rx={12} fill={C.bg3} stroke={C.orange} strokeWidth={2} />
          <text x={DESKTOP_MAP_CENTER.x} y={DESKTOP_MAP_CENTER.y - 5} textAnchor="middle" fill={C.t1} fontFamily={MONO} fontSize={13} fontWeight="bold">AGENT DESKTOP</text>
          <text x={DESKTOP_MAP_CENTER.x} y={DESKTOP_MAP_CENTER.y + 15} textAnchor="middle" fill={C.t3} fontFamily={SANS} fontSize={10}>The agent workspace</text>
        </g>
        {DESKTOP_MAP_NODES.map(n => {
          const isActive = active === n.id;
          const tooltip = DESKTOP_NODE_TOOLTIPS[n.id];
          return (
            <g key={n.id} className="cursor-pointer" onClick={() => setActive(isActive ? null : n.id)} style={{ transition: 'transform 0.2s' }}>
              <rect x={n.x - 70} y={n.y - 25} width={140} height={50} rx={8} fill={C.bg2} stroke={isActive ? C.orange : C.border} strokeWidth={isActive ? 2 : 1} filter={isActive ? 'url(#glow-d)' : undefined} />
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
const Tier1Content = ({ sectionRefs }) => (
  <div className="space-y-16">
    {/* T1S1 */}
    <section ref={el => sectionRefs.current['t1s1'] = el} id="t1s1">
      <SectionHeading>What Is the Agent Desktop?</SectionHeading>
      <Paragraph>The Agent Desktop is the browser-based workspace where contact center agents handle all customer interactions — voice calls, web chats, emails, and social messages — from a single unified interface. Think of it as a pilot's cockpit: every instrument, control, and display the agent needs is consolidated into one screen, eliminating the need to switch between separate applications for each channel.</Paragraph>
      <Paragraph>In Genesys Cloud CX, the Agent Desktop is not a separate installed application. It runs entirely in the browser (Chrome, Edge, or Firefox), powered by WebRTC for voice, WebSockets for real-time events, and a modern React-based UI. Agents log in, go On Queue, and the desktop handles the rest — alerting, screen pops, scripts, knowledge suggestions, and interaction controls are all integrated into the workspace.</Paragraph>
      <SubHeading>Why the Unified Desktop Matters</SubHeading>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        {[
          { title: 'TRADITIONAL SETUP', items: ['Separate app per channel (phone, chat, email)', 'Manual CRM lookups for each interaction', 'No real-time guidance or suggestions', 'Copy-paste between systems', 'No unified view of customer history'], color: C.red },
          { title: 'GENESYS CLOUD DESKTOP', items: ['All channels in one browser tab', 'Automatic screen pops with customer context', 'AI-powered knowledge suggestions in real time', 'Canned responses with substitution variables', 'Full interaction history across all channels'], color: C.orange },
        ].map((panel, i) => (
          <div key={i} className="rounded-lg p-5" style={{ backgroundColor: C.bg2, borderTop: `3px solid ${panel.color}` }}>
            <div className="font-bold mb-3 text-sm" style={{ color: panel.color, fontFamily: MONO }}>{panel.title}</div>
            {panel.items.map((item, j) => <div key={j} className="text-sm mb-1.5" style={{ color: C.t2, fontFamily: SANS }}>{item}</div>)}
          </div>
        ))}
      </div>
      <CalloutBox type="tip">The Genesys Cloud Agent Desktop is entirely web-based — no desktop client installation required. This means agents can work from any device with a supported browser, making remote work and BYOD (bring your own device) seamless.</CalloutBox>
    </section>

    {/* T1S2 */}
    <section ref={el => sectionRefs.current['t1s2'] = el} id="t1s2">
      <SectionHeading>The Building Blocks — Key Components</SectionHeading>
      <Paragraph>The Agent Desktop is assembled from interconnected panels and tools. No single component works alone — they combine to create a complete, context-rich workspace. Think of it like a surgeon's operating room: the monitors (interaction panel), instruments (script panel), reference books (knowledge panel), and assistants (agent assist) all work together during each procedure.</Paragraph>
      <CalloutBox type="tip">Click any node in the diagram below to see what it does and a simple analogy.</CalloutBox>
      <DesktopComponentMapSVG />
      <SubHeading>Component Reference</SubHeading>
      <InteractiveTable
        headers={['Component', 'What It Does', 'Analogy']}
        rows={Object.entries(DESKTOP_NODE_TOOLTIPS).map(([k, v]) => {
          const node = DESKTOP_MAP_NODES.find(n => n.id === k);
          return [node?.label || k, v.explanation, v.analogy];
        })}
      />
    </section>

    {/* T1S3 */}
    <section ref={el => sectionRefs.current['t1s3'] = el} id="t1s3">
      <SectionHeading>Handling Interactions — The Agent Lifecycle</SectionHeading>
      <Paragraph>Every interaction an agent handles follows the same general lifecycle, regardless of channel. Understanding this flow is the key to understanding everything else about the desktop — scripts fire at specific stages, screen pops trigger on acceptance, and wrap-up codes are selected at the end.</Paragraph>
      <div className="my-6 space-y-0">
        {AGENT_LIFECYCLE.map((s, i) => (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: s.color + '22', color: s.color, border: `2px solid ${s.color}`, fontFamily: MONO }}>{s.step}</div>
              {i < AGENT_LIFECYCLE.length - 1 && <div className="w-0.5 flex-1 my-1" style={{ backgroundColor: C.border }} />}
            </div>
            <div className="pb-6 flex-1">
              <div className="font-bold text-sm mb-1" style={{ color: C.t1, fontFamily: MONO }}>{s.title}</div>
              <div className="text-sm" style={{ color: C.t2, fontFamily: SANS }}>{s.desc}</div>
              {s.checks && (
                <div className="mt-2 space-y-1 pl-2" style={{ borderLeft: `2px solid ${s.color}33` }}>
                  {s.checks.map((c, ci) => <div key={ci} className="text-xs" style={{ color: C.t3, fontFamily: SANS }}>* {c}</div>)}
                </div>
              )}
            </div>
          </div>
        ))}
        <div className="flex gap-4 items-center">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: C.green + '22', border: `2px solid ${C.green}` }}>
            <CheckCircle size={16} style={{ color: C.green }} />
          </div>
          <div className="font-bold text-sm" style={{ color: C.green, fontFamily: MONO }}>CYCLE COMPLETE — AGENT READY FOR NEXT INTERACTION</div>
        </div>
      </div>
    </section>

    {/* T1S4 */}
    <section ref={el => sectionRefs.current['t1s4'] = el} id="t1s4">
      <SectionHeading>Channels on the Desktop</SectionHeading>
      <Paragraph>Genesys Cloud handles all channels through the same desktop interface, but each channel has unique characteristics in how it appears and behaves. Agents can handle multiple digital interactions simultaneously (multi-interaction), but only one voice call at a time. The utilization model controls how many concurrent interactions each agent can manage per channel.</Paragraph>
      <div className="space-y-3 my-4">
        {CHANNEL_DESKTOP.map((ch, i) => (
          <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, borderLeft: `4px solid ${ch.color}` }}>
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <div className="font-bold text-sm" style={{ color: ch.color, fontFamily: MONO }}>{ch.channel}</div>
              <span className="text-[10px] px-2 py-0.5 rounded" style={{ backgroundColor: C.bg3, color: C.t3, fontFamily: MONO }}>{ch.max}</span>
            </div>
            <div className="text-sm" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.6 }}>{ch.desc}</div>
          </div>
        ))}
      </div>
      <CalloutBox type="info">Multi-interaction handling means an agent can be on a voice call AND handle 2 chats simultaneously — the desktop shows each interaction as a separate tab or panel. Utilization settings prevent overload by capping the total concurrent interactions per media type.</CalloutBox>
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

// ══════════════════════════════════════════════════════════════
// TIER 2 CONTENT
// ══════════════════════════════════════════════════════════════
const Tier2Content = ({ sectionRefs }) => {
  const [activeScriptTab, setActiveScriptTab] = useState(0);
  return (
    <div className="space-y-16">
      {/* T2S1 */}
      <section ref={el => sectionRefs.current['t2s1'] = el} id="t2s1">
        <SectionHeading>Prerequisites — Before Configuring the Desktop</SectionHeading>
        <Paragraph>Before customizing the agent experience with scripts, screen pops, and canned responses, these foundational components must be in place. Think of this as laying the plumbing and electrical before decorating the house.</Paragraph>
        <div className="space-y-3 my-4">
          {PREREQUISITES.map((p, i) => (
            <ExpandableCard key={i} title={`${i + 1}. ${p.title}`} accent={C.orange}>
              {p.detail}
            </ExpandableCard>
          ))}
        </div>
        <SubHeading>Recommended Configuration Sequence</SubHeading>
        <div className="flex flex-wrap items-center gap-1 my-4 overflow-x-auto">
          {['Users / Roles', 'Queues', 'Telephony', 'Scripts', 'Screen Pops', 'Canned Responses', 'Knowledge Base', 'Agent Assist', 'Test & Train'].map((s, i) => (
            <React.Fragment key={i}>
              <span className="px-3 py-1.5 rounded text-xs whitespace-nowrap" style={{ backgroundColor: C.bg3, color: C.t1, fontFamily: MONO, border: `1px solid ${C.border}` }}>{s}</span>
              {i < 8 && <ArrowRight size={14} style={{ color: C.t3, flexShrink: 0 }} />}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* T2S2 */}
      <section ref={el => sectionRefs.current['t2s2'] = el} id="t2s2">
        <SectionHeading>Script Designer — Deep Dive</SectionHeading>
        <Paragraph>The Script Designer is a visual drag-and-drop tool for building agent-facing forms that appear during interactions. Scripts guide agents through conversations, collect data, trigger API calls, and standardize the customer experience. Think of a script as a smart interactive checklist that adapts based on the conversation.</Paragraph>
        <SubHeading>Script Building Blocks</SubHeading>
        <div className="flex gap-1 mb-3 overflow-x-auto flex-wrap">
          {SCRIPT_FEATURES.map((t, i) => (
            <button key={i} className="px-3 py-1.5 rounded text-xs whitespace-nowrap cursor-pointer transition-colors" onClick={() => setActiveScriptTab(i)} style={{ backgroundColor: activeScriptTab === i ? t.color : C.bg3, color: activeScriptTab === i ? '#fff' : C.t2, fontFamily: MONO }}>{t.name}</button>
          ))}
        </div>
        <div className="p-4 rounded-lg text-sm" style={{ backgroundColor: C.bg2, color: C.t2, fontFamily: SANS, border: `1px solid ${C.border}`, lineHeight: 1.7 }}>{SCRIPT_FEATURES[activeScriptTab].desc}</div>
        <SubHeading>Example: Basic Inbound Script Structure</SubHeading>
        <div className="my-4 p-4 rounded-lg" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
          {[
            { indent: 0, text: 'SCRIPT LOADS (interaction accepted, queue has script assigned)', color: C.green },
            { indent: 1, text: 'Page 1: Customer Verification', color: C.orange },
            { indent: 2, text: 'Display: Caller Name = {{Scripter.Customer Name}}', color: C.t3 },
            { indent: 2, text: 'Display: ANI = {{Scripter.ANI}}, Queue = {{Scripter.Queue Name}}', color: C.t3 },
            { indent: 2, text: 'Input: "Verify last 4 of SSN" (text field, masked)', color: C.blue },
            { indent: 2, text: 'Button: "Verify" → Data Action: POST /crm/verify', color: C.blue },
            { indent: 1, text: 'Page 2: Reason for Call', color: C.orange },
            { indent: 2, text: 'Dropdown: "Select reason" (Billing, Technical, Account Change, Other)', color: C.blue },
            { indent: 2, text: 'IF Billing → Show billing-specific fields', color: C.purple },
            { indent: 2, text: 'IF Technical → Show troubleshooting checklist', color: C.purple },
            { indent: 1, text: 'Page 3: Resolution & Wrap-Up', color: C.orange },
            { indent: 2, text: 'Textarea: "Agent Notes" (saved to interaction attributes)', color: C.blue },
            { indent: 2, text: 'Button: "Set Wrap-Up" → Script Action: set wrap-up code', color: C.green },
          ].map((line, i) => (
            <div key={i} className="text-xs" style={{ paddingLeft: line.indent * 20, color: line.color, fontFamily: MONO, marginBottom: 2 }}>{line.text}</div>
          ))}
        </div>
        <CalloutBox type="info">Scripts must be PUBLISHED and assigned to a queue before they render for agents. Inbound scripts are shown during inbound interactions; outbound scripts are shown during campaign calls. Each queue can have one default script per interaction type.</CalloutBox>
      </section>

      {/* T2S3 */}
      <section ref={el => sectionRefs.current['t2s3'] = el} id="t2s3">
        <SectionHeading>Screen Pops & External URLs</SectionHeading>
        <Paragraph>Screen pops automatically open a URL — typically a CRM record — when an agent accepts an interaction. The URL is pre-populated with context data like the caller's phone number, account ID, or case number, so the agent immediately sees the customer's information without manual lookup. Think of it as a secretary pulling the customer's file and placing it on your desk before you pick up the phone.</Paragraph>
        <SubHeading>Screen Pop Configuration</SubHeading>
        <div className="space-y-2 my-3">
          {SCREENPOP_CONFIG.map(([label, desc], i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-1 p-3 rounded" style={{ backgroundColor: C.bg2 }}>
              <span className="text-xs font-semibold whitespace-nowrap min-w-[180px]" style={{ color: C.orange, fontFamily: MONO }}>{label}:</span>
              <span className="text-xs" style={{ color: C.t2, fontFamily: SANS }}>{desc}</span>
            </div>
          ))}
        </div>
        <SubHeading>URL Template Example</SubHeading>
        <CodeBlock>{`// Salesforce screen pop — opens contact record matching caller ANI
https://myorg.lightning.force.com/lightning/r/Contact/{{Scripter.ANI}}/view

// ServiceNow — open incident by case ID from interaction attributes
https://myorg.service-now.com/nav_to.do?uri=incident.do?sysparm_query=number={{InteractionAttribute.caseId}}

// Custom CRM — multiple parameters
https://crm.internal.com/customer?phone={{Scripter.ANI}}&name={{Scripter.Customer Name}}&queue={{Scripter.Queue Name}}`}</CodeBlock>
        <CalloutBox type="warning">Ensure your CRM allows URL-based record lookup. Some CRMs require authenticated sessions — the agent must be logged into the CRM in the same browser for screen pops to work. Also check popup blocker settings if screen pops open in new tabs.</CalloutBox>
      </section>

      {/* T2S4 */}
      <section ref={el => sectionRefs.current['t2s4'] = el} id="t2s4">
        <SectionHeading>Canned Responses & Quick Replies</SectionHeading>
        <Paragraph>Canned responses are pre-written message templates that agents can insert into chat and email conversations with a few clicks or keystrokes. They standardize messaging quality, reduce typing time, and ensure compliance with approved language. Think of them as a recipe book of approved responses — pick the recipe and customize the ingredients for each customer.</Paragraph>
        <SubHeading>Feature Overview</SubHeading>
        <div className="space-y-3 my-4">
          {CANNED_RESPONSE_FEATURES.map((f, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
              <div className="font-semibold text-sm mb-2" style={{ color: C.t1, fontFamily: MONO }}>{f.feature}</div>
              <div className="text-sm" style={{ color: C.t2, fontFamily: SANS }}>{f.desc}</div>
            </div>
          ))}
        </div>
        <SubHeading>Substitution Variables Example</SubHeading>
        <CodeBlock>{`// Canned response template:
"Hello {{customer_name}}, thank you for contacting {{queue_name}} support.
My name is {{agent_name}} and I'll be happy to help you today."

// After substitution (auto-populated):
"Hello Sarah Johnson, thank you for contacting Billing support.
My name is Alex Chen and I'll be happy to help you today."`}</CodeBlock>
        <CalloutBox type="tip">Organize canned responses by interaction type: separate libraries for "Chat Greetings", "Email Templates", "Troubleshooting Steps", "Closing Messages." This keeps each library focused and fast for agents to navigate.</CalloutBox>
      </section>

      {/* T2S5 */}
      <section ref={el => sectionRefs.current['t2s5'] = el} id="t2s5">
        <SectionHeading>Agent Assist & Knowledge Integration</SectionHeading>
        <Paragraph>Agent Assist uses AI to analyze live conversations and proactively surface relevant knowledge articles, suggested replies, and next-best actions — like having an expert colleague whispering the right answers in your ear during every interaction.</Paragraph>
        <SubHeading>Capabilities</SubHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
          {AGENT_ASSIST_FEATURES.map((f, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, borderLeft: `4px solid ${f.color}` }}>
              <div className="font-bold text-sm mb-2" style={{ color: f.color, fontFamily: MONO }}>{f.feature}</div>
              <div className="text-xs" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
        <SubHeading>Knowledge Panel Usage</SubHeading>
        <Paragraph>The Knowledge Panel is available to agents during any interaction. It supports three modes: (1) Automatic suggestions — AI surfaces articles based on conversation context, (2) Manual search — agent types a query and browses results, (3) Share — agent sends a knowledge article link directly to the customer in chat or email. Articles support rich content: text, images, embedded video, and step-by-step instructions.</Paragraph>
        <CalloutBox type="info">Agent Assist requires a published knowledge base with articles in "Published" status. The AI models work best with well-structured articles that have clear titles, concise answers, and relevant keywords. Minimum 20-50 articles recommended for meaningful suggestions.</CalloutBox>
        <CalloutBox type="info"><strong>New — Genesys Summarization Connector (March 2026):</strong> Administrators can now integrate third-party large language models (LLMs) with AI Studio using the new Genesys Summarization Connector, and configure them to generate Agent Copilot interaction summaries. Think of it like swapping out a generic translator for one who speaks your company's dialect — organizations can customize how summaries are generated to reflect their own terminology, workflows, and priorities rather than relying solely on the built-in summarization engine. This is configured in AI Studio and enables richer, more context-aware wrap-up summaries tailored to how your teams actually work.</CalloutBox>
      </section>

      {/* T2S6 */}
      <section ref={el => sectionRefs.current['t2s6'] = el} id="t2s6">
        <SectionHeading>Desktop Configuration & Settings</SectionHeading>
        <Paragraph>The agent desktop can be customized at both the admin level (org-wide defaults) and the agent level (personal preferences). These settings control notifications, audio, utilization, and workspace layout.</Paragraph>
        <SubHeading>Configuration Options</SubHeading>
        <div className="space-y-2 my-3">
          {DESKTOP_CONFIG_OPTIONS.map(([label, desc], i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-1 p-3 rounded" style={{ backgroundColor: C.bg2 }}>
              <span className="text-xs font-semibold whitespace-nowrap min-w-[180px]" style={{ color: C.orange, fontFamily: MONO }}>{label}:</span>
              <span className="text-xs" style={{ color: C.t2, fontFamily: SANS }}>{desc}</span>
            </div>
          ))}
        </div>
        <SubHeading>Utilization Deep Dive</SubHeading>
        <Paragraph>Utilization controls how many interactions an agent can handle at once. It is configured per media type and can be set at the org level (default for all agents) or overridden per agent. When an agent's utilization is maxed, the ACD will not offer them additional interactions of that type. Interruptible flags determine whether a digital interaction can be interrupted by a higher-priority voice call.</Paragraph>
        <CalloutBox type="warning">
          <strong>Utilization best practice:</strong> Start conservative (3 chats, 2 emails) and increase based on agent performance data. Over-allocation leads to customer frustration (slow responses), while under-allocation wastes agent capacity.
        </CalloutBox>
      </section>

      {/* T2S7 */}
      <section ref={el => sectionRefs.current['t2s7'] = el} id="t2s7">
        <SectionHeading>Supervisor Tools — Monitoring & Coaching</SectionHeading>
        <Paragraph>Supervisors have a suite of tools to monitor agent performance, coach in real time, and manage queue health — all from the same Genesys Cloud interface. These tools are essential for quality assurance, training, and real-time operational management.</Paragraph>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          {SUPERVISOR_TOOLS.map((tool, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, borderLeft: `4px solid ${tool.color}` }}>
              <div className="font-bold text-sm mb-2" style={{ color: tool.color, fontFamily: MONO }}>{tool.name}</div>
              <div className="text-xs" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.6 }}>{tool.desc}</div>
            </div>
          ))}
        </div>
        <CalloutBox type="info">Monitor, Whisper, and Barge require the Conversation &gt; Monitoring permission. Supervisors can only monitor agents on queues they have access to within their division. The agent sees a visual indicator when being monitored (configurable per org).</CalloutBox>
      </section>

      {/* T2S8 */}
      <section ref={el => sectionRefs.current['t2s8'] = el} id="t2s8">
        <SectionHeading>Transfers, Consults & Conferences</SectionHeading>
        <Paragraph>Transfers are one of the most critical desktop operations. Genesys Cloud supports three transfer methods, each designed for different scenarios. Choosing the right method impacts customer experience, context preservation, and agent efficiency.</Paragraph>
        <div className="space-y-3 my-4">
          {TRANSFER_TYPES.map((t, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, borderLeft: `4px solid ${t.color}` }}>
              <div className="font-bold text-sm mb-2" style={{ color: t.color, fontFamily: MONO }}>{t.type}</div>
              <div className="text-sm mb-2" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.6 }}>{t.desc}</div>
              <div className="text-xs p-2 rounded" style={{ backgroundColor: C.bg3, color: C.t3 }}>Analogy: {t.analogy}</div>
            </div>
          ))}
        </div>
        <SubHeading>Transfer Targets</SubHeading>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
          {[
            { title: 'To Queue', desc: 'Transfer the interaction to a different ACD queue. The interaction re-enters the routing engine and is matched to an available agent in the target queue.', color: C.orange },
            { title: 'To User', desc: 'Transfer directly to a specific agent by name or extension. The target agent receives an alerting notification. If unavailable, the transfer fails and returns to the originator.', color: C.blue },
            { title: 'To External Number', desc: 'Transfer to an external phone number (voice only). Used for escalation to external partners, back-office teams, or customer callbacks to alternate numbers.', color: C.purple },
          ].map((target, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
              <div className="font-bold text-sm mb-2" style={{ color: target.color, fontFamily: MONO }}>{target.title}</div>
              <div className="text-xs" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.6 }}>{target.desc}</div>
            </div>
          ))}
        </div>
        <CalloutBox type="tip">Always prefer Consult Transfer over Blind Transfer when context matters. The brief handoff conversation prevents the customer from repeating their issue. For simple redirects (wrong department), Blind Transfer is faster and appropriate.</CalloutBox>
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
      <SectionHeading>Agent Desktop Architecture — How It Really Works</SectionHeading>
      <Paragraph>Understanding the internal architecture of the Genesys Cloud Agent Desktop is essential for troubleshooting connectivity issues, optimizing performance, and building custom integrations. The desktop is a distributed, event-driven system that connects multiple microservices through the browser.</Paragraph>
      <SubHeading>The Technical Stack</SubHeading>
      <div className="my-4 p-4 rounded-lg space-y-2" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
        {ARCHITECTURE_STEPS.map((step, i) => (
          <div key={i} className="text-xs" style={{ color: C.t2, fontFamily: MONO }}>{step}</div>
        ))}
      </div>
      <SubHeading>WebRTC Voice Architecture</SubHeading>
      <Paragraph>Voice calls use WebRTC (Web Real-Time Communication) to establish peer-to-peer audio connections directly in the browser. The signaling path goes through Genesys Cloud's SRTP media servers, while the actual audio stream is negotiated via ICE/STUN/TURN to find the optimal network path. This means no SIP phone or softphone application is needed — just a browser with a microphone.</Paragraph>
      <CodeBlock>{`// WebRTC Connection Flow:
Browser → HTTPS/WSS → Genesys Cloud Notification Service (signaling)
Browser → ICE candidates → STUN server (NAT traversal)
Browser → SRTP audio → TURN relay (if direct path blocked)
Browser ← → Media Server (mixing for conference, recording tap)

// Network Requirements:
- HTTPS (443) to *.mypurecloud.com
- UDP 16384-32768 to Genesys TURN servers
- WebSocket (443) for real-time event notifications
- Bandwidth: ~100kbps per concurrent voice call (G.711)`}</CodeBlock>
      <SubHeading>Presence State Machine</SubHeading>
      <Paragraph>Agent presence is managed by a distributed state machine. Transitions are event-driven: accepting an interaction moves the agent from "Available" to "On Call", ending an interaction moves to "ACW", completing wrap-up returns to "Available". The system prevents invalid transitions (e.g., going directly from "Offline" to "On Call"). Custom presence states (Break, Meal, Training) can be created by administrators and map to either "Available" or "Not Available" for routing purposes.</Paragraph>
      <CalloutBox type="info">
        <strong>Key distinction:</strong> Presence (Available, Away, Break) is what humans see. Routing Status (On Queue / Off Queue) is what the ACD engine checks. An agent can be "Available" but "Off Queue" — visible to colleagues but not receiving routed interactions.
      </CalloutBox>
    </section>

    {/* T3S2 */}
    <section ref={el => sectionRefs.current['t3s2'] = el} id="t3s2">
      <SectionHeading>Advanced Script Designer Patterns</SectionHeading>
      <Paragraph>Beyond simple forms, the Script Designer supports complex multi-page workflows with conditional navigation, real-time data action calls, dynamic variable binding, and custom JSON payloads. These patterns enable scripts that rival dedicated case management applications.</Paragraph>
      <div className="space-y-4 my-4">
        {ADVANCED_SCRIPT_PATTERNS.map((p, i) => (
          <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
            <div className="font-bold text-sm mb-3" style={{ color: C.t1, fontFamily: MONO }}>{p.title}</div>
            <div className="space-y-1">
              {p.steps.map((s, j) => (
                <div key={j} className="text-xs flex items-start gap-2" style={{ color: C.t2, fontFamily: MONO }}>
                  <ArrowRight size={10} style={{ color: C.orange, flexShrink: 0, marginTop: 3 }} />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <SubHeading>Script Variables & Data Binding</SubHeading>
      <CodeBlock>{`// Built-in script variables (read-only):
{{Scripter.Customer Name}}    // Caller name from ANI lookup
{{Scripter.ANI}}              // Caller phone number
{{Scripter.DNIS}}             // Dialed number
{{Scripter.Queue Name}}       // Queue that routed the interaction
{{Scripter.Wrap-Up Code}}     // Currently selected wrap-up code
{{Scripter.Agent Name}}       // Logged-in agent's display name

// Custom variables (read/write from scripts):
{{MyScript.verificationStatus}}  // Set by data action result
{{MyScript.customerTier}}        // Set by CRM lookup
{{MyScript.caseNotes}}           // Written by agent in textarea

// Interaction attributes (set in Architect, read in scripts):
{{InteractionAttribute.caseId}}
{{InteractionAttribute.campaignName}}`}</CodeBlock>
      <CalloutBox type="warning">Data actions called from scripts execute in real time — a slow API response will cause the script to appear to hang. Always set a timeout (default: 5 seconds) and handle the failure case gracefully with a fallback display.</CalloutBox>
    </section>

    {/* T3S3 */}
    <section ref={el => sectionRefs.current['t3s3'] = el} id="t3s3">
      <SectionHeading>Custom Screen Pop Integrations</SectionHeading>
      <Paragraph>Beyond simple URL-based screen pops, Genesys Cloud supports rich integrations through embedded clients, AppFoundry applications, and the Client App SDK's postMessage API for bidirectional iframe communication.</Paragraph>
      <div className="space-y-3 my-4">
        {CUSTOM_SCREENPOP_PATTERNS.map((p, i) => (
          <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, borderLeft: `4px solid ${p.color}` }}>
            <div className="font-bold text-sm mb-2" style={{ color: p.color, fontFamily: MONO }}>{p.pattern}</div>
            <div className="text-sm" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.6 }}>{p.desc}</div>
          </div>
        ))}
      </div>
      <SubHeading>postMessage API Example</SubHeading>
      <CodeBlock>{`// From embedded iframe — listen for interaction events:
window.addEventListener('message', (event) => {
  if (event.data.type === 'interactionConnected') {
    const { conversationId, ani, customerName } = event.data;
    loadCRMRecord(ani);  // Your custom CRM lookup
  }
});

// From embedded iframe — send commands to Genesys Cloud:
window.parent.postMessage({
  type: 'setParticipantData',
  conversationId: '12345-abcde',
  data: { caseId: 'CASE-789', priority: 'high' }
}, 'https://apps.mypurecloud.com');

// Client App SDK (recommended approach):
import purecloud from 'purecloud-client-app-sdk';
const myApp = new purecloud.ClientApp({ gcHostOriginQueryParam: 'gcHostOrigin' });
myApp.lifecycle.addStopListener(() => { /* cleanup */ });`}</CodeBlock>
      <CalloutBox type="info">The Client App SDK provides a structured API for embedded applications, handling authentication, lifecycle events, and interaction notifications. It is the recommended approach over raw postMessage for production integrations.</CalloutBox>
    </section>

    {/* T3S4 */}
    <section ref={el => sectionRefs.current['t3s4'] = el} id="t3s4">
      <SectionHeading>Agent Assist Configuration — AI Features</SectionHeading>
      <Paragraph>Genesys Cloud's AI-powered Agent Assist capabilities transform the desktop from a passive tool into an active coaching partner. These features use real-time natural language processing, knowledge retrieval, and sentiment analysis to help agents perform better.</Paragraph>
      <SubHeading>AI Feature Matrix</SubHeading>
      <InteractiveTable headers={['Feature', 'Description', 'License']} rows={AI_FEATURES.map(f => [f.feature, f.desc, f.license])} />
      <SubHeading>Configuration Steps</SubHeading>
      <div className="my-4 p-4 rounded-lg" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
        {[
          { indent: 0, text: 'STEP 1: Create and publish a Knowledge Base with articles', color: C.green },
          { indent: 0, text: 'STEP 2: Enable Agent Assist in Admin > Contact Center > Agent Assist', color: C.blue },
          { indent: 1, text: 'Configure knowledge base source', color: C.t3 },
          { indent: 1, text: 'Set confidence threshold (0.0 - 1.0) for suggestions', color: C.t3 },
          { indent: 1, text: 'Enable/disable per channel (voice, chat, email)', color: C.t3 },
          { indent: 0, text: 'STEP 3: For voice AI — enable Real-Time Transcription', color: C.orange },
          { indent: 1, text: 'Select transcription language model', color: C.t3 },
          { indent: 1, text: 'Configure transcription display (agent-side, both sides)', color: C.t3 },
          { indent: 0, text: 'STEP 4: Assign Agent Assist policy to queues', color: C.purple },
          { indent: 0, text: 'STEP 5: Configure supervisor coaching alerts (optional)', color: C.yellow },
          { indent: 1, text: 'Set sentiment threshold for negative alerts', color: C.t3 },
          { indent: 1, text: 'Set handle time threshold for duration alerts', color: C.t3 },
        ].map((line, i) => (
          <div key={i} className="text-xs" style={{ paddingLeft: line.indent * 20, color: line.color, fontFamily: MONO, marginBottom: 2 }}>{line.text}</div>
        ))}
      </div>
      <CalloutBox type="warning">AI suggestion quality depends heavily on knowledge base content. Poorly structured articles with vague titles produce low-confidence, irrelevant suggestions. Invest in knowledge base hygiene: clear titles, concise answers, and consistent tagging.</CalloutBox>
    </section>

    {/* T3S5 */}
    <section ref={el => sectionRefs.current['t3s5'] = el} id="t3s5">
      <SectionHeading>API & Desktop Extensions</SectionHeading>
      <Paragraph>The Genesys Cloud Platform API provides comprehensive programmatic access to conversations, scripts, presence, knowledge, recordings, and real-time notifications. This enables custom dashboards, CRM integrations, and automated agent workflows.</Paragraph>
      <SubHeading>Key API Endpoints</SubHeading>
      <InteractiveTable searchable headers={['Method', 'Endpoint', 'Use']} rows={API_ENDPOINTS.map(e => [e.method, e.path, e.use])} />
      <SubHeading>Real-Time Notification Topics</SubHeading>
      <CodeBlock>{`// Conversation events (agent-level):
v2.users.{userId}.conversations           // New/updated conversations
v2.users.{userId}.conversations.calls     // Voice call state changes
v2.users.{userId}.conversations.chats     // Chat interaction events
v2.users.{userId}.conversations.emails    // Email interaction events

// Presence & routing:
v2.users.{userId}.presence                // Presence changes (Available, Away...)
v2.users.{userId}.routingStatus           // On Queue / Off Queue changes

// Supervisor / analytics:
v2.analytics.queues.{queueId}.observations  // Real-time queue stats
v2.conversations.{conversationId}.recordings // Recording events`}</CodeBlock>
      <SubHeading>Client App SDK</SubHeading>
      <Paragraph>The Genesys Cloud Client App SDK provides a JavaScript library for building embedded applications within the agent desktop. It handles OAuth authentication, lifecycle management (start/stop events), notification subscriptions, and interaction context sharing. Applications built with the SDK appear as integrated panels within the desktop, providing a seamless agent experience without context switching.</Paragraph>
    </section>

    {/* T3S6 */}
    <section ref={el => sectionRefs.current['t3s6'] = el} id="t3s6">
      <SectionHeading>Platform Limits — The Complete Reference</SectionHeading>
      <InteractiveTable searchable headers={['Resource', 'Limit', 'Notes']} rows={PLATFORM_LIMITS} />
    </section>

    {/* T3S7 */}
    <section ref={el => sectionRefs.current['t3s7'] = el} id="t3s7">
      <SectionHeading>Licensing & Feature Matrix</SectionHeading>
      <Paragraph>Genesys Cloud is available in three license tiers: GC1, GC2, and GC3. The Agent Desktop and core interaction handling are available across all tiers, with AI-powered features and advanced analytics requiring higher tiers.</Paragraph>
      <InteractiveTable headers={['Feature', 'GC1', 'GC2', 'GC3']} rows={LICENSE_MATRIX} />
      <CalloutBox type="info">
        <strong>License note:</strong> GC1 provides the full agent desktop with voice, chat, and email handling plus scripts and screen pops. GC2 adds Agent Assist knowledge suggestions and screen recording options. GC3 adds the full AI suite: real-time transcription, sentiment analysis, suggested responses, and predictive engagement.
      </CalloutBox>
    </section>

    {/* T3S8 */}
    <section ref={el => sectionRefs.current['t3s8'] = el} id="t3s8">
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
const GenesysAgentDesktopGuide = ({ onBack, isDark: isDarkProp, setIsDark: setIsDarkProp, initialNav }) => {
  const [activeTier, setActiveTier] = useState(initialNav?.tier ?? 0);
  const [activeSection, setActiveSection] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [visibleSections, setVisibleSections] = useState({});
  const [isDarkLocal, setIsDarkLocal] = useState(true);
  const sectionRefs = useRef({});
  const contentRef = useRef(null);

  const isDark = isDarkProp !== undefined ? isDarkProp : isDarkLocal;
  const setIsDark = setIsDarkProp || setIsDarkLocal;

  const themeVars = isDark ? THEME_VARS.dark : THEME_VARS.light;

  const tierSections = useMemo(() => SECTIONS.filter(s => s.tier === activeTier), [activeTier]);

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

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setActiveSection(tierSections[0]?.id || null);
  }, [activeTier, tierSections]);

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
            <span className="font-bold text-sm hidden sm:block" style={{ fontFamily: MONO, color: C.orange }}>GENESYS AGENT DESKTOP GUIDE</span>
            <span className="font-bold text-sm sm:hidden" style={{ fontFamily: MONO, color: C.orange }}>GC DESKTOP</span>
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
      <Footer title="Genesys Cloud Agent Desktop & Scripts — Interactive Knowledge Guide" />
    </div>
  );
};

export default GenesysAgentDesktopGuide;
