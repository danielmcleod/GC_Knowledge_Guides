import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Rocket, Settings, Cpu, Search, ChevronDown, ChevronUp, ChevronRight,
  Menu, X, Phone, Mail, MessageSquare, Bell, RefreshCw, CheckCircle,
  AlertTriangle, AlertCircle, Info, Lightbulb, Star, ExternalLink,
  BookOpen, ArrowRight, ArrowDown, ArrowLeft, Circle, Zap, Shield, Clock, Users,
  FileText, Database, Activity, BarChart3, Target, PhoneCall, Monitor,
  Hash, Layers, Eye, ClipboardList, Volume2, Sun, Moon, GitBranch, Filter,
  Shuffle, UserCheck, Radio, Headphones, Globe, Calendar, Timer, TrendingUp,
  Award, Key, Lock, Unlock, MapPin, Code, Link, Cloud, Package, Webhook,
  Terminal, Server, Plug, ShoppingBag, ToggleLeft, Cpu as CpuIcon
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
const TIER_COLORS = ['#F97316', '#3B82F6'];
const TIER_NAMES = ['Foundations', 'Configuration & Advanced'];
const TIER_SUBTITLES = [
  'The Big Picture — How Genesys Cloud Connects to Everything',
  'Hands-On — Building Integrations, Data Actions, and Automations',
];
const TIER_AUDIENCES = [
  'For everyone — no experience needed',
  'For administrators, developers & architects',
];

// ══════════════════════════════════════════════════════════════
// SECTION METADATA (all tiers)
// ══════════════════════════════════════════════════════════════
const SECTIONS = [
  { tier: 0, id: 't1s1', title: 'What Are Integrations in Genesys Cloud?' },
  { tier: 0, id: 't1s2', title: 'The Building Blocks — Key Components' },
  { tier: 0, id: 't1s3', title: 'Data Actions Explained Simply' },
  { tier: 0, id: 't1s4', title: 'Integration Types Overview' },
  { tier: 0, id: 't1s5', title: 'Key Terminology Glossary' },
  { tier: 1, id: 't2s1', title: 'Prerequisites & OAuth Configuration' },
  { tier: 1, id: 't2s2', title: 'Building Custom Data Actions' },
  { tier: 1, id: 't2s3', title: 'Built-In Integrations — CRM & Popular Platforms' },
  { tier: 1, id: 't2s4', title: 'AWS Lambda & Web Services Integration' },
  { tier: 1, id: 't2s5', title: 'AppFoundry & Premium Applications' },
  { tier: 1, id: 't2s6', title: 'Architect Integration Patterns' },
  { tier: 1, id: 't2s7', title: 'Notification Service & Webhooks' },
  { tier: 1, id: 't2s8', title: 'Platform Limits, Security & Troubleshooting' },
];

// ══════════════════════════════════════════════════════════════
// T1 DATA
// ══════════════════════════════════════════════════════════════
const INTEGRATION_CATEGORIES = [
  { icon: 'Database', label: 'Data Actions', desc: 'REST-based actions that let Architect flows call external APIs in real time' },
  { icon: 'Package', label: 'Premium Apps', desc: 'Turnkey applications from the AppFoundry marketplace with deep platform hooks' },
  { icon: 'Shield', label: 'OAuth Clients', desc: 'Secure authentication credentials that control API access and scopes' },
  { icon: 'ShoppingBag', label: 'AppFoundry', desc: 'Genesys marketplace for pre-built integrations, bots, and add-ons' },
  { icon: 'Globe', label: 'Webhooks', desc: 'HTTP callbacks that push real-time event notifications to external endpoints' },
  { icon: 'Cloud', label: 'AWS Lambda', desc: 'Serverless function execution triggered directly from Architect flows' },
];

const INTEGRATION_MAP_NODES = [
  { id: 'dataActions', label: 'DATA ACTIONS', sub: 'REST API calls', x: 400, y: 60 },
  { id: 'premiumApps', label: 'PREMIUM APPS', sub: 'Marketplace add-ons', x: 130, y: 150 },
  { id: 'oauth', label: 'OAUTH', sub: 'Auth & credentials', x: 670, y: 150 },
  { id: 'appFoundry', label: 'APPFOUNDRY', sub: 'Integration marketplace', x: 80, y: 310 },
  { id: 'webhooks', label: 'WEBHOOKS', sub: 'Event notifications', x: 110, y: 450 },
  { id: 'lambda', label: 'AWS LAMBDA', sub: 'Serverless compute', x: 690, y: 310 },
  { id: 'salesforce', label: 'SALESFORCE', sub: 'CRM connector', x: 720, y: 450 },
  { id: 'customActions', label: 'CUSTOM ACTIONS', sub: 'Your own REST APIs', x: 400, y: 540 },
];
const INTEGRATION_MAP_CENTER = { x: 400, y: 300 };

const INTEGRATION_NODE_TOOLTIPS = {
  dataActions: { explanation: 'Reusable REST API call definitions with typed input/output contracts — the primary way Architect flows communicate with external systems in real time', analogy: 'A pre-addressed, pre-stamped envelope you fill in and send whenever you need an answer' },
  premiumApps: { explanation: 'Full-featured applications built by Genesys or partners that embed directly into the Genesys Cloud UI and extend platform capabilities (e.g., WFM, speech analytics, bots)', analogy: 'Installing a specialized app on your smartphone to add new capabilities' },
  oauth: { explanation: 'OAuth 2.0 client credentials that authenticate API requests — every integration needs an OAuth client with the right scopes to access Genesys Cloud resources', analogy: 'The security badge that gets you into specific rooms in an office building' },
  appFoundry: { explanation: 'The Genesys marketplace where you browse, purchase, and install integrations, premium apps, and partner solutions — like an app store for your contact center', analogy: 'The app store on your phone — browse, install, and manage third-party tools' },
  webhooks: { explanation: 'HTTP POST notifications sent to your external URL whenever specific events occur in Genesys Cloud (conversation started, agent status changed, etc.)', analogy: 'A doorbell that rings at your house whenever something happens at the office' },
  lambda: { explanation: 'AWS Lambda functions invoked directly from Architect flows — execute custom server-side logic without managing infrastructure (data transformation, complex lookups, AI calls)', analogy: 'Hiring a specialist contractor for a specific job — they show up, do the work, and leave' },
  salesforce: { explanation: 'Pre-built CRM connector that syncs customer data, enables screen pops, logs interactions, and provides click-to-dial directly within the Salesforce interface', analogy: 'A two-way bridge between your phone system and your customer database' },
  customActions: { explanation: 'Data actions you build yourself to call any REST API — your own microservices, third-party SaaS platforms, or internal databases via API Gateway', analogy: 'Writing your own letter to anyone, anywhere — complete freedom in what you ask and who you ask' },
};

const INTEGRATION_TYPES = [
  {
    name: 'Built-In CRM Connectors', complexity: 1, best: 'Organizations using Salesforce, Zendesk, or Microsoft Dynamics',
    how: 'Pre-built integrations that provide screen pops, click-to-dial, interaction logging, and customer data sync out of the box. Minimal configuration required — primarily OAuth setup and field mapping.',
  },
  {
    name: 'Data Actions (Web Services)', complexity: 3, best: 'Any custom API integration, CRM lookups, database queries during call flows',
    how: 'You define a REST request template with input/output JSON schemas. Architect flows call these actions during execution, passing dynamic values and receiving structured responses. Supports GET, POST, PUT, PATCH, DELETE.',
  },
  {
    name: 'Premium Apps (AppFoundry)', complexity: 2, best: 'Turnkey solutions — workforce management, quality management, bots, analytics',
    how: 'Browse the AppFoundry marketplace, select an app, and activate it. Premium apps are deeply integrated — they appear in the Genesys Cloud UI, have dedicated admin pages, and may include their own data actions and permissions.',
  },
  {
    name: 'AWS Lambda Data Actions', complexity: 4, best: 'Complex server-side logic, data transformation, AI/ML model calls, multi-step orchestration',
    how: 'Architect flows invoke Lambda functions directly via the Genesys Cloud AWS integration. Lambda receives a JSON payload, executes your code (Node.js, Python, Java, etc.), and returns a JSON response. No API Gateway needed — Genesys invokes Lambda via AWS SDK.',
  },
  {
    name: 'Custom Webhooks & Notifications', complexity: 3, best: 'Real-time event-driven architectures, external alerting, audit logging',
    how: 'Subscribe to Genesys Cloud notification topics and receive HTTP POST callbacks at your endpoint whenever events occur. Supports conversation events, presence changes, routing events, and more.',
  },
];

