import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Rocket, Settings, Cpu, Search, ChevronDown, ChevronUp, ChevronRight,
  Menu, X, Phone, Mail, MessageSquare, Bell, RefreshCw, CheckCircle,
  AlertTriangle, AlertCircle, Info, Lightbulb, Star, ExternalLink,
  BookOpen, ArrowRight, ArrowDown, ArrowLeft, Circle, Zap, Shield, Clock, Users,
  FileText, Database, Activity, BarChart3, Target, PhoneCall, Monitor,
  Hash, Layers, Eye, ClipboardList, Volume2, Sun, Moon, GitBranch, Filter,
  Shuffle, UserCheck, Radio, Headphones, Globe, Calendar, Timer, TrendingUp,
  Award, Key, Lock, Unlock, MapPin, Trophy, Heart, ThumbsUp, Flag
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
  'The Big Picture — How WEM Drives Agent Engagement and Performance',
  'How to Configure It — Profiles, Leaderboards, Development, and Reporting',
];
const TIER_AUDIENCES = [
  'For everyone — no experience needed',
  'For administrators, supervisors & power users',
];
const TIER_ICONS_KEYS = ['Rocket', 'Settings'];

// ══════════════════════════════════════════════════════════════
// SECTION METADATA (all tiers)
// ══════════════════════════════════════════════════════════════
const SECTIONS = [
  { tier: 0, id: 't1s1', title: 'What Is Workforce Engagement Management?' },
  { tier: 0, id: 't1s2', title: 'The Building Blocks — Key Components' },
  { tier: 0, id: 't1s3', title: 'How Gamification Works — The Engagement Lifecycle' },
  { tier: 0, id: 't1s4', title: 'WEM vs WFM vs Quality — Where Each Fits' },
  { tier: 0, id: 't1s5', title: 'Key Terminology Glossary' },
  { tier: 1, id: 't2s1', title: 'Prerequisites & Setup' },
  { tier: 1, id: 't2s2', title: 'Gamification Profiles & Metrics' },
  { tier: 1, id: 't2s3', title: 'Leaderboards & Competitions' },
  { tier: 1, id: 't2s4', title: 'Performance Dashboards & Scorecards' },
  { tier: 1, id: 't2s5', title: 'Development Plans & Coaching' },
  { tier: 1, id: 't2s6', title: 'Recognition & Badges' },
  { tier: 1, id: 't2s7', title: 'API & Reporting' },
  { tier: 1, id: 't2s8', title: 'Platform Limits & Troubleshooting' },
];

// ══════════════════════════════════════════════════════════════
// T1 DATA
// ══════════════════════════════════════════════════════════════
const WEM_PILLARS = [
  { icon: 'Trophy', label: 'Gamification', desc: 'Game mechanics applied to work — points, levels, badges, and leaderboards that drive engagement' },
  { icon: 'BarChart3', label: 'Performance', desc: 'Metrics, scorecards, and dashboards that track and visualize agent KPIs over time' },
  { icon: 'Target', label: 'Development', desc: 'Structured learning plans, coaching sessions, and skill-building modules for agent growth' },
  { icon: 'Award', label: 'Recognition', desc: 'Peer-to-peer and supervisor recognition through badges, kudos, and milestone awards' },
  { icon: 'TrendingUp', label: 'Leaderboards', desc: 'Ranked displays of agent performance that foster healthy competition across teams' },
  { icon: 'Users', label: 'Coaching', desc: 'One-on-one and group coaching sessions tied to performance data and development goals' },
];

const WEM_MAP_NODES = [
  { id: 'gamification', label: 'GAMIFICATION', sub: 'Points & game mechanics', x: 400, y: 60 },
  { id: 'leaderboards', label: 'LEADERBOARDS', sub: 'Ranked performance', x: 130, y: 150 },
  { id: 'performance', label: 'PERFORMANCE', sub: 'KPIs & scorecards', x: 670, y: 150 },
  { id: 'development', label: 'DEV PLANS', sub: 'Learning & growth', x: 80, y: 310 },
  { id: 'recognition', label: 'RECOGNITION', sub: 'Badges & kudos', x: 110, y: 450 },
  { id: 'coaching', label: 'COACHING', sub: 'Guided improvement', x: 720, y: 310 },
  { id: 'metrics', label: 'METRICS', sub: 'Data collection', x: 690, y: 450 },
  { id: 'badges', label: 'BADGES', sub: 'Achievement awards', x: 400, y: 540 },
];
const WEM_MAP_CENTER = { x: 400, y: 300 };

const WEM_NODE_TOOLTIPS = {
  gamification: { explanation: 'The core engine that transforms work activities into game-like experiences — earning points for meeting KPIs, leveling up, and competing on leaderboards', analogy: 'A fitness app that gives you achievement badges and daily streaks for exercising' },
  leaderboards: { explanation: 'Ranked displays showing how agents compare against peers on selected metrics — individual or team, daily or monthly, with customizable time periods', analogy: 'The high-score table at an arcade — motivating players to beat each other and themselves' },
  performance: { explanation: 'The measurement layer that collects and aggregates agent KPIs into scorecards — AHT, CSAT, adherence, quality scores, and custom metrics combined into a single performance view', analogy: 'A student report card that shows grades across all subjects at a glance' },
  development: { explanation: 'Structured learning plans that assign training modules, coaching sessions, and skill assessments to agents based on performance gaps or career goals', analogy: 'A personal trainer creating a customized workout plan based on your fitness assessment' },
  recognition: { explanation: 'A system for acknowledging great work — supervisors and peers can send recognition badges, kudos messages, and highlight exceptional performance publicly', analogy: 'An employee-of-the-month wall combined with peer high-fives that everyone can see' },
  coaching: { explanation: 'Scheduled one-on-one or group sessions where supervisors review performance data with agents, set improvement goals, and track progress over time', analogy: 'A sports coach reviewing game film with a player and setting practice goals for the week' },
  metrics: { explanation: 'The raw data that feeds everything — ACD statistics, quality evaluation scores, schedule adherence, customer satisfaction ratings, and custom data points', analogy: 'The sensors in a car dashboard — collecting speed, fuel, temperature, and feeding them to gauges' },
  badges: { explanation: 'Visual awards given to agents for achieving milestones — completing training, hitting performance targets, receiving peer recognition, or reaching streak goals', analogy: 'Scout merit badges earned by demonstrating skills and completing challenges' },
};

const ENGAGEMENT_LIFECYCLE = [
  { step: 1, title: 'METRICS COLLECTION', desc: 'The platform continuously collects performance data from ACD interactions, quality evaluations, schedule adherence, and custom data sources. Every call handled, every quality score, every minute of adherence feeds into the system.', color: C.green, icon: 'Database' },
  {
    step: 2, title: 'SCORING & AGGREGATION', color: C.blue, icon: 'BarChart3',
    desc: 'Raw metrics are processed through gamification profiles:',
    checks: [
      'Each metric is weighted according to organizational priorities',
      'Points are calculated based on metric values vs. targets',
      'Scores are normalized so different metrics are comparable',
      'Composite performance scores aggregate multiple KPIs',
      'Historical trends are computed for progress tracking',
    ],
  },
  { step: 3, title: 'LEADERBOARD RANKING', desc: 'Aggregated scores are ranked across the configured population — individual agents within a team, teams within a division, or the entire organization. Rankings update in near real-time as new data flows in.', color: C.orange, icon: 'TrendingUp' },
  {
    step: 4, title: 'REWARDS & RECOGNITION', color: C.yellow, icon: 'Award',
    desc: 'Performance triggers recognition events:',
    checks: [
      'Automatic badge awards when milestones are reached',
      'Supervisor recognition for exceptional performance',
      'Peer-to-peer kudos and shout-outs',
      'Leaderboard position announcements',
      'Streak rewards for sustained high performance',
    ],
  },
  { step: 5, title: 'GAP IDENTIFICATION', desc: 'The system identifies performance gaps by comparing agent scores against targets, peer averages, and historical baselines. Agents falling below thresholds are flagged for coaching or development intervention.', color: C.purple, icon: 'Target' },
  { step: 6, title: 'DEVELOPMENT & COACHING', desc: 'Based on identified gaps, supervisors create development plans with targeted training modules and coaching sessions. Progress is tracked against the same metrics, closing the loop.', color: C.green, icon: 'BookOpen' },
  { step: 7, title: 'MOTIVATION & CONTINUOUS IMPROVEMENT', desc: 'The cycle repeats — agents see their progress, compete on leaderboards, earn badges, receive coaching, and continuously improve. Engagement drives performance, performance drives engagement.', color: C.blue, icon: 'RefreshCw' },
];

