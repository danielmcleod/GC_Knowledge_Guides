import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Rocket, Settings, Cpu, Search, ChevronDown, ChevronUp, ChevronRight,
  Menu, X, Phone, Mail, MessageSquare, Bell, RefreshCw, CheckCircle,
  AlertTriangle, AlertCircle, Info, Lightbulb, Star, ExternalLink,
  BookOpen, ArrowRight, ArrowDown, ArrowLeft, Circle, Zap, Shield, Clock, Users,
  FileText, Database, Activity, BarChart3, Target, Monitor,
  Hash, Layers, Eye, Sun, Moon, Calendar, Timer, TrendingUp, Award, Lock,
  Filter, PieChart, LineChart, Table
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
  'The Big Picture — Understanding Analytics in the Contact Center',
  'Hands-On — Building Views, Dashboards, and Reports',
  'Under the Hood — APIs, Query Language, and Advanced Integrations',
];
const TIER_AUDIENCES = [
  'For everyone — no experience needed',
  'For administrators & supervisors',
  'For engineers, architects & power users',
];
const TIER_ICONS_KEYS = ['Rocket', 'Settings', 'Cpu'];

// ══════════════════════════════════════════════════════════════
// SECTION METADATA (all tiers)
// ══════════════════════════════════════════════════════════════
const SECTIONS = [
  { tier: 0, id: 't1s1', title: 'What Is Analytics in Genesys Cloud?' },
  { tier: 0, id: 't1s2', title: 'The Analytics Building Blocks' },
  { tier: 0, id: 't1s3', title: 'Types of Analytics' },
  { tier: 0, id: 't1s4', title: 'Key Metrics Every Contact Center Tracks' },
  { tier: 0, id: 't1s5', title: 'Key Terminology Glossary' },
  { tier: 1, id: 't2s1', title: 'Prerequisites — Permissions & Data Visibility' },
  { tier: 1, id: 't2s2', title: 'Performance Views' },
  { tier: 1, id: 't2s3', title: 'Dashboards & Widgets' },
  { tier: 1, id: 't2s4', title: 'Conversation Detail & Interaction Search' },
  { tier: 1, id: 't2s5', title: 'Real-Time Dashboards & Wallboards' },
  { tier: 1, id: 't2s6', title: 'Data Export & Scheduled Reports' },
  { tier: 1, id: 't2s7', title: 'Gamification & Agent Scorecards' },
  { tier: 1, id: 't2s8', title: 'Key Reports for Supervisors' },
  { tier: 2, id: 't3s1', title: 'Data Architecture & Retention' },
  { tier: 2, id: 't3s2', title: 'Analytics API' },
  { tier: 2, id: 't3s3', title: 'Custom Dashboards with External Tools' },
  { tier: 2, id: 't3s4', title: 'Analytics Query Language' },
  { tier: 2, id: 't3s5', title: 'Speech & Text Analytics' },
  { tier: 2, id: 't3s6', title: 'Platform Limits — The Complete Reference' },
  { tier: 2, id: 't3s7', title: 'Licensing & Feature Matrix' },
  { tier: 2, id: 't3s8', title: 'Troubleshooting Analytics Issues' },
];

// ══════════════════════════════════════════════════════════════
// T1 DATA
// ══════════════════════════════════════════════════════════════
const ANALYTICS_USE_CASES = [
  { icon: 'BarChart3', label: 'Performance Tracking', desc: 'Monitor agent and queue KPIs in real time' },
  { icon: 'TrendingUp', label: 'Trend Analysis', desc: 'Identify patterns across days, weeks, and months' },
  { icon: 'Target', label: 'SLA Management', desc: 'Track service level targets and deviations' },
  { icon: 'Users', label: 'Workforce Insights', desc: 'Understand agent utilization and occupancy' },
  { icon: 'Activity', label: 'Quality Monitoring', desc: 'Evaluate interactions, sentiment, and compliance' },
  { icon: 'Zap', label: 'Operational Alerts', desc: 'Detect anomalies and respond before customers notice' },
];

const BUILDING_BLOCKS = [
  { id: 'views', label: 'VIEWS', sub: 'Pre-built data tables', x: 400, y: 60 },
  { id: 'dashboards', label: 'DASHBOARDS', sub: 'Custom layouts', x: 130, y: 150 },
  { id: 'widgets', label: 'WIDGETS', sub: 'Visual components', x: 670, y: 150 },
  { id: 'filters', label: 'FILTERS', sub: 'Data scoping', x: 80, y: 310 },
  { id: 'exports', label: 'EXPORTS', sub: 'CSV / PDF output', x: 110, y: 450 },
  { id: 'schedules', label: 'SCHEDULES', sub: 'Automated delivery', x: 300, y: 540 },
  { id: 'metrics', label: 'METRICS', sub: 'Measured values', x: 720, y: 310 },
  { id: 'dimensions', label: 'DIMENSIONS', sub: 'Grouping axes', x: 690, y: 450 },
  { id: 'intervals', label: 'INTERVALS', sub: 'Time granularity', x: 500, y: 540 },
];
const MAP_CENTER = { x: 400, y: 300 };

const BLOCK_TOOLTIPS = {
  views: { explanation: 'Pre-built tabular reports for agents, queues, flows, and interactions with sortable columns and filters', analogy: 'A spreadsheet that updates itself' },
  dashboards: { explanation: 'Custom canvases where you arrange widgets to visualize the metrics you care about most', analogy: 'Your personal cockpit instrument panel' },
  widgets: { explanation: 'Individual visual components — charts, metrics, grids, agent status boards — placed on dashboards', analogy: 'The individual gauges and dials' },
  filters: { explanation: 'Controls that narrow data by queue, agent, date range, media type, wrap-up code, and more', analogy: 'A sieve that shows only what matters right now' },
  exports: { explanation: 'The ability to download view data as CSV or PDF for offline analysis or compliance records', analogy: 'Printing a snapshot of the data' },
  schedules: { explanation: 'Automated recurring exports delivered by email or FTP at configured intervals', analogy: 'A newspaper subscription for your data' },
  metrics: { explanation: 'Quantitative measurements like AHT, SLA%, abandon rate — the numbers you track', analogy: 'The readings on the gauges' },
  dimensions: { explanation: 'Categorical axes for grouping data — by queue, agent, media type, direction, wrap-up code', analogy: 'How you slice the data pie' },
  intervals: { explanation: 'Time granularity for aggregation — 15min, 30min, 1hr, 1day — determines how data is bucketed', analogy: 'The zoom level on your timeline' },
};

const ANALYTICS_TYPES = [
  {
    name: 'Real-Time Analytics', color: C.green, icon: 'Activity',
    desc: 'Live, continuously updating data about what is happening right now in your contact center.',
    examples: ['Agents currently on calls', 'Queue depth right now', 'Longest wait time in queue', 'Active conversations by media type'],
    latency: '~2-5 seconds',
    bestFor: 'Supervisors managing the floor, wallboards, instant decision-making',
  },
  {
    name: 'Historical Analytics', color: C.blue, icon: 'Clock',
    desc: 'Aggregated and detail-level data about what has already happened — minutes, hours, days, or months ago.',
    examples: ['Average handle time last week', 'Service level trend over 30 days', 'Agent performance month-over-month', 'Interaction detail records'],
    latency: '~5-30 minutes for aggregation',
    bestFor: 'Reporting, trend analysis, workforce planning, compliance',
  },
  {
    name: 'Predictive Analytics', color: C.purple, icon: 'TrendingUp',
    desc: 'AI-driven insights that forecast future outcomes based on patterns in historical data.',
    examples: ['Predicted wait time for callers', 'Forecasted interaction volume', 'Sentiment trending', 'Agent burnout risk indicators'],
    latency: 'Varies by model',
    bestFor: 'Workforce management, proactive staffing, customer experience optimization',
  },
];

const KEY_METRICS = [
  { metric: 'Service Level (SLA)', what: 'Percentage of interactions answered within a target time (e.g., 80% in 20 seconds)', healthy: '80-90%', why: 'The gold standard KPI — directly reflects customer wait experience', icon: 'Target' },
  { metric: 'Average Speed of Answer (ASA)', what: 'Mean time a customer waits before reaching an agent', healthy: '< 30 seconds', why: 'High ASA = frustrated customers and higher abandon rates', icon: 'Timer' },
  { metric: 'Average Handle Time (AHT)', what: 'Talk time + hold time + after-call work (ACW) per interaction', healthy: '3-7 minutes (varies)', why: 'Too high = inefficiency; too low = rushed interactions', icon: 'Clock' },
  { metric: 'After-Call Work (ACW)', what: 'Time agents spend in wrap-up after the conversation ends', healthy: '30-90 seconds', why: 'Extended ACW reduces agent availability for next interactions', icon: 'FileText' },
  { metric: 'First Contact Resolution (FCR)', what: 'Percentage of issues resolved on the first interaction without callback', healthy: '70-80%', why: 'The strongest predictor of customer satisfaction', icon: 'CheckCircle' },
  { metric: 'Customer Satisfaction (CSAT)', what: 'Survey-based score measuring customer happiness (usually 1-5 scale)', healthy: '4.0+ / 5', why: 'Direct voice-of-customer feedback on service quality', icon: 'Star' },
  { metric: 'Net Promoter Score (NPS)', what: 'Likelihood of recommending (0-10 scale), calculated as %Promoters - %Detractors', healthy: '> 30', why: 'Measures long-term loyalty and brand advocacy', icon: 'TrendingUp' },
  { metric: 'Abandon Rate', what: 'Percentage of customers who hang up before reaching an agent', healthy: '< 5%', why: 'Every abandoned call is a lost opportunity and a frustrated customer', icon: 'AlertTriangle' },
  { metric: 'Occupancy Rate', what: 'Percentage of time agents spend handling interactions vs. idle', healthy: '75-85%', why: 'Over 85% risks burnout; under 70% signals overstaffing', icon: 'Activity' },
  { metric: 'Transfer Rate', what: 'Percentage of interactions transferred to another queue or agent', healthy: '< 15%', why: 'High transfers indicate routing or training problems', icon: 'RefreshCw' },
];

