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
  'The Big Picture — How Customers Reach the Right Agent',
  'How It All Fits Together — Building Queues, Skills, and Flows',
  'Under the Hood — Algorithms, APIs, and Edge Cases',
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
  { tier: 0, id: 't1s1', title: 'What Is Inbound Routing?' },
  { tier: 0, id: 't1s2', title: 'The Building Blocks — Key Components' },
  { tier: 0, id: 't1s3', title: 'How a Call Gets to an Agent — The Routing Journey' },
  { tier: 0, id: 't1s4', title: 'Routing Methods Explained Simply' },
  { tier: 0, id: 't1s5', title: 'Key Terminology Glossary' },
  { tier: 1, id: 't2s1', title: 'Prerequisites — What You Need Before Routing' },
  { tier: 1, id: 't2s2', title: 'Queues — The Heart of Routing' },
  { tier: 1, id: 't2s3', title: 'Skills & Languages' },
  { tier: 1, id: 't2s4', title: 'Architect Inbound Call Flows' },
  { tier: 1, id: 't2s5', title: 'Schedules & Emergency Routing' },
  { tier: 1, id: 't2s6', title: 'Wrap-Up Codes & After-Call Work' },
  { tier: 1, id: 't2s7', title: 'Bullseye Routing — Deep Dive' },
  { tier: 1, id: 't2s8', title: 'Monitoring & Real-Time Management' },
  { tier: 2, id: 't3s1', title: 'Routing Architecture — How It Really Works' },
  { tier: 2, id: 't3s2', title: 'Predictive Routing' },
  { tier: 2, id: 't3s3', title: 'Preferred Agent & Direct Routing' },
  { tier: 2, id: 't3s4', title: 'Advanced Architect Patterns' },
  { tier: 2, id: 't3s5', title: 'API & Integration' },
  { tier: 2, id: 't3s6', title: 'Platform Limits — The Complete Reference' },
  { tier: 2, id: 't3s7', title: 'Licensing & Feature Matrix' },
  { tier: 2, id: 't3s8', title: 'Troubleshooting Decision Tree' },
];

// ══════════════════════════════════════════════════════════════
// T1 DATA
// ══════════════════════════════════════════════════════════════
const CHANNEL_TYPES = [
  { icon: 'PhoneCall', label: 'Voice', desc: 'Traditional phone calls routed through IVR and ACD queues' },
  { icon: 'MessageSquare', label: 'Web Chat', desc: 'Real-time chat from your website routed to skilled agents' },
  { icon: 'Mail', label: 'Email', desc: 'Inbound emails parsed and queued for agent response' },
  { icon: 'Phone', label: 'SMS / MMS', desc: 'Text messages routed like any other digital interaction' },
  { icon: 'Globe', label: 'Social Messaging', desc: 'Facebook Messenger, WhatsApp, Twitter DMs, LINE, etc.' },
  { icon: 'Headphones', label: 'Callback', desc: 'Customer requests a callback instead of waiting on hold' },
];

const ROUTING_MAP_NODES = [
  { id: 'queue', label: 'QUEUE', sub: 'Agent group / waiting line', x: 400, y: 60 },
  { id: 'skills', label: 'SKILLS', sub: 'Agent capabilities', x: 130, y: 150 },
  { id: 'languages', label: 'LANGUAGES', sub: 'Spoken languages', x: 670, y: 150 },
  { id: 'flow', label: 'ARCHITECT FLOW', sub: 'IVR / routing logic', x: 80, y: 310 },
  { id: 'evalMethod', label: 'EVAL METHOD', sub: 'How to pick the agent', x: 110, y: 450 },
  { id: 'schedules', label: 'SCHEDULES', sub: 'Open / closed hours', x: 300, y: 540 },
  { id: 'wrapUp', label: 'WRAP-UP CODES', sub: 'Interaction outcomes', x: 720, y: 310 },
  { id: 'agents', label: 'AGENTS', sub: 'Queue members', x: 690, y: 450 },
  { id: 'inQueueFlow', label: 'IN-QUEUE FLOW', sub: 'Hold experience', x: 500, y: 540 },
];
const ROUTING_MAP_CENTER = { x: 400, y: 300 };

const ROUTING_NODE_TOOLTIPS = {
  queue: { explanation: 'A virtual waiting line where interactions wait until an agent becomes available — the central routing object', analogy: 'The waiting room at a doctor\'s office' },
  skills: { explanation: 'Tags assigned to agents that describe their abilities (e.g., "Billing", "Technical Support", "Tier 2")', analogy: 'Specialist badges on a hospital staff member' },
  languages: { explanation: 'Language proficiency ratings assigned to agents so callers get someone who speaks their language', analogy: 'The multilingual sign at an airport help desk' },
  flow: { explanation: 'The automated logic that greets callers, collects input, checks data, and decides which queue to send them to', analogy: 'The receptionist who asks "How can I help you?" and directs you' },
  evalMethod: { explanation: 'The algorithm used to select which available agent in the queue gets the interaction (e.g., longest idle, best skills match)', analogy: 'The method for choosing which taxi in the queue picks up the next passenger' },
  schedules: { explanation: 'Time-based rules that determine whether the contact center is open, closed, or in a holiday period', analogy: 'The "Open" / "Closed" sign on a store door' },
  wrapUp: { explanation: 'Labels agents select after finishing an interaction to categorize the outcome (e.g., "Resolved", "Escalation", "Follow-Up")', analogy: 'Stamping a file folder before filing it away' },
  agents: { explanation: 'The people (or bots) who handle customer interactions — assigned to queues directly or via groups', analogy: 'The team members staffing the help desk' },
  inQueueFlow: { explanation: 'The experience a caller has while waiting — music, position announcements, estimated wait time, callback offers', analogy: 'The entertainment and updates while you wait in a theme park line' },
};

const ROUTING_METHODS = [
  {
    name: 'Standard Routing', complexity: 1, best: 'Simple contact centers, general-purpose queues, small teams',
    analogy: 'First available teller at the bank',
    how: 'Interactions are sent to the queue. The system evaluates all available agents using the queue\'s evaluation method (e.g., longest idle) and routes to the top-scoring agent. No skill matching or ring expansion — straightforward first-match routing.',
    note: null,
  },
  {
    name: 'Bullseye Routing', complexity: 3, best: 'Skill-based routing with controlled skill relaxation over time',
    analogy: 'Aiming for the bullseye first, then widening the target if you miss',
    how: 'The system defines concentric "rings" of skill requirements. Ring 1 has the tightest skill match. If no agent is found within the timeout, it expands to Ring 2 (relaxed skills), then Ring 3, and so on — up to 6 rings. Each ring can remove skill requirements or lower proficiency thresholds.',
    note: 'Maximum 6 rings per bullseye configuration. The final ring should always be broad enough to prevent indefinite queuing.',
  },
  {
    name: 'Preferred Agent Routing', complexity: 2, best: 'Relationship-based service, assigned account managers, follow-up on previous interactions',
    analogy: 'Asking to see YOUR doctor, not just any doctor on staff',
    how: 'The system first attempts to route the interaction to a specific preferred agent (set via data action, Architect flow, or API). If the preferred agent is unavailable after a configurable timeout, the interaction falls back to standard queue routing.',
    note: null,
  },
  {
    name: 'Conditional Group Routing', complexity: 3, best: 'Overflow routing, backup teams, multi-site distribution',
    analogy: 'If the main office is swamped, try the satellite office before the outsourcer',
    how: 'Routes through an ordered sequence of routing rules with conditions. Each rule specifies a queue or group, a wait time, and optional conditions (like "agents available > 0"). The interaction moves through rules sequentially until an agent is found.',
    note: null,
  },
  {
    name: 'Predictive Routing', complexity: 5, best: 'Large contact centers optimizing for specific KPIs (AHT, transfer rate, customer satisfaction)',
    analogy: 'An AI matchmaker that learns which agent-customer pairings produce the best outcomes',
    how: 'Uses machine learning to analyze historical interaction data and predict which available agent will produce the best outcome for THIS specific customer. The AI model considers customer attributes, agent performance history, and the target KPI to make real-time routing decisions.',
    note: 'Requires Genesys AI license. Minimum 500 interactions for initial model training. A/B testing recommended for validation.',
  },
  {
    name: 'Direct Routing', complexity: 1, best: 'Known agent transfers, VIP hotlines, dedicated support representatives',
    analogy: 'Dialing someone\'s direct extension — you know exactly who you want',
    how: 'Routes the interaction directly to a specific agent by user ID, bypassing queue evaluation entirely. If the agent is unavailable, the interaction can be configured to wait, overflow to a queue, or disconnect. Typically set via Architect flow logic or API.',
    note: 'The target agent must have the appropriate media utilization capacity for the interaction type.',
  },
];

const ROUTING_LIFECYCLE = [
  { step: 1, title: 'CUSTOMER INITIATES CONTACT', desc: 'Customer dials the phone number, starts a web chat, sends an email, or sends a message', color: C.green, icon: 'PhoneCall' },
  {
    step: 2, title: 'ARCHITECT FLOW EXECUTES', color: C.blue, icon: 'GitBranch',
    desc: 'The inbound flow processes the interaction:',
    checks: [
      'Greeting / IVR menu plays (voice) or welcome message sends (digital)',
      'Schedule check — Is the contact center open? If not → after-hours flow',
      'Data Dip — Look up customer in CRM by ANI, email, or account number',
      'Collect Input — "Press 1 for Sales, 2 for Support" (DTMF or speech)',
      'Set Skills — Assign routing skills based on menu selection or data lookup',
      'Priority assignment — VIP customers get higher priority in queue',
    ],
  },
  { step: 3, title: 'TRANSFER TO ACD QUEUE', desc: 'The Architect flow routes the interaction to the appropriate queue using the "Transfer to ACD" action. Skills, language, and priority are attached to the interaction.', color: C.orange, icon: 'Shuffle' },
  {
    step: 4, title: 'QUEUE EVALUATION', color: C.yellow, icon: 'Target',
    desc: 'The ACD engine evaluates the queue:',
    checks: [
      'Check for available agents matching required skills and language',
      'Apply the evaluation method (All Agents, Best Available, Round Robin)',
      'If Bullseye — start at Ring 1, expand outward on timeout',
      'If Predictive — AI scores available agents against target KPI',
      'If no agents available — interaction waits; in-queue flow plays',
    ],
  },
  { step: 5, title: 'AGENT SELECTION & ALERTING', desc: 'The top-scoring agent is selected. The interaction is offered to the agent via alerting (ring, screen pop, toast notification). If the agent doesn\'t answer within the alerting timeout, the interaction returns to the queue for re-evaluation.', color: C.purple, icon: 'UserCheck' },
  { step: 6, title: 'AGENT HANDLES INTERACTION', desc: 'Agent speaks with the customer (or types in chat/email). Agent may transfer, conference, consult, or place on hold. When finished, the agent ends the interaction.', color: C.green, icon: 'Users' },
  { step: 7, title: 'AFTER-CALL WORK (ACW)', desc: 'Agent enters wrap-up: selects a wrap-up code, adds notes, completes any post-interaction tasks. ACW can be mandatory, optional, or time-limited depending on queue configuration.', color: C.orange, icon: 'ClipboardList' },
];