const WEM_COMPARISON = [
  {
    area: 'Workforce Engagement (WEM)',
    focus: 'Agent motivation, performance, and development',
    components: ['Gamification & leaderboards', 'Performance scorecards', 'Recognition & badges', 'Development plans', 'Coaching sessions'],
    question: 'How do we keep agents engaged and improving?',
    color: C.purple,
  },
  {
    area: 'Workforce Management (WFM)',
    focus: 'Staffing, scheduling, and adherence',
    components: ['Forecasting call volume', 'Agent scheduling', 'Real-time adherence monitoring', 'Time-off management', 'Intraday management'],
    question: 'Do we have the right number of agents at the right time?',
    color: C.blue,
  },
  {
    area: 'Quality Management (QM)',
    focus: 'Interaction quality and compliance',
    components: ['Call recording & screen capture', 'Evaluation forms & scoring', 'Calibration sessions', 'Speech & text analytics', 'Compliance monitoring'],
    question: 'Are agents handling interactions correctly and compliantly?',
    color: C.orange,
  },
];

const GLOSSARY = [
  { term: 'WEM', def: 'Workforce Engagement Management — a suite of tools focused on motivating, developing, and recognizing contact center agents', tier: 'Tier 1' },
  { term: 'Gamification', def: 'The application of game mechanics (points, badges, leaderboards, levels) to non-game activities to increase engagement and motivation', tier: 'Tier 1' },
  { term: 'Gamification Profile', def: 'A configuration that defines which metrics are tracked, how they are weighted, and how points are calculated for a group of agents', tier: 'Tier 2' },
  { term: 'Leaderboard', def: 'A ranked display of agent or team performance scores, used to foster healthy competition and visibility', tier: 'Tier 1' },
  { term: 'Scorecard', def: 'A consolidated view of an agent\'s performance across multiple KPIs with targets, actuals, and trend indicators', tier: 'Tier 2' },
  { term: 'Badge', def: 'A visual award given to agents for achieving milestones, completing training, or receiving recognition from peers or supervisors', tier: 'Tier 1' },
  { term: 'Development Plan', def: 'A structured sequence of learning modules, coaching sessions, and assessments assigned to an agent to close performance gaps', tier: 'Tier 2' },
  { term: 'Coaching Session', def: 'A scheduled supervisor-agent meeting tied to performance data with defined goals, talking points, and follow-up actions', tier: 'Tier 2' },
  { term: 'KPI', def: 'Key Performance Indicator — a measurable value that demonstrates how effectively an agent is achieving key objectives (e.g., AHT, CSAT, FCR)', tier: 'Tier 1' },
  { term: 'Metric Weight', def: 'The relative importance assigned to a metric within a gamification profile — higher weight means more influence on the total score', tier: 'Tier 2' },
  { term: 'Recognition', def: 'The act of publicly or privately acknowledging an agent\'s achievement — can be supervisor-initiated or peer-to-peer', tier: 'Tier 1' },
  { term: 'Performance Target', def: 'A goal value set for a specific metric (e.g., AHT target of 300 seconds, CSAT target of 90%) against which agents are measured', tier: 'Tier 2' },
  { term: 'Competition', def: 'A time-bound gamification event where agents or teams compete on specific metrics with defined start/end dates', tier: 'Tier 2' },
  { term: 'Adherence', def: 'The degree to which an agent follows their assigned schedule — measured as a percentage of scheduled time spent in the correct status', tier: 'Tier 1' },
  { term: 'Quality Score', def: 'A numeric evaluation of an agent\'s interaction handling based on a quality evaluation form — often a component of gamification scoring', tier: 'Tier 2' },
  { term: 'Agent Scorecard', def: 'A personalized dashboard showing an individual agent\'s performance metrics, ranking, badges, and development progress', tier: 'Tier 1' },
];

// ══════════════════════════════════════════════════════════════
// T2 DATA
// ══════════════════════════════════════════════════════════════
const PREREQUISITES = [
  { title: 'GC3 License or WEM Add-On', detail: 'Workforce Engagement Management features require a Genesys Cloud 3 (GC3) license, which includes gamification, performance management, development plans, and coaching. Organizations on GC1 or GC2 can purchase WEM capabilities as an add-on. Verify your license includes: Gamification, Performance Management, Coaching, and Development modules.' },
  { title: 'Users & Agents Configured', detail: 'Agents must have active Genesys Cloud accounts with appropriate roles. Agents need the "Gamification > Profile > View" permission to see their own scores. Supervisors need "Gamification > Scorecard > View All" and "Coaching > Session > Add/Edit/View" permissions. Division access must be configured so supervisors can see their team\'s data.' },
  { title: 'Performance Data Flowing', detail: 'Gamification relies on ACD performance data. Agents must be handling interactions with measurable metrics — Average Handle Time, calls completed, quality evaluations submitted, schedule adherence tracked. Without live data, gamification profiles will show zero scores. Ensure at least 1-2 weeks of data before launching gamification to agents.' },
  { title: 'Organizational Hierarchy Defined', detail: 'WEM features leverage management hierarchy for reporting and coaching. Configure reporting relationships: each agent should have a manager assigned. Groups and divisions should reflect team structures. This hierarchy drives who can see whose data, who can coach whom, and how leaderboards roll up.' },
];

const GAMIFICATION_METRICS = [
  { name: 'Average Handle Time (AHT)', category: 'Efficiency', desc: 'Total time from interaction start to wrap-up completion. Lower is typically better but must balance with quality.', scoring: 'Inverse scoring — lower AHT earns more points up to the target threshold' },
  { name: 'Customer Satisfaction (CSAT)', category: 'Quality', desc: 'Post-interaction survey scores reflecting customer happiness. Typically a 1-5 or 1-10 scale.', scoring: 'Direct scoring — higher CSAT earns more points' },
  { name: 'Quality Evaluation Score', category: 'Quality', desc: 'Scores from quality management evaluations conducted by supervisors or QA teams.', scoring: 'Direct scoring — higher quality scores earn more points' },
  { name: 'Schedule Adherence', category: 'Compliance', desc: 'Percentage of scheduled time the agent was in the correct status (Available, Break, etc.).', scoring: 'Direct scoring — higher adherence percentage earns more points' },
  { name: 'First Contact Resolution (FCR)', category: 'Effectiveness', desc: 'Percentage of interactions resolved without requiring a follow-up contact or transfer.', scoring: 'Direct scoring — higher FCR earns more points' },
  { name: 'Interactions Handled', category: 'Volume', desc: 'Total number of interactions completed in the measurement period across all channels.', scoring: 'Direct scoring — more interactions earn more points up to the cap' },
  { name: 'After-Call Work Time', category: 'Efficiency', desc: 'Average time spent in wrap-up after each interaction. Excessive ACW reduces availability.', scoring: 'Inverse scoring — lower ACW time earns more points' },
  { name: 'Transfer Rate', category: 'Effectiveness', desc: 'Percentage of interactions transferred to another agent or queue instead of being resolved directly.', scoring: 'Inverse scoring — lower transfer rate earns more points' },
];