const DATA_ACTION_LIFECYCLE = [
  { step: 1, title: 'ARCHITECT FLOW TRIGGERS ACTION', desc: 'An Architect flow reaches a "Call Data Action" step during execution. Input variables from the flow are mapped to the action\'s input contract.', color: C.green, icon: 'GitBranch' },
  { step: 2, title: 'INPUT CONTRACT VALIDATION', desc: 'The data action validates the input JSON against its defined schema. Required fields are checked, types are verified. Invalid input causes the action to fail immediately.', color: C.blue, icon: 'Shield' },
  { step: 3, title: 'REQUEST TEMPLATE EXECUTION', desc: 'The validated input populates the request template — URL path parameters, query strings, headers, and request body. The HTTP request is constructed and sent to the target endpoint.', color: C.orange, icon: 'Globe' },
  { step: 4, title: 'EXTERNAL SYSTEM PROCESSES', desc: 'The target API receives the request, processes it (database lookup, computation, third-party call), and returns an HTTP response with status code and JSON body.', color: C.yellow, icon: 'Server' },
  { step: 5, title: 'RESPONSE MAPPING', desc: 'The data action maps the API response JSON to its output contract using JSONPath or translation maps. Only the fields defined in the output schema are extracted.', color: C.purple, icon: 'Filter' },
  { step: 6, title: 'FLOW RECEIVES RESULTS', desc: 'The Architect flow receives the mapped output variables and continues execution — routing decisions, screen pops, variable assignments, or further data actions.', color: C.green, icon: 'CheckCircle' },
];

const GLOSSARY = [
  { term: 'Data Action', def: 'A reusable REST API call definition with typed input/output contracts, callable from Architect flows, scripts, and other platform components', tier: 'Tier 1' },
  { term: 'OAuth Client', def: 'A set of credentials (client ID + secret) used to authenticate API requests — controls which Genesys Cloud resources an integration can access', tier: 'Tier 1' },
  { term: 'Integration', def: 'A configured connection between Genesys Cloud and an external system — can be a CRM connector, data action category, premium app, or custom webhook', tier: 'Tier 1' },
  { term: 'AppFoundry', def: 'The Genesys Cloud marketplace for discovering, purchasing, and installing integrations, premium apps, and partner solutions', tier: 'Tier 1' },
  { term: 'Webhook', def: 'An HTTP POST callback sent to an external URL when a specific event occurs in Genesys Cloud — enables real-time event-driven integrations', tier: 'Tier 1' },
  { term: 'Input Contract', def: 'The JSON schema defining what parameters a data action accepts — field names, types (string, integer, boolean), and required/optional flags', tier: 'Tier 2' },
  { term: 'Output Contract', def: 'The JSON schema defining what data a data action returns to the calling flow — the structured response after API call and response mapping', tier: 'Tier 2' },
  { term: 'Request Template', def: 'The HTTP request configuration within a data action — URL, method, headers, query parameters, and body template with variable substitution', tier: 'Tier 2' },
  { term: 'Response Mapping', def: 'Translation rules that extract specific fields from an API response body and map them to the data action\'s output contract variables', tier: 'Tier 2' },
  { term: 'Premium App', def: 'A deeply integrated application from the AppFoundry that extends Genesys Cloud with embedded UI, dedicated admin pages, and platform-level hooks', tier: 'Tier 1' },
  { term: 'Client Credentials Grant', def: 'OAuth 2.0 flow where an application authenticates with client ID + secret to obtain an access token — used for server-to-server (non-user) integrations', tier: 'Tier 2' },
  { term: 'Authorization Code Grant', def: 'OAuth 2.0 flow where a user logs in via browser redirect to authorize an application — used for user-facing apps that act on behalf of a user', tier: 'Tier 2' },
  { term: 'Implicit Grant', def: 'OAuth 2.0 flow for browser-based single-page apps — token returned directly in the URL fragment without a server-side exchange', tier: 'Tier 2' },
  { term: 'Notification Topic', def: 'A named event channel you subscribe to for real-time notifications (e.g., v2.conversations.{id}.messages for conversation events)', tier: 'Tier 2' },
  { term: 'Scope', def: 'A permission boundary on an OAuth client that limits which API endpoints and operations the client can access (e.g., "analytics:readonly", "routing")', tier: 'Tier 2' },
  { term: 'Lambda Data Action', def: 'A specialized data action type that invokes an AWS Lambda function directly via the Genesys-AWS integration instead of a REST endpoint', tier: 'Tier 2' },
  { term: 'Screen Pop', def: 'Automatic display of customer information to the agent when an interaction arrives — powered by CRM integration data lookups', tier: 'Tier 1' },
];

// ══════════════════════════════════════════════════════════════
// T2 DATA
// ══════════════════════════════════════════════════════════════
const OAUTH_TYPES = [
  { name: 'Client Credentials', desc: 'Server-to-server authentication. No user context. The application authenticates with client ID + secret and receives an access token. Used for backend services, scheduled jobs, data migration scripts, and server-side integrations.', best: 'Backend integrations, cron jobs, API scripts, data sync services', color: C.orange },
  { name: 'Authorization Code', desc: 'User-delegated authentication. A user logs in via browser, authorizes the app, and the app receives a code exchangeable for tokens. The app acts on behalf of the authenticated user. Supports refresh tokens for long-lived sessions.', best: 'Web applications, user-facing portals, admin tools that need user context', color: C.blue },
  { name: 'Implicit Grant', desc: 'Browser-only authentication for single-page applications (SPAs). The access token is returned directly in the URL fragment. No refresh tokens. Token lifetime is short (typically 24 hours). Used when there is no backend server.', best: 'Single-page apps, embedded widgets, client-side-only applications', color: C.purple },
  { name: 'SAML2 Bearer', desc: 'Exchanges a SAML assertion for a Genesys Cloud access token. Used when your identity provider (IdP) already authenticates users via SAML and you need to bridge that authentication into Genesys Cloud API access.', best: 'Enterprise SSO environments, IdP-driven integrations', color: C.green },
];

const OAUTH_SCOPES_COMMON = [
  ['analytics', 'Read/write analytics data, queue observations, conversation details'],
  ['conversations', 'Manage conversations, participants, recordings'],
  ['notifications', 'Subscribe to real-time notification channels and topics'],
  ['routing', 'Manage queues, skills, languages, wrap-up codes, flows'],
  ['users', 'Read/write user profiles, presence, routing status'],
  ['integrations', 'Manage integrations, data actions, credentials'],
  ['architect', 'Manage Architect flows, prompts, schedules'],
  ['telephony', 'Manage phone numbers, SIP trunks, Edge configuration'],
  ['outbound', 'Manage campaigns, contact lists, DNC lists'],
  ['authorization', 'Manage roles, permissions, divisions'],
];

