import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Rocket, Settings, Cpu, Search, ChevronDown, ChevronUp, ChevronRight,
  Menu, X, Phone, Mail, MessageSquare, Bell, RefreshCw, CheckCircle,
  AlertTriangle, AlertCircle, Info, Lightbulb, Star, ExternalLink,
  BookOpen, ArrowRight, ArrowDown, ArrowLeft, Circle, Zap, Shield, Clock, Users,
  FileText, Database, Activity, BarChart3, Target, PhoneCall, Monitor,
  Hash, Layers, Eye, ClipboardList, Volume2, Sun, Moon, GitBranch, Filter,
  Shuffle, UserCheck, Radio, Headphones, Globe, Calendar, Timer, TrendingUp,
  Award, Key, Lock, Unlock, MapPin, MousePointer, ShoppingCart, Crosshair,
  PieChart, BrainCircuit, Workflow, Send, Code, Link, Gauge
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
  'The Big Picture — Understanding Customer Journeys & Predictive Engagement',
  'Hands-On — Segments, Action Maps, Outcomes, Models & APIs',
];
const TIER_AUDIENCES = [
  'For everyone — no experience needed',
  'For administrators, engineers & power users',
];
const TIER_ICONS_KEYS = ['Rocket', 'Settings'];

// ══════════════════════════════════════════════════════════════
// SECTION METADATA (all tiers)
// ══════════════════════════════════════════════════════════════
const SECTIONS = [
  { tier: 0, id: 't1s1', title: 'What Is Journey Management?' },
  { tier: 0, id: 't1s2', title: 'The Building Blocks — Key Components' },
  { tier: 0, id: 't1s3', title: 'How Predictive Engagement Works' },
  { tier: 0, id: 't1s4', title: 'Use Cases — When to Use Journey Management' },
  { tier: 0, id: 't1s5', title: 'Key Terminology Glossary' },
  { tier: 1, id: 't2s1', title: 'Prerequisites & Setup' },
  { tier: 1, id: 't2s2', title: 'Segments — Defining Customer Groups' },
  { tier: 1, id: 't2s3', title: 'Action Maps — Triggering Engagement' },
  { tier: 1, id: 't2s4', title: 'Outcomes — Measuring Success' },
  { tier: 1, id: 't2s5', title: 'Predictive Models & AI' },
  { tier: 1, id: 't2s6', title: 'Web Event Tracking' },
  { tier: 1, id: 't2s7', title: 'API & Integration' },
  { tier: 1, id: 't2s8', title: 'Platform Limits & Troubleshooting' },
];

// ══════════════════════════════════════════════════════════════
// T1 DATA
// ══════════════════════════════════════════════════════════════
const JOURNEY_PILLARS = [
  { icon: 'Eye', label: 'Visibility', desc: 'See every visitor interaction across your website in real time — page views, clicks, forms, and custom events' },
  { icon: 'Users', label: 'Segmentation', desc: 'Group visitors by behavior, attributes, or visit patterns to identify high-value audiences' },
  { icon: 'Target', label: 'Prediction', desc: 'AI models score visitor likelihood of achieving business outcomes like purchases or sign-ups' },
  { icon: 'Zap', label: 'Action', desc: 'Trigger proactive chat offers, content overlays, or webhooks at the right moment based on real-time signals' },
  { icon: 'BarChart3', label: 'Measurement', desc: 'Track outcome achievement rates, action map effectiveness, and model accuracy with built-in analytics' },
  { icon: 'RefreshCw', label: 'Optimization', desc: 'Continuously refine segments, models, and action maps based on measured results and A/B tests' },
];

const JOURNEY_MAP_NODES = [
  { id: 'segments', label: 'SEGMENTS', sub: 'Visitor groupings', x: 130, y: 120 },
  { id: 'actionMaps', label: 'ACTION MAPS', sub: 'Engagement triggers', x: 670, y: 120 },
  { id: 'outcomes', label: 'OUTCOMES', sub: 'Success metrics', x: 130, y: 310 },
  { id: 'webTracking', label: 'WEB TRACKING', sub: 'JavaScript snippet', x: 670, y: 310 },
  { id: 'proactiveChat', label: 'PROACTIVE CHAT', sub: 'Chat offers', x: 80, y: 480 },
  { id: 'predictiveModel', label: 'PREDICTIVE MODEL', sub: 'AI scoring engine', x: 400, y: 520 },
  { id: 'events', label: 'EVENTS', sub: 'Visitor activity data', x: 720, y: 480 },
  { id: 'analytics', label: 'ANALYTICS', sub: 'Reports & dashboards', x: 400, y: 60 },
];
const JOURNEY_MAP_CENTER = { x: 400, y: 300 };

const JOURNEY_NODE_TOOLTIPS = {
  segments: { explanation: 'Logical groupings of website visitors based on behavior, attributes, or visit patterns — used to target the right audience for engagement actions', analogy: 'Customer lists in a marketing database filtered by purchase history' },
  actionMaps: { explanation: 'Rules that define WHAT action to take (proactive chat, content offer, webhook) and WHEN to trigger it based on segment membership and conditions', analogy: 'A store greeter who approaches customers only when they linger in the electronics aisle' },
  outcomes: { explanation: 'Business goals you want visitors to achieve — like completing a purchase, submitting a form, or visiting a pricing page. Used to measure success and train AI models', analogy: 'The scoreboard that tracks how many shoppers actually bought something' },
  webTracking: { explanation: 'A JavaScript snippet embedded in your website that captures visitor behavior — page views, clicks, form submissions, and custom events — and sends it to Genesys Cloud', analogy: 'Security cameras in a store that track where customers walk and what they look at' },
  proactiveChat: { explanation: 'An automated chat invitation that appears on the visitor\'s screen when conditions are met — offering real-time help before the customer asks for it', analogy: 'A helpful sales associate who approaches you when you look confused in the store' },
  predictiveModel: { explanation: 'A machine learning model that scores each visitor\'s probability of achieving a defined outcome, enabling engagement at the optimal moment', analogy: 'A seasoned salesperson who can tell which customers are serious buyers just by watching their behavior' },
  events: { explanation: 'Individual data points representing visitor actions — page views, button clicks, form field interactions, custom-triggered events — that feed into segments and models', analogy: 'Each footstep and product touch tracked in a retail store' },
  analytics: { explanation: 'Dashboards and reports showing journey performance: action map effectiveness, outcome achievement rates, segment sizes, and model accuracy', analogy: 'The manager\'s daily report showing conversion rates and customer engagement metrics' },
};

