import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Rocket, Settings, Cpu, Search, ChevronDown, ChevronUp, ChevronRight,
  Menu, X, Phone, Mail, MessageSquare, Bell, RefreshCw, CheckCircle,
  AlertTriangle, AlertCircle, Info, Lightbulb, Star, ExternalLink,
  BookOpen, ArrowRight, ArrowDown, ArrowLeft, Circle, Zap, Shield, Clock, Users,
  FileText, Database, Activity, BarChart3, Target, PhoneCall, Monitor,
  Hash, Layers, Eye, ClipboardList, Volume2, Sun, Moon, GitBranch, Filter,
  Shuffle, UserCheck, Radio, Headphones, Globe, Calendar, Timer, TrendingUp,
  Award, Key, Lock, Unlock, MapPin, Code, Terminal, Wifi, Link, Server,
  Package, Send, Repeat, AlertOctagon, Box, Plug
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
const TIER_COLORS = ['#F97316', '#3B82F6'];
const TIER_NAMES = ['Foundations', 'Configuration & Advanced'];
const TIER_SUBTITLES = [
  'The Big Picture — How the Genesys Cloud API Works',
  'Deep Dive — Authentication, SDKs, Events, and Best Practices',
];
const TIER_AUDIENCES = [
  'For everyone — no experience needed',
  'For developers, architects & integrators',
];
const TIER_ICONS_KEYS = ['Rocket', 'Settings'];

// ══════════════════════════════════════════════════════════════
// SECTION METADATA (all tiers)
// ══════════════════════════════════════════════════════════════
const SECTIONS = [
  { tier: 0, id: 't1s1', title: 'What Is the Genesys Cloud API?' },
  { tier: 0, id: 't1s2', title: 'The Building Blocks — Key Components' },
  { tier: 0, id: 't1s3', title: 'Authentication Explained Simply' },
  { tier: 0, id: 't1s4', title: 'Making Your First API Call' },
  { tier: 0, id: 't1s5', title: 'Key Terminology Glossary' },
  { tier: 1, id: 't2s1', title: 'Prerequisites & OAuth Setup' },
  { tier: 1, id: 't2s2', title: 'REST API Patterns' },
  { tier: 1, id: 't2s3', title: 'Client Libraries & SDKs' },
  { tier: 1, id: 't2s4', title: 'Notification Service — Real-Time Events' },
  { tier: 1, id: 't2s5', title: 'Rate Limits & Throttling' },
  { tier: 1, id: 't2s6', title: 'Common API Use Cases' },
  { tier: 1, id: 't2s7', title: 'Webhooks & Event-Driven Architecture' },
  { tier: 1, id: 't2s8', title: 'Platform Limits, Security & Troubleshooting' },
];

// ══════════════════════════════════════════════════════════════
// T1 DATA
// ══════════════════════════════════════════════════════════════
const API_OVERVIEW_PANELS = [
  { title: 'TRADITIONAL ADMIN UI', items: ['Point-and-click configuration', 'One change at a time', 'Manual, repetitive processes', 'No programmatic access', 'Limited to built-in features'], color: C.red },
  { title: 'PLATFORM API (GENESYS CLOUD)', items: ['Full programmatic control over every resource', 'Bulk operations and automation', 'Real-time event streaming via WebSocket', 'Integrate with CRM, WFM, BI, and custom apps', 'Build entirely custom experiences'], color: C.blue },
];

const DEVELOPER_RESOURCES = [
  { icon: 'Code', label: 'API Explorer', desc: 'Interactive browser for every endpoint — test calls directly from the docs with your OAuth token' },
  { icon: 'BookOpen', label: 'Developer Center', desc: 'Guides, tutorials, and getting-started walkthroughs at developer.genesys.cloud' },
  { icon: 'Package', label: 'SDKs', desc: 'Official client libraries for JavaScript, Python, Java, .NET, Go, and more' },
  { icon: 'Terminal', label: 'CLI', desc: 'Command-line interface for scripting and automation of Genesys Cloud operations' },
  { icon: 'Globe', label: 'Developer Forum', desc: 'Community Q&A, best practices, and Genesys engineering support' },
  { icon: 'Zap', label: 'Notification API', desc: 'WebSocket-based real-time event streaming for building reactive integrations' },
];

const API_MAP_NODES = [
  { id: 'rest', label: 'REST API', sub: 'HTTP endpoints', x: 400, y: 60 },
  { id: 'oauth', label: 'OAUTH', sub: 'Authentication layer', x: 130, y: 150 },
  { id: 'sdks', label: 'SDKs', sub: 'Client libraries', x: 670, y: 150 },
  { id: 'notify', label: 'NOTIFICATIONS', sub: 'Real-time events', x: 80, y: 310 },
  { id: 'ratelimits', label: 'RATE LIMITS', sub: 'Throttling controls', x: 110, y: 450 },
  { id: 'webhooks', label: 'WEBHOOKS', sub: 'Event delivery', x: 300, y: 540 },
  { id: 'topics', label: 'EVENT TOPICS', sub: 'Subscription channels', x: 720, y: 310 },
  { id: 'libraries', label: 'CLIENT LIBS', sub: 'Language bindings', x: 690, y: 450 },
];
const API_MAP_CENTER = { x: 400, y: 300 };

const API_NODE_TOOLTIPS = {
  rest: { explanation: 'The core HTTP interface — every Genesys Cloud resource (users, queues, conversations, analytics) is accessible via RESTful endpoints using standard GET/POST/PUT/PATCH/DELETE methods', analogy: 'The front door to a building — every visitor enters through it' },
  oauth: { explanation: 'The authentication and authorization framework that controls who can access the API and what they can do — supports client credentials, implicit, authorization code, and PKCE grant types', analogy: 'The security guard who checks your ID badge before letting you in' },
  sdks: { explanation: 'Pre-built client libraries that wrap the REST API in language-native code — handling authentication, serialization, pagination, and retry logic automatically', analogy: 'A chauffeur who knows all the roads so you don\'t need to navigate yourself' },
  notify: { explanation: 'A WebSocket-based service that pushes real-time events to your application — no polling required. Subscribe to topics and receive instant updates when things change', analogy: 'A news ticker that instantly broadcasts breaking stories instead of making you check the website' },
  ratelimits: { explanation: 'Throttling controls that protect the platform from overload — each org gets a per-second request budget. Exceeding it returns HTTP 429 responses with retry-after headers', analogy: 'A traffic light at a highway on-ramp — controls how fast cars can enter to prevent gridlock' },
  webhooks: { explanation: 'HTTP callbacks that Genesys Cloud sends to YOUR server when specific events occur — no need to maintain a WebSocket connection. Ideal for server-to-server integrations', analogy: 'A doorbell that rings at your house when a package is delivered — you don\'t need to keep checking the porch' },
  topics: { explanation: 'Named channels you subscribe to for receiving specific categories of events — like "conversation started," "user presence changed," or "queue stats updated"', analogy: 'TV channels — you tune in to the ones you care about and ignore the rest' },
  libraries: { explanation: 'The language-specific implementations of the SDK — JavaScript/TypeScript, Python, Java, .NET (C#), Go, iOS, and Android — each idiomatic to its platform', analogy: 'Translations of the same instruction manual into different languages' },
};

