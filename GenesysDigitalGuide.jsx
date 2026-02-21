import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Rocket, Settings, Cpu, Search, ChevronDown, ChevronUp, ChevronRight,
  Menu, X, Phone, Mail, MessageSquare, Bell, RefreshCw, CheckCircle,
  AlertTriangle, AlertCircle, Info, Lightbulb, Star, ExternalLink,
  BookOpen, ArrowRight, ArrowDown, ArrowLeft, Circle, Zap, Shield, Clock, Users,
  FileText, Database, Activity, BarChart3, Target, PhoneCall, Monitor,
  Hash, Layers, Eye, ClipboardList, Volume2, Sun, Moon, GitBranch, Filter,
  Shuffle, UserCheck, Radio, Headphones, Globe, Calendar, Timer, TrendingUp,
  Award, Key, Lock, Unlock, MapPin, Send, Image, Link, Smartphone, Bot,
  MessageCircle, Share2, Inbox, PenTool, Code, Terminal, Package, Wifi
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
  'The Big Picture — How Digital Messages Reach the Right Agent',
  'Setting Up Channels — Messaging, Email, Bots, and Agent Tools',
  'Under the Hood — Architecture, APIs, and Edge Cases',
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
  { tier: 0, id: 't1s1', title: 'What Is Digital Messaging in Genesys Cloud?' },
  { tier: 0, id: 't1s2', title: 'The Building Blocks — Digital Channels' },
  { tier: 0, id: 't1s3', title: 'How a Digital Interaction Works' },
  { tier: 0, id: 't1s4', title: 'Email vs Messaging — Key Differences' },
  { tier: 0, id: 't1s5', title: 'Key Terminology Glossary' },
  { tier: 1, id: 't2s1', title: 'Prerequisites — What You Need Before Digital Channels' },
  { tier: 1, id: 't2s2', title: 'Web Messaging — Deep Dive' },
  { tier: 1, id: 't2s3', title: 'Third-Party Messaging Channels' },
  { tier: 1, id: 't2s4', title: 'Open Messaging API' },
  { tier: 1, id: 't2s5', title: 'Email Channel Setup & Routing' },
  { tier: 1, id: 't2s6', title: 'Bot Handoff for Digital Channels' },
  { tier: 1, id: 't2s7', title: 'Agent Experience — The Interaction Panel' },
  { tier: 1, id: 't2s8', title: 'Digital SLA & Queue Management' },
  { tier: 2, id: 't3s1', title: 'Digital Channel Architecture — How It Really Works' },
  { tier: 2, id: 't3s2', title: 'Advanced Web Messaging' },
  { tier: 2, id: 't3s3', title: 'Email Threading & Advanced Routing' },
  { tier: 2, id: 't3s4', title: 'Rich Media & Structured Content' },
  { tier: 2, id: 't3s5', title: 'API & Programmatic Management' },
  { tier: 2, id: 't3s6', title: 'Platform Limits Reference' },
  { tier: 2, id: 't3s7', title: 'Licensing & Feature Matrix' },
  { tier: 2, id: 't3s8', title: 'Troubleshooting Decision Tree' },
];

// ══════════════════════════════════════════════════════════════
// T1 DATA
// ══════════════════════════════════════════════════════════════
const DIGITAL_CHANNEL_TYPES = [
  { icon: 'MessageSquare', label: 'Web Messaging', desc: 'Persistent, async chat embedded in your website via the Genesys Messenger widget' },
  { icon: 'Phone', label: 'SMS / MMS', desc: 'Text messages (short and long code) routed through ACD queues' },
  { icon: 'MessageCircle', label: 'WhatsApp', desc: 'WhatsApp Business API integration for 2B+ user reach' },
  { icon: 'Share2', label: 'Facebook Messenger', desc: 'Facebook Page messaging routed to agents in real time' },
  { icon: 'Image', label: 'Instagram DM', desc: 'Instagram business account direct messages handled by agents' },
  { icon: 'Globe', label: 'LINE', desc: 'LINE Official Account messaging popular in APAC markets' },
  { icon: 'Code', label: 'Open Messaging', desc: 'Custom channel integration via webhook API for any platform' },
  { icon: 'Mail', label: 'Email', desc: 'Inbound email parsed, threaded, and routed via ACD queues' },
];

const DIGITAL_MAP_NODES = [
  { id: 'webMsg', label: 'WEB MESSAGING', sub: 'Messenger widget', x: 130, y: 80 },
  { id: 'sms', label: 'SMS', sub: 'Text messaging', x: 670, y: 80 },
  { id: 'whatsapp', label: 'WHATSAPP', sub: 'Business API', x: 80, y: 230 },
  { id: 'facebook', label: 'FACEBOOK', sub: 'Messenger', x: 720, y: 230 },
  { id: 'instagram', label: 'INSTAGRAM', sub: 'Direct Messages', x: 80, y: 430 },
  { id: 'line', label: 'LINE', sub: 'Official Account', x: 720, y: 430 },
  { id: 'openMsg', label: 'OPEN MESSAGING', sub: 'Custom webhook', x: 200, y: 540 },
  { id: 'email', label: 'EMAIL', sub: 'ACD email routing', x: 600, y: 540 },
  { id: 'acdRouting', label: 'ACD ROUTING', sub: 'Queue evaluation', x: 400, y: 100 },
];
const DIGITAL_MAP_CENTER = { x: 400, y: 300 };

const DIGITAL_NODE_TOOLTIPS = {
  webMsg: { explanation: 'A persistent messaging widget embedded in your website. Conversations survive page refreshes and return visits, unlike legacy web chat.', analogy: 'A text message thread on your phone — pick up where you left off' },
  sms: { explanation: 'Short Message Service — customers text a dedicated number and the message is routed to an ACD queue just like any other digital interaction.', analogy: 'Texting a business from your phone contacts' },
  whatsapp: { explanation: 'Integration with the WhatsApp Business API. Requires a verified business account and approved message templates for proactive outreach.', analogy: 'Your company having its own WhatsApp contact card' },
  facebook: { explanation: 'Connects your Facebook Page inbox to Genesys Cloud. Customer messages on your Page are routed to agents.', analogy: 'A receptionist monitoring the company Facebook inbox' },
  instagram: { explanation: 'Routes Instagram Direct Messages from your business account to agents through ACD queues.', analogy: 'Having a support team behind your Instagram DM button' },
  line: { explanation: 'Connects a LINE Official Account to Genesys Cloud for messaging in APAC markets where LINE dominates.', analogy: 'Setting up a customer service desk inside LINE' },
  openMsg: { explanation: 'A webhook-based API that lets you connect ANY messaging platform (Telegram, Viber, custom apps) to Genesys Cloud ACD routing.', analogy: 'A universal adapter that plugs any messaging app into your contact center' },
  email: { explanation: 'Inbound emails are received, parsed for threading, and routed to ACD queues. Agents reply from within the Genesys Cloud interface with signatures and canned responses.', analogy: 'A shared team inbox with smart sorting and assignment' },
  acdRouting: { explanation: 'The ACD engine that evaluates digital interactions against queue rules, skills, and agent availability — identical to voice routing logic.', analogy: 'The traffic controller that directs each message to the right agent' },
};

const DIGITAL_LIFECYCLE = [
  { step: 1, title: 'CUSTOMER SENDS MESSAGE', desc: 'Customer initiates contact via web messenger, SMS, WhatsApp, social media, email, or any connected channel', color: C.green, icon: 'Send' },
  {
    step: 2, title: 'MESSAGE INGESTION & NORMALIZATION', color: C.blue, icon: 'Inbox',
    desc: 'The platform receives the message and normalizes it:',
    checks: [
      'Channel adapter receives the message (webhook, API poll, or SMTP)',
      'Message is normalized into Genesys internal format (text, media, metadata)',
      'Customer identity resolution — match to known contact or create new',
      'Conversation lookup — attach to existing thread or create new conversation',
    ],
  },
  { step: 3, title: 'INBOUND MESSAGE FLOW EXECUTES', desc: 'An Architect Inbound Message Flow (or Inbound Email Flow) processes the interaction: bot engagement, data lookups, skill assignment, priority setting, and queue selection.', color: C.orange, icon: 'GitBranch' },
  {
    step: 4, title: 'ACD QUEUE EVALUATION', color: C.yellow, icon: 'Target',
    desc: 'The routing engine evaluates the queue:',
    checks: [
      'Check for available agents with matching skills and utilization capacity',
      'Apply evaluation method (Best Available, Bullseye, Predictive)',
      'Digital interactions check agent MESSAGE utilization (default: 4 concurrent)',
      'Email interactions check agent EMAIL utilization (default: 2 concurrent)',
    ],
  },
  { step: 5, title: 'AGENT ALERTING & ACCEPTANCE', desc: 'The selected agent receives a toast notification with a preview of the message. The agent has 30 seconds (default, configurable up to 300s) to accept. If declined or timed out, the interaction is re-evaluated.', color: C.purple, icon: 'UserCheck' },
  { step: 6, title: 'AGENT HANDLES CONVERSATION', desc: 'Agent reads the message, types a reply, shares files or rich content. For async channels, the conversation may span hours or days with multiple back-and-forth exchanges.', color: C.green, icon: 'MessageSquare' },
  { step: 7, title: 'WRAP-UP & RESOLUTION', desc: 'Agent ends the interaction, selects a wrap-up code, and enters ACW. For messaging, an auto-close timer may disconnect idle conversations automatically after a configurable period.', color: C.orange, icon: 'ClipboardList' },
];

