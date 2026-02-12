import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Rocket, Settings, Cpu, Search, ChevronDown, ChevronUp, ChevronRight,
  Menu, X, Phone, Mail, MessageSquare, Bell, RefreshCw, CheckCircle,
  AlertTriangle, AlertCircle, Info, Lightbulb, Star, ExternalLink,
  BookOpen, ArrowRight, ArrowDown, ArrowLeft, Circle, Zap, Shield, Clock, Users,
  FileText, Database, Activity, BarChart3, Target, PhoneCall, Monitor,
  Hash, Layers, Eye, ClipboardList, Volume2, Sun, Moon, GitBranch, Filter,
  Shuffle, UserCheck, Radio, Headphones, Globe, Calendar, Timer, TrendingUp,
  Award, Key, Lock, Unlock, MapPin, Code, Terminal, Box, Play, Pause, RotateCw,
  Workflow, Bot, BrainCircuit, PenTool, Wrench
} from 'lucide-react';

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
  'The Big Picture — What Architect Is and How Flows Work',
  'Building Real Flows — Actions, Expressions, and Integrations',
  'Under the Hood — Runtime, Optimization, and Edge Cases',
];
const TIER_AUDIENCES = [
  'For everyone — no experience needed',
  'For administrators & flow designers',
  'For engineers, architects & power users',
];
const TIER_ICONS_KEYS = ['Rocket', 'Settings', 'Cpu'];

// ══════════════════════════════════════════════════════════════
// SECTION METADATA (all tiers)
// ══════════════════════════════════════════════════════════════
const SECTIONS = [
  { tier: 0, id: 't1s1', title: 'What Is Architect?' },
  { tier: 0, id: 't1s2', title: 'The Building Blocks — Key Concepts' },
  { tier: 0, id: 't1s3', title: 'Flow Types Explained Simply' },
  { tier: 0, id: 't1s4', title: 'How a Flow Executes — The Lifecycle' },
  { tier: 0, id: 't1s5', title: 'Key Terminology Glossary' },
  { tier: 1, id: 't2s1', title: 'Prerequisites — Before Building Flows' },
  { tier: 1, id: 't2s2', title: 'Inbound Call Flows — Deep Dive' },
  { tier: 1, id: 't2s3', title: 'Data Actions in Flows' },
  { tier: 1, id: 't2s4', title: 'Expressions & Variables' },
  { tier: 1, id: 't2s5', title: 'Reusable Components — Common Modules & Tasks' },
  { tier: 1, id: 't2s6', title: 'Bot Flows in Architect' },
  { tier: 1, id: 't2s7', title: 'Secure Call Flows' },
  { tier: 1, id: 't2s8', title: 'Testing & Debugging Flows' },
  { tier: 2, id: 't3s1', title: 'Flow Execution Architecture' },
  { tier: 2, id: 't3s2', title: 'Advanced Expression Patterns' },
  { tier: 2, id: 't3s3', title: 'Error Handling Patterns' },
  { tier: 2, id: 't3s4', title: 'Performance Optimization' },
  { tier: 2, id: 't3s5', title: 'API & Programmatic Management' },
  { tier: 2, id: 't3s6', title: 'Platform Limits — The Complete Reference' },
  { tier: 2, id: 't3s7', title: 'Licensing & Feature Matrix' },
  { tier: 2, id: 't3s8', title: 'Troubleshooting Decision Tree' },
];

// ══════════════════════════════════════════════════════════════
// T1 DATA
// ══════════════════════════════════════════════════════════════
const ARCHITECT_MAP_NODES = [
  { id: 'flows', label: 'FLOWS', sub: 'Top-level container', x: 400, y: 60 },
  { id: 'tasks', label: 'TASKS', sub: 'Reusable sub-routines', x: 130, y: 150 },
  { id: 'states', label: 'STATES', sub: 'Bot conversation states', x: 670, y: 150 },
  { id: 'menus', label: 'MENUS', sub: 'IVR choice menus', x: 80, y: 310 },
  { id: 'actions', label: 'ACTIONS', sub: 'Individual operations', x: 110, y: 450 },
  { id: 'variables', label: 'VARIABLES', sub: 'Data containers', x: 300, y: 540 },
  { id: 'expressions', label: 'EXPRESSIONS', sub: 'Dynamic logic', x: 720, y: 310 },
];
const ARCHITECT_MAP_CENTER = { x: 400, y: 300 };

const ARCHITECT_NODE_TOOLTIPS = {
  flows: { explanation: 'The top-level container for all automation logic. Each flow has a type (inbound call, chat, email, bot, etc.) and contains one or more tasks or states.', analogy: 'A recipe book — the complete set of instructions for a specific meal' },
  tasks: { explanation: 'Named, reusable blocks of actions within a flow. Tasks group related logic and can call other tasks. Every flow starts in a "Starting Task" which executes first.', analogy: 'Chapters in a recipe — "Prep the ingredients", "Make the sauce", "Assemble and serve"' },
  states: { explanation: 'Used in Bot Flows to model conversational turns. Each state represents a point where the bot asks a question, processes a response, or takes an action.', analogy: 'Steps in a conversation — "Ask name", "Confirm order", "Say goodbye"' },
  menus: { explanation: 'IVR menu structures in call flows that present options to the caller (Press 1 for Sales, Press 2 for Support). Each menu choice leads to a different branch of logic.', analogy: 'A restaurant menu — the customer picks an option, and the kitchen (flow) prepares accordingly' },
  actions: { explanation: 'The individual building blocks of a flow — atomic operations like Transfer to ACD, Play Audio, Call Data Action, Set Variable, Decision, Loop, etc.', analogy: 'Individual cooking steps — "Chop onions", "Heat oil", "Stir for 3 minutes"' },
  variables: { explanation: 'Named containers that store data during flow execution. Types include String, Integer, Boolean, DateTime, Collection, and JSON. Variables can be flow-scoped or task-scoped.', analogy: 'Labeled jars in a kitchen — each holds a specific ingredient (data) you reference by name' },
  expressions: { explanation: 'Formulas that compute values dynamically at runtime. Expressions can manipulate strings, perform math, parse dates, and evaluate conditions using built-in functions.', analogy: 'A calculator built into the recipe — "double the quantity if serving more than 4 people"' },
};

const FLOW_TYPES_DATA = [
  { name: 'Inbound Call', desc: 'Handles incoming voice calls. Contains IVR menus, schedule checks, data lookups, and Transfer to ACD actions. Attached to phone numbers (DIDs).', color: C.orange, icon: 'PhoneCall' },
  { name: 'Inbound Chat', desc: 'Handles incoming web chat interactions from website widgets. Collects pre-chat information, checks agent availability, and routes to queues.', color: C.blue, icon: 'MessageSquare' },
  { name: 'Inbound Email', desc: 'Handles incoming emails. Parses subject lines and body content, auto-categorizes, and routes to specialized queues.', color: C.green, icon: 'Mail' },
  { name: 'Inbound Message', desc: 'Handles SMS, WhatsApp, Facebook Messenger, LINE, Twitter DM, and other messaging channels. Attached to messaging deployments.', color: C.purple, icon: 'Globe' },
  { name: 'Outbound Call', desc: 'Controls logic for outbound dialing campaigns. Handles answering machine detection, live-person handoff, and disposition recording.', color: C.red, icon: 'Phone' },
  { name: 'Bot Flow', desc: 'Conversational AI flow using Genesys Dialog Engine or third-party NLU. Uses states (not tasks) to model conversation turns with intent and slot recognition.', color: C.yellow, icon: 'Bot' },
  { name: 'Digital Bot Flow', desc: 'Bot flow specifically for digital channels (chat, message). Supports rich media responses, quick replies, and card-based UI elements.', color: '#06B6D4', icon: 'BrainCircuit' },
  { name: 'Secure Call Flow', desc: 'Isolates sensitive data collection (credit cards, SSNs) in a PCI-compliant environment. Agent is muted; DTMF tones are masked. Data never touches Genesys logs.', color: C.red, icon: 'Shield' },
  { name: 'Common Module', desc: 'Reusable flow logic callable from any other flow. Perfect for shared tasks like CRM lookups, authentication, or skill assignment logic.', color: '#EC4899', icon: 'Layers' },
  { name: 'In-Queue Flow', desc: 'Controls the waiting experience while an interaction sits in a queue — hold music, position announcements, estimated wait time, and callback offers.', color: C.orange, icon: 'Clock' },
  { name: 'Workflow', desc: 'Non-real-time automation triggered by events (conversation end, status change) or schedules. Used for post-call processing, data sync, and notifications.', color: C.green, icon: 'Workflow' },
];

const FLOW_LIFECYCLE = [
  { step: 1, title: 'TRIGGER EVENT OCCURS', desc: 'A customer dials a phone number (inbound call), starts a chat (inbound chat), sends an email, or a scheduled event fires (workflow). The trigger determines which flow executes.', color: C.green, icon: 'Zap' },
  { step: 2, title: 'FLOW ENGINE LOADS THE FLOW', desc: 'The Architect runtime engine loads the published version of the flow. Draft versions are never executed. The engine initializes all flow-level variables to their default values.', color: C.blue, icon: 'Play' },
  { step: 3, title: 'STARTING TASK BEGINS', desc: 'Execution enters the flow\'s Starting Task (or Initial State in bot flows). Actions execute sequentially from top to bottom within the task.', color: C.orange, icon: 'ArrowRight' },
  {
    step: 4, title: 'ACTIONS EXECUTE SEQUENTIALLY', color: C.yellow, icon: 'Activity',
    desc: 'Each action runs in order:',
    checks: [
      'Decision actions evaluate conditions and branch to Yes/No paths',
      'Data Actions call external APIs and store results in variables',
      'Play Audio / Send Response delivers content to the customer',
      'Set Variable stores computed values for later use',
      'Switch actions evaluate expressions against multiple cases',
      'Loop actions iterate over collections',
      'Call Task jumps to another task within the same flow',
    ],
  },
  { step: 5, title: 'TRANSFER OR DISCONNECT', desc: 'The flow reaches a terminal action: Transfer to ACD (send to queue), Transfer to User (send to agent), Transfer to Flow (hand off to another flow), or Disconnect. For bot flows, this may be a handoff to an agent queue.', color: C.purple, icon: 'Shuffle' },
  { step: 6, title: 'FLOW EXECUTION ENDS', desc: 'The runtime engine releases all resources. Flow variables are discarded. If the interaction was transferred to a queue, the in-queue flow takes over. Analytics events are recorded for reporting.', color: C.green, icon: 'CheckCircle' },
];