const GLOSSARY = [
  { term: 'View', def: 'A pre-built tabular report displaying analytics data with sortable columns and configurable filters', tier: 'Tier 1' },
  { term: 'Dashboard', def: 'A customizable canvas containing one or more widgets arranged to display key analytics visually', tier: 'Tier 2' },
  { term: 'Widget', def: 'An individual visual component on a dashboard — chart, metric card, grid, or status board', tier: 'Tier 2' },
  { term: 'Interval', def: 'The time granularity for data aggregation (15min, 30min, 1hr, 1day)', tier: 'Tier 2' },
  { term: 'Aggregation', def: 'Mathematical operation applied to data over a time interval (sum, average, min, max, count)', tier: 'Tier 2' },
  { term: 'Conversation', def: 'The top-level entity representing an entire customer interaction across all participants and segments', tier: 'Tier 1' },
  { term: 'Segment', def: 'A distinct phase within a conversation — IVR, queue wait, agent interaction, hold, ACW', tier: 'Tier 2' },
  { term: 'Session', def: 'A participant\'s continuous connection within a conversation (an agent may have multiple sessions if transferred)', tier: 'Tier 3' },
  { term: 'Participant', def: 'An entity involved in a conversation — customer, agent, IVR, ACD queue, or external party', tier: 'Tier 2' },
  { term: 'Metric', def: 'A quantitative measurement derived from conversation data (e.g., tHandle, tAcw, nOffered)', tier: 'Tier 2' },
  { term: 'Dimension', def: 'A categorical attribute used to group or filter data (e.g., queueId, userId, mediaType)', tier: 'Tier 2' },
  { term: 'Filter', def: 'A predicate that narrows the data set — by date, queue, agent, division, media type, or wrap-up code', tier: 'Tier 1' },
  { term: 'Export', def: 'A downloaded file (CSV or PDF) containing the current view data', tier: 'Tier 1' },
  { term: 'Detail Record', def: 'A row-level record of an individual conversation with all attributes and timestamps', tier: 'Tier 2' },
  { term: 'Summary', def: 'Aggregated data rolled up to a time interval — e.g., total calls handled per 30-minute window', tier: 'Tier 2' },
  { term: 'Real-Time', def: 'Data reflecting the current state with latency of 2-5 seconds, powered by observation queries', tier: 'Tier 1' },
  { term: 'Historical', def: 'Data about completed interactions, available after aggregation (5-30 minute delay)', tier: 'Tier 1' },
  { term: 'Observation Query', def: 'An API query that returns the current live state of queues or users (real-time snapshot)', tier: 'Tier 3' },
];

// ══════════════════════════════════════════════════════════════
// T2 DATA
// ══════════════════════════════════════════════════════════════
const PREREQUISITES = [
  { title: 'Analytics Permissions', detail: 'Users need Analytics > Conversation Aggregate/Detail > View, Analytics > Queue Observation > View, and Analytics > User Observation > View. For dashboards: Analytics > Dashboard Configuration > Add/Edit/View. Supervisors typically need the Analytics Viewer or Supervisor roles. Without proper permissions, views will show empty or restricted data.' },
  { title: 'Division Visibility', detail: 'Genesys Cloud uses Divisions to partition data access. An analytics user only sees data for queues and agents within their assigned divisions. If a supervisor sees partial data, check their division assignments under People > Roles. The "Home" division is the default for all objects.' },
  { title: 'Data Availability & Lag', detail: 'Real-time data updates every 2-5 seconds. Historical aggregate data is available after approximately 5-30 minutes. Conversation detail records appear within minutes of conversation end. Some speech analytics data may take up to 24 hours for full processing. Understand these windows to set correct expectations.' },
  { title: 'Retention Periods', detail: 'Interaction detail data: available for the last 2 years in the UI (7 years via API for some data types). Aggregated data: typically 2 years. Recording storage depends on policy — default 30 days, configurable up to 7 years. Screen recordings follow the same policy. Exports and downloads are available for 7 days after generation.' },
  { title: 'Media Type Configuration', detail: 'Analytics are organized by media type — voice, chat, email, message (SMS/WhatsApp), and callback. Ensure each media type is properly configured with queues, routing, and wrap-up codes to get meaningful analytics. Missing configuration leads to missing data.' },
];

const PERFORMANCE_VIEWS = [
  { name: 'Agent Performance Summary', desc: 'AHT, ACW, handle count, hold time, transfer rate per agent. Filter by date, queue, media type.', columns: 'Agent, Offered, Handled, AHT, ACW, Hold, Transfer, SLA', use: 'Compare agent efficiency, identify coaching opportunities' },
  { name: 'Agent Performance Detail', desc: 'Interval-level breakdown of each agent\'s activity — shows how performance changes throughout the day.', columns: 'Agent, Interval, Offered, Handled, AHT, Talk, Hold, ACW', use: 'Identify time-of-day performance patterns' },
  { name: 'Queue Performance Summary', desc: 'Service level, abandon rate, wait times, handle counts per queue. The most-used view for supervisors.', columns: 'Queue, Offered, Answered, Abandoned, SLA%, ASA, AHT, Max Wait', use: 'Monitor overall queue health and SLA compliance' },
  { name: 'Queue Performance Detail', desc: 'Interval-level queue data showing traffic patterns — when peaks and troughs occur.', columns: 'Queue, Interval, Offered, Answered, Abandoned, SLA%, ASA', use: 'Workforce planning, identifying peak hours' },
  { name: 'Flow Performance', desc: 'IVR and Architect flow metrics — entry counts, outcomes, average duration, transfer rates.', columns: 'Flow, Entries, Exits, Avg Duration, Transfer %, Disconnect %', use: 'Optimize IVR paths, identify drop-off points' },
  { name: 'Interactions View', desc: 'Searchable list of individual conversations with full detail: participants, timestamps, segments, recordings.', columns: 'Time, From, To, Queue, Agent, Duration, Wrap-Up, Direction', use: 'Find specific interactions, quality review, dispute resolution' },
  { name: 'Wrap-Up Performance', desc: 'Distribution of wrap-up codes across queues and agents — understand call outcomes.', columns: 'Wrap-Up Code, Count, %, Avg Handle Time', use: 'Identify common outcomes, optimize dispositions' },
  { name: 'Skills Performance', desc: 'How effectively skills-based routing matches agents with required competencies.', columns: 'Skill, Offered, Handled, SLA%, ASA, AHT', use: 'Skills gap analysis, training priorities' },
];

const WIDGET_TYPES = [
  { type: 'Metric', desc: 'Single large number showing a KPI value (e.g., "Current SLA: 87%")', icon: 'Hash', bestFor: 'At-a-glance KPIs, wallboards' },
  { type: 'Chart (Bar/Line/Pie)', desc: 'Visual data representation — bar charts for comparison, line charts for trends, pie charts for distribution', icon: 'BarChart3', bestFor: 'Trend analysis, volume distribution' },
  { type: 'Agent Status', desc: 'Real-time grid showing each agent\'s current state (Available, On Queue, ACW, Offline)', icon: 'Users', bestFor: 'Supervisor floor management' },
  { type: 'Queue Activity', desc: 'Live queue metrics — interactions waiting, longest wait, agents available', icon: 'Activity', bestFor: 'Real-time queue monitoring' },
  { type: 'Grid/Table', desc: 'Tabular data widget with sortable columns — a mini-view inside a dashboard', icon: 'Table', bestFor: 'Detailed breakdowns on dashboards' },
  { type: 'Web Content', desc: 'Embedded external URL — display external dashboards, CRM data, or custom web apps', icon: 'Monitor', bestFor: 'Integrating third-party content' },
];

const INTERACTION_FILTERS = [
  { filter: 'Date Range', desc: 'Start and end date/time. Maximum range varies by view (typically 31 days for detail, 6 months for summary).' },
  { filter: 'Queue', desc: 'One or more queues. Multi-select supported. Shows only interactions that passed through selected queues.' },
  { filter: 'Agent / User', desc: 'Specific agents. Useful for coaching reviews or individual performance analysis.' },
  { filter: 'Media Type', desc: 'Voice, Chat, Email, Message (SMS), Callback. Filter to a single channel or compare across channels.' },
  { filter: 'Direction', desc: 'Inbound, Outbound, or Both. Critical for separating inbound service from outbound campaigns.' },
  { filter: 'Wrap-Up Code', desc: 'Filter by disposition. Find all "Escalation" or "Complaint" interactions quickly.' },
  { filter: 'ANI / DNIS', desc: 'Caller number (ANI) or dialed number (DNIS). Use wildcards for partial matching (e.g., +1415*).' },
  { filter: 'Division', desc: 'Restrict results to specific organizational divisions. Inherited from role assignments.' },
  { filter: 'Evaluation Score', desc: 'Filter by quality evaluation score range. Find interactions scored below threshold for coaching.' },
];

const EXPORT_FORMATS = [
  { format: 'CSV', desc: 'Comma-separated values. Best for data analysis in Excel, Google Sheets, or import into BI tools. Includes all columns.', limit: 'Up to 100,000 rows per export in the UI; API supports larger sets via pagination' },
  { format: 'PDF', desc: 'Formatted document with headers and pagination. Best for sharing with stakeholders who need a readable report.', limit: 'Limited to current view rendering; best for summaries under 500 rows' },
  { format: 'Scheduled CSV', desc: 'Automated export delivered via email on a recurring schedule (daily, weekly, monthly). Configured per view.', limit: 'Same row limits as manual CSV; email attachment size limits apply (~25MB)' },
  { format: 'FTP Delivery', desc: 'Scheduled exports pushed to an SFTP server. Used for automated data warehouse ingestion or compliance archival.', limit: 'No attachment size limit; row limits still apply per export' },
];

const SUPERVISOR_REPORTS = [
  { report: 'Agent Status Summary', desc: 'Real-time view of all agents: current status, time in status, queue memberships, interaction counts today. The go-to view for floor supervision.', frequency: 'Real-time' },
  { report: 'Queue Summary Dashboard', desc: 'Combined view of all monitored queues: SLA, abandon rate, wait times, staffing levels. Highlights queues missing SLA targets.', frequency: 'Real-time + 15min intervals' },
  { report: 'Wrap-Up Summary', desc: 'Distribution of wrap-up codes by queue and time period. Reveals what types of contacts are driving volume.', frequency: 'Hourly / Daily' },
  { report: 'Skills Utilization', desc: 'Which skills are in high demand vs. available. Identifies skills gaps requiring cross-training or hiring.', frequency: 'Daily / Weekly' },
  { report: 'SLA Trending', desc: 'Service level plotted over time (hourly intervals across days or weeks). Reveals patterns: "SLA always drops at 2PM."', frequency: 'Daily / Weekly' },
  { report: 'Agent Adherence', desc: 'Compares agent actual states to their scheduled states (WFM integration). Shows who is on-schedule vs. off-schedule.', frequency: 'Real-time + Daily summary' },
];