const EMAIL_VS_MESSAGING = [
  { dimension: 'Interaction Model', email: 'Thread-based — each reply creates a new message in the thread', messaging: 'Conversation-based — continuous stream of messages in real time' },
  { dimension: 'Timing', email: 'Async by nature — hours or days between replies is normal', messaging: 'Near-sync — customers expect replies in seconds to minutes' },
  { dimension: 'Agent Concurrency', email: 'Default 2 concurrent (max 15)', messaging: 'Default 4 concurrent (max 15)' },
  { dimension: 'SLA Expectations', email: 'Typically 1-4 hour response time targets', messaging: 'Typically 30-90 second response time targets' },
  { dimension: 'Rich Content', email: 'HTML formatting, attachments, inline images, signatures', messaging: 'Quick replies, cards, carousels, buttons, images, files' },
  { dimension: 'Identity', email: 'Email address is the identifier — easy to match to CRM', messaging: 'Channel-specific ID (phone number, social handle, anonymous visitor)' },
  { dimension: 'Threading', email: 'Subject line + In-Reply-To headers maintain threads', messaging: 'Platform-managed conversation IDs maintain context' },
  { dimension: 'Disconnect', email: 'Agent explicitly disconnects; auto-close after idle period', messaging: 'Auto-close timer (idle timeout) or agent/customer disconnect' },
];

const GLOSSARY = [
  { term: 'Web Messaging', def: 'The persistent, async messaging channel embedded in websites via the Genesys Messenger deployment — replaces legacy web chat', tier: 'Tier 1' },
  { term: 'Messenger Deployment', def: 'The configuration object that defines how the Messenger widget appears and behaves on your website (branding, position, auth, bots)', tier: 'Tier 2' },
  { term: 'Open Messaging', def: 'A webhook-based API allowing any external messaging platform to integrate with Genesys Cloud ACD routing', tier: 'Tier 2' },
  { term: 'Message Flow', def: 'An Architect flow type that handles inbound digital messages — sets skills, invokes bots, and routes to queues', tier: 'Tier 2' },
  { term: 'ACD Email', def: 'Inbound email routing through Genesys Cloud queues with skill matching, priority, and agent assignment', tier: 'Tier 1' },
  { term: 'Canned Response', def: 'Pre-written reply templates agents can insert during digital interactions to ensure consistency and speed', tier: 'Tier 2' },
  { term: 'Auto-Close Timer', def: 'A configurable idle timeout that automatically disconnects messaging conversations after a period of inactivity', tier: 'Tier 2' },
  { term: 'Rich Media', def: 'Structured content beyond plain text — cards, carousels, quick reply buttons, images, files — supported per channel', tier: 'Tier 2' },
  { term: 'Bot Flow', def: 'An Architect Digital Bot Flow that handles automated conversations before escalating to a human agent', tier: 'Tier 2' },
  { term: 'Conversation ID', def: 'The unique identifier for a digital conversation — used for API lookups, threading, and analytics', tier: 'Tier 3' },
  { term: 'Webhook', def: 'An HTTP callback that delivers real-time event notifications from one system to another (used by Open Messaging)', tier: 'Tier 3' },
  { term: 'Predictive Engagement', def: 'AI-driven tool that monitors web visitor behavior and proactively offers messaging based on predicted intent', tier: 'Tier 3' },
  { term: 'Co-browse', def: 'Shared browsing session where the agent can see and interact with the customer\'s web page in real time', tier: 'Tier 3' },
  { term: 'Email Threading', def: 'The mechanism that groups related email messages into a single conversation using headers like In-Reply-To and References', tier: 'Tier 2' },
  { term: 'Utilization', def: 'The capacity model controlling how many simultaneous interactions an agent can handle per media type (message, email, voice)', tier: 'Tier 1' },
  { term: 'Async Messaging', def: 'A messaging paradigm where conversations persist over time — customers can leave and return without losing context', tier: 'Tier 1' },
];

// ══════════════════════════════════════════════════════════════
// T2 DATA
// ══════════════════════════════════════════════════════════════
const PREREQUISITES = [
  { title: 'ACD Queues with Digital Media Enabled', detail: 'At least one queue must have "Message" and/or "Email" media types enabled. Each media type has its own alerting timeout (default 30s for digital, configurable up to 300s). Agents assigned to the queue must have matching media utilization capacity.' },
  { title: 'Architect Flows Created', detail: 'Inbound Message Flows handle messaging channels (web messaging, SMS, WhatsApp, social). Inbound Email Flows handle email. Digital Bot Flows handle automated bot conversations before agent handoff. All flows must be published before they execute.' },
  { title: 'Agent Utilization Configured', detail: 'Default utilization: 1 voice, 3 chat (legacy), 4 message, 2 email. These are org-wide defaults that can be overridden per agent or utilization label. Agents must have sufficient capacity for the digital media types you plan to route.' },
  { title: 'Roles & Permissions', detail: 'Key permissions: Messaging > Integration > Add/Edit/View for channel admins. Conversation > Message/Email > Accept/Create/Transfer for agents. Architect > Flow > Add/Edit/Publish for flow designers. Analytics > Conversation Detail > View for supervisors.' },
];

const WEB_MESSAGING_CONFIG = [
  ['Messenger Deployment', 'The configuration object: name, allowed domains, branding (colors, logo, launcher icon position), default language, and associated Architect flow'],
  ['JavaScript Snippet', 'A <script> tag added to your website\'s HTML. Loads the Messenger widget asynchronously. Includes your deployment ID and environment region.'],
  ['Authentication', 'Optional: pass a signed JWT to identify the customer. Enables conversation history persistence and CRM data lookup. Requires OAuth client credential setup.'],
  ['Bot Integration', 'Attach a Digital Bot Flow to the deployment. The bot handles the conversation first and escalates to a human agent queue when needed.'],
  ['Co-browse', 'Enable co-browse to allow agents to request a shared browsing session during a web messaging conversation. Requires additional JavaScript library.'],
  ['Custom Attributes', 'Pass key-value data from your website into the conversation (e.g., page URL, cart value, customer ID) using the Genesys Messenger SDK commands.'],
];

const THIRD_PARTY_CHANNELS = [
  {
    name: 'SMS (Short Message Service)', color: C.green,
    steps: ['Provision an SMS number (short code or long code) through Genesys or bring your own via a supported carrier', 'Create an SMS integration in Admin > Message > SMS', 'Associate the number with an Inbound Message Flow in Architect', 'The flow routes to an ACD queue — agents see SMS conversations in the interaction panel'],
    notes: 'Long codes support 1 message/second throughput. Short codes support higher volumes. MMS (images) supported on long codes in US/Canada.',
  },
  {
    name: 'WhatsApp Business', color: C.green,
    steps: ['Register a WhatsApp Business Account and get it verified by Meta', 'Create a WhatsApp integration in Admin > Message > WhatsApp', 'Connect your phone number and verify ownership via the embedded signup flow', 'Associate with an Inbound Message Flow and ACD queue', 'For proactive outreach, create pre-approved Message Templates in Meta Business Manager'],
    notes: 'WhatsApp enforces a 24-hour session window — after 24 hours of customer inactivity, only approved template messages can be sent. Template messages require Meta approval (24-48 hours).',
  },
  {
    name: 'Facebook Messenger', color: C.blue,
    steps: ['Connect your Facebook Page to Genesys Cloud via Admin > Message > Facebook', 'Authorize Genesys Cloud to access your Page\'s messaging (requires Page Admin role)', 'Associate with an Inbound Message Flow and ACD queue', 'Customer messages on your Page are now routed to agents'],
    notes: 'Facebook Messenger supports rich media: images, files, quick replies, and button templates. Page-scoped IDs (PSID) identify customers — not their personal Facebook profile.',
  },
  {
    name: 'Instagram Direct Messages', color: C.purple,
    steps: ['Connect your Instagram Professional Account (must be linked to a Facebook Page)', 'Enable Instagram messaging in Admin > Message > Instagram', 'Associate with an Inbound Message Flow and ACD queue'],
    notes: 'Instagram DM supports images, story replies, and story mentions as inbound triggers. Instagram enforces a 7-day messaging window for human agent replies.',
  },
  {
    name: 'LINE', color: C.green,
    steps: ['Create a LINE Official Account in the LINE Developers Console', 'Create a LINE integration in Admin > Message > LINE', 'Enter your Channel ID and Channel Secret from the LINE console', 'Associate with an Inbound Message Flow'],
    notes: 'LINE is dominant in Japan, Taiwan, and Thailand. Supports rich menus, stickers, and flex messages. LINE uses a unique user ID per Official Account.',
  },
];