const JOURNEY_LIFECYCLE = [
  { step: 1, title: 'VISITOR ARRIVES ON WEBSITE', desc: 'A visitor lands on your website. The Genesys Cloud JavaScript tracking snippet loads and begins capturing behavior — page URL, referrer, UTM parameters, browser, device type, and timestamp.', color: C.green, icon: 'Globe' },
  {
    step: 2, title: 'BEHAVIOR IS TRACKED', color: C.blue, icon: 'Eye',
    desc: 'As the visitor navigates, every action is recorded:',
    checks: [
      'Page views — which pages, in what order, how long on each',
      'Click events — buttons, links, CTAs interacted with',
      'Form interactions — fields focused, filled, submitted',
      'Custom events — fired by your application code for business-specific actions',
      'Scroll depth, idle time, and navigation patterns',
    ],
  },
  { step: 3, title: 'SEGMENT MATCHING', desc: 'The journey engine evaluates the visitor against all active segments in real time. A visitor can match multiple segments simultaneously (e.g., "High-Value Prospect" AND "Visited Pricing Page" AND "Returning Visitor").', color: C.orange, icon: 'Filter' },
  {
    step: 4, title: 'OUTCOME PROBABILITY SCORING', color: C.yellow, icon: 'TrendingUp',
    desc: 'If predictive models are enabled, the AI engine calculates:',
    checks: [
      'Probability of achieving each defined outcome (e.g., 73% likely to purchase)',
      'Score is updated continuously as new behavior data arrives',
      'Confidence threshold determines when the score is actionable',
      'Model considers historical patterns from thousands of previous visitors',
    ],
  },
  { step: 5, title: 'ACTION MAP TRIGGERS', desc: 'When a visitor matches the segment AND conditions of an active action map (and optionally meets a predictive score threshold), the configured action fires — a proactive chat offer appears, a content overlay displays, or a webhook is sent to an external system.', color: C.purple, icon: 'Zap' },
  { step: 6, title: 'VISITOR ENGAGES', desc: 'The visitor accepts the chat offer (routed to an agent via ACD), interacts with the content offer, or the webhook triggers a downstream process. The agent sees full journey context: pages visited, time on site, segment memberships, and outcome scores.', color: C.green, icon: 'MessageSquare' },
  { step: 7, title: 'OUTCOME MEASURED', desc: 'The system tracks whether the visitor achieved the defined outcome (purchase completed, form submitted, etc.). This data feeds back into the predictive model for continuous learning and is reported in journey analytics.', color: C.orange, icon: 'CheckCircle' },
];

const USE_CASES = [
  {
    name: 'Proactive Chat for Sales', complexity: 1, best: 'E-commerce sites, SaaS pricing pages, high-value product pages',
    analogy: 'A sales associate approaching a customer who has been studying a product for several minutes',
    how: 'Configure a segment for visitors on the pricing page for 30+ seconds with 2+ page views. Create an action map that offers a proactive chat: "Have questions about our plans? Chat with us!" Route accepted chats to the Sales queue with journey context attached.',
  },
  {
    name: 'Cart Abandonment Rescue', complexity: 3, best: 'Online retail, subscription services, any checkout flow',
    analogy: 'A cashier noticing a shopper leaving items at the register and offering to help',
    how: 'Define an outcome for "Checkout Completed." Create a segment for visitors who added items to cart but are showing exit intent (idle on checkout page, mouse moving to close tab). Trigger a proactive chat or content offer with a discount code or help offer when outcome probability drops below threshold.',
  },
  {
    name: 'Form Assistance', complexity: 2, best: 'Insurance quotes, loan applications, registration forms, complex multi-step forms',
    analogy: 'A bank employee who notices a customer struggling with a form and walks over to help',
    how: 'Track form field interactions via custom events. Create a segment for visitors who started a form but have been idle for 60+ seconds or have triggered form validation errors. Offer proactive chat: "Need help completing your application?"',
  },
  {
    name: 'Content Personalization', complexity: 2, best: 'Marketing sites, knowledge bases, product catalogs',
    analogy: 'A bookstore that rearranges the front display based on what genres are trending today',
    how: 'Use segments based on visitor behavior (pages viewed, search queries, referral source) to trigger content offer action maps that display personalized banners, recommended articles, or targeted promotions without requiring a chat interaction.',
  },
  {
    name: 'VIP Customer Recognition', complexity: 3, best: 'B2B portals, enterprise accounts, loyalty program members',
    analogy: 'A hotel concierge who recognizes a returning platinum guest and offers premium service',
    how: 'Use authenticated visitor identity (cookie or login) to match against CRM data via external events. Assign VIP visitors to a high-value segment. Trigger immediate proactive chat offers with priority routing to a dedicated agent team. Agent sees full account history in the journey context panel.',
  },
  {
    name: 'Webhook-Driven Orchestration', complexity: 4, best: 'Advanced integrations, multi-system workflows, real-time alerts',
    analogy: 'A smart home system that coordinates lights, thermostat, and music when you walk in the door',
    how: 'Instead of (or in addition to) chat offers, action maps fire webhooks to external systems: update CRM records, trigger marketing automation sequences, send Slack alerts to sales teams, or start outbound campaigns. The webhook payload includes full journey context.',
  },
];

const GLOSSARY = [
  { term: 'Journey', def: 'The complete sequence of interactions a visitor has with your website, tracked from first page view to outcome achievement or session end', tier: 'Tier 1' },
  { term: 'Predictive Engagement', def: 'Genesys Cloud\'s AI-powered feature that uses machine learning to predict visitor outcomes and trigger proactive engagement at optimal moments', tier: 'Tier 1' },
  { term: 'Segment', def: 'A logical grouping of visitors based on shared behavioral patterns, attributes, or visit characteristics — used to target actions', tier: 'Tier 1' },
  { term: 'Action Map', def: 'A configuration that defines WHAT engagement action to take and WHEN to trigger it, based on segment membership and conditions', tier: 'Tier 1' },
  { term: 'Outcome', def: 'A measurable business goal that visitors can achieve — like completing a purchase, signing up, or visiting a key page — used for tracking and model training', tier: 'Tier 1' },
  { term: 'Web Tracking Snippet', def: 'A JavaScript code block embedded in your website that captures visitor behavior and sends it to Genesys Cloud for journey analysis', tier: 'Tier 1' },
  { term: 'Proactive Chat', def: 'An automated chat invitation that appears to website visitors when configured conditions are met, offering real-time agent assistance', tier: 'Tier 1' },
  { term: 'Content Offer', def: 'A visual overlay (banner, modal, toast) displayed to visitors via action maps — used for promotions, announcements, or information without requiring a chat', tier: 'Tier 2' },
  { term: 'Outcome Probability', def: 'An AI-generated score (0-100%) predicting how likely a visitor is to achieve a specific outcome based on their real-time behavior', tier: 'Tier 2' },
  { term: 'Frequency Cap', def: 'A limit on how often an action map can trigger for the same visitor within a time period — prevents over-engagement', tier: 'Tier 2' },
  { term: 'Session', def: 'A single visit to your website by a visitor. A new session starts after 30 minutes of inactivity or when the visitor returns after closing the browser', tier: 'Tier 1' },
  { term: 'External Event', def: 'A custom event sent to Genesys Cloud via API from an external system — used to enrich journey data with CRM, purchase, or support history', tier: 'Tier 2' },
  { term: 'Visitor ID', def: 'A unique identifier assigned to each visitor via a first-party cookie — persists across sessions to build a long-term journey profile', tier: 'Tier 2' },
  { term: 'Customer Cookie', def: 'A first-party cookie set by the tracking snippet to identify returning visitors and maintain journey continuity across sessions', tier: 'Tier 1' },
  { term: 'A/B Testing', def: 'Splitting visitors into control and test groups to compare the effectiveness of predictive engagement against a baseline', tier: 'Tier 2' },
  { term: 'Confidence Threshold', def: 'The minimum outcome probability score required before an action map will trigger — higher thresholds reduce false positives but may miss opportunities', tier: 'Tier 2' },
];

// ══════════════════════════════════════════════════════════════
// T2 DATA
// ══════════════════════════════════════════════════════════════
const PREREQUISITES = [
  { title: 'Web Messaging Deployment', detail: 'A Genesys Cloud web messaging or web chat deployment must be configured and active on your website. This provides the communication channel for proactive chat offers. The deployment generates a JavaScript snippet that must be embedded on every page you want to track. Both Messenger (recommended) and Widget (legacy) deployments are supported.' },
  { title: 'JavaScript Tracking Snippet', detail: 'The Genesys Cloud tracking snippet must be embedded in your website\'s HTML (typically in the <head> tag or via a tag manager like Google Tag Manager). This snippet initializes the journey tracking SDK, captures page views and events, and communicates with the Genesys Cloud backend. It sets a first-party cookie for visitor identification.' },
  { title: 'Journey Licensing', detail: 'Predictive Engagement requires a Genesys Cloud 3 (GC3) license or the Genesys AI Experience add-on for GC1/GC2. Journey tracking (without AI) is available with Genesys Cloud 2+. Web messaging deployment is required and included in GC2+. Check your subscription for feature availability.' },
  { title: 'Permissions & Roles', detail: 'Key permissions: Journey > Event Type > View/Add/Edit for tracking configuration. Journey > Action Map > View/Add/Edit/Delete for action map management. Journey > Outcome > View/Add/Edit/Delete for outcome configuration. Journey > Segment > View/Add/Edit/Delete for segment management. Analytics > Journey Aggregate > View for reporting.' },
];