const DATA_ACTION_STEPS = [
  { title: 'Create Integration', detail: 'Go to Admin > Integrations > Add Integration. Select "Web Services Data Actions" for custom REST APIs, or a specific integration type (Salesforce, AWS Lambda, etc.). Name it and set credentials.' },
  { title: 'Define Input Contract', detail: 'Specify the JSON schema for input parameters. Each field has a name, type (STRING, INTEGER, BOOLEAN, NUMBER), and required flag. These become the variables you map in Architect flows.' },
  { title: 'Define Output Contract', detail: 'Specify the JSON schema for output fields. These are the values the flow will receive after the action executes. Keep outputs minimal — only include fields the flow actually needs.' },
  { title: 'Configure Request Template', detail: 'Build the HTTP request: method (GET/POST/PUT/PATCH/DELETE), URL with path parameters, headers (Content-Type, Authorization), query parameters, and request body. Use ${input.fieldName} for variable substitution.' },
  { title: 'Configure Response Mapping', detail: 'Map the API response JSON to your output contract. Use JSONPath expressions ($.data.customer.name) or translation maps to extract values. Handle both success and error response structures.' },
  { title: 'Test & Publish', detail: 'Use the built-in test tool to send sample requests and verify responses. Check error handling paths. Once validated, publish the action to make it available in Architect flows and scripts.' },
];

const CRM_INTEGRATIONS = [
  { name: 'Salesforce', features: ['Embedded softphone in Salesforce UI', 'Automatic screen pop on inbound calls', 'Interaction logging to Salesforce Activity records', 'Click-to-dial from Salesforce contact records', 'Real-time presence sync between platforms', 'Custom attribute mapping for data dips'], color: C.blue },
  { name: 'Zendesk', features: ['Embedded agent workspace widget', 'Automatic ticket creation on new interactions', 'Screen pop with customer ticket history', 'Click-to-dial from Zendesk tickets', 'Status synchronization across platforms', 'Custom field mapping for call data'], color: C.green },
  { name: 'Microsoft Dynamics 365', features: ['Unified agent desktop within Dynamics', 'Customer record screen pop on call arrival', 'Automatic activity/case creation', 'Click-to-dial from Dynamics contact records', 'Presence and status synchronization', 'Custom entity mapping for interaction data'], color: C.purple },
  { name: 'ServiceNow', features: ['OpenFrame integration for embedded telephony', 'Incident creation from inbound interactions', 'Screen pop with caller\'s open incidents', 'Click-to-dial from ServiceNow records', 'Agent state synchronization', 'Custom table mapping for call logging'], color: C.orange },
];

const LAMBDA_CONFIG_STEPS = [
  { setting: 'AWS Account ID', options: 'Your 12-digit AWS account number where Lambda functions are deployed' },
  { setting: 'IAM Role ARN', options: 'The ARN of the IAM role that Genesys Cloud assumes to invoke your Lambda functions (cross-account trust policy required)' },
  { setting: 'Lambda Region', options: 'The AWS region where your Lambda functions are deployed (e.g., us-east-1, eu-west-1)' },
  { setting: 'Function Name', options: 'The name or ARN of the specific Lambda function to invoke for each data action' },
  { setting: 'Timeout', options: 'Maximum execution time before the data action fails. Architect flows have a 40-second limit for data action calls; Lambda timeout should be shorter' },
  { setting: 'Input Payload', options: 'JSON object passed to the Lambda event parameter — matches the data action\'s input contract' },
];

const APPFOUNDRY_CATEGORIES = [
  { name: 'Workforce Engagement', desc: 'Workforce management, quality management, speech analytics, employee scheduling, adherence monitoring', count: '50+', color: C.orange },
  { name: 'Bots & AI', desc: 'Chatbots, voicebots, NLU engines, sentiment analysis, intent recognition, virtual assistants', count: '40+', color: C.blue },
  { name: 'CRM & Data', desc: 'CRM connectors, customer data platforms, data enrichment, screen pop tools, contact management', count: '60+', color: C.green },
  { name: 'Analytics & Reporting', desc: 'Custom dashboards, business intelligence, wallboards, real-time and historical reporting tools', count: '30+', color: C.purple },
  { name: 'Compliance & Security', desc: 'PCI compliance, call recording redaction, data masking, audit logging, consent management', count: '20+', color: C.red },
  { name: 'Automation & Productivity', desc: 'Agent assist, auto-summarization, process automation, knowledge management, scripting tools', count: '35+', color: C.yellow },
];

const ARCHITECT_PATTERNS = [
  {
    title: 'CRM Lookup with Fallback',
    steps: ['Call arrives -> ANI captured from interaction', 'Call Data Action: "LookupCustomerByPhone" -> sends ANI to CRM API', 'IF success AND customer found -> Set screen pop data, set VIP skill if tier = "Enterprise"', 'IF data action fails OR customer not found -> Log warning, continue with default routing (no screen pop)', 'Transfer to ACD with skills and customer context attached'],
  },
  {
    title: 'Multi-Step Data Enrichment',
    steps: ['Call Data Action #1: Look up customer in CRM -> get account ID and tier', 'Call Data Action #2: Query order system with account ID -> get open order count', 'Call Data Action #3: Check billing system -> get outstanding balance', 'Combine all data: set priority based on tier, set skills based on issue type', 'Attach all enrichment data as participant attributes for agent screen pop'],
  },
  {
    title: 'Lambda-Powered Intelligent Routing',
    steps: ['Collect customer input (account number, issue description via speech-to-text)', 'Call Lambda Data Action: send customer data + interaction metadata', 'Lambda runs ML model: predict best queue, skill set, and priority', 'Lambda returns: { queue: "Billing_T2", skills: ["Billing", "Retention"], priority: 3 }', 'Architect applies returned routing instructions dynamically'],
  },
  {
    title: 'Async Callback with External Scheduling',
    steps: ['Customer requests callback via IVR or chat', 'Call Data Action: send callback request to external scheduling API', 'External system checks agent availability across time zones', 'Returns optimal callback time slot to Architect flow', 'Create scheduled callback with returned time, confirm to customer', 'Webhook fires when callback is completed -> update external system'],
  },
];

const NOTIFICATION_TOPICS = [
  { topic: 'v2.conversations.{id}.messages', desc: 'Messages within a specific conversation (new message, typing indicator)', category: 'Conversations' },
  { topic: 'v2.users.{id}.conversations', desc: 'All conversation events for a specific user (new, connected, disconnected)', category: 'Conversations' },
  { topic: 'v2.users.{id}.presence', desc: 'User presence changes (Available, Away, Busy, Offline)', category: 'Presence' },
  { topic: 'v2.users.{id}.routingStatus', desc: 'Agent routing status changes (On Queue, Off Queue, Interacting)', category: 'Routing' },
  { topic: 'v2.routing.queues.{id}.conversations', desc: 'Interactions entering or leaving a specific queue', category: 'Routing' },
  { topic: 'v2.routing.queues.{id}.users', desc: 'Agents joining or leaving a specific queue', category: 'Routing' },
  { topic: 'v2.analytics.queues.{id}.observations', desc: 'Real-time queue statistics updates (waiting count, agents available, SLA)', category: 'Analytics' },
  { topic: 'v2.audits.entityType.{type}', desc: 'Audit trail events for specific entity types (user, queue, flow changes)', category: 'Audit' },
];

const WEBHOOK_CONFIG = [
  ['Endpoint URL', 'The HTTPS URL where Genesys Cloud sends POST requests when events occur. Must be publicly accessible and respond within 10 seconds.'],
  ['Authentication', 'Optional: API key in header, Basic auth, or OAuth bearer token sent with each webhook request for your endpoint to validate authenticity.'],
  ['Event Topics', 'Select which notification topics trigger webhook delivery. Each topic generates a JSON payload with event-specific data.'],
  ['Retry Policy', 'Failed deliveries (non-2xx response or timeout) are retried up to 3 times with exponential backoff. After 3 failures, the webhook is disabled.'],
  ['Payload Format', 'JSON body containing: topicName, eventBody (event-specific data), metadata (timestamp, correlationId). Content-Type: application/json.'],
];

