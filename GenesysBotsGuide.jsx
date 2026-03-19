import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Rocket, Settings, Cpu, Search, ChevronDown, ChevronUp, ChevronRight,
  Menu, X, Phone, Mail, MessageSquare, Bell, RefreshCw, CheckCircle,
  AlertTriangle, AlertCircle, Info, Lightbulb, Star, ExternalLink,
  BookOpen, ArrowRight, ArrowDown, ArrowLeft, Circle, Zap, Shield, Clock, Users,
  FileText, Database, Activity, BarChart3, Target, PhoneCall, Monitor,
  Hash, Layers, Eye, ClipboardList, Volume2, Sun, Moon, GitBranch, Filter,
  Shuffle, UserCheck, Radio, Headphones, Globe, Calendar, Timer, TrendingUp,
  Award, Key, Lock, Unlock, MapPin, Bot, Brain, Mic, Terminal, Code,
  MessageCircle, Languages, Workflow, HelpCircle, ToggleLeft, SlidersHorizontal
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
  border: 'var(--border)', borderActive: '#8B5CF6',
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
  'The Big Picture — How Bots Understand and Help Customers',
  'How to Build, Configure, and Integrate Conversational AI',
  'Under the Hood — NLU, APIs, Voice Bots, and Edge Cases',
];
const TIER_AUDIENCES = [
  'For everyone — no experience needed',
  'For administrators & bot builders',
  'For engineers, architects & power users',
];
const TIER_ICONS_KEYS = ['Rocket', 'Settings', 'Cpu'];

// ══════════════════════════════════════════════════════════════
// SECTION METADATA (all tiers)
// ══════════════════════════════════════════════════════════════
const SECTIONS = [
  { tier: 0, id: 't1s1', title: 'What Are Bots in Genesys Cloud?' },
  { tier: 0, id: 't1s2', title: 'The Building Blocks — Key Components' },
  { tier: 0, id: 't1s3', title: 'Bot Types Explained Simply' },
  { tier: 0, id: 't1s4', title: 'How a Bot Conversation Works — The Lifecycle' },
  { tier: 0, id: 't1s5', title: 'Key Terminology Glossary' },
  { tier: 1, id: 't2s1', title: 'Prerequisites — What You Need Before Building Bots' },
  { tier: 1, id: 't2s2', title: 'Digital Bot Flows in Architect — Deep Dive' },
  { tier: 1, id: 't2s3', title: 'Intent Design Best Practices' },
  { tier: 1, id: 't2s4', title: 'Knowledge Workbench Integration' },
  { tier: 1, id: 't2s5', title: 'Genesys Dialog Engine' },
  { tier: 1, id: 't2s6', title: 'Third-Party Bot Integration' },
  { tier: 1, id: 't2s7', title: 'Agent Handoff & Escalation' },
  { tier: 1, id: 't2s8', title: 'Testing & Tuning Bots' },
  { tier: 2, id: 't3s1', title: 'NLU Architecture — How It Really Works' },
  { tier: 2, id: 't3s2', title: 'Advanced Dialog Patterns' },
  { tier: 2, id: 't3s3', title: 'Voice Bot Specifics' },
  { tier: 2, id: 't3s4', title: 'Intent Mining & Analytics' },
  { tier: 2, id: 't3s5', title: 'API & Programmatic Management' },
  { tier: 2, id: 't3s6', title: 'Platform Limits Reference' },
  { tier: 2, id: 't3s7', title: 'Licensing & Feature Matrix' },
  { tier: 2, id: 't3s8', title: 'Troubleshooting Decision Tree' },
];

// ══════════════════════════════════════════════════════════════
// T1 DATA
// ══════════════════════════════════════════════════════════════
const BOT_USE_CASES = [
  { icon: 'MessageSquare', label: 'FAQ Handling', desc: 'Instantly answer common questions without agent involvement using knowledge bases' },
  { icon: 'Clock', label: '24/7 Availability', desc: 'Bots never sleep — provide support outside business hours and during peak volume' },
  { icon: 'Shuffle', label: 'Intelligent Triage', desc: 'Collect customer intent, account info, and context before routing to the right agent' },
  { icon: 'Database', label: 'Self-Service', desc: 'Let customers check order status, reset passwords, or update accounts without an agent' },
  { icon: 'Globe', label: 'Multilingual Support', desc: 'Serve customers in dozens of languages using built-in NLU and translation' },
  { icon: 'TrendingUp', label: 'Cost Reduction', desc: 'Contain up to 40-60% of interactions within the bot, reducing agent workload' },
];

const BOT_MAP_NODES = [
  { id: 'botflow', label: 'BOT FLOW', sub: 'Architect conversation logic', x: 400, y: 60 },
  { id: 'intents', label: 'INTENTS', sub: 'What the user wants', x: 130, y: 150 },
  { id: 'slots', label: 'SLOTS / ENTITIES', sub: 'Key data to extract', x: 670, y: 150 },
  { id: 'nlu', label: 'NLU ENGINE', sub: 'Language understanding', x: 80, y: 310 },
  { id: 'knowledge', label: 'KNOWLEDGE BASE', sub: 'FAQ articles & answers', x: 110, y: 450 },
  { id: 'dialog', label: 'DIALOG ENGINE', sub: 'Conversation management', x: 300, y: 540 },
  { id: 'thirdparty', label: 'THIRD-PARTY BOTS', sub: 'Dialogflow / Lex / Custom', x: 720, y: 310 },
  { id: 'handoff', label: 'AGENT HANDOFF', sub: 'Escalate to a human', x: 690, y: 450 },
];
const BOT_MAP_CENTER = { x: 400, y: 300 };

const BOT_NODE_TOOLTIPS = {
  botflow: { explanation: 'A Bot Flow is an Architect flow specifically designed for conversational AI. It defines the dialog structure, intent routing, slot collection, and response logic for digital or voice bots.', analogy: 'The script an actor follows — with branching paths depending on the audience\'s response' },
  intents: { explanation: 'Intents represent what the customer is trying to accomplish. Each intent has training utterances — example phrases that teach the NLU engine to recognize the intent. Examples: "Check Order Status", "Reset Password", "Speak to Agent".', analogy: 'The menu items at a restaurant — each one represents a distinct thing a customer might want' },
  slots: { explanation: 'Slots (also called entities) are pieces of information the bot needs to extract from the customer\'s message. For example, an "Order Status" intent needs an order number slot. Slots have types: built-in (date, number, email) or custom (product name, account tier).', analogy: 'The blanks on a form — the bot needs these filled in before it can help' },
  nlu: { explanation: 'The Natural Language Understanding engine analyzes customer text or speech, classifies it into intents with confidence scores, and extracts slot values. Genesys Cloud uses its own NLU (Dialog Engine) or can connect to third-party NLU like Google Dialogflow or Amazon Lex.', analogy: 'The interpreter who listens to what someone says and figures out what they actually mean' },
  knowledge: { explanation: 'The Knowledge Workbench (V2) lets you create FAQ-style articles that bots can search and surface as answers. When a customer asks a question, the bot searches the knowledge base and returns the best-matching article. Supports rich text, images, and categories.', analogy: 'A well-organized reference library that the bot consults before answering' },
  dialog: { explanation: 'The Genesys Dialog Engine is the native NLU and dialog management system built into Genesys Cloud. It handles intent classification, entity extraction, multi-turn conversation state, and context management — no external service required.', analogy: 'The brain of the bot — understands language, remembers context, and decides what to say next' },
  thirdparty: { explanation: 'Genesys Cloud integrates with external bot platforms: Google Dialogflow CX/ES, Amazon Lex V1/V2, and any custom bot via the Bot Connector API. These handle NLU and dialog externally while Genesys manages the channel, handoff, and routing.', analogy: 'Hiring a specialist consultant — the work happens outside, but the results feed back into your system' },
  handoff: { explanation: 'Agent handoff is the process of transferring a bot conversation to a live human agent. The bot passes conversation context (intent, collected slots, transcript) so the agent doesn\'t ask the customer to repeat themselves.', analogy: 'A triage nurse taking notes and handing the chart to the doctor — continuity of care' },
};

const BOT_TYPES = [
  {
    name: 'Digital Bot Flow', complexity: 2, best: 'Web chat, messaging, SMS — text-based self-service and triage',
    analogy: 'A smart chat concierge at a hotel lobby',
    how: 'Built in Architect as a "Digital Bot Flow." Uses Genesys Dialog Engine NLU to understand text messages, classify intents, extract slots, and manage multi-turn conversations. Can query knowledge bases, call data actions, and transfer to ACD queues.',
    note: null,
  },
  {
    name: 'Voice Bot (Bot Flow)', complexity: 3, best: 'Phone-based IVR automation, voice self-service, conversational IVR',
    analogy: 'A voice-activated assistant instead of "Press 1 for Sales"',
    how: 'Built in Architect as a "Bot Flow" (voice variant). Combines ASR (Automatic Speech Recognition) with NLU to understand spoken language. Supports DTMF fallback, barge-in, TTS (text-to-speech) responses, and SSML for fine-tuned pronunciation.',
    note: 'Requires voice infrastructure (Genesys Cloud Voice or BYOC). ASR accuracy depends on audio quality and language model.',
  },
  {
    name: 'Genesys Dialog Engine Bot', complexity: 2, best: 'Organizations wanting native, fully-integrated conversational AI without third-party dependencies',
    analogy: 'The in-house expert — built into the platform, no external consultants needed',
    how: 'Uses the Genesys-native NLU engine for intent classification and entity extraction. Supports 15+ languages. Configured entirely within Genesys Cloud — intents, utterances, slots, and dialog logic all managed in Architect.',
    note: null,
  },
  {
    name: 'Third-Party Bot (Dialogflow / Lex)', complexity: 4, best: 'Organizations with existing bot investments, complex NLU needs, or multi-platform bot strategies',
    analogy: 'Bringing your own specialist doctor into the hospital — they operate, you manage the patient',
    how: 'Genesys Cloud connects to Google Dialogflow CX/ES or Amazon Lex via built-in integrations. The external bot handles NLU, dialog management, and fulfillment. Genesys manages the communication channel, agent handoff, and routing. Context is passed bidirectionally.',
    note: 'Requires separate Dialogflow or Lex account and API credentials. Latency may increase due to external API calls.',
  },
];