const GLOSSARY = [
  { term: 'Architect', def: 'The visual drag-and-drop flow designer in Genesys Cloud used to build IVR logic, bot conversations, and automation workflows', tier: 'Tier 1' },
  { term: 'Flow', def: 'A container of automation logic — the top-level object in Architect. Each flow has a type (inbound call, bot, workflow, etc.) and contains tasks or states', tier: 'Tier 1' },
  { term: 'Task', def: 'A named, reusable block of actions within a flow. Tasks can call other tasks. The Starting Task runs first when the flow executes', tier: 'Tier 1' },
  { term: 'State', def: 'A conversation turn in a Bot Flow. Each state handles a specific part of the dialogue (ask a question, process input, confirm, etc.)', tier: 'Tier 1' },
  { term: 'Action', def: 'An individual operation within a task — e.g., Play Audio, Decision, Transfer to ACD, Call Data Action, Set Variable', tier: 'Tier 1' },
  { term: 'Variable', def: 'A named data container scoped to the flow or task. Supports types: String, Integer, Boolean, DateTime, Decimal, Collection, JsonObject', tier: 'Tier 2' },
  { term: 'Expression', def: 'A formula evaluated at runtime to compute a value — e.g., Concatenate("Hello ", Flow.CustomerName) or AddHours(GetCurrentDateTimeUtc(), 2)', tier: 'Tier 2' },
  { term: 'Data Action', def: 'An action that calls an external REST API during flow execution. Requires an input contract and output contract. Results are stored in variables', tier: 'Tier 2' },
  { term: 'Common Module', def: 'A reusable flow component that can be invoked from multiple flows — like a shared library function', tier: 'Tier 2' },
  { term: 'Menu', def: 'An IVR menu structure that presents numbered options to callers via DTMF (keypress) or speech recognition', tier: 'Tier 1' },
  { term: 'Transfer to ACD', def: 'The action that sends an interaction to a queue for agent handling, with optional skills, language, and priority', tier: 'Tier 1' },
  { term: 'Collect Input', def: 'An action that gathers DTMF digits or speech input from the caller, storing the result in a variable', tier: 'Tier 2' },
  { term: 'Archy', def: 'The Genesys Cloud CLI tool for importing, exporting, and managing Architect flows as YAML files — enables CI/CD workflows', tier: 'Tier 3' },
  { term: 'In-Queue Flow', def: 'A flow that controls the caller experience while waiting in a queue — hold music, announcements, callback offers', tier: 'Tier 1' },
  { term: 'Workflow', def: 'A non-real-time flow triggered by events or schedules. Runs in the background for post-call processing, notifications, or data sync', tier: 'Tier 2' },
  { term: 'Publish', def: 'The act of deploying a flow from draft to production. Only published flows execute. Draft changes do not affect live interactions', tier: 'Tier 1' },
  { term: 'Secure Flow', def: 'A PCI-compliant flow type that isolates sensitive data entry (credit cards, SSNs) so the data never appears in logs or recordings', tier: 'Tier 2' },
  { term: 'NLU', def: 'Natural Language Understanding — the AI engine that interprets customer intent from free-form text or speech in bot flows', tier: 'Tier 2' },
  { term: 'Intent', def: 'A purpose or goal the customer is trying to accomplish, recognized by the NLU engine in bot flows (e.g., "CheckBalance", "ResetPassword")', tier: 'Tier 2' },
  { term: 'Slot', def: 'A variable within an intent that captures specific information from the customer utterance (e.g., account number, date, product name)', tier: 'Tier 2' },
];

// ══════════════════════════════════════════════════════════════
// T2 DATA
// ══════════════════════════════════════════════════════════════
const PREREQUISITES = [
  { title: 'Permissions Configured', detail: 'Users who design flows need the Architect > Flow > Add/Edit/View/Delete/Publish permissions. Assign the "Architect Admin" or "Master Admin" role. For read-only review access, grant Architect > Flow > View only. Division-level permissions control which flows a designer can see and edit.' },
  { title: 'Queues & Skills Created', detail: 'Before building routing flows, the queues you want to transfer interactions to must exist. Skills and languages should be defined so flows can set them on interactions before transfer. This is an Admin > Routing task, not an Architect task — but flows depend on it.' },
  { title: 'Data Actions Configured', detail: 'If your flows will call external APIs (CRM lookups, database queries), the Data Actions must be created first in Admin > Integrations > Actions. Each data action has an input contract (what the flow sends) and output contract (what comes back). Test them before using in flows.' },
  { title: 'Audio Prompts Uploaded (Voice)', detail: 'For voice flows, pre-record audio prompts or plan to use Text-to-Speech (TTS). Upload WAV or MP3 files in Admin > Architect > User Prompts. TTS is available for quick prototyping but professional recordings improve caller experience. Prompts support multiple languages.' },
  { title: 'Schedules & Schedule Groups Set Up', detail: 'Schedule Groups define business hours, holidays, and emergency states. Flows use the "Evaluate Schedule Group" action to branch logic based on open/closed/holiday/emergency. Create schedules in Admin > Contact Center > Scheduling before building schedule-dependent flows.' },
];

const IVR_ACTIONS = [
  { action: 'Play Audio', desc: 'Plays a pre-recorded audio file or TTS text to the caller. Supports SSML for fine-grained TTS control (pauses, emphasis, pronunciation).', category: 'Audio' },
  { action: 'Collect Input', desc: 'Waits for DTMF digits from the caller and stores the result. Configure min/max digits, inter-digit timeout, and terminating key (#).', category: 'Input' },
  { action: 'Menu', desc: 'Presents a multi-option IVR menu. Each option maps to a DTMF key (0-9, *, #) or speech phrase. Includes timeout and invalid-input handling.', category: 'Input' },
  { action: 'Transfer to ACD', desc: 'Routes the interaction to a queue with optional skills, language, priority, and attributes. This is the most common terminal action.', category: 'Transfer' },
  { action: 'Transfer to User', desc: 'Routes the interaction directly to a specific agent (by user ID or extension). No queue evaluation occurs.', category: 'Transfer' },
  { action: 'Transfer to Number', desc: 'Blind transfers the call to an external phone number. The flow loses control of the interaction after transfer.', category: 'Transfer' },
  { action: 'Evaluate Schedule Group', desc: 'Checks the current time against a schedule group and returns one of four branches: Open, Closed, Holiday, or Emergency.', category: 'Logic' },
  { action: 'Call Data Action', desc: 'Invokes a REST API call (GET, POST, PUT, PATCH) to an external system. Input variables are sent; response fields are mapped to output variables.', category: 'Integration' },
  { action: 'Decision', desc: 'Evaluates a boolean expression and branches to Yes or No. The most fundamental branching action in Architect.', category: 'Logic' },
  { action: 'Switch', desc: 'Evaluates an expression against multiple cases (like a switch statement). Each case has a value and a branch of actions.', category: 'Logic' },
  { action: 'Set Variable', desc: 'Assigns a value (literal or expression) to a flow or task variable. Used to store computation results, API responses, or caller data.', category: 'Data' },
  { action: 'Get Participant Data', desc: 'Reads custom attributes attached to the interaction by previous flow steps or external systems.', category: 'Data' },
  { action: 'Disconnect', desc: 'Terminates the interaction. Use after delivering a final message (e.g., after-hours announcement).', category: 'Terminal' },
];

const DATA_ACTION_CONFIG = [
  ['Integration Type', 'Web Services Data Actions (REST), Genesys Cloud Data Actions (internal APIs), AWS Lambda, Google Cloud, Salesforce, etc.'],
  ['Input Contract', 'Defines the JSON schema of data sent TO the external service — field names, types, and required/optional status'],
  ['Output Contract', 'Defines the JSON schema of data returned FROM the external service — field names and types that map to flow variables'],
  ['Success Output', 'Variables populated when the data action returns HTTP 2xx — your "happy path" data'],
  ['Failure Output', 'Variables populated when the data action returns an error — includes errorMessage and statusCode for error handling'],
  ['Timeout', 'Max time to wait for a response (default: 12 seconds for synchronous, 60 seconds for async). Exceeding this triggers the failure path'],
  ['Retry Policy', 'Configure automatic retries on transient failures (5xx errors). Default: no retries. Add retries cautiously — they increase flow execution time'],
];