const PROFILE_CONFIG_OPTIONS = [
  ['Profile Name', 'Descriptive identifier (e.g., "Sales_Team_Gamification", "Support_L1_Performance")'],
  ['Assigned Groups', 'Which agent groups are measured by this profile — agents can only be in one active profile'],
  ['Active Metrics', 'Which KPIs are included in scoring (select from available metrics in the org)'],
  ['Metric Weights', 'Relative importance of each metric (weights must total 100%). E.g., CSAT 30%, AHT 25%, Adherence 25%, FCR 20%'],
  ['Scoring Period', 'The time window for score calculation — Daily, Weekly, Monthly, or Custom range'],
  ['Target Values', 'Goal values for each metric that represent "100% achievement" (e.g., AHT target: 300 sec)'],
  ['Threshold Values', 'Minimum acceptable values — scores below threshold earn zero points for that metric'],
  ['Max Points', 'Maximum points an agent can earn per metric per period — prevents runaway scores from outliers'],
];

const LEADERBOARD_TYPES = [
  { name: 'Individual Leaderboard', desc: 'Ranks individual agents against each other based on their composite gamification score. The most common type — shows each agent\'s position relative to peers.', best: 'Most contact centers — drives personal accountability and competitive motivation', color: C.purple },
  { name: 'Team Leaderboard', desc: 'Ranks teams (groups or divisions) against each other based on aggregated team scores. Team scores can be calculated as average, sum, or median of member scores.', best: 'Organizations promoting team collaboration over individual competition', color: C.blue },
  { name: 'Best Points Leaderboard', desc: 'Ranks agents by total gamification points earned in the current period. Rewards consistent high performers who accumulate the most points over time.', best: 'Volume-driven environments where sustained effort matters most', color: C.orange },
  { name: 'Performance Leaderboard', desc: 'Ranks agents by their overall performance score (a percentage of target achievement across all metrics). Focuses on balanced excellence rather than any single metric.', best: 'Balanced performance cultures — ensures agents perform well across all KPIs, not just one', color: C.green },
];

const COMPETITION_CONFIG = [
  ['Competition Name', 'Descriptive title visible to participants (e.g., "February CSAT Challenge")'],
  ['Start / End Date', 'Defined time window — competitions can run days, weeks, or months'],
  ['Participants', 'Individual agents, teams, or entire groups — set via group membership or manual selection'],
  ['Scoring Metric', 'Which metric(s) determine the winner — can be a single KPI or composite gamification score'],
  ['Leaderboard Display', 'How participants see standings — real-time updates, daily snapshots, or hidden until end'],
  ['Prize / Recognition', 'What winners receive — badges, public recognition, or integration with external reward systems'],
];

const SCORECARD_ELEMENTS = [
  { name: 'Metric Summary', desc: 'Current values for each KPI compared to targets — color-coded as green (at or above target), yellow (approaching), or red (below threshold). Shows the "what" of performance.', color: C.green },
  { name: 'Trend Analysis', desc: 'Historical performance over the selected period — daily, weekly, or monthly trend lines showing improvement or decline for each metric. Shows the "direction" of performance.', color: C.blue },
  { name: 'Gamification Score', desc: 'The composite score from the agent\'s gamification profile — total points, rank position, percentile, and comparison to team average. Shows the "standing" among peers.', color: C.purple },
  { name: 'Goal Progress', desc: 'Progress toward individually assigned goals or team targets — percentage complete, time remaining, and projected completion based on current trajectory.', color: C.orange },
  { name: 'Recognition Feed', desc: 'Recent badges earned, kudos received, and recognition events — a visible record of achievement that reinforces positive behavior.', color: C.yellow },
  { name: 'Development Status', desc: 'Active development plans, upcoming coaching sessions, and module completion status — links performance data to growth actions.', color: C.red },
];

const DEVELOPMENT_PLAN_STEPS = [
  { step: 1, title: 'IDENTIFY GAPS', desc: 'Review agent scorecard and performance data to identify specific areas needing improvement. Compare against targets, peer averages, and trend data.', color: C.red },
  { step: 2, title: 'CREATE PLAN', desc: 'Build a structured development plan with specific modules: training courses, reading materials, practice exercises, and scheduled coaching sessions.', color: C.orange },
  { step: 3, title: 'ASSIGN TO AGENT', desc: 'Assign the plan with clear expectations: completion deadlines, expected improvement targets, and how progress will be measured.', color: C.yellow },
  { step: 4, title: 'AGENT COMPLETES MODULES', desc: 'Agent works through assigned content — watching training videos, completing assessments, practicing skills, and attending coaching sessions.', color: C.blue },
  { step: 5, title: 'TRACK PROGRESS', desc: 'Monitor module completion status, assessment scores, and — most importantly — whether the target KPIs are actually improving over time.', color: C.purple },
  { step: 6, title: 'CLOSE & EVALUATE', desc: 'When the plan period ends, evaluate results: did the agent improve? Close the plan with documented outcomes and create follow-up plans if needed.', color: C.green },
];

const COACHING_SESSION_FIELDS = [
  ['Session Title', 'Descriptive name for the coaching session (e.g., "AHT Improvement Review — Week 3")'],
  ['Agent', 'The agent being coached — selected from agents the supervisor manages'],
  ['Date / Time', 'Scheduled date and duration — creates a calendar event for both supervisor and agent'],
  ['Agenda Topics', 'Specific items to discuss — automatically populated with relevant performance data if linked to metrics'],
  ['Related Metrics', 'KPIs to review during the session — the system pulls current and historical data for context'],
  ['Action Items', 'Concrete next steps with owners and due dates — tracked for completion in the next session'],
  ['Notes', 'Free-text field for session notes, observations, and agreements — saved as a permanent record'],
  ['Follow-Up Date', 'When the next coaching session is scheduled — maintains momentum and accountability'],
];

const BADGE_TYPES = [
  { name: 'Achievement Badge', desc: 'Automatically awarded when an agent hits a specific milestone — like reaching 100% CSAT for a week, completing 500 interactions, or achieving top-3 leaderboard position.', trigger: 'System-triggered based on metric thresholds', color: C.purple },
  { name: 'Peer Recognition Badge', desc: 'Sent by fellow agents to acknowledge helpfulness, great teamwork, or going above and beyond. Creates a culture of appreciation among team members.', trigger: 'Manually sent by any agent to any peer', color: C.blue },
  { name: 'Supervisor Award', desc: 'Given by supervisors or managers to recognize exceptional performance, attitude, or contribution that may not be captured by metrics alone.', trigger: 'Manually awarded by supervisors', color: C.orange },
  { name: 'Milestone Badge', desc: 'Awarded for tenure or cumulative achievements — 1-year anniversary, 10,000th interaction handled, 100th quality evaluation passed, completing all training modules.', trigger: 'System-triggered based on cumulative counts or dates', color: C.green },
  { name: 'Streak Badge', desc: 'Earned by maintaining consistent performance over consecutive periods — 5 consecutive days above target, 4 weeks in the top-10 leaderboard, perfect adherence for a month.', trigger: 'System-triggered based on consecutive period tracking', color: C.yellow },
];