const BOT_LIFECYCLE = [
  { step: 1, title: 'CUSTOMER SENDS MESSAGE', desc: 'Customer types a message in web chat, sends an SMS, or speaks into a voice bot. The raw text (or transcribed speech) enters the bot flow.', color: C.green, icon: 'MessageSquare' },
  {
    step: 2, title: 'NLU PROCESSES THE INPUT', color: C.blue, icon: 'Brain',
    desc: 'The NLU engine analyzes the message:',
    checks: [
      'Tokenization — break the message into words and phrases',
      'Intent classification — match against trained intents with confidence scores',
      'Entity extraction — pull out slot values (dates, numbers, names, custom entities)',
      'Confidence scoring — how certain is the model? (0.0 to 1.0)',
    ],
  },
  { step: 3, title: 'INTENT MATCHING & ROUTING', desc: 'If the confidence score exceeds the threshold (default 0.4), the bot routes to the matched intent\'s dialog branch. If below threshold, the bot triggers a fallback/disambiguation flow — asking the customer to rephrase or offering suggestions.', color: C.orange, icon: 'Target' },
  {
    step: 4, title: 'SLOT FILLING & DIALOG', color: C.yellow, icon: 'ClipboardList',
    desc: 'The bot collects required information:',
    checks: [
      'Check which required slots are still empty',
      'Ask the customer for missing information (e.g., "What is your order number?")',
      'Validate slot values against expected types and patterns',
      'Confirm critical slots (e.g., "You said order #12345 — is that correct?")',
      'If all slots filled — proceed to fulfillment',
    ],
  },
  { step: 5, title: 'RESPONSE & FULFILLMENT', desc: 'The bot executes the appropriate action: call a data action to check order status, surface a knowledge base article, provide a scripted response, or perform a transaction. The response is sent back to the customer.', color: C.purple, icon: 'Zap' },
  { step: 6, title: 'CONTINUE OR HANDOFF', desc: 'The bot either continues the conversation (handles follow-up intents), loops back for another request, or escalates to a live agent via Transfer to ACD with full context (intent, slots, transcript) attached.', color: C.green, icon: 'UserCheck' },
];

const GLOSSARY = [
  { term: 'Intent', def: 'A category representing what the customer wants to accomplish (e.g., "Check Balance", "Cancel Order", "Speak to Agent")', tier: 'Tier 1' },
  { term: 'Utterance', def: 'A training phrase that teaches the NLU to recognize an intent. Each intent needs 10-20+ diverse utterances for reliable matching.', tier: 'Tier 1' },
  { term: 'Slot / Entity', def: 'A variable the bot extracts from user input — like a date, account number, or product name. Required slots must be filled before the bot can act.', tier: 'Tier 1' },
  { term: 'NLU', def: 'Natural Language Understanding — the AI engine that converts raw text into structured intents and entities', tier: 'Tier 1' },
  { term: 'Confidence Score', def: 'A value from 0.0 to 1.0 indicating how certain the NLU is about its intent classification. Higher = more confident.', tier: 'Tier 2' },
  { term: 'Confidence Threshold', def: 'The minimum confidence score required to accept an intent match. Below this, the bot asks for clarification. Default: ~0.4.', tier: 'Tier 2' },
  { term: 'Fallback', def: 'The response triggered when no intent matches above the confidence threshold — typically "I didn\'t understand, can you rephrase?"', tier: 'Tier 1' },
  { term: 'Bot Flow', def: 'An Architect flow designed for conversational AI — contains intents, slots, dialog logic, and NLU configuration', tier: 'Tier 1' },
  { term: 'Knowledge Base (V2)', def: 'A collection of FAQ articles that bots can search and present as answers to customer questions', tier: 'Tier 2' },
  { term: 'Dialog Engine', def: 'Genesys\'s native NLU and dialog management system — handles intent classification, entity extraction, and conversation state', tier: 'Tier 2' },
  { term: 'ASR', def: 'Automatic Speech Recognition — converts spoken audio into text for voice bot processing', tier: 'Tier 2' },
  { term: 'TTS', def: 'Text-to-Speech — converts bot text responses into spoken audio for voice bot output', tier: 'Tier 2' },
  { term: 'SSML', def: 'Speech Synthesis Markup Language — XML tags that control TTS pronunciation, pauses, emphasis, and prosody', tier: 'Tier 3' },
  { term: 'Barge-In', def: 'Allows the caller to interrupt the bot\'s TTS prompt by speaking or pressing a key, rather than waiting for it to finish', tier: 'Tier 3' },
  { term: 'Slot Filling', def: 'The process of collecting all required entity values through multi-turn dialog before executing an action', tier: 'Tier 2' },
  { term: 'Disambiguation', def: 'When two intents have similar confidence scores, the bot asks the customer to choose which one they meant', tier: 'Tier 2' },
  { term: 'Containment Rate', def: 'The percentage of bot interactions that are fully resolved without agent handoff — the key bot success metric', tier: 'Tier 2' },
  { term: 'Bot Connector', def: 'The API framework that enables Genesys Cloud to integrate with external bot platforms beyond Dialogflow/Lex', tier: 'Tier 3' },
  { term: 'Intent Mining', def: 'AI-driven analysis of historical customer conversations to discover new intents the bot should handle', tier: 'Tier 3' },
];

// ══════════════════════════════════════════════════════════════
// T2 DATA
// ══════════════════════════════════════════════════════════════
const PREREQUISITES = [
  { title: 'Genesys Cloud CX License with Bots', detail: 'Bot flows require GC2 or GC3 license for digital channels, or the Digital Bot Flow add-on for GC1. Voice bots require voice infrastructure. Third-party bot integrations (Dialogflow, Lex) require the respective integration to be installed from AppFoundry and appropriate API credentials configured.' },
  { title: 'Digital Channels Configured', detail: 'For digital bots: at least one messaging deployment must be active (Web Messenger, SMS, WhatsApp, Facebook Messenger, etc.). For voice bots: telephony must be configured with phone numbers assigned to bot flows. Web Messenger is the easiest starting point — create a Messenger Deployment in Admin > Message > Messenger Configurations.' },
  { title: 'Roles & Permissions', detail: 'Key permissions: Architect > Bot Flow > Add/Edit/View/Publish for bot builders. Knowledge > Manage for knowledge base authors. Integration > Add/Edit/View for third-party bot connections. Conversation > Message > Accept for agents receiving bot handoffs. Analytics > Bot Flow observation for supervisors.' },
  { title: 'Knowledge Base (Optional)', detail: 'If using FAQ bots, create a Knowledge Base V2 in Admin > Knowledge. Add articles with questions and answers. Articles can include rich text, images, and categories. The knowledge base must be published before bots can search it.' },
];

const INTENT_DESIGN_DATA = {
  good: [
    'Use 15-25 diverse utterances per intent for production bots',
    'Include variations: formal, informal, misspellings, abbreviations',
    'Keep intents focused — one customer goal per intent',
    'Use a consistent naming convention (e.g., order.status, account.reset_password)',
    'Test with real customer language, not just what you think they\'ll say',
    'Include short and long utterances ("order status" AND "can you tell me where my order is?")',
  ],
  avoid: [
    'Don\'t use fewer than 10 utterances per intent — the model needs variety',
    'Don\'t copy-paste utterances with minor changes (adds noise, not signal)',
    'Don\'t create overlapping intents (e.g., "Billing Question" AND "Payment Issue")',
    'Don\'t ignore the confusion matrix — it shows where intents overlap',
    'Don\'t use slot values in every utterance — the model may learn the value, not the pattern',
    'Don\'t skip testing with real users before production deployment',
  ],
};

const SLOT_TYPES = [
  { type: 'Built-in: Date/Time', desc: 'Recognizes dates, times, and relative expressions ("tomorrow", "next Monday", "3pm")', example: '"Schedule for next Tuesday at 2pm" → date: 2024-03-19, time: 14:00' },
  { type: 'Built-in: Number', desc: 'Extracts numeric values including ordinals and written numbers', example: '"I need three items" → number: 3' },
  { type: 'Built-in: Email', desc: 'Recognizes email address patterns', example: '"Send it to john@acme.com" → email: john@acme.com' },
  { type: 'Built-in: Phone Number', desc: 'Extracts phone numbers in various formats', example: '"Call me at 555-0123" → phone: 5550123' },
  { type: 'Built-in: Currency', desc: 'Recognizes monetary amounts with currency indicators', example: '"Transfer fifty dollars" → amount: 50.00, currency: USD' },
  { type: 'Custom: List', desc: 'A defined set of acceptable values you configure (e.g., product names, departments)', example: 'Slot "department" with values: [Sales, Support, Billing, Returns]' },
  { type: 'Custom: Regex', desc: 'Pattern-matched extraction using regular expressions', example: 'Order number pattern: ORD-[0-9]{6} → "ORD-482910"' },
  { type: 'Custom: Dynamic', desc: 'Values populated at runtime via data actions — for large or changing lists', example: 'Product catalog slot filled from live inventory API' },
];

const KNOWLEDGE_CONFIG = [
  { setting: 'Knowledge Base V2', desc: 'Create in Admin > Knowledge. Add articles with Question + Answer + optional alternates. Articles are grouped into categories for organization.' },
  { setting: 'Search Configuration', desc: 'Set the number of results to return (1-5), minimum confidence threshold, and whether to show article excerpts or full content.' },
  { setting: 'Bot Integration', desc: 'In Architect, use the "Search Knowledge" action within a bot flow. The action searches articles and returns matches ranked by relevance.' },
  { setting: 'Feedback Loop', desc: 'Knowledge V2 tracks which articles are shown, clicked, and rated helpful/unhelpful. Use this data to improve article quality over time.' },
  { setting: 'Rich Responses', desc: 'Articles support rich text formatting, images, hyperlinks, and structured cards when rendered in Web Messenger or supported digital channels.' },
];