const EXPRESSION_EXAMPLES = [
  { category: 'String', expr: 'Concatenate("Hello, ", Flow.CustomerName, ". How can I help?")', desc: 'Join multiple strings together for dynamic TTS or chat responses' },
  { category: 'String', expr: 'Substring(Flow.AccountNumber, 0, 4)', desc: 'Extract the first 4 characters of a string value' },
  { category: 'String', expr: 'ToString(Flow.CallCount)', desc: 'Convert an integer to a string for use in text prompts' },
  { category: 'DateTime', expr: 'GetCurrentDateTimeUtc()', desc: 'Get the current UTC timestamp' },
  { category: 'DateTime', expr: 'AddHours(GetCurrentDateTimeUtc(), -24)', desc: 'Calculate a time 24 hours in the past' },
  { category: 'DateTime', expr: 'GetDayOfWeek(GetCurrentDateTimeUtc())', desc: 'Returns the day of the week (e.g., "Monday") for conditional logic' },
  { category: 'Numeric', expr: 'If(Flow.QueueWait > 120, true, false)', desc: 'Ternary expression — returns true if wait exceeds 2 minutes' },
  { category: 'Collection', expr: 'Count(Flow.OpenCases)', desc: 'Get the number of items in a collection variable' },
  { category: 'Collection', expr: 'GetAt(Flow.MenuOptions, Flow.SelectionIndex)', desc: 'Retrieve an item from a collection by index' },
  { category: 'JSON', expr: 'GetJsonObjectProperty(Flow.ApiResponse, "customer.tier")', desc: 'Extract a nested property from a JSON object using dot notation' },
];

const COMMON_MODULE_VS_TASK = [
  ['Scope', 'Callable from ANY flow (cross-flow)', 'Callable within the SAME flow only'],
  ['Versioning', 'Independently versioned — update once, all callers get the new version', 'Versioned with the parent flow — changes require republishing the flow'],
  ['Parameters', 'Supports input and output parameters (like a function signature)', 'Shares all flow-level variables (no explicit parameter passing)'],
  ['Use When', 'Logic is shared across multiple flows (CRM lookup, auth, skill assignment)', 'Logic is specific to this flow but needs to be reused within it (retry loop, sub-menu)'],
  ['Complexity', 'Slightly more overhead to set up — must define contracts', 'Simple — just add a new task and call it'],
  ['Debugging', 'Separate debug session — can be tested independently', 'Debugged in context of the parent flow'],
];

const BOT_FLOW_CONCEPTS = [
  { name: 'Intent', desc: 'A purpose the customer wants to accomplish — "CheckBalance", "ResetPassword", "ScheduleAppointment". The NLU engine maps utterances to intents.', color: C.blue },
  { name: 'Utterance', desc: 'A sample phrase that trains the NLU model — "What is my balance?", "Can you tell me how much I owe?", "Show me my account". Provide 10-20 per intent.', color: C.orange },
  { name: 'Slot', desc: 'A variable within an intent that captures specific data — "account number", "appointment date", "product name". Slots have types (string, date, number, custom entity).', color: C.green },
  { name: 'State', desc: 'A conversation turn in the bot flow. States can ask questions, confirm responses, call data actions, or transfer to a human agent.', color: C.purple },
  { name: 'Confirmation', desc: 'After filling slots, the bot confirms with the customer: "You want to check the balance for account ending in 4532, correct?" Reduces errors.', color: C.yellow },
  { name: 'Failure Handling', desc: 'When the NLU cannot recognize the intent after max retries, the bot transfers to a human agent with full context of the conversation so far.', color: C.red },
];

const SECURE_FLOW_STEPS = [
  { step: 1, text: 'Agent initiates a secure session from their desktop — the call is transferred to the Secure Call Flow', color: C.blue },
  { step: 2, text: 'Agent audio is muted — they cannot hear DTMF tones. Screen pop shows "Secure input in progress"', color: C.orange },
  { step: 3, text: 'Flow prompts customer: "Please enter your 16-digit credit card number followed by the pound key"', color: C.yellow },
  { step: 4, text: 'DTMF tones are captured by the secure flow — NOT recorded, NOT logged, NOT stored in Genesys', color: C.red },
  { step: 5, text: 'Secure flow calls a PCI-compliant payment gateway via Data Action to process the card', color: C.purple },
  { step: 6, text: 'Payment result (approved/declined) is stored in a non-sensitive variable and passed back to the agent', color: C.green },
  { step: 7, text: 'Secure session ends — agent audio is unmuted, call continues normally with the result', color: C.blue },
];

const DEBUG_TIPS = [
  { title: 'Enable Debug Mode', desc: 'In Architect, click the Debug button to start a test call through your flow. You can step through actions, inspect variable values at each step, and see exactly which branches are taken.' },
  { title: 'Check Flow Outcomes', desc: 'Flow outcomes (success, failure, error) are recorded in the Analytics API. Use conversation detail queries to see which flows executed, which actions ran, and where failures occurred.' },
  { title: 'Use Trace Logging', desc: 'Add "Update Data" actions that write diagnostic information to participant attributes. These appear in the conversation record and help trace flow execution in production.' },
  { title: 'Test Data Actions Separately', desc: 'Before embedding a data action in a flow, test it in the Admin > Integrations > Actions interface. Provide sample inputs and verify the output contract. This isolates integration issues from flow logic.' },
  { title: 'Common Pitfalls', desc: 'Unpublished flows (drafts don\'t execute). Uninitialized variables (null reference errors). Data action timeouts (external API slow). Schedule group returning unexpected state. Expression type mismatches (String vs Integer).' },
];

// ══════════════════════════════════════════════════════════════
// T3 DATA
// ══════════════════════════════════════════════════════════════
const RUNTIME_PIPELINE = [
  '1. Trigger event fires (call arrives, chat starts, workflow scheduled)',
  '2. Runtime engine resolves the flow binding — which published flow version handles this trigger?',
  '3. Flow definition (compiled JSON) is loaded into memory',
  '4. Variable initialization — all flow variables set to default values',
  '5. Starting Task (or Initial State) begins execution',
  '6. Actions execute top-to-bottom: each action is an atomic unit',
  '7. Branching actions (Decision, Switch, Menu) redirect execution flow',
  '8. Call Task actions push to a task call stack — return pops back',
  '9. Data Actions invoke external services asynchronously — flow waits for response or timeout',
  '10. Terminal action reached (Transfer, Disconnect, End Flow) — execution halts',
  '11. Runtime cleans up: variables released, analytics events emitted',
  '12. If transferred to queue: in-queue flow takes over; interaction persists with attached data',
];

const ADVANCED_EXPRESSIONS = [
  { title: 'JSON Parsing Chain', code: `// Extract nested value from API response
GetJsonObjectProperty(
  GetJsonObjectProperty(Flow.ApiResponse, "data"),
  "customer.loyaltyTier"
)
// Result: "Gold" (from { data: { customer: { loyaltyTier: "Gold" } } })` },
  { title: 'Collection Filtering', code: `// Count open high-priority cases
Count(
  FindAll(Flow.Cases, "item.status == \\"open\\" AND item.priority <= 2")
)
// Returns the number of matching items in the collection` },
  { title: 'Dynamic String Template', code: `// Build a dynamic TTS prompt
Concatenate(
  "Welcome back, ", Flow.CustomerName, ". ",
  If(Flow.OpenCaseCount > 0,
    Concatenate("You have ", ToString(Flow.OpenCaseCount), " open cases. "),
    "You have no open cases. "
  ),
  "How can I help you today?"
)` },
  { title: 'Date Arithmetic', code: `// Check if a case is overdue (older than 48 hours)
If(
  DateTimeDiff(GetCurrentDateTimeUtc(), Flow.CaseCreatedDate, "hours") > 48,
  true,
  false
)
// Returns true if the case was created more than 48 hours ago` },
  { title: 'Null-Safe Property Access', code: `// Safely read a property that might not exist
If(
  IsSet(Flow.ApiResponse) AND IsNotEmpty(Flow.ApiResponse),
  GetJsonObjectProperty(Flow.ApiResponse, "customer.name"),
  "Valued Customer"
)
// Fallback to "Valued Customer" if response is null or empty` },
];

const ERROR_HANDLING_PATTERNS = [
  {
    title: 'Global Error Handler',
    desc: 'Every flow has an implicit error handler. When an unhandled exception occurs (data action timeout, expression error, system failure), the flow jumps to the error handling path. Configure this to play an apology message and transfer to a catch-all queue rather than disconnecting.',
    steps: ['Set up a dedicated "Error Handling" task', 'Play: "We\'re experiencing a technical issue. Let me connect you with an agent."', 'Transfer to ACD: "General_Fallback" queue with no skill requirements', 'Log error details to participant attributes for debugging'],
  },
  {
    title: 'Data Action Retry Pattern',
    desc: 'External APIs can fail intermittently. Build a retry loop that attempts the data action up to 3 times before falling back to a default behavior.',
    steps: ['Set Flow.RetryCount = 0', 'Loop: While Flow.RetryCount < 3', 'Call Data Action → On Success: break out of loop', 'On Failure: Flow.RetryCount = Flow.RetryCount + 1, wait 2 seconds', 'After loop: If still failed → use cached/default data and continue'],
  },
  {
    title: 'Graceful Degradation',
    desc: 'When a CRM lookup fails, don\'t block the entire flow. Fall back to a generic experience — the caller still gets helped, just without personalization.',
    steps: ['Call Data Action: CRM Lookup by ANI', 'On Success: Set Flow.CustomerName, Flow.AccountTier, personalize greeting', 'On Failure: Set Flow.CustomerName = "Valued Customer", Flow.AccountTier = "Standard"', 'Continue flow with whatever data is available — never let a failed lookup prevent routing'],
  },
  {
    title: 'Timeout Escalation',
    desc: 'If a flow step takes too long (e.g., waiting for caller input), escalate rather than looping forever.',
    steps: ['Collect Input with 10-second timeout', 'On timeout: play "I didn\'t receive any input"', 'Retry up to 2 times (3 attempts total)', 'After 3 failed attempts: Transfer to ACD with a note "Customer unable to navigate IVR"'],
  },
];