const GAMIFICATION_FEATURES = [
  { feature: 'Performance Profiles', desc: 'Define which metrics matter for each team. Assign weights — e.g., AHT (30%), CSAT (40%), Adherence (30%).' },
  { feature: 'Scorecards', desc: 'Individual agent dashboards showing their metrics vs. targets. Color-coded (green/yellow/red) for instant comprehension.' },
  { feature: 'Leaderboards', desc: 'Ranked lists of top performers by metric or composite score. Visible to agents to encourage healthy competition.' },
  { feature: 'Goals & Targets', desc: 'Set specific targets per metric (e.g., AHT < 300s, CSAT > 4.2). Track progress over configurable periods.' },
  { feature: 'Contests', desc: 'Time-bound competitions with defined winners. "Most calls handled this week" or "Highest CSAT this month."' },
];

// ══════════════════════════════════════════════════════════════
// T3 DATA
// ══════════════════════════════════════════════════════════════
const DATA_ARCHITECTURE = [
  { layer: 'Conversation Model', desc: 'The canonical data structure. Every interaction is a Conversation containing Participants (customer, agent, IVR), each with Sessions, and each session containing Segments (interact, hold, ACW, dialing, etc.). This hierarchy is the foundation of all analytics.', retention: 'Detail: 7 years (API), 2 years (UI)' },
  { layer: 'Aggregate Records', desc: 'Pre-computed rollups of conversation data at configurable intervals (15min, 30min, 1hr, 1day). Stored as metric sums, averages, counts. Much faster to query than raw detail records. Powers most performance views.', retention: '2 years' },
  { layer: 'Observation Records', desc: 'Real-time snapshots of current state — queue depths, agent statuses, active conversations. Not stored long-term; they reflect the NOW. Powered by streaming infrastructure.', retention: 'Live only (not persisted)' },
  { layer: 'Flow Aggregate', desc: 'Aggregated metrics for Architect flows — entry counts, outcomes, durations, milestone hits. Separate from conversation aggregates.', retention: '2 years' },
  { layer: 'User Aggregate', desc: 'Agent-level aggregated metrics — status durations, handle counts, AHT by interval. Used for agent performance views.', retention: '2 years' },
];

const API_ENDPOINTS = [
  { method: 'POST', path: '/api/v2/analytics/conversations/aggregates/query', use: 'Aggregate conversation metrics (SLA, AHT, counts) grouped by interval and dimensions' },
  { method: 'POST', path: '/api/v2/analytics/conversations/details/query', use: 'Detailed conversation records with full participant/segment breakdown' },
  { method: 'POST', path: '/api/v2/analytics/conversations/details/jobs', use: 'Async detail query for large date ranges (returns job ID; poll for results)' },
  { method: 'POST', path: '/api/v2/analytics/queues/observations/query', use: 'Real-time queue state — waiting count, active count, agent availability' },
  { method: 'POST', path: '/api/v2/analytics/users/observations/query', use: 'Real-time user state — current status, routing status, active conversations' },
  { method: 'POST', path: '/api/v2/analytics/users/aggregates/query', use: 'Aggregate user metrics — handle counts, AHT, status durations per interval' },
  { method: 'POST', path: '/api/v2/analytics/flows/aggregates/query', use: 'Aggregate flow metrics — entry counts, outcomes, durations per interval' },
  { method: 'POST', path: '/api/v2/analytics/evaluations/aggregates/query', use: 'Quality evaluation aggregate metrics — scores, form completion rates' },
  { method: 'GET', path: '/api/v2/analytics/conversations/{conversationId}/details', use: 'Full detail for a single conversation (all participants, segments, attributes)' },
  { method: 'POST', path: '/api/v2/analytics/transcripts/aggregates/query', use: 'Speech/text analytics aggregates — sentiment, topics, compliance hits' },
];

const QUERY_EXAMPLES = [
  {
    title: 'Queue SLA by 30-Minute Intervals',
    desc: 'Calculate service level for a specific queue over the past 24 hours, bucketed into 30-minute intervals.',
    code: `POST /api/v2/analytics/conversations/aggregates/query
{
  "interval": "2024-01-15T00:00:00Z/2024-01-16T00:00:00Z",
  "granularity": "PT30M",
  "groupBy": ["queueId"],
  "filter": {
    "type": "and",
    "predicates": [
      { "dimension": "queueId", "value": "queue-uuid-here" },
      { "dimension": "mediaType", "value": "voice" }
    ]
  },
  "metrics": ["tAnswered", "tAbandon", "nOffered", "oServiceLevel"]
}`,
  },
  {
    title: 'Agent AHT Comparison',
    desc: 'Compare average handle time across all agents in a queue for the past week.',
    code: `POST /api/v2/analytics/conversations/aggregates/query
{
  "interval": "2024-01-08T00:00:00Z/2024-01-15T00:00:00Z",
  "groupBy": ["userId"],
  "filter": {
    "type": "and",
    "predicates": [
      { "dimension": "queueId", "value": "queue-uuid-here" }
    ]
  },
  "metrics": ["tHandle", "tTalk", "tHeld", "tAcw", "nHandled"]
}`,
  },
  {
    title: 'Real-Time Queue Observation',
    desc: 'Get current state of all queues — how many waiting, longest wait, agents available.',
    code: `POST /api/v2/analytics/queues/observations/query
{
  "filter": {
    "type": "or",
    "predicates": [
      { "dimension": "queueId", "value": "queue-1-uuid" },
      { "dimension": "queueId", "value": "queue-2-uuid" }
    ]
  },
  "metrics": ["oWaiting", "oInteracting", "oOnQueueUsers",
              "oActiveUsers", "oUserRoutingStatuses"]
}`,
  },
];

const EXTERNAL_TOOLS = [
  { name: 'Power BI', desc: 'Use the Genesys Cloud Data Actions or direct REST API calls to pull analytics data into Power BI datasets. Schedule refreshes or use streaming datasets for near-real-time dashboards. Best for organizations already invested in the Microsoft BI ecosystem.', setup: 'REST connector → Analytics API → Transform in Power Query → Dashboard' },
  { name: 'Tableau', desc: 'Connect via Web Data Connector or extract API data into Hyper files. Tableau excels at ad-hoc visual exploration of large datasets. Use the detail query jobs API for bulk historical data.', setup: 'Python/Tabpy script → Analytics API → Hyper extract → Tableau workbook' },
  { name: 'Grafana', desc: 'Use the JSON/Infinity data source plugin to query the Genesys Analytics API directly. Ideal for real-time operational dashboards with auto-refresh. Combine with alerting rules for threshold-based notifications.', setup: 'Infinity plugin → Analytics API → Grafana panels → Alert rules' },
  { name: 'Amazon EventBridge', desc: 'Genesys Cloud publishes events (conversation end, agent state change) to EventBridge. Use for event-driven analytics pipelines — route to S3, Lambda, Redshift, or QuickSight.', setup: 'GC EventBridge integration → Rule → Target (Lambda/S3/Kinesis)' },
];

const SPEECH_TEXT_FEATURES = [
  { feature: 'Sentiment Analysis', desc: 'Automated detection of positive, negative, and neutral sentiment throughout the conversation. Tracks sentiment changes over time — did the customer start angry and end satisfied?', config: 'Enabled at org level. Requires GC3 or Speech & Text Analytics add-on.' },
  { feature: 'Topic Detection', desc: 'Identifies predefined topics mentioned in conversations (e.g., "billing dispute", "cancel account", "upgrade request"). Uses phrase libraries with confidence scoring.', config: 'Admin > Speech & Text Analytics > Programs > Topics. Define phrases per topic.' },
  { feature: 'Agent Empathy Scoring', desc: 'AI-driven assessment of agent empathy based on language patterns, tone, and conversational cues. Scores agents on a scale for coaching purposes.', config: 'Enabled via Quality Management. Requires GC3 or add-on.' },
  { feature: 'Compliance Detection', desc: 'Monitors for required disclosures (e.g., "This call is being recorded"), prohibited phrases, or regulatory language. Flags non-compliant interactions.', config: 'Define compliance phrases in Programs. Set as required or prohibited.' },
  { feature: 'Transcript Search', desc: 'Full-text search across all conversation transcripts. Find any interaction where a specific word or phrase was used.', config: 'Automatic for all transcribed interactions. Search via Interaction view or API.' },
];

const PLATFORM_LIMITS = [
  ['Aggregate query max interval', '7 days per query', 'Use async jobs for longer ranges'],
  ['Detail query max interval', '31 days per query', 'Async jobs support up to 1 year'],
  ['Async job max interval', '1 year', 'Results available for 7 days after completion'],
  ['Max results per detail query page', '200 conversations', 'Use paging cursors for more'],
  ['Max dashboards per user', '20', 'Shared dashboards count separately'],
  ['Max widgets per dashboard', '20', ''],
  ['Max scheduled exports per org', '300', ''],
  ['Export row limit (UI)', '100,000 rows', 'API pagination for larger sets'],
  ['Conversation detail retention', '7 years (API) / 2 years (UI)', ''],
  ['Aggregate data retention', '2 years', ''],
  ['Recording retention', 'Policy-based (default 30 days)', 'Configurable up to 7 years'],
  ['Screen recording retention', 'Same as voice recording policy', ''],
  ['Real-time observation data', 'Live only (not stored)', 'Use aggregate queries for historical'],
  ['Max concurrent API queries', '300 per org', 'Rate limit: 10 requests/sec per endpoint'],
  ['Analytics API rate limit', '10 req/sec per route', 'Applies per endpoint, not globally'],
  ['Speech analytics processing', 'Near-real-time for short calls', 'Up to 24 hours for complex analysis'],
  ['Topic detection max topics', '500 per org', '20 phrases per topic'],
  ['Dashboard sharing', 'By user, role, or public', 'Public dashboards visible to all with access'],
];