const PLATFORM_LIMITS = [
  ['Integrations per org', '200', 'Across all integration types'],
  ['Data actions per integration', '100', 'Per integration instance'],
  ['Data action timeout (Architect)', '40 seconds', 'Maximum time Architect waits for response'],
  ['Data action input payload', '256 KB', 'Maximum request body size'],
  ['Data action output payload', '256 KB', 'Maximum response body size'],
  ['OAuth clients per org', '500', 'Across all grant types'],
  ['OAuth token lifetime', '24 hours', 'Access tokens expire; use refresh tokens for longer sessions'],
  ['Notification channels per user', '20', 'WebSocket channels for real-time events'],
  ['Notification topics per channel', '1,000', 'Maximum subscriptions per channel'],
  ['Webhook endpoints per org', '50', 'Across all configured webhooks'],
  ['Webhook retry attempts', '3', 'With exponential backoff'],
  ['Lambda timeout (recommended)', '30 seconds', 'Must be less than Architect 40-second limit'],
  ['Premium apps per org', 'Varies', 'Depends on licensing and app availability'],
  ['API rate limit (OAuth)', '300 req/min', 'Per OAuth client; burst up to 600'],
  ['Concurrent data action calls', '60', 'Per org, across all flows executing simultaneously'],
  ['Screen pop data size', '32 KB', 'Maximum participant data for screen pop attributes'],
];

const SECURITY_CHECKLIST = [
  { good: true, text: 'Use the principle of least privilege — grant only the OAuth scopes each integration actually needs' },
  { good: true, text: 'Rotate OAuth client secrets on a regular schedule (every 90 days recommended)' },
  { good: true, text: 'Use separate OAuth clients for each integration — never share credentials between systems' },
  { good: true, text: 'Store client secrets in a secrets manager (AWS Secrets Manager, Azure Key Vault, HashiCorp Vault) — never in code' },
  { good: true, text: 'Enable audit logging for all integration activities and review logs regularly' },
  { good: true, text: 'Use IP allowlisting for webhook endpoints and API clients where possible' },
  { good: false, text: 'Never embed OAuth client secrets in frontend JavaScript or mobile app code' },
  { good: false, text: 'Never use an Admin-scoped OAuth client for a limited-purpose integration' },
  { good: false, text: 'Never disable TLS verification on webhook endpoints — always use valid HTTPS certificates' },
  { good: false, text: 'Never log full API responses containing PII without data masking' },
];

const TROUBLESHOOTING = [
  { symptom: 'Data action returns "timeout" in Architect', investigation: 'Check: Is the external API responding within 40 seconds? -> Test the API endpoint directly with Postman/curl -> Check Lambda function timeout (must be < 40s) -> Check for DNS resolution issues -> Verify the integration\'s credential/OAuth token hasn\'t expired -> Check if the external API has rate limiting that\'s being hit during peak hours -> Enable data action logging for detailed request/response traces.' },
  { symptom: 'OAuth token request fails (401 Unauthorized)', investigation: 'Check: Is the client ID correct? (copy-paste errors are common) -> Has the client secret been rotated without updating the integration? -> Is the OAuth client still active (not deleted or disabled)? -> Are the requested scopes valid and assigned to the client? -> Is the token endpoint URL correct for your region (e.g., login.mypurecloud.com vs login.mypurecloud.de)? -> Check for clock skew on your server.' },
  { symptom: 'Webhook not receiving events', investigation: 'Check: Is the webhook endpoint publicly accessible? (test with curl from outside your network) -> Is the endpoint returning 2xx status within 10 seconds? -> Has the webhook been disabled due to 3 consecutive failures? (re-enable in Admin) -> Are the correct notification topics subscribed? -> Is your firewall allowing inbound HTTPS from Genesys Cloud IP ranges? -> Check webhook delivery logs in Admin > Integrations.' },
  { symptom: 'Salesforce screen pop not appearing', investigation: 'Check: Is the Salesforce integration active and connected? -> Is the OAuth connection between GC and Salesforce valid? -> Is the agent using the embedded Salesforce client (not standalone)? -> Are the screen pop field mappings configured correctly? -> Is the ANI/email matching a Salesforce contact record? -> Check the Salesforce integration logs for errors -> Verify the agent has the correct Salesforce permissions.' },
  { symptom: 'Lambda data action returns error', investigation: 'Check: Is the IAM cross-account trust policy correctly configured? -> Does the IAM role have lambda:InvokeFunction permission? -> Is the Lambda function name/ARN correct in the data action? -> Is the Lambda function in the correct AWS region? -> Check CloudWatch Logs for Lambda execution errors -> Verify the Lambda response format matches the data action output contract -> Check Lambda memory/timeout limits.' },
  { symptom: 'Data action works in test but fails in Architect', investigation: 'Check: Are input variables being mapped correctly in the Architect flow? (Debug mode -> check variable values) -> Is the data action published? (Draft actions don\'t execute in flows) -> Are there null/empty values being sent where the API expects required fields? -> Does the production API have different auth credentials than test? -> Check for flow-level error handling — is the failure branch being taken silently?' },
];