const OPEN_MESSAGING_CONFIG = [
  { label: 'Integration Setup', desc: 'Create an Open Messaging integration in Admin > Message > Open Messaging. Genesys provides an inbound webhook URL where your external platform sends messages.' },
  { label: 'Outbound Webhook', desc: 'Configure your outbound webhook URL — Genesys calls this URL when an agent sends a reply. Your middleware must deliver the agent\'s response to the external platform.' },
  { label: 'Message Format', desc: 'Messages use a normalized JSON structure with fields: id, channel, type (Text, Structured), text, content (media), direction (Inbound/Outbound), and metadata.' },
  { label: 'Media Support', desc: 'Open Messaging supports text, images, files, and structured content (cards, quick replies). Media files must be hosted at a publicly accessible URL.' },
  { label: 'Identity', desc: 'Each customer is identified by an opaque ID you provide. Genesys uses this to maintain conversation threading and contact resolution.' },
];

const EMAIL_SETUP = [
  { label: 'Email Domain', desc: 'Register your email domain (e.g., support.acme.com) in Admin > Contact Center > Email. Genesys verifies domain ownership via DNS records (CNAME or MX).' },
  { label: 'Email Address', desc: 'Create email addresses under your domain (e.g., support@support.acme.com). Each address is associated with an Inbound Email Flow and ACD queue.' },
  { label: 'MX Record Setup', desc: 'Point your domain\'s MX records to Genesys Cloud email servers. This routes all inbound email to that domain through Genesys Cloud for ACD processing.' },
  { label: 'Canned Responses', desc: 'Create reusable email templates in Admin > Contact Center > Canned Responses. Organize into libraries. Agents insert them with a shortcut while composing replies.' },
  { label: 'Email Signatures', desc: 'Configure per-queue email signatures (HTML supported). Signatures auto-append to every outbound email from that queue. Can include agent name variables.' },
  { label: 'Threading', desc: 'Genesys Cloud uses In-Reply-To and References headers to group related emails into a single conversation thread. Agents see the full thread history.' },
];

const BOT_HANDOFF_PATTERNS = [
  { name: 'Basic Escalation', desc: 'Bot handles the conversation until a trigger phrase or intent is detected (e.g., "talk to a human"). Bot executes Transfer to ACD action, passing accumulated context (intent, entities, transcript) to the agent.', color: C.orange },
  { name: 'Context-Preserving Transfer', desc: 'Bot collects customer information (name, account number, issue category) and attaches it as participant data. The agent sees a screen pop with all bot-collected data — no need to ask again.', color: C.blue },
  { name: 'Warm Transfer with Summary', desc: 'Bot generates a summary of the conversation so far and attaches it as an internal note. The agent reads the summary before their first reply, providing seamless continuity.', color: C.green },
  { name: 'Conditional Routing', desc: 'Bot determines the intent (billing, technical, sales) and sets ACD skills accordingly before transferring. Different intents route to different specialized queues.', color: C.purple },
];

const AGENT_EXPERIENCE_FEATURES = [
  { feature: 'Multi-Conversation Handling', desc: 'Agents handle multiple digital interactions simultaneously (default: 4 messages, 2 emails). A tabbed interface shows all active conversations with unread indicators.' },
  { feature: 'Canned Responses', desc: 'Pre-approved reply templates inserted with a keyboard shortcut or search. Libraries can be organized by topic. Supports variable substitution (customer name, case number).' },
  { feature: 'Quick Replies', desc: 'Structured buttons sent to the customer for fast selection (e.g., "Yes / No / Maybe"). Reduces typing for both agent and customer on supported channels.' },
  { feature: 'File Sharing', desc: 'Agents can send and receive files (images, PDFs, documents) during digital conversations. File size limits vary by channel (typically 10-25 MB).' },
  { feature: 'Internal Notes', desc: 'Agents can add notes visible only to other agents — not sent to the customer. Used for context during transfers or shift handoffs.' },
  { feature: 'Customer Profile Panel', desc: 'Sidebar displays customer information: contact details, conversation history, external contact record, and any custom attributes passed from the channel or bot.' },
];

const DIGITAL_SLA_CONFIG = [
  ['Auto-Close Timer', 'Automatically disconnects idle messaging conversations after a configurable period (e.g., 10 minutes of no customer activity). Frees agent capacity.'],
  ['Idle Timeout Warning', 'Optionally send a warning message to the customer before auto-close: "Are you still there? This chat will close in 2 minutes."'],
  ['Service Level Target', 'Set per-queue SLA targets for digital channels. Example: 80% of messages responded to within 60 seconds. Displayed in dashboards, not enforced by routing.'],
  ['ACW for Digital', 'After-call work applies to digital interactions too. Timed ACW (e.g., 15 seconds) works well for messaging since wrap-up is typically faster than voice.'],
  ['Priority Management', 'Use Architect flows to set priority on digital interactions. VIP customers or high-value conversations can jump the queue (priority 0-25, lower = higher).'],
  ['Queue Overflow', 'Configure maximum wait time or max interactions in queue. If exceeded, route to overflow queue, send a "we\'re busy" auto-reply, or offer callback/email.'],
];

// ══════════════════════════════════════════════════════════════
// T3 DATA
// ══════════════════════════════════════════════════════════════
const ARCHITECTURE_STEPS = [
  '1. External channel delivers message via webhook, API, or SMTP to Genesys Cloud ingestion layer',
  '2. Channel adapter normalizes the message into the internal conversation model (media type, text, attachments)',
  '3. Identity resolution: match the sender to an existing external contact or create a new one',
  '4. Conversation manager: attach message to an existing conversation or create a new one based on session rules',
  '5. Architect flow execution: Inbound Message/Email Flow processes the interaction (bot, data lookup, skill assignment)',
  '6. ACD queue placement: interaction enters the target queue with skills, priority, and language attached',
  '7. Agent evaluation: routing engine scores available agents (utilization check → skill match → idle time)',
  '8. Agent alerting: toast notification with message preview; 30s default timeout',
  '9. Delivery: agent accepts, conversation opens in the interaction panel; agent reads and replies',
  '10. Outbound path: agent reply → Genesys outbound adapter → channel API → delivered to customer device',
];

const ADVANCED_WEB_MESSAGING = [
  { title: 'Authenticated Messaging', desc: 'Pass a signed JWT token when initializing the Messenger SDK. This links the web visitor to a known contact record, enables conversation history persistence across devices, and unlocks CRM data for routing decisions.', color: C.blue },
  { title: 'Predictive Engagement', desc: 'AI monitors visitor behavior in real time (pages viewed, time on site, scroll depth, cart value). When the model predicts high engagement probability, it proactively offers a messaging conversation. Requires Predictive Engagement license.', color: C.purple },
  { title: 'Custom Attributes', desc: 'Use the Genesys("command", "Database.set", {...}) SDK method to pass custom key-value data into the conversation. Examples: current page URL, shopping cart contents, logged-in user ID, A/B test variant.', color: C.green },
  { title: 'Co-browse Integration', desc: 'Agent requests a co-browse session during an active web messaging conversation. Customer sees a permission prompt. Once accepted, the agent can see and optionally control the customer\'s browser tab. Sensitive fields can be masked.', color: C.orange },
];

const EMAIL_ADVANCED = [
  { label: 'Email Parsing', desc: 'Genesys Cloud parses inbound email headers (From, To, Subject, In-Reply-To, References, MIME type). The body is extracted as HTML and plain text. Attachments are stored and linked to the conversation.' },
  { label: 'Subject-Line Routing', desc: 'Architect Email Flows can inspect the subject line using string functions (Contains, StartsWith, Regex). Route to different queues based on keywords: "[URGENT]" → priority queue, "Invoice" → billing queue, "Return" → logistics queue.' },
  { label: 'Auto-Categorization', desc: 'Use a Data Action in the email flow to call an external NLP service or Genesys AI to classify the email topic. Set skills and queue based on the classification result.' },
  { label: 'Disconnect Handling', desc: 'If no agent is available within a timeout, route to a fallback queue or send an auto-acknowledgment: "We received your email and will respond within 4 hours." This prevents customer emails from sitting unanswered.' },
  { label: 'Signature Stripping', desc: 'Genesys Cloud attempts to strip previous replies and signatures from email threads to show agents only the latest customer message. This reduces clutter in long email threads.' },
];

const RICH_MEDIA_SUPPORT = [
  ['Text', true, true, true, true, true, true, true, true],
  ['Images', true, true, true, true, true, true, true, true],
  ['Files / Attachments', true, true, true, true, true, true, true, true],
  ['Quick Reply Buttons', true, true, true, true, false, true, true, false],
  ['Cards (title + image + buttons)', true, true, true, true, false, true, true, false],
  ['Carousels', true, true, false, true, false, true, true, false],
  ['Location Sharing', false, true, true, true, false, true, false, false],
  ['Stickers', false, false, false, false, false, true, false, false],
  ['HTML Formatting', false, false, false, false, false, false, false, true],
];