const DIALOG_ENGINE_DATA = {
  languages: ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Dutch', 'Japanese', 'Korean', 'Chinese (Simplified)', 'Chinese (Traditional)', 'Arabic', 'Hindi', 'Thai', 'Turkish'],
  entities: [
    { name: 'System Entities', desc: 'Pre-built: dates, times, numbers, currencies, temperatures, durations, ordinals, percentages' },
    { name: 'List Entities', desc: 'Custom enumerated values with synonyms — e.g., "Premium" plan also recognized as "Gold", "Top Tier"' },
    { name: 'Regex Entities', desc: 'Pattern-based extraction — order numbers, account IDs, zip codes, custom identifiers' },
    { name: 'Built-in Entities', desc: 'Pre-trained recognition for person names, locations, organizations, email addresses, URLs, phone numbers' },
  ],
};

const THIRD_PARTY_BOTS = [
  {
    name: 'Google Dialogflow CX',
    desc: 'Advanced bot platform with visual flow builder, state-machine dialog management, and multi-flow agents. Best for complex, multi-turn conversations with branching logic.',
    setup: 'Install "Google Dialogflow CX" integration from AppFoundry → Configure GCP service account credentials → Map Dialogflow CX agent to Genesys Architect call/message flow → Enable intent and context passthrough',
    icon: 'Globe',
  },
  {
    name: 'Google Dialogflow ES',
    desc: 'Standard edition with flat intent structure and context-based dialog. Simpler than CX, good for FAQ bots and straightforward task completion.',
    setup: 'Install "Google Dialogflow" integration from AppFoundry → Configure GCP project and credentials → Map Dialogflow ES agent → Enable fulfillment webhooks if needed',
    icon: 'MessageCircle',
  },
  {
    name: 'Amazon Lex V2',
    desc: 'AWS bot service with slot elicitation, confirmation prompts, and Lambda fulfillment. Tight integration with AWS ecosystem (Connect, Lambda, DynamoDB).',
    setup: 'Install "Amazon Lex" integration from AppFoundry → Configure AWS IAM credentials with Lex permissions → Map Lex bot alias to Architect flow → Configure session timeout and locale',
    icon: 'Terminal',
  },
  {
    name: 'Custom Bot (Bot Connector API)',
    desc: 'Bring any bot platform via the open Bot Connector API. Your bot receives messages over a websocket/REST interface and returns responses, intents, and handoff signals.',
    setup: 'Implement the Genesys Bot Connector API spec → Register your bot endpoint in Genesys Cloud → Map to Architect flow via "Call Bot Connector" action → Handle turn-by-turn message exchange',
    icon: 'Code',
  },
];

const HANDOFF_PATTERNS = [
  { pattern: 'Confidence-Based Escalation', desc: 'When the NLU confidence drops below a threshold for N consecutive turns, automatically transfer to a live agent. Prevents bot loops.', color: C.orange },
  { pattern: 'Explicit Request ("Talk to Agent")', desc: 'Create a dedicated "Speak to Agent" intent. When matched, immediately transfer with full context. Always include this intent.', color: C.blue },
  { pattern: 'Slot Failure Escalation', desc: 'After N failed attempts to collect a required slot (customer can\'t provide valid input), escalate rather than looping.', color: C.yellow },
  { pattern: 'Sentiment-Based Handoff', desc: 'Detect negative sentiment or frustration signals in customer language and proactively offer agent transfer.', color: C.red },
  { pattern: 'Warm Handoff with Context', desc: 'Pass intent, collected slots, conversation transcript, and customer sentiment to the agent via participant data so they have full context.', color: C.green },
  { pattern: 'Queue-Specific Routing', desc: 'Route to different queues based on the intent: billing questions → Billing queue, technical issues → Tech Support queue, with appropriate skills attached.', color: C.purple },
];

const TESTING_CHECKLIST = [
  { area: 'Intent Accuracy', checks: ['Test each intent with 10+ unseen utterances', 'Check confusion matrix for overlapping intents', 'Verify confidence scores are above threshold', 'Test with misspellings and informal language'] },
  { area: 'Slot Extraction', checks: ['Validate all slot types extract correctly', 'Test edge cases: empty input, wrong format, partial values', 'Verify slot confirmation prompts work', 'Test slot re-prompting on invalid input'] },
  { area: 'Dialog Flow', checks: ['Walk through every conversation path end-to-end', 'Test fallback handling (gibberish input)', 'Verify escalation triggers work correctly', 'Test "go back" and "start over" scenarios'] },
  { area: 'Agent Handoff', checks: ['Verify context is passed to agent (intent, slots, transcript)', 'Test handoff to correct queue with correct skills', 'Verify agent sees screen pop with bot context', 'Test handoff when no agents are available'] },
];

// ══════════════════════════════════════════════════════════════
// T3 DATA
// ══════════════════════════════════════════════════════════════
const NLU_PIPELINE_STEPS = [
  '1. Input preprocessing: tokenization, lowercasing, punctuation removal, spell correction',
  '2. Feature extraction: n-grams, word embeddings, contextual features from training data',
  '3. Intent classification: neural network scores each intent with a probability (0.0-1.0)',
  '4. Entity recognition: sequence labeling model identifies slot values in the input text',
  '5. Confidence evaluation: compare top intent score vs. threshold; check delta between top-2 intents',
  '6. Disambiguation check: if top-2 intents within 0.1 of each other → ask user to clarify',
  '7. Context integration: consider conversation history, active intent, filled slots for re-ranking',
  '8. Output: structured result {intent, confidence, entities[], conversationState}',
];

const ADVANCED_DIALOG_PATTERNS = [
  {
    title: 'Multi-Turn Context Management',
    steps: ['User: "I want to check my order" → Intent: order.status', 'Bot: "What is your order number?" → Slot: order_number (pending)', 'User: "ORD-482910" → Slot filled: order_number = ORD-482910', 'Bot calls data action → retrieves order details', 'User: "When will it arrive?" → Context: still in order.status, interprets as delivery date request', 'Bot uses stored order context to answer without re-asking for order number'],
  },
  {
    title: 'Disambiguation Flow',
    steps: ['User: "I need to change something on my account"', 'NLU: account.update_address (0.52) vs account.update_payment (0.48)', 'Delta < 0.1 → trigger disambiguation', 'Bot: "Would you like to: 1) Update your address, or 2) Update your payment method?"', 'User: "Address" → Route to account.update_address with full confidence', 'Continue slot filling for the confirmed intent'],
  },
  {
    title: 'Progressive Slot Filling',
    steps: ['User: "Book a flight from NYC to London next Friday for 2 people"', 'NLU extracts in one pass: origin=NYC, destination=London, date=next Friday, passengers=2', 'All required slots filled in a single utterance — skip individual prompts', 'Bot: "Searching flights NYC→London, Friday March 21, 2 passengers. Confirm?"', 'User: "Actually make it 3 people" → Update passengers slot without restarting', 'Partial slot updates preserve previously collected values'],
  },
  {
    title: 'Fallback Escalation Ladder',
    steps: ['Turn 1 no-match: "I didn\'t quite get that. Could you rephrase?"', 'Turn 2 no-match: "I\'m still having trouble. Try saying something like \'check my order\' or \'pay my bill\'"', 'Turn 3 no-match: "Let me connect you with a team member who can help."', 'Transfer to ACD with context: 3 failed turns, partial transcript, no intent match', 'Agent receives full conversation history and can see what the bot attempted'],
  },
];

const VOICE_BOT_DATA = {
  asrEngines: ['Genesys Enhanced ASR (default)', 'Google Cloud Speech-to-Text', 'Nuance (via MRCP)'],
  ttsVoices: ['Genesys TTS (standard)', 'Amazon Polly (neural voices)', 'Google Cloud TTS (WaveNet)', 'Microsoft Azure TTS (neural)'],
  ssmlExamples: [
    { tag: '<break time="500ms"/>', desc: 'Insert a pause — useful after questions or before important information' },
    { tag: '<emphasis level="strong">', desc: 'Stress a word — "Your balance is <emphasis>$524.00</emphasis>"' },
    { tag: '<say-as interpret-as="telephone">', desc: 'Read digits individually — "Your confirmation code is 4-8-2-9"' },
    { tag: '<prosody rate="slow">', desc: 'Slow down speech for important information like account numbers' },
  ],
};

const BOT_API_ENDPOINTS = [
  { method: 'GET', path: '/api/v2/flows?type=bot', use: 'List all bot flows (digital and voice)' },
  { method: 'POST', path: '/api/v2/flows', use: 'Create a new bot flow programmatically' },
  { method: 'GET', path: '/api/v2/flows/{flowId}/latestconfiguration', use: 'Get the latest bot flow configuration (intents, slots, dialog)' },
  { method: 'POST', path: '/api/v2/languageunderstanding/domains', use: 'Create a new NLU domain for intent/entity management' },
  { method: 'GET', path: '/api/v2/languageunderstanding/domains/{domainId}/intents', use: 'List all intents in an NLU domain' },
  { method: 'POST', path: '/api/v2/languageunderstanding/domains/{domainId}/intents', use: 'Create a new intent with utterances' },
  { method: 'POST', path: '/api/v2/languageunderstanding/domains/{domainId}/training', use: 'Trigger NLU model training for a domain' },
  { method: 'GET', path: '/api/v2/languageunderstanding/domains/{domainId}/versions', use: 'List trained NLU model versions' },
  { method: 'GET', path: '/api/v2/knowledge/knowledgebases', use: 'List all knowledge bases' },
  { method: 'POST', path: '/api/v2/knowledge/knowledgebases/{kbId}/documents', use: 'Add a document/article to a knowledge base' },
  { method: 'POST', path: '/api/v2/knowledge/knowledgebases/{kbId}/search', use: 'Search a knowledge base programmatically' },
  { method: 'POST', path: '/api/v2/analytics/botflows/aggregates/query', use: 'Bot flow aggregate analytics (containment, intents, turns)' },
];