const GLOSSARY = [
  { term: 'ACD', def: 'Automatic Call Distribution — the system that routes incoming interactions to the most appropriate available agent', tier: 'Tier 1' },
  { term: 'Queue', def: 'A virtual waiting line where interactions are held until an agent becomes available to handle them', tier: 'Tier 1' },
  { term: 'Skill', def: 'A tag representing an agent capability (e.g., "Billing", "Spanish") used for matching interactions to qualified agents', tier: 'Tier 2' },
  { term: 'Language', def: 'A specific language proficiency assigned to agents with a rating from 1 (basic) to 5 (native fluency)', tier: 'Tier 2' },
  { term: 'Bullseye Routing', def: 'A routing method that starts with strict skill requirements and progressively relaxes them in expanding "rings" over time', tier: 'Tier 2' },
  { term: 'Evaluation Method', def: 'The algorithm used to rank and select agents within a queue (All Agents, Best Available, Round Robin)', tier: 'Tier 2' },
  { term: 'Routing Ring', def: 'A tier in bullseye routing with specific skill requirements and a timeout before expanding to the next ring', tier: 'Tier 2' },
  { term: 'Agent Utilization', def: 'The capacity model controlling how many simultaneous interactions an agent can handle per media type', tier: 'Tier 2' },
  { term: 'After-Call Work (ACW)', def: 'The period after an interaction ends where the agent completes wrap-up tasks before becoming available again', tier: 'Tier 2' },
  { term: 'Wrap-Up Code', def: 'A disposition label agents assign after an interaction to categorize the outcome (e.g., "Resolved", "Transfer", "Callback")', tier: 'Tier 2' },
  { term: 'Architect Flow', def: 'A visual drag-and-drop design tool for building IVR menus, routing logic, and automated interaction handling', tier: 'Tier 2' },
  { term: 'IVR', def: 'Interactive Voice Response — the automated phone menu system that greets callers and collects input before routing', tier: 'Tier 1' },
  { term: 'SLA / Service Level', def: 'The target percentage of interactions answered within a specified time threshold (e.g., 80% answered within 20 seconds)', tier: 'Tier 2' },
  { term: 'Handle Time', def: 'The total time from interaction start to wrap-up completion — includes talk time, hold time, and ACW', tier: 'Tier 2' },
  { term: 'Priority', def: 'A numeric value (0-25) assigned to interactions that determines their position in the queue — lower number = higher priority', tier: 'Tier 2' },
  { term: 'In-Queue Flow', def: 'An Architect flow that controls the caller experience while waiting — music, announcements, callback offers, position in queue', tier: 'Tier 2' },
  { term: 'ASA', def: 'Average Speed of Answer — the average time callers wait in queue before being connected to an agent', tier: 'Tier 2' },
  { term: 'AHT', def: 'Average Handle Time — the mean duration of interactions including talk time, hold time, and after-call work', tier: 'Tier 2' },
  { term: 'Predictive Routing', def: 'AI-driven routing that uses machine learning models to match interactions with agents predicted to produce the best KPI outcome', tier: 'Tier 3' },
  { term: 'ANI', def: 'Automatic Number Identification — the caller\'s phone number as delivered by the telephone network', tier: 'Tier 1' },
];

// ══════════════════════════════════════════════════════════════
// T2 DATA
// ══════════════════════════════════════════════════════════════
const PREREQUISITES = [
  { title: 'Telephony Configured', detail: 'A working voice connection is required: Genesys Cloud Voice (built-in, simplest setup), BYOC Cloud (your SIP provider connected to Genesys\'s AWS infrastructure), or BYOC Premises (on-prem Edge appliances). Phone numbers (DIDs) must be provisioned and assigned to inbound call flows.' },
  { title: 'Users & Agents Created', detail: 'User accounts must exist in Genesys Cloud with the Agent role. Agents need a phone (WebRTC, SIP, or BYOC) configured. Agent utilization settings control how many concurrent interactions each agent can handle per media type (default: 1 voice, 3 chats, 2 emails).' },
  { title: 'Divisions Configured', detail: 'Divisions provide access control boundaries. Queues, flows, and users are assigned to divisions. Agents can only see and be routed interactions from queues within their authorized divisions. Default: "Home" division for everything.' },
  { title: 'Roles & Permissions Assigned', detail: 'Key roles: Routing > Queue > Add/Edit/View/Delete for queue managers. Architect > Flow > Add/Edit/View/Publish for flow designers. Telephony > Phone/Site > Edit/View for telephony admins. Analytics > Queue Observation > View for supervisors. Agents need Conversation > Call/Chat/Email > Accept/Create/Transfer.' },
];

const EVAL_METHODS = [
  { name: 'All Agents', desc: 'All matching agents are alerted simultaneously. First agent to accept gets the interaction. Fast answer times but can be disruptive if many agents are alerted at once.', best: 'Small teams (< 10 agents), urgent queues where speed matters most', icon: 'Users' },
  { name: 'Best Available Agent', desc: 'The system scores agents based on idle time, skill proficiency, and routing priority, then routes to the single highest-scoring agent. If that agent doesn\'t accept, re-evaluates and tries the next best.', best: 'Most contact centers — balanced workload distribution with skill optimization', icon: 'Award' },
  { name: 'Round Robin', desc: 'Interactions are distributed in a rotating sequence among available agents. Ensures equal distribution regardless of handle time differences. Resets when agents go offline/online.', best: 'Fair distribution requirements, teams with similar skill levels, compliance with union agreements', icon: 'RefreshCw' },
];

const QUEUE_CONFIG_OPTIONS = [
  ['Queue Name', 'Unique identifier. Use a naming convention like "Sales_Voice_EN" or "Support_T2_Chat"'],
  ['Division', 'Access control boundary — determines who can manage the queue and see its data'],
  ['Media Settings', 'Enable/disable voice, chat, email, message, callback per queue. Each type has its own alerting timeout'],
  ['Alerting Timeout', 'How long the system waits for an agent to accept before re-routing. Voice default: 8 seconds. Digital default: 30 seconds'],
  ['Service Level', 'Target SLA (e.g., 80/20 = 80% of interactions answered within 20 seconds). Used for dashboards, not routing decisions'],
  ['ACW Settings', 'Mandatory (agent must wrap up), Optional (agent can skip), Timed (auto-completes after X seconds, max 900s)'],
  ['Scoring Method', 'Agent scoring for "Best Available": skill match score, idle time weighting, or a combination'],
  ['Peer Monitoring', 'Allow agents to monitor (listen, whisper, barge) other agents\' interactions on this queue'],
];

const SKILL_PROFICIENCIES = [
  { level: 1, label: 'Novice', desc: 'Basic awareness, needs guidance', example: 'New hire just trained on billing basics' },
  { level: 2, label: 'Competent', desc: 'Can handle common scenarios independently', example: 'Agent who completed billing certification' },
  { level: 3, label: 'Proficient', desc: 'Handles most scenarios with confidence', example: 'Experienced billing agent (6+ months)' },
  { level: 4, label: 'Expert', desc: 'Deep knowledge, handles edge cases', example: 'Senior agent, often consulted by peers' },
  { level: 5, label: 'Master', desc: 'Authority on the topic, can train others', example: 'Team lead, subject matter expert' },
];

const FLOW_TYPES = [
  { name: 'Inbound Call Flow', desc: 'Handles incoming voice calls. Attached to phone numbers (DIDs). Contains IVR menus, data lookups, schedule checks, and Transfer to ACD actions.', color: C.orange },
  { name: 'Inbound Chat Flow', desc: 'Handles incoming web chat interactions. Attached to chat widgets/deployments. Can collect pre-chat info, check availability, and route to queues.', color: C.blue },
  { name: 'Inbound Email Flow', desc: 'Handles incoming emails. Attached to email domains/addresses. Can parse subject lines, auto-categorize, and route to specialized queues.', color: C.green },
  { name: 'Inbound Message Flow', desc: 'Handles SMS, Facebook Messenger, WhatsApp, LINE, Twitter DM, and other messaging channels. Attached to messaging deployments.', color: C.purple },
  { name: 'In-Queue Flow', desc: 'Controls the waiting experience: hold music, position-in-queue announcements, estimated wait time, callback offers, periodic comfort messages.', color: C.yellow },
  { name: 'Common Module', desc: 'Reusable flow logic that can be called from any other flow. Use for shared tasks like CRM lookups, authentication, or skill assignment logic.', color: C.red },
];

const KEY_ARCHITECT_ACTIONS = [
  { action: 'Transfer to ACD', desc: 'Routes the interaction to a queue with optional skills, language, and priority' },
  { action: 'Collect Input', desc: 'Gathers DTMF digits or speech input from the caller for menu selections' },
  { action: 'Call Data Action', desc: 'Executes a REST API call to an external system (CRM lookup, database query)' },
  { action: 'Evaluate Schedule Group', desc: 'Checks if the current time falls within business hours, holiday, or emergency' },
  { action: 'Play Audio', desc: 'Plays a pre-recorded audio prompt or TTS (text-to-speech) message' },
  { action: 'Set Language', desc: 'Sets the interaction language for routing and agent selection' },
  { action: 'Set Skills', desc: 'Dynamically assigns routing skills to the interaction based on flow logic' },
  { action: 'Set Priority', desc: 'Adjusts the queue priority of the interaction (0 = highest, 25 = lowest)' },
  { action: 'Get Participant Data', desc: 'Reads custom attributes attached to the interaction by previous flow steps' },
  { action: 'Transfer to User', desc: 'Routes directly to a specific user (agent) — used for direct/preferred routing' },
];