const API_ENDPOINTS = [
  { method: 'POST', path: '/api/v2/conversations/messages', use: 'Create a new outbound message conversation' },
  { method: 'GET', path: '/api/v2/conversations/messages/{conversationId}', use: 'Get message conversation details' },
  { method: 'POST', path: '/api/v2/conversations/messages/{conversationId}/messages', use: 'Send a message within an existing conversation' },
  { method: 'GET', path: '/api/v2/conversations/emails/{conversationId}', use: 'Get email conversation details and thread' },
  { method: 'POST', path: '/api/v2/conversations/emails', use: 'Create a new outbound email conversation' },
  { method: 'GET', path: '/api/v2/messaging/integrations', use: 'List all messaging channel integrations (SMS, WhatsApp, etc.)' },
  { method: 'POST', path: '/api/v2/messaging/integrations/open', use: 'Create an Open Messaging integration' },
  { method: 'GET', path: '/api/v2/webdeployments/deployments', use: 'List Messenger deployments' },
  { method: 'POST', path: '/api/v2/webdeployments/deployments', use: 'Create a new Messenger deployment' },
  { method: 'POST', path: '/api/v2/analytics/conversations/details/query', use: 'Query historical conversation analytics with media type filters' },
  { method: 'GET', path: '/api/v2/conversations/{conversationId}/participants/{participantId}/wrapup', use: 'Get wrap-up code for a digital interaction' },
  { method: 'POST', path: '/api/v2/notifications/channels', use: 'Subscribe to real-time conversation events' },
];

const PLATFORM_LIMITS = [
  ['Messenger deployments per org', '500', ''],
  ['SMS numbers per org', '1,000', 'Across all providers'],
  ['WhatsApp numbers per org', '25', 'Per WABA (WhatsApp Business Account)'],
  ['Facebook Pages per org', '50', ''],
  ['Open Messaging integrations per org', '100', ''],
  ['Email domains per org', '50', ''],
  ['Email addresses per domain', '500', ''],
  ['Canned response libraries per org', '200', ''],
  ['Canned responses per library', '1,000', ''],
  ['Message attachment size', '10 MB', 'Varies by channel'],
  ['Email attachment size', '25 MB', 'Total for all attachments'],
  ['Agent utilization — message', '1 - 15 concurrent', 'Default: 4'],
  ['Agent utilization — email', '1 - 15 concurrent', 'Default: 2'],
  ['Alerting timeout (digital)', '7 - 300 seconds', 'Default: 30 seconds'],
  ['Auto-close timer range', '1 - 1440 minutes', 'Default: 10 minutes'],
  ['ACW timeout max', '900 seconds', '15 minutes'],
  ['Queues per org', '5,000', 'Shared across all media types'],
  ['Skills per org', '300', 'Shared across all queues'],
  ['Architect flows per org', '1,000', 'Across all flow types'],
  ['WhatsApp template messages', '250 per number', 'Per 24-hour rolling window (varies by tier)'],
];

const LICENSE_MATRIX = [
  ['Web Messaging', true, true, true],
  ['Inbound email routing (ACD)', true, true, true],
  ['Canned responses', true, true, true],
  ['Architect message flows', true, true, true],
  ['SMS routing', 'add-on', true, true],
  ['Facebook Messenger', 'add-on', true, true],
  ['Instagram DM', 'add-on', true, true],
  ['LINE', 'add-on', true, true],
  ['WhatsApp', 'add-on', 'add-on', true],
  ['Open Messaging API', true, true, true],
  ['Digital Bot Flows', true, true, true],
  ['Co-browse', false, 'add-on', true],
  ['Predictive Engagement', false, false, true],
  ['Speech & text analytics (digital)', false, false, true],
  ['Sentiment analysis', false, false, true],
  ['Agent Assist (AI suggestions)', false, false, true],
];

const TROUBLESHOOTING = [
  { symptom: 'Web Messenger widget not appearing on website', investigation: 'Check: Is the JavaScript snippet correctly embedded in the HTML? → Is the deployment ID correct and matching your region? → Is the domain listed in the Allowed Domains for the deployment? → Is the deployment active (not disabled)? → Check browser console for JavaScript errors. → Is a Content Security Policy (CSP) blocking the Genesys script? Add apps.mypurecloud.com to your CSP.' },
  { symptom: 'Messages not routing to agents', investigation: 'Check: Is the Inbound Message Flow published (not draft)? → Is the flow associated with the correct messaging integration? → Does the queue have "Message" media enabled? → Are agents on-queue with "Available" status? → Do agents have message utilization capacity? (Check if they are maxed on concurrent conversations.) → Are skill requirements in the flow satisfiable by at least one agent?' },
  { symptom: 'Email not arriving in Genesys Cloud', investigation: 'Check: Are MX records correctly pointing to Genesys Cloud email servers? (Use nslookup/dig to verify.) → Is the email domain verified in Admin? → Is there an active Inbound Email Flow associated with the email address? → Check spam filters — is your email provider intercepting messages before they reach Genesys? → Is the sending address being blocked by any rules?' },
  { symptom: 'WhatsApp messages failing to send', investigation: 'Check: Is the WhatsApp integration active and the phone number verified? → Has the 24-hour session window expired? (If so, you must use an approved template message.) → Is the message template approved by Meta? → Is the WhatsApp Business API rate limit being exceeded? → Check the integration status in Admin > Message > WhatsApp for error codes.' },
  { symptom: 'Bot not transferring to agent correctly', investigation: 'Check: Does the Digital Bot Flow have a "Transfer to ACD" action? → Is the target queue valid and has agents? → Is the bot stuck in a loop (no exit condition for transfer intent)? → Are participant data variables being passed correctly to the agent? → Check Architect Debugger for runtime errors in the bot flow.' },
  { symptom: 'Conversations auto-closing too quickly', investigation: 'Check: What is the auto-close timer set to on the queue? (Default: 10 minutes.) → Is the customer receiving the idle warning message? → Is the timer resetting on each customer message? → For async channels, consider increasing the timer to 30-60 minutes or longer. → Check if the agent is accidentally disconnecting.' },
];