const LICENSE_MATRIX = [
  ['Performance views (agent, queue)', true, true, true],
  ['Interactions view & search', true, true, true],
  ['Custom dashboards', true, true, true],
  ['Scheduled exports (CSV)', true, true, true],
  ['Real-time dashboards', true, true, true],
  ['Wallboard mode', true, true, true],
  ['Historical reporting API', true, true, true],
  ['Flow analytics', true, true, true],
  ['Gamification (basic)', false, true, true],
  ['Gamification (advanced contests)', false, false, true],
  ['Speech analytics', false, 'add-on', true],
  ['Text analytics', false, 'add-on', true],
  ['Sentiment analysis', false, 'add-on', true],
  ['Topic detection', false, 'add-on', true],
  ['Agent empathy scoring', false, false, true],
  ['Predictive analytics', false, false, true],
  ['EventBridge integration', true, true, true],
  ['Power BI / Tableau connectors', true, true, true],
];

const TROUBLESHOOTING = [
  { symptom: 'View shows no data or "No results"', investigation: 'Check date range (is it too narrow or in the future?). Verify queue/agent filters are not excluding everything. Confirm division access — user may not have visibility to the queues in question. Check that the media type filter matches (voice vs. chat). For new queues, data takes 5-30 minutes to appear in historical views.' },
  { symptom: 'Metrics look wrong or don\'t match expectations', investigation: 'Understand the metric definition: AHT includes talk + hold + ACW, not just talk time. Interval boundaries affect aggregation — a call spanning two intervals may be attributed to the end interval. Check timezone settings (views use the user\'s browser timezone). Filtered and unfiltered metrics differ — ensure filters match the comparison.' },
  { symptom: 'Scheduled export is not delivered', investigation: 'Verify the recipient email address. Check spam/junk folders. Confirm the schedule is active (not paused). For SFTP: verify credentials, host, path, and port. Check export row limits — if the query returns 0 rows, no file is sent. Review the export configuration date range (relative dates like "yesterday" may produce empty results on certain days).' },
  { symptom: 'Dashboard widgets show "Unable to load" or errors', investigation: 'Check that the underlying data source (queue, agent group) still exists and hasn\'t been deleted. Verify the user has Analytics > Dashboard Configuration > View permission. Widget time ranges must be valid. If a shared dashboard fails, the sharer\'s permissions may have changed.' },
  { symptom: 'API query returns 400 or empty results', investigation: 'Validate the interval format (ISO 8601 with timezone). Check that dimension values (queueId, userId) are valid UUIDs. Ensure metrics array contains valid metric names (case-sensitive). Verify filter predicate structure (type + dimension + value). For aggregate queries, granularity must divide evenly into the interval (e.g., PT30M into a 24-hour interval).' },
  { symptom: 'Speech analytics data missing for some calls', investigation: 'Confirm that speech analytics is enabled for the queue/flow. Check that recordings exist (speech analytics requires recorded audio). Very short calls (< 10 seconds) may not be analyzed. Processing can take up to 24 hours. Verify the language setting matches the conversation language.' },
];