const SEGMENT_TYPES = [
  { name: 'Behavioral Segments', desc: 'Based on what visitors DO on your site — pages viewed, buttons clicked, forms interacted with, time on page, scroll depth. Example: "Visited pricing page AND spent more than 60 seconds."', color: C.orange, examples: ['Viewed 3+ product pages', 'Clicked "Add to Cart" button', 'Spent 2+ minutes on a single page', 'Scrolled past 75% of the page'] },
  { name: 'Attribute-Based Segments', desc: 'Based on visitor properties — browser type, device, geographic location, referral source, UTM parameters. Example: "Mobile users from Google Ads campaign."', color: C.blue, examples: ['Device = Mobile', 'Referrer contains "google.com"', 'UTM Campaign = "summer-sale"', 'Browser language = "es"'] },
  { name: 'Visit Pattern Segments', desc: 'Based on session-level patterns — number of visits, returning vs. new, visit frequency, days since last visit. Example: "Returning visitor with 3+ previous sessions."', color: C.green, examples: ['Visit count >= 3', 'Returning visitor (has customer cookie)', 'Last visit within 7 days', 'First-time visitor (new session)'] },
  { name: 'Custom Event Segments', desc: 'Based on custom events fired by your application code — login events, purchase history, plan type, account status. Example: "Logged-in user with Enterprise plan."', color: C.purple, examples: ['Custom event: "user_logged_in"', 'Custom attribute: plan = "enterprise"', 'Custom event: "trial_started"', 'Custom attribute: cart_value > 100'] },
];

const ACTION_MAP_TYPES = [
  { name: 'Proactive Chat Offer', desc: 'Displays an automated chat invitation on the visitor\'s screen. If accepted, the chat is routed through ACD to an agent queue with full journey context. The agent sees pages visited, time on site, segment memberships, and outcome scores.', color: C.orange },
  { name: 'Content Offer', desc: 'Displays a visual overlay — banner, modal, or notification toast — on the visitor\'s screen. Used for promotions, announcements, help articles, or discount codes. No agent interaction required.', color: C.blue },
  { name: 'Webhook Action', desc: 'Sends an HTTP POST to an external URL with journey context in the payload. Used for CRM updates, marketing automation triggers, Slack/Teams notifications, or custom integrations.', color: C.green },
];

const ACTION_MAP_CONDITIONS = [
  ['Segment Membership', 'Visitor must be a member of one or more specified segments'],
  ['Page URL Match', 'Current page URL matches a pattern (exact, contains, regex)'],
  ['Visit Duration', 'Visitor has been on the site for at least N seconds'],
  ['Page View Count', 'Visitor has viewed at least N pages in the current session'],
  ['Idle Time', 'Visitor has been idle (no interaction) for N seconds on the current page'],
  ['Outcome Probability', 'Predicted outcome score is above or below a threshold'],
  ['Scroll Depth', 'Visitor has scrolled past a percentage of the page'],
  ['Time on Page', 'Visitor has spent at least N seconds on the current page'],
  ['Schedule', 'Action map only triggers during specified business hours'],
  ['Frequency Cap', 'Maximum number of times the action can trigger per visitor per time window'],
];

const OUTCOME_TYPES = [
  { name: 'Page-Based Outcome', desc: 'Outcome is achieved when a visitor reaches a specific page URL (e.g., "/thank-you", "/order-confirmation", "/signup-complete"). Simplest to configure and most reliable.', example: 'Visitor lands on /checkout/success → "Purchase Completed" outcome achieved', color: C.green },
  { name: 'Event-Based Outcome', desc: 'Outcome is achieved when a specific custom event fires (e.g., "form_submitted", "video_completed", "plan_upgraded"). Requires custom event tracking code on your website.', example: 'Custom event "signup_form_submitted" fires → "Registration Complete" outcome achieved', color: C.blue },
  { name: 'Attribute-Based Outcome', desc: 'Outcome is achieved when a visitor attribute meets a condition (e.g., cart value exceeds threshold, user role changes). Requires attribute tracking via custom events or external events.', example: 'Visitor attribute cart_total > $500 → "High-Value Cart" outcome achieved', color: C.purple },
];

const PREDICTIVE_MODEL_DATA = {
  concepts: [
    { name: 'Outcome Probability Score', desc: 'A real-time score (0-100%) calculated by the ML model predicting how likely the current visitor is to achieve a specific outcome based on their in-session behavior and historical visitor patterns' },
    { name: 'Model Training', desc: 'The predictive model is trained on historical journey data — analyzing behavior patterns of visitors who DID achieve the outcome versus those who did NOT. The model learns which behaviors correlate with success' },
    { name: 'Confidence Threshold', desc: 'The minimum probability score required before the model\'s prediction is considered actionable. A threshold of 70% means the action map only triggers when the model is at least 70% confident the visitor will achieve the outcome' },
    { name: 'A/B Testing', desc: 'Split visitors into test (receive predictive actions) and control (no predictive actions) groups to scientifically measure whether predictive engagement improves outcomes compared to baseline behavior' },
  ],
  requirements: [
    'Minimum 500 outcome achievements for initial model training',
    'Recommended: 3,000+ outcome events for stable model accuracy',
    'At least 30 days of journey data for pattern recognition',
    'Active tracking snippet on all relevant pages',
    'Genesys Cloud AI license (GC3 or AI Experience add-on)',
    'Model retrains automatically as new outcome data accumulates',
  ],
};

const WEB_EVENT_TYPES = [
  { type: 'Page View', auto: true, desc: 'Automatically captured when a visitor navigates to a new page. Includes URL, title, referrer, and timestamp.', code: null },
  { type: 'Click Event', auto: false, desc: 'Custom click tracking for buttons, links, and CTAs. Requires adding tracking attributes or calling the SDK.', code: 'Genesys("command", "journey.trackClick", {\n  targetId: "buy-now-btn",\n  label: "Buy Now Button"\n});' },
  { type: 'Form Interaction', auto: false, desc: 'Track form field focus, input, validation errors, and submission. Useful for identifying form abandonment.', code: 'Genesys("command", "journey.trackForm", {\n  formId: "signup-form",\n  action: "submitted"\n});' },
  { type: 'Custom Event', auto: false, desc: 'Application-specific events fired by your code. Used for business logic like login, add-to-cart, plan selection.', code: 'Genesys("command", "journey.trackCustomEvent", {\n  eventName: "add_to_cart",\n  attributes: {\n    productId: "SKU-12345",\n    price: 49.99\n  }\n});' },
  { type: 'Scroll Depth', auto: true, desc: 'Automatically tracked at 25%, 50%, 75%, and 100% scroll milestones on each page.', code: null },
  { type: 'Idle Detection', auto: true, desc: 'System detects when a visitor stops interacting with the page. Used for triggering engagement after inactivity.', code: null },
];