const SCHEDULE_COMPONENTS = [
  { name: 'Schedule', desc: 'Defines recurring open hours (e.g., Mon-Fri 8:00 AM - 6:00 PM EST). Can have multiple time blocks per day. Supports any IANA timezone.' },
  { name: 'Schedule Group', desc: 'Combines one or more schedules with a holiday schedule. Evaluated in Architect flows via the "Evaluate Schedule Group" action. Returns: Open, Closed, or Holiday.' },
  { name: 'Holiday Schedule', desc: 'Defines specific dates when the contact center is closed or has modified hours. Supports recurring annual holidays. Evaluated before regular schedules (holiday takes precedence).' },
  { name: 'Emergency Toggle', desc: 'An org-wide or division-level on/off switch. When activated, the Architect flow\'s "Evaluate Schedule Group" returns "Emergency" regardless of time. Used for unplanned closures (weather, system outage).' },
];

const ACW_MODES = [
  { mode: 'Mandatory', desc: 'Agent MUST select a wrap-up code before becoming available. No timeout — agent stays in ACW until they complete it. Use when accurate disposition data is critical.', color: C.red },
  { mode: 'Optional', desc: 'Agent is immediately made available after the interaction ends. They CAN enter wrap-up, but it\'s not required. Use when speed-to-available matters more than disposition accuracy.', color: C.green },
  { mode: 'Timed (Mandatory)', desc: 'Agent has a fixed window (e.g., 30 seconds) to select a wrap-up code. If time expires, the system auto-assigns "ININ-WRAP-UP-TIMEOUT" and makes the agent available. Max: 900 seconds.', color: C.yellow },
  { mode: 'Agent Requested', desc: 'Agent must click a button to enter ACW. If they don\'t request it, they become immediately available. Use when most interactions don\'t need disposition but some do.', color: C.blue },
];

const BULLSEYE_EXAMPLE = [
  { ring: 1, timeout: '15 sec', skills: 'Billing = 4+, English = 5', desc: 'Expert billing agents, native English — tightest match' },
  { ring: 2, timeout: '20 sec', skills: 'Billing = 3+, English = 4+', desc: 'Proficient billing agents — slightly relaxed' },
  { ring: 3, timeout: '25 sec', skills: 'Billing = 2+, English = 3+', desc: 'Competent agents — broader pool' },
  { ring: 4, timeout: '30 sec', skills: 'Billing (any level), English = 2+', desc: 'Any billing agent — skills nearly fully relaxed' },
  { ring: 5, timeout: '60 sec', skills: 'English = 1+ (Billing removed)', desc: 'Any English-speaking agent — skill requirement dropped' },
  { ring: 6, timeout: 'Forever', skills: 'No skill requirements', desc: 'ANY available agent — guaranteed eventual answer' },
];

const REALTIME_METRICS = [
  { metric: 'Service Level (SLA)', healthy: '> 80%', warning: '60-80%', critical: '< 60%', desc: '% of interactions answered within target time' },
  { metric: 'ASA (Avg Speed of Answer)', healthy: '< 20 sec', warning: '20-60 sec', critical: '> 60 sec', desc: 'Average time callers wait before agent answers' },
  { metric: 'AHT (Avg Handle Time)', healthy: 'Within target', warning: '10-20% over target', critical: '> 20% over target', desc: 'Talk time + hold time + ACW' },
  { metric: 'Agents Available', healthy: '> 15% of staff', warning: '5-15%', critical: '0 agents available', desc: 'Agents in "available" status ready for interactions' },
  { metric: 'Interactions Waiting', healthy: '0-5', warning: '5-15', critical: '> 15', desc: 'Current number of interactions sitting in queue' },
  { metric: 'Longest Wait', healthy: '< 30 sec', warning: '30-120 sec', critical: '> 120 sec', desc: 'Current wait time of the oldest interaction in queue' },
  { metric: 'Abandon Rate', healthy: '< 3%', warning: '3-8%', critical: '> 8%', desc: '% of callers who hang up before reaching an agent' },
];

// ══════════════════════════════════════════════════════════════
// T3 DATA
// ══════════════════════════════════════════════════════════════
const ROUTING_ENGINE_STEPS = [
  '1. Interaction arrives at queue with attached skills, language, and priority',
  '2. Priority queuing: lower priority number = served first (FIFO within same priority)',
  '3. Agent pool construction: find all agents who are On Queue + Available for this media type',
  '4. Skill filtering: remove agents who don\'t meet the current ring\'s skill requirements',
  '5. Language filtering: remove agents below the required language proficiency',
  '6. Evaluation method scoring: rank remaining agents (idle time, round robin position, or skill score)',
  '7. Agent utilization check: verify the selected agent has capacity for this media type',
  '8. Alerting: offer the interaction to the top-scored agent',
  '9. If agent doesn\'t answer within alerting timeout → return to step 3, exclude this agent temporarily',
  '10. If bullseye timeout expires → advance to next ring (step 4 with relaxed requirements)',
];

const PREDICTIVE_ROUTING_DATA = {
  kpis: [
    { name: 'Average Handle Time (AHT)', desc: 'Minimize the total interaction duration by matching customers to agents who resolve similar issues fastest' },
    { name: 'Transfer Rate', desc: 'Minimize transfers by routing to agents most likely to resolve on first contact' },
    { name: 'Customer Satisfaction (CSAT)', desc: 'Maximize predicted customer satisfaction scores based on historical agent-customer pairings' },
    { name: 'First Contact Resolution (FCR)', desc: 'Route to agents with the highest likelihood of resolving the issue without follow-up' },
  ],
  requirements: [
    'Minimum 500 interactions in the queue for initial model training',
    'Recommended: 5,000+ interactions for stable model performance',
    'At least 5 active agents in the queue',
    'Genesys AI Experience or Genesys Cloud AI license required',
    'A/B testing capability built in — compare predictive vs. standard routing',
    'Model retrains automatically on a weekly cadence',
  ],
};

const PREFERRED_AGENT_CONFIG = [
  { setting: 'Routing Method', options: 'Set to "Preferred Agent" on the queue or via Architect flow logic' },
  { setting: 'Agent Assignment', options: 'Via Architect "Set Preferred Agent" action, Data Action (CRM lookup), or API (patchRoutingQueueMember)' },
  { setting: 'Timeout', options: 'How long to wait for the preferred agent before falling back (default: 30 seconds, max: unlimited)' },
  { setting: 'Fallback Behavior', options: 'If preferred agent unavailable: route to queue normally, try next preferred agent, or wait indefinitely' },
  { setting: 'Priority Boost', options: 'Optional: give the interaction a higher priority when falling back to standard routing after preferred agent timeout' },
];

const ADVANCED_ARCHITECT_PATTERNS = [
  {
    title: 'CRM-Driven Routing',
    steps: ['Caller dials in → ANI captured', 'Data Action: Look up ANI in Salesforce → Get Account Tier + Last Agent ID + Open Case Count', 'IF Account Tier = "Enterprise" → Set Priority to 1, Set Skill "Enterprise"', 'IF Open Case Count > 0 → Set Preferred Agent = Last Agent ID', 'Transfer to ACD with skills and preferred agent attached'],
  },
  {
    title: 'Estimated Wait Time with Callback Offer',
    steps: ['Interaction enters queue → In-Queue Flow starts', 'Get Estimated Wait Time action → returns seconds', 'IF wait > 120 seconds → Play "Your estimated wait is X minutes"', 'Collect Input: "Press 1 to receive a callback instead of waiting"', 'IF 1 pressed → Create Callback → Disconnect with confirmation', 'ELSE → Continue hold music, announce position every 60 seconds'],
  },
  {
    title: 'Channel-Aware Routing',
    steps: ['Detect interaction type (voice, chat, email, message)', 'Voice → Route to "Support_Voice" queue with voice-specific skills', 'Chat → Route to "Support_Chat" queue (agents handling 3 concurrent)', 'Email → Route to "Support_Email" queue (lower priority, agents handle 2)', 'Message → Route to "Support_Messaging" queue (async, agents handle 4)'],
  },
  {
    title: 'Time-Based Skill Escalation',
    steps: ['7:00 AM - 5:00 PM → Route to onshore queue, require "Tier1" skill', '5:00 PM - 10:00 PM → Route to nearshore queue, require "Afterhours" skill', '10:00 PM - 7:00 AM → Route to offshore queue, any available agent', 'Weekends → Skeleton crew queue, emergency-only skill filter'],
  },
];

const API_ENDPOINTS = [
  { method: 'GET', path: '/api/v2/routing/queues', use: 'List all queues with members, skills, and configuration' },
  { method: 'POST', path: '/api/v2/routing/queues', use: 'Create a new queue with full configuration' },
  { method: 'GET', path: '/api/v2/routing/queues/{queueId}/estimatedwaittime', use: 'Get real-time estimated wait time for a queue' },
  { method: 'GET', path: '/api/v2/routing/queues/{queueId}/members', use: 'List agents assigned to a queue' },
  { method: 'PATCH', path: '/api/v2/routing/queues/{queueId}/members/{memberId}', use: 'Update agent queue membership (joined/not joined)' },
  { method: 'GET', path: '/api/v2/routing/skills', use: 'List all ACD skills in the org' },
  { method: 'POST', path: '/api/v2/routing/skills', use: 'Create a new ACD skill' },
  { method: 'GET', path: '/api/v2/routing/languages', use: 'List all routing languages' },
  { method: 'PUT', path: '/api/v2/users/{userId}/routingskills/bulk', use: 'Bulk assign skills to an agent' },
  { method: 'POST', path: '/api/v2/conversations/calls', use: 'Place a call with routing parameters (direct routing)' },
  { method: 'GET', path: '/api/v2/analytics/queues/observations/query', use: 'Real-time queue statistics (waiting, agents, SLA)' },
  { method: 'POST', path: '/api/v2/analytics/conversations/details/query', use: 'Historical conversation analytics with filters' },
  { method: 'POST', path: '/api/v2/notifications/channels', use: 'Create notification channel for real-time queue events' },
];