const PLATFORM_LIMITS = [
  ['Intents per bot flow', '250', 'Per individual bot flow'],
  ['Utterances per intent', '200', 'Recommended: 15-25 for best accuracy'],
  ['Slots per intent', '20', ''],
  ['Slot types per bot flow', '50', 'Includes custom and built-in types'],
  ['Bot flows per org', '500', 'Across digital and voice bot flows'],
  ['Knowledge bases per org', '20', 'V2 knowledge bases'],
  ['Articles per knowledge base', '2,000', 'Recommended: keep under 1,000 for performance'],
  ['Question alternatives per article', '25', 'Variant phrasings of the primary question'],
  ['NLU training utterances (total per domain)', '15,000', 'Across all intents in the domain'],
  ['Max conversation turns per session', '100', 'Bot disconnects after this limit'],
  ['Bot session timeout', '600 seconds', '10 minutes of inactivity'],
  ['Concurrent bot sessions per org', '2,000 - 10,000', 'Depends on license tier and region'],
  ['Dialogflow CX/ES integrations per org', '10', 'Across all Dialogflow projects'],
  ['Amazon Lex integrations per org', '10', 'Across all Lex bots'],
  ['Data actions per bot flow', '500', 'Same limit as standard Architect flows'],
  ['Knowledge search results (max)', '5', 'Per search action invocation'],
  ['Languages per bot flow', '1', 'Each language needs its own bot flow'],
  ['NLU model training time', '1 - 15 minutes', 'Depends on utterance volume'],
];

const LICENSE_MATRIX = [
  ['Digital Bot Flows (native NLU)', 'add-on', true, true],
  ['Voice Bot Flows', 'add-on', true, true],
  ['Genesys Dialog Engine NLU', 'add-on', true, true],
  ['Knowledge Workbench V2', 'add-on', true, true],
  ['Google Dialogflow CX/ES integration', 'add-on', 'add-on', true],
  ['Amazon Lex integration', 'add-on', 'add-on', true],
  ['Bot Connector API (custom bots)', 'add-on', 'add-on', true],
  ['Intent Mining (AI-based)', false, false, true],
  ['Bot Flow Analytics', 'add-on', true, true],
  ['Voice transcription (for voice bots)', false, 'add-on', true],
  ['Sentiment analysis in bot flows', false, false, true],
  ['Multilingual NLU (15+ languages)', 'add-on', true, true],
  ['Rich media responses (cards, carousels)', 'add-on', true, true],
  ['Knowledge optimizer', false, false, true],
];

const TROUBLESHOOTING = [
  { symptom: 'Bot not understanding customer messages (low intent match rate)', investigation: 'Check: Do intents have sufficient training utterances (15+ per intent)? → Are utterances diverse enough (different phrasings, not copy-paste variants)? → Is the confidence threshold set too high (try lowering from 0.5 to 0.4)? → Run the confusion matrix to check for overlapping intents → Has the NLU model been retrained after adding new utterances? → Check the language — is the customer writing in a different language than the bot is trained for?' },
  { symptom: 'Bot stuck in a loop (keeps asking the same question)', investigation: 'Check: Is slot validation rejecting valid input? (Check regex patterns) → Is the "no match" handler re-prompting without a max retry limit? → Is the intent routing sending the user back to the same state? → Is there a circular flow connection in Architect? (Check for loops in the visual flow) → Add a counter variable that escalates after 3 failed attempts → Verify the slot confirmation isn\'t rejecting the customer\'s "yes".' },
  { symptom: 'Agent not receiving bot context after handoff', investigation: 'Check: Is the Transfer to ACD action configured with participant data? → Are slot values being set as conversation attributes before transfer? → Is the queue configured to support the correct media type? → Check the agent script — does it read the correct participant data keys? → Verify the handoff flow sets "Bot Conversation Summary" and "Bot Intent" attributes → Test with the Architect debugger to confirm data is populated at the transfer point.' },
  { symptom: 'Knowledge base returning wrong or no results', investigation: 'Check: Is the knowledge base published (draft articles won\'t appear in search)? → Do articles have clear, distinct questions? → Is the search confidence threshold too high? → Are there enough question alternatives on each article? → Is the bot flow using the correct knowledge base ID? → Try the Knowledge search directly via API to isolate whether the issue is in the KB or the bot flow logic.' },
  { symptom: 'Third-party bot (Dialogflow/Lex) not responding', investigation: 'Check: Are API credentials valid and not expired? → Is the integration enabled in Admin > Integrations? → Does the external bot agent/alias exist and have a published version? → Check Dialogflow/Lex console for errors → Verify network connectivity (firewall rules for outbound API calls) → Check the region — is the Dialogflow project in a supported region? → Review the integration logs in Admin > Integrations > Logs.' },
  { symptom: 'Voice bot not understanding spoken input', investigation: 'Check: Is ASR configured for the correct language? → Is audio quality sufficient (noise, codec issues)? → Is barge-in enabled when it shouldn\'t be (bot hearing its own TTS)? → Try adding DTMF fallback for critical inputs → Is the ASR engine appropriate for the accent/dialect? → Check telephony logs for audio quality issues → Test with text input first to isolate ASR vs. NLU issues.' },
];