const WEM_API_ENDPOINTS = [
  { method: 'GET', path: '/api/v2/gamification/profiles', use: 'List all gamification profiles with their metric configurations' },
  { method: 'GET', path: '/api/v2/gamification/profiles/{profileId}', use: 'Get a specific gamification profile with full metric details' },
  { method: 'GET', path: '/api/v2/gamification/scorecards/users/{userId}', use: 'Get an agent\'s current gamification scorecard and point totals' },
  { method: 'GET', path: '/api/v2/gamification/leaderboard', use: 'Get current leaderboard rankings for a gamification profile' },
  { method: 'GET', path: '/api/v2/gamification/scorecards/users/{userId}/points/trends', use: 'Get point trend data for an agent over a date range' },
  { method: 'GET', path: '/api/v2/coaching/appointments', use: 'List coaching sessions (appointments) with filters for agent, date, status' },
  { method: 'POST', path: '/api/v2/coaching/appointments', use: 'Create a new coaching session with agenda, metrics, and scheduling' },
  { method: 'PATCH', path: '/api/v2/coaching/appointments/{appointmentId}', use: 'Update a coaching session — add notes, action items, change status' },
  { method: 'GET', path: '/api/v2/development/activities', use: 'List development plan activities and their completion status' },
  { method: 'POST', path: '/api/v2/development/activities', use: 'Create a new development activity or plan for an agent' },
  { method: 'GET', path: '/api/v2/gamification/metrics', use: 'List all available gamification metrics and their definitions' },
  { method: 'POST', path: '/api/v2/analytics/gamification/agents/me/query', use: 'Query the authenticated agent\'s own gamification data' },
];

const PLATFORM_LIMITS = [
  ['Gamification profiles per org', '50', ''],
  ['Metrics per gamification profile', '20', 'Across all metric types'],
  ['Active competitions per org', '100', 'Concurrent running competitions'],
  ['Agents per gamification profile', '5,000', ''],
  ['Coaching sessions per agent/month', '50', 'Includes completed and scheduled'],
  ['Development plans per agent', '20', 'Active plans simultaneously'],
  ['Modules per development plan', '50', ''],
  ['Badges per org', '500', 'Custom badge definitions'],
  ['Peer recognitions per agent/day', '10', 'Sending limit to prevent spam'],
  ['Leaderboard refresh interval', 'Near real-time', 'Typically 5-15 minutes lag'],
  ['Historical data retention', '13 months', 'For gamification scoring data'],
  ['Scorecard export limit', '10,000 records', 'Per single export request'],
  ['Competition max duration', '365 days', '1 year maximum'],
  ['Coaching session notes', '10,000 characters', 'Per session'],
];

const TROUBLESHOOTING = [
  { symptom: 'Agent gamification scores showing as zero', investigation: 'Check: Is the agent assigned to a gamification profile? (Profiles > Members) Is the profile active and not in draft mode? Are the profile metrics correctly configured with valid data sources? Has the agent been handling interactions in the current scoring period? Verify the agent\'s group membership matches the profile assignment. Check if the scoring period just reset (scores start fresh each period).' },
  { symptom: 'Leaderboard not updating or showing stale data', investigation: 'Check: Leaderboards update on a near-real-time cadence (5-15 minutes). Has enough time elapsed since the last interaction? Is the gamification profile associated with the leaderboard active? Are there at least 2 participating agents (single-agent leaderboards may not display)? Verify the leaderboard date range matches the current scoring period. Check for any org-wide data processing delays in the Genesys Cloud status page.' },
  { symptom: 'Quality scores not flowing into gamification', investigation: 'Check: Is the "Quality Evaluation Score" metric enabled in the gamification profile? Are quality evaluations being published (not just saved as draft)? Is the evaluation form assigned to the correct queue and evaluator? Verify the quality metric data source is mapped to the correct evaluation form. Check the evaluation completion date falls within the gamification scoring period.' },
  { symptom: 'Agent cannot see their scorecard or leaderboard', investigation: 'Check: Does the agent have "Gamification > Profile > View" permission? Is the agent assigned to an active gamification profile? Is the leaderboard configured to be visible to agents (not supervisor-only)? Check division access — the agent must be in a division that has WEM features enabled. Verify the agent\'s license includes gamification capabilities.' },
  { symptom: 'Coaching sessions not appearing on agent calendar', investigation: 'Check: Was the coaching session status set to "Scheduled" (not "Draft")? Is the agent selected as the attendee? Does the scheduled time fall within working hours? Verify both supervisor and agent have coaching permissions enabled. Check if calendar integration is properly configured. Ensure the session was saved successfully (check for validation errors).' },
  { symptom: 'Development plan progress stuck at 0%', investigation: 'Check: Has the agent actually started the assigned modules? Are the modules correctly linked to completable content (training courses, assessments)? Verify the module completion criteria — some require manual supervisor confirmation. Check if the plan status is "Active" (not "Draft" or "Paused"). Look for integration issues if modules link to external LMS content.' },
];