const PLATFORM_LIMITS = [
  ['Queues per org', '5,000', ''],
  ['Members per queue', '5,000', 'Across all membership types'],
  ['Skills per org', '300', 'Shared across all queues'],
  ['Skills per agent', '50', ''],
  ['Languages per org', '100', ''],
  ['Languages per agent', '25', ''],
  ['Bullseye rings per queue', '6', 'Including the "catch-all" ring'],
  ['Wrap-up codes per org', '1,000', ''],
  ['Wrap-up codes per queue', '200', ''],
  ['Architect flows per org', '1,000', 'Across all flow types'],
  ['Actions per flow', '500', 'Per individual flow'],
  ['Schedule groups per org', '200', ''],
  ['Schedules per group', '10', ''],
  ['Holiday schedules per org', '50', ''],
  ['Interaction priority range', '0 - 25', '0 = highest priority'],
  ['ACW timeout max', '900 seconds', '15 minutes'],
  ['Alerting timeout (voice)', '7 - 60 seconds', 'Default: 8 seconds'],
  ['Alerting timeout (digital)', '7 - 300 seconds', 'Default: 30 seconds'],
  ['Agent utilization — voice', '1 concurrent', 'Cannot be changed'],
  ['Agent utilization — chat', '1 - 15 concurrent', 'Default: 3'],
  ['Agent utilization — email', '1 - 15 concurrent', 'Default: 2'],
  ['Agent utilization — message', '1 - 15 concurrent', 'Default: 4'],
  ['Agent utilization — callback', '1 concurrent', 'Cannot be changed'],
  ['Max interactions in queue', '5,000', 'Per queue (auto-overflow after this)'],
  ['In-queue flow EWT max', '86,400 seconds', '24 hours'],
  ['Divisions per org', '500', ''],
  ['Phone numbers (DIDs)', '10,000', 'Per org, varies by telephony model'],
];

const LICENSE_MATRIX = [
  ['Inbound voice routing (ACD)', true, true, true],
  ['Web chat routing', true, true, true],
  ['Email routing', true, true, true],
  ['Standard evaluation methods', true, true, true],
  ['Bullseye routing', true, true, true],
  ['Skills-based routing', true, true, true],
  ['Language-based routing', true, true, true],
  ['Architect IVR flows', true, true, true],
  ['Callback in queue', true, true, true],
  ['Predictive routing (AI)', false, false, true],
  ['Social messaging routing', 'add-on', true, true],
  ['SMS routing', 'add-on', true, true],
  ['WhatsApp routing', 'add-on', 'add-on', true],
  ['Co-browse / screen share', false, 'add-on', true],
  ['Real-time dashboards', true, true, true],
  ['Speech & text analytics', false, false, true],
];

const TROUBLESHOOTING = [
  { symptom: 'Calls not routing to any agent', investigation: 'Check: Are agents on-queue and in "Available" status? → Is the queue enabled for voice media? → Does the Architect flow have a valid "Transfer to ACD" action? → Are there skill requirements that NO agent satisfies? → Is the alerting timeout too short (agent can\'t answer in time)? → Check the phone number → call flow assignment in Admin > Telephony > Phone Numbers.' },
  { symptom: 'Long wait times despite available agents', investigation: 'Check: Are agents marked "Available" but have utilization maxed (already on calls)? → Is bullseye Ring 1 too restrictive (only matching 1-2 agents)? → Are skills assigned correctly to both the interaction AND the agents? → Is the evaluation method set to "All Agents" but agents have auto-answer disabled (slow pickup)? → Check for stuck interactions (ghost calls) consuming agent capacity.' },
  { symptom: 'Wrong agent getting the call (skill mismatch)', investigation: 'Check: Are skills being set correctly in the Architect flow? (Debug mode → check skill values at Transfer to ACD) → Is bullseye routing relaxing skills too quickly? (Increase ring timeouts) → Are agent skill proficiency levels set correctly? → Is "Remove Skill" checked on a bullseye ring unintentionally? → For Predictive Routing: the AI may override skill preferences — check the routing method on the queue.' },
  { symptom: 'SLA consistently below target', investigation: 'Check: Is staffing adequate for the call volume? (Use Workforce Management forecasting) → Are AHT targets realistic? → Is ACW time too long? (Switch to timed ACW) → Are too many interactions being transferred (inflating volume)? → Is the alerting timeout too long? (8 sec default for voice — reduce if agents have auto-answer) → Are there many abandoned calls inflating the denominator?' },
  { symptom: 'Architect flow not executing / calls going to default', investigation: 'Check: Is the flow published? (Draft flows don\'t execute) → Is the phone number associated with the correct flow? (Admin > Call Routing) → Is the flow in the correct division? → Are there errors in the flow? (Check Architect Debugger for runtime errors) → Is a schedule group returning "Closed" when it should be "Open"? → Check if an Emergency Toggle is active.' },
  { symptom: 'Callbacks not being placed', investigation: 'Check: Is the callback enabled on the queue? → Is the in-queue flow correctly configured with "Create Callback"? → Does the agent have callback media enabled in their utilization? → Is the callback number valid? → Is the outbound telephony configured? (Callbacks require outbound dialing capability) → Check callback scheduling — is it trying to call back outside business hours?' },
];