const OAUTH_GRANT_TYPES = [
  {
    name: 'Client Credentials', complexity: 1, best: 'Server-to-server automation, backend services, scripts, scheduled jobs',
    analogy: 'A master key for the building — works without a specific person present',
    how: 'Your application authenticates directly with a client ID and client secret. No human user is involved. The token represents the OAuth client itself, not a person. Scopes are defined on the OAuth client configuration.',
    note: 'Never expose client secrets in frontend code or public repositories.',
  },
  {
    name: 'Authorization Code', complexity: 3, best: 'Web applications where a user logs in, server-side apps that need to act on behalf of a user',
    analogy: 'Logging into a website with your personal credentials — the app acts as YOU',
    how: 'User is redirected to the Genesys Cloud login page. After authentication, a temporary authorization code is returned to your redirect URI. Your server exchanges this code (plus client secret) for an access token. The token represents the logged-in user.',
    note: 'Requires a server-side component to securely exchange the authorization code.',
  },
  {
    name: 'Implicit Grant', complexity: 2, best: 'Single-page applications (SPAs), browser-only apps where no server-side component exists',
    analogy: 'A temporary visitor badge handed directly to you at the front desk',
    how: 'User is redirected to Genesys Cloud login. After authentication, the access token is returned directly in the URL fragment (hash). No intermediate code exchange. Token is shorter-lived and cannot be refreshed.',
    note: 'Less secure than Authorization Code — token is exposed in the browser. Use PKCE instead when possible.',
  },
  {
    name: 'PKCE (Proof Key for Code Exchange)', complexity: 3, best: 'Modern SPAs, mobile apps, desktop apps — any public client without a secure backend',
    analogy: 'A lockbox where only you have the combination — even if someone intercepts the key, they can\'t use it',
    how: 'Like Authorization Code, but adds a code_verifier/code_challenge pair. The client generates a random secret (verifier), hashes it (challenge), and sends the challenge with the auth request. On token exchange, the original verifier is sent to prove the same client is redeeming the code.',
    note: 'Recommended over Implicit Grant for all new single-page and mobile applications.',
  },
];

const FIRST_API_CALL_STEPS = [
  { step: 1, title: 'GET AN ACCESS TOKEN', desc: 'Authenticate using your chosen OAuth grant type. For a quick test, use Client Credentials with your client ID and secret.', color: C.green, icon: 'Key' },
  {
    step: 2, title: 'CONSTRUCT THE REQUEST', color: C.blue, icon: 'Code',
    desc: 'Build the HTTP request with the correct method, URL, headers, and body:',
    checks: [
      'Base URL: https://api.{region}.pure.cloud (e.g., api.mypurecloud.com for US East)',
      'Authorization header: Bearer {your_access_token}',
      'Content-Type: application/json (for POST/PUT/PATCH)',
      'Choose the endpoint path from the API Explorer',
    ],
  },
  { step: 3, title: 'SEND THE REQUEST', desc: 'Use curl, Postman, your SDK, or any HTTP client to make the call. Start with a simple GET (read) endpoint like GET /api/v2/users/me to verify your token works.', color: C.orange, icon: 'Send' },
  {
    step: 4, title: 'HANDLE THE RESPONSE', color: C.purple, icon: 'FileText',
    desc: 'Parse the JSON response and check for:',
    checks: [
      '200 OK — Success (GET, PUT, PATCH)',
      '201 Created — Resource created (POST)',
      '204 No Content — Success with no body (DELETE)',
      '400 Bad Request — Malformed request body or parameters',
      '401 Unauthorized — Invalid or expired token',
      '403 Forbidden — Token lacks required permissions/scopes',
      '404 Not Found — Resource does not exist or wrong ID',
      '429 Too Many Requests — Rate limited, check Retry-After header',
    ],
  },
];

const GLOSSARY = [
  { term: 'REST API', def: 'Representational State Transfer API — the HTTP-based interface for reading and writing Genesys Cloud resources using standard HTTP methods', tier: 'Tier 1' },
  { term: 'OAuth 2.0', def: 'The industry-standard authorization framework used by Genesys Cloud to control API access via tokens rather than passwords', tier: 'Tier 1' },
  { term: 'Access Token', def: 'A temporary credential (JWT) returned after OAuth authentication — included in every API request as a Bearer token in the Authorization header', tier: 'Tier 1' },
  { term: 'Scope', def: 'A permission boundary defined on an OAuth client that limits which API operations the resulting token can perform', tier: 'Tier 2' },
  { term: 'SDK', def: 'Software Development Kit — a pre-built library that wraps the REST API in native code for a specific programming language', tier: 'Tier 1' },
  { term: 'Rate Limit', def: 'The maximum number of API requests allowed per second per organization — currently 300 requests/second sustained with burst allowance', tier: 'Tier 2' },
  { term: 'Notification Channel', def: 'A WebSocket connection to the Genesys Cloud Notification Service for receiving real-time event pushes', tier: 'Tier 2' },
  { term: 'Topic', def: 'A named event stream you subscribe to on a notification channel (e.g., v2.users.{id}.presence for user presence changes)', tier: 'Tier 2' },
  { term: 'Webhook', def: 'An HTTP callback — Genesys Cloud sends a POST request to your server when a subscribed event occurs', tier: 'Tier 2' },
  { term: 'Pagination', def: 'The mechanism for retrieving large result sets in pages — controlled by pageSize and pageNumber query parameters', tier: 'Tier 2' },
  { term: 'Expand', def: 'A query parameter that includes related sub-resources in the response to reduce the number of API calls needed', tier: 'Tier 2' },
  { term: 'Idempotency', def: 'The property where making the same API call multiple times produces the same result — important for safe retries on network failures', tier: 'Tier 2' },
  { term: 'Region', def: 'The AWS region hosting your Genesys Cloud organization — determines the API base URL (e.g., mypurecloud.com, mypurecloud.ie, mypurecloud.de)', tier: 'Tier 1' },
  { term: 'Division', def: 'An access control boundary that segments resources (users, queues, flows) within an organization for multi-tenant or departmental isolation', tier: 'Tier 1' },
  { term: 'Data Action', def: 'A configurable REST integration within Architect flows that calls external or internal APIs during interaction processing', tier: 'Tier 2' },
  { term: 'CORS', def: 'Cross-Origin Resource Sharing — browser security mechanism. Genesys Cloud API supports CORS for browser-based SDK usage with proper OAuth configuration', tier: 'Tier 2' },
];

// ══════════════════════════════════════════════════════════════
// T2 DATA
// ══════════════════════════════════════════════════════════════
const OAUTH_CLIENT_TYPES = [
  { type: 'Client Credentials', where: 'Admin > Integrations > OAuth', steps: ['Create OAuth client with "Client Credentials" grant type', 'Assign required scopes (permissions)', 'Record the Client ID and Client Secret', 'Token endpoint: POST /oauth/token with grant_type=client_credentials'], color: C.green },
  { type: 'Code Authorization', where: 'Admin > Integrations > OAuth', steps: ['Create OAuth client with "Code Authorization" grant type', 'Set Authorized Redirect URIs (your app callback URLs)', 'Assign scopes and roles', 'Implement the authorization code flow in your app'], color: C.blue },
  { type: 'Token (Implicit)', where: 'Admin > Integrations > OAuth', steps: ['Create OAuth client with "Token (Implicit)" grant type', 'Set Authorized Redirect URIs', 'Token returned directly in URL fragment', 'Shorter-lived tokens, no refresh capability'], color: C.orange },
];

const SCOPE_CATEGORIES = [
  ['analytics', 'Read/write access to analytics queries and reports'],
  ['architect', 'Manage Architect flows, prompts, schedules'],
  ['authorization', 'Manage roles, permissions, divisions'],
  ['conversations', 'Read/manage active and historical conversations'],
  ['groups', 'Manage user groups and memberships'],
  ['notifications', 'Create channels and subscribe to topics'],
  ['routing', 'Manage queues, skills, languages, wrap-up codes'],
  ['telephony', 'Manage phone configuration, SIP, trunks'],
  ['users', 'Read/manage user profiles, presence, routing status'],
  ['workforce-management', 'Manage schedules, forecasts, adherence'],
];