// ══════════════════════════════════════════════════════════════
// SEARCH INDEX
// ══════════════════════════════════════════════════════════════
export const SEARCH_INDEX = (() => {
  const idx = [];
  SECTIONS.forEach(s => idx.push({ text: s.title, label: s.title, sectionId: s.id, tier: s.tier, type: 'Section' }));
  WEM_PILLARS.forEach(p => idx.push({ text: `${p.label} ${p.desc}`, label: p.label, sectionId: 't1s1', tier: 0, type: 'WEM Pillar' }));
  ENGAGEMENT_LIFECYCLE.forEach(s => idx.push({ text: `${s.title} ${s.desc} ${(s.checks || []).join(' ')}`, label: s.title, sectionId: 't1s3', tier: 0, type: 'Engagement Lifecycle' }));
  WEM_COMPARISON.forEach(c => idx.push({ text: `${c.area} ${c.focus} ${c.components.join(' ')} ${c.question}`, label: c.area, sectionId: 't1s4', tier: 0, type: 'WEM Comparison' }));
  GLOSSARY.forEach(g => idx.push({ text: `${g.term} ${g.def}`, label: g.term, sectionId: 't1s5', tier: 0, type: 'Glossary' }));
  PREREQUISITES.forEach(p => idx.push({ text: `${p.title} ${p.detail}`, label: p.title, sectionId: 't2s1', tier: 1, type: 'Prerequisite' }));
  GAMIFICATION_METRICS.forEach(m => idx.push({ text: `${m.name} ${m.category} ${m.desc} ${m.scoring}`, label: m.name, sectionId: 't2s2', tier: 1, type: 'Gamification Metric' }));
  PROFILE_CONFIG_OPTIONS.forEach(p => idx.push({ text: `${p[0]} ${p[1]}`, label: p[0], sectionId: 't2s2', tier: 1, type: 'Profile Config' }));
  LEADERBOARD_TYPES.forEach(l => idx.push({ text: `${l.name} ${l.desc} ${l.best}`, label: l.name, sectionId: 't2s3', tier: 1, type: 'Leaderboard' }));
  COMPETITION_CONFIG.forEach(c => idx.push({ text: `${c[0]} ${c[1]}`, label: c[0], sectionId: 't2s3', tier: 1, type: 'Competition Config' }));
  SCORECARD_ELEMENTS.forEach(s => idx.push({ text: `${s.name} ${s.desc}`, label: s.name, sectionId: 't2s4', tier: 1, type: 'Scorecard' }));
  DEVELOPMENT_PLAN_STEPS.forEach(d => idx.push({ text: `${d.title} ${d.desc}`, label: d.title, sectionId: 't2s5', tier: 1, type: 'Development Plan' }));
  COACHING_SESSION_FIELDS.forEach(c => idx.push({ text: `${c[0]} ${c[1]}`, label: c[0], sectionId: 't2s5', tier: 1, type: 'Coaching' }));
  BADGE_TYPES.forEach(b => idx.push({ text: `${b.name} ${b.desc} ${b.trigger}`, label: b.name, sectionId: 't2s6', tier: 1, type: 'Badge' }));
  WEM_API_ENDPOINTS.forEach(a => idx.push({ text: `${a.method} ${a.path} ${a.use}`, label: `${a.method} ${a.path}`, sectionId: 't2s7', tier: 1, type: 'API Endpoint' }));
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
const WEMComponentMapSVG = () => {
  const [active, setActive] = useState(null);
  return (
    <div className="my-6 overflow-x-auto">
      <svg viewBox="0 0 800 600" className="w-full" style={{ maxWidth: 800, minWidth: 600 }}>
        <defs>
          <filter id="glow-w"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        {WEM_MAP_NODES.map(n => (
          <line key={`line-${n.id}`} x1={WEM_MAP_CENTER.x} y1={WEM_MAP_CENTER.y} x2={n.x} y2={n.y} stroke={C.border} strokeWidth="2" strokeDasharray="6,4" />
        ))}
        <g>
          <rect x={WEM_MAP_CENTER.x - 80} y={WEM_MAP_CENTER.y - 30} width={160} height={60} rx={12} fill={C.bg3} stroke={C.purple} strokeWidth={2} />
          <text x={WEM_MAP_CENTER.x} y={WEM_MAP_CENTER.y - 5} textAnchor="middle" fill={C.t1} fontFamily={MONO} fontSize={13} fontWeight="bold">WEM ENGINE</text>
          <text x={WEM_MAP_CENTER.x} y={WEM_MAP_CENTER.y + 15} textAnchor="middle" fill={C.t3} fontFamily={SANS} fontSize={10}>The engagement brain</text>
        </g>
        {WEM_MAP_NODES.map(n => {
          const isActive = active === n.id;
          const tooltip = WEM_NODE_TOOLTIPS[n.id];
          return (
            <g key={n.id} className="cursor-pointer" onClick={() => setActive(isActive ? null : n.id)} style={{ transition: 'transform 0.2s' }}>
              <rect x={n.x - 70} y={n.y - 25} width={140} height={50} rx={8} fill={C.bg2} stroke={isActive ? C.purple : C.border} strokeWidth={isActive ? 2 : 1} filter={isActive ? 'url(#glow-w)' : undefined} />
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
      <SectionHeading>What Is Workforce Engagement Management?</SectionHeading>
      <Paragraph>Workforce Engagement Management (WEM) is the practice of keeping contact center agents motivated, developing their skills, and recognizing their achievements — all driven by performance data. Think of it as the difference between a gym with just equipment (tools) and a gym with personal trainers, progress tracking, achievement badges, and a community leaderboard (engagement). Both have treadmills, but one keeps you coming back.</Paragraph>
      <Paragraph>In Genesys Cloud CX, WEM encompasses gamification, leaderboards, performance scorecards, development plans, coaching sessions, and recognition badges. It sits alongside — but is distinct from — Workforce Management (which handles scheduling and forecasting) and Quality Management (which handles interaction evaluation and compliance).</Paragraph>
      <SubHeading>Why WEM Matters</SubHeading>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        {[
          { title: 'WITHOUT WEM', items: ['Agents see metrics only during reviews', 'No visibility into peer performance', 'Development is ad hoc and undocumented', 'Recognition is informal and inconsistent', 'High attrition from disengagement'], color: C.red },
          { title: 'WITH WEM (GENESYS CLOUD)', items: ['Real-time performance visibility for every agent', 'Healthy competition through leaderboards and badges', 'Structured development plans tied to performance data', 'Peer and supervisor recognition built into daily workflow', 'Lower attrition through engagement and growth opportunities'], color: C.purple },
        ].map((panel, i) => (
          <div key={i} className="rounded-lg p-5" style={{ backgroundColor: C.bg2, borderTop: `3px solid ${panel.color}` }}>
            <div className="font-bold mb-3 text-sm" style={{ color: panel.color, fontFamily: MONO }}>{panel.title}</div>
            {panel.items.map((item, j) => <div key={j} className="text-sm mb-1.5" style={{ color: C.t2, fontFamily: SANS }}>{item}</div>)}
          </div>
        ))}
      </div>
      <SubHeading>WEM Pillars</SubHeading>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 my-4">
        {WEM_PILLARS.map((p, i) => (
          <div key={i} className="rounded-lg p-4 flex items-start gap-3 transition-all duration-200 hover:-translate-y-0.5" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
            <Trophy size={20} style={{ color: C.purple, flexShrink: 0 }} />
            <div><div className="font-semibold text-sm" style={{ color: C.t1, fontFamily: MONO }}>{p.label}</div><div className="text-xs mt-1" style={{ color: C.t2, fontFamily: SANS }}>{p.desc}</div></div>
          </div>
        ))}
      </div>
      <CalloutBox type="tip">WEM is about the agent experience — making work visible, rewarding effort, and providing clear paths for growth. It transforms raw performance data into motivation. The same data exists without WEM, but WEM makes it actionable and engaging for agents, not just supervisors.</CalloutBox>
    </section>

    {/* T1S2 */}
    <section ref={el => sectionRefs.current['t1s2'] = el} id="t1s2">
      <SectionHeading>The Building Blocks — Key Components</SectionHeading>
      <Paragraph>WEM in Genesys Cloud is built from several interconnected components that feed each other. Metrics feed gamification profiles, profiles drive leaderboards, leaderboards motivate agents, gaps trigger development plans, and recognition reinforces good behavior. No single piece stands alone — they form a continuous engagement engine.</Paragraph>
      <CalloutBox type="tip">Click any node in the diagram below to see what it does and a simple analogy.</CalloutBox>
      <WEMComponentMapSVG />
      <SubHeading>Component Reference</SubHeading>
      <InteractiveTable
        headers={['Component', 'Simple Explanation', 'Analogy']}
        rows={Object.entries(WEM_NODE_TOOLTIPS).map(([k, v]) => {
          const node = WEM_MAP_NODES.find(n => n.id === k);
          return [node?.label || k, v.explanation, v.analogy];
        })}
      />
    </section>

    {/* T1S3 */}
    <section ref={el => sectionRefs.current['t1s3'] = el} id="t1s3">
      <SectionHeading>How Gamification Works — The Engagement Lifecycle</SectionHeading>
      <Paragraph>Gamification in Genesys Cloud follows a continuous cycle: collect performance data, score it, rank agents, reward achievement, identify gaps, develop skills, and repeat. Understanding this lifecycle is the key to understanding how all WEM components connect.</Paragraph>
      <div className="my-6 space-y-0">
        {ENGAGEMENT_LIFECYCLE.map((s, i) => (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: s.color + '22', color: s.color, border: `2px solid ${s.color}`, fontFamily: MONO }}>{s.step}</div>
              {i < ENGAGEMENT_LIFECYCLE.length - 1 && <div className="w-0.5 flex-1 my-1" style={{ backgroundColor: C.border }} />}
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
          <div className="font-bold text-sm" style={{ color: C.green, fontFamily: MONO }}>CYCLE REPEATS — CONTINUOUS ENGAGEMENT LOOP</div>
        </div>
      </div>
    </section>

    {/* T1S4 */}
    <section ref={el => sectionRefs.current['t1s4'] = el} id="t1s4">
      <SectionHeading>WEM vs WFM vs Quality — Where Each Fits</SectionHeading>
      <Paragraph>Genesys Cloud offers three complementary workforce tools: WEM (engagement), WFM (management), and Quality Management. They address different questions and serve different purposes, but share data and work best together. Understanding the boundaries prevents confusion and helps you configure each one correctly.</Paragraph>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        {WEM_COMPARISON.map((area, i) => (
          <div key={i} className="rounded-lg p-5" style={{ backgroundColor: C.bg2, borderTop: `3px solid ${area.color}` }}>
            <div className="font-bold mb-2 text-sm" style={{ color: area.color, fontFamily: MONO }}>{area.area}</div>
            <div className="text-xs mb-3 italic" style={{ color: C.t3, fontFamily: SANS }}>"{area.question}"</div>
            <div className="text-xs mb-3" style={{ color: C.t2, fontFamily: SANS }}><strong style={{ color: C.t1 }}>Focus:</strong> {area.focus}</div>
            <div className="space-y-1">
              {area.components.map((comp, j) => (
                <div key={j} className="text-xs flex items-start gap-2" style={{ color: C.t2, fontFamily: SANS }}>
                  <span style={{ color: area.color }}>*</span> {comp}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <CalloutBox type="info">
        <strong>How they connect:</strong> Quality Management produces evaluation scores that feed into WEM gamification profiles. WFM tracks schedule adherence, which becomes a WEM metric. WEM uses data from both to score agents, rank them on leaderboards, and drive development plans. Think of QM and WFM as data producers, and WEM as the engagement layer that makes that data motivating.
      </CalloutBox>
      <SubHeading>Quick Reference: Which Tool for Which Task?</SubHeading>
      <InteractiveTable
        headers={['Task', 'Tool']}
        rows={[
          ['Score and rank agents on KPIs', 'WEM — Gamification'],
          ['Create a leaderboard for CSAT', 'WEM — Leaderboards'],
          ['Build an agent training plan', 'WEM — Development Plans'],
          ['Award a badge for great work', 'WEM — Recognition'],
          ['Forecast next week\'s call volume', 'WFM — Forecasting'],
          ['Create agent schedules', 'WFM — Scheduling'],
          ['Monitor real-time schedule adherence', 'WFM — Adherence'],
          ['Evaluate a recorded interaction', 'Quality Management'],
          ['Calibrate evaluators on scoring', 'Quality Management'],
          ['Analyze speech for compliance keywords', 'Quality — Speech Analytics'],
        ]}
      />
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
  const [activeMetricTab, setActiveMetricTab] = useState(0);
  return (
    <div className="space-y-16">
      {/* T2S1 */}
      <section ref={el => sectionRefs.current['t2s1'] = el} id="t2s1">
        <SectionHeading>Prerequisites & Setup</SectionHeading>
        <Paragraph>Before configuring gamification profiles and leaderboards, these foundational elements must be in place. Think of it as stocking the gym and hiring trainers before you invite members.</Paragraph>
        <div className="space-y-3 my-4">
          {PREREQUISITES.map((p, i) => (
            <ExpandableCard key={i} title={`${i + 1}. ${p.title}`} accent={C.purple}>
              {p.detail}
            </ExpandableCard>
          ))}
        </div>
        <SubHeading>Recommended Setup Sequence</SubHeading>
        <div className="flex flex-wrap items-center gap-1 my-4 overflow-x-auto">
          {['Licensing', 'Users & Roles', 'Org Hierarchy', 'Groups', 'Metrics Baseline', 'Gamification Profile', 'Leaderboards', 'Badges', 'Development Plans'].map((s, i) => (
            <React.Fragment key={i}>
              <span className="px-3 py-1.5 rounded text-xs whitespace-nowrap" style={{ backgroundColor: C.bg3, color: C.t1, fontFamily: MONO, border: `1px solid ${C.border}` }}>{s}</span>
              {i < 8 && <ArrowRight size={14} style={{ color: C.t3, flexShrink: 0 }} />}
            </React.Fragment>
          ))}
        </div>
        <CalloutBox type="warning">
          <strong>Data before launch:</strong> Allow 1-2 weeks of live interaction data to accumulate before enabling gamification for agents. Launching with zero data creates an empty, demotivating experience. Build profiles and leaderboards in the background, verify scores look reasonable, then enable agent visibility.
        </CalloutBox>
      </section>

      {/* T2S2 */}
      <section ref={el => sectionRefs.current['t2s2'] = el} id="t2s2">
        <SectionHeading>Gamification Profiles & Metrics</SectionHeading>
        <Paragraph>The gamification profile is the heart of WEM scoring. It defines which metrics matter, how much each one counts, and how points are calculated. Every agent is assigned to exactly one profile, and that profile determines their gamification score, leaderboard position, and performance evaluation.</Paragraph>
        <SubHeading>Available Metrics</SubHeading>
        <div className="flex gap-1 mb-3 overflow-x-auto flex-wrap">
          {['Efficiency', 'Quality', 'Compliance', 'Effectiveness', 'Volume'].map((cat, i) => (
            <button key={i} className="px-3 py-1.5 rounded text-xs whitespace-nowrap cursor-pointer transition-colors"
              onClick={() => setActiveMetricTab(i)}
              style={{ backgroundColor: activeMetricTab === i ? C.purple : C.bg3, color: activeMetricTab === i ? '#fff' : C.t2, fontFamily: MONO }}>
              {cat}
            </button>
          ))}
        </div>
        <div className="space-y-3 my-4">
          {GAMIFICATION_METRICS.filter(m => {
            const cats = ['Efficiency', 'Quality', 'Compliance', 'Effectiveness', 'Volume'];
            return m.category === cats[activeMetricTab];
          }).map((m, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
              <div className="font-semibold text-sm mb-2 flex items-center gap-2" style={{ color: C.t1, fontFamily: MONO }}>
                {m.name}
                <span className="text-[10px] px-2 py-0.5 rounded" style={{ backgroundColor: C.purple + '22', color: C.purple }}>{m.category}</span>
              </div>
              <div className="text-sm mb-2" style={{ color: C.t2, fontFamily: SANS }}>{m.desc}</div>
              <div className="text-xs p-2 rounded" style={{ backgroundColor: C.bg3, color: C.t3 }}>Scoring: {m.scoring}</div>
            </div>
          ))}
        </div>
        <SubHeading>Profile Configuration Options</SubHeading>
        <div className="space-y-2 my-3">
          {PROFILE_CONFIG_OPTIONS.map(([label, desc], i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-1 p-3 rounded" style={{ backgroundColor: C.bg2 }}>
              <span className="text-xs font-semibold whitespace-nowrap min-w-[160px]" style={{ color: C.purple, fontFamily: MONO }}>{label}:</span>
              <span className="text-xs" style={{ color: C.t2, fontFamily: SANS }}>{desc}</span>
            </div>
          ))}
        </div>
        <SubHeading>Example: Balanced Support Profile</SubHeading>
        <div className="my-4 p-4 rounded-lg" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
          <div className="text-center mb-4 text-sm font-bold" style={{ color: C.purple, fontFamily: MONO }}>METRIC WEIGHT DISTRIBUTION</div>
          {[
            { metric: 'Customer Satisfaction (CSAT)', weight: 30, target: '90%', color: C.green },
            { metric: 'Average Handle Time (AHT)', weight: 25, target: '300 sec', color: C.blue },
            { metric: 'Schedule Adherence', weight: 25, target: '95%', color: C.orange },
            { metric: 'First Contact Resolution', weight: 20, target: '80%', color: C.purple },
          ].map((m, i) => (
            <div key={i} className="flex items-center gap-3 mb-3">
              <div className="min-w-[200px] text-xs font-semibold" style={{ color: C.t1, fontFamily: MONO }}>{m.metric}</div>
              <div className="flex-1 h-4 rounded-full overflow-hidden" style={{ backgroundColor: C.bg3 }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${m.weight}%`, backgroundColor: m.color }} />
              </div>
              <div className="min-w-[40px] text-xs font-bold text-right" style={{ color: m.color, fontFamily: MONO }}>{m.weight}%</div>
              <div className="min-w-[70px] text-[10px] text-right" style={{ color: C.t3 }}>Target: {m.target}</div>
            </div>
          ))}
        </div>
        <CalloutBox type="info">
          <strong>New metric — Average Alert Time:</strong> This metric measures how long interactions ring before an agent accepts or declines. Supervisors can use it to spot quick responders, identify agents who may need coaching on response times, and make data-driven coaching decisions based on individual response patterns rather than overall queue averages.
        </CalloutBox>
        <CalloutBox type="tip">Start with 3-5 metrics maximum. Too many metrics dilute the signal — agents cannot optimize for everything at once. Choose the KPIs that most directly impact your business outcomes, weight them appropriately, and communicate the scoring model clearly to agents so they understand what drives their score.</CalloutBox>
      </section>

      {/* T2S3 */}
      <section ref={el => sectionRefs.current['t2s3'] = el} id="t2s3">
        <SectionHeading>Leaderboards & Competitions</SectionHeading>
        <Paragraph>Leaderboards are the visible, motivating face of gamification. They take the scores calculated by gamification profiles and display them as ranked lists — showing agents where they stand relative to peers. Competitions add a time-bound, event-based layer on top.</Paragraph>
        <SubHeading>Leaderboard Types</SubHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
          {LEADERBOARD_TYPES.map((lb, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, borderLeft: `4px solid ${lb.color}` }}>
              <div className="font-bold text-sm mb-2" style={{ color: lb.color, fontFamily: MONO }}>{lb.name}</div>
              <div className="text-sm mb-2" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.6 }}>{lb.desc}</div>
              <div className="text-xs p-2 rounded" style={{ backgroundColor: C.bg3, color: C.t3 }}>Best for: {lb.best}</div>
            </div>
          ))}
        </div>
        <SubHeading>Competitions</SubHeading>
        <Paragraph>Competitions are time-bound gamification events that add excitement and urgency. Unlike ongoing leaderboards (which run continuously), competitions have a defined start date, end date, specific metrics, and often prizes or recognition for winners.</Paragraph>
        <div className="space-y-2 my-3">
          {COMPETITION_CONFIG.map(([label, desc], i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-1 p-3 rounded" style={{ backgroundColor: C.bg2 }}>
              <span className="text-xs font-semibold whitespace-nowrap min-w-[160px]" style={{ color: C.blue, fontFamily: MONO }}>{label}:</span>
              <span className="text-xs" style={{ color: C.t2, fontFamily: SANS }}>{desc}</span>
            </div>
          ))}
        </div>
        <SubHeading>Leaderboard Best Practices</SubHeading>
        <div className="space-y-1 my-3">
          {[
            { good: true, text: 'Use team leaderboards alongside individual ones to encourage collaboration, not just individual competition' },
            { good: true, text: 'Rotate competition metrics monthly so agents do not hyper-optimize a single KPI at the expense of others' },
            { good: true, text: 'Celebrate improvement as well as absolute position — an agent who moves from 20th to 10th deserves recognition' },
            { good: true, text: 'Keep leaderboard populations reasonable (10-50 agents) — being ranked 247th out of 300 is not motivating' },
            { good: false, text: 'Do not publicly shame bottom performers — consider showing only the top 50% or using anonymized lower ranks' },
            { good: false, text: 'Do not run competitions on metrics agents cannot directly influence (like inbound call volume)' },
            { good: false, text: 'Do not make every metric a competition — some KPIs like quality and compliance should be standards, not contests' },
          ].map((p, i) => (
            <div key={i} className="text-xs flex items-start gap-2" style={{ color: p.good ? C.green : C.red, fontFamily: SANS }}>
              <span>{p.good ? 'DO' : 'AVOID'}</span><span style={{ color: C.t2 }}>{p.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* T2S4 */}
      <section ref={el => sectionRefs.current['t2s4'] = el} id="t2s4">
        <SectionHeading>Performance Dashboards & Scorecards</SectionHeading>
        <Paragraph>Scorecards give agents and supervisors a holistic view of performance — combining gamification scores, individual KPIs, trend data, recognition history, and development progress into a single, actionable dashboard. They are where data becomes insight.</Paragraph>
        <SubHeading>Scorecard Elements</SubHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
          {SCORECARD_ELEMENTS.map((el, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, borderLeft: `4px solid ${el.color}` }}>
              <div className="font-bold text-sm mb-2" style={{ color: el.color, fontFamily: MONO }}>{el.name}</div>
              <div className="text-xs" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.6 }}>{el.desc}</div>
            </div>
          ))}
        </div>
        <SubHeading>Supervisor vs Agent Views</SubHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          {[
            { title: 'AGENT VIEW', items: ['Own scorecard with personal KPIs and targets', 'Personal leaderboard position and trend', 'Badges earned and recognition received', 'Active development plans and progress', 'Upcoming coaching sessions'], color: C.blue },
            { title: 'SUPERVISOR VIEW', items: ['All team members\' scorecards in a single dashboard', 'Team-level aggregates and comparisons', 'Identification of top performers and at-risk agents', 'Coaching session management and notes', 'Development plan assignment and tracking'], color: C.purple },
          ].map((panel, i) => (
            <div key={i} className="rounded-lg p-5" style={{ backgroundColor: C.bg2, borderTop: `3px solid ${panel.color}` }}>
              <div className="font-bold mb-3 text-sm" style={{ color: panel.color, fontFamily: MONO }}>{panel.title}</div>
              {panel.items.map((item, j) => <div key={j} className="text-sm mb-1.5" style={{ color: C.t2, fontFamily: SANS }}>{item}</div>)}
            </div>
          ))}
        </div>
        <SubHeading>Goal Setting</SubHeading>
        <Paragraph>Goals can be set at multiple levels: organizational (e.g., org-wide CSAT target of 90%), team (team AHT target of 280 seconds), and individual (agent-specific FCR target based on tenure). Goals flow from top to bottom — org goals inform team goals, team goals inform individual goals. Scorecard displays show progress toward each applicable goal.</Paragraph>
        <CalloutBox type="info">
          <strong>Trend analysis tip:</strong> When reviewing scorecards, focus on the trend direction rather than a single point in time. An agent at 82% CSAT trending upward from 75% is in a better position than an agent at 85% trending downward from 92%. Trends reveal trajectory; snapshots can be misleading.
        </CalloutBox>
      </section>

      {/* T2S5 */}
      <section ref={el => sectionRefs.current['t2s5'] = el} id="t2s5">
        <SectionHeading>Development Plans & Coaching</SectionHeading>
        <Paragraph>Development plans and coaching sessions close the loop between performance measurement and performance improvement. When scorecards reveal gaps, development plans provide the structured path to close them. Coaching sessions ensure agents have guidance and accountability along the way.</Paragraph>
        <SubHeading>Development Plan Lifecycle</SubHeading>
        <div className="my-6 space-y-0">
          {DEVELOPMENT_PLAN_STEPS.map((s, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: s.color + '22', color: s.color, border: `2px solid ${s.color}`, fontFamily: MONO }}>{s.step}</div>
                {i < DEVELOPMENT_PLAN_STEPS.length - 1 && <div className="w-0.5 flex-1 my-1" style={{ backgroundColor: C.border }} />}
              </div>
              <div className="pb-6 flex-1">
                <div className="font-bold text-sm mb-1" style={{ color: C.t1, fontFamily: MONO }}>{s.title}</div>
                <div className="text-sm" style={{ color: C.t2, fontFamily: SANS }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <SubHeading>Coaching Session Configuration</SubHeading>
        <div className="space-y-2 my-3">
          {COACHING_SESSION_FIELDS.map(([label, desc], i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-1 p-3 rounded" style={{ backgroundColor: C.bg2 }}>
              <span className="text-xs font-semibold whitespace-nowrap min-w-[160px]" style={{ color: C.orange, fontFamily: MONO }}>{label}:</span>
              <span className="text-xs" style={{ color: C.t2, fontFamily: SANS }}>{desc}</span>
            </div>
          ))}
        </div>
        <SubHeading>Coaching Best Practices</SubHeading>
        <div className="space-y-1 my-3">
          {[
            { good: true, text: 'Always reference specific performance data during coaching — "Your AHT was 340 sec this week vs. 300 sec target" is actionable' },
            { good: true, text: 'Set 1-2 focused action items per session with clear due dates — keep it manageable' },
            { good: true, text: 'Schedule regular cadence (weekly or biweekly) — consistency builds trust and momentum' },
            { good: true, text: 'Document everything in the coaching session record — this creates a development trail' },
            { good: false, text: 'Do not use coaching sessions solely as disciplinary meetings — coaching should be developmental, not punitive' },
            { good: false, text: 'Do not skip sessions when things are going well — recognize positive performance during coaching too' },
          ].map((p, i) => (
            <div key={i} className="text-xs flex items-start gap-2" style={{ color: p.good ? C.green : C.red, fontFamily: SANS }}>
              <span>{p.good ? 'DO' : 'AVOID'}</span><span style={{ color: C.t2 }}>{p.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* T2S6 */}
      <section ref={el => sectionRefs.current['t2s6'] = el} id="t2s6">
        <SectionHeading>Recognition & Badges</SectionHeading>
        <Paragraph>Recognition is the emotional fuel of WEM. While gamification provides structure (scores, ranks, metrics), recognition provides meaning (acknowledgment, appreciation, belonging). Badges are the visible artifacts of recognition — digital awards that appear on agent profiles and leaderboards.</Paragraph>
        <SubHeading>Badge Types</SubHeading>
        <div className="space-y-3 my-4">
          {BADGE_TYPES.map((b, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
              <div className="font-semibold text-sm mb-2 flex items-center gap-2" style={{ color: b.color, fontFamily: MONO }}>
                <Award size={16} style={{ color: b.color }} />
                {b.name}
              </div>
              <div className="text-sm mb-2" style={{ color: C.t2, fontFamily: SANS }}>{b.desc}</div>
              <div className="text-xs p-2 rounded" style={{ backgroundColor: C.bg3, color: C.t3 }}>Trigger: {b.trigger}</div>
            </div>
          ))}
        </div>
        <SubHeading>Recognition Design Principles</SubHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          {[
            { title: 'FREQUENCY', desc: 'Recognition should be frequent enough to feel real but not so frequent that it becomes meaningless. Aim for at least 1 badge or kudos per agent per week from any source.', color: C.purple },
            { title: 'SPECIFICITY', desc: 'Generic praise ("Good job!") is less effective than specific recognition ("Your CSAT score of 98% this week was the highest on the team"). Tie recognition to measurable outcomes.', color: C.blue },
            { title: 'VISIBILITY', desc: 'Public recognition amplifies impact. When peers and supervisors can see badges and kudos on the leaderboard or agent profile, it creates social proof and aspiration.', color: C.orange },
            { title: 'PEER-TO-PEER', desc: 'Supervisor recognition is important, but peer recognition builds team culture. Enable and encourage agents to recognize each other — it creates horizontal bonds, not just vertical ones.', color: C.green },
          ].map((principle, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, borderTop: `3px solid ${principle.color}` }}>
              <div className="font-bold text-sm mb-2" style={{ color: principle.color, fontFamily: MONO }}>{principle.title}</div>
              <div className="text-xs" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.6 }}>{principle.desc}</div>
            </div>
          ))}
        </div>
        <CalloutBox type="tip">Create a badge naming convention that feels rewarding: "CSAT Champion", "Resolution Rockstar", "Team Player of the Week", "Adherence All-Star". The name should make the recipient feel proud to display it. Avoid dry, corporate labels like "Metric Target Achievement Badge #4".</CalloutBox>
      </section>

      {/* T2S7 */}
      <section ref={el => sectionRefs.current['t2s7'] = el} id="t2s7">
        <SectionHeading>API & Reporting</SectionHeading>
        <Paragraph>The Genesys Cloud Gamification and Coaching APIs provide programmatic access to scores, leaderboards, coaching sessions, and development data. This enables custom dashboards, external reward system integration, and automated reporting workflows.</Paragraph>
        <SubHeading>Key API Endpoints</SubHeading>
        <InteractiveTable searchable headers={['Method', 'Endpoint', 'Use']} rows={WEM_API_ENDPOINTS.map(e => [e.method, e.path, e.use])} />
        <SubHeading>Common Integration Patterns</SubHeading>
        <div className="space-y-4 my-4">
          {[
            {
              title: 'Custom Performance Dashboard',
              steps: ['Query gamification scorecard API for agent scores and rankings', 'Query coaching appointments for upcoming sessions', 'Query development activities for plan progress', 'Combine data into a custom web dashboard or TV display for the contact center floor'],
            },
            {
              title: 'External Rewards System Integration',
              steps: ['Poll leaderboard API daily for top performers', 'When an agent hits top-3 position, trigger a webhook to external rewards platform', 'Award gift cards, PTO credits, or other tangible rewards automatically', 'Log the reward event back to Genesys Cloud via a badge award'],
            },
            {
              title: 'Automated Coaching Triggers',
              steps: ['Monitor agent scorecard API for performance below threshold', 'When an agent falls below threshold for 3 consecutive days, auto-create a coaching session', 'Pre-populate session agenda with the underperforming metrics and recent trend data', 'Notify the supervisor via email or Genesys Cloud notification'],
            },
          ].map((p, i) => (
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
        <SubHeading>Data Export & Reporting</SubHeading>
        <Paragraph>Gamification data can be exported for external analysis via the Analytics API or scheduled reports. Key data points available for export: agent scores by period, leaderboard snapshots, metric values by agent by day, coaching session history with notes, development plan completion rates, and badge award history. Use these exports to build long-term performance trend reports, ROI analysis on coaching investment, and executive dashboards.</Paragraph>
        <CodeBlock>{`// Example: Query agent gamification scores for a date range
GET /api/v2/gamification/scorecards/users/{userId}/points/trends
  ?startDate=2026-01-01
  &endDate=2026-01-31
  &dayOfWeek=Sunday

// Response includes daily point totals, cumulative scores,
// and rank position for each day in the range`}</CodeBlock>
      </section>

      {/* T2S8 */}
      <section ref={el => sectionRefs.current['t2s8'] = el} id="t2s8">
        <SectionHeading>Platform Limits & Troubleshooting</SectionHeading>
        <SubHeading>Platform Limits</SubHeading>
        <InteractiveTable searchable headers={['Resource', 'Limit', 'Notes']} rows={PLATFORM_LIMITS} />
        <SubHeading>Troubleshooting</SubHeading>
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
};

// ══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════
const GenesysWEMGuide = ({ onBack, isDark: isDarkProp, setIsDark: setIsDarkProp, initialNav }) => {
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
            <span className="font-bold text-sm hidden sm:block" style={{ fontFamily: MONO, color: C.purple }}>GENESYS WEM GUIDE</span>
            <span className="font-bold text-sm sm:hidden" style={{ fontFamily: MONO, color: C.purple }}>GC WEM</span>
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
      <Footer title="Genesys Cloud Workforce Engagement Management — Interactive Knowledge Guide" />
    </div>
  );
};

export default GenesysWEMGuide;