const PERFORMANCE_TIPS = [
  { category: 'Flow Design', tip: 'Keep flows under 200 actions. Break complex logic into Common Modules.', impact: 'High' },
  { category: 'Flow Design', tip: 'Place the most common decision branches FIRST in Switch actions to minimize evaluation steps.', impact: 'Medium' },
  { category: 'Data Actions', tip: 'Minimize data action calls — each one adds network latency (typically 200-500ms). Cache results in variables.', impact: 'High' },
  { category: 'Data Actions', tip: 'Set appropriate timeouts. Default 12 seconds is long for a caller waiting in an IVR. Consider 5-8 seconds.', impact: 'High' },
  { category: 'Data Actions', tip: 'Batch multiple lookups into a single API call when possible, rather than making separate calls.', impact: 'Medium' },
  { category: 'Variables', tip: 'Use task-scoped variables for temporary data to reduce memory footprint during execution.', impact: 'Low' },
  { category: 'Variables', tip: 'Avoid storing large JSON objects in flow variables — extract only the fields you need.', impact: 'Medium' },
  { category: 'Expressions', tip: 'Pre-compute complex expressions into variables rather than repeating the same expression in multiple actions.', impact: 'Medium' },
  { category: 'Audio', tip: 'Use pre-recorded audio instead of TTS for frequently played prompts — faster playback and better quality.', impact: 'Medium' },
  { category: 'Modules', tip: 'Common Modules are loaded once and cached. Moving shared logic into modules reduces per-flow complexity.', impact: 'High' },
];

const API_ENDPOINTS = [
  { method: 'GET', path: '/api/v2/flows', use: 'List all Architect flows with type, name, version, and publish status' },
  { method: 'POST', path: '/api/v2/flows', use: 'Create a new flow (requires flow definition JSON)' },
  { method: 'GET', path: '/api/v2/flows/{flowId}', use: 'Get a specific flow\'s metadata and configuration' },
  { method: 'GET', path: '/api/v2/flows/{flowId}/latestconfiguration', use: 'Download the full flow definition (compiled JSON/YAML)' },
  { method: 'POST', path: '/api/v2/flows/actions/publish', use: 'Publish a flow version to make it live' },
  { method: 'POST', path: '/api/v2/flows/actions/checkin', use: 'Check in a flow (unlock for other editors)' },
  { method: 'POST', path: '/api/v2/flows/actions/checkout', use: 'Check out a flow (lock for editing)' },
  { method: 'GET', path: '/api/v2/flows/{flowId}/versions', use: 'List all versions of a flow with timestamps and authors' },
  { method: 'GET', path: '/api/v2/flows/datatables', use: 'List all Architect data tables (lookup tables used in flows)' },
  { method: 'POST', path: '/api/v2/flows/datatables/{datatableId}/rows', use: 'Add or query rows in an Architect data table' },
  { method: 'GET', path: '/api/v2/flows/milestones', use: 'List flow milestones (named checkpoints for analytics)' },
  { method: 'GET', path: '/api/v2/flows/outcomes', use: 'List flow outcomes for tracking success/failure metrics' },
];

const PLATFORM_LIMITS = [
  ['Flows per org', '1,000', 'Across all flow types'],
  ['Actions per flow', '500', 'Total actions in a single flow'],
  ['Tasks per flow', '250', 'Named task blocks within a flow'],
  ['Variables per flow', '250', 'Flow-scoped variables'],
  ['Variables per task', '50', 'Task-scoped variables'],
  ['Expression length', '5,000 chars', 'Maximum characters in a single expression'],
  ['Menu choices per menu', '12', 'DTMF keys 0-9, *, #'],
  ['Nesting depth (tasks)', '25', 'Call Task within Call Task depth limit'],
  ['Common modules per org', '200', 'Reusable flow modules'],
  ['Data table rows', '10,000', 'Per Architect data table'],
  ['Data table columns', '20', 'Per Architect data table'],
  ['Data tables per org', '200', 'Lookup tables'],
  ['Audio prompts per org', '5,000', 'Pre-recorded prompt files'],
  ['Prompt file size', '50 MB', 'Maximum per audio file'],
  ['TTS character limit', '10,000', 'Characters per TTS action'],
  ['Data action timeout (sync)', '12 seconds', 'Default; configurable up to 60s'],
  ['Data action timeout (async)', '60 seconds', 'For workflow-type flows'],
  ['Flow publish history', '200 versions', 'Per flow; oldest versions pruned'],
  ['Concurrent flow executions', 'Unlimited', 'Platform scales automatically'],
  ['Bot intents per flow', '250', 'Maximum intents in a bot flow'],
  ['Bot utterances per intent', '250', 'Training phrases per intent'],
  ['Slots per intent', '25', 'Variables captured per intent'],
];

const LICENSE_MATRIX = [
  ['Architect Inbound Call Flows', true, true, true],
  ['Architect Inbound Chat/Email Flows', true, true, true],
  ['Architect Inbound Message Flows', 'add-on', true, true],
  ['Common Modules', true, true, true],
  ['In-Queue Flows', true, true, true],
  ['Outbound Call Flows', true, true, true],
  ['Workflow (event-triggered)', true, true, true],
  ['Data Actions (Web Services)', true, true, true],
  ['Architect Data Tables', true, true, true],
  ['Text-to-Speech (TTS)', true, true, true],
  ['Bot Flows (Genesys Dialog Engine)', false, true, true],
  ['Digital Bot Flows', false, true, true],
  ['Secure Call Flows (PCI)', 'add-on', 'add-on', true],
  ['Third-party NLU integration', false, false, true],
  ['Advanced speech recognition (ASR)', false, 'add-on', true],
  ['Flow milestones & outcomes analytics', true, true, true],
];

const TROUBLESHOOTING = [
  { symptom: 'Flow not executing — calls go to default handling', investigation: 'Check: Is the flow PUBLISHED? (Draft flows do not execute.) Is the correct flow assigned to the phone number/DID? (Admin > Telephony > Call Routing) Is the flow in the correct Division? (Check division assignments in Admin > People & Permissions > Divisions) Does the user have the correct permissions to view the flow binding? Check flow publish status via the Architect UI or GET /api/v2/flows/{flowId}.' },
  { symptom: 'Data Action returning errors in the flow', investigation: 'Check: Test the data action OUTSIDE the flow first (Admin > Integrations > Actions > Test). Verify the input contract matches what the flow is sending (type mismatches are common). Check the external API endpoint — is it accessible from Genesys Cloud? (Firewall rules, IP whitelisting) Review the timeout setting — is the API slower than the configured timeout? Check authentication credentials (OAuth token expired? API key rotated?).' },
  { symptom: 'Schedule evaluation returning wrong state', investigation: 'Check: Verify the timezone on the schedule — is it set to the correct IANA timezone? Are holiday schedules overriding the regular schedule? (Holidays take precedence.) Is an Emergency Toggle active? (Admin > Contact Center > Emergency Groups) Check for overlapping schedule blocks within the same schedule group. Use Architect Debug mode to step through the Evaluate Schedule Group action and inspect the output.' },
  { symptom: 'Variables losing values or returning null', investigation: 'Check: Is the variable initialized before use? (Unset variables return NOT_SET, not null.) Are you mixing task-scoped and flow-scoped variables? (Task variables are cleared when the task ends.) Is a data action failure path being taken without setting fallback values? Check expression syntax — type mismatches (comparing String to Integer) cause silent failures. Use the Architect Debugger to inspect variable values at each step.' },
  { symptom: 'Bot flow not recognizing customer intents', investigation: 'Check: Does each intent have at least 10-15 training utterances? Are utterances varied enough? (Avoid minor variations of the same phrase.) Are slots configured with the correct entity types? Check the NLU confidence threshold — too high causes frequent "I didn\'t understand" responses (default: 0.4 is a good start). Re-train the NLU model after adding new intents or utterances. Use the NLU testing tool to evaluate recognition accuracy before publishing.' },
  { symptom: 'Flow execution time is too long (slow IVR)', investigation: 'Check: How many data action calls does the flow make? Each adds 200-500ms+ of latency. Are there redundant loops or deeply nested task calls? Is TTS being generated for every prompt? (Pre-recorded audio is faster.) Check for expression complexity — very long expressions with many function calls slow evaluation. Review the flow action count — flows approaching 500 actions may hit performance ceilings. Consider breaking into Common Modules for better caching.' },
];