// ══════════════════════════════════════════════════════════════
// SEARCH INDEX
// ══════════════════════════════════════════════════════════════
export const SEARCH_INDEX = (() => {
  const idx = [];
  SECTIONS.forEach(s => idx.push({ text: s.title, label: s.title, sectionId: s.id, tier: s.tier, type: 'Section' }));
  ANALYTICS_USE_CASES.forEach(u => idx.push({ text: `${u.label} ${u.desc}`, label: u.label, sectionId: 't1s1', tier: 0, type: 'Use Case' }));
  BUILDING_BLOCKS.forEach(b => idx.push({ text: `${b.label} ${b.sub}`, label: b.label, sectionId: 't1s2', tier: 0, type: 'Building Block' }));
  Object.entries(BLOCK_TOOLTIPS).forEach(([k, v]) => {
    const node = BUILDING_BLOCKS.find(n => n.id === k);
    idx.push({ text: `${node?.label || k} ${v.explanation} ${v.analogy}`, label: node?.label || k, sectionId: 't1s2', tier: 0, type: 'Building Block' });
  });
  ANALYTICS_TYPES.forEach(a => idx.push({ text: `${a.name} ${a.desc} ${a.examples.join(' ')} ${a.latency} ${a.bestFor}`, label: a.name, sectionId: 't1s3', tier: 0, type: 'Analytics Type' }));
  KEY_METRICS.forEach(m => idx.push({ text: `${m.metric} ${m.what} ${m.healthy} ${m.why}`, label: m.metric, sectionId: 't1s4', tier: 0, type: 'Metric' }));
  GLOSSARY.forEach(g => idx.push({ text: `${g.term} ${g.def} ${g.tier}`, label: g.term, sectionId: 't1s5', tier: 0, type: 'Glossary' }));
  PREREQUISITES.forEach(p => idx.push({ text: `${p.title} ${p.detail}`, label: p.title, sectionId: 't2s1', tier: 1, type: 'Prerequisite' }));
  PERFORMANCE_VIEWS.forEach(v => idx.push({ text: `${v.name} ${v.desc} ${v.columns} ${v.use}`, label: v.name, sectionId: 't2s2', tier: 1, type: 'View' }));
  WIDGET_TYPES.forEach(w => idx.push({ text: `${w.type} ${w.desc} ${w.bestFor}`, label: w.type, sectionId: 't2s3', tier: 1, type: 'Widget' }));
  INTERACTION_FILTERS.forEach(f => idx.push({ text: `${f.filter} ${f.desc}`, label: f.filter, sectionId: 't2s4', tier: 1, type: 'Filter' }));
  EXPORT_FORMATS.forEach(f => idx.push({ text: `${f.format} ${f.desc} ${f.limit}`, label: f.format, sectionId: 't2s6', tier: 1, type: 'Export' }));
  SUPERVISOR_REPORTS.forEach(r => idx.push({ text: `${r.report} ${r.desc} ${r.frequency}`, label: r.report, sectionId: 't2s8', tier: 1, type: 'Report' }));
  GAMIFICATION_FEATURES.forEach(f => idx.push({ text: `${f.feature} ${f.desc}`, label: f.feature, sectionId: 't2s7', tier: 1, type: 'Gamification' }));
  DATA_ARCHITECTURE.forEach(d => idx.push({ text: `${d.layer} ${d.desc} ${d.retention}`, label: d.layer, sectionId: 't3s1', tier: 2, type: 'Architecture' }));
  API_ENDPOINTS.forEach(e => idx.push({ text: `${e.method} ${e.path} ${e.use}`, label: `${e.method} ${e.path}`, sectionId: 't3s2', tier: 2, type: 'API' }));
  QUERY_EXAMPLES.forEach(q => idx.push({ text: `${q.title} ${q.desc} ${q.code}`, label: q.title, sectionId: 't3s4', tier: 2, type: 'Query Example' }));
  EXTERNAL_TOOLS.forEach(t => idx.push({ text: `${t.name} ${t.desc} ${t.setup}`, label: t.name, sectionId: 't3s3', tier: 2, type: 'External Tool' }));
  SPEECH_TEXT_FEATURES.forEach(f => idx.push({ text: `${f.feature} ${f.desc} ${f.config}`, label: f.feature, sectionId: 't3s5', tier: 2, type: 'Speech/Text Feature' }));
  PLATFORM_LIMITS.forEach(r => idx.push({ text: `${r[0]} ${r[1]} ${r[2]}`, label: r[0], sectionId: 't3s6', tier: 2, type: 'Limit' }));
  LICENSE_MATRIX.forEach(r => idx.push({ text: `${r[0]} GC1:${r[1]} GC2:${r[2]} GC3:${r[3]}`, label: String(r[0]), sectionId: 't3s7', tier: 2, type: 'License Feature' }));
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

const InteractiveTable = ({ headers, rows, searchable = false }) => {
  const [q, setQ] = useState('');
  const filtered = q ? rows.filter(r => r.some(c => String(c).toLowerCase().includes(q.toLowerCase()))) : rows;
  return (
    <div className="my-4">
      {searchable && <input className="w-full mb-3 px-3 py-2 rounded text-sm" style={{ backgroundColor: C.bg3, border: `1px solid ${C.border}`, color: C.t1, fontFamily: SANS }} placeholder="Search..." value={q} onChange={e => setQ(e.target.value)} />}
      <div className="overflow-x-auto rounded-lg" style={{ border: `1px solid ${C.border}` }}>
        <table className="w-full text-sm" style={{ fontFamily: SANS }}>
          <thead><tr>{headers.map((h, i) => <th key={i} className="text-left px-4 py-3 font-semibold" style={{ backgroundColor: C.bg3, color: C.t1, borderBottom: `1px solid ${C.border}`, fontFamily: MONO, fontSize: 12 }}>{h}</th>)}</tr></thead>
          <tbody>{filtered.map((row, ri) => <tr key={ri} className="transition-colors duration-150" style={{ backgroundColor: ri % 2 === 0 ? C.bg2 : C.bg1 }} onMouseEnter={e => e.currentTarget.style.backgroundColor = C.bg3} onMouseLeave={e => e.currentTarget.style.backgroundColor = ri % 2 === 0 ? C.bg2 : C.bg1}>{row.map((cell, ci) => <td key={ci} className="px-4 py-3" style={{ color: C.t2, borderBottom: `1px solid ${C.border}`, fontSize: 13 }}>{cell === true ? <span style={{ color: C.green }}>Yes</span> : cell === false ? <span style={{ color: C.red }}>No</span> : cell === 'add-on' ? <span style={{ color: C.yellow }}>Add-on</span> : cell}</td>)}</tr>)}</tbody>
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
// ANALYTICS MAP SVG (T1S2)
// ══════════════════════════════════════════════════════════════
const AnalyticsMapSVG = () => {
  const [active, setActive] = useState(null);
  return (
    <div className="my-6 overflow-x-auto">
      <svg viewBox="0 0 800 600" className="w-full" style={{ maxWidth: 800, minWidth: 600 }}>
        <defs>
          <filter id="glow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        {BUILDING_BLOCKS.map(n => (
          <line key={`line-${n.id}`} x1={MAP_CENTER.x} y1={MAP_CENTER.y} x2={n.x} y2={n.y} stroke={C.border} strokeWidth="2" strokeDasharray="6,4" />
        ))}
        <g>
          <rect x={MAP_CENTER.x - 80} y={MAP_CENTER.y - 30} width={160} height={60} rx={12} fill={C.bg3} stroke={C.orange} strokeWidth={2} />
          <text x={MAP_CENTER.x} y={MAP_CENTER.y - 5} textAnchor="middle" fill={C.t1} fontFamily={MONO} fontSize={13} fontWeight="bold">ANALYTICS</text>
          <text x={MAP_CENTER.x} y={MAP_CENTER.y + 15} textAnchor="middle" fill={C.t3} fontFamily={SANS} fontSize={10}>The data engine</text>
        </g>
        {BUILDING_BLOCKS.map(n => {
          const isActive = active === n.id;
          const tooltip = BLOCK_TOOLTIPS[n.id];
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
  const iconMap = { BarChart3, TrendingUp, Target, Users, Activity, Zap, Clock, Timer, FileText, CheckCircle, Star, AlertTriangle, RefreshCw };
  return (
    <div className="space-y-16">
      {/* T1S1 */}
      <section ref={el => sectionRefs.current['t1s1'] = el} id="t1s1">
        <SectionHeading>What Is Analytics in Genesys Cloud?</SectionHeading>
        <Paragraph>Analytics in Genesys Cloud is the comprehensive system that collects, processes, and presents data about every interaction in your contact center. It tracks what is happening right now, what happened in the past, and — with AI — what is likely to happen next.</Paragraph>
        <Paragraph>Think of analytics as the instrument panel in an airplane cockpit. It tells you where you are (real-time metrics), how fast you are going (current throughput), whether anything needs attention (alerts and thresholds), and what the conditions look like ahead (forecasting). Without it, you are flying blind.</Paragraph>
        <CalloutBox type="info">Genesys Cloud analytics is not a separate product — it is built into the platform. Every interaction automatically generates data that flows into views, dashboards, and APIs without any additional configuration.</CalloutBox>
        <SubHeading>What Analytics Enables</SubHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 my-4">
          {ANALYTICS_USE_CASES.map((uc, i) => {
            const IconComp = iconMap[uc.icon] || BarChart3;
            return (
              <div key={i} className="rounded-lg p-4 flex items-start gap-3 transition-all duration-200 hover:-translate-y-0.5" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
                <IconComp size={20} style={{ color: C.orange, flexShrink: 0 }} />
                <div><div className="font-semibold text-sm" style={{ color: C.t1, fontFamily: MONO }}>{uc.label}</div><div className="text-xs mt-1" style={{ color: C.t2, fontFamily: SANS }}>{uc.desc}</div></div>
              </div>
            );
          })}
        </div>
        <SubHeading>Real-Time vs Historical</SubHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          {[
            { title: 'REAL-TIME', items: ['What is happening NOW', 'Updates every 2-5 seconds', 'Queue depth, agent states, active calls', 'Powers wallboards and live supervision', 'Observation-based queries'], color: C.green },
            { title: 'HISTORICAL', items: ['What ALREADY happened', 'Available after 5-30 minutes', 'AHT, SLA trends, handle counts', 'Powers reports and trend analysis', 'Aggregate and detail queries'], color: C.blue },
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
        <SectionHeading>The Analytics Building Blocks</SectionHeading>
        <Paragraph>The analytics ecosystem in Genesys Cloud is composed of interconnected building blocks. Understanding each one — and how they relate — is the key to getting value from your data.</Paragraph>
        <CalloutBox type="tip">Click any node in the diagram below to see what it does and a simple analogy.</CalloutBox>
        <AnalyticsMapSVG />
        <SubHeading>Component Reference</SubHeading>
        <InteractiveTable
          headers={['Component', 'Explanation', 'Analogy']}
          rows={Object.entries(BLOCK_TOOLTIPS).map(([k, v]) => {
            const node = BUILDING_BLOCKS.find(n => n.id === k);
            return [node?.label || k, v.explanation, v.analogy];
          })}
        />
      </section>

      {/* T1S3 */}
      <section ref={el => sectionRefs.current['t1s3'] = el} id="t1s3">
        <SectionHeading>Types of Analytics</SectionHeading>
        <Paragraph>Genesys Cloud provides three categories of analytics, each serving a different time horizon and decision-making need. Understanding when to use each type is essential for effective contact center management.</Paragraph>
        <div className="space-y-4 my-4">
          {ANALYTICS_TYPES.map((at, i) => {
            const IconComp = iconMap[at.icon] || Activity;
            return (
              <div key={i} className="rounded-lg p-5" style={{ backgroundColor: C.bg2, borderLeft: `4px solid ${at.color}` }}>
                <div className="flex items-center gap-2 mb-3">
                  <IconComp size={20} style={{ color: at.color }} />
                  <span className="font-bold text-sm" style={{ color: at.color, fontFamily: MONO }}>{at.name}</span>
                </div>
                <div className="text-sm mb-3" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.7 }}>{at.desc}</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs font-semibold mb-1" style={{ color: C.t1, fontFamily: MONO }}>Examples:</div>
                    {at.examples.map((ex, j) => <div key={j} className="text-xs" style={{ color: C.t3 }}>- {ex}</div>)}
                  </div>
                  <div>
                    <div className="text-xs mb-1" style={{ color: C.t3 }}><span style={{ color: C.t1, fontFamily: MONO }}>Latency:</span> {at.latency}</div>
                    <div className="text-xs" style={{ color: C.t3 }}><span style={{ color: C.t1, fontFamily: MONO }}>Best for:</span> {at.bestFor}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <CalloutBox type="tip">A well-run contact center uses all three types simultaneously: real-time for immediate action, historical for planning, and predictive for proactive decisions.</CalloutBox>
      </section>

      {/* T1S4 */}
      <section ref={el => sectionRefs.current['t1s4'] = el} id="t1s4">
        <SectionHeading>Key Metrics Every Contact Center Tracks</SectionHeading>
        <Paragraph>These ten metrics form the foundation of contact center performance measurement. Every supervisor, manager, and executive should understand what they measure, what "good" looks like, and why they matter.</Paragraph>
        <div className="space-y-3 my-4">
          {KEY_METRICS.map((m, i) => {
            const IconComp = iconMap[m.icon] || Target;
            return (
              <ExpandableCard key={i} title={m.metric} accent={C.orange}>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <IconComp size={16} style={{ color: C.orange, flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <div><strong style={{ color: C.t1 }}>What it measures:</strong> {m.what}</div>
                      <div className="mt-1"><strong style={{ color: C.t1 }}>Healthy range:</strong> <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: C.green + '22', color: C.green }}>{m.healthy}</span></div>
                      <div className="mt-1"><strong style={{ color: C.t1 }}>Why it matters:</strong> {m.why}</div>
                    </div>
                  </div>
                </div>
              </ExpandableCard>
            );
          })}
        </div>
      </section>

      {/* T1S5 */}
      <section ref={el => sectionRefs.current['t1s5'] = el} id="t1s5">
        <SectionHeading>Key Terminology Glossary</SectionHeading>
        <Paragraph>A reference of essential analytics terms. Use the search bar to find specific concepts quickly.</Paragraph>
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
  const [activeViewTab, setActiveViewTab] = useState(0);
  return (
    <div className="space-y-16">
      {/* T2S1 */}
      <section ref={el => sectionRefs.current['t2s1'] = el} id="t2s1">
        <SectionHeading>Prerequisites — Permissions & Data Visibility</SectionHeading>
        <Paragraph>Before using analytics, ensure you have the right access. Data visibility in Genesys Cloud is controlled by permissions, roles, and divisions — getting these wrong means you see missing or incomplete data.</Paragraph>
        <div className="space-y-3 my-4">
          {PREREQUISITES.map((p, i) => (
            <ExpandableCard key={i} title={`${i + 1}. ${p.title}`} accent={C.blue}>
              {p.detail}
            </ExpandableCard>
          ))}
        </div>
        <SubHeading>Minimum Permissions for Common Roles</SubHeading>
        <InteractiveTable
          headers={['Role', 'Key Permissions', 'What They Can See']}
          rows={[
            ['Agent', 'Analytics > User Observation > View (self)', 'Own performance metrics, personal dashboard'],
            ['Supervisor', 'Analytics > Conversation Aggregate > View, Queue Observation > View', 'Queue and agent performance for assigned divisions'],
            ['Analyst', 'All Analytics View permissions, Dashboard Config', 'Full cross-org analytics, create shared dashboards'],
            ['Admin', 'All Analytics permissions, Routing > Queue > View', 'Everything including system configuration'],
          ]}
        />
      </section>

      {/* T2S2 */}
      <section ref={el => sectionRefs.current['t2s2'] = el} id="t2s2">
        <SectionHeading>Performance Views</SectionHeading>
        <Paragraph>Performance Views are the pre-built reporting pages in Genesys Cloud. They display tabular data with sortable columns, configurable filters, and export capabilities. Think of them as ready-made spreadsheets that auto-populate from your live data.</Paragraph>
        <div className="flex gap-1 mb-3 overflow-x-auto flex-wrap">
          {PERFORMANCE_VIEWS.map((v, i) => (
            <button key={i} className="px-3 py-1.5 rounded text-xs whitespace-nowrap cursor-pointer transition-colors" onClick={() => setActiveViewTab(i)} style={{ backgroundColor: activeViewTab === i ? C.blue : C.bg3, color: activeViewTab === i ? '#fff' : C.t2, fontFamily: MONO }}>{v.name.split(' ').slice(0, 2).join(' ')}</button>
          ))}
        </div>
        <div className="p-4 rounded-lg" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
          <div className="font-bold text-sm mb-2" style={{ color: C.t1, fontFamily: MONO }}>{PERFORMANCE_VIEWS[activeViewTab].name}</div>
          <div className="text-sm mb-3" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.7 }}>{PERFORMANCE_VIEWS[activeViewTab].desc}</div>
          <div className="text-xs mb-2" style={{ color: C.t3 }}><span style={{ color: C.blue, fontFamily: MONO }}>Key Columns:</span> {PERFORMANCE_VIEWS[activeViewTab].columns}</div>
          <div className="text-xs" style={{ color: C.t3 }}><span style={{ color: C.green, fontFamily: MONO }}>Best Use:</span> {PERFORMANCE_VIEWS[activeViewTab].use}</div>
        </div>
        <CalloutBox type="tip">All performance views support column customization. Click the column settings icon to add, remove, or reorder columns. Your column preferences are saved per-user and persist across sessions.</CalloutBox>
        <SubHeading>Pre-Built vs Custom Views</SubHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="rounded-lg p-4" style={{ backgroundColor: C.bg2, borderTop: `3px solid ${C.blue}` }}>
            <div className="font-bold text-sm mb-3" style={{ color: C.blue, fontFamily: MONO }}>PRE-BUILT VIEWS</div>
            {['Maintained by Genesys — columns updated with releases', 'Cannot be deleted or fundamentally changed', 'Filters and column order are customizable', 'New views added regularly with platform updates', 'Found under Performance menu'].map((item, j) => <div key={j} className="text-xs mb-1" style={{ color: C.t3 }}>- {item}</div>)}
          </div>
          <div className="rounded-lg p-4" style={{ backgroundColor: C.bg2, borderTop: `3px solid ${C.orange}` }}>
            <div className="font-bold text-sm mb-3" style={{ color: C.orange, fontFamily: MONO }}>CUSTOM VIEWS (via Dashboards)</div>
            {['Built by you using dashboard widgets', 'Full control over layout and metrics', 'Can combine data from multiple sources', 'Shareable with other users/teams', 'Found under Dashboards menu'].map((item, j) => <div key={j} className="text-xs mb-1" style={{ color: C.t3 }}>- {item}</div>)}
          </div>
        </div>
      </section>

      {/* T2S3 */}
      <section ref={el => sectionRefs.current['t2s3'] = el} id="t2s3">
        <SectionHeading>Dashboards & Widgets</SectionHeading>
        <Paragraph>Dashboards are the customizable canvases where you build your own analytics experience. Each dashboard contains widgets — individual visual components that display specific data. Together, they form your personalized command center.</Paragraph>
        <SubHeading>Widget Types</SubHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 my-4">
          {WIDGET_TYPES.map((w, i) => {
            const IconComp = { Hash, BarChart3, Users, Activity, Table, Monitor }[w.icon] || BarChart3;
            return (
              <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
                <div className="flex items-center gap-2 mb-2">
                  <IconComp size={16} style={{ color: C.blue }} />
                  <span className="font-semibold text-sm" style={{ color: C.t1, fontFamily: MONO }}>{w.type}</span>
                </div>
                <div className="text-xs mb-2" style={{ color: C.t2, fontFamily: SANS }}>{w.desc}</div>
                <div className="text-xs px-2 py-1 rounded inline-block" style={{ backgroundColor: C.bg3, color: C.t3 }}>Best for: {w.bestFor}</div>
              </div>
            );
          })}
        </div>
        <SubHeading>Dashboard Management</SubHeading>
        <div className="space-y-2 my-3">
          {[
            ['Creating', 'Performance > Dashboards > + New Dashboard. Give it a name, then drag widgets onto the canvas. Resize and reposition freely.'],
            ['Sharing', 'Click the share icon on any dashboard. Share with specific users, roles, or make it public (visible to everyone with analytics permissions). Shared dashboards show in the recipient\'s Dashboards list.'],
            ['Favorites', 'Star any dashboard to add it to your Favorites list. Your favorite dashboard can be set as the default landing page.'],
            ['Layout', 'Widgets snap to a responsive grid. Dashboards work on desktop and tablet. For wallboard use, enable full-screen mode and auto-refresh.'],
            ['Cloning', 'Duplicate an existing dashboard as a starting point. Useful for creating team-specific variants of a standard layout.'],
          ].map(([label, desc], i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-1 p-3 rounded" style={{ backgroundColor: C.bg2 }}>
              <span className="text-xs font-semibold whitespace-nowrap min-w-[100px]" style={{ color: C.blue, fontFamily: MONO }}>{label}:</span>
              <span className="text-xs" style={{ color: C.t2, fontFamily: SANS }}>{desc}</span>
            </div>
          ))}
        </div>
        <CalloutBox type="info">The Channel Insights dashboard gives supervisors a single cross-channel view of adoption and performance metrics spanning voice, digital messaging, email, and chat. It provides time-based visualizations for volume, resolution rates, sentiment, and virtual agent activity — eliminating the need to switch between separate per-channel dashboards to understand overall contact center performance.</CalloutBox>
      </section>

      {/* T2S4 */}
      <section ref={el => sectionRefs.current['t2s4'] = el} id="t2s4">
        <SectionHeading>Conversation Detail & Interaction Search</SectionHeading>
        <Paragraph>The Interactions view is your investigation tool. It lets you find specific conversations using powerful filters, then drill into every detail: participant timeline, segment breakdown, recordings, transcripts, evaluations, and metadata.</Paragraph>
        <SubHeading>Available Filters</SubHeading>
        <div className="space-y-2 my-4">
          {INTERACTION_FILTERS.map((f, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-1 p-3 rounded" style={{ backgroundColor: C.bg2 }}>
              <span className="text-xs font-semibold whitespace-nowrap min-w-[130px]" style={{ color: C.blue, fontFamily: MONO }}>{f.filter}:</span>
              <span className="text-xs" style={{ color: C.t2, fontFamily: SANS }}>{f.desc}</span>
            </div>
          ))}
        </div>
        <SubHeading>What You See in Conversation Detail</SubHeading>
        <div className="my-4 p-4 rounded-lg space-y-3" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
          {[
            { label: 'Participant Timeline', desc: 'Visual timeline showing each participant\'s involvement: when they joined, hold periods, transfers, and disconnect', color: C.green },
            { label: 'Segment Breakdown', desc: 'Each phase (IVR, queue wait, interact, hold, ACW) with exact durations and timestamps', color: C.blue },
            { label: 'Recording Playback', desc: 'Audio/screen recording with synchronized transcript (if speech analytics enabled)', color: C.purple },
            { label: 'Transcript View', desc: 'Full conversation text with speaker labels, sentiment indicators, and keyword highlighting', color: C.orange },
            { label: 'Attributes & Metadata', desc: 'ANI, DNIS, wrap-up code, external tags, participant data, flow outcomes', color: C.yellow },
            { label: 'Quality Evaluations', desc: 'Any evaluations performed on this interaction with scores and evaluator notes', color: C.red },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: item.color }} />
              <div>
                <span className="text-xs font-semibold" style={{ color: C.t1, fontFamily: MONO }}>{item.label}: </span>
                <span className="text-xs" style={{ color: C.t3 }}>{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
        <CalloutBox type="info">Use the transcript search to find interactions where specific words or phrases were spoken — for example, search for "cancel my account" across all calls in a date range.</CalloutBox>
        <CalloutBox type="info">Sensitive data masking support has expanded to additional languages. Voice transcripts now support masking for Arabic (ar), Hindi India (hi-IN), Japanese Japan (jp-JP), and Korean Korea (ko-KR). Chat and messaging transcripts add masking for Arabic, Dutch Netherlands, Hindi India, Japanese Japan, and Korean Korea. This prevents PII and PCI data from appearing in transcripts and analytics across a broader set of languages.</CalloutBox>
        <CalloutBox type="info">Extended Voice Transcription Services (EVTS) has completed its transition to Amazon Transcribe as the sole transcription provider for all supported languages. Previously, EVTS used a dual-provider model with both Microsoft Azure and Amazon Transcribe. All existing analytics behavior is retained across 38 supported languages.</CalloutBox>
      </section>

      {/* T2S5 */}
      <section ref={el => sectionRefs.current['t2s5'] = el} id="t2s5">
        <SectionHeading>Real-Time Dashboards & Wallboards</SectionHeading>
        <Paragraph>Real-time dashboards show what is happening right now in your contact center. They are the operational nerve center for supervisors managing the floor and the source of wallboard displays visible to the entire team.</Paragraph>
        <SubHeading>Key Real-Time Views</SubHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
          {[
            { name: 'Queue Activity View', desc: 'Live queue metrics: interactions waiting, longest wait time, agents on queue, service level. Auto-refreshes every few seconds. The most critical real-time view for operations.', color: C.green },
            { name: 'Agents View', desc: 'Current state of every agent: Available, On Queue, Busy, ACW, Break, Offline. Shows time in current state and active interaction count. Essential for floor management.', color: C.blue },
            { name: 'Real-Time Alerts', desc: 'Configure threshold-based alerts: "Notify me when wait time exceeds 60 seconds" or "Alert when available agents drop below 3." Alerts appear as in-app notifications.', color: C.yellow },
            { name: 'Wallboard Mode', desc: 'Full-screen mode optimized for large displays. Hides navigation, maximizes data visibility. Auto-refresh ensures data is always current. Cycle between multiple dashboards on a timer.', color: C.purple },
          ].map((view, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, borderLeft: `4px solid ${view.color}` }}>
              <div className="font-bold text-sm mb-2" style={{ color: view.color, fontFamily: MONO }}>{view.name}</div>
              <div className="text-xs" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.6 }}>{view.desc}</div>
            </div>
          ))}
        </div>
        <SubHeading>Auto-Refresh Intervals</SubHeading>
        <Paragraph>Real-time views refresh automatically. Queue and agent observation data updates every 2-5 seconds. Aggregate widgets on dashboards can be configured with refresh intervals from 30 seconds to 5 minutes. More frequent refreshes increase API usage and should be balanced against platform rate limits (especially for organizations with many concurrent dashboard users).</Paragraph>
        <CalloutBox type="tip">For wallboards, use the browser's auto-refresh combined with Genesys Cloud's built-in refresh. Set dashboards to cycle on a 30-60 second timer to show multiple views on a single screen.</CalloutBox>
      </section>

      {/* T2S6 */}
      <section ref={el => sectionRefs.current['t2s6'] = el} id="t2s6">
        <SectionHeading>Data Export & Scheduled Reports</SectionHeading>
        <Paragraph>While dashboards serve real-time and interactive needs, exports and scheduled reports serve compliance, archival, and offline analysis needs. Genesys Cloud supports multiple export mechanisms.</Paragraph>
        <SubHeading>Export Formats & Delivery</SubHeading>
        <div className="space-y-3 my-4">
          {EXPORT_FORMATS.map((f, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
              <div className="font-semibold text-sm mb-2" style={{ color: C.t1, fontFamily: MONO }}>{f.format}</div>
              <div className="text-xs mb-2" style={{ color: C.t2, fontFamily: SANS }}>{f.desc}</div>
              <div className="text-xs px-2 py-1 rounded inline-block" style={{ backgroundColor: C.bg3, color: C.t3 }}>Limit: {f.limit}</div>
            </div>
          ))}
        </div>
        <SubHeading>Setting Up Scheduled Exports</SubHeading>
        <div className="my-4 space-y-0">
          {[
            { step: 1, title: 'Navigate to the view', desc: 'Open the performance view you want to schedule (e.g., Queue Performance Summary)', color: C.blue },
            { step: 2, title: 'Configure filters', desc: 'Set all filters exactly as you want them in the export — queue, date range (relative), media type', color: C.green },
            { step: 3, title: 'Click Schedule Export', desc: 'Found in the export dropdown menu (top-right of the view)', color: C.orange },
            { step: 4, title: 'Set recurrence', desc: 'Daily, weekly, or monthly. Choose delivery time (UTC). Select relative date range ("Yesterday", "Last 7 days")', color: C.purple },
            { step: 5, title: 'Add recipients', desc: 'Email addresses for delivery. For SFTP, configure the connection details (host, port, path, credentials)', color: C.blue },
          ].map((s, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: s.color + '22', color: s.color, border: `2px solid ${s.color}`, fontFamily: MONO }}>{s.step}</div>
                {i < 4 && <div className="w-0.5 flex-1 my-1" style={{ backgroundColor: C.border }} />}
              </div>
              <div className="pb-4 flex-1">
                <div className="font-bold text-sm mb-1" style={{ color: C.t1, fontFamily: MONO }}>{s.title}</div>
                <div className="text-xs" style={{ color: C.t2, fontFamily: SANS }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <CalloutBox type="warning">Scheduled exports use relative date ranges. If you schedule a "Yesterday" export for 6:00 AM UTC, it will export the previous day's data. Ensure your timezone expectations align with UTC to avoid one-day-off issues.</CalloutBox>
      </section>

      {/* T2S7 */}
      <section ref={el => sectionRefs.current['t2s7'] = el} id="t2s7">
        <SectionHeading>Gamification & Agent Scorecards</SectionHeading>
        <Paragraph>Gamification transforms raw metrics into motivational tools. By making performance visible, competitive, and goal-oriented, it drives agent engagement and improvement without adding management overhead.</Paragraph>
        <div className="space-y-3 my-4">
          {GAMIFICATION_FEATURES.map((f, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
              <div className="flex items-center gap-2 mb-2">
                <Award size={16} style={{ color: C.orange }} />
                <span className="font-semibold text-sm" style={{ color: C.t1, fontFamily: MONO }}>{f.feature}</span>
              </div>
              <div className="text-xs" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
        <CalloutBox type="info">Gamification in Genesys Cloud requires GC2 (basic) or GC3 (advanced contests). Performance profiles and scorecards are configured under Admin &gt; Performance &gt; Gamification.</CalloutBox>
      </section>

      {/* T2S8 */}
      <section ref={el => sectionRefs.current['t2s8'] = el} id="t2s8">
        <SectionHeading>Key Reports for Supervisors</SectionHeading>
        <Paragraph>Supervisors need a curated set of reports that answer their daily questions: "How is my team doing?", "Are we meeting SLA?", "Who needs coaching?", and "What is driving today's volume?" Here are the essential reports.</Paragraph>
        <div className="space-y-3 my-4">
          {SUPERVISOR_REPORTS.map((r, i) => (
            <div key={i} className="rounded-lg p-4 flex flex-col sm:flex-row sm:items-start gap-3" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
              <div className="flex-1">
                <div className="font-semibold text-sm mb-1" style={{ color: C.t1, fontFamily: MONO }}>{r.report}</div>
                <div className="text-xs" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.6 }}>{r.desc}</div>
              </div>
              <span className="text-xs px-2 py-1 rounded whitespace-nowrap self-start" style={{ backgroundColor: C.bg3, color: C.t3, fontFamily: MONO }}>{r.frequency}</span>
            </div>
          ))}
        </div>
        <SubHeading>Building a Supervisor Dashboard</SubHeading>
        <Paragraph>The recommended supervisor dashboard combines: (1) a real-time queue activity widget showing SLA and wait times, (2) an agent status grid showing who is available/busy/offline, (3) a metric widget for today's total handled count, (4) a line chart showing SLA trend over the past 8 hours, and (5) a wrap-up code distribution chart. This gives a complete operational picture at a glance.</Paragraph>
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
      <SectionHeading>Data Architecture & Retention</SectionHeading>
      <Paragraph>Understanding how Genesys Cloud stores and processes analytics data is essential for building efficient queries, troubleshooting missing data, and designing integration architectures. The data model is hierarchical and purpose-built for contact center analytics.</Paragraph>
      <SubHeading>Data Layers</SubHeading>
      <div className="space-y-3 my-4">
        {DATA_ARCHITECTURE.map((d, i) => (
          <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, borderLeft: `4px solid ${[C.purple, C.blue, C.green, C.orange, C.yellow][i]}` }}>
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <span className="font-bold text-sm" style={{ color: [C.purple, C.blue, C.green, C.orange, C.yellow][i], fontFamily: MONO }}>{d.layer}</span>
              <span className="text-[10px] px-2 py-0.5 rounded" style={{ backgroundColor: C.bg3, color: C.t3 }}>{d.retention}</span>
            </div>
            <div className="text-xs" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.6 }}>{d.desc}</div>
          </div>
        ))}
      </div>
      <SubHeading>The Conversation Hierarchy</SubHeading>
      <div className="my-4 p-4 rounded-lg" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
        {[
          { indent: 0, text: 'CONVERSATION (top-level entity, unique ID)', color: C.purple },
          { indent: 1, text: 'PARTICIPANT: Customer (external)', color: C.blue },
          { indent: 2, text: 'SESSION: Phone call connection', color: C.t2 },
          { indent: 3, text: 'SEGMENT: IVR (duration: 45s)', color: C.t3 },
          { indent: 3, text: 'SEGMENT: Queue Wait (duration: 22s)', color: C.t3 },
          { indent: 1, text: 'PARTICIPANT: IVR / Flow', color: C.orange },
          { indent: 2, text: 'SESSION: Flow execution', color: C.t2 },
          { indent: 3, text: 'SEGMENT: System processing', color: C.t3 },
          { indent: 1, text: 'PARTICIPANT: Agent (internal)', color: C.green },
          { indent: 2, text: 'SESSION: Agent handling', color: C.t2 },
          { indent: 3, text: 'SEGMENT: Interact (talk time: 3m 15s)', color: C.t3 },
          { indent: 3, text: 'SEGMENT: Hold (duration: 30s)', color: C.t3 },
          { indent: 3, text: 'SEGMENT: Interact (resumed: 1m 45s)', color: C.t3 },
          { indent: 3, text: 'SEGMENT: ACW (wrap-up: 25s)', color: C.t3 },
        ].map((line, i) => (
          <div key={i} className="text-xs" style={{ paddingLeft: line.indent * 24, color: line.color, fontFamily: MONO, marginBottom: 2 }}>{line.text}</div>
        ))}
      </div>
      <CalloutBox type="info">Every segment records a start timestamp, end timestamp, segment type, disconnect type (if applicable), and references to participants. This granularity enables precise reconstruction of any interaction.</CalloutBox>
    </section>

    {/* T3S2 */}
    <section ref={el => sectionRefs.current['t3s2'] = el} id="t3s2">
      <SectionHeading>Analytics API</SectionHeading>
      <Paragraph>The Analytics API provides programmatic access to all analytics data in Genesys Cloud. It supports aggregate queries (summarized data), detail queries (individual conversations), and observation queries (real-time state). These APIs power external integrations, custom reports, and data warehouse feeds.</Paragraph>
      <SubHeading>Key API Endpoints</SubHeading>
      <InteractiveTable searchable headers={['Method', 'Endpoint', 'Use']} rows={API_ENDPOINTS.map(e => [e.method, e.path, e.use])} />
      <SubHeading>Query Body Structure</SubHeading>
      <Paragraph>All analytics query endpoints use a POST body with a common structure: an interval (ISO 8601 time range), optional granularity (for bucketing), a filter object (predicates with dimensions and values), a metrics array, and optional groupBy dimensions.</Paragraph>
      <CodeBlock>{`// Common query structure
{
  "interval": "start_datetime/end_datetime",  // ISO 8601
  "granularity": "PT30M",                     // Optional: PT15M, PT30M, PT1H, P1D
  "groupBy": ["queueId", "mediaType"],        // Optional: dimensions to group by
  "filter": {
    "type": "and",                             // "and" or "or"
    "predicates": [
      { "dimension": "queueId", "value": "uuid" },
      { "dimension": "mediaType", "value": "voice" }
    ]
  },
  "metrics": ["tHandle", "nOffered", "oServiceLevel"]  // What to measure
}`}</CodeBlock>
      <SubHeading>Async Queries for Large Date Ranges</SubHeading>
      <Paragraph>For detail queries spanning more than 31 days, use the async jobs endpoint. It returns a job ID immediately, and you poll for completion. Results are available for 7 days after the job finishes. This avoids query timeouts and rate limit pressure.</Paragraph>
      <CodeBlock>{`// Step 1: Submit async job
POST /api/v2/analytics/conversations/details/jobs
{ "interval": "2024-01-01T00:00:00Z/2024-06-30T23:59:59Z", ... }
// Response: { "jobId": "abc-123", "state": "QUEUED" }

// Step 2: Poll for completion
GET /api/v2/analytics/conversations/details/jobs/abc-123
// Response: { "state": "FULFILLED" }  (or QUEUED, PROCESSING, FAILED)

// Step 3: Fetch results (paginated)
GET /api/v2/analytics/conversations/details/jobs/abc-123/results?cursor=...`}</CodeBlock>
    </section>

    {/* T3S3 */}
    <section ref={el => sectionRefs.current['t3s3'] = el} id="t3s3">
      <SectionHeading>Custom Dashboards with External Tools</SectionHeading>
      <Paragraph>While Genesys Cloud's built-in dashboards cover most needs, some organizations require deeper analysis, cross-system correlation, or advanced visualizations. External BI tools connect to Genesys Cloud via the Analytics API or event streams.</Paragraph>
      <div className="space-y-3 my-4">
        {EXTERNAL_TOOLS.map((tool, i) => (
          <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
            <div className="font-bold text-sm mb-2" style={{ color: C.t1, fontFamily: MONO }}>{tool.name}</div>
            <div className="text-xs mb-3" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.6 }}>{tool.desc}</div>
            <div className="text-xs p-2 rounded" style={{ backgroundColor: C.bg3, color: C.t3, fontFamily: MONO }}>{tool.setup}</div>
          </div>
        ))}
      </div>
      <CalloutBox type="tip">For near-real-time dashboards in external tools, use the observation queries (queue/user) with 30-second polling. For historical reporting, schedule nightly data pulls using the async detail jobs API to avoid rate limits during business hours.</CalloutBox>
      <SubHeading>Data Actions for Real-Time Feeds</SubHeading>
      <Paragraph>Genesys Cloud Data Actions can call external APIs mid-interaction or on schedule. Use them to push real-time event data to external dashboards, update CRM records, or trigger webhooks when specific conditions occur. Combined with EventBridge, this creates a powerful event-driven analytics pipeline.</Paragraph>
    </section>

    {/* T3S4 */}
    <section ref={el => sectionRefs.current['t3s4'] = el} id="t3s4">
      <SectionHeading>Analytics Query Language</SectionHeading>
      <Paragraph>The analytics query body uses a structured filter syntax with predicates, dimensions, metrics, and intervals. Mastering this query language is essential for building efficient API integrations and custom reports.</Paragraph>
      <SubHeading>Predicates & Dimensions</SubHeading>
      <InteractiveTable
        headers={['Dimension', 'Type', 'Example Values']}
        rows={[
          ['queueId', 'UUID', 'Single queue or list of queue UUIDs'],
          ['userId', 'UUID', 'Agent user ID(s)'],
          ['mediaType', 'Enum', 'voice, chat, email, message, callback'],
          ['direction', 'Enum', 'inbound, outbound'],
          ['wrapUpCode', 'String', 'Any configured wrap-up code name'],
          ['divisionId', 'UUID', 'Organizational division'],
          ['conversationEnd', 'DateTime', 'When the conversation completed'],
          ['originatingDirection', 'Enum', 'Original direction before transfers'],
          ['flowId', 'UUID', 'Architect flow that processed the interaction'],
          ['purpose', 'Enum', 'customer, agent, user, ivr, acd, group'],
        ]}
      />
      <SubHeading>Common Metrics</SubHeading>
      <InteractiveTable
        headers={['Metric', 'Type', 'Description']}
        rows={[
          ['nOffered', 'Count', 'Number of interactions offered (entered queue)'],
          ['nHandled', 'Count', 'Number of interactions answered by an agent'],
          ['tHandle', 'Duration', 'Total handle time (talk + hold + ACW)'],
          ['tTalk', 'Duration', 'Time actively talking to the customer'],
          ['tHeld', 'Duration', 'Total time the customer was on hold'],
          ['tAcw', 'Duration', 'After-call work time'],
          ['tWait', 'Duration', 'Time waiting in queue before answer'],
          ['tAnswered', 'Duration', 'Time to answer from queue entry'],
          ['tAbandon', 'Duration', 'Time before customer abandoned'],
          ['nTransferred', 'Count', 'Number of transfers'],
          ['oServiceLevel', 'Percentage', 'Service level (configured target)'],
          ['oWaiting', 'Observation', 'Current number waiting in queue (real-time only)'],
        ]}
      />
      <SubHeading>Example Complex Queries</SubHeading>
      <div className="space-y-4 my-4">
        {QUERY_EXAMPLES.map((ex, i) => (
          <ExpandableCard key={i} title={ex.title} accent={C.purple}>
            <div className="text-sm mb-2" style={{ color: C.t2 }}>{ex.desc}</div>
            <CodeBlock>{ex.code}</CodeBlock>
          </ExpandableCard>
        ))}
      </div>
      <CalloutBox type="warning">
        <strong>Granularity rules:</strong> The granularity value must divide evenly into the interval duration. PT30M works for 24-hour intervals (48 buckets), but PT45M does not (would produce fractional buckets). The API returns a 400 error for invalid granularity values.
      </CalloutBox>
    </section>

    {/* T3S5 */}
    <section ref={el => sectionRefs.current['t3s5'] = el} id="t3s5">
      <SectionHeading>Speech & Text Analytics</SectionHeading>
      <Paragraph>Speech and Text Analytics uses AI and natural language processing to extract meaning from conversations. It goes beyond raw metrics to understand what was said, how it was said, and whether it met compliance requirements.</Paragraph>
      <div className="space-y-3 my-4">
        {SPEECH_TEXT_FEATURES.map((f, i) => (
          <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, borderLeft: `4px solid ${[C.green, C.blue, C.purple, C.red, C.orange][i]}` }}>
            <div className="font-bold text-sm mb-2" style={{ color: [C.green, C.blue, C.purple, C.red, C.orange][i], fontFamily: MONO }}>{f.feature}</div>
            <div className="text-xs mb-2" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.6 }}>{f.desc}</div>
            <div className="text-xs p-2 rounded" style={{ backgroundColor: C.bg3, color: C.t3 }}>{f.config}</div>
          </div>
        ))}
      </div>
      <SubHeading>Topic Detection Configuration</SubHeading>
      <div className="my-4 p-4 rounded-lg" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
        {[
          { indent: 0, text: 'Admin > Speech & Text Analytics > Programs', color: C.purple },
          { indent: 1, text: 'Program: "Customer Retention" (groups related topics)', color: C.blue },
          { indent: 2, text: 'Topic: "Cancel Account"', color: C.orange },
          { indent: 3, text: 'Phrases: "cancel my account", "close my account", "stop service"', color: C.t3 },
          { indent: 3, text: 'Phrases: "no longer need", "switching providers", "end subscription"', color: C.t3 },
          { indent: 2, text: 'Topic: "Billing Dispute"', color: C.orange },
          { indent: 3, text: 'Phrases: "overcharged", "wrong amount", "billing error"', color: C.t3 },
          { indent: 3, text: 'Phrases: "unauthorized charge", "refund request"', color: C.t3 },
          { indent: 2, text: 'Topic: "Upgrade Interest"', color: C.orange },
          { indent: 3, text: 'Phrases: "upgrade", "better plan", "more features", "premium"', color: C.t3 },
        ].map((line, i) => (
          <div key={i} className="text-xs" style={{ paddingLeft: line.indent * 20, color: line.color, fontFamily: MONO, marginBottom: 2 }}>{line.text}</div>
        ))}
      </div>
      <CalloutBox type="info">Topic detection runs asynchronously after the conversation ends. Results are typically available within minutes for short calls and up to 24 hours for complex multi-party interactions. Topics are surfaced in the Interaction view, Analytics API, and dashboards.</CalloutBox>
    </section>

    {/* T3S6 */}
    <section ref={el => sectionRefs.current['t3s6'] = el} id="t3s6">
      <SectionHeading>Platform Limits — The Complete Reference</SectionHeading>
      <Paragraph>Know the boundaries before you hit them. These platform limits affect API integrations, dashboard design, and data retention planning.</Paragraph>
      <InteractiveTable searchable headers={['Resource', 'Limit', 'Notes']} rows={PLATFORM_LIMITS} />
    </section>

    {/* T3S7 */}
    <section ref={el => sectionRefs.current['t3s7'] = el} id="t3s7">
      <SectionHeading>Licensing & Feature Matrix</SectionHeading>
      <Paragraph>Analytics capabilities vary by Genesys Cloud license tier. Core reporting is available in all tiers, while speech analytics and advanced gamification require higher tiers or add-ons.</Paragraph>
      <InteractiveTable headers={['Feature', 'GC1', 'GC2', 'GC3']} rows={LICENSE_MATRIX} />
      <CalloutBox type="info">GC1 provides comprehensive base analytics including all performance views, dashboards, and the Analytics API. GC2 adds basic gamification. GC3 includes the full speech and text analytics suite, advanced gamification, and predictive analytics.</CalloutBox>
    </section>

    {/* T3S8 */}
    <section ref={el => sectionRefs.current['t3s8'] = el} id="t3s8">
      <SectionHeading>Troubleshooting Analytics Issues</SectionHeading>
      <Paragraph>When analytics data looks wrong, is missing, or fails to load, use these investigation paths to diagnose the root cause. Click each symptom to expand the investigation steps.</Paragraph>
      <div className="space-y-3 my-4">
        {TROUBLESHOOTING.map((t, i) => (
          <ExpandableCard key={i} title={t.symptom} accent={C.purple}>
            <div className="text-sm" style={{ lineHeight: 1.7 }}>{t.investigation}</div>
          </ExpandableCard>
        ))}
      </div>
      <SubHeading>Common Diagnostic Steps</SubHeading>
      <div className="my-4 p-4 rounded-lg space-y-2" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
        {[
          'Verify permissions: Admin > People > Roles > Check Analytics permissions for the affected user',
          'Check divisions: Admin > People > User > Roles tab > Verify division assignments match expected queues',
          'Test with API: Use the Developer Tools (developer.genesys.cloud) to run a raw API query and compare results',
          'Check data availability: Historical data has a 5-30 minute lag; real-time observation data is live-only',
          'Validate timezone: All API intervals are UTC; UI displays in browser timezone; mismatches cause date-offset issues',
          'Review rate limits: Check for 429 responses in browser DevTools network tab — indicates API throttling',
          'Audit filters: Remove all filters and verify data appears, then add filters back one at a time to isolate the issue',
        ].map((step, i) => (
          <div key={i} className="text-xs flex items-start gap-2" style={{ color: C.t2, fontFamily: SANS }}>
            <span className="font-bold" style={{ color: C.purple }}>{i + 1}.</span> {step}
          </div>
        ))}
      </div>
    </section>
  </div>
);

// ══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════
const GenesysAnalyticsGuide = ({ onBack, isDark: isDarkProp, setIsDark: setIsDarkProp, initialNav }) => {
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
            <span className="font-bold text-sm hidden sm:block" style={{ fontFamily: MONO, color: C.orange }}>GENESYS ANALYTICS GUIDE</span>
            <span className="font-bold text-sm sm:hidden" style={{ fontFamily: MONO, color: C.orange }}>GC ANALYTICS</span>
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
      <Footer title="Genesys Cloud Analytics & Reporting — Interactive Knowledge Guide" />
    </div>
  );
};

export default GenesysAnalyticsGuide;