// ══════════════════════════════════════════════════════════════
// SEARCH INDEX
// ══════════════════════════════════════════════════════════════
const SEARCH_INDEX = (() => {
  const idx = [];
  SECTIONS.forEach(s => idx.push({ text: s.title, label: s.title, sectionId: s.id, tier: s.tier, type: 'Section' }));
  INTEGRATION_CATEGORIES.forEach(a => idx.push({ text: `${a.label} ${a.desc}`, label: a.label, sectionId: 't1s1', tier: 0, type: 'Integration Category' }));
  INTEGRATION_MAP_NODES.forEach(n => idx.push({ text: `${n.label} ${n.sub}`, label: n.label, sectionId: 't1s2', tier: 0, type: 'Component' }));
  Object.entries(INTEGRATION_NODE_TOOLTIPS).forEach(([k, v]) => idx.push({ text: `${k} ${v.explanation} ${v.analogy}`, label: k, sectionId: 't1s2', tier: 0, type: 'Component Tooltip' }));
  DATA_ACTION_LIFECYCLE.forEach(s => idx.push({ text: `${s.title} ${s.desc}`, label: s.title, sectionId: 't1s3', tier: 0, type: 'Data Action Step' }));
  INTEGRATION_TYPES.forEach(t => idx.push({ text: `${t.name} ${t.how} ${t.best}`, label: t.name, sectionId: 't1s4', tier: 0, type: 'Integration Type' }));
  GLOSSARY.forEach(g => idx.push({ text: `${g.term} ${g.def}`, label: g.term, sectionId: 't1s5', tier: 0, type: 'Glossary' }));
  OAUTH_TYPES.forEach(o => idx.push({ text: `${o.name} ${o.desc} ${o.best}`, label: o.name, sectionId: 't2s1', tier: 1, type: 'OAuth Type' }));
  OAUTH_SCOPES_COMMON.forEach(([scope, desc]) => idx.push({ text: `${scope} ${desc}`, label: scope, sectionId: 't2s1', tier: 1, type: 'OAuth Scope' }));
  DATA_ACTION_STEPS.forEach(s => idx.push({ text: `${s.title} ${s.detail}`, label: s.title, sectionId: 't2s2', tier: 1, type: 'Data Action' }));
  CRM_INTEGRATIONS.forEach(c => idx.push({ text: `${c.name} ${c.features.join(' ')}`, label: c.name, sectionId: 't2s3', tier: 1, type: 'Integration' }));
  LAMBDA_CONFIG_STEPS.forEach(l => idx.push({ text: `${l.setting} ${l.options}`, label: l.setting, sectionId: 't2s4', tier: 1, type: 'Lambda Config' }));
  APPFOUNDRY_CATEGORIES.forEach(a => idx.push({ text: `${a.name} ${a.desc}`, label: a.name, sectionId: 't2s5', tier: 1, type: 'AppFoundry Category' }));
  ARCHITECT_PATTERNS.forEach(p => idx.push({ text: `${p.title} ${p.steps.join(' ')}`, label: p.title, sectionId: 't2s6', tier: 1, type: 'Architect Pattern' }));
  NOTIFICATION_TOPICS.forEach(n => idx.push({ text: `${n.topic} ${n.desc} ${n.category}`, label: n.topic, sectionId: 't2s7', tier: 1, type: 'Notification Topic' }));
  WEBHOOK_CONFIG.forEach(([label, desc]) => idx.push({ text: `${label} ${desc}`, label: label, sectionId: 't2s7', tier: 1, type: 'Webhook Config' }));
  PLATFORM_LIMITS.forEach(([res, limit, notes]) => idx.push({ text: `${res} ${limit} ${notes}`, label: res, sectionId: 't2s8', tier: 1, type: 'Limit' }));
  SECURITY_CHECKLIST.forEach(s => idx.push({ text: s.text, label: s.text.substring(0, 50), sectionId: 't2s8', tier: 1, type: 'Security' }));
  TROUBLESHOOTING.forEach(t => idx.push({ text: `${t.symptom} ${t.investigation}`, label: t.symptom, sectionId: 't2s8', tier: 1, type: 'Troubleshooting' }));
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
const IntegrationComponentMapSVG = () => {
  const [active, setActive] = useState(null);
  return (
    <div className="my-6 overflow-x-auto">
      <svg viewBox="0 0 800 600" className="w-full" style={{ maxWidth: 800, minWidth: 600 }}>
        <defs>
          <filter id="glow-i"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        {INTEGRATION_MAP_NODES.map(n => (
          <line key={`line-${n.id}`} x1={INTEGRATION_MAP_CENTER.x} y1={INTEGRATION_MAP_CENTER.y} x2={n.x} y2={n.y} stroke={C.border} strokeWidth="2" strokeDasharray="6,4" />
        ))}
        <g>
          <rect x={INTEGRATION_MAP_CENTER.x - 90} y={INTEGRATION_MAP_CENTER.y - 30} width={180} height={60} rx={12} fill={C.bg3} stroke={C.orange} strokeWidth={2} />
          <text x={INTEGRATION_MAP_CENTER.x} y={INTEGRATION_MAP_CENTER.y - 5} textAnchor="middle" fill={C.t1} fontFamily={MONO} fontSize={13} fontWeight="bold">INTEGRATION HUB</text>
          <text x={INTEGRATION_MAP_CENTER.x} y={INTEGRATION_MAP_CENTER.y + 15} textAnchor="middle" fill={C.t3} fontFamily={SANS} fontSize={10}>The connection layer</text>
        </g>
        {INTEGRATION_MAP_NODES.map(n => {
          const isActive = active === n.id;
          const tooltip = INTEGRATION_NODE_TOOLTIPS[n.id];
          return (
            <g key={n.id} className="cursor-pointer" onClick={() => setActive(isActive ? null : n.id)} style={{ transition: 'transform 0.2s' }}>
              <rect x={n.x - 70} y={n.y - 25} width={140} height={50} rx={8} fill={C.bg2} stroke={isActive ? C.orange : C.border} strokeWidth={isActive ? 2 : 1} filter={isActive ? 'url(#glow-i)' : undefined} />
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
      <SectionHeading>What Are Integrations in Genesys Cloud?</SectionHeading>
      <Paragraph>Integrations are the bridges that connect Genesys Cloud to everything else in your technology stack — CRMs, databases, cloud services, AI platforms, workforce tools, and custom applications. Without integrations, your contact center is an island. With them, every customer interaction can be enriched with real-time data, automated workflows, and intelligent routing decisions.</Paragraph>
      <Paragraph>Think of Genesys Cloud as the central nervous system of your contact center. Integrations are the nerve endings that reach out to the rest of the body — pulling in customer records from Salesforce, triggering workflows in ServiceNow, running AI models in AWS Lambda, and pushing event notifications to your monitoring dashboards.</Paragraph>
      <SubHeading>Why Integrations Matter</SubHeading>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        {[
          { title: 'WITHOUT INTEGRATIONS', items: ['Agents manually look up customer info', 'No context when interaction arrives', 'Data lives in silos across systems', 'Manual post-call logging and updates', 'No automation — everything is human-driven'], color: C.red },
          { title: 'WITH INTEGRATIONS', items: ['Automatic screen pop with full customer history', 'Real-time CRM data drives routing decisions', 'Unified data flow across all platforms', 'Auto-logging interactions to CRM and ticketing', 'AI-powered automation via Lambda and data actions'], color: C.orange },
        ].map((panel, i) => (
          <div key={i} className="rounded-lg p-5" style={{ backgroundColor: C.bg2, borderTop: `3px solid ${panel.color}` }}>
            <div className="font-bold mb-3 text-sm" style={{ color: panel.color, fontFamily: MONO }}>{panel.title}</div>
            {panel.items.map((item, j) => <div key={j} className="text-sm mb-1.5" style={{ color: C.t2, fontFamily: SANS }}>{item}</div>)}
          </div>
        ))}
      </div>
      <SubHeading>Integration Categories</SubHeading>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 my-4">
        {INTEGRATION_CATEGORIES.map((ch, i) => (
          <div key={i} className="rounded-lg p-4 flex items-start gap-3 transition-all duration-200 hover:-translate-y-0.5" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
            <Database size={20} style={{ color: C.orange, flexShrink: 0 }} />
            <div><div className="font-semibold text-sm" style={{ color: C.t1, fontFamily: MONO }}>{ch.label}</div><div className="text-xs mt-1" style={{ color: C.t2, fontFamily: SANS }}>{ch.desc}</div></div>
          </div>
        ))}
      </div>
      <CalloutBox type="tip">Every integration in Genesys Cloud — whether a simple webhook or a complex CRM connector — follows the same fundamental pattern: authenticate (OAuth), configure (endpoints and mappings), and connect (activate and test). Master this pattern and you can integrate with anything.</CalloutBox>
    </section>

    {/* T1S2 */}
    <section ref={el => sectionRefs.current['t1s2'] = el} id="t1s2">
      <SectionHeading>The Building Blocks — Key Components</SectionHeading>
      <Paragraph>Genesys Cloud's integration framework is built from several interconnected components. At the center sits the Integration Hub — the platform layer that manages credentials, routes API calls, and orchestrates data flow between Genesys Cloud and external systems. Each component serves a specific role in the overall integration architecture.</Paragraph>
      <CalloutBox type="tip">Click any node in the diagram below to see what it does and a simple analogy.</CalloutBox>
      <IntegrationComponentMapSVG />
      <SubHeading>Component Reference</SubHeading>
      <InteractiveTable
        headers={['Component', 'Simple Explanation', 'Analogy']}
        rows={Object.entries(INTEGRATION_NODE_TOOLTIPS).map(([k, v]) => {
          const node = INTEGRATION_MAP_NODES.find(n => n.id === k);
          return [node?.label || k, v.explanation, v.analogy];
        })}
      />
    </section>

    {/* T1S3 */}
    <section ref={el => sectionRefs.current['t1s3'] = el} id="t1s3">
      <SectionHeading>Data Actions Explained Simply</SectionHeading>
      <Paragraph>Data actions are the workhorses of Genesys Cloud integrations. They are reusable REST API call definitions that let your Architect flows communicate with external systems in real time. When a customer calls in, a data action can look up their account in your CRM, check their order status, verify their identity, or trigger a workflow — all before the call reaches an agent.</Paragraph>
      <Paragraph>Think of a data action as a pre-written letter template. You define the envelope (the API endpoint), the format of the letter (the input contract), and what kind of reply you expect (the output contract). Every time Architect needs to ask an external system a question, it fills in the blanks and sends the letter.</Paragraph>
      <SubHeading>The Data Action Lifecycle</SubHeading>
      <div className="my-6 space-y-0">
        {DATA_ACTION_LIFECYCLE.map((s, i) => (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: s.color + '22', color: s.color, border: `2px solid ${s.color}`, fontFamily: MONO }}>{s.step}</div>
              {i < DATA_ACTION_LIFECYCLE.length - 1 && <div className="w-0.5 flex-1 my-1" style={{ backgroundColor: C.border }} />}
            </div>
            <div className="pb-6 flex-1">
              <div className="font-bold text-sm mb-1" style={{ color: C.t1, fontFamily: MONO }}>{s.title}</div>
              <div className="text-sm" style={{ color: C.t2, fontFamily: SANS }}>{s.desc}</div>
            </div>
          </div>
        ))}
        <div className="flex gap-4 items-center">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: C.green + '22', border: `2px solid ${C.green}` }}>
            <CheckCircle size={16} style={{ color: C.green }} />
          </div>
          <div className="font-bold text-sm" style={{ color: C.green, fontFamily: MONO }}>FLOW CONTINUES WITH ENRICHED DATA</div>
        </div>
      </div>
      <SubHeading>Input / Output Contract Example</SubHeading>
      <CodeBlock>{`// INPUT CONTRACT (what the flow sends)
{
  "phoneNumber": "+15551234567",   // STRING - required
  "lookupType": "customer"         // STRING - required
}

// OUTPUT CONTRACT (what the flow receives back)
{
  "customerId": "CUST-00482",      // STRING
  "customerName": "Jane Smith",    // STRING
  "accountTier": "Enterprise",     // STRING
  "openCases": 3                   // INTEGER
}`}</CodeBlock>
      <CalloutBox type="info">Data actions enforce strict type contracts. If the external API returns a string where the output contract expects an integer, the action will fail. Always align your contracts with the actual API response structure.</CalloutBox>
    </section>

    {/* T1S4 */}
    <section ref={el => sectionRefs.current['t1s4'] = el} id="t1s4">
      <SectionHeading>Integration Types Overview</SectionHeading>
      <Paragraph>Genesys Cloud supports multiple integration approaches, each suited to different use cases and complexity levels. Choosing the right approach depends on your technical requirements, the external system you are connecting to, and the level of customization you need.</Paragraph>
      <div className="my-6 rounded-lg p-4 overflow-x-auto" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
        <div className="flex items-center justify-between mb-2 min-w-[500px]">
          <span className="text-xs font-bold" style={{ color: C.orange, fontFamily: MONO }}>SIMPLE</span>
          <span className="text-xs font-bold" style={{ color: C.purple, fontFamily: MONO }}>ADVANCED</span>
        </div>
        <div className="h-2 rounded-full min-w-[500px]" style={{ background: `linear-gradient(90deg, ${C.orange}, ${C.blue}, ${C.purple})` }} />
        <div className="flex justify-between mt-2 min-w-[500px]">
          {INTEGRATION_TYPES.map((m, i) => <span key={i} className="text-[10px] text-center" style={{ color: C.t3, fontFamily: MONO, width: 90 }}>{m.name.split(' ')[0]}</span>)}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {INTEGRATION_TYPES.map((m, i) => (
          <ExpandableCard key={i} title={m.name} accent={C.orange}>
            <div className="space-y-2">
              <div><strong style={{ color: C.t1 }}>How it works:</strong> {m.how}</div>
              <div className="flex items-center gap-2"><strong style={{ color: C.t1 }}>Complexity:</strong> <StarRating count={m.complexity} /></div>
              <div><strong style={{ color: C.t1 }}>Best for:</strong> {m.best}</div>
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
  const [activeCrmTab, setActiveCrmTab] = useState(0);
  return (
    <div className="space-y-16">
      {/* T2S1 */}
      <section ref={el => sectionRefs.current['t2s1'] = el} id="t2s1">
        <SectionHeading>Prerequisites & OAuth Configuration</SectionHeading>
        <Paragraph>Every integration in Genesys Cloud starts with authentication. OAuth 2.0 is the standard protocol — you create an OAuth client, assign it the required scopes (permissions), and use its credentials to authenticate API requests. Understanding OAuth client types is fundamental to building secure integrations.</Paragraph>
        <SubHeading>OAuth Client Types</SubHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
          {OAUTH_TYPES.map((o, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, borderLeft: `4px solid ${o.color}` }}>
              <div className="font-bold text-sm mb-2" style={{ color: o.color, fontFamily: MONO }}>{o.name}</div>
              <div className="text-sm mb-2" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.6 }}>{o.desc}</div>
              <div className="text-xs p-2 rounded" style={{ backgroundColor: C.bg3, color: C.t3 }}>Best for: {o.best}</div>
            </div>
          ))}
        </div>
        <SubHeading>Common OAuth Scopes</SubHeading>
        <div className="space-y-2 my-3">
          {OAUTH_SCOPES_COMMON.map(([scope, desc], i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-1 p-3 rounded" style={{ backgroundColor: C.bg2 }}>
              <span className="text-xs font-semibold whitespace-nowrap min-w-[140px]" style={{ color: C.orange, fontFamily: MONO }}>{scope}:</span>
              <span className="text-xs" style={{ color: C.t2, fontFamily: SANS }}>{desc}</span>
            </div>
          ))}
        </div>
        <SubHeading>Token Management</SubHeading>
        <CodeBlock>{`// Client Credentials Grant — token request
POST https://login.mypurecloud.com/oauth/token
Content-Type: application/x-www-form-urlencoded
Authorization: Basic base64(clientId:clientSecret)

grant_type=client_credentials

// Response
{
  "access_token": "eyJhbG...",
  "token_type": "bearer",
  "expires_in": 86400      // 24 hours
}

// Use token in API calls
GET https://api.mypurecloud.com/api/v2/users/me
Authorization: Bearer eyJhbG...`}</CodeBlock>
        <CalloutBox type="warning">
          <strong>Security best practice:</strong> Never hardcode OAuth client secrets in source code. Use environment variables or a secrets manager. Rotate secrets every 90 days. Use the minimum required scopes for each integration.
        </CalloutBox>
      </section>

      {/* T2S2 */}
      <section ref={el => sectionRefs.current['t2s2'] = el} id="t2s2">
        <SectionHeading>Building Custom Data Actions</SectionHeading>
        <Paragraph>Custom data actions let you connect Architect flows to any REST API — your own microservices, third-party SaaS platforms, or internal databases via API gateways. Building a data action follows a structured six-step process.</Paragraph>
        <SubHeading>Step-by-Step Process</SubHeading>
        <div className="space-y-3 my-4">
          {DATA_ACTION_STEPS.map((s, i) => (
            <ExpandableCard key={i} title={`${i + 1}. ${s.title}`} accent={C.orange}>
              {s.detail}
            </ExpandableCard>
          ))}
        </div>
        <SubHeading>Request Template Example</SubHeading>
        <CodeBlock>{`// Data Action: LookupCustomerByPhone
// Method: POST
// URL: https://api.yourcrm.com/v2/customers/search

// Headers:
{
  "Content-Type": "application/json",
  "Authorization": "Bearer \${credentials.apiKey}"
}

// Request Body Template:
{
  "query": {
    "phone": "\${input.phoneNumber}",
    "type": "\${input.lookupType}"
  }
}

// Response Mapping (JSONPath):
{
  "translationMap": {
    "customerId": "$.data.id",
    "customerName": "$.data.fullName",
    "accountTier": "$.data.account.tier",
    "openCases": "$.data.cases.openCount"
  }
}`}</CodeBlock>
        <SubHeading>Error Handling</SubHeading>
        <Paragraph>Every data action should handle three failure scenarios: network timeout (external API didn't respond within 40 seconds), HTTP error (4xx/5xx response from the API), and response mapping failure (API returned unexpected structure). In Architect, the "Call Data Action" block has both a Success and Failure output path — always build logic for both.</Paragraph>
        <CalloutBox type="tip">Use the data action's built-in test tool before publishing. Send sample inputs and verify the response mapping. Test with edge cases: empty strings, null values, special characters, and maximum-length inputs.</CalloutBox>
      </section>

      {/* T2S3 */}
      <section ref={el => sectionRefs.current['t2s3'] = el} id="t2s3">
        <SectionHeading>Built-In Integrations — CRM & Popular Platforms</SectionHeading>
        <Paragraph>Genesys Cloud provides pre-built connectors for the most popular CRM and service management platforms. These integrations offer deep, bi-directional connectivity — not just data lookups, but embedded agent experiences, automatic logging, and real-time synchronization.</Paragraph>
        <SubHeading>CRM Connector Details</SubHeading>
        <div className="flex gap-1 mb-3 overflow-x-auto flex-wrap">
          {CRM_INTEGRATIONS.map((t, i) => (
            <button key={i} className="px-3 py-1.5 rounded text-xs whitespace-nowrap cursor-pointer transition-colors" onClick={() => setActiveCrmTab(i)} style={{ backgroundColor: activeCrmTab === i ? t.color : C.bg3, color: activeCrmTab === i ? '#fff' : C.t2, fontFamily: MONO }}>{t.name}</button>
          ))}
        </div>
        <div className="p-4 rounded-lg" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
          <div className="font-bold text-sm mb-3" style={{ color: CRM_INTEGRATIONS[activeCrmTab].color, fontFamily: MONO }}>{CRM_INTEGRATIONS[activeCrmTab].name} Integration Features</div>
          <div className="space-y-2">
            {CRM_INTEGRATIONS[activeCrmTab].features.map((f, i) => (
              <div key={i} className="text-sm flex items-start gap-2" style={{ color: C.t2, fontFamily: SANS }}>
                <CheckCircle size={14} style={{ color: C.green, flexShrink: 0, marginTop: 2 }} />
                {f}
              </div>
            ))}
          </div>
        </div>
        <SubHeading>Common CRM Integration Architecture</SubHeading>
        <div className="my-4 p-4 rounded-lg" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
          {[
            { indent: 0, text: 'INBOUND INTERACTION ARRIVES', color: C.green },
            { indent: 1, text: 'ANI / email / customer ID extracted from interaction', color: C.t3 },
            { indent: 1, text: 'CRM data action: lookup customer by identifier', color: C.blue },
            { indent: 2, text: 'IF customer found in CRM:', color: C.green },
            { indent: 3, text: 'Set participant attributes: name, tier, account number, open cases', color: C.orange },
            { indent: 3, text: 'Set routing skills based on account tier and issue history', color: C.orange },
            { indent: 3, text: 'Screen pop: CRM record opens automatically for agent', color: C.orange },
            { indent: 2, text: 'IF customer NOT found:', color: C.red },
            { indent: 3, text: 'Create new CRM contact record automatically', color: C.t3 },
            { indent: 3, text: 'Route to general queue with "New Customer" flag', color: C.t3 },
            { indent: 1, text: 'POST-INTERACTION: Log call record to CRM (duration, notes, disposition)', color: C.purple },
          ].map((line, i) => (
            <div key={i} className="text-xs" style={{ paddingLeft: line.indent * 20, color: line.color, fontFamily: MONO, marginBottom: 2 }}>{line.text}</div>
          ))}
        </div>
        <CalloutBox type="info">CRM integrations typically require both an OAuth client in Genesys Cloud AND corresponding API credentials in the CRM platform. The Genesys Cloud integration admin page guides you through the bi-directional setup process.</CalloutBox>
      </section>

      {/* T2S4 */}
      <section ref={el => sectionRefs.current['t2s4'] = el} id="t2s4">
        <SectionHeading>AWS Lambda & Web Services Integration</SectionHeading>
        <Paragraph>AWS Lambda data actions let Architect flows execute custom server-side code without managing servers. This is the most powerful integration pattern in Genesys Cloud — your Lambda functions can call any API, run ML models, perform complex data transformations, or orchestrate multi-step workflows that would be impossible in Architect alone.</Paragraph>
        <SubHeading>Lambda Integration Setup</SubHeading>
        <div className="space-y-2 my-4">
          {LAMBDA_CONFIG_STEPS.map((c, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-1 p-3 rounded" style={{ backgroundColor: C.bg2 }}>
              <span className="text-xs font-semibold whitespace-nowrap min-w-[160px]" style={{ color: C.orange, fontFamily: MONO }}>{c.setting}:</span>
              <span className="text-xs" style={{ color: C.t2, fontFamily: SANS }}>{c.options}</span>
            </div>
          ))}
        </div>
        <SubHeading>Lambda Function Example</SubHeading>
        <CodeBlock>{`// Lambda: CustomerEnrichment (Node.js)
exports.handler = async (event) => {
  const { phoneNumber } = event;  // From data action input

  // Look up customer in your database
  const customer = await db.query(
    'SELECT * FROM customers WHERE phone = ?', [phoneNumber]
  );

  // Call external AI for sentiment prediction
  const sentiment = await aiService.predict(customer.recentInteractions);

  // Return structured response matching output contract
  return {
    customerId: customer.id,
    customerName: customer.name,
    accountTier: customer.tier,
    predictedSentiment: sentiment.score,  // 1-10
    recommendedQueue: sentiment.score < 4
      ? 'Retention_Priority'
      : 'Support_Standard'
  };
};`}</CodeBlock>
        <SubHeading>API Gateway & Custom Webhooks</SubHeading>
        <Paragraph>For non-Lambda web services, use the "Web Services Data Actions" integration type. This lets you call any REST API — your own microservices behind AWS API Gateway, Azure Functions exposed via HTTP triggers, Google Cloud Functions, or any third-party SaaS API. The configuration is the same as custom data actions: define input/output contracts, build the request template, and map the response.</Paragraph>
        <CalloutBox type="warning">
          <strong>Timeout planning:</strong> Architect allows 40 seconds max for a data action call. Your Lambda function timeout should be 30 seconds or less to allow for network overhead. If your function needs more time, consider async patterns — trigger Lambda, return immediately, and use a webhook or notification to deliver results later.
        </CalloutBox>
      </section>

      {/* T2S5 */}
      <section ref={el => sectionRefs.current['t2s5'] = el} id="t2s5">
        <SectionHeading>AppFoundry & Premium Applications</SectionHeading>
        <Paragraph>The Genesys AppFoundry is the platform's marketplace — a curated catalog of pre-built integrations, premium applications, and partner solutions. Instead of building everything from scratch, you can browse, evaluate, and activate solutions that are already tested and certified for Genesys Cloud.</Paragraph>
        <SubHeading>AppFoundry Categories</SubHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 my-4">
          {APPFOUNDRY_CATEGORIES.map((cat, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, borderTop: `3px solid ${cat.color}` }}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm" style={{ color: cat.color, fontFamily: MONO }}>{cat.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded" style={{ backgroundColor: cat.color + '22', color: cat.color }}>{cat.count} apps</span>
              </div>
              <div className="text-xs" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.6 }}>{cat.desc}</div>
            </div>
          ))}
        </div>
        <SubHeading>Premium App Lifecycle</SubHeading>
        <div className="flex flex-wrap items-center gap-1 my-4 overflow-x-auto">
          {['Browse AppFoundry', 'Evaluate & Trial', 'Purchase License', 'Install & Activate', 'Configure Settings', 'Assign Permissions', 'Go Live'].map((s, i) => (
            <React.Fragment key={i}>
              <span className="px-3 py-1.5 rounded text-xs whitespace-nowrap" style={{ backgroundColor: C.bg3, color: C.t1, fontFamily: MONO, border: `1px solid ${C.border}` }}>{s}</span>
              {i < 6 && <ArrowRight size={14} style={{ color: C.t3, flexShrink: 0 }} />}
            </React.Fragment>
          ))}
        </div>
        <SubHeading>Billing Models</SubHeading>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
          {[
            { title: 'BYOS (Bring Your Own)', desc: 'Free to install — you bring your own subscription to the partner\'s service. Genesys provides the connector, the partner handles billing separately.', color: C.green },
            { title: 'Premium (Per Agent)', desc: 'Monthly per-agent licensing billed through Genesys. Price varies by app. Appears on your Genesys Cloud invoice alongside platform licenses.', color: C.orange },
            { title: 'Usage-Based', desc: 'Pay per transaction, API call, or minute of usage. Common for AI/bot platforms and analytics tools. Billing through Genesys or the partner directly.', color: C.blue },
          ].map((b, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
              <div className="font-bold text-sm mb-2" style={{ color: b.color, fontFamily: MONO }}>{b.title}</div>
              <div className="text-xs" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.6 }}>{b.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* T2S6 */}
      <section ref={el => sectionRefs.current['t2s6'] = el} id="t2s6">
        <SectionHeading>Architect Integration Patterns</SectionHeading>
        <Paragraph>Architect flows are where integrations come to life. The "Call Data Action" block is your gateway to external systems — but how you structure those calls, handle errors, and combine multiple data sources determines whether your integration is robust or fragile. These patterns represent proven approaches used in production deployments.</Paragraph>
        <div className="space-y-4 my-4">
          {ARCHITECT_PATTERNS.map((p, i) => (
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
        <SubHeading>Error Handling Best Practices</SubHeading>
        <div className="space-y-1 my-3">
          {[
            { good: true, text: 'Always build the Failure output path in "Call Data Action" — never leave it unconnected' },
            { good: true, text: 'Set sensible default values when a data action fails (e.g., default queue, default priority)' },
            { good: true, text: 'Log data action failures to a flow variable for debugging — include the action name and error code' },
            { good: true, text: 'Use "Set Screen Pop" even on failure — show the agent that data lookup failed so they know to ask manually' },
            { good: false, text: 'Never chain 5+ sequential data actions without error handling — one failure cascades to all' },
            { good: false, text: 'Never rely on a data action for critical routing without a fallback queue path' },
            { good: false, text: 'Never assume the external API will always be available — plan for maintenance windows and outages' },
          ].map((p, i) => (
            <div key={i} className="text-xs flex items-start gap-2" style={{ color: p.good ? C.green : C.red, fontFamily: SANS }}>
              <span>{p.good ? 'DO' : 'AVOID'}</span><span style={{ color: C.t2 }}>{p.text}</span>
            </div>
          ))}
        </div>
        <SubHeading>Caching & Performance</SubHeading>
        <Paragraph>Genesys Cloud does not provide built-in data action response caching. If your flow calls the same data action repeatedly (e.g., looking up the same customer in CRM for screen pop AND routing decisions), call the action ONCE early in the flow and store results in flow variables. For high-volume lookups, consider adding a caching layer (Redis, ElastiCache) in front of your API to reduce latency and external system load.</Paragraph>
      </section>

      {/* T2S7 */}
      <section ref={el => sectionRefs.current['t2s7'] = el} id="t2s7">
        <SectionHeading>Notification Service & Webhooks</SectionHeading>
        <Paragraph>The Genesys Cloud Notification Service provides real-time event streaming via WebSocket channels and HTTP webhooks. Instead of polling the API to check "has anything changed?", you subscribe to specific event topics and receive instant notifications when events occur — a conversation starts, an agent changes status, a queue metric crosses a threshold.</Paragraph>
        <SubHeading>Notification Topics</SubHeading>
        <InteractiveTable
          searchable
          headers={['Topic', 'Description', 'Category']}
          rows={NOTIFICATION_TOPICS.map(t => [t.topic, t.desc, t.category])}
        />
        <SubHeading>Webhook Configuration</SubHeading>
        <div className="space-y-2 my-3">
          {WEBHOOK_CONFIG.map(([label, desc], i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-1 p-3 rounded" style={{ backgroundColor: C.bg2 }}>
              <span className="text-xs font-semibold whitespace-nowrap min-w-[140px]" style={{ color: C.orange, fontFamily: MONO }}>{label}:</span>
              <span className="text-xs" style={{ color: C.t2, fontFamily: SANS }}>{desc}</span>
            </div>
          ))}
        </div>
        <SubHeading>WebSocket vs Webhook</SubHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          {[
            { title: 'WEBSOCKET (NOTIFICATION API)', items: ['Persistent bidirectional connection', 'Ultra-low latency (milliseconds)', 'Best for: real-time dashboards, live agent UI', 'Requires persistent client application', 'Channel expires after 24 hours (re-subscribe)'], color: C.blue },
            { title: 'WEBHOOK (HTTP POST)', items: ['Stateless push notifications', 'Low latency (seconds)', 'Best for: event-driven backends, audit logging', 'No persistent connection needed', 'Automatic retries on failure (3 attempts)'], color: C.orange },
          ].map((panel, i) => (
            <div key={i} className="rounded-lg p-5" style={{ backgroundColor: C.bg2, borderTop: `3px solid ${panel.color}` }}>
              <div className="font-bold mb-3 text-sm" style={{ color: panel.color, fontFamily: MONO }}>{panel.title}</div>
              {panel.items.map((item, j) => <div key={j} className="text-sm mb-1.5" style={{ color: C.t2, fontFamily: SANS }}>{item}</div>)}
            </div>
          ))}
        </div>
        <SubHeading>Example: Real-Time Queue Monitor</SubHeading>
        <CodeBlock>{`// 1. Create notification channel
POST /api/v2/notifications/channels
-> Returns: { "connectUri": "wss://streaming.mypurecloud.com/...", "id": "ch-123" }

// 2. Subscribe to queue observations
POST /api/v2/notifications/channels/ch-123/subscriptions
{
  "id": "v2.analytics.queues.{queueId}.observations"
}

// 3. Receive real-time events via WebSocket
{
  "topicName": "v2.analytics.queues.abc-123.observations",
  "eventBody": {
    "group": { "queueId": "abc-123" },
    "data": [
      { "metric": "oInteracting", "stats": { "count": 12 } },
      { "metric": "oWaiting", "stats": { "count": 3 } }
    ]
  }
}`}</CodeBlock>
      </section>

      {/* T2S8 */}
      <section ref={el => sectionRefs.current['t2s8'] = el} id="t2s8">
        <SectionHeading>Platform Limits, Security & Troubleshooting</SectionHeading>
        <SubHeading>Integration Platform Limits</SubHeading>
        <InteractiveTable searchable headers={['Resource', 'Limit', 'Notes']} rows={PLATFORM_LIMITS} />
        <SubHeading>Security Best Practices</SubHeading>
        <div className="space-y-1 my-3">
          {SECURITY_CHECKLIST.map((p, i) => (
            <div key={i} className="text-xs flex items-start gap-2" style={{ color: p.good ? C.green : C.red, fontFamily: SANS }}>
              <span>{p.good ? 'DO' : 'AVOID'}</span><span style={{ color: C.t2 }}>{p.text}</span>
            </div>
          ))}
        </div>
        <SubHeading>Troubleshooting Guide</SubHeading>
        <Paragraph>Click each symptom to reveal the investigation path.</Paragraph>
        <div className="space-y-3 my-4">
          {TROUBLESHOOTING.map((t, i) => (
            <ExpandableCard key={i} title={t.symptom} accent={C.orange}>
              <div className="text-sm" style={{ lineHeight: 1.7 }}>{t.investigation}</div>
            </ExpandableCard>
          ))}
        </div>
      </section>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════
const GenesysIntegrationsGuide = ({ onBack, isDark: isDarkProp, setIsDark: setIsDarkProp }) => {
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
    const icons = [Rocket, Settings];
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
            <span className="font-bold text-sm hidden sm:block" style={{ fontFamily: MONO, color: C.orange }}>GENESYS INTEGRATIONS GUIDE</span>
            <span className="font-bold text-sm sm:hidden" style={{ fontFamily: MONO, color: C.orange }}>GC INTEGRATIONS</span>
          </div>
          <div className="flex items-center gap-1">
            {[0, 1].map(tier => (
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
          {[0, 1].map(tier => (
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
          </div>
        </main>
      </div>

      {/* FOOTER */}
      <Footer title="Genesys Cloud Integrations & Data Actions — Interactive Knowledge Guide" />
    </div>
  );
};

export default GenesysIntegrationsGuide;