// ══════════════════════════════════════════════════════════════
// SEARCH INDEX
// ══════════════════════════════════════════════════════════════
const SEARCH_INDEX = (() => {
  const idx = [];
  SECTIONS.forEach(s => idx.push({ text: s.title, label: s.title, sectionId: s.id, tier: s.tier, type: 'Section' }));
  DIGITAL_CHANNEL_TYPES.forEach(c => idx.push({ text: `${c.label} ${c.desc}`, label: c.label, sectionId: 't1s1', tier: 0, type: 'Channel' }));
  DIGITAL_MAP_NODES.forEach(n => {
    const tooltip = DIGITAL_NODE_TOOLTIPS[n.id] || {};
    idx.push({ text: `${n.label} ${n.sub} ${tooltip.explanation || ''} ${tooltip.analogy || ''}`, label: n.label, sectionId: 't1s2', tier: 0, type: 'Component' });
  });
  DIGITAL_LIFECYCLE.forEach(l => idx.push({ text: `${l.title} ${l.desc} ${(l.checks || []).join(' ')}`, label: l.title, sectionId: 't1s3', tier: 0, type: 'Lifecycle Step' }));
  EMAIL_VS_MESSAGING.forEach(r => idx.push({ text: `${r.dimension} ${r.email} ${r.messaging}`, label: r.dimension, sectionId: 't1s4', tier: 0, type: 'Comparison' }));
  GLOSSARY.forEach(g => idx.push({ text: `${g.term} ${g.def}`, label: g.term, sectionId: 't1s5', tier: 0, type: 'Glossary' }));
  PREREQUISITES.forEach(p => idx.push({ text: `${p.title} ${p.detail}`, label: p.title, sectionId: 't2s1', tier: 1, type: 'Prerequisite' }));
  WEB_MESSAGING_CONFIG.forEach(c => idx.push({ text: `${c[0]} ${c[1]}`, label: c[0], sectionId: 't2s2', tier: 1, type: 'Config Option' }));
  THIRD_PARTY_CHANNELS.forEach(c => idx.push({ text: `${c.name} ${c.steps.join(' ')} ${c.notes}`, label: c.name, sectionId: 't2s3', tier: 1, type: 'Channel' }));
  OPEN_MESSAGING_CONFIG.forEach(c => idx.push({ text: `${c.label} ${c.desc}`, label: c.label, sectionId: 't2s4', tier: 1, type: 'Open Messaging' }));
  EMAIL_SETUP.forEach(c => idx.push({ text: `${c.label} ${c.desc}`, label: c.label, sectionId: 't2s5', tier: 1, type: 'Email Config' }));
  BOT_HANDOFF_PATTERNS.forEach(p => idx.push({ text: `${p.name} ${p.desc}`, label: p.name, sectionId: 't2s6', tier: 1, type: 'Handoff Pattern' }));
  AGENT_EXPERIENCE_FEATURES.forEach(f => idx.push({ text: `${f.feature} ${f.desc}`, label: f.feature, sectionId: 't2s7', tier: 1, type: 'Agent Feature' }));
  DIGITAL_SLA_CONFIG.forEach(c => idx.push({ text: `${c[0]} ${c[1]}`, label: c[0], sectionId: 't2s8', tier: 1, type: 'SLA Config' }));
  ARCHITECTURE_STEPS.forEach(s => idx.push({ text: s, label: s.substring(0, 50), sectionId: 't3s1', tier: 2, type: 'Architecture Step' }));
  ADVANCED_WEB_MESSAGING.forEach(f => idx.push({ text: `${f.title} ${f.desc}`, label: f.title, sectionId: 't3s2', tier: 2, type: 'Web Messaging Feature' }));
  EMAIL_ADVANCED.forEach(e => idx.push({ text: `${e.label} ${e.desc}`, label: e.label, sectionId: 't3s3', tier: 2, type: 'Email Feature' }));
  RICH_MEDIA_SUPPORT.forEach(r => idx.push({ text: `${r[0]} rich media content type`, label: r[0], sectionId: 't3s4', tier: 2, type: 'Rich Media' }));
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
const DigitalChannelMapSVG = () => {
  const [active, setActive] = useState(null);
  return (
    <div className="my-6 overflow-x-auto">
      <svg viewBox="0 0 800 600" className="w-full" style={{ maxWidth: 800, minWidth: 600 }}>
        <defs>
          <filter id="glow-d"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        {DIGITAL_MAP_NODES.map(n => (
          <line key={`line-${n.id}`} x1={DIGITAL_MAP_CENTER.x} y1={DIGITAL_MAP_CENTER.y} x2={n.x} y2={n.y} stroke={C.border} strokeWidth="2" strokeDasharray="6,4" />
        ))}
        <g>
          <rect x={DIGITAL_MAP_CENTER.x - 90} y={DIGITAL_MAP_CENTER.y - 30} width={180} height={60} rx={12} fill={C.bg3} stroke={C.green} strokeWidth={2} />
          <text x={DIGITAL_MAP_CENTER.x} y={DIGITAL_MAP_CENTER.y - 5} textAnchor="middle" fill={C.t1} fontFamily={MONO} fontSize={13} fontWeight="bold">OMNICHANNEL HUB</text>
          <text x={DIGITAL_MAP_CENTER.x} y={DIGITAL_MAP_CENTER.y + 15} textAnchor="middle" fill={C.t3} fontFamily={SANS} fontSize={10}>Unified routing engine</text>
        </g>
        {DIGITAL_MAP_NODES.map(n => {
          const isActive = active === n.id;
          const tooltip = DIGITAL_NODE_TOOLTIPS[n.id];
          return (
            <g key={n.id} className="cursor-pointer" onClick={() => setActive(isActive ? null : n.id)} style={{ transition: 'transform 0.2s' }}>
              <rect x={n.x - 70} y={n.y - 25} width={140} height={50} rx={8} fill={C.bg2} stroke={isActive ? C.green : C.border} strokeWidth={isActive ? 2 : 1} filter={isActive ? 'url(#glow-d)' : undefined} />
              <text x={n.x} y={n.y - 4} textAnchor="middle" fill={C.t1} fontFamily={MONO} fontSize={11} fontWeight="600">{n.label}</text>
              <text x={n.x} y={n.y + 12} textAnchor="middle" fill={C.t3} fontFamily={SANS} fontSize={9}>{n.sub}</text>
              {isActive && tooltip && (() => {
                const tw = 280;
                const tx = Math.max(8, Math.min(n.x - tw / 2, 800 - tw - 8));
                const above = n.y > 350;
                const ty = above ? n.y - 135 : n.y + 30;
                return (
                  <foreignObject x={tx} y={ty} width={tw} height={130}>
                    <div xmlns="http://www.w3.org/1999/xhtml" style={{ background: 'var(--bg3)', border: `1px solid ${C.green}`, borderRadius: 8, padding: '10px 12px', boxSizing: 'border-box' }}>
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
      <SectionHeading>What Is Digital Messaging in Genesys Cloud?</SectionHeading>
      <Paragraph>Digital messaging is the practice of handling customer conversations through non-voice channels: web chat, SMS, WhatsApp, Facebook Messenger, Instagram, LINE, email, and custom platforms. Think of it as expanding your contact center from a single-lane road (phone calls only) to a multi-lane highway where customers choose their preferred lane.</Paragraph>
      <Paragraph>Genesys Cloud treats every digital channel identically at the routing level. Whether a customer sends a WhatsApp message or an email, the interaction enters an ACD queue, gets evaluated against skills and agent availability, and is delivered to the best available agent. The only differences are in the media handling — rich content capabilities, threading models, and session windows vary by channel.</Paragraph>
      <SubHeading>Synchronous vs Asynchronous Messaging</SubHeading>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        {[
          { title: 'SYNCHRONOUS (REAL-TIME)', items: ['Both parties are present at the same time', 'Immediate back-and-forth like a phone call', 'Customer expects a reply within seconds', 'Example: legacy web chat — closing the tab ends the session', 'Agent is "locked" to the conversation while active'], color: C.orange },
          { title: 'ASYNCHRONOUS (PERSISTENT)', items: ['Parties can respond at their own pace', 'Conversation persists across sessions and devices', 'Customer can close the app and return later', 'Example: web messaging, SMS, WhatsApp — thread continues', 'Agent capacity is more flexible — handle 4-6 at once'], color: C.green },
        ].map((panel, i) => (
          <div key={i} className="rounded-lg p-5" style={{ backgroundColor: C.bg2, borderTop: `3px solid ${panel.color}` }}>
            <div className="font-bold mb-3 text-sm" style={{ color: panel.color, fontFamily: MONO }}>{panel.title}</div>
            {panel.items.map((item, j) => <div key={j} className="text-sm mb-1.5" style={{ color: C.t2, fontFamily: SANS }}>{item}</div>)}
          </div>
        ))}
      </div>
      <SubHeading>Why Digital Channels Matter</SubHeading>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
        {[
          { title: 'Customer Preference', desc: '70%+ of consumers prefer messaging over calling. Meeting customers on their preferred channel increases satisfaction and reduces effort.', color: C.blue },
          { title: 'Agent Efficiency', desc: 'Agents handle 3-6 digital conversations simultaneously vs. 1 voice call. This dramatically improves agent utilization and reduces cost per contact.', color: C.green },
          { title: 'Conversation Continuity', desc: 'Async messaging means no "starting over." The full conversation history travels with the interaction — across sessions, agents, and even days.', color: C.purple },
        ].map((card, i) => (
          <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
            <div className="font-bold text-sm mb-2" style={{ color: card.color, fontFamily: MONO }}>{card.title}</div>
            <div className="text-xs" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.6 }}>{card.desc}</div>
          </div>
        ))}
      </div>
      <CalloutBox type="tip">Genesys Cloud's web messaging replaces legacy web chat. Web messaging is persistent and asynchronous — customers can close the browser, return tomorrow, and pick up the same conversation. Legacy web chat is session-based and ends when the browser tab closes.</CalloutBox>
    </section>

    {/* T1S2 */}
    <section ref={el => sectionRefs.current['t1s2'] = el} id="t1s2">
      <SectionHeading>The Building Blocks — Digital Channels</SectionHeading>
      <Paragraph>Genesys Cloud supports eight primary digital channel types, all funneling through a single omnichannel routing engine. Think of it like a hotel with multiple entrances — front door, side entrance, valet, online check-in — but every guest ends up at the same front desk for service.</Paragraph>
      <CalloutBox type="tip">Click any node in the diagram below to see what it does and a simple analogy.</CalloutBox>
      <DigitalChannelMapSVG />
      <SubHeading>Channel Reference</SubHeading>
      <InteractiveTable
        headers={['Channel', 'Description', 'Analogy']}
        rows={Object.entries(DIGITAL_NODE_TOOLTIPS).map(([k, v]) => {
          const node = DIGITAL_MAP_NODES.find(n => n.id === k);
          return [node?.label || k, v.explanation, v.analogy];
        })}
      />
    </section>

    {/* T1S3 */}
    <section ref={el => sectionRefs.current['t1s3'] = el} id="t1s3">
      <SectionHeading>How a Digital Interaction Works</SectionHeading>
      <Paragraph>Every digital interaction — whether it is a WhatsApp message, an email, or a web chat — follows the same lifecycle through Genesys Cloud. Understanding this flow reveals how all the pieces connect.</Paragraph>
      <div className="my-6 space-y-0">
        {DIGITAL_LIFECYCLE.map((s, i) => (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: s.color + '22', color: s.color, border: `2px solid ${s.color}`, fontFamily: MONO }}>{s.step}</div>
              {i < DIGITAL_LIFECYCLE.length - 1 && <div className="w-0.5 flex-1 my-1" style={{ backgroundColor: C.border }} />}
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
          <div className="font-bold text-sm" style={{ color: C.green, fontFamily: MONO }}>CONVERSATION RESOLVED — AGENT READY FOR NEXT INTERACTION</div>
        </div>
      </div>
    </section>

    {/* T1S4 */}
    <section ref={el => sectionRefs.current['t1s4'] = el} id="t1s4">
      <SectionHeading>Email vs Messaging — Key Differences</SectionHeading>
      <Paragraph>Email and messaging channels both flow through Genesys Cloud ACD routing, but they differ fundamentally in timing, agent experience, and customer expectations. Understanding these differences is critical for setting appropriate SLAs, staffing models, and queue configurations.</Paragraph>
      <InteractiveTable
        headers={['Dimension', 'Email', 'Messaging']}
        rows={EMAIL_VS_MESSAGING.map(r => [r.dimension, r.email, r.messaging])}
      />
      <CalloutBox type="info">A simple way to think about it: email is like sending a letter — you write it, send it, and wait for a response. Messaging is like a text conversation — quick, informal, and back-and-forth. Both are valid, but they require different staffing strategies and SLA targets.</CalloutBox>
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
  const [activeChannelTab, setActiveChannelTab] = useState(0);
  return (
    <div className="space-y-16">
      {/* T2S1 */}
      <section ref={el => sectionRefs.current['t2s1'] = el} id="t2s1">
        <SectionHeading>Prerequisites — What You Need Before Digital Channels</SectionHeading>
        <Paragraph>Before deploying your first digital channel, these platform-level components must be in place. Think of this as preparing the stage before the curtain goes up.</Paragraph>
        <div className="space-y-3 my-4">
          {PREREQUISITES.map((p, i) => (
            <ExpandableCard key={i} title={`${i + 1}. ${p.title}`} accent={C.green}>
              {p.detail}
            </ExpandableCard>
          ))}
        </div>
        <SubHeading>Recommended Setup Sequence</SubHeading>
        <div className="flex flex-wrap items-center gap-1 my-4 overflow-x-auto">
          {['Users / Agents', 'Utilization Config', 'Queues (digital media)', 'Skills & Languages', 'Canned Responses', 'Architect Flows', 'Channel Integrations', 'Deployments', 'Test End-to-End'].map((s, i) => (
            <React.Fragment key={i}>
              <span className="px-3 py-1.5 rounded text-xs whitespace-nowrap" style={{ backgroundColor: C.bg3, color: C.t1, fontFamily: MONO, border: `1px solid ${C.border}` }}>{s}</span>
              {i < 8 && <ArrowRight size={14} style={{ color: C.t3, flexShrink: 0 }} />}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* T2S2 */}
      <section ref={el => sectionRefs.current['t2s2'] = el} id="t2s2">
        <SectionHeading>Web Messaging — Deep Dive</SectionHeading>
        <Paragraph>Web Messaging is the flagship digital channel in Genesys Cloud. It replaces legacy web chat with a persistent, asynchronous experience. Think of it as upgrading from a walkie-talkie (synchronous, session-based) to a smartphone messenger (persistent, async, rich media).</Paragraph>
        <SubHeading>Configuration Options</SubHeading>
        <div className="space-y-2 my-3">
          {WEB_MESSAGING_CONFIG.map(([label, desc], i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-1 p-3 rounded" style={{ backgroundColor: C.bg2 }}>
              <span className="text-xs font-semibold whitespace-nowrap min-w-[160px]" style={{ color: C.green, fontFamily: MONO }}>{label}:</span>
              <span className="text-xs" style={{ color: C.t2, fontFamily: SANS }}>{desc}</span>
            </div>
          ))}
        </div>
        <SubHeading>JavaScript Deployment Snippet</SubHeading>
        <CodeBlock>{`<!-- Genesys Messenger Widget -->
<script type="text/javascript" charset="utf-8">
  (function (g, e, n, s, y, c) {
    g['_genesysJs'] = y;
    g[y] = g[y] || function () { (g[y].q = g[y].q || []).push(arguments); };
    g[y].t = 1 * new Date();
    g[y].c = c;
    var ys = e.createElement('script');
    ys.async = 1; ys.src = n; ys.charset = 'utf-8';
    e.head.appendChild(ys);
  })(window, document,
     'https://apps.mypurecloud.com/genesys-bootstrap/genesys.min.js',
     {}, 'Genesys', {
       environment: 'prod-euc1',    // Your region
       deploymentId: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
     });
</script>`}</CodeBlock>
        <SubHeading>Passing Custom Attributes</SubHeading>
        <CodeBlock>{`// Send custom data into the conversation
Genesys("command", "Database.set", {
  messaging: {
    customAttributes: {
      customerTier: "Enterprise",
      cartValue: "2450.00",
      pageUrl: window.location.href
    }
  }
});`}</CodeBlock>
        <CalloutBox type="warning">The Messenger widget is blocked if your website's Content Security Policy (CSP) does not include the Genesys domain. Add <code>apps.mypurecloud.com</code> and <code>*.purecloud.com</code> to your CSP connect-src and script-src directives.</CalloutBox>
      </section>

      {/* T2S3 */}
      <section ref={el => sectionRefs.current['t2s3'] = el} id="t2s3">
        <SectionHeading>Third-Party Messaging Channels</SectionHeading>
        <Paragraph>Beyond web messaging, Genesys Cloud connects to major third-party messaging platforms. Each channel has its own setup process, API requirements, and content capabilities — but once connected, they all route through the same ACD engine.</Paragraph>
        <div className="flex gap-1 mb-3 overflow-x-auto flex-wrap">
          {THIRD_PARTY_CHANNELS.map((ch, i) => (
            <button key={i} className="px-3 py-1.5 rounded text-xs whitespace-nowrap cursor-pointer transition-colors" onClick={() => setActiveChannelTab(i)} style={{ backgroundColor: activeChannelTab === i ? ch.color : C.bg3, color: activeChannelTab === i ? '#fff' : C.t2, fontFamily: MONO }}>{ch.name.split(' (')[0]}</button>
          ))}
        </div>
        <div className="p-4 rounded-lg" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
          <div className="font-bold text-sm mb-3" style={{ color: C.t1, fontFamily: MONO }}>{THIRD_PARTY_CHANNELS[activeChannelTab].name}</div>
          <SubHeading>Setup Steps</SubHeading>
          <div className="space-y-1 mb-3">
            {THIRD_PARTY_CHANNELS[activeChannelTab].steps.map((s, i) => (
              <div key={i} className="text-xs flex items-start gap-2" style={{ color: C.t2, fontFamily: MONO }}>
                <ArrowRight size={10} style={{ color: C.green, flexShrink: 0, marginTop: 3 }} />
                <span>{s}</span>
              </div>
            ))}
          </div>
          <CalloutBox type="info">{THIRD_PARTY_CHANNELS[activeChannelTab].notes}</CalloutBox>
        </div>
      </section>

      {/* T2S4 */}
      <section ref={el => sectionRefs.current['t2s4'] = el} id="t2s4">
        <SectionHeading>Open Messaging API</SectionHeading>
        <Paragraph>Open Messaging is the universal adapter for Genesys Cloud. If a messaging platform does not have a native integration (e.g., Telegram, Viber, a custom mobile app), you can connect it using Open Messaging's webhook-based architecture. Think of it as a power strip — any device with a plug can connect.</Paragraph>
        <div className="space-y-3 my-4">
          {OPEN_MESSAGING_CONFIG.map((c, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
              <div className="font-semibold text-sm mb-2" style={{ color: C.green, fontFamily: MONO }}>{c.label}</div>
              <div className="text-sm" style={{ color: C.t2, fontFamily: SANS }}>{c.desc}</div>
            </div>
          ))}
        </div>
        <SubHeading>Inbound Message Format</SubHeading>
        <CodeBlock>{`POST https://api.mypurecloud.com/api/v2/conversations/messages/inbound/open
{
  "channel": {
    "platform": "Open",
    "type": "Private",
    "messageId": "msg-uuid-001",
    "to": { "id": "your-integration-id" },
    "from": { "id": "customer-unique-id", "idType": "Opaque" },
    "time": "2025-03-15T14:30:00.000Z"
  },
  "type": "Text",
  "text": "Hi, I need help with my order #12345",
  "direction": "Inbound"
}`}</CodeBlock>
        <SubHeading>Outbound Webhook (Agent Reply)</SubHeading>
        <CodeBlock>{`// Genesys sends this to YOUR outbound webhook URL when the agent replies:
{
  "id": "msg-uuid-002",
  "channel": { "to": { "id": "customer-unique-id" } },
  "type": "Text",
  "text": "Sure! Let me look up order #12345 for you.",
  "direction": "Outbound",
  "metadata": { "conversationId": "conv-uuid-abc" }
}
// Your middleware receives this and delivers it to the external platform`}</CodeBlock>
        <CalloutBox type="tip">Open Messaging supports bidirectional media. To send an image, include a "content" array with type "Attachment" and a publicly accessible URL. The customer's external platform must handle rendering.</CalloutBox>
      </section>

      {/* T2S5 */}
      <section ref={el => sectionRefs.current['t2s5'] = el} id="t2s5">
        <SectionHeading>Email Channel Setup & Routing</SectionHeading>
        <Paragraph>Email in Genesys Cloud is not just a mailbox — it is a fully routed, skill-matched, queue-managed interaction type. Think of it as transforming a shared team inbox (everyone sees everything, no accountability) into a managed assignment system where each email goes to the right person.</Paragraph>
        <div className="space-y-3 my-4">
          {EMAIL_SETUP.map((c, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
              <div className="font-semibold text-sm mb-2" style={{ color: C.green, fontFamily: MONO }}>{i + 1}. {c.label}</div>
              <div className="text-sm" style={{ color: C.t2, fontFamily: SANS }}>{c.desc}</div>
            </div>
          ))}
        </div>
        <SubHeading>Email Flow Example</SubHeading>
        <div className="my-4 p-4 rounded-lg" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
          {[
            { indent: 0, text: 'EMAIL ARRIVES (support@acme.com triggers inbound email flow)', color: C.green },
            { indent: 1, text: 'Evaluate Schedule Group: "BusinessHours"', color: C.yellow },
            { indent: 2, text: 'IF OPEN:', color: C.green },
            { indent: 3, text: 'Check Subject Line: Contains "[URGENT]"?', color: C.blue },
            { indent: 4, text: 'YES → Set Priority 2, Set Skill "Escalation" → Transfer to ACD: "Support_Email_Urgent"', color: C.orange },
            { indent: 4, text: 'NO → Check Subject: Contains "Invoice" or "Billing"?', color: C.blue },
            { indent: 5, text: 'YES → Set Skill "Billing" → Transfer to ACD: "Billing_Email"', color: C.orange },
            { indent: 5, text: 'NO → Transfer to ACD: "General_Email" (default queue)', color: C.orange },
            { indent: 2, text: 'IF CLOSED:', color: C.red },
            { indent: 3, text: 'Send Auto-Reply: "We received your email and will respond within 4 business hours"', color: C.t3 },
            { indent: 3, text: 'Transfer to ACD: "Email_Backlog" (next-day processing queue)', color: C.orange },
          ].map((line, i) => (
            <div key={i} className="text-xs" style={{ paddingLeft: line.indent * 20, color: line.color, fontFamily: MONO, marginBottom: 2 }}>{line.text}</div>
          ))}
        </div>
        <CalloutBox type="warning">Email domain verification requires DNS changes (MX or CNAME records). These changes can take up to 48 hours to propagate. Plan email channel setup well ahead of your go-live date.</CalloutBox>
      </section>

      {/* T2S6 */}
      <section ref={el => sectionRefs.current['t2s6'] = el} id="t2s6">
        <SectionHeading>Bot Handoff for Digital Channels</SectionHeading>
        <Paragraph>Bots in Genesys Cloud handle the first line of digital interaction — answering FAQs, collecting customer information, and determining intent — before escalating to a human agent when needed. Think of it as a triage nurse who assesses your symptoms before sending you to the right specialist.</Paragraph>
        <SubHeading>Handoff Patterns</SubHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
          {BOT_HANDOFF_PATTERNS.map((p, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, borderLeft: `4px solid ${p.color}` }}>
              <div className="font-bold text-sm mb-2" style={{ color: p.color, fontFamily: MONO }}>{p.name}</div>
              <div className="text-sm" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.6 }}>{p.desc}</div>
            </div>
          ))}
        </div>
        <SubHeading>Bot Flow → Agent Flow Architecture</SubHeading>
        <CodeBlock>{`Digital Bot Flow (handles automated conversation)
  │
  ├─ Intent: FAQ → Bot answers directly (no agent needed)
  ├─ Intent: Order Status → Data Action: Look up order → Bot replies with status
  ├─ Intent: Complaint → Set Participant Data: { reason: "complaint", orderId: "12345" }
  │   └─ Transfer to ACD: "Complaints_Queue" (skills: Escalation)
  └─ Fallback (no intent matched after 3 attempts)
      └─ Transfer to ACD: "General_Support" (any available agent)

Inbound Message Flow (post-bot, handles ACD routing)
  └─ Read Participant Data → Set Skills based on bot-collected intent
      └─ Transfer to ACD with context attached`}</CodeBlock>
        <CalloutBox type="tip">Always include a fallback escalation path in your bot flow. If the bot fails to understand after 2-3 attempts, transfer to a human agent. A bot that loops endlessly frustrates customers more than no bot at all.</CalloutBox>
      </section>

      {/* T2S7 */}
      <section ref={el => sectionRefs.current['t2s7'] = el} id="t2s7">
        <SectionHeading>Agent Experience — The Interaction Panel</SectionHeading>
        <Paragraph>When a digital interaction is routed to an agent, it appears in the Genesys Cloud Interaction Panel. This is the agent's workspace for reading messages, typing replies, sharing files, and managing multiple concurrent conversations. Think of it as a specialized email client built for real-time multitasking.</Paragraph>
        <SubHeading>Key Features</SubHeading>
        <div className="space-y-3 my-4">
          {AGENT_EXPERIENCE_FEATURES.map((f, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
              <div className="font-semibold text-sm mb-2" style={{ color: C.t1, fontFamily: MONO }}>{f.feature}</div>
              <div className="text-sm" style={{ color: C.t2, fontFamily: SANS }}>{f.desc}</div>
            </div>
          ))}
        </div>
        <SubHeading>Handling Multiple Conversations</SubHeading>
        <Paragraph>Agents handling 4+ simultaneous messaging conversations need clear visual indicators. Genesys Cloud shows unread message counts on each conversation tab, plays a notification sound for new messages, and highlights the most recently active conversation. Best practice: set message utilization to 4 initially, then increase to 5-6 as agents gain comfort with multitasking.</Paragraph>
        <CalloutBox type="info">Agents can handle voice and digital interactions simultaneously depending on utilization settings. The default configuration allows 1 voice call + multiple digital interactions at the same time. This is called "interruptible" mode — a voice call can interrupt digital work.</CalloutBox>
      </section>

      {/* T2S8 */}
      <section ref={el => sectionRefs.current['t2s8'] = el} id="t2s8">
        <SectionHeading>Digital SLA & Queue Management</SectionHeading>
        <Paragraph>Managing SLAs for digital channels is different from voice. Customers do not "hang up" an email or abandon a WhatsApp conversation in the same way they abandon a phone call. Async channels require different metrics, timers, and staffing models.</Paragraph>
        <SubHeading>Key Configuration Options</SubHeading>
        <div className="space-y-2 my-3">
          {DIGITAL_SLA_CONFIG.map(([label, desc], i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-1 p-3 rounded" style={{ backgroundColor: C.bg2 }}>
              <span className="text-xs font-semibold whitespace-nowrap min-w-[180px]" style={{ color: C.green, fontFamily: MONO }}>{label}:</span>
              <span className="text-xs" style={{ color: C.t2, fontFamily: SANS }}>{desc}</span>
            </div>
          ))}
        </div>
        <SubHeading>Recommended SLA Targets by Channel</SubHeading>
        <InteractiveTable
          headers={['Channel', 'Response Time SLA', 'Auto-Close Timer', 'Agent Concurrency']}
          rows={[
            ['Web Messaging', '30-60 seconds', '10-15 minutes', '4-6 concurrent'],
            ['SMS', '60-120 seconds', '30-60 minutes', '4-6 concurrent'],
            ['WhatsApp', '60-120 seconds', '30-60 minutes', '4-6 concurrent'],
            ['Facebook Messenger', '60-120 seconds', '15-30 minutes', '4-6 concurrent'],
            ['Email', '1-4 hours', 'N/A (agent disconnects)', '2-3 concurrent'],
          ]}
        />
        <CalloutBox type="warning">Auto-close timers free up agent capacity but can frustrate customers on async channels. If a customer sends a message, goes to lunch, and returns 15 minutes later to find the conversation closed, they must start over. For truly async channels (SMS, WhatsApp), consider 30-60 minute timers or longer.</CalloutBox>
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
      <SectionHeading>Digital Channel Architecture — How It Really Works</SectionHeading>
      <Paragraph>Understanding the internal architecture of Genesys Cloud's digital messaging platform is essential for troubleshooting delivery issues, optimizing latency, and building custom integrations. The platform operates as a distributed, event-driven microservices architecture.</Paragraph>
      <SubHeading>The Message Processing Pipeline</SubHeading>
      <div className="my-4 p-4 rounded-lg space-y-2" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
        {ARCHITECTURE_STEPS.map((step, i) => (
          <div key={i} className="text-xs" style={{ color: C.t2, fontFamily: MONO }}>{step}</div>
        ))}
      </div>
      <SubHeading>Delivery Guarantees</SubHeading>
      <Paragraph>Genesys Cloud provides at-least-once delivery for inbound messages. If the ingestion layer acknowledges receipt from the channel provider, the message will be delivered to an agent — even if internal retries are needed. For outbound messages (agent replies), the platform confirms delivery to the channel provider's API but cannot guarantee delivery to the customer's device (that is the channel provider's responsibility — e.g., WhatsApp, SMS carrier).</Paragraph>
      <SubHeading>Webhook Processing</SubHeading>
      <div className="my-4 p-4 rounded-lg" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
        <div className="font-bold text-xs mb-3" style={{ color: C.green, fontFamily: MONO }}>WEBHOOK RELIABILITY MODEL:</div>
        <CodeBlock>{`Inbound webhook flow:
  Channel Provider → HTTPS POST → Genesys Ingestion → 200 OK (within 3s)
  If Genesys returns non-200 → Provider retries (exponential backoff)
  If Genesys returns 200 → Message is queued for processing

Outbound webhook flow (Open Messaging):
  Agent sends reply → Genesys → HTTPS POST → Your middleware → 200 OK
  If your server returns non-200 → Genesys retries up to 3 times
  If all retries fail → Message marked as "Failed" in conversation history
  Retry intervals: 5 seconds, 30 seconds, 120 seconds`}</CodeBlock>
      </div>
      <CalloutBox type="info">
        <strong>Latency budget:</strong> End-to-end message delivery (customer sends → agent sees) typically takes 1-3 seconds for web messaging, 2-5 seconds for third-party channels (SMS, WhatsApp), and 5-30 seconds for email (SMTP processing). Webhook endpoints must respond within 3 seconds to avoid timeouts.
      </CalloutBox>
    </section>

    {/* T3S2 */}
    <section ref={el => sectionRefs.current['t3s2'] = el} id="t3s2">
      <SectionHeading>Advanced Web Messaging</SectionHeading>
      <Paragraph>Web Messaging's full power is unlocked through authentication, predictive engagement, custom attributes, and co-browse. These features transform the Messenger widget from a simple chat window into an intelligent, context-aware engagement tool.</Paragraph>
      <div className="space-y-4 my-4">
        {ADVANCED_WEB_MESSAGING.map((f, i) => (
          <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
            <div className="font-bold text-sm mb-2" style={{ color: f.color, fontFamily: MONO }}>{f.title}</div>
            <div className="text-sm" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.7 }}>{f.desc}</div>
          </div>
        ))}
      </div>
      <SubHeading>Authenticated Messaging — JWT Setup</SubHeading>
      <CodeBlock>{`// 1. Your backend generates a signed JWT with the customer's identity
const jwt = signJWT({
  sub: "customer-12345",           // Unique customer ID
  iss: "your-oauth-client-id",     // Genesys OAuth client
  exp: Math.floor(Date.now()/1000) + 3600,
  iat: Math.floor(Date.now()/1000),
  name: "Jane Smith",
  email: "jane@example.com"
}, privateKey, { algorithm: 'RS256' });

// 2. Pass the JWT to the Messenger widget
Genesys("command", "MessagingService.setAuthToken", {
  token: jwt
});

// Result: Conversation history persists across devices
// Agent sees customer name and email in the interaction panel
// Architect flow can access customer identity for routing decisions`}</CodeBlock>
      <CalloutBox type="warning">Authenticated messaging requires an OAuth client configured in Genesys Cloud with the "Token Implicit Grant" type. The public key must be uploaded to Genesys Cloud for JWT signature verification. Rotate keys regularly and set JWT expiration to 1 hour or less.</CalloutBox>
    </section>

    {/* T3S3 */}
    <section ref={el => sectionRefs.current['t3s3'] = el} id="t3s3">
      <SectionHeading>Email Threading & Advanced Routing</SectionHeading>
      <Paragraph>Email threading in Genesys Cloud relies on standard email headers to group related messages into a single conversation. Understanding how threading works — and how it can break — is critical for managing email-heavy contact centers.</Paragraph>
      <div className="space-y-3 my-4">
        {EMAIL_ADVANCED.map((item, i) => (
          <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
            <div className="font-semibold text-sm mb-2" style={{ color: C.purple, fontFamily: MONO }}>{item.label}</div>
            <div className="text-sm" style={{ color: C.t2, fontFamily: SANS }}>{item.desc}</div>
          </div>
        ))}
      </div>
      <SubHeading>Threading Mechanics</SubHeading>
      <CodeBlock>{`Email threading relies on these headers:

FIRST EMAIL (customer → support@acme.com):
  Message-ID: <abc123@customer-mail.com>
  Subject: Help with order #5678

AGENT REPLY (Genesys → customer):
  Message-ID: <def456@genesys.cloud>
  In-Reply-To: <abc123@customer-mail.com>
  References: <abc123@customer-mail.com>
  Subject: Re: Help with order #5678

CUSTOMER REPLY (customer → support@acme.com):
  Message-ID: <ghi789@customer-mail.com>
  In-Reply-To: <def456@genesys.cloud>
  References: <abc123@customer-mail.com> <def456@genesys.cloud>
  Subject: Re: Help with order #5678

→ All three emails are grouped into ONE conversation in Genesys Cloud
→ If the customer changes the subject line, a NEW conversation may be created`}</CodeBlock>
      <CalloutBox type="tip">If customers frequently break email threads (by starting new emails instead of replying), consider using the customer's email address + subject line keywords for routing rather than relying solely on In-Reply-To headers. Architect email flows can use string matching to correlate related emails.</CalloutBox>
    </section>

    {/* T3S4 */}
    <section ref={el => sectionRefs.current['t3s4'] = el} id="t3s4">
      <SectionHeading>Rich Media & Structured Content</SectionHeading>
      <Paragraph>Digital channels support more than plain text. Rich media — cards, carousels, quick reply buttons, images, and files — enables interactive, guided conversations. However, each channel has different capabilities. Sending a carousel to a channel that does not support it results in a graceful fallback (usually plain text).</Paragraph>
      <SubHeading>Channel Capability Matrix</SubHeading>
      <InteractiveTable
        headers={['Content Type', 'Web Msg', 'SMS', 'WhatsApp', 'Facebook', 'Instagram', 'LINE', 'Open Msg', 'Email']}
        rows={RICH_MEDIA_SUPPORT}
      />
      <SubHeading>Structured Content Example (Card)</SubHeading>
      <CodeBlock>{`// Structured content: Card with image and buttons
{
  "contentType": "Structured",
  "content": [{
    "contentType": "Card",
    "title": "Order #12345",
    "description": "Shipped on March 15. Estimated delivery: March 18.",
    "image": "https://cdn.acme.com/tracking-map.png",
    "actions": [
      { "type": "Link", "text": "Track Package", "url": "https://acme.com/track/12345" },
      { "type": "Postback", "text": "Contact Support", "payload": "support_request" }
    ]
  }]
}`}</CodeBlock>
      <SubHeading>Quick Replies</SubHeading>
      <CodeBlock>{`// Quick reply buttons for fast customer selection
{
  "contentType": "QuickReply",
  "quickReplies": [
    { "text": "Check Order Status", "payload": "order_status" },
    { "text": "Return an Item", "payload": "return_item" },
    { "text": "Talk to Agent", "payload": "escalate" }
  ]
}`}</CodeBlock>
      <CalloutBox type="info">When structured content is sent to a channel that does not support it, Genesys Cloud performs automatic fallback rendering. Cards become text with links, carousels become sequential messages, and buttons become numbered text options. Always test how your rich content renders on each target channel.</CalloutBox>
    </section>

    {/* T3S5 */}
    <section ref={el => sectionRefs.current['t3s5'] = el} id="t3s5">
      <SectionHeading>API & Programmatic Management</SectionHeading>
      <Paragraph>The Genesys Cloud API provides complete programmatic control over digital conversations, messaging integrations, and deployment configurations. This enables custom UIs, automated workflows, and external system integrations.</Paragraph>
      <SubHeading>Key API Endpoints</SubHeading>
      <InteractiveTable searchable headers={['Method', 'Endpoint', 'Use']} rows={API_ENDPOINTS.map(e => [e.method, e.path, e.use])} />
      <SubHeading>Real-Time Notifications</SubHeading>
      <Paragraph>Subscribe to notification topics for real-time digital conversation events without polling.</Paragraph>
      <CodeBlock>{`// Conversation-level notifications
v2.conversations.{conversationId}.messages       // New message in conversation
v2.conversations.{conversationId}.participants    // Participant joined/left

// User-level notifications
v2.users.{userId}.conversations                  // Agent's active conversations
v2.users.{userId}.routingStatus                  // Agent routing status changes

// Queue-level notifications
v2.routing.queues.{queueId}.conversations        // New digital interaction in queue

// Analytics
v2.analytics.queues.{queueId}.observations       // Real-time queue stats`}</CodeBlock>
      <SubHeading>Sending a Message via API</SubHeading>
      <CodeBlock>{`// Send an outbound message to an existing conversation
POST /api/v2/conversations/messages/{conversationId}/communications/
     {communicationId}/messages

{
  "textBody": "Your order #12345 has been shipped!",
  "mediaIds": ["attachment-uuid-001"]  // Optional file attachment
}

// Create a new outbound SMS conversation
POST /api/v2/conversations/messages
{
  "toAddress": "+15551234567",
  "toAddressMessengerType": "sms",
  "fromAddress": "+15559876543",
  "useExistingConversation": true,
  "textBody": "Hi Jane, your appointment is confirmed for March 18 at 2:00 PM."
}`}</CodeBlock>
    </section>

    {/* T3S6 */}
    <section ref={el => sectionRefs.current['t3s6'] = el} id="t3s6">
      <SectionHeading>Platform Limits Reference</SectionHeading>
      <InteractiveTable searchable headers={['Resource', 'Limit', 'Notes']} rows={PLATFORM_LIMITS} />
    </section>

    {/* T3S7 */}
    <section ref={el => sectionRefs.current['t3s7'] = el} id="t3s7">
      <SectionHeading>Licensing & Feature Matrix</SectionHeading>
      <Paragraph>Genesys Cloud is available in three license tiers: GC1, GC2, and GC3. Web messaging and email are available on all tiers. Third-party social channels require GC2 or add-on licenses on GC1. AI-powered features require GC3.</Paragraph>
      <InteractiveTable headers={['Feature', 'GC1', 'GC2', 'GC3']} rows={LICENSE_MATRIX} />
      <CalloutBox type="info">
        <strong>License note:</strong> GC1 includes web messaging, email, and Open Messaging API. GC2 adds native social channels (Facebook, Instagram, LINE, SMS). GC3 adds AI capabilities — Predictive Engagement, sentiment analysis, Agent Assist, and speech/text analytics. WhatsApp typically requires an add-on on GC1 and GC2.
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
const GenesysDigitalGuide = ({ onBack, isDark: isDarkProp, setIsDark: setIsDarkProp }) => {
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
            <span className="font-bold text-sm hidden sm:block" style={{ fontFamily: MONO, color: C.green }}>GENESYS DIGITAL GUIDE</span>
            <span className="font-bold text-sm sm:hidden" style={{ fontFamily: MONO, color: C.green }}>GC DIGITAL</span>
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
      <Footer title="Genesys Cloud Digital Messaging & Email — Interactive Knowledge Guide" />
    </div>
  );
};

export default GenesysDigitalGuide;