const REST_PATTERNS = [
  { pattern: 'Pagination', desc: 'Large collections are returned in pages. Use pageSize (max 500, default 25) and pageNumber query parameters. Response includes pageCount, pageSize, pageNumber, and total fields.', example: 'GET /api/v2/users?pageSize=100&pageNumber=1' },
  { pattern: 'Filtering', desc: 'Many endpoints support query-based filtering. Use the search or query endpoints with JSON body filters for complex criteria. Simple endpoints use query params.', example: 'GET /api/v2/routing/queues?name=Support*&sortBy=name' },
  { pattern: 'Expanding', desc: 'Include related sub-resources in a single response using the expand query parameter. Reduces round-trips but increases response size.', example: 'GET /api/v2/users/{userId}?expand=routingStatus,presence' },
  { pattern: 'Sorting', desc: 'Control result ordering with sortBy and sortOrder parameters. Available sort fields vary by endpoint.', example: 'GET /api/v2/routing/queues?sortBy=name&sortOrder=asc' },
  { pattern: 'Error Handling', desc: 'Errors return a JSON body with status, message, messageWithParams, and correlationId. Always log the correlationId for Genesys support troubleshooting.', example: '{ "status": 400, "message": "Invalid value...", "correlationId": "abc-123" }' },
  { pattern: 'Idempotency', desc: 'GET, PUT, and DELETE are idempotent — safe to retry on timeout. POST is NOT idempotent — retrying may create duplicates. Use unique external IDs where possible.', example: 'PUT /api/v2/users/{userId} — safe to retry; POST /api/v2/users — NOT safe' },
];

const SDK_LANGUAGES = [
  { lang: 'JavaScript / TypeScript', pkg: 'purecloud-platform-client-v2', init: `const platformClient = require('purecloud-platform-client-v2');
const client = platformClient.ApiClient.instance;
client.setEnvironment('mypurecloud.com');

// Client Credentials auth
client.loginClientCredentialsGrant(clientId, clientSecret)
  .then(() => {
    const usersApi = new platformClient.UsersApi();
    return usersApi.getUsersMe();
  })
  .then(me => console.log(me.name));`, notes: 'npm install purecloud-platform-client-v2 | Works in Node.js and browser' },
  { lang: 'Python', pkg: 'PureCloudPlatformClientV2', init: `import PureCloudPlatformClientV2
from PureCloudPlatformClientV2.rest import ApiException

api_client = PureCloudPlatformClientV2.api_client.ApiClient()
api_client.host = 'https://api.mypurecloud.com'
api_client.get_client_credentials_token(client_id, client_secret)

users_api = PureCloudPlatformClientV2.UsersApi(api_client)
me = users_api.get_users_me()
print(me.name)`, notes: 'pip install PureCloudPlatformClientV2 | Python 3.x required' },
  { lang: 'Java', pkg: 'com.mypurecloud:platform-client-v2', init: `ApiClient apiClient = ApiClient.Builder.standard()
    .withBasePath("https://api.mypurecloud.com")
    .build();
ApiResponse<AuthResponse> authResponse =
    apiClient.authorizeClientCredentials(clientId, clientSecret);

UsersApi usersApi = new UsersApi();
UserMe me = usersApi.getUsersMe(Collections.emptyList());
System.out.println(me.getName());`, notes: 'Maven/Gradle dependency | Java 8+ required' },
  { lang: '.NET (C#)', pkg: 'PureCloudPlatform.Client.V2', init: `var config = new Configuration();
config.ApiClient.setBasePath("https://api.mypurecloud.com");
config.ApiClient.PostToken("oauth/token",
    new Dictionary<string, string> {
        {"grant_type", "client_credentials"},
        {"client_id", clientId},
        {"client_secret", clientSecret}
    });

var usersApi = new UsersApi(config);
var me = usersApi.GetUsersMe();
Console.WriteLine(me.Name);`, notes: 'NuGet: PureCloudPlatform.Client.V2 | .NET Standard 2.0+' },
  { lang: 'Go', pkg: 'github.com/mypurecloud/platform-client-sdk-go', init: `config := platformclientv2.GetDefaultConfiguration()
config.BasePath = "https://api.mypurecloud.com"
err := config.AuthorizeClientCredentials(clientId, clientSecret)

usersAPI := platformclientv2.NewUsersApi()
me, _, err := usersAPI.GetUsersMe(nil)
fmt.Println(*me.Name)`, notes: 'go get github.com/mypurecloud/platform-client-sdk-go | Go 1.16+' },
];

const NOTIFICATION_TOPICS = [
  { topic: 'v2.users.{userId}.presence', desc: 'User presence changes (Available, Away, Busy, Offline)', category: 'User' },
  { topic: 'v2.users.{userId}.conversations', desc: 'Active conversation updates for a specific user', category: 'User' },
  { topic: 'v2.users.{userId}.routingStatus', desc: 'Agent routing status changes (On Queue, Off Queue)', category: 'User' },
  { topic: 'v2.routing.queues.{queueId}.conversations', desc: 'New or updated interactions in a specific queue', category: 'Routing' },
  { topic: 'v2.routing.queues.{queueId}.users', desc: 'Agent membership changes on a queue', category: 'Routing' },
  { topic: 'v2.analytics.queues.{queueId}.observations', desc: 'Real-time queue observation metrics (waiting count, agents available)', category: 'Analytics' },
  { topic: 'v2.conversations.{conversationId}.transcription', desc: 'Real-time speech transcription events for a conversation', category: 'Conversation' },
  { topic: 'v2.detail.events.conversation.{conversationId}.user.start', desc: 'Conversation participant join events', category: 'Conversation' },
];

const RATE_LIMIT_DETAILS = [
  { header: 'X-Rate-Limit-Count', desc: 'Number of requests made in the current rate limit window' },
  { header: 'X-Rate-Limit-Allowed', desc: 'Maximum requests allowed per window (typically 300/sec org-wide)' },
  { header: 'X-Rate-Limit-Reset', desc: 'Unix timestamp when the current rate limit window resets' },
  { header: 'Retry-After', desc: 'Seconds to wait before retrying (only present on 429 responses)' },
];

const RETRY_STRATEGIES = [
  { name: 'Exponential Backoff', desc: 'Wait 1s, then 2s, then 4s, then 8s between retries. Prevents thundering herd after a rate limit event. Cap at 30-60 seconds.', best: true },
  { name: 'Jitter', desc: 'Add random variation to backoff timing (e.g., 1s +/- 0.5s). Prevents synchronized retry storms when multiple clients hit limits simultaneously.', best: true },
  { name: 'Retry-After Header', desc: 'Always honor the Retry-After header value returned in 429 responses. This is the most accurate wait time from the platform.', best: true },
  { name: 'Fixed Interval Retry', desc: 'Wait a constant N seconds between retries. Simple but can cause synchronized storms. Acceptable only for single-client scenarios.', best: false },
  { name: 'Immediate Retry', desc: 'Retry instantly on failure. NEVER do this — it worsens rate limiting and may get your client blocked.', best: false },
];