const API_ENDPOINTS = [
  { method: 'GET', path: '/api/v2/journey/segments', use: 'List all journey segments with their conditions and status' },
  { method: 'POST', path: '/api/v2/journey/segments', use: 'Create a new journey segment with behavioral conditions' },
  { method: 'GET', path: '/api/v2/journey/actionmaps', use: 'List all action maps with trigger conditions and actions' },
  { method: 'POST', path: '/api/v2/journey/actionmaps', use: 'Create a new action map with segment targeting and action type' },
  { method: 'GET', path: '/api/v2/journey/outcomes', use: 'List all defined outcomes with achievement criteria' },
  { method: 'POST', path: '/api/v2/journey/outcomes', use: 'Create a new outcome definition for tracking and prediction' },
  { method: 'GET', path: '/api/v2/journey/sessions/{sessionId}', use: 'Get details of a specific visitor session including events and pages' },
  { method: 'POST', path: '/api/v2/journey/sessions/{sessionId}/events', use: 'Post an external event to a visitor session (enrich journey data)' },
  { method: 'GET', path: '/api/v2/journey/actionmaps/{actionMapId}/estimates', use: 'Get estimated reach for an action map before activation' },
  { method: 'GET', path: '/api/v2/analytics/journey/aggregates/query', use: 'Query aggregate journey analytics (outcomes, actions, segments)' },
  { method: 'POST', path: '/api/v2/externalcontacts/contacts', use: 'Link an identified visitor to an external contact for cross-channel journey' },
  { method: 'GET', path: '/api/v2/journey/views/{viewId}', use: 'Retrieve a saved journey analytics view with filters and date range' },
];

const PLATFORM_LIMITS = [
  ['Segments per org', '200', 'Active and inactive combined'],
  ['Action maps per org', '200', 'Active and inactive combined'],
  ['Outcomes per org', '50', ''],
  ['Custom event types', '200', 'Per org'],
  ['Custom attributes per event', '50', 'Key-value pairs'],
  ['Events per session', '10,000', 'Soft limit — sessions with more events may be truncated'],
  ['Session duration max', '24 hours', 'Sessions automatically close after 24h of continuous activity'],
  ['Session inactivity timeout', '30 minutes', 'New session starts after 30 min idle'],
  ['Cookie persistence', '13 months', 'First-party visitor cookie duration'],
  ['Journey data retention', '13 months', 'Historical session data availability'],
  ['Proactive chat concurrent offers', '1 per visitor', 'Only one active chat offer at a time'],
  ['Content offer display limit', '1 per action map per page', 'Prevents duplicate overlays'],
  ['Webhook timeout', '5 seconds', 'Action map webhook response timeout'],
  ['Webhook payload max', '256 KB', 'Per webhook request body'],
  ['Predictive model training minimum', '500 outcomes', 'Minimum achieved outcomes for model training'],
  ['A/B test minimum duration', '14 days', 'Recommended for statistical significance'],
  ['External events per session', '200', 'Via API injection'],
  ['Page URL pattern length', '2,048 characters', 'Max URL length in segment/action map conditions'],
];

const TROUBLESHOOTING = [
  { symptom: 'Tracking snippet not capturing events', investigation: 'Check: Is the JavaScript snippet correctly embedded on the page? (View page source, search for "Genesys") → Is the snippet loading without console errors? (Browser DevTools > Console) → Is the deployment ID correct in the snippet? → Are ad blockers or privacy extensions blocking the tracking requests? (Check Network tab for blocked requests to apps.mypurecloud.com) → Is the web messaging deployment active and published? → Is the domain whitelisted in the deployment\'s allowed origins?' },
  { symptom: 'Action map not triggering', investigation: 'Check: Is the action map status set to "Active"? → Does the visitor match the required segment? (Journey > Visitors view to confirm segment membership) → Are all conditions met simultaneously? (segment + page + time + frequency cap) → Has the frequency cap been reached for this visitor? → Is the schedule condition allowing triggers at the current time? → Is there a conflicting action map with higher priority that is triggering instead? → For proactive chat: is the web messaging deployment online and are agents available in the target queue?' },
  { symptom: 'Visitor not matching expected segment', investigation: 'Check: Are the segment conditions correct? (Review each condition — page URL patterns, event names, attribute values) → Is the tracking snippet firing the expected events? (Browser DevTools > Network tab, filter for journey events) → For custom events: is the event name exactly matching (case-sensitive)? → Is the visitor using a browser that blocks cookies (segment history requires cookie persistence)? → Has the visitor\'s session expired (30 min inactivity starts a new session)?' },
  { symptom: 'Predictive model not generating scores', investigation: 'Check: Are there enough achieved outcomes for model training? (Minimum 500 required) → Is the outcome definition correct and actively being achieved by visitors? → Is the AI license active? → Has the model had enough time to train? (Initial training can take 24-48 hours after meeting the data threshold) → Are there sufficient behavioral features in the journey data? (Model needs diverse visitor patterns to learn from)' },
  { symptom: 'Proactive chat offer not routing to agent', investigation: 'Check: Is the configured queue active with available agents? → Does the queue have web messaging / chat media enabled? → Is the Architect inbound message flow assigned and published? → Are agents in "On Queue" status with available chat capacity? → Is the web messaging deployment correctly linked to the inbound flow? → Check if the visitor accepted the offer (analytics show offer displayed vs. accepted rates).' },
  { symptom: 'Journey analytics showing no data', investigation: 'Check: Is the tracking snippet deployed and loading correctly? → Is the time range in the analytics view correct? → Do you have the required analytics permissions? (Analytics > Journey Aggregate > View) → Is the deployment ID matching between the snippet and the org? → Are there active visitors on the site? (Check real-time visitor count in Journey > Visitors) → Allow 15-30 minutes for analytics aggregation after initial deployment.' },
];