// ══════════════════════════════════════════════════════════════
// SEARCH INDEX
// ══════════════════════════════════════════════════════════════
const SEARCH_INDEX = (() => {
  const idx = [];
  SECTIONS.forEach(s => idx.push({ text: s.title, label: s.title, sectionId: s.id, tier: s.tier, type: 'Section' }));
  ARCHITECT_MAP_NODES.forEach(n => {
    const tooltip = ARCHITECT_NODE_TOOLTIPS[n.id] || {};
    idx.push({ text: `${n.label} ${n.sub} ${tooltip.explanation || ''} ${tooltip.analogy || ''}`, label: n.label, sectionId: 't1s2', tier: 0, type: 'Component' });
  });
  FLOW_TYPES_DATA.forEach(f => idx.push({ text: `${f.name} ${f.desc}`, label: f.name, sectionId: 't1s3', tier: 0, type: 'Flow Type' }));
  FLOW_LIFECYCLE.forEach(f => idx.push({ text: `${f.title} ${f.desc} ${(f.checks || []).join(' ')}`, label: f.title, sectionId: 't1s4', tier: 0, type: 'Lifecycle Step' }));
  GLOSSARY.forEach(g => idx.push({ text: `${g.term} ${g.def}`, label: g.term, sectionId: 't1s5', tier: 0, type: 'Glossary' }));
  PREREQUISITES.forEach(p => idx.push({ text: `${p.title} ${p.detail}`, label: p.title, sectionId: 't2s1', tier: 1, type: 'Prerequisite' }));
  IVR_ACTIONS.forEach(a => idx.push({ text: `${a.action} ${a.desc} ${a.category}`, label: a.action, sectionId: 't2s2', tier: 1, type: 'Action' }));
  DATA_ACTION_CONFIG.forEach(d => idx.push({ text: `${d[0]} ${d[1]}`, label: d[0], sectionId: 't2s3', tier: 1, type: 'Config Option' }));
  EXPRESSION_EXAMPLES.forEach(e => idx.push({ text: `${e.category} ${e.expr} ${e.desc}`, label: `${e.category}: ${e.expr.substring(0, 40)}`, sectionId: 't2s4', tier: 1, type: 'Expression' }));
  COMMON_MODULE_VS_TASK.forEach(r => idx.push({ text: `${r[0]} ${r[1]} ${r[2]}`, label: r[0], sectionId: 't2s5', tier: 1, type: 'Comparison' }));
  BOT_FLOW_CONCEPTS.forEach(b => idx.push({ text: `${b.name} ${b.desc}`, label: b.name, sectionId: 't2s6', tier: 1, type: 'Bot Concept' }));
  SECURE_FLOW_STEPS.forEach(s => idx.push({ text: `Step ${s.step} ${s.text}`, label: `Secure Step ${s.step}`, sectionId: 't2s7', tier: 1, type: 'Secure Flow' }));
  DEBUG_TIPS.forEach(t => idx.push({ text: `${t.title} ${t.desc}`, label: t.title, sectionId: 't2s8', tier: 1, type: 'Debug Tip' }));
  RUNTIME_PIPELINE.forEach(s => idx.push({ text: s, label: s.substring(0, 50), sectionId: 't3s1', tier: 2, type: 'Runtime Step' }));
  ADVANCED_EXPRESSIONS.forEach(e => idx.push({ text: `${e.title} ${e.code}`, label: e.title, sectionId: 't3s2', tier: 2, type: 'Expression' }));
  ERROR_HANDLING_PATTERNS.forEach(p => idx.push({ text: `${p.title} ${p.desc} ${p.steps.join(' ')}`, label: p.title, sectionId: 't3s3', tier: 2, type: 'Error Pattern' }));
  PERFORMANCE_TIPS.forEach(t => idx.push({ text: `${t.category} ${t.tip} ${t.impact}`, label: `${t.category}: ${t.tip.substring(0, 40)}`, sectionId: 't3s4', tier: 2, type: 'Performance Tip' }));
  API_ENDPOINTS.forEach(e => idx.push({ text: `${e.method} ${e.path} ${e.use}`, label: `${e.method} ${e.path}`, sectionId: 't3s5', tier: 2, type: 'API' }));
  PLATFORM_LIMITS.forEach(l => idx.push({ text: `${l[0]} ${l[1]} ${l[2]}`, label: l[0], sectionId: 't3s6', tier: 2, type: 'Limit' }));
  LICENSE_MATRIX.forEach(l => idx.push({ text: `${l[0]} GC1:${l[1]} GC2:${l[2]} GC3:${l[3]}`, label: l[0], sectionId: 't3s7', tier: 2, type: 'License Feature' }));
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
const ArchitectComponentMapSVG = () => {
  const [active, setActive] = useState(null);
  return (
    <div className="my-6 overflow-x-auto">
      <svg viewBox="0 0 800 600" className="w-full" style={{ maxWidth: 800, minWidth: 600 }}>
        <defs>
          <filter id="glow-a"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        {ARCHITECT_MAP_NODES.map(n => (
          <line key={`line-${n.id}`} x1={ARCHITECT_MAP_CENTER.x} y1={ARCHITECT_MAP_CENTER.y} x2={n.x} y2={n.y} stroke={C.border} strokeWidth="2" strokeDasharray="6,4" />
        ))}
        <g>
          <rect x={ARCHITECT_MAP_CENTER.x - 90} y={ARCHITECT_MAP_CENTER.y - 30} width={180} height={60} rx={12} fill={C.bg3} stroke={C.blue} strokeWidth={2} />
          <text x={ARCHITECT_MAP_CENTER.x} y={ARCHITECT_MAP_CENTER.y - 5} textAnchor="middle" fill={C.t1} fontFamily={MONO} fontSize={12} fontWeight="bold">ARCHITECT ENGINE</text>
          <text x={ARCHITECT_MAP_CENTER.x} y={ARCHITECT_MAP_CENTER.y + 15} textAnchor="middle" fill={C.t3} fontFamily={SANS} fontSize={10}>Visual flow runtime</text>
        </g>
        {ARCHITECT_MAP_NODES.map(n => {
          const isActive = active === n.id;
          const tooltip = ARCHITECT_NODE_TOOLTIPS[n.id];
          return (
            <g key={n.id} className="cursor-pointer" onClick={() => setActive(isActive ? null : n.id)} style={{ transition: 'transform 0.2s' }}>
              <rect x={n.x - 70} y={n.y - 25} width={140} height={50} rx={8} fill={C.bg2} stroke={isActive ? C.blue : C.border} strokeWidth={isActive ? 2 : 1} filter={isActive ? 'url(#glow-a)' : undefined} />
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
      <SectionHeading>What Is Architect?</SectionHeading>
      <Paragraph>Architect is the visual flow design tool in Genesys Cloud CX. It lets you build the automated logic that controls every customer interaction — from the moment a call arrives or a chat starts, through data lookups, menu selections, and bot conversations, all the way to transferring to the right agent or disconnecting gracefully.</Paragraph>
      <Paragraph>Think of Architect as flowchart-based programming. Instead of writing code line by line, you drag and drop actions onto a visual canvas, connect them with branches (if/then/else), and the platform executes them in sequence. If you have ever drawn a flowchart on a whiteboard to explain a process, you already understand the fundamental concept behind Architect.</Paragraph>
      <SubHeading>Why Architect Matters</SubHeading>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        {[
          { title: 'WITHOUT ARCHITECT', items: ['Hardcoded IVR scripts that require a developer to change', 'No data lookups — every caller gets the same experience', 'Static menus that can\'t adapt to time-of-day or caller history', 'Changes require vendor engagement and deployment cycles', 'No bot integration — purely touch-tone IVR'], color: C.red },
          { title: 'WITH ARCHITECT', items: ['Visual drag-and-drop designer — administrators build and modify flows', 'Real-time data lookups: CRM, databases, APIs during the call', 'Dynamic routing based on caller, time, queue status, and custom logic', 'Changes published in minutes — no vendor dependency', 'Integrated bots with NLU for natural-language self-service'], color: C.blue },
        ].map((panel, i) => (
          <div key={i} className="rounded-lg p-5" style={{ backgroundColor: C.bg2, borderTop: `3px solid ${panel.color}` }}>
            <div className="font-bold mb-3 text-sm" style={{ color: panel.color, fontFamily: MONO }}>{panel.title}</div>
            {panel.items.map((item, j) => <div key={j} className="text-sm mb-1.5" style={{ color: C.t2, fontFamily: SANS }}>{item}</div>)}
          </div>
        ))}
      </div>
      <CalloutBox type="tip">Architect flows are the brain of your contact center. Queues, skills, and agents are the body — but the flow logic determines how every interaction is handled. Mastering Architect is the single most impactful skill for a Genesys Cloud administrator.</CalloutBox>
    </section>

    {/* T1S2 */}
    <section ref={el => sectionRefs.current['t1s2'] = el} id="t1s2">
      <SectionHeading>The Building Blocks — Key Concepts</SectionHeading>
      <Paragraph>Architect is built from seven interconnected concepts. Understanding each one — and how they relate — is the foundation for designing effective flows. Think of it like a theater production: the Flow is the entire play, Tasks are the scenes, Actions are the individual lines and stage directions, and Variables are the props that pass between scenes.</Paragraph>
      <CalloutBox type="tip">Click any node in the diagram below to see what it does and a simple analogy.</CalloutBox>
      <ArchitectComponentMapSVG />
      <SubHeading>Component Reference</SubHeading>
      <InteractiveTable
        headers={['Component', 'Simple Explanation', 'Analogy']}
        rows={Object.entries(ARCHITECT_NODE_TOOLTIPS).map(([k, v]) => {
          const node = ARCHITECT_MAP_NODES.find(n => n.id === k);
          return [node?.label || k, v.explanation, v.analogy];
        })}
      />
    </section>

    {/* T1S3 */}
    <section ref={el => sectionRefs.current['t1s3'] = el} id="t1s3">
      <SectionHeading>Flow Types Explained Simply</SectionHeading>
      <Paragraph>Architect supports many flow types, each designed for a specific channel or purpose. Choosing the right flow type is the first decision you make when building automation. Think of flow types like vehicle types — a car, a truck, and a motorcycle all get you from A to B, but they are optimized for different situations.</Paragraph>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 my-4">
        {FLOW_TYPES_DATA.map((ft, i) => (
          <div key={i} className="rounded-lg p-4 transition-all duration-200 hover:-translate-y-0.5" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}`, borderTop: `3px solid ${ft.color}` }}>
            <div className="font-semibold text-sm mb-2" style={{ color: ft.color, fontFamily: MONO }}>{ft.name}</div>
            <div className="text-xs" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.6 }}>{ft.desc}</div>
          </div>
        ))}
      </div>
      <CalloutBox type="info">The most commonly used flow types are Inbound Call, Inbound Chat, In-Queue Flow, and Common Module. Bot Flows and Secure Call Flows are specialized tools you add when you need self-service AI or PCI compliance.</CalloutBox>
    </section>

    {/* T1S4 */}
    <section ref={el => sectionRefs.current['t1s4'] = el} id="t1s4">
      <SectionHeading>How a Flow Executes — The Lifecycle</SectionHeading>
      <Paragraph>Every flow follows the same lifecycle from trigger to completion. Understanding this execution model helps you predict how your flow will behave and where to look when something goes wrong.</Paragraph>
      <div className="my-6 space-y-0">
        {FLOW_LIFECYCLE.map((s, i) => (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: s.color + '22', color: s.color, border: `2px solid ${s.color}`, fontFamily: MONO }}>{s.step}</div>
              {i < FLOW_LIFECYCLE.length - 1 && <div className="w-0.5 flex-1 my-1" style={{ backgroundColor: C.border }} />}
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
  const [activeActionCategory, setActiveActionCategory] = useState('All');
  const actionCategories = ['All', ...new Set(IVR_ACTIONS.map(a => a.category))];
  const filteredActions = activeActionCategory === 'All' ? IVR_ACTIONS : IVR_ACTIONS.filter(a => a.category === activeActionCategory);

  return (
    <div className="space-y-16">
      {/* T2S1 */}
      <section ref={el => sectionRefs.current['t2s1'] = el} id="t2s1">
        <SectionHeading>Prerequisites — Before Building Flows</SectionHeading>
        <Paragraph>Before opening the Architect canvas for the first time, ensure these platform components are in place. Think of this as gathering your ingredients before cooking — you cannot build a CRM-driven IVR if the CRM integration does not exist yet.</Paragraph>
        <div className="space-y-3 my-4">
          {PREREQUISITES.map((p, i) => (
            <ExpandableCard key={i} title={`${i + 1}. ${p.title}`} accent={C.blue}>
              {p.detail}
            </ExpandableCard>
          ))}
        </div>
        <SubHeading>Recommended Setup Sequence</SubHeading>
        <div className="flex flex-wrap items-center gap-1 my-4 overflow-x-auto">
          {['Permissions', 'Queues & Skills', 'Schedules', 'Data Actions', 'Audio Prompts', 'Build Flow', 'Test (Debug)', 'Publish'].map((s, i) => (
            <React.Fragment key={i}>
              <span className="px-3 py-1.5 rounded text-xs whitespace-nowrap" style={{ backgroundColor: C.bg3, color: C.t1, fontFamily: MONO, border: `1px solid ${C.border}` }}>{s}</span>
              {i < 7 && <ArrowRight size={14} style={{ color: C.t3, flexShrink: 0 }} />}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* T2S2 */}
      <section ref={el => sectionRefs.current['t2s2'] = el} id="t2s2">
        <SectionHeading>Inbound Call Flows — Deep Dive</SectionHeading>
        <Paragraph>The Inbound Call Flow is the most commonly built flow type. It is the logic that executes when a customer dials your phone number — the IVR experience. Think of it as the receptionist who greets every caller, asks what they need, checks if the office is open, and directs them to the right department.</Paragraph>
        <SubHeading>Key Actions by Category</SubHeading>
        <div className="flex gap-1 mb-3 overflow-x-auto flex-wrap">
          {actionCategories.map((cat, i) => (
            <button key={i} className="px-3 py-1.5 rounded text-xs whitespace-nowrap cursor-pointer transition-colors" onClick={() => setActiveActionCategory(cat)} style={{ backgroundColor: activeActionCategory === cat ? C.blue : C.bg3, color: activeActionCategory === cat ? '#fff' : C.t2, fontFamily: MONO }}>{cat}</button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-3">
          {filteredActions.map((a, i) => (
            <div key={i} className="p-3 rounded" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
              <div className="text-xs font-semibold mb-1" style={{ color: C.blue, fontFamily: MONO }}>{a.action}</div>
              <div className="text-xs" style={{ color: C.t2, fontFamily: SANS }}>{a.desc}</div>
            </div>
          ))}
        </div>

        <SubHeading>Example: Multi-Level IVR Call Flow</SubHeading>
        <div className="my-4 p-4 rounded-lg" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
          {[
            { indent: 0, text: 'CALL ARRIVES (DID triggers inbound call flow)', color: C.green },
            { indent: 1, text: 'Evaluate Schedule Group: "BusinessHours"', color: C.yellow },
            { indent: 2, text: 'IF OPEN:', color: C.green },
            { indent: 3, text: 'Call Data Action: CRM Lookup by ANI → Get CustomerName, AccountTier', color: C.blue },
            { indent: 3, text: 'Play Audio (TTS): "Welcome back, {CustomerName}."', color: C.t3 },
            { indent: 3, text: 'Menu: "Press 1 for Sales, 2 for Support, 3 for Billing, 4 for Account Info"', color: C.blue },
            { indent: 4, text: '1 → Set Skill "Sales" → Transfer to ACD: "Sales_Voice"', color: C.orange },
            { indent: 4, text: '2 → Sub-Menu: "Press 1 for Technical, 2 for General"', color: C.purple },
            { indent: 5, text: '1 → Set Skill "TechSupport" → Transfer to ACD: "Support_Tech"', color: C.orange },
            { indent: 5, text: '2 → Set Skill "GeneralSupport" → Transfer to ACD: "Support_General"', color: C.orange },
            { indent: 4, text: '3 → Set Skill "Billing" → Transfer to ACD: "Billing_Voice"', color: C.orange },
            { indent: 4, text: '4 → Call Task: "SelfServiceAccountInfo" (reads balance via API)', color: C.purple },
            { indent: 4, text: 'No Input / Invalid → Retry (max 3) → Transfer to ACD: "General"', color: C.t3 },
            { indent: 2, text: 'IF CLOSED:', color: C.red },
            { indent: 3, text: 'Play Audio: "We are closed. Hours are Mon-Fri 8 AM to 6 PM."', color: C.t3 },
            { indent: 3, text: 'Disconnect', color: C.red },
            { indent: 2, text: 'IF EMERGENCY:', color: C.red },
            { indent: 3, text: 'Play Audio: "We are currently experiencing an outage."', color: C.t3 },
            { indent: 3, text: 'Disconnect', color: C.red },
          ].map((line, i) => (
            <div key={i} className="text-xs" style={{ paddingLeft: line.indent * 20, color: line.color, fontFamily: MONO, marginBottom: 2 }}>{line.text}</div>
          ))}
        </div>
        <CalloutBox type="info">Every Architect flow must be PUBLISHED before it takes effect. Draft flows exist for editing but do not execute. Always test using the built-in Debug mode before publishing to production.</CalloutBox>
      </section>

      {/* T2S3 */}
      <section ref={el => sectionRefs.current['t2s3'] = el} id="t2s3">
        <SectionHeading>Data Actions in Flows</SectionHeading>
        <Paragraph>Data Actions are the bridge between your Architect flow and the outside world. They let you call REST APIs during flow execution — look up a customer in Salesforce, check an order status in your ERP, validate a credit card with a payment processor, or fetch data from any system with an API. Think of Data Actions as the flow picking up the phone and calling another department for information.</Paragraph>
        <SubHeading>Configuration Reference</SubHeading>
        <div className="space-y-2 my-3">
          {DATA_ACTION_CONFIG.map(([label, desc], i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-1 p-3 rounded" style={{ backgroundColor: C.bg2 }}>
              <span className="text-xs font-semibold whitespace-nowrap min-w-[160px]" style={{ color: C.blue, fontFamily: MONO }}>{label}:</span>
              <span className="text-xs" style={{ color: C.t2, fontFamily: SANS }}>{desc}</span>
            </div>
          ))}
        </div>
        <SubHeading>Data Action Flow Pattern</SubHeading>
        <CodeBlock>{`// Typical Data Action pattern in Architect
Call Data Action: "CRM_Lookup_By_Phone"
  Input:  Flow.CallerANI → phoneNumber
  Output: customerName   → Flow.CustomerName
          accountTier    → Flow.AccountTier
          openCaseCount  → Flow.OpenCaseCount

  On Success:
    → Set variable Flow.CRMFound = true
    → Continue with personalized greeting

  On Failure:
    → Set variable Flow.CRMFound = false
    → Set Flow.CustomerName = "Valued Customer"
    → Continue with generic greeting (graceful degradation)`}</CodeBlock>
        <CalloutBox type="warning">Data actions add latency to your flow. Every API call typically adds 200-500ms. A caller sitting in an IVR feels every second. Minimize data action calls, set aggressive timeouts (5-8 seconds instead of default 12), and always handle the failure path gracefully.</CalloutBox>
      </section>

      {/* T2S4 */}
      <section ref={el => sectionRefs.current['t2s4'] = el} id="t2s4">
        <SectionHeading>Expressions & Variables</SectionHeading>
        <Paragraph>Expressions are the computation engine inside Architect flows. They let you manipulate strings, perform math, parse dates, and evaluate conditions — all without writing code. Variables are the containers that store data during flow execution. Together, they make flows dynamic and intelligent.</Paragraph>
        <SubHeading>Variable Types</SubHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 my-4">
          {[
            { type: 'String', desc: 'Text values — names, IDs, messages', example: '"John Smith"' },
            { type: 'Integer', desc: 'Whole numbers — counts, IDs', example: '42' },
            { type: 'Decimal', desc: 'Decimal numbers — currency, percentages', example: '99.95' },
            { type: 'Boolean', desc: 'True or false — flags, conditions', example: 'true' },
            { type: 'DateTime', desc: 'Timestamps — dates and times', example: '2024-03-15T14:30:00Z' },
            { type: 'Collection', desc: 'Ordered lists of values', example: '["Sales", "Support"]' },
          ].map((v, i) => (
            <div key={i} className="rounded-lg p-3" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
              <div className="text-xs font-semibold" style={{ color: C.blue, fontFamily: MONO }}>{v.type}</div>
              <div className="text-xs mt-1" style={{ color: C.t2, fontFamily: SANS }}>{v.desc}</div>
              <div className="text-[10px] mt-1 px-2 py-0.5 rounded inline-block" style={{ backgroundColor: C.bg3, color: C.t3, fontFamily: MONO }}>{v.example}</div>
            </div>
          ))}
        </div>
        <SubHeading>Expression Examples</SubHeading>
        <div className="space-y-3 my-4">
          {EXPRESSION_EXAMPLES.map((e, i) => (
            <div key={i} className="rounded-lg p-3" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] px-2 py-0.5 rounded" style={{ backgroundColor: C.blue + '22', color: C.blue, fontFamily: MONO }}>{e.category}</span>
                <span className="text-xs" style={{ color: C.t3, fontFamily: SANS }}>{e.desc}</span>
              </div>
              <div className="text-xs" style={{ color: 'var(--code-fg)', fontFamily: MONO, backgroundColor: 'var(--code-bg)', padding: '6px 10px', borderRadius: 4 }}>{e.expr}</div>
            </div>
          ))}
        </div>
        <CalloutBox type="tip">Variables have two scopes: <strong>Flow-scoped</strong> (available throughout the entire flow, prefixed with Flow.) and <strong>Task-scoped</strong> (available only within the current task, prefixed with Task.). Use task-scoped variables for temporary calculations to keep your flow organized.</CalloutBox>
      </section>

      {/* T2S5 */}
      <section ref={el => sectionRefs.current['t2s5'] = el} id="t2s5">
        <SectionHeading>Reusable Components — Common Modules & Tasks</SectionHeading>
        <Paragraph>As your Architect flows grow in complexity, you will find yourself repeating the same logic in multiple places — a CRM lookup, an authentication check, a skill assignment block. Common Modules and Tasks provide two levels of reusability, similar to functions and subroutines in programming.</Paragraph>
        <SubHeading>Common Modules vs Tasks — When to Use Each</SubHeading>
        <InteractiveTable
          headers={['Aspect', 'Common Module', 'Task']}
          rows={COMMON_MODULE_VS_TASK}
        />
        <SubHeading>Common Module Example: CRM Lookup</SubHeading>
        <CodeBlock>{`// Common Module: "CRM_Customer_Lookup"
// Input Parameters:
//   phoneNumber (String) — the caller's ANI
//
// Output Parameters:
//   customerName (String) — full name from CRM
//   accountTier (String) — "Gold", "Silver", "Bronze"
//   isVIP (Boolean) — true if account tier is Gold
//
// Logic:
//   1. Call Data Action: Salesforce_Lookup(phoneNumber)
//   2. On Success: Map response fields to output params
//   3. On Failure: Set defaults (customerName = "Customer",
//      accountTier = "Standard", isVIP = false)
//
// Called from: Inbound Call Flow, Inbound Chat Flow,
//              Inbound Email Flow — same logic, one place to maintain`}</CodeBlock>
        <CalloutBox type="info">When you update a Common Module and republish it, all flows that call it automatically use the new version at their next execution. This makes Common Modules the best place for logic that changes frequently (like business rules or integration endpoints).</CalloutBox>
      </section>

      {/* T2S6 */}
      <section ref={el => sectionRefs.current['t2s6'] = el} id="t2s6">
        <SectionHeading>Bot Flows in Architect</SectionHeading>
        <Paragraph>Bot Flows bring conversational AI into Architect. Instead of rigid IVR menus (Press 1 for Sales), bots understand natural language — the customer says what they want, and the bot interprets the intent. Think of the difference between a vending machine (fixed buttons) and a human barista (understands "I'd like a large latte with oat milk").</Paragraph>
        <SubHeading>Core Bot Concepts</SubHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
          {BOT_FLOW_CONCEPTS.map((c, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, borderLeft: `4px solid ${c.color}` }}>
              <div className="font-bold text-sm mb-2" style={{ color: c.color, fontFamily: MONO }}>{c.name}</div>
              <div className="text-xs" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.6 }}>{c.desc}</div>
            </div>
          ))}
        </div>
        <SubHeading>Bot Flow Architecture</SubHeading>
        <Paragraph>Bot Flows use States instead of Tasks. Each State handles one conversational turn. A typical bot flow has an Initial State (greeting and first question), several intent-handling states (one per customer goal), a confirmation state, and a failure/handoff state. The NLU engine evaluates every customer message against all defined intents and routes to the highest-confidence match.</Paragraph>
        <CalloutBox type="warning">Bot Flows require the Genesys Cloud GC2 or GC3 license. The built-in Genesys Dialog Engine provides NLU capabilities. For third-party NLU (Google Dialogflow, Amazon Lex), GC3 is required.</CalloutBox>
      </section>

      {/* T2S7 */}
      <section ref={el => sectionRefs.current['t2s7'] = el} id="t2s7">
        <SectionHeading>Secure Call Flows</SectionHeading>
        <Paragraph>Secure Call Flows solve a critical compliance problem: how do you collect sensitive payment card data (credit card numbers, CVV codes) without that data touching Genesys Cloud logs, recordings, or agent screens? The answer is an isolated, PCI-DSS compliant flow that handles sensitive input in a sealed environment.</Paragraph>
        <SubHeading>How Secure Flows Work — Step by Step</SubHeading>
        <div className="my-4 space-y-0">
          {SECURE_FLOW_STEPS.map((s, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: s.color + '22', color: s.color, border: `2px solid ${s.color}`, fontFamily: MONO }}>{s.step}</div>
                {i < SECURE_FLOW_STEPS.length - 1 && <div className="w-0.5 flex-1 my-1" style={{ backgroundColor: C.border }} />}
              </div>
              <div className="pb-4 flex-1">
                <div className="text-sm" style={{ color: C.t2, fontFamily: SANS }}>{s.text}</div>
              </div>
            </div>
          ))}
        </div>
        <CalloutBox type="critical">Secure Call Flows are essential for PCI-DSS compliance. Without them, DTMF tones entered by the customer are captured in call recordings and potentially visible in logs — a compliance violation. The secure flow ensures cardholder data never enters the Genesys Cloud environment.</CalloutBox>
      </section>

      {/* T2S8 */}
      <section ref={el => sectionRefs.current['t2s8'] = el} id="t2s8">
        <SectionHeading>Testing & Debugging Flows</SectionHeading>
        <Paragraph>Building a flow is only half the work — testing and debugging is the other half. Architect provides built-in tools to simulate flow execution, inspect variables, and trace the path through your logic. Think of debugging like a rehearsal before opening night: you run through the script, check every scene, and fix problems before the audience (callers) see them.</Paragraph>
        <div className="space-y-3 my-4">
          {DEBUG_TIPS.map((tip, i) => (
            <ExpandableCard key={i} title={tip.title} accent={C.blue}>
              {tip.desc}
            </ExpandableCard>
          ))}
        </div>
        <SubHeading>Debug Mode Walkthrough</SubHeading>
        <CodeBlock>{`// Architect Debug Mode — Step-by-Step
1. Open the flow in Architect editor
2. Click "Debug" in the toolbar
3. Enter a test phone number (ANI) for the simulated call
4. Click "Start Debug"
5. The flow begins executing — each action highlights as it runs
6. At each step, inspect:
   - Variable values (current state of all flow/task variables)
   - Branch taken (which Decision/Switch path was followed)
   - Data action results (what the API returned)
   - Audio prompts (what would play to the caller)
7. Step through actions one by one, or run to a breakpoint
8. When finished, review the execution trace for the full path`}</CodeBlock>
        <CalloutBox type="tip">Set breakpoints on critical actions (data actions, decisions, transfers) to pause execution and inspect the state. This is the fastest way to find why a flow is taking an unexpected path.</CalloutBox>
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
      <SectionHeading>Flow Execution Architecture</SectionHeading>
      <Paragraph>Understanding the internal mechanics of the Architect runtime engine is essential for troubleshooting flow execution issues, optimizing performance, and designing flows that behave predictably under edge conditions. The runtime operates as a state machine that processes a compiled flow definition.</Paragraph>
      <SubHeading>The Runtime Execution Pipeline</SubHeading>
      <div className="my-4 p-4 rounded-lg space-y-2" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
        {RUNTIME_PIPELINE.map((step, i) => (
          <div key={i} className="text-xs" style={{ color: C.t2, fontFamily: MONO }}>{step}</div>
        ))}
      </div>
      <SubHeading>State Machine Model</SubHeading>
      <Paragraph>At its core, the Architect runtime is a stack-based state machine. The "program counter" tracks the current action within the current task. When a "Call Task" action executes, the current position is pushed onto a call stack, and execution jumps to the called task. When the called task ends, the stack pops and execution resumes at the next action after the Call Task. This model supports up to 25 levels of nesting.</Paragraph>
      <SubHeading>Event Handling</SubHeading>
      <Paragraph>Certain events can interrupt normal flow execution: DTMF input during audio playback (barge-in), data action timeouts, and system errors. The runtime handles these through event callbacks: if the caller presses a key during a Play Audio action with barge-in enabled, the audio stops and the collected digit is processed. Error events propagate up the task call stack until a handler is found or the flow's global error handler catches them.</Paragraph>
      <CalloutBox type="info">
        <strong>Key insight:</strong> Architect flows are compiled to an optimized internal representation when published. The visual canvas you see in the editor is a design-time abstraction — the runtime executes a streamlined JSON structure, not a visual flowchart. This is why published flows execute faster than you might expect from a "visual" tool.
      </CalloutBox>
    </section>

    {/* T3S2 */}
    <section ref={el => sectionRefs.current['t3s2'] = el} id="t3s2">
      <SectionHeading>Advanced Expression Patterns</SectionHeading>
      <Paragraph>Architect's expression language is more powerful than it first appears. Beyond simple string concatenation and comparisons, expressions support JSON parsing, collection manipulation, date arithmetic, and null-safe property access. Mastering these patterns lets you handle complex logic entirely within expressions, reducing the need for multiple actions.</Paragraph>
      <div className="space-y-4 my-4">
        {ADVANCED_EXPRESSIONS.map((e, i) => (
          <div key={i} className="rounded-lg overflow-hidden" style={{ border: `1px solid ${C.border}` }}>
            <div className="px-4 py-2" style={{ backgroundColor: C.bg3 }}>
              <span className="text-xs font-bold" style={{ color: C.purple, fontFamily: MONO }}>{e.title}</span>
            </div>
            <CodeBlock>{e.code}</CodeBlock>
          </div>
        ))}
      </div>
      <CalloutBox type="tip">When expressions become very complex (more than 3-4 nested function calls), break them into multiple Set Variable actions for readability. Future-you (or your colleague) will thank you when debugging the flow six months later.</CalloutBox>
    </section>

    {/* T3S3 */}
    <section ref={el => sectionRefs.current['t3s3'] = el} id="t3s3">
      <SectionHeading>Error Handling Patterns</SectionHeading>
      <Paragraph>In production, things fail. APIs time out, databases go down, callers enter unexpected input, and expressions hit null values. The difference between a good flow and a great flow is how it handles failure. A great flow degrades gracefully — the caller still gets helped, even if the experience is less personalized.</Paragraph>
      <div className="space-y-4 my-4">
        {ERROR_HANDLING_PATTERNS.map((p, i) => (
          <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
            <div className="font-bold text-sm mb-2" style={{ color: C.t1, fontFamily: MONO }}>{p.title}</div>
            <div className="text-sm mb-3" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.7 }}>{p.desc}</div>
            <div className="space-y-1">
              {p.steps.map((s, j) => (
                <div key={j} className="text-xs flex items-start gap-2" style={{ color: C.t2, fontFamily: MONO }}>
                  <ArrowRight size={10} style={{ color: C.purple, flexShrink: 0, marginTop: 3 }} />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <CalloutBox type="warning">Never leave a flow path that ends in nothing. Every Decision branch (Yes AND No), every Data Action outcome (Success AND Failure), and every Menu choice (including timeout and invalid input) must lead somewhere. An unhandled path causes the flow to terminate unexpectedly, which the caller experiences as a sudden disconnect.</CalloutBox>
    </section>

    {/* T3S4 */}
    <section ref={el => sectionRefs.current['t3s4'] = el} id="t3s4">
      <SectionHeading>Performance Optimization</SectionHeading>
      <Paragraph>Flow performance directly impacts caller experience. Every unnecessary data action call adds hundreds of milliseconds of latency. Complex expressions slow evaluation. Bloated flows take longer to load. Optimization is about delivering the same outcome faster — getting the caller to the right place with the least delay.</Paragraph>
      <SubHeading>Optimization Tips by Category</SubHeading>
      <InteractiveTable
        headers={['Category', 'Optimization Tip', 'Impact']}
        rows={PERFORMANCE_TIPS.map(t => [t.category, t.tip, t.impact])}
      />
      <SubHeading>Flow Complexity Budget</SubHeading>
      <Paragraph>Think of each flow as having a "complexity budget." The platform limit is 500 actions per flow, but best practice is to stay well under that. A flow with 50-100 actions is maintainable and fast. A flow with 300+ actions is hard to debug, slow to load in the editor, and risks hitting edge cases in the runtime. When you approach 150+ actions, consider breaking logic into Common Modules.</Paragraph>
      <div className="my-4 p-4 rounded-lg" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
        <div className="flex items-center justify-between mb-2 min-w-[400px]">
          <span className="text-xs font-bold" style={{ color: C.green, fontFamily: MONO }}>SIMPLE</span>
          <span className="text-xs font-bold" style={{ color: C.red, fontFamily: MONO }}>COMPLEX</span>
        </div>
        <div className="h-2 rounded-full min-w-[400px]" style={{ background: `linear-gradient(90deg, ${C.green}, ${C.yellow}, ${C.orange}, ${C.red})` }} />
        <div className="flex justify-between mt-2 min-w-[400px]">
          {['< 50 actions', '50-150', '150-300', '300-500'].map((label, i) => (
            <span key={i} className="text-[10px] text-center" style={{ color: C.t3, fontFamily: MONO }}>{label}</span>
          ))}
        </div>
      </div>
      <CalloutBox type="tip">The single biggest performance improvement you can make is reducing the number of data action calls. If you are making 3 API calls to the same system, consider creating one API endpoint that returns all the data you need in a single call.</CalloutBox>
    </section>

    {/* T3S5 */}
    <section ref={el => sectionRefs.current['t3s5'] = el} id="t3s5">
      <SectionHeading>API & Programmatic Management</SectionHeading>
      <Paragraph>While the Architect UI is the primary design tool, the Genesys Cloud API and the Archy CLI provide programmatic control over flows. This enables CI/CD pipelines, automated deployments, version management, and infrastructure-as-code workflows.</Paragraph>
      <SubHeading>Key API Endpoints</SubHeading>
      <InteractiveTable searchable headers={['Method', 'Endpoint', 'Use']} rows={API_ENDPOINTS.map(e => [e.method, e.path, e.use])} />
      <SubHeading>Archy CLI — Flow Management from the Command Line</SubHeading>
      <Paragraph>Archy is the official Genesys Cloud CLI tool for importing and exporting Architect flows as YAML files. This enables storing flows in Git repositories, diffing changes between versions, and deploying flows through CI/CD pipelines.</Paragraph>
      <CodeBlock>{`# Export a flow to YAML
archy export --flowName "Main_IVR_Flow" --flowType inboundcall --outputDir ./flows

# Import a flow from YAML (creates or updates)
archy import --file ./flows/Main_IVR_Flow.yaml

# Publish a flow after import
archy publish --flowName "Main_IVR_Flow" --flowType inboundcall

# Export all flows of a type
archy export --flowType inboundcall --outputDir ./flows/voice

# CI/CD pipeline pattern:
# 1. Developer edits YAML in Git branch
# 2. PR review → merge to main
# 3. CI pipeline: archy import → archy publish
# 4. Flow is live in production`}</CodeBlock>
      <CalloutBox type="info">Archy uses YAML as the flow definition format. This means you can version control flows, review changes in pull requests, and roll back to previous versions using standard Git workflows. This is the recommended approach for organizations with multiple environments (dev, staging, production).</CalloutBox>
    </section>

    {/* T3S6 */}
    <section ref={el => sectionRefs.current['t3s6'] = el} id="t3s6">
      <SectionHeading>Platform Limits — The Complete Reference</SectionHeading>
      <Paragraph>Understanding platform limits prevents surprises in production. These are hard limits enforced by the Genesys Cloud platform — exceeding them causes errors or rejected configurations.</Paragraph>
      <InteractiveTable searchable headers={['Resource', 'Limit', 'Notes']} rows={PLATFORM_LIMITS} />
    </section>

    {/* T3S7 */}
    <section ref={el => sectionRefs.current['t3s7'] = el} id="t3s7">
      <SectionHeading>Licensing & Feature Matrix</SectionHeading>
      <Paragraph>Genesys Cloud is available in three license tiers: GC1, GC2, and GC3. Core Architect capabilities (inbound flows, common modules, data actions) are available across all tiers. Bot flows and advanced AI features require higher tiers or add-ons.</Paragraph>
      <InteractiveTable headers={['Feature', 'GC1', 'GC2', 'GC3']} rows={LICENSE_MATRIX} />
      <CalloutBox type="info">
        <strong>License note:</strong> GC1 includes full Architect flow design for voice and basic digital channels. GC2 adds bot flows with the built-in Genesys Dialog Engine for conversational AI. GC3 adds third-party NLU integration (Dialogflow, Lex, etc.) and advanced speech recognition. Secure Call Flows for PCI compliance are available as an add-on at any tier.
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
const GenesysArchitectGuide = ({ onBack, isDark: isDarkProp, setIsDark: setIsDarkProp }) => {
  const [activeTier, setActiveTier] = useState(0);
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
            <span className="font-bold text-sm hidden sm:block" style={{ fontFamily: MONO, color: C.blue }}>GENESYS ARCHITECT GUIDE</span>
            <span className="font-bold text-sm sm:hidden" style={{ fontFamily: MONO, color: C.blue }}>GC ARCHITECT</span>
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
      <footer className="py-8 text-center" style={{ borderTop: `1px solid ${C.border}` }}>
        <div className="text-xs" style={{ color: C.t3, fontFamily: MONO }}>Genesys Cloud Architect Flows — Interactive Knowledge Guide</div>
        <div className="text-[10px] mt-1" style={{ color: C.bg4 }}>Built with React * Tailwind CSS * lucide-react</div>
      </footer>
    </div>
  );
};

export default GenesysArchitectGuide;