const COMMON_USE_CASES = [
  {
    title: 'Bulk User Management',
    steps: ['GET /api/v2/users to list existing users (paginate through all)', 'POST /api/v2/users to create new users in bulk', 'PUT /api/v2/users/{userId}/routingskills/bulk to assign skills', 'PATCH /api/v2/users/{userId} to update user properties', 'POST /api/v2/routing/queues/{queueId}/members to add users to queues'],
  },
  {
    title: 'Queue Configuration Automation',
    steps: ['POST /api/v2/routing/queues to create queues programmatically', 'POST /api/v2/routing/skills to create ACD skills', 'PUT /api/v2/routing/queues/{queueId}/members to manage membership', 'PATCH /api/v2/routing/queues/{queueId} to update queue settings', 'GET /api/v2/routing/queues/{queueId}/estimatedwaittime for real-time EWT'],
  },
  {
    title: 'Analytics & Reporting',
    steps: ['POST /api/v2/analytics/conversations/details/query for conversation history', 'POST /api/v2/analytics/conversations/aggregates/query for aggregate metrics', 'POST /api/v2/analytics/queues/observations/query for real-time queue stats', 'POST /api/v2/analytics/users/details/query for agent performance data', 'Export results to your BI platform (Tableau, Power BI, etc.)'],
  },
  {
    title: 'Conversation Control',
    steps: ['POST /api/v2/conversations/calls to place an outbound call', 'PATCH /api/v2/conversations/{id}/participants/{pid} to update participant (hold, mute)', 'POST /api/v2/conversations/{id}/participants/{pid}/replace to transfer', 'POST /api/v2/conversations/{id}/disconnect to end a conversation', 'GET /api/v2/conversations/{id} to retrieve full conversation details'],
  },
];

const WEBHOOK_CONFIG = [
  { setting: 'Target URL', desc: 'The HTTPS endpoint on YOUR server that will receive POST requests when events fire' },
  { setting: 'Event Topics', desc: 'Which events trigger webhook delivery — same topic namespace as the Notification Service' },
  { setting: 'Authentication', desc: 'Optional shared secret for HMAC signature verification of incoming webhook payloads' },
  { setting: 'Retry Policy', desc: 'Failed deliveries are retried with exponential backoff (1 min, 5 min, 30 min, then hourly for 24 hours)' },
  { setting: 'Timeout', desc: 'Your server must respond within 10 seconds. Timeouts count as delivery failures and trigger retries' },
  { setting: 'Payload Format', desc: 'JSON body containing the event topic, timestamp, event body, and metadata' },
];

const PLATFORM_LIMITS = [
  ['API rate limit (org-wide)', '300 requests/second', 'Sustained rate; burst allowance up to 600/sec briefly'],
  ['Notification channels per token', '20', 'Per OAuth access token'],
  ['Topic subscriptions per channel', '1,000', 'Per notification channel'],
  ['Notification channel lifetime', '24 hours', 'Must reconnect/resubscribe after expiry'],
  ['WebSocket message size', '64 KB', 'Maximum per message frame'],
  ['OAuth token lifetime', '24 hours', 'Client Credentials; user tokens may vary'],
  ['Pagination max page size', '500', 'Most endpoints; some have lower limits'],
  ['Analytics query max interval', '31 days', 'Per single query; use multiple for longer ranges'],
  ['Analytics query max results', '100,000', 'Use pagination and date windowing for more'],
  ['Webhook delivery timeout', '10 seconds', 'Server must respond within this window'],
  ['Webhook retry duration', '24 hours', 'Retries stop after 24 hours of failure'],
  ['Concurrent API connections per org', '600', 'TCP connection limit'],
  ['OAuth clients per org', '500', 'Across all grant types'],
  ['Scopes per OAuth client', '200', 'Maximum assignable scopes'],
  ['API request body size', '256 KB', 'Maximum JSON body for POST/PUT/PATCH'],
  ['Bulk operations batch size', '100-200', 'Varies by endpoint; check documentation'],
];

const SECURITY_PRACTICES = [
  { title: 'Rotate Client Secrets', desc: 'Regenerate OAuth client secrets on a regular schedule (minimum quarterly). Revoke old tokens immediately when secrets change.', icon: 'Key' },
  { title: 'Principle of Least Privilege', desc: 'Assign only the scopes your integration actually needs. Never use a "superuser" OAuth client for simple read-only tasks.', icon: 'Shield' },
  { title: 'Secure Secret Storage', desc: 'Store client secrets in environment variables, vault services (AWS Secrets Manager, Azure Key Vault), or encrypted config — NEVER in source code.', icon: 'Lock' },
  { title: 'Token Validation', desc: 'Validate tokens server-side before processing. Check expiry, issuer, and scopes. Never trust client-supplied tokens without verification.', icon: 'CheckCircle' },
  { title: 'HTTPS Only', desc: 'All API communication must use HTTPS. The platform rejects HTTP connections. Webhook receivers must also have valid TLS certificates.', icon: 'Globe' },
  { title: 'Audit Logging', desc: 'Enable and monitor API audit logs to track who accessed what and when. Set up alerts for unusual patterns (high error rates, unexpected endpoints).', icon: 'Eye' },
];

const TROUBLESHOOTING = [
  { symptom: '401 Unauthorized on every request', investigation: 'Check: Is your access token expired? (tokens last 24 hours) -> Is the token being sent correctly as "Bearer {token}" in the Authorization header? -> Did the OAuth client credentials change? -> Is the OAuth client still active (not deleted)? -> Are you hitting the correct regional API endpoint for your org?' },
  { symptom: '403 Forbidden despite valid token', investigation: 'Check: Does the OAuth client have the required scopes for this endpoint? -> Does the user/client have the necessary role permissions? -> Is the resource in a different Division that the token doesn\'t have access to? -> Check the error body for the specific permission that\'s missing.' },
  { symptom: '429 Too Many Requests', investigation: 'Check: Are you exceeding 300 requests/second org-wide? -> Is another integration consuming your rate budget? -> Are you retrying failed requests too aggressively? -> Implement exponential backoff with jitter. -> Honor the Retry-After header. -> Consider caching responses that don\'t change frequently.' },
  { symptom: 'WebSocket notifications not arriving', investigation: 'Check: Is the notification channel still open? (expires after 24 hours) -> Are your topic subscriptions active? -> Is the topic format correct (e.g., v2.users.{actual-user-id}.presence)? -> Are you sending heartbeat pings to keep the connection alive? -> Check for network/firewall blocking WebSocket connections on port 443.' },
  { symptom: 'SDK authentication failing', investigation: 'Check: Is the SDK configured with the correct region/environment? -> Are client ID and secret correct (no extra whitespace)? -> Is the SDK version up to date? -> Is the OAuth grant type on the client matching what the SDK expects? -> Check proxy/firewall settings if running behind corporate network.' },
  { symptom: 'Webhook events not being delivered', investigation: 'Check: Is your webhook endpoint publicly accessible over HTTPS? -> Does your TLS certificate chain validate correctly? -> Is your server responding within 10 seconds? -> Are the correct event topics subscribed? -> Check webhook delivery logs in the Genesys Cloud admin interface for error details.' },
];