// ══════════════════════════════════════════════════════════════
// SEARCH INDEX
// ══════════════════════════════════════════════════════════════
export const SEARCH_INDEX = (() => {
  const idx = [];
  SECTIONS.forEach(s => idx.push({ text: s.title, label: s.title, sectionId: s.id, tier: s.tier, type: 'Section' }));
  BOT_USE_CASES.forEach(u => idx.push({ text: `${u.label} ${u.desc}`, label: u.label, sectionId: 't1s1', tier: 0, type: 'Use Case' }));
  BOT_MAP_NODES.forEach(n => {
    const tooltip = BOT_NODE_TOOLTIPS[n.id] || {};
    idx.push({ text: `${n.label} ${n.sub} ${tooltip.explanation || ''} ${tooltip.analogy || ''}`, label: n.label, sectionId: 't1s2', tier: 0, type: 'Component' });
  });
  BOT_TYPES.forEach(b => idx.push({ text: `${b.name} ${b.how} ${b.best} ${b.analogy} ${b.note || ''}`, label: b.name, sectionId: 't1s3', tier: 0, type: 'Bot Type' }));
  BOT_LIFECYCLE.forEach(l => idx.push({ text: `${l.title} ${l.desc} ${(l.checks || []).join(' ')}`, label: l.title, sectionId: 't1s4', tier: 0, type: 'Lifecycle Step' }));
  GLOSSARY.forEach(g => idx.push({ text: `${g.term} ${g.def}`, label: g.term, sectionId: 't1s5', tier: 0, type: 'Glossary' }));
  PREREQUISITES.forEach(p => idx.push({ text: `${p.title} ${p.detail}`, label: p.title, sectionId: 't2s1', tier: 1, type: 'Prerequisite' }));
  INTENT_DESIGN_DATA.good.forEach(t => idx.push({ text: t, label: t.substring(0, 50), sectionId: 't2s3', tier: 1, type: 'Intent Best Practice' }));
  INTENT_DESIGN_DATA.avoid.forEach(t => idx.push({ text: t, label: t.substring(0, 50), sectionId: 't2s3', tier: 1, type: 'Intent Anti-Pattern' }));
  SLOT_TYPES.forEach(s => idx.push({ text: `${s.type} ${s.desc} ${s.example}`, label: s.type, sectionId: 't2s5', tier: 1, type: 'Slot Type' }));
  KNOWLEDGE_CONFIG.forEach(k => idx.push({ text: `${k.setting} ${k.desc}`, label: k.setting, sectionId: 't2s4', tier: 1, type: 'Knowledge Config' }));
  DIALOG_ENGINE_DATA.languages.forEach(l => idx.push({ text: `${l} language`, label: l, sectionId: 't2s5', tier: 1, type: 'Language' }));
  DIALOG_ENGINE_DATA.entities.forEach(e => idx.push({ text: `${e.name} ${e.desc}`, label: e.name, sectionId: 't2s5', tier: 1, type: 'Entity Type' }));
  THIRD_PARTY_BOTS.forEach(b => idx.push({ text: `${b.name} ${b.desc} ${b.setup}`, label: b.name, sectionId: 't2s6', tier: 1, type: 'Integration' }));
  HANDOFF_PATTERNS.forEach(h => idx.push({ text: `${h.pattern} ${h.desc}`, label: h.pattern, sectionId: 't2s7', tier: 1, type: 'Handoff Pattern' }));
  TESTING_CHECKLIST.forEach(t => idx.push({ text: `${t.area} ${t.checks.join(' ')}`, label: t.area, sectionId: 't2s8', tier: 1, type: 'Testing Area' }));
  NLU_PIPELINE_STEPS.forEach(s => idx.push({ text: s, label: s.substring(0, 50), sectionId: 't3s1', tier: 2, type: 'NLU Step' }));
  ADVANCED_DIALOG_PATTERNS.forEach(p => idx.push({ text: `${p.title} ${p.steps.join(' ')}`, label: p.title, sectionId: 't3s2', tier: 2, type: 'Dialog Pattern' }));
  VOICE_BOT_DATA.asrEngines.forEach(e => idx.push({ text: `ASR ${e}`, label: e, sectionId: 't3s3', tier: 2, type: 'ASR Engine' }));
  VOICE_BOT_DATA.ttsVoices.forEach(v => idx.push({ text: `TTS ${v}`, label: v, sectionId: 't3s3', tier: 2, type: 'TTS Voice' }));
  VOICE_BOT_DATA.ssmlExamples.forEach(s => idx.push({ text: `${s.tag} ${s.desc}`, label: s.tag, sectionId: 't3s3', tier: 2, type: 'SSML Tag' }));
  BOT_API_ENDPOINTS.forEach(e => idx.push({ text: `${e.method} ${e.path} ${e.use}`, label: `${e.method} ${e.path}`, sectionId: 't3s5', tier: 2, type: 'API' }));
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
const BotComponentMapSVG = () => {
  const [active, setActive] = useState(null);
  return (
    <div className="my-6 overflow-x-auto">
      <svg viewBox="0 0 800 600" className="w-full" style={{ maxWidth: 800, minWidth: 600 }}>
        <defs>
          <filter id="glow-b"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        {BOT_MAP_NODES.map(n => (
          <line key={`line-${n.id}`} x1={BOT_MAP_CENTER.x} y1={BOT_MAP_CENTER.y} x2={n.x} y2={n.y} stroke={C.border} strokeWidth="2" strokeDasharray="6,4" />
        ))}
        <g>
          <rect x={BOT_MAP_CENTER.x - 80} y={BOT_MAP_CENTER.y - 30} width={160} height={60} rx={12} fill={C.bg3} stroke={C.purple} strokeWidth={2} />
          <text x={BOT_MAP_CENTER.x} y={BOT_MAP_CENTER.y - 5} textAnchor="middle" fill={C.t1} fontFamily={MONO} fontSize={13} fontWeight="bold">BOT ENGINE</text>
          <text x={BOT_MAP_CENTER.x} y={BOT_MAP_CENTER.y + 15} textAnchor="middle" fill={C.t3} fontFamily={SANS} fontSize={10}>The conversation brain</text>
        </g>
        {BOT_MAP_NODES.map(n => {
          const isActive = active === n.id;
          const tooltip = BOT_NODE_TOOLTIPS[n.id];
          return (
            <g key={n.id} className="cursor-pointer" onClick={() => setActive(isActive ? null : n.id)} style={{ transition: 'transform 0.2s' }}>
              <rect x={n.x - 70} y={n.y - 25} width={140} height={50} rx={8} fill={C.bg2} stroke={isActive ? C.purple : C.border} strokeWidth={isActive ? 2 : 1} filter={isActive ? 'url(#glow-b)' : undefined} />
              <text x={n.x} y={n.y - 4} textAnchor="middle" fill={C.t1} fontFamily={MONO} fontSize={11} fontWeight="600">{n.label}</text>
              <text x={n.x} y={n.y + 12} textAnchor="middle" fill={C.t3} fontFamily={SANS} fontSize={9}>{n.sub}</text>
              {isActive && tooltip && (() => {
                const tw = 280;
                const tx = Math.max(8, Math.min(n.x - tw / 2, 800 - tw - 8));
                const above = n.y > 350;
                const ty = above ? n.y - 135 : n.y + 30;
                return (
                  <foreignObject x={tx} y={ty} width={tw} height={130}>
                    <div xmlns="http://www.w3.org/1999/xhtml" style={{ background: 'var(--bg3)', border: `1px solid ${C.purple}`, borderRadius: 8, padding: '10px 12px', boxSizing: 'border-box' }}>
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
      <SectionHeading>What Are Bots in Genesys Cloud?</SectionHeading>
      <Paragraph>Bots in Genesys Cloud are automated conversational agents that can understand natural language, answer customer questions, collect information, and perform tasks — all without a human agent. Think of a bot as a tireless front-desk assistant who greets every customer, answers common questions instantly, gathers the right information, and seamlessly passes complex issues to a specialist when needed.</Paragraph>
      <Paragraph>Unlike traditional IVR ("Press 1 for Sales"), conversational AI lets customers speak or type naturally. Instead of navigating rigid menus, customers say "I need to check my order status" and the bot understands. This shift from menu-driven to intent-driven interaction is the core revolution in modern customer experience.</Paragraph>
      <SubHeading>Why Bots Matter for CX</SubHeading>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        {[
          { title: 'TRADITIONAL IVR', items: ['Rigid menu trees ("Press 1, then 3, then 2...")', 'Customers must know the right option', 'No understanding of natural language', 'One-size-fits-all experience', 'High abandonment on complex menus'], color: C.red },
          { title: 'CONVERSATIONAL AI (BOTS)', items: ['Natural language: "I want to return an item"', 'Bot figures out intent from free-form input', 'Personalized responses based on context', 'Seamless handoff to agents with full context', 'Containment rates of 40-60% for common queries'], color: C.purple },
        ].map((panel, i) => (
          <div key={i} className="rounded-lg p-5" style={{ backgroundColor: C.bg2, borderTop: `3px solid ${panel.color}` }}>
            <div className="font-bold mb-3 text-sm" style={{ color: panel.color, fontFamily: MONO }}>{panel.title}</div>
            {panel.items.map((item, j) => <div key={j} className="text-sm mb-1.5" style={{ color: C.t2, fontFamily: SANS }}>{item}</div>)}
          </div>
        ))}
      </div>
      <SubHeading>What Bots Can Do</SubHeading>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 my-4">
        {BOT_USE_CASES.map((uc, i) => (
          <div key={i} className="rounded-lg p-4 flex items-start gap-3 transition-all duration-200 hover:-translate-y-0.5" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
            <Zap size={20} style={{ color: C.purple, flexShrink: 0 }} />
            <div><div className="font-semibold text-sm" style={{ color: C.t1, fontFamily: MONO }}>{uc.label}</div><div className="text-xs mt-1" style={{ color: C.t2, fontFamily: SANS }}>{uc.desc}</div></div>
          </div>
        ))}
      </div>
      <CalloutBox type="tip">Genesys Cloud bots work across ALL digital channels: web chat (Web Messenger), SMS, Facebook Messenger, WhatsApp, LINE, Twitter DM, and voice. Build once, deploy everywhere — the bot logic is channel-agnostic.</CalloutBox>
    </section>

    {/* T1S2 */}
    <section ref={el => sectionRefs.current['t1s2'] = el} id="t1s2">
      <SectionHeading>The Building Blocks — Key Components</SectionHeading>
      <Paragraph>A conversational AI system in Genesys Cloud is built from several interconnected components. No single piece works alone — they combine to create the complete bot experience. Think of it like a restaurant: the kitchen (NLU Engine) understands orders, the menu (Intents) lists what's available, the order form (Slots) captures details, and the manager (Dialog Engine) coordinates everything.</Paragraph>
      <CalloutBox type="tip">Click any node in the diagram below to see what it does and a simple analogy.</CalloutBox>
      <BotComponentMapSVG />
      <SubHeading>Component Reference</SubHeading>
      <InteractiveTable
        headers={['Component', 'Simple Explanation', 'Analogy']}
        rows={Object.entries(BOT_NODE_TOOLTIPS).map(([k, v]) => {
          const node = BOT_MAP_NODES.find(n => n.id === k);
          return [node?.label || k, v.explanation, v.analogy];
        })}
      />
    </section>

    {/* T1S3 */}
    <section ref={el => sectionRefs.current['t1s3'] = el} id="t1s3">
      <SectionHeading>Bot Types Explained Simply</SectionHeading>
      <Paragraph>Genesys Cloud offers four approaches to building bots, ranging from native (built-in) to fully external (bring your own). The right choice depends on your existing investments, complexity needs, and team expertise.</Paragraph>
      <div className="my-6 rounded-lg p-4 overflow-x-auto" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
        <div className="flex items-center justify-between mb-2 min-w-[500px]">
          <span className="text-xs font-bold" style={{ color: C.orange, fontFamily: MONO }}>SIMPLE / NATIVE</span>
          <span className="text-xs font-bold" style={{ color: C.purple, fontFamily: MONO }}>COMPLEX / EXTERNAL</span>
        </div>
        <div className="h-2 rounded-full min-w-[500px]" style={{ background: `linear-gradient(90deg, ${C.orange}, ${C.blue}, ${C.purple})` }} />
        <div className="flex justify-between mt-2 min-w-[500px]">
          {BOT_TYPES.map((m, i) => <span key={i} className="text-[10px] text-center" style={{ color: C.t3, fontFamily: MONO, width: 100 }}>{m.name.split(' ').slice(0, 2).join(' ')}</span>)}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {BOT_TYPES.map((m, i) => (
          <ExpandableCard key={i} title={m.name} accent={C.purple}>
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

    {/* T1S4 */}
    <section ref={el => sectionRefs.current['t1s4'] = el} id="t1s4">
      <SectionHeading>How a Bot Conversation Works — The Lifecycle</SectionHeading>
      <Paragraph>Every bot interaction follows the same general lifecycle, whether the customer is typing in a web chat or speaking to a voice bot. Understanding this flow is the key to understanding how all the bot components fit together.</Paragraph>
      <div className="my-6 space-y-0">
        {BOT_LIFECYCLE.map((s, i) => (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: s.color + '22', color: s.color, border: `2px solid ${s.color}`, fontFamily: MONO }}>{s.step}</div>
              {i < BOT_LIFECYCLE.length - 1 && <div className="w-0.5 flex-1 my-1" style={{ backgroundColor: C.border }} />}
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
          <div className="font-bold text-sm" style={{ color: C.green, fontFamily: MONO }}>RESOLVED BY BOT OR HANDED TO AGENT</div>
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

// ══════════════════════════════════════════════════════════════
// TIER 2 CONTENT
// ══════════════════════════════════════════════════════════════
const Tier2Content = ({ sectionRefs }) => {
  const [activeThirdPartyTab, setActiveThirdPartyTab] = useState(0);
  return (
    <div className="space-y-16">
      {/* T2S1 */}
      <section ref={el => sectionRefs.current['t2s1'] = el} id="t2s1">
        <SectionHeading>Prerequisites — What You Need Before Building Bots</SectionHeading>
        <Paragraph>Before building your first bot, these platform-level components must be in place. Think of this as preparing the kitchen before you start cooking — you need the right tools and ingredients first.</Paragraph>
        <div className="space-y-3 my-4">
          {PREREQUISITES.map((p, i) => (
            <ExpandableCard key={i} title={`${i + 1}. ${p.title}`} accent={C.purple}>
              {p.detail}
            </ExpandableCard>
          ))}
        </div>
        <SubHeading>Recommended Setup Sequence</SubHeading>
        <div className="flex flex-wrap items-center gap-1 my-4 overflow-x-auto">
          {['License Check', 'Digital Channel', 'Knowledge Base', 'Create Bot Flow', 'Add Intents', 'Train NLU', 'Test Bot', 'Assign to Deployment', 'Monitor & Tune'].map((s, i) => (
            <React.Fragment key={i}>
              <span className="px-3 py-1.5 rounded text-xs whitespace-nowrap" style={{ backgroundColor: C.bg3, color: C.t1, fontFamily: MONO, border: `1px solid ${C.border}` }}>{s}</span>
              {i < 8 && <ArrowRight size={14} style={{ color: C.t3, flexShrink: 0 }} />}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* T2S2 */}
      <section ref={el => sectionRefs.current['t2s2'] = el} id="t2s2">
        <SectionHeading>Digital Bot Flows in Architect — Deep Dive</SectionHeading>
        <Paragraph>A Digital Bot Flow is an Architect flow designed specifically for conversational AI on text-based channels. It contains intent definitions, utterance training data, slot configurations, dialog logic, and NLU settings — all in one place.</Paragraph>
        <SubHeading>Creating a Bot Flow</SubHeading>
        <div className="my-4 p-4 rounded-lg" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
          {[
            { indent: 0, text: 'ARCHITECT → Bot Flows → Add Digital Bot Flow', color: C.green },
            { indent: 1, text: 'Name: "Customer Service Bot" | Language: English', color: C.t3 },
            { indent: 1, text: 'NLU Engine: Genesys Dialog Engine (or select Dialogflow/Lex)', color: C.blue },
            { indent: 0, text: 'DEFINE INTENTS:', color: C.purple },
            { indent: 1, text: 'Intent: "order.status" — "Where is my order?", "Track my package", "Order update"', color: C.orange },
            { indent: 1, text: 'Intent: "account.balance" — "What\'s my balance?", "How much do I owe?"', color: C.orange },
            { indent: 1, text: 'Intent: "agent.request" — "Talk to a person", "I need a human", "Speak to agent"', color: C.orange },
            { indent: 0, text: 'DEFINE SLOTS:', color: C.purple },
            { indent: 1, text: 'Slot: "order_number" (Regex: ORD-[0-9]{6}) — required for order.status', color: C.yellow },
            { indent: 1, text: 'Slot: "account_id" (Built-in: Number) — required for account.balance', color: C.yellow },
            { indent: 0, text: 'BUILD DIALOG LOGIC:', color: C.purple },
            { indent: 1, text: 'order.status → Ask for order_number → Call Data Action → Return status', color: C.blue },
            { indent: 1, text: 'account.balance → Ask for account_id → Call Data Action → Return balance', color: C.blue },
            { indent: 1, text: 'agent.request → Transfer to ACD: "Support_Queue" with context', color: C.red },
            { indent: 1, text: 'Fallback → "I didn\'t understand. Try: check order, account balance, or talk to agent"', color: C.t3 },
            { indent: 0, text: 'TRAIN NLU → PUBLISH → ASSIGN TO MESSENGER DEPLOYMENT', color: C.green },
          ].map((line, i) => (
            <div key={i} className="text-xs" style={{ paddingLeft: line.indent * 20, color: line.color, fontFamily: MONO, marginBottom: 2 }}>{line.text}</div>
          ))}
        </div>
        <SubHeading>Key Bot Flow Actions</SubHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-3">
          {[
            { action: 'Ask for Intent', desc: 'Presents the initial prompt and waits for the NLU to classify user input' },
            { action: 'Ask for Slot', desc: 'Prompts the user for a specific slot value with validation and retry logic' },
            { action: 'Search Knowledge', desc: 'Queries the knowledge base and returns matching articles to the user' },
            { action: 'Call Data Action', desc: 'Executes a REST API call (CRM lookup, order status check, account query)' },
            { action: 'Communicate', desc: 'Sends a text response (or TTS for voice bots) to the customer' },
            { action: 'Transfer to ACD', desc: 'Escalates to a live agent queue with intent, slots, and transcript as context' },
            { action: 'Disconnect', desc: 'Ends the bot conversation (use after successful resolution or user request)' },
            { action: 'Set Participant Data', desc: 'Attaches custom key-value pairs to the conversation for agent handoff context' },
          ].map((a, i) => (
            <div key={i} className="p-3 rounded" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
              <div className="text-xs font-semibold mb-1" style={{ color: C.purple, fontFamily: MONO }}>{a.action}</div>
              <div className="text-xs" style={{ color: C.t2, fontFamily: SANS }}>{a.desc}</div>
            </div>
          ))}
        </div>
        <CalloutBox type="info">Every bot flow must be TRAINED (NLU model) and PUBLISHED before it takes effect. Changes to intents or utterances require retraining the NLU model — this typically takes 1-15 minutes depending on the number of utterances.</CalloutBox>
      </section>

      {/* T2S3 */}
      <section ref={el => sectionRefs.current['t2s3'] = el} id="t2s3">
        <SectionHeading>Intent Design Best Practices</SectionHeading>
        <Paragraph>Intent design is the most critical factor in bot accuracy. Well-designed intents with diverse, representative utterances are the difference between a bot that delights customers and one that frustrates them. Think of intents as categories in a filing cabinet — each one must be clearly distinct with no ambiguous overlap.</Paragraph>
        <SubHeading>Intent Taxonomy Design</SubHeading>
        <Paragraph>Organize intents hierarchically using dot notation for clarity: "order.status", "order.return", "order.cancel", "account.balance", "account.update", "general.greeting", "general.agent_request". This makes flows easier to maintain and helps identify coverage gaps.</Paragraph>
        <SubHeading>Do vs. Avoid</SubHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="rounded-lg p-4" style={{ backgroundColor: C.bg2, borderTop: `3px solid ${C.green}` }}>
            <div className="font-bold mb-3 text-sm" style={{ color: C.green, fontFamily: MONO }}>DO</div>
            {INTENT_DESIGN_DATA.good.map((item, i) => <div key={i} className="text-xs mb-2 flex items-start gap-2" style={{ color: C.t2, fontFamily: SANS }}><CheckCircle size={12} style={{ color: C.green, flexShrink: 0, marginTop: 2 }} />{item}</div>)}
          </div>
          <div className="rounded-lg p-4" style={{ backgroundColor: C.bg2, borderTop: `3px solid ${C.red}` }}>
            <div className="font-bold mb-3 text-sm" style={{ color: C.red, fontFamily: MONO }}>AVOID</div>
            {INTENT_DESIGN_DATA.avoid.map((item, i) => <div key={i} className="text-xs mb-2 flex items-start gap-2" style={{ color: C.t2, fontFamily: SANS }}><AlertCircle size={12} style={{ color: C.red, flexShrink: 0, marginTop: 2 }} />{item}</div>)}
          </div>
        </div>
        <SubHeading>Confidence Thresholds</SubHeading>
        <Paragraph>The confidence threshold determines when the bot accepts an intent match vs. asking for clarification. Default is approximately 0.4 (40%). Set it too low and the bot will misroute; set it too high and the bot will constantly say "I didn't understand." Start at 0.4 and adjust based on testing. The sweet spot for most production bots is 0.35-0.50.</Paragraph>
        <CalloutBox type="warning">Always monitor the confusion matrix after adding new intents. If two intents have overlapping utterances, the NLU will oscillate between them with low confidence, creating a poor customer experience. Merge overlapping intents or make their utterances more distinct.</CalloutBox>
      </section>

      {/* T2S4 */}
      <section ref={el => sectionRefs.current['t2s4'] = el} id="t2s4">
        <SectionHeading>Knowledge Workbench Integration</SectionHeading>
        <Paragraph>The Knowledge Workbench V2 is Genesys Cloud's built-in FAQ management system. It lets you create a library of question-answer articles that bots can search and surface as responses. Think of it as giving your bot access to a well-organized reference manual — instead of hardcoding every answer, the bot looks it up.</Paragraph>
        <SubHeading>Configuration</SubHeading>
        <div className="space-y-2 my-3">
          {KNOWLEDGE_CONFIG.map(({ setting, desc }, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-1 p-3 rounded" style={{ backgroundColor: C.bg2 }}>
              <span className="text-xs font-semibold whitespace-nowrap min-w-[180px]" style={{ color: C.purple, fontFamily: MONO }}>{setting}:</span>
              <span className="text-xs" style={{ color: C.t2, fontFamily: SANS }}>{desc}</span>
            </div>
          ))}
        </div>
        <SubHeading>Example: FAQ Bot Pattern</SubHeading>
        <CodeBlock>{`// Bot Flow: FAQ Handler
// 1. User sends message: "What are your return policies?"
// 2. NLU: No strong intent match (confidence < threshold)
// 3. Fallback → Search Knowledge Base
//    Action: Search Knowledge (query = user input, maxResults = 3)
// 4. IF results found:
//    → Display top article: "Return Policy"
//    → "Was this helpful? (Yes / No)"
//    → If No → Transfer to ACD
// 5. IF no results:
//    → "I couldn't find an answer. Let me connect you with an agent."
//    → Transfer to ACD with context`}</CodeBlock>
        <CalloutBox type="tip">Combine intent-based routing with knowledge search as a fallback. First, try to match a trained intent. If no intent matches above threshold, search the knowledge base. If neither works, escalate to an agent. This three-layer approach maximizes containment.</CalloutBox>
      </section>

      {/* T2S5 */}
      <section ref={el => sectionRefs.current['t2s5'] = el} id="t2s5">
        <SectionHeading>Genesys Dialog Engine</SectionHeading>
        <Paragraph>The Genesys Dialog Engine is the native NLU and dialog management system built directly into Genesys Cloud. It eliminates the need for external AI services by providing intent classification, entity extraction, and conversation state management all within the platform.</Paragraph>
        <SubHeading>Supported Languages ({DIALOG_ENGINE_DATA.languages.length})</SubHeading>
        <div className="flex flex-wrap gap-2 my-4">
          {DIALOG_ENGINE_DATA.languages.map((lang, i) => (
            <span key={i} className="px-3 py-1.5 rounded text-xs" style={{ backgroundColor: C.bg2, color: C.t1, fontFamily: MONO, border: `1px solid ${C.border}` }}>{lang}</span>
          ))}
        </div>
        <SubHeading>Entity Types</SubHeading>
        <div className="space-y-3 my-4">
          {DIALOG_ENGINE_DATA.entities.map((e, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
              <div className="font-semibold text-sm mb-2" style={{ color: C.purple, fontFamily: MONO }}>{e.name}</div>
              <div className="text-sm" style={{ color: C.t2, fontFamily: SANS }}>{e.desc}</div>
            </div>
          ))}
        </div>
        <SubHeading>Slot Types Reference</SubHeading>
        <InteractiveTable headers={['Slot Type', 'Description', 'Example']} rows={SLOT_TYPES.map(s => [s.type, s.desc, s.example])} />
      </section>

      {/* T2S6 */}
      <section ref={el => sectionRefs.current['t2s6'] = el} id="t2s6">
        <SectionHeading>Third-Party Bot Integration</SectionHeading>
        <Paragraph>Genesys Cloud integrates with leading external bot platforms, letting you bring your own conversational AI while Genesys handles the communication channels, agent handoff, and routing. This is ideal when you have existing bot investments or need NLU capabilities beyond the native Dialog Engine.</Paragraph>
        <div className="flex gap-1 mb-3 overflow-x-auto flex-wrap">
          {THIRD_PARTY_BOTS.map((b, i) => (
            <button key={i} className="px-3 py-1.5 rounded text-xs whitespace-nowrap cursor-pointer transition-colors" onClick={() => setActiveThirdPartyTab(i)} style={{ backgroundColor: activeThirdPartyTab === i ? C.purple : C.bg3, color: activeThirdPartyTab === i ? '#fff' : C.t2, fontFamily: MONO }}>{b.name}</button>
          ))}
        </div>
        <div className="p-4 rounded-lg" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
          <div className="text-sm mb-3" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.7 }}>{THIRD_PARTY_BOTS[activeThirdPartyTab].desc}</div>
          <div className="text-xs font-semibold mb-2" style={{ color: C.purple, fontFamily: MONO }}>SETUP:</div>
          <div className="text-xs" style={{ color: C.t3, fontFamily: SANS, lineHeight: 1.7 }}>{THIRD_PARTY_BOTS[activeThirdPartyTab].setup}</div>
        </div>
        <SubHeading>Integration Architecture</SubHeading>
        <CodeBlock>{`Customer  →  Genesys Cloud Channel  →  Bot Turn Router  →  External Bot (Dialogflow/Lex/Custom)
   ↑              (Web Messenger,            ↕                        ↓
   |               SMS, Voice)         Context Passing         NLU + Fulfillment
   |                                        ↕                        ↓
   ←─────────── Bot Response ←──────── Response + Signals ←── Intent + Entities
                                        (text, cards,        (handoff signal,
                                         handoff)            session data)`}</CodeBlock>
        <CalloutBox type="warning">External bot integrations add network latency (typically 100-500ms per turn). For latency-sensitive voice bots, consider using the native Genesys Dialog Engine. For digital channels, the added latency is usually imperceptible to users.</CalloutBox>
      </section>

      {/* T2S7 */}
      <section ref={el => sectionRefs.current['t2s7'] = el} id="t2s7">
        <SectionHeading>Agent Handoff & Escalation</SectionHeading>
        <Paragraph>The handoff from bot to human agent is the most critical moment in a bot interaction. Done well, it's seamless — the agent picks up exactly where the bot left off. Done poorly, the customer repeats everything and feels like they wasted time with the bot.</Paragraph>
        <SubHeading>Handoff Patterns</SubHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
          {HANDOFF_PATTERNS.map((h, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, borderLeft: `4px solid ${h.color}` }}>
              <div className="font-bold text-sm mb-2" style={{ color: h.color, fontFamily: MONO }}>{h.pattern}</div>
              <div className="text-xs" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.6 }}>{h.desc}</div>
            </div>
          ))}
        </div>
        <SubHeading>Context Passing</SubHeading>
        <CodeBlock>{`// Before Transfer to ACD, set participant data:
Set Participant Data("Bot_Intent", "order.status")
Set Participant Data("Bot_OrderNumber", "ORD-482910")
Set Participant Data("Bot_Turns", "5")
Set Participant Data("Bot_Summary", "Customer checking order ORD-482910, shipped 3/15")
// Agent sees this in the interaction panel as custom attributes`}</CodeBlock>
        <CalloutBox type="tip">Always include a "Talk to Agent" intent in every bot. Customers should never feel trapped by a bot. Making escalation easy actually INCREASES trust in the bot — customers are more willing to try self-service when they know they can escape if needed.</CalloutBox>
      </section>

      {/* T2S8 */}
      <section ref={el => sectionRefs.current['t2s8'] = el} id="t2s8">
        <SectionHeading>Testing & Tuning Bots</SectionHeading>
        <Paragraph>Building a bot is 30% of the work. Testing and tuning it is the other 70%. A bot that's never tested with real customer language will fail in production. Systematic testing across intents, slots, dialog paths, and handoff ensures reliable performance.</Paragraph>
        <SubHeading>Testing Checklist</SubHeading>
        <div className="space-y-4 my-4">
          {TESTING_CHECKLIST.map((t, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
              <div className="font-bold text-sm mb-3" style={{ color: C.t1, fontFamily: MONO }}>{t.area}</div>
              <div className="space-y-1">
                {t.checks.map((c, j) => (
                  <div key={j} className="text-xs flex items-start gap-2" style={{ color: C.t2, fontFamily: SANS }}>
                    <CheckCircle size={12} style={{ color: C.green, flexShrink: 0, marginTop: 2 }} />{c}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <SubHeading>Key Bot Metrics</SubHeading>
        <InteractiveTable
          headers={['Metric', 'Target', 'What It Tells You']}
          rows={[
            ['Containment Rate', '> 40%', 'Percentage of interactions fully resolved by the bot without agent handoff'],
            ['Intent Recognition Rate', '> 85%', 'Percentage of user messages that match an intent above confidence threshold'],
            ['Avg. Turns to Resolution', '< 6 turns', 'How many back-and-forth messages before the bot resolves the issue'],
            ['Escalation Rate', '< 30%', 'Percentage of interactions that require agent handoff'],
            ['Fallback Rate', '< 15%', 'Percentage of user messages where no intent matches (triggers fallback)'],
            ['Customer Satisfaction (CSAT)', '> 4.0/5.0', 'Post-bot survey score — the ultimate measure of bot quality'],
          ]}
        />
        <CalloutBox type="info">Use the Bot Flow Analytics dashboard in Genesys Cloud to track these metrics. The confusion matrix visualization shows which intents are being confused with each other — this is the single most valuable tool for improving bot accuracy.</CalloutBox>
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
      <SectionHeading>NLU Architecture — How It Really Works</SectionHeading>
      <Paragraph>Understanding the internal mechanics of the NLU engine is essential for troubleshooting classification issues, optimizing model performance, and designing intents that the model can reliably distinguish. The Genesys Dialog Engine uses a neural network-based pipeline for intent classification and entity extraction.</Paragraph>
      <SubHeading>The NLU Processing Pipeline</SubHeading>
      <div className="my-4 p-4 rounded-lg space-y-2" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
        {NLU_PIPELINE_STEPS.map((step, i) => (
          <div key={i} className="text-xs" style={{ color: C.t2, fontFamily: MONO }}>{step}</div>
        ))}
      </div>
      <SubHeading>Confidence Scoring Deep Dive</SubHeading>
      <Paragraph>The confidence score is not a simple percentage — it's the softmax probability from the neural network's output layer. The model produces a score for EVERY intent, and they all sum to 1.0. The "confidence" you see is the highest-scoring intent's probability. Key insight: a confidence of 0.60 doesn't mean "60% sure" — it means this intent scored 0.60 while the next-best scored much lower (e.g., 0.15).</Paragraph>
      <CodeBlock>{`// Example NLU output for input: "Where is my order?"
{
  "intent": "order.status",
  "confidence": 0.87,
  "allIntents": [
    { "name": "order.status",    "score": 0.87 },   // ← Clear winner
    { "name": "order.return",    "score": 0.06 },
    { "name": "account.balance", "score": 0.04 },
    { "name": "agent.request",   "score": 0.03 }
  ],
  "entities": [],   // No slot values in this message
  "state": "awaiting_slot_order_number"
}`}</CodeBlock>
      <SubHeading>Model Training Mechanics</SubHeading>
      <Paragraph>When you click "Train" in Architect, the system takes all your utterances, tokenizes them, generates embeddings, and trains a classification model. More diverse utterances produce better generalization. The model learns PATTERNS, not exact matches — so "check order status" generalizes to "I want to know about my order" even though the exact words differ. Training takes 1-15 minutes depending on corpus size.</Paragraph>
      <CalloutBox type="info">
        <strong>Pro tip:</strong> The NLU model is retrained from scratch each time — it does not incrementally update. This means removing bad utterances is just as important as adding good ones. If you notice a misclassification, check for misleading utterances in the wrong intent.
      </CalloutBox>
    </section>

    {/* T3S2 */}
    <section ref={el => sectionRefs.current['t3s2'] = el} id="t3s2">
      <SectionHeading>Advanced Dialog Patterns</SectionHeading>
      <Paragraph>Production bots need more than simple request-response patterns. Multi-turn conversations, context management, disambiguation, and graceful failure handling are what separate a prototype bot from a production-ready one.</Paragraph>
      <div className="space-y-4 my-4">
        {ADVANCED_DIALOG_PATTERNS.map((p, i) => (
          <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
            <div className="font-bold text-sm mb-3" style={{ color: C.t1, fontFamily: MONO }}>{p.title}</div>
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
      <SubHeading>Context Variables</SubHeading>
      <Paragraph>Architect bot flows support session-scoped variables that persist across turns. Use these to store collected slot values, conversation state flags, turn counters, and intermediate results from data actions. Context variables enable the bot to "remember" what happened earlier in the conversation without re-asking.</Paragraph>
    </section>

    {/* T3S3 */}
    <section ref={el => sectionRefs.current['t3s3'] = el} id="t3s3">
      <SectionHeading>Voice Bot Specifics</SectionHeading>
      <Paragraph>Voice bots add a layer of complexity beyond digital bots: audio must be converted to text (ASR), text responses must be converted to audio (TTS), and the interaction must handle voice-specific behaviors like barge-in, DTMF fallback, and silence detection.</Paragraph>
      <SubHeading>ASR Integration</SubHeading>
      <div className="space-y-2 my-4">
        {VOICE_BOT_DATA.asrEngines.map((engine, i) => (
          <div key={i} className="p-3 rounded flex items-center gap-3" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
            <Mic size={16} style={{ color: C.purple }} />
            <span className="text-xs" style={{ color: C.t1, fontFamily: MONO }}>{engine}</span>
          </div>
        ))}
      </div>
      <CalloutBox type="info">
        <strong>Bring Your Own ASR (March 2026):</strong> Administrators can now integrate third-party automatic speech recognition engines into Architect bot flows via the Bot Transcription Connector. Bot authors can designate a customer-provided ASR engine as the default transcription for an entire bot flow or for individual Ask for Slot actions, improving recognition accuracy for specific languages, accents, and industry domains while maintaining a unified bot design in Architect.
      </CalloutBox>
      <CalloutBox type="info">
        <strong>Custom ASR Dictionaries (March 2026):</strong> Custom dictionaries can now be configured for the Genesys Enhanced V3 speech-to-text engine in bot flows. These dictionaries improve recognition accuracy for organization-specific vocabulary such as product names, industry jargon, medical terms, or proprietary acronyms — reducing misrecognition in specialized domains.
      </CalloutBox>
      <SubHeading>TTS Voice Options</SubHeading>
      <div className="space-y-2 my-4">
        {VOICE_BOT_DATA.ttsVoices.map((voice, i) => (
          <div key={i} className="p-3 rounded flex items-center gap-3" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
            <Volume2 size={16} style={{ color: C.blue }} />
            <span className="text-xs" style={{ color: C.t1, fontFamily: MONO }}>{voice}</span>
          </div>
        ))}
      </div>
      <SubHeading>SSML Examples</SubHeading>
      <div className="space-y-2 my-4">
        {VOICE_BOT_DATA.ssmlExamples.map((ex, i) => (
          <div key={i} className="p-3 rounded" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
            <div className="text-xs font-semibold mb-1" style={{ color: C.green, fontFamily: MONO }}>{ex.tag}</div>
            <div className="text-xs" style={{ color: C.t2, fontFamily: SANS }}>{ex.desc}</div>
          </div>
        ))}
      </div>
      <SubHeading>Voice Bot Best Practices</SubHeading>
      <div className="space-y-1 my-3">
        {[
          { good: true, text: 'Enable DTMF fallback for critical inputs — "Say your account number or press it on your keypad"' },
          { good: true, text: 'Use barge-in so callers can interrupt long prompts and skip to their request' },
          { good: true, text: 'Keep TTS prompts short and conversational — long robot monologues lose callers' },
          { good: true, text: 'Add SSML pauses after questions to give the ASR time to activate' },
          { good: false, text: 'Don\'t play music or hold tones while ASR is active — background noise degrades recognition' },
          { good: false, text: 'Don\'t use complex sentence structures in TTS — simple, direct language sounds more natural' },
          { good: false, text: 'Don\'t skip silence detection tuning — too short triggers false positives, too long feels unresponsive' },
        ].map((p, i) => (
          <div key={i} className="text-xs flex items-start gap-2" style={{ color: p.good ? C.green : C.red, fontFamily: SANS }}>
            <span>{p.good ? 'DO' : 'AVOID'}</span><span style={{ color: C.t2 }}>{p.text}</span>
          </div>
        ))}
      </div>
    </section>

    {/* T3S4 */}
    <section ref={el => sectionRefs.current['t3s4'] = el} id="t3s4">
      <SectionHeading>Intent Mining & Analytics</SectionHeading>
      <Paragraph>Intent Mining uses AI to analyze historical customer conversations (chat transcripts, call transcripts, emails) and automatically discover what customers are asking about. Instead of guessing which intents to build, you let the data tell you. This is one of the most powerful tools for improving bot coverage over time.</Paragraph>
      <SubHeading>How Intent Mining Works</SubHeading>
      <div className="my-4 p-4 rounded-lg space-y-2" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
        {[
          '1. Select a date range and queue(s) to analyze (e.g., last 30 days, Support queue)',
          '2. The AI processes conversation transcripts and clusters similar customer messages',
          '3. Each cluster becomes a "suggested intent" with representative utterances',
          '4. Review suggested intents: accept, modify, merge, or reject each one',
          '5. Accepted intents can be added directly to an existing bot flow',
          '6. The suggested utterances become training data for the new intent',
          '7. Retrain the NLU model and publish the updated bot flow',
        ].map((step, i) => <div key={i} className="text-xs" style={{ color: C.t2, fontFamily: MONO }}>{step}</div>)}
      </div>
      <SubHeading>Topic Analysis</SubHeading>
      <Paragraph>Beyond intent mining, Genesys Cloud provides topic analysis dashboards that show the distribution of customer conversation topics over time. Use this to identify trending issues (e.g., a spike in "shipping delay" conversations), measure bot coverage gaps (topics with high volume but no bot intent), and prioritize which new intents to build next.</Paragraph>
      <CalloutBox type="info">
        <strong>Requirement:</strong> Intent Mining requires GC3 license and speech/text analytics. It works best with at least 1,000 historical conversations. The more data, the better the clustering quality.
      </CalloutBox>
    </section>

    {/* T3S5 */}
    <section ref={el => sectionRefs.current['t3s5'] = el} id="t3s5">
      <SectionHeading>API & Programmatic Management</SectionHeading>
      <Paragraph>The Genesys Cloud API provides complete programmatic control over bot flows, NLU domains, knowledge bases, and analytics. This enables CI/CD pipelines for bot deployments, automated testing, and integration with external development workflows.</Paragraph>
      <SubHeading>Key API Endpoints</SubHeading>
      <InteractiveTable searchable headers={['Method', 'Endpoint', 'Use']} rows={BOT_API_ENDPOINTS.map(e => [e.method, e.path, e.use])} />
      <SubHeading>CI/CD Pattern for Bot Deployments</SubHeading>
      <CodeBlock>{`# Bot CI/CD Pipeline
1. Developer updates intents/utterances in source control (YAML/JSON)
2. CI pipeline triggers on merge to main branch
3. API: POST /languageunderstanding/domains/{id}/intents (create/update intents)
4. API: POST /languageunderstanding/domains/{id}/training (trigger NLU training)
5. Wait for training completion (poll GET /domains/{id}/versions)
6. API: POST /flows/{id}/publish (publish updated bot flow)
7. Run automated test suite against published bot
8. If tests pass → deploy to production channel assignment
9. If tests fail → rollback to previous flow version`}</CodeBlock>
      <SubHeading>NLU Model Versioning</SubHeading>
      <Paragraph>Every time you train the NLU model, a new version is created. Previous versions are retained and can be rolled back to. This is critical for production safety — if a new model performs worse, you can instantly revert. Use the versions API endpoint to list, compare, and activate specific model versions.</Paragraph>
    </section>

    {/* T3S6 */}
    <section ref={el => sectionRefs.current['t3s6'] = el} id="t3s6">
      <SectionHeading>Platform Limits Reference</SectionHeading>
      <InteractiveTable searchable headers={['Resource', 'Limit', 'Notes']} rows={PLATFORM_LIMITS} />
    </section>

    {/* T3S7 */}
    <section ref={el => sectionRefs.current['t3s7'] = el} id="t3s7">
      <SectionHeading>Licensing & Feature Matrix</SectionHeading>
      <Paragraph>Genesys Cloud bot capabilities vary by license tier. GC1 can add bot features as add-ons, GC2 includes most native bot capabilities, and GC3 includes the full AI suite including intent mining and sentiment analysis.</Paragraph>
      <InteractiveTable headers={['Feature', 'GC1', 'GC2', 'GC3']} rows={LICENSE_MATRIX} />
      <CalloutBox type="info">
        <strong>License note:</strong> GC2 includes native Digital Bot Flows, Genesys Dialog Engine, and Knowledge Workbench. GC3 adds AI-powered features like Intent Mining, sentiment analysis, and the Knowledge Optimizer. Third-party bot integrations (Dialogflow, Lex) are available as add-ons across all tiers. Voice bot capabilities require voice infrastructure regardless of license tier.
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
const GenesysBotsGuide = ({ onBack, isDark: isDarkProp, setIsDark: setIsDarkProp, initialNav }) => {
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
            <span className="font-bold text-sm hidden sm:block" style={{ fontFamily: MONO, color: C.purple }}>GENESYS BOTS GUIDE</span>
            <span className="font-bold text-sm sm:hidden" style={{ fontFamily: MONO, color: C.purple }}>GC BOTS</span>
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
      <Footer title="Genesys Cloud Bots & Conversational AI — Interactive Knowledge Guide" />
    </div>
  );
};

export default GenesysBotsGuide;