// ══════════════════════════════════════════════════════════════
// SEARCH INDEX
// ══════════════════════════════════════════════════════════════
const SEARCH_INDEX = (() => {
  const idx = [];
  SECTIONS.forEach(s => idx.push({ text: s.title, label: s.title, sectionId: s.id, tier: s.tier, type: 'Section' }));
  CHANNEL_TYPES.forEach(c => idx.push({ text: `${c.label} ${c.desc}`, label: c.label, sectionId: 't1s1', tier: 0, type: 'Channel' }));
  ROUTING_MAP_NODES.forEach(n => idx.push({ text: `${n.label} ${n.sub}`, label: n.label, sectionId: 't1s2', tier: 0, type: 'Component' }));
  Object.entries(ROUTING_NODE_TOOLTIPS).forEach(([k, v]) => idx.push({ text: `${k} ${v.explanation} ${v.analogy}`, label: k.toUpperCase(), sectionId: 't1s2', tier: 0, type: 'Component' }));
  ROUTING_LIFECYCLE.forEach(s => idx.push({ text: `${s.title} ${s.desc} ${(s.checks || []).join(' ')}`, label: s.title, sectionId: 't1s3', tier: 0, type: 'Lifecycle Step' }));
  ROUTING_METHODS.forEach(m => idx.push({ text: `${m.name} ${m.how} ${m.best} ${m.analogy} ${m.note || ''}`, label: m.name, sectionId: 't1s4', tier: 0, type: 'Routing Method' }));
  GLOSSARY.forEach(g => idx.push({ text: `${g.term} ${g.def}`, label: g.term, sectionId: 't1s5', tier: 0, type: 'Glossary' }));
  PREREQUISITES.forEach(p => idx.push({ text: `${p.title} ${p.detail}`, label: p.title, sectionId: 't2s1', tier: 1, type: 'Prerequisite' }));
  EVAL_METHODS.forEach(m => idx.push({ text: `${m.name} ${m.desc} ${m.best}`, label: m.name, sectionId: 't2s2', tier: 1, type: 'Eval Method' }));
  QUEUE_CONFIG_OPTIONS.forEach(o => idx.push({ text: `${o[0]} ${o[1]}`, label: o[0], sectionId: 't2s2', tier: 1, type: 'Config' }));
  SKILL_PROFICIENCIES.forEach(s => idx.push({ text: `${s.label} ${s.desc} ${s.example}`, label: `Level ${s.level}: ${s.label}`, sectionId: 't2s3', tier: 1, type: 'Skill Level' }));
  FLOW_TYPES.forEach(f => idx.push({ text: `${f.name} ${f.desc}`, label: f.name, sectionId: 't2s4', tier: 1, type: 'Flow Type' }));
  KEY_ARCHITECT_ACTIONS.forEach(a => idx.push({ text: `${a.action} ${a.desc}`, label: a.action, sectionId: 't2s4', tier: 1, type: 'Architect Action' }));
  SCHEDULE_COMPONENTS.forEach(s => idx.push({ text: `${s.name} ${s.desc}`, label: s.name, sectionId: 't2s5', tier: 1, type: 'Schedule' }));
  ACW_MODES.forEach(m => idx.push({ text: `${m.mode} ${m.desc}`, label: m.mode, sectionId: 't2s6', tier: 1, type: 'ACW Mode' }));
  BULLSEYE_EXAMPLE.forEach(b => idx.push({ text: `Ring ${b.ring} ${b.skills} ${b.desc} ${b.timeout}`, label: `Ring ${b.ring}`, sectionId: 't2s7', tier: 1, type: 'Bullseye Ring' }));
  REALTIME_METRICS.forEach(m => idx.push({ text: `${m.metric} ${m.desc} ${m.healthy} ${m.warning} ${m.critical}`, label: m.metric, sectionId: 't2s8', tier: 1, type: 'Metric' }));
  ROUTING_ENGINE_STEPS.forEach(s => idx.push({ text: s, label: s.substring(0, 50), sectionId: 't3s1', tier: 2, type: 'Engine Step' }));
  PREDICTIVE_ROUTING_DATA.kpis.forEach(k => idx.push({ text: `${k.name} ${k.desc}`, label: k.name, sectionId: 't3s2', tier: 2, type: 'KPI' }));
  PREDICTIVE_ROUTING_DATA.requirements.forEach(r => idx.push({ text: r, label: r.substring(0, 50), sectionId: 't3s2', tier: 2, type: 'Requirement' }));
  PREFERRED_AGENT_CONFIG.forEach(c => idx.push({ text: `${c.setting} ${c.options}`, label: c.setting, sectionId: 't3s3', tier: 2, type: 'Config' }));
  ADVANCED_ARCHITECT_PATTERNS.forEach(p => idx.push({ text: `${p.title} ${p.steps.join(' ')}`, label: p.title, sectionId: 't3s4', tier: 2, type: 'Pattern' }));
  API_ENDPOINTS.forEach(a => idx.push({ text: `${a.method} ${a.path} ${a.use}`, label: `${a.method} ${a.path}`, sectionId: 't3s5', tier: 2, type: 'API' }));
  PLATFORM_LIMITS.forEach(l => idx.push({ text: `${l[0]} ${l[1]} ${l[2]}`, label: l[0], sectionId: 't3s6', tier: 2, type: 'Platform Limit' }));
  LICENSE_MATRIX.forEach(l => idx.push({ text: `${l[0]}`, label: l[0], sectionId: 't3s7', tier: 2, type: 'License Feature' }));
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
const RoutingComponentMapSVG = () => {
  const [active, setActive] = useState(null);
  return (
    <div className="my-6 overflow-x-auto">
      <svg viewBox="0 0 800 600" className="w-full" style={{ maxWidth: 800, minWidth: 600 }}>
        <defs>
          <filter id="glow-r"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        {ROUTING_MAP_NODES.map(n => (
          <line key={`line-${n.id}`} x1={ROUTING_MAP_CENTER.x} y1={ROUTING_MAP_CENTER.y} x2={n.x} y2={n.y} stroke={C.border} strokeWidth="2" strokeDasharray="6,4" />
        ))}
        <g>
          <rect x={ROUTING_MAP_CENTER.x - 80} y={ROUTING_MAP_CENTER.y - 30} width={160} height={60} rx={12} fill={C.bg3} stroke={C.blue} strokeWidth={2} />
          <text x={ROUTING_MAP_CENTER.x} y={ROUTING_MAP_CENTER.y - 5} textAnchor="middle" fill={C.t1} fontFamily={MONO} fontSize={13} fontWeight="bold">ACD ENGINE</text>
          <text x={ROUTING_MAP_CENTER.x} y={ROUTING_MAP_CENTER.y + 15} textAnchor="middle" fill={C.t3} fontFamily={SANS} fontSize={10}>The routing brain</text>
        </g>
        {ROUTING_MAP_NODES.map(n => {
          const isActive = active === n.id;
          const tooltip = ROUTING_NODE_TOOLTIPS[n.id];
          return (
            <g key={n.id} className="cursor-pointer" onClick={() => setActive(isActive ? null : n.id)} style={{ transition: 'transform 0.2s' }}>
              <rect x={n.x - 70} y={n.y - 25} width={140} height={50} rx={8} fill={C.bg2} stroke={isActive ? C.blue : C.border} strokeWidth={isActive ? 2 : 1} filter={isActive ? 'url(#glow-r)' : undefined} />
              <text x={n.x} y={n.y - 4} textAnchor="middle" fill={C.t1} fontFamily={MONO} fontSize={11} fontWeight="600">{n.label}</text>
              <text x={n.x} y={n.y + 12} textAnchor="middle" fill={C.t3} fontFamily={SANS} fontSize={9}>{n.sub}</text>
              {isActive && tooltip && (() => {
                const tw = 280;
                const tx = Math.max(8, Math.min(n.x - tw / 2, 800 - tw - 8));
                const above = n.y > 350;
                const ty = above ? n.y - 135 : n.y + 30;
                return (
                  <foreignObject x={tx} y={ty} width={tw} height={130}>
                    <div xmlns="http://www.w3.org/1999/xhtml" style={{ background: 'var(--bg3)', border: `1px solid ${C.blue}`, borderRadius: 8, padding: '10px 12px', boxSizing: 'border-box' }}>
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
      <SectionHeading>What Is Inbound Routing?</SectionHeading>
      <Paragraph>Inbound routing is the process of directing incoming customer interactions — phone calls, chats, emails, and messages — to the most appropriate available agent. Think of it as a traffic controller at a busy airport: hundreds of planes (customers) are arriving simultaneously, and the controller must direct each one to the right runway (agent) based on the plane's type, destination, priority, and current traffic conditions.</Paragraph>
      <Paragraph>In Genesys Cloud CX, the Automatic Call Distribution (ACD) system is that traffic controller. Unlike a simple phone system where calls ring all phones or go to a single receptionist, the ACD evaluates every incoming interaction against a set of rules — skills, language, priority, wait time — and dynamically matches it with the agent who can provide the best outcome.</Paragraph>
      <SubHeading>Why ACD Matters</SubHeading>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        {[
          { title: 'SIMPLE PHONE SYSTEM', items: ['All phones ring at once', 'No skill matching', 'No queue or wait management', 'No data — who answered? How long?', 'Single channel (voice only)'], color: C.red },
          { title: 'ACD ROUTING (GENESYS CLOUD)', items: ['Smart matching: right agent for each interaction', 'Multi-channel: voice, chat, email, message, callback', 'Queue management with priority and SLA tracking', 'Full analytics: wait times, handle times, dispositions', 'Skill-based, AI-driven, or rules-based routing'], color: C.blue },
        ].map((panel, i) => (
          <div key={i} className="rounded-lg p-5" style={{ backgroundColor: C.bg2, borderTop: `3px solid ${panel.color}` }}>
            <div className="font-bold mb-3 text-sm" style={{ color: panel.color, fontFamily: MONO }}>{panel.title}</div>
            {panel.items.map((item, j) => <div key={j} className="text-sm mb-1.5" style={{ color: C.t2, fontFamily: SANS }}>{item}</div>)}
          </div>
        ))}
      </div>
      <SubHeading>Supported Channels</SubHeading>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 my-4">
        {CHANNEL_TYPES.map((ch, i) => (
          <div key={i} className="rounded-lg p-4 flex items-start gap-3 transition-all duration-200 hover:-translate-y-0.5" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
            <PhoneCall size={20} style={{ color: C.blue, flexShrink: 0 }} />
            <div><div className="font-semibold text-sm" style={{ color: C.t1, fontFamily: MONO }}>{ch.label}</div><div className="text-xs mt-1" style={{ color: C.t2, fontFamily: SANS }}>{ch.desc}</div></div>
          </div>
        ))}
      </div>
      <CalloutBox type="tip">Genesys Cloud treats every channel the same way at the routing level: interactions enter a queue, get evaluated, and are delivered to agents. The only differences are in the media handling (voice requires a phone connection, chat requires a typing interface, etc.).</CalloutBox>
    </section>

    {/* T1S2 */}
    <section ref={el => sectionRefs.current['t1s2'] = el} id="t1s2">
      <SectionHeading>The Building Blocks — Key Components</SectionHeading>
      <Paragraph>Inbound routing in Genesys Cloud is built from several interconnected components. No single piece works alone — they combine to create the complete routing experience. Think of it like a hospital: the building (queue) houses the staff (agents) who have specialties (skills), and the triage desk (Architect flow) decides which department gets each patient.</Paragraph>
      <CalloutBox type="tip">Click any node in the diagram below to see what it does and a simple analogy.</CalloutBox>
      <RoutingComponentMapSVG />
      <SubHeading>Component Reference</SubHeading>
      <InteractiveTable
        headers={['Component', 'Simple Explanation', 'Analogy']}
        rows={Object.entries(ROUTING_NODE_TOOLTIPS).map(([k, v]) => {
          const node = ROUTING_MAP_NODES.find(n => n.id === k);
          return [node?.label || k, v.explanation, v.analogy];
        })}
      />
    </section>

    {/* T1S3 */}
    <section ref={el => sectionRefs.current['t1s3'] = el} id="t1s3">
      <SectionHeading>How a Call Gets to an Agent — The Routing Journey</SectionHeading>
      <Paragraph>Every inbound interaction follows the same general lifecycle, regardless of channel. Understanding this flow is the key to understanding how all the components fit together.</Paragraph>
      <div className="my-6 space-y-0">
        {ROUTING_LIFECYCLE.map((s, i) => (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: s.color + '22', color: s.color, border: `2px solid ${s.color}`, fontFamily: MONO }}>{s.step}</div>
              {i < ROUTING_LIFECYCLE.length - 1 && <div className="w-0.5 flex-1 my-1" style={{ backgroundColor: C.border }} />}
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
          <div className="font-bold text-sm" style={{ color: C.green, fontFamily: MONO }}>AGENT AVAILABLE — READY FOR NEXT INTERACTION</div>
        </div>
      </div>
    </section>

    {/* T1S4 */}
    <section ref={el => sectionRefs.current['t1s4'] = el} id="t1s4">
      <SectionHeading>Routing Methods Explained Simply</SectionHeading>
      <Paragraph>The routing method determines HOW the system selects an agent for each interaction. Genesys Cloud offers six methods, ranging from simple (send to any available agent) to complex (AI predicts the best agent). Choosing the right method is one of the most impactful decisions in your routing design.</Paragraph>
      <div className="my-6 rounded-lg p-4 overflow-x-auto" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
        <div className="flex items-center justify-between mb-2 min-w-[500px]">
          <span className="text-xs font-bold" style={{ color: C.orange, fontFamily: MONO }}>SIMPLE</span>
          <span className="text-xs font-bold" style={{ color: C.purple, fontFamily: MONO }}>ADVANCED</span>
        </div>
        <div className="h-2 rounded-full min-w-[500px]" style={{ background: `linear-gradient(90deg, ${C.orange}, ${C.blue}, ${C.purple})` }} />
        <div className="flex justify-between mt-2 min-w-[500px]">
          {ROUTING_METHODS.map((m, i) => <span key={i} className="text-[10px] text-center" style={{ color: C.t3, fontFamily: MONO, width: 80 }}>{m.name.split(' ')[0]}</span>)}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {ROUTING_METHODS.map((m, i) => (
          <ExpandableCard key={i} title={m.name} accent={C.blue}>
            <div className="space-y-2">
              <div><strong style={{ color: C.t1 }}>How it works:</strong> {m.how}</div>
              <div className="flex items-center gap-2"><strong style={{ color: C.t1 }}>Complexity:</strong> <StarRating count={m.complexity} /></div>
              <div><strong style={{ color: C.t1 }}>Best for:</strong> {m.best}</div>
              <div><strong style={{ color: C.t1 }}>Think of it as:</strong> <em>{m.analogy}</em></div>
              {m.note && <CalloutBox type="info">{m.note}</CalloutBox>}
            </div>
          </ExpandableCard>
        ))}
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

// ══════════════════════════════════════════════════════════════
// TIER 2 CONTENT
// ══════════════════════════════════════════════════════════════
const Tier2Content = ({ sectionRefs }) => {
  const [activeFlowTab, setActiveFlowTab] = useState(0);
  return (
    <div className="space-y-16">
      {/* T2S1 */}
      <section ref={el => sectionRefs.current['t2s1'] = el} id="t2s1">
        <SectionHeading>Prerequisites — What You Need Before Routing</SectionHeading>
        <Paragraph>Before building your first inbound routing configuration, these platform-level components must be in place. Think of this as laying the foundation before constructing the building.</Paragraph>
        <div className="space-y-3 my-4">
          {PREREQUISITES.map((p, i) => (
            <ExpandableCard key={i} title={`${i + 1}. ${p.title}`} accent={C.blue}>
              {p.detail}
            </ExpandableCard>
          ))}
        </div>
        <SubHeading>Recommended Setup Sequence</SubHeading>
        <div className="flex flex-wrap items-center gap-1 my-4 overflow-x-auto">
          {['Telephony', 'Phone Numbers', 'Users / Agents', 'Skills & Languages', 'Queues', 'Wrap-Up Codes', 'Schedules', 'Architect Flows', 'Assign DIDs to Flows'].map((s, i) => (
            <React.Fragment key={i}>
              <span className="px-3 py-1.5 rounded text-xs whitespace-nowrap" style={{ backgroundColor: C.bg3, color: C.t1, fontFamily: MONO, border: `1px solid ${C.border}` }}>{s}</span>
              {i < 8 && <ArrowRight size={14} style={{ color: C.t3, flexShrink: 0 }} />}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* T2S2 */}
      <section ref={el => sectionRefs.current['t2s2'] = el} id="t2s2">
        <SectionHeading>Queues — The Heart of Routing</SectionHeading>
        <Paragraph>The queue is the central routing object in Genesys Cloud. Every inbound interaction must pass through a queue to reach an agent. Queues define WHO can answer (membership), HOW agents are selected (evaluation method), and WHAT happens during wrap-up (ACW settings).</Paragraph>
        <SubHeading>Queue Membership</SubHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          {[
            { title: 'DIRECT MEMBERSHIP', items: ['Add individual agents to the queue manually', 'Agent is a permanent member (until removed)', 'Simple but labor-intensive for large teams', 'Best for: small, stable teams'], color: C.orange },
            { title: 'GROUP-BASED MEMBERSHIP', items: ['Add a Group to the queue — all group members auto-join', 'Dynamic: add/remove users from the group, queue updates automatically', 'Supports nested groups', 'Best for: large or frequently changing teams'], color: C.blue },
          ].map((panel, i) => (
            <div key={i} className="rounded-lg p-5" style={{ backgroundColor: C.bg2, borderTop: `3px solid ${panel.color}` }}>
              <div className="font-bold mb-3 text-sm" style={{ color: panel.color, fontFamily: MONO }}>{panel.title}</div>
              {panel.items.map((item, j) => <div key={j} className="text-sm mb-1.5" style={{ color: C.t2, fontFamily: SANS }}>{item}</div>)}
            </div>
          ))}
        </div>
        <SubHeading>Evaluation Methods</SubHeading>
        <div className="space-y-3 my-4">
          {EVAL_METHODS.map((e, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
              <div className="font-semibold text-sm mb-2 flex items-center gap-2" style={{ color: C.t1, fontFamily: MONO }}>
                {e.name}
              </div>
              <div className="text-sm mb-2" style={{ color: C.t2, fontFamily: SANS }}>{e.desc}</div>
              <div className="text-xs p-2 rounded" style={{ backgroundColor: C.bg3, color: C.t3 }}>Best for: {e.best}</div>
            </div>
          ))}
        </div>
        <SubHeading>Queue Configuration Options</SubHeading>
        <div className="space-y-2 my-3">
          {QUEUE_CONFIG_OPTIONS.map(([label, desc], i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-1 p-3 rounded" style={{ backgroundColor: C.bg2 }}>
              <span className="text-xs font-semibold whitespace-nowrap min-w-[160px]" style={{ color: C.blue, fontFamily: MONO }}>{label}:</span>
              <span className="text-xs" style={{ color: C.t2, fontFamily: SANS }}>{desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* T2S3 */}
      <section ref={el => sectionRefs.current['t2s3'] = el} id="t2s3">
        <SectionHeading>Skills & Languages</SectionHeading>
        <Paragraph>Skills and languages are the backbone of intelligent routing. They describe what agents CAN do, and are matched against what the interaction NEEDS. This matching is what elevates ACD routing beyond simple round-robin distribution.</Paragraph>
        <SubHeading>ACD Skills</SubHeading>
        <Paragraph>Skills are custom tags you create to represent agent capabilities. Examples: "Billing", "Technical Support", "Sales", "Tier 2", "Spanish", "Insurance Claims". Each skill is assigned to agents with a proficiency rating from 1 to 5.</Paragraph>
        <SubHeading>Proficiency Ratings</SubHeading>
        <div className="space-y-2 my-4">
          {SKILL_PROFICIENCIES.map((p, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-lg" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
              <div className="flex items-center gap-2 min-w-[100px]">
                <StarRating count={p.level} />
              </div>
              <div className="flex-1">
                <span className="text-xs font-semibold" style={{ color: C.t1, fontFamily: MONO }}>{p.label}</span>
                <span className="text-xs mx-2" style={{ color: C.t3 }}>—</span>
                <span className="text-xs" style={{ color: C.t2, fontFamily: SANS }}>{p.desc}</span>
              </div>
              <div className="text-xs hidden md:block" style={{ color: C.t3, fontFamily: SANS, fontStyle: 'italic' }}>{p.example}</div>
            </div>
          ))}
        </div>
        <SubHeading>Language Skills</SubHeading>
        <Paragraph>Languages work like skills but are managed separately. Each agent can have multiple languages with proficiency ratings. When an Architect flow sets a language on the interaction, only agents with that language at or above the required proficiency will be considered. Languages use the same 1-5 proficiency scale as skills.</Paragraph>
        <SubHeading>Skill Expressions</SubHeading>
        <Paragraph>In Architect flows, you can build complex skill expressions using AND/OR logic. For example: require skill "Billing" AND ("English" OR "Spanish"). This allows sophisticated matching without creating separate queues for every skill combination.</Paragraph>
        <CodeBlock>{`// Example: Architect skill expression in Transfer to ACD
// Require Billing skill at proficiency 3+
// AND require either English OR Spanish at proficiency 4+
Skills: Billing >= 3 AND (English >= 4 OR Spanish >= 4)
Language: Set dynamically based on caller's IVR selection
Priority: 5 (normal)`}</CodeBlock>
        <CalloutBox type="warning">Skills are shared across the entire org (up to 300 total). Plan your skill taxonomy carefully. Avoid creating too-specific skills (like "Billing_Tier2_Spanish_West") — instead, use multiple skills and let the routing engine combine them.</CalloutBox>
      </section>

      {/* T2S4 */}
      <section ref={el => sectionRefs.current['t2s4'] = el} id="t2s4">
        <SectionHeading>Architect Inbound Call Flows</SectionHeading>
        <Paragraph>Architect is the visual flow designer in Genesys Cloud. It is the brain behind every inbound interaction — the logic layer that greets customers, collects input, looks up data, checks schedules, and decides which queue to send each interaction to.</Paragraph>
        <SubHeading>Flow Types</SubHeading>
        <div className="flex gap-1 mb-3 overflow-x-auto flex-wrap">
          {FLOW_TYPES.map((t, i) => (
            <button key={i} className="px-3 py-1.5 rounded text-xs whitespace-nowrap cursor-pointer transition-colors" onClick={() => setActiveFlowTab(i)} style={{ backgroundColor: activeFlowTab === i ? t.color : C.bg3, color: activeFlowTab === i ? '#fff' : C.t2, fontFamily: MONO }}>{t.name}</button>
          ))}
        </div>
        <div className="p-4 rounded-lg text-sm" style={{ backgroundColor: C.bg2, color: C.t2, fontFamily: SANS, border: `1px solid ${C.border}`, lineHeight: 1.7 }}>{FLOW_TYPES[activeFlowTab].desc}</div>

        <SubHeading>Key Architect Actions for Routing</SubHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-3">
          {KEY_ARCHITECT_ACTIONS.map((a, i) => (
            <div key={i} className="p-3 rounded" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
              <div className="text-xs font-semibold mb-1" style={{ color: C.blue, fontFamily: MONO }}>{a.action}</div>
              <div className="text-xs" style={{ color: C.t2, fontFamily: SANS }}>{a.desc}</div>
            </div>
          ))}
        </div>

        <SubHeading>Example: Basic IVR Call Flow</SubHeading>
        <div className="my-4 p-4 rounded-lg" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
          {[
            { indent: 0, text: 'CALL ARRIVES (DID triggers inbound call flow)', color: C.green },
            { indent: 1, text: 'Evaluate Schedule Group: "BusinessHours"', color: C.yellow },
            { indent: 2, text: 'IF OPEN:', color: C.green },
            { indent: 3, text: 'Play Audio: "Thank you for calling Acme Corp"', color: C.t3 },
            { indent: 3, text: 'Collect Input: "Press 1 for Sales, 2 for Support, 3 for Billing"', color: C.blue },
            { indent: 4, text: '1 → Set Skill "Sales" → Transfer to ACD: "Sales_Voice"', color: C.orange },
            { indent: 4, text: '2 → Set Skill "Support" → Transfer to ACD: "Support_Voice"', color: C.orange },
            { indent: 4, text: '3 → Set Skill "Billing" → Transfer to ACD: "Billing_Voice"', color: C.orange },
            { indent: 4, text: 'No input → Repeat menu (max 3 times) → Transfer to ACD: "General"', color: C.t3 },
            { indent: 2, text: 'IF CLOSED:', color: C.red },
            { indent: 3, text: 'Play Audio: "We are currently closed. Our hours are Mon-Fri 8-6 EST"', color: C.t3 },
            { indent: 3, text: 'Transfer to Voicemail or Disconnect', color: C.red },
            { indent: 2, text: 'IF HOLIDAY:', color: C.purple },
            { indent: 3, text: 'Play Audio: "We are closed for the holiday"', color: C.t3 },
            { indent: 3, text: 'Disconnect', color: C.red },
          ].map((line, i) => (
            <div key={i} className="text-xs" style={{ paddingLeft: line.indent * 20, color: line.color, fontFamily: MONO, marginBottom: 2 }}>{line.text}</div>
          ))}
        </div>
        <CalloutBox type="info">Every Architect flow must be PUBLISHED before it takes effect. Draft flows exist for editing but do not execute. Always test flows in a development environment before publishing to production.</CalloutBox>
      </section>

      {/* T2S5 */}
      <section ref={el => sectionRefs.current['t2s5'] = el} id="t2s5">
        <SectionHeading>Schedules & Emergency Routing</SectionHeading>
        <Paragraph>Schedules control when your contact center is "open" and available to receive interactions. Without schedules, your Architect flows would need hardcoded time checks — fragile and hard to maintain. Genesys Cloud provides a structured scheduling system with four components.</Paragraph>
        <div className="space-y-3 my-4">
          {SCHEDULE_COMPONENTS.map((s, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
              <div className="font-semibold text-sm mb-2" style={{ color: C.t1, fontFamily: MONO }}>{i + 1}. {s.name}</div>
              <div className="text-sm" style={{ color: C.t2, fontFamily: SANS }}>{s.desc}</div>
            </div>
          ))}
        </div>
        <SubHeading>After-Hours Flow Pattern</SubHeading>
        <Paragraph>When the schedule group returns "Closed" or "Holiday", the Architect flow should handle the interaction gracefully. Common patterns: play a closed message with business hours, offer voicemail, route to an after-hours queue (outsourced), or create a callback for the next business day.</Paragraph>
        <CalloutBox type="warning">
          <strong>Emergency Toggle Best Practice:</strong> Always include the Emergency branch in your Architect flow, even if you don't plan to use it initially. When an emergency occurs (building evacuation, system outage), you can activate the toggle instantly from Admin without editing or republishing the flow.
        </CalloutBox>
      </section>

      {/* T2S6 */}
      <section ref={el => sectionRefs.current['t2s6'] = el} id="t2s6">
        <SectionHeading>Wrap-Up Codes & After-Call Work</SectionHeading>
        <Paragraph>After every interaction, agents enter the After-Call Work (ACW) phase. This is when they select a wrap-up code, add notes, and complete any post-interaction tasks. The ACW configuration on each queue determines how this phase works.</Paragraph>
        <SubHeading>ACW Modes</SubHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
          {ACW_MODES.map((a, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, borderLeft: `4px solid ${a.color}` }}>
              <div className="font-bold text-sm mb-2" style={{ color: a.color, fontFamily: MONO }}>{a.mode}</div>
              <div className="text-sm" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.6 }}>{a.desc}</div>
            </div>
          ))}
        </div>
        <SubHeading>Wrap-Up Code Design</SubHeading>
        <Paragraph>Wrap-up codes should be specific enough to provide useful analytics but not so numerous that agents waste time searching. The sweet spot for most contact centers is 10-20 codes per queue. Examples: "Resolved - First Contact", "Escalation Required", "Callback Scheduled", "Information Request", "Complaint", "Sale Complete", "Transfer", "Spam/Misdial".</Paragraph>
        <CalloutBox type="tip">Assign wrap-up codes at the queue level, not globally. A "Billing" queue needs different disposition codes than a "Technical Support" queue. Agents only see the codes assigned to their current queue, keeping the list focused and fast to navigate.</CalloutBox>
      </section>

      {/* T2S7 */}
      <section ref={el => sectionRefs.current['t2s7'] = el} id="t2s7">
        <SectionHeading>Bullseye Routing — Deep Dive</SectionHeading>
        <Paragraph>Bullseye routing is the most powerful skill-based routing method in Genesys Cloud. It addresses a fundamental tension: you want the BEST-skilled agent, but you also don't want the customer waiting forever if that ideal agent isn't available. Bullseye solves this by starting strict and gradually relaxing.</Paragraph>
        <SubHeading>How Bullseye Works</SubHeading>
        <div className="my-4 p-4 rounded-lg" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
          <div className="text-center mb-4 text-sm font-bold" style={{ color: C.blue, fontFamily: MONO }}>BULLSEYE RING EXPANSION</div>
          {BULLSEYE_EXAMPLE.map((b, i) => (
            <div key={i} className="flex items-start gap-3 mb-3 p-2 rounded" style={{ backgroundColor: i === 0 ? C.blue + '11' : 'transparent' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ backgroundColor: C.blue + '22', color: C.blue, border: `2px solid ${C.blue}`, fontFamily: MONO, opacity: 1 - (i * 0.12) }}>{b.ring}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-semibold" style={{ color: C.t1, fontFamily: MONO }}>Ring {b.ring}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded" style={{ backgroundColor: C.bg3, color: C.t3 }}>Timeout: {b.timeout}</span>
                </div>
                <div className="text-xs mb-1" style={{ color: C.blue, fontFamily: MONO }}>Skills: {b.skills}</div>
                <div className="text-xs" style={{ color: C.t3, fontFamily: SANS }}>{b.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <SubHeading>Bullseye Best Practices</SubHeading>
        <div className="space-y-1 my-3">
          {[
            { good: true, text: 'Always include a final "catch-all" ring with no skill requirements to guarantee eventual answer' },
            { good: true, text: 'Use 3-4 rings for most queues — more rings adds complexity without proportional benefit' },
            { good: true, text: 'Set Ring 1 timeout to 10-20 seconds (tight enough to try specialists first, short enough to not frustrate callers)' },
            { good: true, text: 'Remove one skill per ring rather than reducing all proficiencies simultaneously' },
            { good: false, text: 'Don\'t set all ring timeouts to the same value (defeats the expansion purpose)' },
            { good: false, text: 'Don\'t make Ring 1 so restrictive that it matches zero agents during most business hours' },
            { good: false, text: 'Don\'t forget to test with your actual agent pool — model who gets matched at each ring' },
          ].map((p, i) => (
            <div key={i} className="text-xs flex items-start gap-2" style={{ color: p.good ? C.green : C.red, fontFamily: SANS }}>
              <span>{p.good ? 'DO' : 'AVOID'}</span><span style={{ color: C.t2 }}>{p.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* T2S8 */}
      <section ref={el => sectionRefs.current['t2s8'] = el} id="t2s8">
        <SectionHeading>Monitoring & Real-Time Management</SectionHeading>
        <Paragraph>Real-time monitoring is essential for managing a contact center. Genesys Cloud provides live dashboards, alerts, and supervisor tools that let you see what's happening right now — not what happened yesterday.</Paragraph>
        <SubHeading>Key Real-Time Metrics</SubHeading>
        <InteractiveTable
          headers={['Metric', 'Healthy', 'Warning', 'Critical']}
          rows={REALTIME_METRICS.map(m => [m.metric, m.healthy, m.warning, m.critical])}
        />
        <SubHeading>Supervisor Tools</SubHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          {[
            { name: 'Monitor (Listen)', desc: 'Silently listen to a live interaction without the agent or customer knowing. Used for quality assurance.', color: C.green },
            { name: 'Whisper (Coach)', desc: 'Speak to the agent without the customer hearing. Used for real-time coaching during difficult interactions.', color: C.blue },
            { name: 'Barge', desc: 'Join the conversation so both the agent and customer can hear you. Used for escalation or intervention.', color: C.orange },
            { name: 'Change Agent Status', desc: 'Force an agent\'s status to Available, Away, Break, etc. Used to manage staffing levels in real time.', color: C.purple },
          ].map((tool, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, borderLeft: `4px solid ${tool.color}` }}>
              <div className="font-bold text-sm mb-2" style={{ color: tool.color, fontFamily: MONO }}>{tool.name}</div>
              <div className="text-xs" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.6 }}>{tool.desc}</div>
            </div>
          ))}
        </div>
        <SubHeading>Alerting</SubHeading>
        <Paragraph>Configure automated alerts that trigger when metrics cross thresholds. Examples: "Alert me when Service Level drops below 70%", "Alert me when Interactions Waiting exceeds 10", "Alert me when Average Wait Time exceeds 60 seconds." Alerts can be delivered as in-app notifications, emails, or trigger webhook integrations.</Paragraph>
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
      <SectionHeading>Routing Architecture — How It Really Works</SectionHeading>
      <Paragraph>Understanding the internal mechanics of the Genesys Cloud routing engine is essential for troubleshooting agent selection issues, optimizing performance, and designing advanced routing configurations. The ACD engine operates as a distributed, event-driven microservice.</Paragraph>
      <SubHeading>The Routing Evaluation Pipeline</SubHeading>
      <div className="my-4 p-4 rounded-lg space-y-2" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
        {ROUTING_ENGINE_STEPS.map((step, i) => (
          <div key={i} className="text-xs" style={{ color: C.t2, fontFamily: MONO }}>{step}</div>
        ))}
      </div>
      <SubHeading>Priority Queuing</SubHeading>
      <Paragraph>Genesys Cloud uses a priority-based FIFO queue model. Interactions with lower priority numbers (0 = highest) are served before interactions with higher numbers, regardless of arrival time. Within the same priority level, first-in-first-out applies. Priority is set in Architect flows via the "Set Priority" action or the priority field on "Transfer to ACD." The default priority is 0.</Paragraph>
      <CalloutBox type="info">
        <strong>Priority range:</strong> 0 (highest) to 25 (lowest). Use sparingly — if everything is "high priority," nothing is. A recommended scheme: 0 = system critical, 5 = VIP, 10 = default, 15 = low priority, 20 = best-effort.
      </CalloutBox>
      <SubHeading>Agent Scoring Model</SubHeading>
      <div className="my-4 p-4 rounded-lg" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
        <div className="font-bold text-xs mb-3" style={{ color: C.purple, fontFamily: MONO }}>BEST AVAILABLE AGENT SCORING FORMULA:</div>
        <CodeBlock>{`AgentScore = (SkillMatchScore * SkillWeight) + (IdleTimeScore * IdleWeight)

Where:
  SkillMatchScore = Sum of (agent proficiency / required proficiency) for each matching skill
  IdleTimeScore   = Seconds since last interaction ended (normalized)
  SkillWeight     = Configurable on the queue (0-100%)
  IdleWeight      = 100% - SkillWeight

Default: 50% skill weight, 50% idle time weight
Result: Agent with highest combined score gets the interaction`}</CodeBlock>
      </div>
      <SubHeading>Preemptive vs Non-Preemptive</SubHeading>
      <Paragraph>Genesys Cloud ACD is NON-preemptive: once an interaction is assigned to an agent, it cannot be taken away and given to a "better" agent who just became available. The evaluation only considers CURRENTLY available agents at the moment of routing. This means agent selection is "good enough at the moment" — not globally optimal. This trade-off is intentional: preemptive routing would cause disruptive interaction reassignment and break agent context.</Paragraph>
    </section>

    {/* T3S2 */}
    <section ref={el => sectionRefs.current['t3s2'] = el} id="t3s2">
      <SectionHeading>Predictive Routing</SectionHeading>
      <Paragraph>Predictive Routing uses machine learning to go beyond skill matching and idle time. Instead of asking "which agent CAN handle this?" it asks "which agent will produce the BEST OUTCOME for this specific customer?" The AI model analyzes historical interaction data to make real-time predictions.</Paragraph>
      <SubHeading>Supported KPI Targets</SubHeading>
      <div className="space-y-3 my-4">
        {PREDICTIVE_ROUTING_DATA.kpis.map((k, i) => (
          <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
            <div className="font-semibold text-sm mb-2" style={{ color: C.purple, fontFamily: MONO }}>{k.name}</div>
            <div className="text-sm" style={{ color: C.t2, fontFamily: SANS }}>{k.desc}</div>
          </div>
        ))}
      </div>
      <SubHeading>How the Model Works</SubHeading>
      <div className="my-4 p-4 rounded-lg space-y-3" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
        <div className="font-bold text-xs mb-2" style={{ color: C.purple, fontFamily: MONO }}>PREDICTIVE MODEL PIPELINE:</div>
        {[
          '1. Historical data ingestion — analyze past interactions (customer attributes, agent performance, outcomes)',
          '2. Feature extraction — identify patterns: which agent-customer pairings produced best results?',
          '3. Model training — build prediction model for the target KPI (retrains weekly)',
          '4. Real-time scoring — when interaction arrives, score each available agent against predicted outcome',
          '5. Agent selection — route to agent with highest predicted KPI score',
          '6. A/B testing — optionally route 50% predictive / 50% standard to measure improvement',
          '7. Continuous learning — new interaction outcomes feed back into model retraining',
        ].map((step, i) => <div key={i} className="text-xs" style={{ color: C.t2, fontFamily: MONO }}>{step}</div>)}
      </div>
      <SubHeading>Requirements & Constraints</SubHeading>
      <div className="space-y-1 my-3">
        {PREDICTIVE_ROUTING_DATA.requirements.map((r, i) => (
          <div key={i} className="text-xs flex items-start gap-2" style={{ fontFamily: SANS }}>
            <span style={{ color: C.purple }}>*</span><span style={{ color: C.t2 }}>{r}</span>
          </div>
        ))}
      </div>
      <CalloutBox type="warning">Predictive Routing may override traditional skill-based routing decisions. The AI selects the agent it predicts will perform best, which might not always be the "most skilled" agent. This is by design — the model considers factors beyond skill proficiency. Monitor A/B test results carefully before full deployment.</CalloutBox>
    </section>

    {/* T3S3 */}
    <section ref={el => sectionRefs.current['t3s3'] = el} id="t3s3">
      <SectionHeading>Preferred Agent & Direct Routing</SectionHeading>
      <Paragraph>Preferred Agent and Direct Routing enable relationship-based service — routing interactions to a SPECIFIC agent rather than the "best available." This is critical for VIP handling, account manager assignments, and follow-up on ongoing cases.</Paragraph>
      <SubHeading>Preferred Agent Configuration</SubHeading>
      <div className="space-y-2 my-4">
        {PREFERRED_AGENT_CONFIG.map((c, i) => (
          <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-1 p-3 rounded" style={{ backgroundColor: C.bg2 }}>
            <span className="text-xs font-semibold whitespace-nowrap min-w-[160px]" style={{ color: C.purple, fontFamily: MONO }}>{c.setting}:</span>
            <span className="text-xs" style={{ color: C.t2, fontFamily: SANS }}>{c.options}</span>
          </div>
        ))}
      </div>
      <SubHeading>Use Cases</SubHeading>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
        {[
          { title: 'VIP Customers', desc: 'Route high-value customers to their assigned relationship manager. If unavailable, fall back to a VIP-skilled queue with priority boost.', color: C.orange },
          { title: 'Case Follow-Up', desc: 'When a customer calls back about an open case, CRM lookup finds the last agent and routes back to them for continuity.', color: C.blue },
          { title: 'Account Manager', desc: 'B2B customers always route to their dedicated account manager first, with fallback to the account team queue.', color: C.purple },
        ].map((u, i) => (
          <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
            <div className="font-bold text-sm mb-2" style={{ color: u.color, fontFamily: MONO }}>{u.title}</div>
            <div className="text-xs" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.6 }}>{u.desc}</div>
          </div>
        ))}
      </div>
      <SubHeading>Direct Routing</SubHeading>
      <Paragraph>Direct Routing bypasses queues entirely. The interaction is sent directly to a specific agent by user ID. This is used for internal transfers, known-agent callbacks, and extension dialing. Unlike Preferred Agent (which falls back to a queue), Direct Routing has no automatic fallback — if the target agent is unavailable, the interaction must be handled by the Architect flow (e.g., voicemail, redirect to queue).</Paragraph>
    </section>

    {/* T3S4 */}
    <section ref={el => sectionRefs.current['t3s4'] = el} id="t3s4">
      <SectionHeading>Advanced Architect Patterns</SectionHeading>
      <Paragraph>Advanced Architect configurations combine data actions, conditional logic, and dynamic routing to create intelligent, context-aware routing that adapts to each individual interaction.</Paragraph>
      <div className="space-y-4 my-4">
        {ADVANCED_ARCHITECT_PATTERNS.map((p, i) => (
          <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
            <div className="font-bold text-sm mb-3" style={{ color: C.t1, fontFamily: MONO }}>{p.title}</div>
            <div className="space-y-1">
              {p.steps.map((s, j) => (
                <div key={j} className="text-xs flex items-start gap-2" style={{ color: C.t2, fontFamily: MONO }}>
                  <ArrowRight size={10} style={{ color: C.blue, flexShrink: 0, marginTop: 3 }} />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <SubHeading>Callback Handling</SubHeading>
      <Paragraph>Callbacks in Genesys Cloud are created by the In-Queue Flow when a caller opts to receive a callback instead of waiting on hold. The callback is scheduled and placed as an outbound call to the customer's number. The system then routes the callback through the original queue when an agent becomes available. Key considerations: callback scheduling respects business hours, the callback inherits the original interaction's skills and priority, and agents see a screen pop indicating this is a callback (not a new inbound call).</Paragraph>
      <SubHeading>Position in Queue & Estimated Wait Time</SubHeading>
      <Paragraph>In-Queue flows can announce the caller's position in queue and the estimated wait time using built-in Architect functions. The "Get Estimated Wait Time" action returns the predicted wait in seconds based on current queue conditions — agents available, current handle times, and interactions ahead. Best practice: announce EWT only when it's reasonably accurate (more than 3 agents active), and offer a callback when EWT exceeds your threshold (commonly 2-3 minutes).</Paragraph>
    </section>

    {/* T3S5 */}
    <section ref={el => sectionRefs.current['t3s5'] = el} id="t3s5">
      <SectionHeading>API & Integration</SectionHeading>
      <Paragraph>The Genesys Cloud Routing API provides complete programmatic control over queues, skills, languages, agent memberships, and real-time analytics. This enables CRM-driven routing, custom dashboards, and automated queue management.</Paragraph>
      <SubHeading>Key API Endpoints</SubHeading>
      <InteractiveTable searchable headers={['Method', 'Endpoint', 'Use']} rows={API_ENDPOINTS.map(e => [e.method, e.path, e.use])} />
      <SubHeading>Real-Time Notifications</SubHeading>
      <Paragraph>Subscribe to notification topics for real-time queue events without polling. Key topics:</Paragraph>
      <CodeBlock>{`// Queue-level notifications
v2.routing.queues.{queueId}.conversations        // New interaction in queue
v2.routing.queues.{queueId}.users                 // Agent joined/left queue

// User-level notifications
v2.users.{userId}.conversations                   // Agent's active conversations
v2.users.{userId}.routingStatus                   // Agent routing status changes

// Analytics notifications
v2.analytics.queues.{queueId}.observations        // Real-time queue stats update`}</CodeBlock>
      <SubHeading>Custom Routing via Data Actions</SubHeading>
      <Paragraph>Data Actions in Architect flows enable real-time integration with external systems during the routing decision. Use cases: CRM lookup to determine customer tier, external skills engine to dynamically set routing skills, workforce management integration to check agent availability across sites, and real-time fraud detection that routes flagged interactions to a special security queue.</Paragraph>
    </section>

    {/* T3S6 */}
    <section ref={el => sectionRefs.current['t3s6'] = el} id="t3s6">
      <SectionHeading>Platform Limits — The Complete Reference</SectionHeading>
      <InteractiveTable searchable headers={['Resource', 'Limit', 'Notes']} rows={PLATFORM_LIMITS} />
    </section>

    {/* T3S7 */}
    <section ref={el => sectionRefs.current['t3s7'] = el} id="t3s7">
      <SectionHeading>Licensing & Feature Matrix</SectionHeading>
      <Paragraph>Genesys Cloud is available in three license tiers: GC1, GC2, and GC3. Most inbound routing features are available across all tiers, with advanced AI capabilities and premium channels requiring higher tiers or add-ons.</Paragraph>
      <InteractiveTable headers={['Feature', 'GC1', 'GC2', 'GC3']} rows={LICENSE_MATRIX} />
      <CalloutBox type="info">
        <strong>License note:</strong> GC1 includes voice and basic digital channels. GC2 adds full omnichannel (email, chat, messaging). GC3 adds AI capabilities including Predictive Routing, speech analytics, and workforce engagement management. Social messaging channels and WhatsApp may require additional per-agent add-on licensing depending on tier.
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
const GenesysRoutingGuide = ({ onBack, isDark: isDarkProp, setIsDark: setIsDarkProp }) => {
  const [activeTier, setActiveTier] = useState(0);
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
            <span className="font-bold text-sm hidden sm:block" style={{ fontFamily: MONO, color: C.blue }}>GENESYS ROUTING GUIDE</span>
            <span className="font-bold text-sm sm:hidden" style={{ fontFamily: MONO, color: C.blue }}>GC ROUTING</span>
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
      <Footer title="Genesys Cloud Inbound Routing — Interactive Knowledge Guide" />
    </div>
  );
};

export default GenesysRoutingGuide;