// ══════════════════════════════════════════════════════════════
// SEARCH INDEX
// ══════════════════════════════════════════════════════════════
const SEARCH_INDEX = (() => {
  const idx = [];
  SECTIONS.forEach(s => idx.push({ text: s.title, label: s.title, sectionId: s.id, tier: s.tier, type: 'Section' }));
  DEVELOPER_RESOURCES.forEach(r => idx.push({ text: `${r.label} ${r.desc}`, label: r.label, sectionId: 't1s1', tier: 0, type: 'Developer Resource' }));
  API_MAP_NODES.forEach(n => idx.push({ text: `${n.label} ${n.sub}`, label: n.label, sectionId: 't1s2', tier: 0, type: 'Component' }));
  Object.entries(API_NODE_TOOLTIPS).forEach(([k, v]) => idx.push({ text: `${k} ${v.explanation} ${v.analogy}`, label: k, sectionId: 't1s2', tier: 0, type: 'Component Tooltip' }));
  OAUTH_GRANT_TYPES.forEach(g => idx.push({ text: `${g.name} ${g.how} ${g.best} ${g.analogy}`, label: g.name, sectionId: 't1s3', tier: 0, type: 'OAuth Grant' }));
  FIRST_API_CALL_STEPS.forEach(s => idx.push({ text: `${s.title} ${s.desc} ${(s.checks || []).join(' ')}`, label: s.title, sectionId: 't1s4', tier: 0, type: 'API Step' }));
  GLOSSARY.forEach(g => idx.push({ text: `${g.term} ${g.def}`, label: g.term, sectionId: 't1s5', tier: 0, type: 'Glossary' }));
  OAUTH_CLIENT_TYPES.forEach(o => idx.push({ text: `${o.type} ${o.steps.join(' ')}`, label: o.type, sectionId: 't2s1', tier: 1, type: 'OAuth Client' }));
  SCOPE_CATEGORIES.forEach(([scope, desc]) => idx.push({ text: `${scope} ${desc}`, label: scope, sectionId: 't2s1', tier: 1, type: 'OAuth Scope' }));
  REST_PATTERNS.forEach(p => idx.push({ text: `${p.pattern} ${p.desc} ${p.example}`, label: p.pattern, sectionId: 't2s2', tier: 1, type: 'REST Pattern' }));
  SDK_LANGUAGES.forEach(s => idx.push({ text: `${s.lang} ${s.pkg} ${s.notes}`, label: s.lang, sectionId: 't2s3', tier: 1, type: 'SDK' }));
  NOTIFICATION_TOPICS.forEach(n => idx.push({ text: `${n.topic} ${n.desc} ${n.category}`, label: n.topic, sectionId: 't2s4', tier: 1, type: 'Notification Topic' }));
  RATE_LIMIT_DETAILS.forEach(r => idx.push({ text: `${r.header} ${r.desc}`, label: r.header, sectionId: 't2s5', tier: 1, type: 'Rate Limit Header' }));
  RETRY_STRATEGIES.forEach(r => idx.push({ text: `${r.name} ${r.desc}`, label: r.name, sectionId: 't2s5', tier: 1, type: 'Retry Strategy' }));
  COMMON_USE_CASES.forEach(u => idx.push({ text: `${u.title} ${u.steps.join(' ')}`, label: u.title, sectionId: 't2s6', tier: 1, type: 'Use Case' }));
  WEBHOOK_CONFIG.forEach(w => idx.push({ text: `${w.setting} ${w.desc}`, label: w.setting, sectionId: 't2s7', tier: 1, type: 'Webhook Config' }));
  PLATFORM_LIMITS.forEach(([res, limit, notes]) => idx.push({ text: `${res} ${limit} ${notes}`, label: res, sectionId: 't2s8', tier: 1, type: 'Limit' }));
  SECURITY_PRACTICES.forEach(s => idx.push({ text: `${s.title} ${s.desc}`, label: s.title, sectionId: 't2s8', tier: 1, type: 'Security' }));
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

const ExpandableCard = ({ title, defaultOpen = false, accent = C.blue, children }) => {
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
const APIComponentMapSVG = () => {
  const [active, setActive] = useState(null);
  return (
    <div className="my-6 overflow-x-auto">
      <svg viewBox="0 0 800 600" className="w-full" style={{ maxWidth: 800, minWidth: 600 }}>
        <defs>
          <filter id="glow-a"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        {API_MAP_NODES.map(n => (
          <line key={`line-${n.id}`} x1={API_MAP_CENTER.x} y1={API_MAP_CENTER.y} x2={n.x} y2={n.y} stroke={C.border} strokeWidth="2" strokeDasharray="6,4" />
        ))}
        <g>
          <rect x={API_MAP_CENTER.x - 80} y={API_MAP_CENTER.y - 30} width={160} height={60} rx={12} fill={C.bg3} stroke={C.blue} strokeWidth={2} />
          <text x={API_MAP_CENTER.x} y={API_MAP_CENTER.y - 5} textAnchor="middle" fill={C.t1} fontFamily={MONO} fontSize={13} fontWeight="bold">PLATFORM API</text>
          <text x={API_MAP_CENTER.x} y={API_MAP_CENTER.y + 15} textAnchor="middle" fill={C.t3} fontFamily={SANS} fontSize={10}>The integration hub</text>
        </g>
        {API_MAP_NODES.map(n => {
          const isActive = active === n.id;
          const tooltip = API_NODE_TOOLTIPS[n.id];
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
      <SectionHeading>What Is the Genesys Cloud API?</SectionHeading>
      <Paragraph>The Genesys Cloud Platform API is a comprehensive RESTful interface that exposes every capability of the Genesys Cloud CX platform to developers. Think of it as a universal remote control for your entire contact center: instead of clicking through the admin UI one setting at a time, you can programmatically create users, configure queues, control live conversations, stream analytics, and build entirely custom experiences.</Paragraph>
      <Paragraph>The API follows REST conventions: resources are identified by URLs, manipulated with standard HTTP methods (GET, POST, PUT, PATCH, DELETE), and data is exchanged as JSON. Every action you can take in the Genesys Cloud admin interface has a corresponding API endpoint — and many capabilities are ONLY available via the API.</Paragraph>
      <SubHeading>Why Use the API?</SubHeading>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        {API_OVERVIEW_PANELS.map((panel, i) => (
          <div key={i} className="rounded-lg p-5" style={{ backgroundColor: C.bg2, borderTop: `3px solid ${panel.color}` }}>
            <div className="font-bold mb-3 text-sm" style={{ color: panel.color, fontFamily: MONO }}>{panel.title}</div>
            {panel.items.map((item, j) => <div key={j} className="text-sm mb-1.5" style={{ color: C.t2, fontFamily: SANS }}>{item}</div>)}
          </div>
        ))}
      </div>
      <SubHeading>Developer Resources</SubHeading>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 my-4">
        {DEVELOPER_RESOURCES.map((res, i) => (
          <div key={i} className="rounded-lg p-4 flex items-start gap-3 transition-all duration-200 hover:-translate-y-0.5" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
            <Code size={20} style={{ color: C.blue, flexShrink: 0 }} />
            <div><div className="font-semibold text-sm" style={{ color: C.t1, fontFamily: MONO }}>{res.label}</div><div className="text-xs mt-1" style={{ color: C.t2, fontFamily: SANS }}>{res.desc}</div></div>
          </div>
        ))}
      </div>
      <CalloutBox type="tip">The Genesys Cloud API Explorer (developer.genesys.cloud) lets you browse every endpoint, see request/response schemas, and make live test calls with your OAuth token — all from the browser. It's the fastest way to learn the API.</CalloutBox>
    </section>

    {/* T1S2 */}
    <section ref={el => sectionRefs.current['t1s2'] = el} id="t1s2">
      <SectionHeading>The Building Blocks — Key Components</SectionHeading>
      <Paragraph>The Genesys Cloud Platform API ecosystem is built from several interconnected components. The REST API is the core, but authentication, SDKs, real-time events, and rate limits all play critical roles. Understanding how they connect is essential for building reliable integrations.</Paragraph>
      <CalloutBox type="tip">Click any node in the diagram below to see what it does and a simple analogy.</CalloutBox>
      <APIComponentMapSVG />
      <SubHeading>Component Reference</SubHeading>
      <InteractiveTable
        headers={['Component', 'What It Does', 'Analogy']}
        rows={Object.entries(API_NODE_TOOLTIPS).map(([k, v]) => {
          const node = API_MAP_NODES.find(n => n.id === k);
          return [node?.label || k, v.explanation, v.analogy];
        })}
      />
    </section>

    {/* T1S3 */}
    <section ref={el => sectionRefs.current['t1s3'] = el} id="t1s3">
      <SectionHeading>Authentication Explained Simply</SectionHeading>
      <Paragraph>Every API request must include a valid access token. You get that token by authenticating through OAuth 2.0 — the industry-standard protocol for API authorization. Genesys Cloud supports four OAuth grant types, each designed for a different use case. Choosing the right one is the first decision you'll make when building an integration.</Paragraph>
      <div className="my-6 rounded-lg p-4 overflow-x-auto" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
        <div className="flex items-center justify-between mb-2 min-w-[500px]">
          <span className="text-xs font-bold" style={{ color: C.orange, fontFamily: MONO }}>SIMPLE</span>
          <span className="text-xs font-bold" style={{ color: C.purple, fontFamily: MONO }}>ADVANCED</span>
        </div>
        <div className="h-2 rounded-full min-w-[500px]" style={{ background: `linear-gradient(90deg, ${C.orange}, ${C.blue}, ${C.purple})` }} />
        <div className="flex justify-between mt-2 min-w-[500px]">
          {OAUTH_GRANT_TYPES.map((m, i) => <span key={i} className="text-[10px] text-center" style={{ color: C.t3, fontFamily: MONO, width: 100 }}>{m.name.split(' ').slice(0, 2).join(' ')}</span>)}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {OAUTH_GRANT_TYPES.map((m, i) => (
          <ExpandableCard key={i} title={m.name} accent={C.blue}>
            <div className="space-y-2">
              <div><strong style={{ color: C.t1 }}>How it works:</strong> {m.how}</div>
              <div className="flex items-center gap-2"><strong style={{ color: C.t1 }}>Complexity:</strong> <StarRating count={m.complexity} /></div>
              <div><strong style={{ color: C.t1 }}>Best for:</strong> {m.best}</div>
              <div><strong style={{ color: C.t1 }}>Think of it as:</strong> <em>{m.analogy}</em></div>
              {m.note && <CalloutBox type="warning">{m.note}</CalloutBox>}
            </div>
          </ExpandableCard>
        ))}
      </div>
    </section>

    {/* T1S4 */}
    <section ref={el => sectionRefs.current['t1s4'] = el} id="t1s4">
      <SectionHeading>Making Your First API Call</SectionHeading>
      <Paragraph>Every integration follows the same fundamental pattern: authenticate, build the request, send it, and handle the response. Here's the complete walkthrough.</Paragraph>
      <div className="my-6 space-y-0">
        {FIRST_API_CALL_STEPS.map((s, i) => (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: s.color + '22', color: s.color, border: `2px solid ${s.color}`, fontFamily: MONO }}>{s.step}</div>
              {i < FIRST_API_CALL_STEPS.length - 1 && <div className="w-0.5 flex-1 my-1" style={{ backgroundColor: C.border }} />}
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
      <SubHeading>Quick Start: Client Credentials with curl</SubHeading>
      <CodeBlock>{`# Step 1: Get access token
curl -X POST https://login.mypurecloud.com/oauth/token \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  -d "grant_type=client_credentials&client_id=YOUR_ID&client_secret=YOUR_SECRET"

# Response: { "access_token": "eyJ...", "token_type": "bearer", "expires_in": 86400 }

# Step 2: Call an endpoint
curl https://api.mypurecloud.com/api/v2/users/me \\
  -H "Authorization: Bearer eyJ..."

# Response: { "id": "abc-123", "name": "John Doe", "email": "john@example.com", ... }`}</CodeBlock>
      <CalloutBox type="info">Replace "mypurecloud.com" with your org's region: mypurecloud.ie (EMEA), mypurecloud.de (Frankfurt), mypurecloud.jp (Asia Pacific), mypurecloud.com.au (Australia), usw2.pure.cloud (US West), cac1.pure.cloud (Canada), sae1.pure.cloud (South America).</CalloutBox>
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
  const [activeSdkTab, setActiveSdkTab] = useState(0);
  return (
    <div className="space-y-16">
      {/* T2S1 */}
      <section ref={el => sectionRefs.current['t2s1'] = el} id="t2s1">
        <SectionHeading>Prerequisites & OAuth Setup</SectionHeading>
        <Paragraph>Before making API calls, you need an OAuth client configured in Genesys Cloud. This is the credential that identifies your application and controls what it can access. Think of it as registering your app at the security desk before you can enter the building.</Paragraph>
        <SubHeading>Creating an OAuth Client</SubHeading>
        <div className="space-y-3 my-4">
          {OAUTH_CLIENT_TYPES.map((c, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, borderLeft: `4px solid ${c.color}` }}>
              <div className="font-bold text-sm mb-2" style={{ color: c.color, fontFamily: MONO }}>{c.type}</div>
              <div className="text-xs mb-2" style={{ color: C.t3, fontFamily: SANS }}>{c.where}</div>
              <div className="space-y-1">
                {c.steps.map((s, j) => (
                  <div key={j} className="text-xs flex items-start gap-2" style={{ color: C.t2, fontFamily: SANS }}>
                    <span style={{ color: c.color }}>{j + 1}.</span> {s}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <SubHeading>Scopes — Permission Boundaries</SubHeading>
        <Paragraph>Scopes limit what your OAuth token can do. Each scope maps to a set of API permissions. Assign only the scopes your integration needs — this is the principle of least privilege.</Paragraph>
        <InteractiveTable
          searchable
          headers={['Scope Category', 'What It Controls']}
          rows={SCOPE_CATEGORIES}
        />
        <SubHeading>Token Lifecycle</SubHeading>
        <CodeBlock>{`Token Lifecycle:
  1. Request token  -> POST /oauth/token (Client Credentials)
                    -> or redirect to /oauth/authorize (Auth Code / Implicit)
  2. Token issued   -> access_token valid for 24 hours (86400 seconds)
  3. Use token      -> Include in every request: Authorization: Bearer {token}
  4. Token expires  -> API returns 401 Unauthorized
  5. Re-authenticate -> Request a new token (no refresh tokens for Client Creds)

Note: Auth Code grant supports refresh_token for seamless token renewal
      without requiring the user to log in again.`}</CodeBlock>
        <CalloutBox type="warning"><strong>Secret Management:</strong> Client secrets are shown ONCE when created. Store them immediately in a secure vault. If lost, you must regenerate — which invalidates all existing tokens for that client.</CalloutBox>
      </section>

      {/* T2S2 */}
      <section ref={el => sectionRefs.current['t2s2'] = el} id="t2s2">
        <SectionHeading>REST API Patterns</SectionHeading>
        <Paragraph>The Genesys Cloud API follows consistent patterns across all endpoints. Understanding these patterns means you can work with ANY endpoint effectively, even ones you haven't used before.</Paragraph>
        <div className="space-y-3 my-4">
          {REST_PATTERNS.map((p, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
              <div className="font-semibold text-sm mb-2" style={{ color: C.blue, fontFamily: MONO }}>{p.pattern}</div>
              <div className="text-sm mb-2" style={{ color: C.t2, fontFamily: SANS }}>{p.desc}</div>
              <div className="text-xs p-2 rounded" style={{ backgroundColor: C.bg3, color: 'var(--code-fg)', fontFamily: MONO }}>{p.example}</div>
            </div>
          ))}
        </div>
        <SubHeading>Pagination Example</SubHeading>
        <CodeBlock>{`// Paginate through all users
let pageNumber = 1;
let totalPages = 1;

while (pageNumber <= totalPages) {
  const response = await usersApi.getUsers({
    pageSize: 100,
    pageNumber: pageNumber
  });

  totalPages = response.pageCount;
  const users = response.entities; // Array of user objects

  // Process users...
  console.log(\`Page \${pageNumber}/\${totalPages}: \${users.length} users\`);
  pageNumber++;
}`}</CodeBlock>
        <CalloutBox type="tip">Use the <strong>expand</strong> parameter strategically. Expanding sub-resources reduces API calls but increases response size and latency. Only expand what you actually need. For example, GET /api/v2/users?expand=presence is faster than making separate presence calls for each user.</CalloutBox>
      </section>

      {/* T2S3 */}
      <section ref={el => sectionRefs.current['t2s3'] = el} id="t2s3">
        <SectionHeading>Client Libraries & SDKs</SectionHeading>
        <Paragraph>Genesys provides official SDKs for all major languages. These libraries handle authentication, request construction, response parsing, pagination, and error handling — letting you focus on business logic instead of HTTP plumbing.</Paragraph>
        <div className="flex gap-1 mb-3 overflow-x-auto flex-wrap">
          {SDK_LANGUAGES.map((s, i) => (
            <button key={i} className="px-3 py-1.5 rounded text-xs whitespace-nowrap cursor-pointer transition-colors" onClick={() => setActiveSdkTab(i)} style={{ backgroundColor: activeSdkTab === i ? C.blue : C.bg3, color: activeSdkTab === i ? '#fff' : C.t2, fontFamily: MONO }}>{s.lang}</button>
          ))}
        </div>
        <div className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
          <div className="text-xs mb-2" style={{ color: C.t3, fontFamily: SANS }}>{SDK_LANGUAGES[activeSdkTab].notes}</div>
          <div className="text-xs mb-3 px-2 py-1 rounded inline-block" style={{ backgroundColor: C.bg3, color: C.blue, fontFamily: MONO }}>{SDK_LANGUAGES[activeSdkTab].pkg}</div>
          <CodeBlock>{SDK_LANGUAGES[activeSdkTab].init}</CodeBlock>
        </div>
        <SubHeading>SDK Benefits Over Raw REST</SubHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
          {[
            { title: 'Type Safety', desc: 'SDKs provide typed models for all request/response objects. Catch errors at compile time, not runtime.', color: C.green },
            { title: 'Auto-Retry', desc: 'Built-in retry logic for transient failures (429, 5xx). Exponential backoff with jitter included.', color: C.blue },
            { title: 'Token Management', desc: 'Automatic token refresh and re-authentication. No manual token lifecycle code needed.', color: C.orange },
            { title: 'Pagination Helpers', desc: 'Convenience methods for iterating through paginated results without manual page tracking.', color: C.purple },
          ].map((b, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, borderLeft: `4px solid ${b.color}` }}>
              <div className="font-bold text-sm mb-2" style={{ color: b.color, fontFamily: MONO }}>{b.title}</div>
              <div className="text-xs" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.6 }}>{b.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* T2S4 */}
      <section ref={el => sectionRefs.current['t2s4'] = el} id="t2s4">
        <SectionHeading>Notification Service — Real-Time Events</SectionHeading>
        <Paragraph>The Notification Service provides real-time event streaming over WebSocket connections. Instead of polling the API repeatedly to check for changes (which wastes rate limit budget and introduces latency), you subscribe to topics and receive instant pushes when events occur.</Paragraph>
        <SubHeading>How It Works</SubHeading>
        <div className="my-4 p-4 rounded-lg space-y-2" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
          {[
            '1. Create a notification channel: POST /api/v2/notifications/channels',
            '2. Receive the WebSocket URI in the response (wss://streaming.{region}...)',
            '3. Open a WebSocket connection to that URI',
            '4. Subscribe to topics: POST /api/v2/notifications/channels/{channelId}/subscriptions',
            '5. Receive real-time events as JSON messages on the WebSocket',
            '6. Send periodic pings to keep the connection alive (heartbeat)',
            '7. Reconnect and resubscribe if the connection drops or expires (24 hours)',
          ].map((step, i) => <div key={i} className="text-xs" style={{ color: C.t2, fontFamily: MONO }}>{step}</div>)}
        </div>
        <SubHeading>Common Event Topics</SubHeading>
        <InteractiveTable
          searchable
          headers={['Topic Pattern', 'Description', 'Category']}
          rows={NOTIFICATION_TOPICS.map(t => [t.topic, t.desc, t.category])}
        />
        <SubHeading>WebSocket Connection Example</SubHeading>
        <CodeBlock>{`// Create notification channel
const notificationsApi = new platformClient.NotificationsApi();
const channel = await notificationsApi.postNotificationsChannels();

// Open WebSocket
const ws = new WebSocket(channel.connectUri);

ws.onopen = () => {
  console.log('Connected to notification service');
  // Subscribe to topics
  notificationsApi.postNotificationsChannelSubscriptions(channel.id, [
    { id: 'v2.users.' + userId + '.presence' },
    { id: 'v2.routing.queues.' + queueId + '.conversations' },
  ]);
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.topicName === 'channel.metadata') return; // heartbeat
  console.log('Event:', data.topicName, data.eventBody);
};

ws.onclose = () => console.log('Disconnected — reconnect needed');`}</CodeBlock>
        <CalloutBox type="info"><strong>Heartbeat:</strong> The notification service sends periodic "channel.metadata" messages as heartbeats. If you don't receive one within 30 seconds, assume the connection is stale and reconnect. Your client should also handle WebSocket close events and auto-reconnect with resubscription.</CalloutBox>
      </section>

      {/* T2S5 */}
      <section ref={el => sectionRefs.current['t2s5'] = el} id="t2s5">
        <SectionHeading>Rate Limits & Throttling</SectionHeading>
        <Paragraph>Genesys Cloud enforces rate limits to protect platform stability. Every API response includes rate limit headers so you can monitor your consumption in real time. Exceeding the limit returns HTTP 429 (Too Many Requests) with a Retry-After header.</Paragraph>
        <SubHeading>Rate Limit Headers</SubHeading>
        <div className="space-y-2 my-4">
          {RATE_LIMIT_DETAILS.map((h, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-1 p-3 rounded" style={{ backgroundColor: C.bg2 }}>
              <span className="text-xs font-semibold whitespace-nowrap min-w-[200px]" style={{ color: C.blue, fontFamily: MONO }}>{h.header}:</span>
              <span className="text-xs" style={{ color: C.t2, fontFamily: SANS }}>{h.desc}</span>
            </div>
          ))}
        </div>
        <SubHeading>Burst vs Sustained Limits</SubHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          {[
            { title: 'SUSTAINED RATE', items: ['300 requests per second per org', 'Shared across ALL API clients in the org', 'Applies to all REST API endpoints combined', 'Monitor with X-Rate-Limit-Count header'], color: C.blue },
            { title: 'BURST ALLOWANCE', items: ['Up to ~600 requests/sec briefly', 'For short spikes (e.g., batch startup)', 'Sustained burst will trigger 429s', 'Do not rely on burst for steady-state'], color: C.orange },
          ].map((panel, i) => (
            <div key={i} className="rounded-lg p-5" style={{ backgroundColor: C.bg2, borderTop: `3px solid ${panel.color}` }}>
              <div className="font-bold mb-3 text-sm" style={{ color: panel.color, fontFamily: MONO }}>{panel.title}</div>
              {panel.items.map((item, j) => <div key={j} className="text-sm mb-1.5" style={{ color: C.t2, fontFamily: SANS }}>{item}</div>)}
            </div>
          ))}
        </div>
        <SubHeading>Retry Strategies</SubHeading>
        <div className="space-y-2 my-4">
          {RETRY_STRATEGIES.map((s, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: s.best ? C.green + '22' : C.red + '22' }}>
                {s.best ? <CheckCircle size={12} style={{ color: C.green }} /> : <AlertCircle size={12} style={{ color: C.red }} />}
              </div>
              <div>
                <div className="text-xs font-semibold mb-1" style={{ color: C.t1, fontFamily: MONO }}>{s.name} {s.best ? '' : '(NOT RECOMMENDED)'}</div>
                <div className="text-xs" style={{ color: C.t2, fontFamily: SANS }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <CalloutBox type="warning">Rate limits are org-wide, not per-client. If you have 5 integrations sharing one org, they collectively share the 300 req/sec budget. Coordinate with other development teams and use caching to reduce unnecessary calls.</CalloutBox>
      </section>

      {/* T2S6 */}
      <section ref={el => sectionRefs.current['t2s6'] = el} id="t2s6">
        <SectionHeading>Common API Use Cases</SectionHeading>
        <Paragraph>These are the most common integration patterns built on the Genesys Cloud API. Each represents a real-world automation or integration scenario with the key endpoints involved.</Paragraph>
        <div className="space-y-4 my-4">
          {COMMON_USE_CASES.map((p, i) => (
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
        <SubHeading>Analytics Query Example</SubHeading>
        <CodeBlock>{`// Query conversation details for the last 7 days
const analyticsApi = new platformClient.AnalyticsApi();

const body = {
  interval: '2024-01-01T00:00:00Z/2024-01-07T23:59:59Z',
  order: 'asc',
  orderBy: 'conversationStart',
  paging: { pageSize: 100, pageNumber: 1 },
  segmentFilters: [{
    type: 'and',
    predicates: [{
      type: 'dimension',
      dimension: 'queueId',
      operator: 'matches',
      value: 'your-queue-id-here'
    }]
  }]
};

const result = await analyticsApi.postAnalyticsConversationsDetailsQuery(body);
console.log(\`Found \${result.totalHits} conversations\`);`}</CodeBlock>
      </section>

      {/* T2S7 */}
      <section ref={el => sectionRefs.current['t2s7'] = el} id="t2s7">
        <SectionHeading>Webhooks & Event-Driven Architecture</SectionHeading>
        <Paragraph>Webhooks provide server-to-server event delivery without maintaining persistent WebSocket connections. When a subscribed event occurs, Genesys Cloud sends an HTTP POST to your endpoint. This is ideal for backend microservices, serverless functions (AWS Lambda, Azure Functions), and systems that don't need sub-second latency.</Paragraph>
        <SubHeading>Webhook Configuration</SubHeading>
        <div className="space-y-2 my-4">
          {WEBHOOK_CONFIG.map((c, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-1 p-3 rounded" style={{ backgroundColor: C.bg2 }}>
              <span className="text-xs font-semibold whitespace-nowrap min-w-[140px]" style={{ color: C.blue, fontFamily: MONO }}>{c.setting}:</span>
              <span className="text-xs" style={{ color: C.t2, fontFamily: SANS }}>{c.desc}</span>
            </div>
          ))}
        </div>
        <SubHeading>Webhook vs Notification Service</SubHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          {[
            { title: 'NOTIFICATION SERVICE (WebSocket)', items: ['Real-time, sub-second latency', 'Requires persistent connection', 'Client-side applications', 'Up to 1,000 topic subscriptions', 'Connection expires after 24 hours'], color: C.blue },
            { title: 'WEBHOOKS (HTTP Callback)', items: ['Near-real-time (seconds latency)', 'No persistent connection needed', 'Server-side / serverless architecture', 'Built-in retry on delivery failure', 'Automatic delivery guarantees'], color: C.green },
          ].map((panel, i) => (
            <div key={i} className="rounded-lg p-5" style={{ backgroundColor: C.bg2, borderTop: `3px solid ${panel.color}` }}>
              <div className="font-bold mb-3 text-sm" style={{ color: panel.color, fontFamily: MONO }}>{panel.title}</div>
              {panel.items.map((item, j) => <div key={j} className="text-sm mb-1.5" style={{ color: C.t2, fontFamily: SANS }}>{item}</div>)}
            </div>
          ))}
        </div>
        <SubHeading>Webhook Payload Example</SubHeading>
        <CodeBlock>{`// Incoming webhook POST to your server
{
  "id": "evt-abc-123",
  "topicName": "v2.users.{userId}.presence",
  "version": "2",
  "eventBody": {
    "source": "PURECLOUD",
    "presenceDefinition": {
      "id": "6a3ba928-57b5-4a28-b694-0b1f3d2b0e42",
      "systemPresence": "Available"
    },
    "message": "",
    "modifiedDate": "2024-01-15T10:30:00.000Z"
  },
  "metadata": {
    "CorrelationId": "abc-def-ghi-jkl"
  }
}`}</CodeBlock>
        <CalloutBox type="tip">Always return a 200 OK response to webhook deliveries within 10 seconds. Process the event asynchronously if needed. Non-2xx responses or timeouts trigger retries, and persistent failures will eventually disable the webhook.</CalloutBox>
      </section>

      {/* T2S8 */}
      <section ref={el => sectionRefs.current['t2s8'] = el} id="t2s8">
        <SectionHeading>Platform Limits, Security & Troubleshooting</SectionHeading>
        <SubHeading>Platform Limits Reference</SubHeading>
        <InteractiveTable searchable headers={['Resource', 'Limit', 'Notes']} rows={PLATFORM_LIMITS} />
        <SubHeading>Security Best Practices</SubHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
          {SECURITY_PRACTICES.map((p, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
              <div className="font-semibold text-sm mb-2 flex items-center gap-2" style={{ color: C.t1, fontFamily: MONO }}>
                <Shield size={14} style={{ color: C.blue }} /> {p.title}
              </div>
              <div className="text-xs" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.6 }}>{p.desc}</div>
            </div>
          ))}
        </div>
        <SubHeading>Troubleshooting Guide</SubHeading>
        <Paragraph>Click each symptom to reveal the investigation path.</Paragraph>
        <div className="space-y-3 my-4">
          {TROUBLESHOOTING.map((t, i) => (
            <ExpandableCard key={i} title={t.symptom} accent={C.blue}>
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
const GenesysPlatformAPIGuide = ({ onBack, isDark: isDarkProp, setIsDark: setIsDarkProp }) => {
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
            <span className="font-bold text-sm hidden sm:block" style={{ fontFamily: MONO, color: C.blue }}>GENESYS API GUIDE</span>
            <span className="font-bold text-sm sm:hidden" style={{ fontFamily: MONO, color: C.blue }}>GC API</span>
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
      <footer className="py-8 text-center" style={{ borderTop: `1px solid ${C.border}` }}>
        <div className="text-xs" style={{ color: C.t3, fontFamily: MONO }}>Genesys Cloud Platform API & SDK — Interactive Knowledge Guide</div>
        <div className="text-[10px] mt-1" style={{ color: C.bg4 }}>Built with React * Tailwind CSS * lucide-react</div>
      </footer>
    </div>
  );
};

export default GenesysPlatformAPIGuide;