// ══════════════════════════════════════════════════════════════
// SEARCH INDEX
// ══════════════════════════════════════════════════════════════
export const SEARCH_INDEX = (() => {
  const idx = [];
  SECTIONS.forEach(s => idx.push({ text: s.title, label: s.title, sectionId: s.id, tier: s.tier, type: 'Section' }));
  JOURNEY_PILLARS.forEach(p => idx.push({ text: `${p.label} ${p.desc}`, label: p.label, sectionId: 't1s1', tier: 0, type: 'Journey Pillar' }));
  JOURNEY_LIFECYCLE.forEach(s => idx.push({ text: `${s.title} ${s.desc} ${(s.checks || []).join(' ')}`, label: s.title, sectionId: 't1s3', tier: 0, type: 'Journey Lifecycle' }));
  USE_CASES.forEach(u => idx.push({ text: `${u.name} ${u.best} ${u.analogy} ${u.how}`, label: u.name, sectionId: 't1s4', tier: 0, type: 'Use Case' }));
  GLOSSARY.forEach(g => idx.push({ text: `${g.term} ${g.def}`, label: g.term, sectionId: 't1s5', tier: 0, type: 'Glossary' }));
  PREREQUISITES.forEach(p => idx.push({ text: `${p.title} ${p.detail}`, label: p.title, sectionId: 't2s1', tier: 1, type: 'Prerequisite' }));
  SEGMENT_TYPES.forEach(s => idx.push({ text: `${s.name} ${s.desc} ${s.examples.join(' ')}`, label: s.name, sectionId: 't2s2', tier: 1, type: 'Segment' }));
  ACTION_MAP_TYPES.forEach(a => idx.push({ text: `${a.name} ${a.desc}`, label: a.name, sectionId: 't2s3', tier: 1, type: 'Action Map' }));
  ACTION_MAP_CONDITIONS.forEach(c => idx.push({ text: `${c[0]} ${c[1]}`, label: c[0], sectionId: 't2s3', tier: 1, type: 'Action Map Condition' }));
  OUTCOME_TYPES.forEach(o => idx.push({ text: `${o.name} ${o.desc} ${o.example}`, label: o.name, sectionId: 't2s4', tier: 1, type: 'Outcome' }));
  PREDICTIVE_MODEL_DATA.concepts.forEach(c => idx.push({ text: `${c.name} ${c.desc}`, label: c.name, sectionId: 't2s5', tier: 1, type: 'Predictive Model' }));
  PREDICTIVE_MODEL_DATA.requirements.forEach(r => idx.push({ text: r, label: r.split('.')[0].split('—')[0].trim(), sectionId: 't2s5', tier: 1, type: 'Model Requirement' }));
  WEB_EVENT_TYPES.forEach(e => idx.push({ text: `${e.type} ${e.desc} ${e.code || ''}`, label: e.type, sectionId: 't2s6', tier: 1, type: 'Web Event' }));
  API_ENDPOINTS.forEach(a => idx.push({ text: `${a.method} ${a.path} ${a.use}`, label: `${a.method} ${a.path}`, sectionId: 't2s7', tier: 1, type: 'API Endpoint' }));
  PLATFORM_LIMITS.forEach(l => idx.push({ text: `${l[0]} ${l[1]} ${l[2]}`, label: l[0], sectionId: 't2s8', tier: 1, type: 'Limit' }));
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
const JourneyComponentMapSVG = () => {
  const [active, setActive] = useState(null);
  return (
    <div className="my-6 overflow-x-auto">
      <svg viewBox="0 0 800 600" className="w-full" style={{ maxWidth: 800, minWidth: 600 }}>
        <defs>
          <filter id="glow-j"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        {JOURNEY_MAP_NODES.map(n => (
          <line key={`line-${n.id}`} x1={JOURNEY_MAP_CENTER.x} y1={JOURNEY_MAP_CENTER.y} x2={n.x} y2={n.y} stroke={C.border} strokeWidth="2" strokeDasharray="6,4" />
        ))}
        <g>
          <rect x={JOURNEY_MAP_CENTER.x - 90} y={JOURNEY_MAP_CENTER.y - 30} width={180} height={60} rx={12} fill={C.bg3} stroke={C.orange} strokeWidth={2} />
          <text x={JOURNEY_MAP_CENTER.x} y={JOURNEY_MAP_CENTER.y - 5} textAnchor="middle" fill={C.t1} fontFamily={MONO} fontSize={13} fontWeight="bold">JOURNEY ENGINE</text>
          <text x={JOURNEY_MAP_CENTER.x} y={JOURNEY_MAP_CENTER.y + 15} textAnchor="middle" fill={C.t3} fontFamily={SANS} fontSize={10}>The predictive brain</text>
        </g>
        {JOURNEY_MAP_NODES.map(n => {
          const isActive = active === n.id;
          const tooltip = JOURNEY_NODE_TOOLTIPS[n.id];
          return (
            <g key={n.id} className="cursor-pointer" onClick={() => setActive(isActive ? null : n.id)} style={{ transition: 'transform 0.2s' }}>
              <rect x={n.x - 75} y={n.y - 25} width={150} height={50} rx={8} fill={C.bg2} stroke={isActive ? C.orange : C.border} strokeWidth={isActive ? 2 : 1} filter={isActive ? 'url(#glow-j)' : undefined} />
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
      <SectionHeading>What Is Journey Management?</SectionHeading>
      <Paragraph>Journey Management is the practice of tracking, analyzing, and acting on customer behavior as they interact with your website and digital properties. Think of it as having a highly observant store manager who watches every visitor's path through the store — noting what they look at, where they linger, what they pick up and put down — and then sends a helpful sales associate at exactly the right moment to assist.</Paragraph>
      <Paragraph>In Genesys Cloud CX, Predictive Engagement is the platform capability that powers Journey Management. It combines real-time web tracking, behavioral segmentation, machine learning predictions, and automated engagement actions to proactively connect website visitors with the right help at the right time — before they even ask for it.</Paragraph>
      <SubHeading>Why Predictive Engagement Matters</SubHeading>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        {[
          { title: 'WITHOUT JOURNEY MANAGEMENT', items: ['Visitors browse silently — you have no visibility', 'Chat is reactive: customers must click "Help" first', 'No way to identify high-value visitors in real time', 'Abandonment goes unnoticed until it shows up in reports', 'Every visitor gets the same generic experience'], color: C.red },
          { title: 'WITH PREDICTIVE ENGAGEMENT', items: ['Every visitor action is tracked and analyzed in real time', 'Proactive chat offers engage visitors at the optimal moment', 'AI predicts which visitors are most likely to convert', 'At-risk visitors receive timely intervention', 'Experiences are personalized by segment and behavior'], color: C.orange },
        ].map((panel, i) => (
          <div key={i} className="rounded-lg p-5" style={{ backgroundColor: C.bg2, borderTop: `3px solid ${panel.color}` }}>
            <div className="font-bold mb-3 text-sm" style={{ color: panel.color, fontFamily: MONO }}>{panel.title}</div>
            {panel.items.map((item, j) => <div key={j} className="text-sm mb-1.5" style={{ color: C.t2, fontFamily: SANS }}>{item}</div>)}
          </div>
        ))}
      </div>
      <SubHeading>The Six Pillars of Journey Management</SubHeading>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 my-4">
        {JOURNEY_PILLARS.map((p, i) => (
          <div key={i} className="rounded-lg p-4 flex items-start gap-3 transition-all duration-200 hover:-translate-y-0.5" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
            <Eye size={20} style={{ color: C.orange, flexShrink: 0 }} />
            <div><div className="font-semibold text-sm" style={{ color: C.t1, fontFamily: MONO }}>{p.label}</div><div className="text-xs mt-1" style={{ color: C.t2, fontFamily: SANS }}>{p.desc}</div></div>
          </div>
        ))}
      </div>
      <CalloutBox type="tip">Journey Management is not just about chat. While proactive chat is the most common action, the system also supports content offers (visual overlays), webhook actions (external integrations), and predictive scoring that can be consumed by any downstream system.</CalloutBox>
      <CalloutBox type="info">Survey events, DNIS attributes, and virtual agent filters are now available in Journey Management, enabling richer pattern analysis across customer touchpoints.</CalloutBox>
      <CalloutBox type="info">A new Copilot panel and expandable charts improve the Journey Management analytics experience, with side-by-side comparisons and AI-assisted insights.</CalloutBox>
    </section>

    {/* T1S2 */}
    <section ref={el => sectionRefs.current['t1s2'] = el} id="t1s2">
      <SectionHeading>The Building Blocks — Key Components</SectionHeading>
      <Paragraph>Journey Management in Genesys Cloud is built from several interconnected components that work together to observe, analyze, predict, and act on visitor behavior. No single piece works alone — they combine like an intelligent observation-and-response system for your website.</Paragraph>
      <CalloutBox type="tip">Click any node in the diagram below to see what it does and a simple analogy.</CalloutBox>
      <JourneyComponentMapSVG />
      <SubHeading>Component Reference</SubHeading>
      <InteractiveTable
        headers={['Component', 'Simple Explanation', 'Analogy']}
        rows={Object.entries(JOURNEY_NODE_TOOLTIPS).map(([k, v]) => {
          const node = JOURNEY_MAP_NODES.find(n => n.id === k);
          return [node?.label || k, v.explanation, v.analogy];
        })}
      />
    </section>

    {/* T1S3 */}
    <section ref={el => sectionRefs.current['t1s3'] = el} id="t1s3">
      <SectionHeading>How Predictive Engagement Works</SectionHeading>
      <Paragraph>Every website visitor follows a lifecycle through the Predictive Engagement system. Understanding this flow is the key to understanding how the journey engine turns raw visitor behavior into timely, intelligent engagement.</Paragraph>
      <div className="my-6 space-y-0">
        {JOURNEY_LIFECYCLE.map((s, i) => (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: s.color + '22', color: s.color, border: `2px solid ${s.color}`, fontFamily: MONO }}>{s.step}</div>
              {i < JOURNEY_LIFECYCLE.length - 1 && <div className="w-0.5 flex-1 my-1" style={{ backgroundColor: C.border }} />}
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
          <div className="font-bold text-sm" style={{ color: C.green, fontFamily: MONO }}>LOOP — MODEL LEARNS & IMPROVES WITH EVERY OUTCOME</div>
        </div>
      </div>
    </section>

    {/* T1S4 */}
    <section ref={el => sectionRefs.current['t1s4'] = el} id="t1s4">
      <SectionHeading>Use Cases — When to Use Journey Management</SectionHeading>
      <Paragraph>Journey Management excels when you need to engage website visitors proactively based on their behavior. The system supports use cases ranging from simple (offer chat on a pricing page) to advanced (AI-predicted cart abandonment rescue with webhook orchestration).</Paragraph>
      <div className="my-6 rounded-lg p-4 overflow-x-auto" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
        <div className="flex items-center justify-between mb-2 min-w-[500px]">
          <span className="text-xs font-bold" style={{ color: C.orange, fontFamily: MONO }}>SIMPLE</span>
          <span className="text-xs font-bold" style={{ color: C.purple, fontFamily: MONO }}>ADVANCED</span>
        </div>
        <div className="h-2 rounded-full min-w-[500px]" style={{ background: `linear-gradient(90deg, ${C.orange}, ${C.blue}, ${C.purple})` }} />
        <div className="flex justify-between mt-2 min-w-[500px]">
          {USE_CASES.map((m, i) => <span key={i} className="text-[10px] text-center" style={{ color: C.t3, fontFamily: MONO, width: 100 }}>{m.name.split(' ').slice(0, 2).join(' ')}</span>)}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {USE_CASES.map((m, i) => (
          <ExpandableCard key={i} title={m.name} accent={C.orange}>
            <div className="space-y-2">
              <div><strong style={{ color: C.t1 }}>How it works:</strong> {m.how}</div>
              <div className="flex items-center gap-2"><strong style={{ color: C.t1 }}>Complexity:</strong> <StarRating count={m.complexity} /></div>
              <div><strong style={{ color: C.t1 }}>Best for:</strong> {m.best}</div>
              <div><strong style={{ color: C.t1 }}>Think of it as:</strong> <em>{m.analogy}</em></div>
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
  const [activeEventTab, setActiveEventTab] = useState(0);
  return (
    <div className="space-y-16">
      {/* T2S1 */}
      <section ref={el => sectionRefs.current['t2s1'] = el} id="t2s1">
        <SectionHeading>Prerequisites & Setup</SectionHeading>
        <Paragraph>Before building your first journey configuration, these platform-level components must be in place. Think of this as wiring the building with cameras and sensors before the security system can do its job.</Paragraph>
        <div className="space-y-3 my-4">
          {PREREQUISITES.map((p, i) => (
            <ExpandableCard key={i} title={`${i + 1}. ${p.title}`} accent={C.orange}>
              {p.detail}
            </ExpandableCard>
          ))}
        </div>
        <SubHeading>Tracking Snippet Installation</SubHeading>
        <Paragraph>The tracking snippet must be embedded on every page of your website where you want to track visitor behavior. The recommended approach is to add it to a global template or use a tag manager.</Paragraph>
        <CodeBlock>{`<!-- Genesys Cloud Predictive Engagement Tracking Snippet -->
<script type="text/javascript">
  (function(g, e, n, s, y, c) {
    g['_genesysJourney'] = y;
    g[y] = g[y] || function() {
      (g[y].q = g[y].q || []).push(arguments);
    };
    g[y].l = 1 * new Date();
    c = e.createElement(n);
    c.async = 1;
    c.src = s;
    e.head.appendChild(c);
  })(window, document, 'script',
    'https://apps.mypurecloud.com/journey/sdk/js/web/v1.js',
    'Genesys');
  Genesys("init", {
    deploymentId: "YOUR-DEPLOYMENT-ID",
    environment: "mypurecloud.com"
  });
</script>`}</CodeBlock>
        <SubHeading>Recommended Setup Sequence</SubHeading>
        <div className="flex flex-wrap items-center gap-1 my-4 overflow-x-auto">
          {['Licensing', 'Web Messaging Deploy', 'Tracking Snippet', 'Outcomes', 'Segments', 'Action Maps', 'Testing', 'Model Training'].map((s, i) => (
            <React.Fragment key={i}>
              <span className="px-3 py-1.5 rounded text-xs whitespace-nowrap" style={{ backgroundColor: C.bg3, color: C.t1, fontFamily: MONO, border: `1px solid ${C.border}` }}>{s}</span>
              {i < 7 && <ArrowRight size={14} style={{ color: C.t3, flexShrink: 0 }} />}
            </React.Fragment>
          ))}
        </div>
        <CalloutBox type="warning">Always define Outcomes BEFORE creating Action Maps. Action maps can use outcome probability as a trigger condition, and outcomes need data to train the predictive model. Start collecting journey data at least 2-4 weeks before activating proactive engagement.</CalloutBox>
      </section>

      {/* T2S2 */}
      <section ref={el => sectionRefs.current['t2s2'] = el} id="t2s2">
        <SectionHeading>Segments — Defining Customer Groups</SectionHeading>
        <Paragraph>Segments are the targeting mechanism for journey engagement. They define WHO should receive proactive actions by grouping visitors based on shared behavioral patterns, attributes, or visit characteristics. A visitor can belong to multiple segments simultaneously.</Paragraph>
        <SubHeading>Segment Types</SubHeading>
        <div className="space-y-4 my-4">
          {SEGMENT_TYPES.map((s, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, borderLeft: `4px solid ${s.color}` }}>
              <div className="font-bold text-sm mb-2" style={{ color: s.color, fontFamily: MONO }}>{s.name}</div>
              <div className="text-sm mb-3" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.6 }}>{s.desc}</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {s.examples.map((ex, j) => (
                  <div key={j} className="text-xs flex items-start gap-2" style={{ fontFamily: MONO }}>
                    <span style={{ color: s.color }}>*</span><span style={{ color: C.t3 }}>{ex}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <SubHeading>Segment Conditions & Logic</SubHeading>
        <Paragraph>Segments support AND/OR logic for combining conditions. All conditions within a group use AND logic (all must be true). Multiple groups use OR logic (any group can match). This allows complex targeting like: (Visited pricing page AND spent 60+ seconds) OR (Viewed 5+ product pages AND returning visitor).</Paragraph>
        <CodeBlock>{`// Example segment: "High-Intent Prospect"
// Group 1 (AND):
//   Page URL contains "/pricing"
//   Time on page >= 60 seconds
//   Visit count >= 2
// OR
// Group 2 (AND):
//   Page views in session >= 5
//   Custom event "demo_request_started" fired
//   Device type = "Desktop"`}</CodeBlock>
        <CalloutBox type="tip">Start with broad segments and narrow them over time based on action map performance data. A segment that is too narrow may not match enough visitors to generate statistically meaningful results.</CalloutBox>
      </section>

      {/* T2S3 */}
      <section ref={el => sectionRefs.current['t2s3'] = el} id="t2s3">
        <SectionHeading>Action Maps — Triggering Engagement</SectionHeading>
        <Paragraph>Action Maps are the rules engine that connects segments to actions. They define the complete engagement logic: WHICH visitors to target (segment), WHAT action to take (chat offer, content offer, webhook), WHEN to trigger (conditions), and HOW OFTEN (frequency caps).</Paragraph>
        <SubHeading>Action Types</SubHeading>
        <div className="space-y-3 my-4">
          {ACTION_MAP_TYPES.map((a, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
              <div className="font-semibold text-sm mb-2 flex items-center gap-2" style={{ color: a.color, fontFamily: MONO }}>
                {a.name}
              </div>
              <div className="text-sm" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.6 }}>{a.desc}</div>
            </div>
          ))}
        </div>
        <SubHeading>Trigger Conditions</SubHeading>
        <div className="space-y-2 my-3">
          {ACTION_MAP_CONDITIONS.map(([label, desc], i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-1 p-3 rounded" style={{ backgroundColor: C.bg2 }}>
              <span className="text-xs font-semibold whitespace-nowrap min-w-[180px]" style={{ color: C.orange, fontFamily: MONO }}>{label}:</span>
              <span className="text-xs" style={{ color: C.t2, fontFamily: SANS }}>{desc}</span>
            </div>
          ))}
        </div>
        <SubHeading>Frequency Caps</SubHeading>
        <Paragraph>Frequency caps prevent over-engagement by limiting how often an action map can trigger for the same visitor. Options include: once per session, once per N hours, once per N days, or a maximum number of times total. A visitor who dismisses a chat offer should not see the same offer again immediately — frequency caps ensure respectful engagement.</Paragraph>
        <SubHeading>Example: Proactive Chat Action Map</SubHeading>
        <div className="my-4 p-4 rounded-lg" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
          {[
            { indent: 0, text: 'ACTION MAP: "Pricing Page Chat Offer"', color: C.orange },
            { indent: 1, text: 'Target Segment: "High-Intent Prospect"', color: C.blue },
            { indent: 1, text: 'Conditions:', color: C.t1 },
            { indent: 2, text: 'Page URL contains "/pricing"', color: C.t3 },
            { indent: 2, text: 'Time on page >= 30 seconds', color: C.t3 },
            { indent: 2, text: 'Outcome probability ("Purchase") >= 60%', color: C.yellow },
            { indent: 1, text: 'Action: Proactive Chat Offer', color: C.green },
            { indent: 2, text: 'Message: "Have questions about our pricing? Chat with a specialist!"', color: C.t3 },
            { indent: 2, text: 'Route to Queue: "Sales_Chat"', color: C.orange },
            { indent: 2, text: 'Priority: 5', color: C.t3 },
            { indent: 1, text: 'Frequency Cap: Once per 24 hours', color: C.purple },
            { indent: 1, text: 'Schedule: Mon-Fri 8AM-6PM EST', color: C.t3 },
          ].map((line, i) => (
            <div key={i} className="text-xs" style={{ paddingLeft: line.indent * 20, color: line.color, fontFamily: MONO, marginBottom: 2 }}>{line.text}</div>
          ))}
        </div>
        <CalloutBox type="info">Action maps are evaluated in priority order. If a visitor matches multiple action maps, only the highest-priority one triggers (unless configured otherwise). Assign lower priority numbers to more important action maps.</CalloutBox>
      </section>

      {/* T2S4 */}
      <section ref={el => sectionRefs.current['t2s4'] = el} id="t2s4">
        <SectionHeading>Outcomes — Measuring Success</SectionHeading>
        <Paragraph>Outcomes define what "success" looks like for your website visitors. They are the business goals that the predictive model learns to predict and that analytics dashboards track. Without well-defined outcomes, journey management is like playing a game without a scoreboard.</Paragraph>
        <SubHeading>Outcome Types</SubHeading>
        <div className="space-y-3 my-4">
          {OUTCOME_TYPES.map((o, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, borderLeft: `4px solid ${o.color}` }}>
              <div className="font-bold text-sm mb-2" style={{ color: o.color, fontFamily: MONO }}>{o.name}</div>
              <div className="text-sm mb-2" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.6 }}>{o.desc}</div>
              <div className="text-xs p-2 rounded" style={{ backgroundColor: C.bg3, color: C.t3, fontFamily: MONO }}>{o.example}</div>
            </div>
          ))}
        </div>
        <SubHeading>Achieved vs. Attempted</SubHeading>
        <Paragraph>Genesys Cloud tracks two key metrics for each outcome. "Achieved" means the visitor successfully completed the outcome (reached the target page, fired the target event). "Attempted" means the visitor was in a session where they could have achieved the outcome (they were on the website and matched the relevant segment). The ratio of achieved to attempted gives you the conversion rate — the fundamental metric for measuring journey effectiveness.</Paragraph>
        <SubHeading>Conversion Tracking</SubHeading>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
          {[
            { title: 'BASELINE', desc: 'Conversion rate before any proactive engagement is activated. Measure for at least 2 weeks to establish a reliable baseline.', color: C.blue },
            { title: 'WITH ENGAGEMENT', desc: 'Conversion rate after action maps are activated. Compare against baseline to measure lift. Use A/B testing for scientific comparison.', color: C.green },
            { title: 'BY SEGMENT', desc: 'Conversion rates broken down by segment. Identifies which audience groups benefit most from proactive engagement.', color: C.orange },
          ].map((u, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
              <div className="font-bold text-sm mb-2" style={{ color: u.color, fontFamily: MONO }}>{u.title}</div>
              <div className="text-xs" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.6 }}>{u.desc}</div>
            </div>
          ))}
        </div>
        <CalloutBox type="tip">Define outcomes early and let them collect data even before you activate action maps. The predictive model needs historical outcome data to learn visitor patterns. The more outcome data available, the more accurate the AI predictions will be.</CalloutBox>
      </section>

      {/* T2S5 */}
      <section ref={el => sectionRefs.current['t2s5'] = el} id="t2s5">
        <SectionHeading>Predictive Models & AI</SectionHeading>
        <Paragraph>The predictive model is the AI engine at the heart of Genesys Cloud Journey Management. It uses machine learning to analyze historical visitor behavior and predict, in real time, the probability that the current visitor will achieve each defined outcome. This score enables intelligent, data-driven engagement decisions.</Paragraph>
        <SubHeading>Core Concepts</SubHeading>
        <div className="space-y-3 my-4">
          {PREDICTIVE_MODEL_DATA.concepts.map((k, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
              <div className="font-semibold text-sm mb-2" style={{ color: C.orange, fontFamily: MONO }}>{k.name}</div>
              <div className="text-sm" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.6 }}>{k.desc}</div>
            </div>
          ))}
        </div>
        <SubHeading>How the Model Trains</SubHeading>
        <div className="my-4 p-4 rounded-lg space-y-3" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
          <div className="font-bold text-xs mb-2" style={{ color: C.orange, fontFamily: MONO }}>MODEL TRAINING PIPELINE:</div>
          {[
            '1. Data collection — journey events accumulate as visitors browse your site',
            '2. Outcome labeling — visitors who achieved the outcome are labeled as positive examples',
            '3. Feature extraction — model identifies behavioral patterns (pages, timing, events) that correlate with outcomes',
            '4. Model training — ML algorithm builds a predictive model from positive and negative examples',
            '5. Validation — model accuracy is tested against held-out data before deployment',
            '6. Real-time scoring — live visitors receive a probability score updated with each new event',
            '7. Continuous retraining — model automatically updates as new outcome data accumulates',
          ].map((step, i) => <div key={i} className="text-xs" style={{ color: C.t2, fontFamily: MONO }}>{step}</div>)}
        </div>
        <SubHeading>Requirements & Constraints</SubHeading>
        <div className="space-y-1 my-3">
          {PREDICTIVE_MODEL_DATA.requirements.map((r, i) => (
            <div key={i} className="text-xs flex items-start gap-2" style={{ fontFamily: SANS }}>
              <span style={{ color: C.orange }}>*</span><span style={{ color: C.t2 }}>{r}</span>
            </div>
          ))}
        </div>
        <SubHeading>A/B Testing Best Practices</SubHeading>
        <div className="space-y-1 my-3">
          {[
            { good: true, text: 'Run A/B tests for at least 14 days to account for weekly behavior patterns' },
            { good: true, text: 'Use a 50/50 split (control vs. test) for maximum statistical power' },
            { good: true, text: 'Measure multiple metrics: conversion rate, engagement rate, customer satisfaction' },
            { good: true, text: 'Establish a clear baseline period before activating predictive actions' },
            { good: false, text: 'Don\'t change action map conditions mid-test (invalidates results)' },
            { good: false, text: 'Don\'t end tests early based on initial results (regression to mean is common)' },
            { good: false, text: 'Don\'t test during unusual traffic periods (holidays, product launches) without noting the anomaly' },
          ].map((p, i) => (
            <div key={i} className="text-xs flex items-start gap-2" style={{ color: p.good ? C.green : C.red, fontFamily: SANS }}>
              <span>{p.good ? 'DO' : 'AVOID'}</span><span style={{ color: C.t2 }}>{p.text}</span>
            </div>
          ))}
        </div>
        <CalloutBox type="warning">The predictive model is only as good as the data it learns from. Poorly defined outcomes (too broad, too rare, or inconsistently tracked) will produce unreliable probability scores. Invest time in clean outcome definitions and consistent event tracking before relying on AI-driven engagement.</CalloutBox>
      </section>

      {/* T2S6 */}
      <section ref={el => sectionRefs.current['t2s6'] = el} id="t2s6">
        <SectionHeading>Web Event Tracking</SectionHeading>
        <Paragraph>Web events are the raw data that fuels the entire journey engine. Every visitor action captured by the tracking snippet becomes an event — and the richness and accuracy of your event data directly determines the quality of your segments, predictions, and engagement actions.</Paragraph>
        <SubHeading>Event Types</SubHeading>
        <div className="flex gap-1 mb-3 overflow-x-auto flex-wrap">
          {WEB_EVENT_TYPES.map((t, i) => (
            <button key={i} className="px-3 py-1.5 rounded text-xs whitespace-nowrap cursor-pointer transition-colors" onClick={() => setActiveEventTab(i)} style={{ backgroundColor: activeEventTab === i ? C.orange : C.bg3, color: activeEventTab === i ? '#fff' : C.t2, fontFamily: MONO }}>{t.type}</button>
          ))}
        </div>
        <div className="p-4 rounded-lg text-sm" style={{ backgroundColor: C.bg2, color: C.t2, fontFamily: SANS, border: `1px solid ${C.border}`, lineHeight: 1.7 }}>
          <div className="mb-2">{WEB_EVENT_TYPES[activeEventTab].desc}</div>
          <div className="text-xs flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded" style={{ backgroundColor: WEB_EVENT_TYPES[activeEventTab].auto ? C.green + '22' : C.yellow + '22', color: WEB_EVENT_TYPES[activeEventTab].auto ? C.green : C.yellow, fontFamily: MONO }}>
              {WEB_EVENT_TYPES[activeEventTab].auto ? 'AUTO-TRACKED' : 'REQUIRES CODE'}
            </span>
          </div>
          {WEB_EVENT_TYPES[activeEventTab].code && <CodeBlock>{WEB_EVENT_TYPES[activeEventTab].code}</CodeBlock>}
        </div>

        <SubHeading>Custom Event Implementation</SubHeading>
        <Paragraph>Custom events let you track business-specific actions that the automatic tracking cannot detect — like adding an item to a cart, starting a trial, or completing a multi-step process. Each custom event can carry attributes (key-value pairs) for additional context.</Paragraph>
        <CodeBlock>{`// Track a product view with attributes
Genesys("command", "journey.trackCustomEvent", {
  eventName: "product_viewed",
  attributes: {
    productId: "SKU-98765",
    productName: "Enterprise Plan",
    category: "SaaS",
    price: 299.99
  }
});

// Track a form submission
Genesys("command", "journey.trackCustomEvent", {
  eventName: "contact_form_submitted",
  attributes: {
    formId: "enterprise-contact",
    department: "sales"
  }
});`}</CodeBlock>
        <CalloutBox type="info">Event names are case-sensitive. Use a consistent naming convention (e.g., snake_case) across your entire site. Document all custom events in a shared event catalog so that segment and outcome creators can reference them accurately.</CalloutBox>
      </section>

      {/* T2S7 */}
      <section ref={el => sectionRefs.current['t2s7'] = el} id="t2s7">
        <SectionHeading>API & Integration</SectionHeading>
        <Paragraph>The Genesys Cloud Journey API provides programmatic access to segments, action maps, outcomes, sessions, and analytics. This enables CRM-enriched journeys, external event injection, custom analytics dashboards, and automated journey configuration management.</Paragraph>
        <SubHeading>Key API Endpoints</SubHeading>
        <InteractiveTable searchable headers={['Method', 'Endpoint', 'Use']} rows={API_ENDPOINTS.map(e => [e.method, e.path, e.use])} />
        <SubHeading>External Event Injection</SubHeading>
        <Paragraph>External events allow you to enrich a visitor's journey with data from outside the website — CRM records, purchase history, support ticket status, loyalty tier, or any external system. These events are injected via API and become part of the visitor's session, available for segment matching and model training.</Paragraph>
        <CodeBlock>{`// POST /api/v2/journey/sessions/{sessionId}/events
{
  "eventName": "crm_customer_identified",
  "attributes": {
    "customerId": "CUST-12345",
    "accountTier": "Enterprise",
    "lifetimeValue": 25000,
    "openCases": 2,
    "lastPurchaseDate": "2025-12-15"
  },
  "createdDate": "2026-02-11T14:30:00Z"
}`}</CodeBlock>
        <SubHeading>CRM Integration Pattern</SubHeading>
        <Paragraph>The most common integration pattern connects visitor identity to CRM records. When a visitor logs in or is identified (via email, account number, or cookie), an external event injects their CRM profile into the journey session. This enables segments like "Enterprise tier with open support cases" and outcomes like "Upgraded to Premium plan."</Paragraph>
        <SubHeading>Analytics Export</SubHeading>
        <Paragraph>Journey analytics data can be exported via the Analytics API for use in external BI tools (Tableau, Power BI, Looker). Key queryable dimensions: outcome achievement rates, action map trigger rates, segment membership counts, engagement acceptance rates, and conversion lift from A/B tests.</Paragraph>
        <CalloutBox type="tip">Use notification channels (WebSocket) to subscribe to real-time journey events for building live dashboards or triggering external workflows without polling the API.</CalloutBox>
      </section>

      {/* T2S8 */}
      <section ref={el => sectionRefs.current['t2s8'] = el} id="t2s8">
        <SectionHeading>Platform Limits & Troubleshooting</SectionHeading>
        <SubHeading>Platform Limits</SubHeading>
        <InteractiveTable searchable headers={['Resource', 'Limit', 'Notes']} rows={PLATFORM_LIMITS} />
        <SubHeading>Troubleshooting Decision Tree</SubHeading>
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
const GenesysJourneyGuide = ({ onBack, isDark: isDarkProp, setIsDark: setIsDarkProp, initialNav }) => {
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
            <span className="font-bold text-sm hidden sm:block" style={{ fontFamily: MONO, color: C.orange }}>GENESYS JOURNEY GUIDE</span>
            <span className="font-bold text-sm sm:hidden" style={{ fontFamily: MONO, color: C.orange }}>GC JOURNEY</span>
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
      <Footer title="Genesys Cloud Journey Management & Predictive Engagement — Interactive Knowledge Guide" />
    </div>
  );
};

export default GenesysJourneyGuide;
