import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Rocket, Settings, Cpu, Search, ChevronDown, ChevronUp, ChevronRight,
  Menu, X, Clock, Users, Bell, RefreshCw, CheckCircle,
  AlertTriangle, AlertCircle, Info, Lightbulb, Star, ExternalLink,
  BookOpen, ArrowRight, ArrowDown, ArrowLeft, Circle, Zap, Shield,
  FileText, Database, Activity, BarChart3, Target, Monitor,
  Hash, Layers, Eye, Sun, Moon, Calendar, Timer, TrendingUp, Award, Lock, UserCheck, Filter
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
  'The Big Picture — What Is Workforce Management and Why Does It Matter?',
  'How It All Fits Together — Forecasting, Scheduling, and Day-to-Day Operations',
  'Under the Hood — Algorithms, APIs, and Enterprise-Scale Strategies',
];
const TIER_AUDIENCES = [
  'For everyone — no experience needed',
  'For WFM analysts, supervisors & administrators',
  'For WFM engineers, architects & power users',
];
const TIER_ICONS_KEYS = ['Rocket', 'Settings', 'Cpu'];

// ══════════════════════════════════════════════════════════════
// SECTION METADATA (all tiers)
// ══════════════════════════════════════════════════════════════
const SECTIONS = [
  { tier: 0, id: 't1s1', title: 'What Is Workforce Management?' },
  { tier: 0, id: 't1s2', title: 'The WFM Lifecycle' },
  { tier: 0, id: 't1s3', title: 'The Building Blocks' },
  { tier: 0, id: 't1s4', title: 'Why WFM Matters — The Cost of Getting It Wrong' },
  { tier: 0, id: 't1s5', title: 'Key Terminology Glossary' },
  { tier: 1, id: 't2s1', title: 'Prerequisites & Setup' },
  { tier: 1, id: 't2s2', title: 'Forecasting — Predicting the Future' },
  { tier: 1, id: 't2s3', title: 'Work Plans & Shift Design' },
  { tier: 1, id: 't2s4', title: 'Scheduling — Building the Plan' },
  { tier: 1, id: 't2s5', title: 'Intraday Management' },
  { tier: 1, id: 't2s6', title: 'Adherence Monitoring' },
  { tier: 1, id: 't2s7', title: 'Time-Off Management' },
  { tier: 1, id: 't2s8', title: 'Reporting & Analytics' },
  { tier: 2, id: 't3s1', title: 'Forecasting Algorithms Deep Dive' },
  { tier: 2, id: 't3s2', title: 'Schedule Optimization Engine' },
  { tier: 2, id: 't3s3', title: 'Multi-Channel WFM' },
  { tier: 2, id: 't3s4', title: 'API & Integration Architecture' },
  { tier: 2, id: 't3s5', title: 'Advanced Intraday Strategies' },
  { tier: 2, id: 't3s6', title: 'Platform Limits — The Complete Reference' },
  { tier: 2, id: 't3s7', title: 'Licensing & Feature Matrix' },
  { tier: 2, id: 't3s8', title: 'Troubleshooting Decision Tree' },
];

// ══════════════════════════════════════════════════════════════
// T1 DATA
// ══════════════════════════════════════════════════════════════
const WFM_PILLARS = [
  { icon: 'TrendingUp', label: 'Forecasting', desc: 'Predicting how many interactions will arrive and when' },
  { icon: 'Calendar', label: 'Scheduling', desc: 'Creating agent work plans that meet demand while respecting constraints' },
  { icon: 'Activity', label: 'Intraday Mgmt', desc: 'Monitoring real-time conditions and making adjustments on the fly' },
  { icon: 'UserCheck', label: 'Adherence', desc: 'Tracking whether agents follow their assigned schedules' },
  { icon: 'BarChart3', label: 'Analytics', desc: 'Measuring forecast accuracy, schedule efficiency, and service levels' },
  { icon: 'Target', label: 'Service Goals', desc: 'Defining the targets the contact center must hit (SLA, ASA, occupancy)' },
];

const LIFECYCLE_STEPS = [
  { step: 1, title: 'HISTORICAL DATA COLLECTION', desc: 'The system collects interaction data — volumes, handle times, patterns — from your ACD queues over weeks and months.', color: C.blue, icon: 'Database' },
  { step: 2, title: 'FORECASTING', desc: 'Using historical patterns, the system predicts future interaction volumes and average handle times for each interval (typically 15 or 30 minutes).', color: C.purple, icon: 'TrendingUp' },
  { step: 3, title: 'SCHEDULING', desc: 'The optimizer builds agent schedules that meet forecasted demand while honoring work rules, shift constraints, and time-off requests.', color: C.green, icon: 'Calendar' },
  { step: 4, title: 'INTRADAY MANAGEMENT', desc: 'On the day of operations, WFM analysts monitor actual vs. forecasted volumes and adjust schedules — offering VTO, calling in overtime, or reassigning skills.', color: C.yellow, icon: 'Activity' },
  { step: 5, title: 'ADHERENCE MONITORING', desc: 'The system tracks whether each agent is doing what their schedule says — on a call when scheduled for phone work, on break when scheduled for break, etc.', color: C.orange, icon: 'Eye' },
  { step: 6, title: 'PERFORMANCE ANALYSIS', desc: 'After the period ends, WFM reviews forecast accuracy, schedule effectiveness, adherence rates, and service level achievement to improve the next cycle.', color: C.red, icon: 'BarChart3' },
];

const BUILDING_BLOCKS = [
  { name: 'Business Unit', explanation: 'The top-level organizational container in WFM. Represents your entire contact center operation or a major division. Contains all management units, planning groups, and settings.', analogy: 'The corporate headquarters — everything rolls up here' },
  { name: 'Management Unit', explanation: 'A group of agents managed together for scheduling purposes. Typically aligned to a site, team, or region. Agents belong to exactly one management unit. Defines the timezone, start day of week, and scheduling rules.', analogy: 'A branch office — each location runs its own schedule' },
  { name: 'Planning Group', explanation: 'A combination of route groups (queues) and skills used to group similar work for forecasting purposes. Planning groups drive how forecasts are generated and how staffing requirements are calculated.', analogy: 'A department within the branch — "Sales" or "Support" each has its own demand pattern' },
  { name: 'Service Goal', explanation: 'The target performance metric for a planning group — such as "Answer 80% of calls within 20 seconds" (SLA), or "Average speed of answer under 30 seconds" (ASA), or "Abandonment rate below 5%."', analogy: 'The restaurant\'s promise — "Your food will arrive within 15 minutes"' },
  { name: 'Work Plan', explanation: 'A template defining the structure of an agent\'s work week: which days they work, shift start/end times, break placement, meal placement, and minimum/maximum hours. Each agent is assigned one or more work plans.', analogy: 'The employee contract — "You work Monday through Friday, 9 AM to 5 PM, with a lunch at noon"' },
  { name: 'Activity', explanation: 'A named block of time on a schedule representing what an agent should be doing — On Queue, Break, Lunch, Meeting, Training, Back Office, etc. Activities map to real behaviors the adherence engine tracks.', analogy: 'A calendar event — "10:00-10:15 Break" or "2:00-3:00 Training"' },
  { name: 'Shift', explanation: 'A single day\'s work pattern within a work plan. Defines the start time, end time, and placement of activities (breaks, meals) within that day. Multiple shift variations can exist within one work plan.', analogy: 'One day\'s page in the employee handbook — "8-hour day with two 15-min breaks and one 30-min lunch"' },
];

const IMPACT_METRICS = [
  { scenario: 'Overstaffed by 10%', cost: 'Wasted payroll', impact: '~$500K-$2M/year for a 500-agent center', icon: 'red' },
  { scenario: 'Understaffed by 10%', cost: 'SLA breaches + attrition', impact: 'Service level drops from 80% to ~55%, hold times triple, agent burnout increases 40%', icon: 'red' },
  { scenario: 'Forecast off by 15%', cost: 'Cascading misalignment', impact: 'Every downstream schedule is wrong — you are planning for the wrong reality', icon: 'yellow' },
  { scenario: 'No adherence tracking', cost: 'Invisible shrinkage', impact: 'Agents may be off-phone 30-40% of scheduled time without visibility', icon: 'yellow' },
  { scenario: 'Optimized WFM', cost: 'Right-sized staffing', impact: 'SLA met consistently, payroll optimized, agent satisfaction improved', icon: 'green' },
];

const GLOSSARY = [
  { term: 'Shrinkage', def: 'The percentage of paid time agents are NOT available to handle interactions (breaks, meetings, training, absences, etc.). Typically 25-35%.', tier: 'Tier 2' },
  { term: 'Occupancy', def: 'The percentage of time an agent spends handling interactions vs. waiting for the next one. Target: 80-88%. Over 90% causes burnout.', tier: 'Tier 2' },
  { term: 'Utilization', def: 'The percentage of an agent\'s total paid time spent on productive work (handling + ready). Broader than occupancy.', tier: 'Tier 2' },
  { term: 'Service Level (SL)', def: 'The percentage of interactions answered within a target time threshold — e.g., "80/20" means 80% answered within 20 seconds.', tier: 'Tier 1' },
  { term: 'ASA (Average Speed of Answer)', def: 'The average time a customer waits in queue before being connected to an agent.', tier: 'Tier 1' },
  { term: 'AHT (Average Handle Time)', def: 'The total time from interaction start to completion, including talk time, hold time, and after-call work (ACW).', tier: 'Tier 1' },
  { term: 'FTE (Full-Time Equivalent)', def: 'A unit of measurement equal to one full-time employee\'s scheduled hours. Two half-time agents = 1 FTE.', tier: 'Tier 1' },
  { term: 'Erlang C', def: 'A mathematical formula that calculates the number of agents needed to meet a service level target, given interaction volume and handle time.', tier: 'Tier 3' },
  { term: 'Adherence', def: 'Whether an agent is in the correct state (on-queue, break, etc.) at the correct time according to their schedule.', tier: 'Tier 2' },
  { term: 'Conformance', def: 'Whether an agent worked the correct total amount of time, regardless of exact timing. An agent can be non-adherent but conformant.', tier: 'Tier 2' },
  { term: 'Schedule Efficiency', def: 'How closely the scheduled staff matches the required staff across all intervals. 100% = perfect match (impossible in practice).', tier: 'Tier 2' },
  { term: 'Forecast Accuracy', def: 'The degree to which the forecasted volume matches actual volume — typically measured as weighted Mean Absolute Percentage Error (wMAPE).', tier: 'Tier 2' },
  { term: 'Intraday', def: 'The practice of managing and adjusting staffing in real-time during the current business day.', tier: 'Tier 2' },
  { term: 'Planning Group', def: 'A Genesys Cloud WFM entity that groups queues/skills for forecasting. Forecast is generated per planning group.', tier: 'Tier 2' },
  { term: 'Management Unit (MU)', def: 'A group of agents managed together for scheduling. Typically a site or team. Agents belong to one MU.', tier: 'Tier 2' },
  { term: 'Business Unit (BU)', def: 'The top-level WFM container. One per organization (or per major division). Contains all MUs, planning groups, and configurations.', tier: 'Tier 1' },
  { term: 'Work Plan', def: 'A template defining an agent\'s weekly schedule structure — days on, shift times, break rules. Assigned per agent.', tier: 'Tier 2' },
  { term: 'Activity Code', def: 'A label defining what type of work an agent should be doing during a scheduled block (e.g., On Queue, Break, Meeting).', tier: 'Tier 2' },
  { term: 'RTA (Real-Time Adherence)', def: 'A live dashboard showing each agent\'s current state vs. their scheduled activity, with color-coded alerts.', tier: 'Tier 2' },
  { term: 'VTO (Voluntary Time Off)', def: 'Offering agents the option to leave early when the center is overstaffed — saves payroll without forcing anyone home.', tier: 'Tier 2' },
];

// ══════════════════════════════════════════════════════════════
// T2 DATA
// ══════════════════════════════════════════════════════════════
const PREREQUISITES = [
  { title: 'WFM Licensing', detail: 'Workforce Management requires either a Genesys Cloud 3 (GC3) license, a Genesys Cloud 2 + WEM Add-on, or the standalone WFM add-on for GC1. Without the correct license tier, the WFM menu items will not appear in the admin interface.' },
  { title: 'Business Unit Created', detail: 'Create at least one Business Unit. This is the top-level container for all WFM configuration. Set the timezone, start day of week (Sunday or Monday), and short-term forecast settings. Most organizations have one BU; large enterprises with separate operations may have multiple.' },
  { title: 'Management Units Configured', detail: 'Create Management Units to group agents by site, team, or scheduling boundary. Assign each agent to exactly one MU. Set the MU timezone (critical for correct schedule display), the scheduling run parameters, and adherence tracking settings.' },
  { title: 'Planning Groups Defined', detail: 'Create Planning Groups by associating route groups (queues) with the skills required to service them. Planning groups drive forecast generation — one forecast per planning group. Map every queue that needs WFM coverage to a planning group.' },
  { title: 'Activity Codes Set Up', detail: 'Define your activity codes: On Queue, Break, Lunch, Meeting, Training, Coaching, Back Office, Time Off, etc. Each code has a category (On Queue, Break, Meal, etc.) that tells the system how to count the time for adherence and shrinkage calculations. System defaults exist but should be customized.' },
  { title: 'Agents Assigned & Permissions', detail: 'Agents must be members of queues mapped to planning groups, assigned to a Management Unit, and given a Work Plan. WFM administrators need the Workforce Management Admin role. Supervisors need WFM Supervisor permissions. Agents need the WFM Agent role for schedule viewing and time-off requests.' },
];

const SETUP_SEQUENCE = ['Licensing', 'Business Unit', 'Activity Codes', 'Management Units', 'Planning Groups', 'Service Goals', 'Work Plans', 'Agent Assignment', 'Historical Import', 'First Forecast'];

const FORECAST_METHODS = [
  { name: 'Automatic Best Fit', desc: 'The system analyzes your historical data and automatically selects the best algorithm (from exponential smoothing, weighted moving average, ARIMA variants, etc.). This is the recommended default for most organizations.', best: 'Most situations — let the system decide' },
  { name: 'Weighted Historical Index', desc: 'Uses a weighted average of the same day/interval from prior weeks. More recent weeks get higher weight. Example: last week gets 40% weight, two weeks ago gets 30%, three weeks ago gets 20%, four weeks ago gets 10%.', best: 'Stable, predictable patterns with minimal trend' },
  { name: 'Manual Override', desc: 'WFM analysts can manually enter or adjust forecasted values for any interval. Useful for special events, promotions, or known anomalies the algorithm cannot predict (e.g., a product launch).', best: 'Special events, known anomalies, external data' },
  { name: 'Import External Data', desc: 'Upload forecast data from an external system (CSV or API). Enables integration with third-party forecasting tools or business intelligence platforms that may incorporate non-ACD data sources.', best: 'Organizations with established external forecasting tools' },
];

const FORECAST_HORIZONS = [
  { horizon: 'Short-Term', range: '1-2 weeks', use: 'Intraday and next-week fine-tuning. Highest accuracy window.', accuracy: '90-95%' },
  { horizon: 'Medium-Term', range: '3-8 weeks', use: 'Schedule generation, vacation planning, hiring pipeline decisions.', accuracy: '85-92%' },
  { horizon: 'Long-Term', range: '3-12 months', use: 'Budget planning, headcount requests, capacity modeling.', accuracy: '75-85%' },
];

const WORK_PLAN_CONSTRAINTS = [
  { constraint: 'Minimum/Maximum Shift Length', desc: 'Set the shortest and longest allowed shift per day (e.g., 4h min, 10h max).' },
  { constraint: 'Minimum/Maximum Work Days', desc: 'How many days per week the agent works (e.g., 4 min, 5 max for a standard work week).' },
  { constraint: 'Minimum/Maximum Weekly Hours', desc: 'Total weekly hours (e.g., 32h min, 40h max for full-time).' },
  { constraint: 'Earliest/Latest Shift Start', desc: 'The window for when a shift can begin (e.g., earliest 6:00 AM, latest 10:00 AM).' },
  { constraint: 'Consecutive Work Days', desc: 'Max days in a row without a day off (e.g., max 6 consecutive).' },
  { constraint: 'Minimum Time Between Shifts', desc: 'Hours of rest between end of one shift and start of next (e.g., 11 hours minimum).' },
  { constraint: 'Break Rules', desc: 'Number, duration, and placement rules for breaks (e.g., two 15-min paid breaks, one within first half, one within second half).' },
  { constraint: 'Meal Rules', desc: 'Placement window for meal breaks (e.g., 30-min unpaid lunch between hours 3 and 5 of the shift).' },
  { constraint: 'Start Time Flexibility', desc: 'Whether the optimizer can vary shift start times within the allowed window, or if they are fixed.' },
];

const SCHEDULING_GOALS = [
  { goal: 'Service Level Optimization', desc: 'The optimizer prioritizes meeting the service level target for each planning group. Agents are placed where the gap between required and scheduled staff is largest.', tradeoff: 'May result in higher labor cost if targets are aggressive.' },
  { goal: 'Cost Minimization', desc: 'The optimizer minimizes total scheduled hours while staying above minimum service thresholds. Prefers part-time agents to fill peak gaps rather than over-scheduling full-timers.', tradeoff: 'Service level may dip slightly below target in some intervals.' },
  { goal: 'Balanced', desc: 'A blend of service level and cost optimization. The optimizer tries to hit service targets while keeping overtime and excess hours minimal.', tradeoff: 'Neither metric is perfectly optimized, but both are acceptable.' },
];

const PTO_RULES = [
  { feature: 'Auto-Approval', desc: 'System automatically approves or denies time-off requests based on configured limits (e.g., max 3 agents off per day). No manual review needed.' },
  { feature: 'Waitlisting', desc: 'If the time-off limit is reached, new requests are placed on a waitlist. If an approved request is cancelled, the next waitlisted request is auto-approved.' },
  { feature: 'Time-Off Limits', desc: 'Configure per management unit: max number of agents (or FTEs) off per day, per activity code. Separate limits for different time-off types (vacation, sick, personal).' },
  { feature: 'Activity-Based Time-Off', desc: 'Agents request time off for a specific activity (e.g., "Vacation" vs. "Personal Day"). Each activity can have its own approval limits and rules.' },
  { feature: 'Time-Off Plan', desc: 'Define accrual rules, carryover limits, and balance tracking. Agents see their available balance when submitting requests.' },
];

const ADHERENCE_STATES = [
  { state: 'In Adherence', desc: 'Agent is in the correct status matching their scheduled activity (e.g., on a call during "On Queue" time).', color: C.green },
  { state: 'Out of Adherence', desc: 'Agent\'s actual status does not match their schedule (e.g., in "Available" during a scheduled break, or in "Break" during scheduled queue time).', color: C.red },
  { state: 'Unscheduled', desc: 'Agent is logged in but has no scheduled activity at this time. Not counted in adherence calculations.', color: C.yellow },
  { state: 'Exception', desc: 'A manual override by a supervisor — marks the out-of-adherence time as excused (e.g., agent was pulled into an emergency meeting).', color: C.blue },
];

const REPORTING_METRICS = [
  { report: 'Forecast Accuracy', metric: 'wMAPE', healthy: '< 10%', warning: '10-20%', critical: '> 20%' },
  { report: 'Schedule Efficiency', metric: 'Coverage %', healthy: '> 95%', warning: '85-95%', critical: '< 85%' },
  { report: 'Adherence Rate', metric: 'Adherence %', healthy: '> 90%', warning: '80-90%', critical: '< 80%' },
  { report: 'Service Level', metric: 'SL %', healthy: 'At or above target', warning: 'Within 5% of target', critical: '> 5% below target' },
  { report: 'Occupancy', metric: 'Occupancy %', healthy: '80-88%', warning: '> 88% or < 75%', critical: '> 92% (burnout risk)' },
  { report: 'Shrinkage', metric: 'Shrinkage %', healthy: 'Within planned (25-35%)', warning: '5%+ above plan', critical: '10%+ above plan' },
];

// ══════════════════════════════════════════════════════════════
// T3 DATA
// ══════════════════════════════════════════════════════════════
const ALGORITHM_COMPONENTS = [
  { name: 'Trend Analysis', desc: 'Detects whether interaction volume is increasing, decreasing, or stable over time. Applied as a multiplier to the base forecast.', example: 'If volume grew 3% month-over-month for 6 months, the forecast includes a growth factor.' },
  { name: 'Seasonality Detection', desc: 'Identifies recurring patterns: day-of-week (Monday is busiest), time-of-day (morning peak), monthly cycles (end-of-month billing calls), and annual patterns (holiday season).', example: 'Mondays forecast 15% higher than Wednesdays; December forecasts 30% above average.' },
  { name: 'Time Series Decomposition', desc: 'Separates the historical data into three components: Trend (long-term direction) + Seasonality (repeating patterns) + Residual (random noise). The forecast uses Trend + Seasonality and discards Residual.', example: 'Raw data shows spikes; after decomposition, the system sees the underlying pattern clearly.' },
  { name: 'Special Day Handling', desc: 'Marks days that deviate from normal patterns (holidays, promotions, outages). The system either excludes these from training data or uses them to build a separate "special day" forecast model.', example: 'Black Friday is tagged so the system learns that it\'s 300% of normal volume, not an anomaly to ignore.' },
  { name: 'Multi-Queue Forecasting', desc: 'Each planning group gets its own independent forecast. Cross-skill agents are counted fractionally across planning groups based on the percentage of time they handle each type of work.', example: 'An agent in both Sales and Support planning groups may be counted as 0.6 FTE for Sales and 0.4 FTE for Support.' },
];

const OPTIMIZER_CONCEPTS = [
  { concept: 'Constraint Satisfaction', desc: 'The optimizer must produce schedules that satisfy ALL hard constraints (legal requirements, minimum rest, max hours) before it can optimize for soft goals (service level, preferences). If hard constraints conflict with staffing needs, the optimizer reports infeasibility.', color: C.red },
  { concept: 'Objective Function', desc: 'The mathematical formula the optimizer tries to maximize or minimize. Typically: minimize (understaffing penalty * weight) + (overstaffing penalty * weight) + (constraint violation penalty * weight). The weights determine whether the system prioritizes service level, cost, or balance.', color: C.blue },
  { concept: 'Iterative Optimization', desc: 'The optimizer does not find the perfect schedule in one pass. It starts with an initial feasible solution, then iteratively improves it — swapping shift start times, moving breaks, reassigning days off — evaluating each change against the objective function.', color: C.green },
  { concept: 'Solution Scoring', desc: 'Each candidate schedule receives a score based on: total service level coverage, total overtime hours, number of agent preference violations, and constraint adherence. The optimizer keeps the highest-scoring solution found within the time limit.', color: C.purple },
];

const MULTICHANNEL_CONFIG = [
  { channel: 'Voice', concurrency: '1 interaction at a time', forecasting: 'Erlang C model — arrival rate, AHT, and service level drive staffing', scheduling: 'Standard single-interaction scheduling' },
  { channel: 'Chat', concurrency: '1-6 simultaneous chats (configurable)', forecasting: 'Modified Erlang with concurrency factor — 3 concurrent chats may need 0.5 FTE instead of 3 FTEs', scheduling: 'Agents scheduled for chat can handle multiple interactions; FTE calculation adjusts for concurrency' },
  { channel: 'Email', concurrency: 'Deferred / async — no real-time SLA', forecasting: 'Volume-based rather than Erlang — "process X emails per hour per agent"', scheduling: 'Can be used as backlog filler during low-volume voice periods' },
  { channel: 'Messaging', concurrency: '1-6 simultaneous (configurable)', forecasting: 'Similar to chat — arrival rate adjusted for longer handle times and async nature', scheduling: 'Blended scheduling with chat; concurrency settings critical for accurate staffing' },
];

const API_ENDPOINTS = [
  { method: 'GET', path: '/api/v2/workforcemanagement/businessunits', use: 'List all business units' },
  { method: 'GET', path: '/api/v2/workforcemanagement/businessunits/{buId}/managementunits', use: 'List management units in a BU' },
  { method: 'POST', path: '/api/v2/workforcemanagement/managementunits/{muId}/schedules/search', use: 'Search agent schedules' },
  { method: 'POST', path: '/api/v2/workforcemanagement/managementunits/{muId}/agents/schedules', use: 'Get agent schedules for a date range' },
  { method: 'POST', path: '/api/v2/workforcemanagement/businessunits/{buId}/forecasts/generate', use: 'Generate a new forecast' },
  { method: 'GET', path: '/api/v2/workforcemanagement/managementunits/{muId}/adherence', use: 'Get real-time adherence data' },
  { method: 'POST', path: '/api/v2/workforcemanagement/managementunits/{muId}/timeoffrequests', use: 'Create a time-off request' },
  { method: 'GET', path: '/api/v2/workforcemanagement/managementunits/{muId}/workplans', use: 'List work plans for an MU' },
  { method: 'POST', path: '/api/v2/workforcemanagement/managementunits/{muId}/schedules/generate', use: 'Trigger schedule generation' },
  { method: 'GET', path: '/api/v2/workforcemanagement/adherence/historical', use: 'Get historical adherence data' },
];

const INTEGRATION_OPTIONS = [
  { name: 'HRIS Integration (Data Actions)', desc: 'Connect to Workday, SAP SuccessFactors, ADP, or BambooHR via REST data actions. Sync agent records, organizational structure, and employment details. Use for automated agent onboarding into WFM management units.' },
  { name: 'Payroll Export', desc: 'Export schedule data, actual hours worked, overtime, and time-off usage via API. Map activity codes to payroll codes for automatic timesheet population. Supports custom export formats via data actions or scheduled API extractions.' },
  { name: 'Notification API (WebSocket)', desc: 'Subscribe to real-time WFM events: schedule changes, adherence alerts, time-off approvals, forecast completion. Enables building custom dashboards and mobile alert systems. Topic: v2.workforcemanagement.managementunits.{muId}' },
];

const INTRADAY_STRATEGIES = [
  { strategy: 'Automated VTO Offers', desc: 'When actual volume is significantly below forecast, the system can automatically identify agents eligible for voluntary time off and send offers via the agent interface. Rules define: minimum overstaffing threshold, eligible agents, maximum VTO hours per day.', impact: 'Reduces payroll waste by 5-15% on overstaffed days' },
  { strategy: 'Overtime Callout', desc: 'When actual volume exceeds forecast, identify off-shift agents with matching skills and send overtime offers. Priority rules consider: agent preferences, overtime cost tier, skill match, schedule fairness.', impact: 'Recovers service level within 30-60 minutes of spike detection' },
  { strategy: 'Skill Reassignment', desc: 'Temporarily assign agents to different queues or planning groups based on real-time need. Example: reassign 5 sales agents to support during an unexpected volume surge. Requires agents to have the necessary skills configured.', impact: 'Rebalances coverage without changing headcount' },
  { strategy: 'Real-Time Routing Adjustment', desc: 'Integrate WFM intraday signals with ACD routing logic. When WFM detects understaffing in a planning group, routing can be adjusted to overflow to secondary skill groups, activate callback offers, or modify queue priority.', impact: 'Reduces customer-facing impact of staffing shortfalls' },
];

const PLATFORM_LIMITS = [
  ['Business Units per org', '1 (default), up to 5 on request', ''],
  ['Management Units per BU', '1,000', ''],
  ['Agents per Management Unit', '5,000', ''],
  ['Agents per Business Unit', '10,000', ''],
  ['Planning Groups per BU', '300', ''],
  ['Work Plans per MU', '100', ''],
  ['Shifts per Work Plan', '14 (one per day of a 2-week rotation)', ''],
  ['Activities per shift', '20', ''],
  ['Forecast horizon (short-term)', '4 weeks', ''],
  ['Forecast horizon (long-term)', '52 weeks', ''],
  ['Schedule generation range', 'Up to 5 weeks', ''],
  ['Schedule generation time limit', '72 hours max (varies by MU size)', ''],
  ['Time-off requests per agent per year', '100', ''],
  ['Historical data retention for forecasting', '2 years', ''],
  ['Intraday monitoring update interval', '15 minutes', ''],
  ['Adherence data retention', '30 days real-time, 13 months historical', ''],
  ['Schedule export/import batch size', '5,000 agents', ''],
  ['Concurrent forecast generation jobs', '5 per BU', ''],
];

const LICENSE_MATRIX = [
  ['WFM Forecasting', false, 'Add-on', true],
  ['WFM Scheduling', false, 'Add-on', true],
  ['Real-Time Adherence (RTA)', false, 'Add-on', true],
  ['Historical Adherence', false, 'Add-on', true],
  ['Intraday Monitoring', false, 'Add-on', true],
  ['Time-Off Management', false, 'Add-on', true],
  ['Schedule Bidding (shift bidding)', false, 'Add-on', true],
  ['Work Plan Rotations', false, 'Add-on', true],
  ['Multi-Channel Forecasting', false, 'Add-on', true],
  ['Long-Term Forecasting', false, 'Add-on', true],
  ['Agent Schedule View (mobile)', false, 'Add-on', true],
  ['Agent Time-Off Requests', false, 'Add-on', true],
  ['WFM API Access', false, 'Add-on', true],
];

const TROUBLESHOOTING = [
  { symptom: 'Forecast is significantly inaccurate', investigation: 'Check: Is there enough historical data? (Minimum 3-4 weeks recommended, 3+ months ideal) → Are special days tagged? (Holidays and promotions will skew the baseline if not excluded) → Has the business changed recently? (New product launch, marketing campaign, or staffing change that shifted AHT) → Are planning groups correctly mapped to all relevant queues? (Missing a queue means missing volume) → Try switching forecast method to "Automatic Best Fit" if using manual weights.' },
  { symptom: 'Schedule generation fails or times out', investigation: 'Check: Are work plan constraints too restrictive? (e.g., fixed start time + minimum hours + specific break placement may be impossible to satisfy) → Is the MU too large? (Break MUs with 1000+ agents into smaller groups) → Are there enough agents to cover demand? (If 50 agents cannot mathematically meet the service goal, the optimizer may fail) → Check for circular constraints (e.g., "must work Monday" + "max 4 days" + "must have Saturday-Sunday off" + "must work Friday" = impossible).' },
  { symptom: 'Adherence tracking not working', investigation: 'Check: Is the agent assigned to a Management Unit? (No MU = no adherence tracking) → Does the agent have a published schedule? (Adherence only tracks against published schedules) → Are activity codes mapped to the correct category? (If "On Queue" is categorized as "Break," adherence will show incorrect results) → Is the agent\'s status mapping correct? (ACD statuses must map to WFM activity codes) → Check system presence vs. organization presence configuration.' },
  { symptom: 'Agents not seeing their schedules', investigation: 'Check: Does the agent have the WFM Agent role/permission? → Has the schedule been PUBLISHED (not just generated)? → Is the agent assigned to the correct Management Unit? → Is the agent using the correct timezone in their profile? (Schedule may appear on wrong dates) → Check if the agent is viewing the correct date range in the schedule view.' },
  { symptom: 'Intraday view shows no data', investigation: 'Check: Is there a published schedule for today? → Is there an active forecast for the current period? → Are planning groups mapped to active queues with agents? → Is the management unit timezone correctly configured? → Verify that real-time data feeds are operational (check WFM service health in Status page).' },
];

// ══════════════════════════════════════════════════════════════
// SEARCH INDEX
// ══════════════════════════════════════════════════════════════
const SEARCH_INDEX = (() => {
  const idx = [];
  SECTIONS.forEach(s => idx.push({ text: s.title, label: s.title, sectionId: s.id, tier: s.tier, type: 'Section' }));
  WFM_PILLARS.forEach(p => idx.push({ text: `${p.label} ${p.desc}`, label: p.label, sectionId: 't1s1', tier: 0, type: 'Pillar' }));
  LIFECYCLE_STEPS.forEach(s => idx.push({ text: `${s.title} ${s.desc}`, label: s.title, sectionId: 't1s2', tier: 0, type: 'Lifecycle Step' }));
  BUILDING_BLOCKS.forEach(b => idx.push({ text: `${b.name} ${b.explanation} ${b.analogy}`, label: b.name, sectionId: 't1s3', tier: 0, type: 'Building Block' }));
  IMPACT_METRICS.forEach(m => idx.push({ text: `${m.scenario} ${m.cost} ${m.impact}`, label: m.scenario, sectionId: 't1s4', tier: 0, type: 'Impact Scenario' }));
  GLOSSARY.forEach(g => idx.push({ text: `${g.term} ${g.def}`, label: g.term, sectionId: 't1s5', tier: 0, type: 'Glossary' }));
  PREREQUISITES.forEach(p => idx.push({ text: `${p.title} ${p.detail}`, label: p.title, sectionId: 't2s1', tier: 1, type: 'Prerequisite' }));
  SETUP_SEQUENCE.forEach(s => idx.push({ text: s, label: s, sectionId: 't2s1', tier: 1, type: 'Setup Step' }));
  FORECAST_METHODS.forEach(m => idx.push({ text: `${m.name} ${m.desc} ${m.best}`, label: m.name, sectionId: 't2s2', tier: 1, type: 'Forecast Method' }));
  FORECAST_HORIZONS.forEach(h => idx.push({ text: `${h.horizon} ${h.range} ${h.use} ${h.accuracy}`, label: h.horizon, sectionId: 't2s2', tier: 1, type: 'Forecast Horizon' }));
  WORK_PLAN_CONSTRAINTS.forEach(c => idx.push({ text: `${c.constraint} ${c.desc}`, label: c.constraint, sectionId: 't2s3', tier: 1, type: 'Constraint' }));
  SCHEDULING_GOALS.forEach(g => idx.push({ text: `${g.goal} ${g.desc} ${g.tradeoff}`, label: g.goal, sectionId: 't2s4', tier: 1, type: 'Schedule Goal' }));
  ADHERENCE_STATES.forEach(a => idx.push({ text: `${a.state} ${a.desc}`, label: a.state, sectionId: 't2s6', tier: 1, type: 'Adherence State' }));
  PTO_RULES.forEach(p => idx.push({ text: `${p.feature} ${p.desc}`, label: p.feature, sectionId: 't2s7', tier: 1, type: 'PTO Feature' }));
  REPORTING_METRICS.forEach(m => idx.push({ text: `${m.report} ${m.metric} ${m.healthy} ${m.warning} ${m.critical}`, label: m.report, sectionId: 't2s8', tier: 1, type: 'Metric' }));
  ALGORITHM_COMPONENTS.forEach(a => idx.push({ text: `${a.name} ${a.desc} ${a.example}`, label: a.name, sectionId: 't3s1', tier: 2, type: 'Algorithm' }));
  OPTIMIZER_CONCEPTS.forEach(o => idx.push({ text: `${o.concept} ${o.desc}`, label: o.concept, sectionId: 't3s2', tier: 2, type: 'Optimizer Concept' }));
  MULTICHANNEL_CONFIG.forEach(c => idx.push({ text: `${c.channel} ${c.concurrency} ${c.forecasting} ${c.scheduling}`, label: c.channel, sectionId: 't3s3', tier: 2, type: 'Channel Config' }));
  API_ENDPOINTS.forEach(a => idx.push({ text: `${a.method} ${a.path} ${a.use}`, label: `${a.method} ${a.path}`, sectionId: 't3s4', tier: 2, type: 'API' }));
  INTEGRATION_OPTIONS.forEach(i => idx.push({ text: `${i.name} ${i.desc}`, label: i.name, sectionId: 't3s4', tier: 2, type: 'Integration' }));
  INTRADAY_STRATEGIES.forEach(s => idx.push({ text: `${s.strategy} ${s.desc} ${s.impact}`, label: s.strategy, sectionId: 't3s5', tier: 2, type: 'Strategy' }));
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

const InteractiveTable = ({ headers, rows, searchable = false }) => {
  const [q, setQ] = useState('');
  const filtered = q ? rows.filter(r => r.some(c => String(c).toLowerCase().includes(q.toLowerCase()))) : rows;
  return (
    <div className="my-4">
      {searchable && <input className="w-full mb-3 px-3 py-2 rounded text-sm" style={{ backgroundColor: C.bg3, border: `1px solid ${C.border}`, color: C.t1, fontFamily: SANS }} placeholder="Search..." value={q} onChange={e => setQ(e.target.value)} />}
      <div className="overflow-x-auto rounded-lg" style={{ border: `1px solid ${C.border}` }}>
        <table className="w-full text-sm" style={{ fontFamily: SANS }}>
          <thead><tr>{headers.map((h, i) => <th key={i} className="text-left px-4 py-3 font-semibold" style={{ backgroundColor: C.bg3, color: C.t1, borderBottom: `1px solid ${C.border}`, fontFamily: MONO, fontSize: 12 }}>{h}</th>)}</tr></thead>
          <tbody>{filtered.map((row, ri) => <tr key={ri} className="transition-colors duration-150" style={{ backgroundColor: ri % 2 === 0 ? C.bg2 : C.bg1 }} onMouseEnter={e => e.currentTarget.style.backgroundColor = C.bg3} onMouseLeave={e => e.currentTarget.style.backgroundColor = ri % 2 === 0 ? C.bg2 : C.bg1}>{row.map((cell, ci) => <td key={ci} className="px-4 py-3" style={{ color: C.t2, borderBottom: `1px solid ${C.border}`, fontSize: 13 }}>{cell === true ? <span style={{ color: C.green }}>Included</span> : cell === false ? <span style={{ color: C.red }}>Not Available</span> : cell === 'Add-on' ? <span style={{ color: C.yellow }}>Add-on</span> : cell}</td>)}</tr>)}</tbody>
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
// TIER 1 CONTENT
// ══════════════════════════════════════════════════════════════
const Tier1Content = ({ sectionRefs }) => {
  return (
    <div className="space-y-16">
      {/* T1S1 */}
      <section ref={el => sectionRefs.current['t1s1'] = el} id="t1s1">
        <SectionHeading>What Is Workforce Management?</SectionHeading>
        <Paragraph>Workforce Management (WFM) is the discipline of forecasting customer demand, scheduling the right number of agents at the right times, and tracking real-time performance to ensure service goals are met — all while controlling labor costs. In a contact center, labor is typically 65-75% of total operating cost, making WFM one of the highest-impact functions in the organization.</Paragraph>
        <Paragraph>Think of WFM like being the manager of a busy restaurant. You need to predict how many customers will come each hour (forecasting), schedule enough cooks and servers to handle the rush (scheduling), watch the dining room in real-time and call in backup if it gets unexpectedly slammed (intraday management), and make sure your staff is actually at their stations when they should be (adherence).</Paragraph>
        <CalloutBox type="tip">In Genesys Cloud CX, WFM is a built-in module that automates this entire process — from analyzing historical interaction data to generating optimized schedules to tracking adherence in real time.</CalloutBox>
        <SubHeading>The Five Pillars of WFM</SubHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 my-4">
          {WFM_PILLARS.map((p, i) => (
            <div key={i} className="rounded-lg p-4 flex items-start gap-3 transition-all duration-200 hover:-translate-y-0.5" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
              <Clock size={20} style={{ color: C.orange, flexShrink: 0 }} />
              <div><div className="font-semibold text-sm" style={{ color: C.t1, fontFamily: MONO }}>{p.label}</div><div className="text-xs mt-1" style={{ color: C.t2, fontFamily: SANS }}>{p.desc}</div></div>
            </div>
          ))}
        </div>
        <SubHeading>Reactive vs. Proactive Staffing</SubHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          {[
            { title: 'WITHOUT WFM (REACTIVE)', items: ['Managers guess staffing based on gut feel', 'Schedules are static spreadsheets', 'Understaffing discovered only when queues spike', 'Overstaffing invisible — wasted payroll unnoticed', 'Agent schedules inflexible and often unfair'], color: C.red },
            { title: 'WITH WFM (PROACTIVE)', items: ['Data-driven forecasts predict demand accurately', 'Optimized schedules match supply to demand', 'Intraday tools detect issues before customers feel them', 'Overstaffing identified instantly — VTO offered', 'Agent preferences considered, schedules balanced fairly'], color: C.green },
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
        <SectionHeading>The WFM Lifecycle</SectionHeading>
        <Paragraph>Workforce management is a continuous cycle, not a one-time setup. Each step feeds into the next, and the output of performance analysis improves the next round of forecasting. Understanding this loop is key to understanding why every WFM component exists.</Paragraph>
        <CalloutBox type="info">The cycle repeats continuously — weekly for scheduling, daily for intraday management, and in real-time for adherence. The feedback loop is what makes WFM increasingly accurate over time.</CalloutBox>
        <div className="my-6 space-y-0">
          {LIFECYCLE_STEPS.map((s, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: s.color + '22', color: s.color, border: `2px solid ${s.color}`, fontFamily: MONO }}>{s.step}</div>
                {i < LIFECYCLE_STEPS.length - 1 && <div className="w-0.5 flex-1 my-1" style={{ backgroundColor: C.border }} />}
              </div>
              <div className="pb-6 flex-1">
                <div className="font-bold text-sm mb-1" style={{ color: C.t1, fontFamily: MONO }}>{s.title}</div>
                <div className="text-sm" style={{ color: C.t2, fontFamily: SANS }}>{s.desc}</div>
              </div>
            </div>
          ))}
          <div className="flex gap-4 items-center">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: C.green + '22', border: `2px solid ${C.green}` }}>
              <RefreshCw size={16} style={{ color: C.green }} />
            </div>
            <div className="font-bold text-sm" style={{ color: C.green, fontFamily: MONO }}>CYCLE REPEATS (feedback from analysis improves next forecast)</div>
          </div>
        </div>
      </section>

      {/* T1S3 */}
      <section ref={el => sectionRefs.current['t1s3'] = el} id="t1s3">
        <SectionHeading>The Building Blocks</SectionHeading>
        <Paragraph>Genesys Cloud WFM is built on a hierarchy of organizational entities. Understanding what each one does — and how they relate — is essential before you configure anything.</Paragraph>
        <div className="my-4 p-4 rounded-lg" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
          <div className="font-bold text-xs mb-3" style={{ color: C.orange, fontFamily: MONO }}>ORGANIZATIONAL HIERARCHY</div>
          {[
            { indent: 0, text: 'BUSINESS UNIT (top-level container)', color: C.orange },
            { indent: 1, text: 'MANAGEMENT UNIT (agent groups / sites)', color: C.blue },
            { indent: 2, text: 'AGENTS (assigned to one MU, one or more work plans)', color: C.green },
            { indent: 2, text: 'WORK PLANS (weekly schedule templates)', color: C.green },
            { indent: 2, text: 'SCHEDULES (generated from work plans + forecast)', color: C.green },
            { indent: 1, text: 'PLANNING GROUPS (queue + skill combos for forecasting)', color: C.purple },
            { indent: 2, text: 'SERVICE GOALS (SLA targets per planning group)', color: C.purple },
            { indent: 2, text: 'FORECASTS (predicted volume per planning group)', color: C.purple },
            { indent: 1, text: 'ACTIVITY CODES (what agents do: On Queue, Break, Lunch...)', color: C.yellow },
          ].map((line, i) => (
            <div key={i} className="text-xs" style={{ paddingLeft: line.indent * 24, color: line.color, fontFamily: MONO, marginBottom: 3 }}>{line.text}</div>
          ))}
        </div>
        <div className="space-y-3 my-4">
          {BUILDING_BLOCKS.map((b, i) => (
            <ExpandableCard key={i} title={b.name} accent={C.orange}>
              <div className="space-y-2">
                <div>{b.explanation}</div>
                <div><strong style={{ color: C.t1 }}>Think of it as:</strong> <em>{b.analogy}</em></div>
              </div>
            </ExpandableCard>
          ))}
        </div>
      </section>

      {/* T1S4 */}
      <section ref={el => sectionRefs.current['t1s4'] = el} id="t1s4">
        <SectionHeading>Why WFM Matters — The Cost of Getting It Wrong</SectionHeading>
        <Paragraph>In a contact center, being off by even 10% in staffing has dramatic consequences. Too many agents? You are burning payroll. Too few? Customers wait, abandon, and complain — and your agents burn out from being overworked. WFM exists to find the balance.</Paragraph>
        <SubHeading>Impact Scenarios</SubHeading>
        <div className="space-y-3 my-4">
          {IMPACT_METRICS.map((m, i) => (
            <div key={i} className="rounded-lg p-4 flex items-start gap-3" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}`, borderLeft: `4px solid ${m.icon === 'green' ? C.green : m.icon === 'yellow' ? C.yellow : C.red}` }}>
              <div className="flex-1">
                <div className="font-semibold text-sm mb-1" style={{ color: C.t1, fontFamily: MONO }}>{m.scenario}</div>
                <div className="text-xs mb-1" style={{ color: m.icon === 'green' ? C.green : m.icon === 'yellow' ? C.yellow : C.red }}>{m.cost}</div>
                <div className="text-xs" style={{ color: C.t2, fontFamily: SANS }}>{m.impact}</div>
              </div>
            </div>
          ))}
        </div>
        <SubHeading>The Erlang C Concept (Simplified)</SubHeading>
        <Paragraph>Erlang C is the mathematical formula at the heart of WFM staffing calculations. It answers: "Given X calls per hour, with Y seconds average handle time, how many agents do I need to answer Z% of calls within W seconds?"</Paragraph>
        <div className="my-4 p-4 rounded-lg" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
          <div className="font-bold text-xs mb-3" style={{ color: C.purple, fontFamily: MONO }}>ERLANG C — SIMPLIFIED</div>
          <div className="space-y-2">
            {[
              { label: 'INPUTS', items: ['Calls per interval (e.g., 120 calls per 30 min)', 'Average Handle Time (e.g., 300 seconds)', 'Service Level Target (e.g., 80% in 20 seconds)'] },
              { label: 'CALCULATES', items: ['Base agents needed (raw Erlang result)', '+ Shrinkage factor (e.g., 30% for breaks, meetings, absences)', '= Total agents to schedule'] },
              { label: 'KEY INSIGHT', items: ['The relationship is NON-LINEAR: going from 80% SL to 85% SL might need 3 extra agents, but going from 90% to 95% might need 8 extra agents. The last few percentage points are exponentially expensive.'] },
            ].map((group, i) => (
              <div key={i} className="mb-3">
                <div className="text-xs font-bold mb-1" style={{ color: C.purple, fontFamily: MONO }}>{group.label}:</div>
                {group.items.map((item, j) => <div key={j} className="text-xs ml-3" style={{ color: C.t2, fontFamily: SANS }}>- {item}</div>)}
              </div>
            ))}
          </div>
        </div>
        <CalloutBox type="warning">A common mistake is applying Erlang C to email or chat without adjusting for concurrency. Erlang C assumes one interaction per agent at a time. For multi-session channels, modified models or simulation-based approaches are required.</CalloutBox>
      </section>

      {/* T1S5 */}
      <section ref={el => sectionRefs.current['t1s5'] = el} id="t1s5">
        <SectionHeading>Key Terminology Glossary</SectionHeading>
        <Paragraph>Bookmark this section. WFM has its own language, and understanding these terms is foundational to everything that follows.</Paragraph>
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
  const [activeForecastTab, setActiveForecastTab] = useState(0);
  return (
    <div className="space-y-16">
      {/* T2S1 */}
      <section ref={el => sectionRefs.current['t2s1'] = el} id="t2s1">
        <SectionHeading>Prerequisites & Setup</SectionHeading>
        <Paragraph>Before generating your first forecast or schedule, these foundational components must be in place. Think of this as laying the foundation — skip a step and everything built on top will be unstable.</Paragraph>
        <div className="space-y-3 my-4">
          {PREREQUISITES.map((p, i) => (
            <ExpandableCard key={i} title={`${i + 1}. ${p.title}`} accent={C.blue}>
              {p.detail}
            </ExpandableCard>
          ))}
        </div>
        <SubHeading>Recommended Setup Sequence</SubHeading>
        <div className="flex flex-wrap items-center gap-1 my-4 overflow-x-auto">
          {SETUP_SEQUENCE.map((s, i) => (
            <React.Fragment key={i}>
              <span className="px-3 py-1.5 rounded text-xs whitespace-nowrap" style={{ backgroundColor: C.bg3, color: C.t1, fontFamily: MONO, border: `1px solid ${C.border}` }}>{s}</span>
              {i < SETUP_SEQUENCE.length - 1 && <ArrowRight size={14} style={{ color: C.t3, flexShrink: 0 }} />}
            </React.Fragment>
          ))}
        </div>
        <CalloutBox type="info">Historical data is the fuel for forecasting. If you are migrating from another WFM system, import at least 8-12 weeks of historical interval data before generating your first forecast. Genesys Cloud can also use its own ACD data once queues have been operational for 3-4 weeks.</CalloutBox>
      </section>

      {/* T2S2 */}
      <section ref={el => sectionRefs.current['t2s2'] = el} id="t2s2">
        <SectionHeading>Forecasting — Predicting the Future</SectionHeading>
        <Paragraph>Forecasting is the foundation of everything in WFM. A bad forecast leads to a bad schedule, which leads to either overstaffing (wasted money) or understaffing (angry customers and burnt-out agents). Genesys Cloud WFM uses historical ACD data to predict future interaction volumes and average handle times.</Paragraph>
        <SubHeading>Data Sources</SubHeading>
        <div className="space-y-2 my-3">
          {[
            ['Historical ACD Data', 'Interaction volume, AHT, and abandon data from queues mapped to planning groups. The primary and most reliable data source.'],
            ['Imported Data', 'CSV upload of historical or forecasted data from external systems. Used during migration or when blending WFM data with external BI tools.'],
            ['Manual Adjustments', 'WFM analyst overrides for specific intervals — adding expected volume for a known event (sale, marketing blast, product launch).'],
          ].map(([label, desc], i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-1 p-3 rounded" style={{ backgroundColor: C.bg2 }}>
              <span className="text-xs font-semibold whitespace-nowrap min-w-[160px]" style={{ color: C.blue, fontFamily: MONO }}>{label}:</span>
              <span className="text-xs" style={{ color: C.t2, fontFamily: SANS }}>{desc}</span>
            </div>
          ))}
        </div>
        <SubHeading>Forecast Methods</SubHeading>
        <div className="flex gap-1 mb-3 overflow-x-auto">
          {FORECAST_METHODS.map((m, i) => (
            <button key={i} className="px-3 py-1.5 rounded text-xs whitespace-nowrap cursor-pointer transition-colors" onClick={() => setActiveForecastTab(i)} style={{ backgroundColor: activeForecastTab === i ? C.blue : C.bg3, color: activeForecastTab === i ? '#fff' : C.t2, fontFamily: MONO }}>{m.name}</button>
          ))}
        </div>
        <div className="p-4 rounded-lg text-sm" style={{ backgroundColor: C.bg2, color: C.t2, fontFamily: SANS, border: `1px solid ${C.border}`, lineHeight: 1.7 }}>
          <div className="mb-2">{FORECAST_METHODS[activeForecastTab].desc}</div>
          <div className="text-xs mt-2 p-2 rounded" style={{ backgroundColor: C.bg3, color: C.t1 }}><strong>Best for:</strong> {FORECAST_METHODS[activeForecastTab].best}</div>
        </div>
        <SubHeading>Forecast Horizons</SubHeading>
        <InteractiveTable
          headers={['Horizon', 'Range', 'Primary Use', 'Typical Accuracy']}
          rows={FORECAST_HORIZONS.map(h => [h.horizon, h.range, h.use, h.accuracy])}
        />
        <CalloutBox type="tip">Always review your forecast before using it for scheduling. Look at the daily totals — do they make sense? Check weekends vs. weekdays. Flag any intervals where the forecast seems unreasonably high or low. A 5-minute review can catch errors that would cascade through the entire schedule.</CalloutBox>
      </section>

      {/* T2S3 */}
      <section ref={el => sectionRefs.current['t2s3'] = el} id="t2s3">
        <SectionHeading>Work Plans & Shift Design</SectionHeading>
        <Paragraph>Work plans define the rules of the game for scheduling. They tell the optimizer what types of schedules are allowed — which days agents can work, how long shifts can be, when breaks go, and how flexible the system can be. Well-designed work plans are the difference between a schedule the optimizer can actually build and one that fails to generate.</Paragraph>
        <SubHeading>Work Plan Constraints</SubHeading>
        <div className="space-y-2 my-4">
          {WORK_PLAN_CONSTRAINTS.map((c, i) => (
            <div key={i} className="rounded-lg p-3" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
              <div className="font-semibold text-xs mb-1" style={{ color: C.t1, fontFamily: MONO }}>{c.constraint}</div>
              <div className="text-xs" style={{ color: C.t2, fontFamily: SANS }}>{c.desc}</div>
            </div>
          ))}
        </div>
        <SubHeading>Work Plan Rotations</SubHeading>
        <Paragraph>A rotation cycles an agent through multiple work plans on a repeating schedule. Example: Week 1 = "Early Shift" (6 AM - 2 PM), Week 2 = "Mid Shift" (10 AM - 6 PM), Week 3 = "Late Shift" (2 PM - 10 PM), then back to Week 1. Rotations ensure fairness — no one is permanently stuck on the least desirable shift.</Paragraph>
        <SubHeading>Bid-Based Scheduling</SubHeading>
        <Paragraph>Agents rank their preferred work plans or shifts by priority. The system assigns shifts based on seniority, performance scores, or other configured criteria. Agents with higher ranking get their preferred schedules first. This improves agent satisfaction while still meeting operational requirements.</Paragraph>
        <CalloutBox type="warning">The more constraints you add to work plans, the harder it is for the optimizer to find a solution. Start with flexible work plans (wide start-time windows, flexible break placement) and tighten constraints only when operationally necessary. Over-constrained work plans are the number one cause of schedule generation failures.</CalloutBox>
      </section>

      {/* T2S4 */}
      <section ref={el => sectionRefs.current['t2s4'] = el} id="t2s4">
        <SectionHeading>Scheduling — Building the Plan</SectionHeading>
        <Paragraph>Schedule generation is where forecast meets work plans. The optimizer takes the forecasted staffing requirements and builds agent schedules that satisfy demand while honoring all work plan rules and constraints.</Paragraph>
        <SubHeading>Schedule Generation Process</SubHeading>
        <div className="my-4 p-4 rounded-lg" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
          {[
            { step: '1', text: 'SELECT the management unit and date range (typically 1-5 weeks out)', color: C.blue },
            { step: '2', text: 'CHOOSE the forecast to schedule against (must cover the date range)', color: C.blue },
            { step: '3', text: 'CONFIGURE optimization goal: Service Level, Cost, or Balanced', color: C.purple },
            { step: '4', text: 'RUN the optimizer — it generates agent schedules (can take minutes to hours depending on MU size)', color: C.green },
            { step: '5', text: 'REVIEW the generated schedule — check coverage gaps, overtime, and agent assignments', color: C.yellow },
            { step: '6', text: 'PUBLISH the schedule — makes it visible to agents and activates adherence tracking', color: C.orange },
          ].map((s, i) => (
            <div key={i} className="flex items-start gap-3 mb-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0" style={{ backgroundColor: s.color + '22', color: s.color, fontFamily: MONO }}>{s.step}</div>
              <div className="text-xs" style={{ color: C.t2, fontFamily: SANS }}>{s.text}</div>
            </div>
          ))}
        </div>
        <SubHeading>Optimization Goals</SubHeading>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
          {SCHEDULING_GOALS.map((g, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
              <div className="font-bold text-sm mb-2" style={{ color: C.t1, fontFamily: MONO }}>{g.goal}</div>
              <div className="text-xs mb-3" style={{ color: C.t2, fontFamily: SANS }}>{g.desc}</div>
              <div className="text-xs p-2 rounded" style={{ backgroundColor: C.bg3, color: C.yellow }}>Tradeoff: {g.tradeoff}</div>
            </div>
          ))}
        </div>
        <SubHeading>Manual Adjustments After Generation</SubHeading>
        <Paragraph>After the optimizer generates schedules, WFM analysts can make manual adjustments: swap agent shifts, move breaks, add overtime, or remove agents from specific days. The system recalculates coverage impact in real time as changes are made. Always re-check the schedule summary after manual edits to ensure service level coverage is still adequate.</Paragraph>
        <SubHeading>Handling Time-Off in Scheduling</SubHeading>
        <Paragraph>Approved time-off requests are automatically excluded from schedule generation — agents with approved PTO on a given day will not be scheduled. Pending requests can optionally be included or excluded. The optimizer accounts for the reduced headcount when calculating coverage.</Paragraph>
      </section>

      {/* T2S5 */}
      <section ref={el => sectionRefs.current['t2s5'] = el} id="t2s5">
        <SectionHeading>Intraday Management</SectionHeading>
        <Paragraph>No forecast is perfect. Intraday management is the art and science of adapting to reality as it unfolds. The intraday view in Genesys Cloud WFM shows you — in near real-time — how actual volumes, handle times, and staffing compare to what was forecasted and scheduled.</Paragraph>
        <SubHeading>The Intraday Dashboard</SubHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          {[
            { label: 'Forecasted vs. Actual Volume', desc: 'Side-by-side comparison of predicted and actual interactions per interval. The gap tells you if you are over or under-staffed.', icon: TrendingUp, color: C.blue },
            { label: 'Forecasted vs. Actual AHT', desc: 'If AHT is running higher than forecasted, you need more agents even if volume is on target.', icon: Timer, color: C.purple },
            { label: 'Scheduled vs. Required Staff', desc: 'The coverage line — shows intervals where you have too many or too few agents scheduled.', icon: Users, color: C.green },
            { label: 'Service Level Tracking', desc: 'Real-time SL compared to target. Dipping below target triggers investigation.', icon: Target, color: C.orange },
          ].map((item, i) => (
            <div key={i} className="rounded-lg p-4 flex items-start gap-3" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
              <item.icon size={18} style={{ color: item.color, flexShrink: 0 }} />
              <div>
                <div className="font-semibold text-xs mb-1" style={{ color: C.t1, fontFamily: MONO }}>{item.label}</div>
                <div className="text-xs" style={{ color: C.t2, fontFamily: SANS }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <SubHeading>Intraday Actions</SubHeading>
        <div className="space-y-2 my-3">
          {[
            ['Voluntary Time Off (VTO)', 'When overstaffed, offer agents the option to go home early. Saves payroll without forcing anyone.', C.green],
            ['Overtime Offers', 'When understaffed, offer overtime to off-shift agents. Can be targeted by skill.', C.red],
            ['Skill Reassignment', 'Temporarily move agents between queues/planning groups to balance coverage.', C.blue],
            ['Intraday Re-Forecast', 'Update the forecast for the remainder of the day based on actual trends so far.', C.purple],
            ['Schedule Adjustments', 'Move breaks, extend shifts, or add/remove scheduled activities in real time.', C.yellow],
          ].map(([title, desc, color], i) => (
            <div key={i} className="rounded-lg p-3 flex items-start gap-3" style={{ backgroundColor: C.bg2, borderLeft: `3px solid ${color}` }}>
              <div>
                <div className="font-semibold text-xs mb-1" style={{ color: C.t1, fontFamily: MONO }}>{title}</div>
                <div className="text-xs" style={{ color: C.t2, fontFamily: SANS }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
        <CalloutBox type="tip">The best WFM teams check the intraday dashboard every 30 minutes during peak hours. Early detection of a volume spike — even 30 minutes before it hits hard — gives you time to react (overtime callout, skill reassignment) rather than simply watching service level crater.</CalloutBox>
      </section>

      {/* T2S6 */}
      <section ref={el => sectionRefs.current['t2s6'] = el} id="t2s6">
        <SectionHeading>Adherence Monitoring</SectionHeading>
        <Paragraph>Adherence measures whether agents are doing what their schedule says they should be doing, at the exact time they should be doing it. An agent scheduled for "On Queue" at 10:00 AM who is still in "After Call Work" at 10:05 is out of adherence. Adherence is the bridge between your carefully optimized schedule and what actually happens on the floor.</Paragraph>
        <SubHeading>Adherence States</SubHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          {ADHERENCE_STATES.map((a, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, borderLeft: `4px solid ${a.color}` }}>
              <div className="font-semibold text-sm mb-1" style={{ color: a.color, fontFamily: MONO }}>{a.state}</div>
              <div className="text-xs" style={{ color: C.t2, fontFamily: SANS }}>{a.desc}</div>
            </div>
          ))}
        </div>
        <SubHeading>Real-Time Adherence (RTA)</SubHeading>
        <Paragraph>The RTA dashboard shows every agent in the management unit with their current scheduled activity, actual status, duration of the current state, and whether they are in or out of adherence. Color-coded rows make it easy to spot issues: green for in adherence, red for out, yellow for unscheduled.</Paragraph>
        <SubHeading>Historical Adherence</SubHeading>
        <Paragraph>Historical adherence reports show adherence percentage over time — per agent, per team, or per management unit. Use it to identify patterns: Is Agent X consistently late returning from lunch? Does Team B have lower adherence on Fridays? Historical data is retained for 13 months in Genesys Cloud.</Paragraph>
        <SubHeading>Exception Management</SubHeading>
        <Paragraph>Supervisors can add exceptions to excuse out-of-adherence time. Example: an agent was 10 minutes late because a supervisor pulled them into an emergency meeting. Adding an exception marks that time as excused and adjusts the adherence calculation. Exceptions can be added retroactively up to the adherence data retention period.</Paragraph>
        <CalloutBox type="info">Adherence targets should be realistic. Most organizations target 90-95% adherence. Demanding 100% adherence is counterproductive — agents will rush breaks and resent the rigidity, leading to higher attrition.</CalloutBox>
      </section>

      {/* T2S7 */}
      <section ref={el => sectionRefs.current['t2s7'] = el} id="t2s7">
        <SectionHeading>Time-Off Management</SectionHeading>
        <Paragraph>Time-off management in Genesys Cloud WFM allows agents to submit time-off requests through the agent interface, and the system can automatically approve or deny them based on configured rules. This replaces manual spreadsheet-based vacation tracking.</Paragraph>
        <div className="space-y-3 my-4">
          {PTO_RULES.map((r, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
              <div className="font-semibold text-sm mb-2" style={{ color: C.t1, fontFamily: MONO }}>{r.feature}</div>
              <div className="text-sm" style={{ color: C.t2, fontFamily: SANS }}>{r.desc}</div>
            </div>
          ))}
        </div>
        <SubHeading>Time-Off Request Flow</SubHeading>
        <div className="my-4 p-4 rounded-lg" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
          {[
            { text: 'Agent submits request (date, activity code, hours)', color: C.blue },
            { text: 'System checks: Is the daily time-off limit reached?', color: C.yellow },
            { text: 'Under limit → AUTO-APPROVED (if auto-approval enabled)', color: C.green },
            { text: 'At limit → WAITLISTED (if waitlisting enabled) or PENDING manual review', color: C.orange },
            { text: 'Over limit → DENIED automatically', color: C.red },
            { text: 'Approved requests excluded from next schedule generation', color: C.purple },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
              <ArrowRight size={12} style={{ color: s.color, flexShrink: 0 }} />
              <div className="text-xs" style={{ color: C.t2, fontFamily: SANS }}>{s.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* T2S8 */}
      <section ref={el => sectionRefs.current['t2s8'] = el} id="t2s8">
        <SectionHeading>Reporting & Analytics</SectionHeading>
        <Paragraph>WFM reporting closes the loop — it tells you how well your forecasting, scheduling, and intraday management are performing so you can continuously improve.</Paragraph>
        <SubHeading>Key Performance Indicators</SubHeading>
        <InteractiveTable
          headers={['Report Area', 'Key Metric', 'Healthy', 'Warning', 'Critical']}
          rows={REPORTING_METRICS.map(r => [r.report, r.metric, r.healthy, r.warning, r.critical])}
        />
        <SubHeading>Schedule Effectiveness Report</SubHeading>
        <Paragraph>Shows how well the generated schedule matched the forecasted staffing requirement across every interval. Highlights periods of overstaffing (wasted cost) and understaffing (SLA risk). The "efficiency score" is the weighted average of how closely scheduled FTEs matched required FTEs across all intervals.</Paragraph>
        <SubHeading>Forecast Accuracy Report</SubHeading>
        <Paragraph>Compares forecasted volume and AHT to actuals for each planning group. Measured using weighted Mean Absolute Percentage Error (wMAPE). A wMAPE under 10% is considered excellent; 10-15% is acceptable; over 20% requires investigation (missing data, untagged special days, or changed business patterns).</Paragraph>
        <SubHeading>Agent Scorecard</SubHeading>
        <Paragraph>Per-agent view of: adherence percentage, conformance percentage, time on queue, average handle time, schedule exceptions, and time-off usage. Used for coaching conversations and identifying agents who may need schedule adjustments or additional training.</Paragraph>
        <CalloutBox type="tip">Set up a weekly WFM review cadence: Monday morning, review last week's forecast accuracy, adherence, and service level. Identify root causes for any misses. Adjust this week's forecast if needed. This 30-minute ritual is the highest-ROI activity in WFM operations.</CalloutBox>
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
      <SectionHeading>Forecasting Algorithms Deep Dive</SectionHeading>
      <Paragraph>Under the hood, Genesys Cloud WFM's "Automatic Best Fit" method evaluates multiple forecasting algorithms against your historical data and selects the one with the lowest error. Understanding these components helps you diagnose forecast issues and know when to intervene.</Paragraph>
      <SubHeading>Algorithm Components</SubHeading>
      <div className="space-y-3 my-4">
        {ALGORITHM_COMPONENTS.map((a, i) => (
          <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, borderLeft: `4px solid ${C.purple}` }}>
            <div className="font-bold text-sm mb-2" style={{ color: C.t1, fontFamily: MONO }}>{a.name}</div>
            <div className="text-xs mb-2" style={{ color: C.t2, fontFamily: SANS }}>{a.desc}</div>
            <div className="text-xs p-2 rounded" style={{ backgroundColor: C.bg3, color: C.green, fontFamily: MONO }}>Example: {a.example}</div>
          </div>
        ))}
      </div>
      <SubHeading>How Automatic Best Fit Works</SubHeading>
      <div className="my-4 p-4 rounded-lg space-y-3" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
        <div className="font-bold text-xs mb-2" style={{ color: C.purple, fontFamily: MONO }}>ALGORITHM SELECTION PROCESS:</div>
        {[
          '1. Collect historical interval data (volume + AHT) for the planning group',
          '2. Split data into training set (older) and validation set (recent)',
          '3. Run each candidate algorithm against the training set',
          '4. Score each algorithm\'s prediction against the validation set using wMAPE',
          '5. Select the algorithm with the lowest wMAPE score',
          '6. Apply the winning algorithm to generate the forecast',
          '7. Add trend adjustment and seasonality overlay',
          '8. Present the forecast to the WFM analyst for review',
        ].map((step, i) => <div key={i} className="text-xs" style={{ color: C.t2, fontFamily: MONO }}>{step}</div>)}
      </div>
      <SubHeading>Special Day Configuration</SubHeading>
      <Paragraph>Special days are dates that deviate significantly from normal patterns. Without tagging them, they corrupt the historical baseline. Genesys Cloud supports two approaches: (1) Exclude the day — the algorithm ignores it entirely when building the model, or (2) Create a "special day group" — the system learns the unique pattern for that type of day (e.g., "Post-Holiday Monday" or "Quarterly Billing Day") and applies it when that day recurs.</Paragraph>
      <CodeBlock>{`Special Day Configuration Example:

  Group: "Federal Holidays"
    - New Year's Day
    - Memorial Day
    - Independence Day
    - Labor Day
    - Thanksgiving
    - Christmas Day

  Group: "Marketing Events"
    - Spring Sale (March 15-17)
    - Summer Blowout (July 1-3)
    - Black Friday (Nov 29)

  Treatment: Use historical data from same special day type
  Fallback: If insufficient history, use 150% of normal day forecast`}</CodeBlock>
      <CalloutBox type="critical">Untagged special days are the single most common cause of forecast inaccuracy. A single Black Friday in your training data — untreated — can inflate your average Friday forecast by 10-15% for the entire following quarter. Always tag anomalous days BEFORE generating forecasts.</CalloutBox>
    </section>

    {/* T3S2 */}
    <section ref={el => sectionRefs.current['t3s2'] = el} id="t3s2">
      <SectionHeading>Schedule Optimization Engine</SectionHeading>
      <Paragraph>The schedule optimizer is a constraint-satisfaction solver that builds agent schedules matching supply to demand. Understanding how it works helps you design better work plans, diagnose generation failures, and set realistic expectations for optimization results.</Paragraph>
      <SubHeading>Core Concepts</SubHeading>
      <div className="space-y-3 my-4">
        {OPTIMIZER_CONCEPTS.map((o, i) => (
          <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, borderLeft: `4px solid ${o.color}` }}>
            <div className="font-bold text-sm mb-2" style={{ color: o.color, fontFamily: MONO }}>{o.concept}</div>
            <div className="text-xs" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.7 }}>{o.desc}</div>
          </div>
        ))}
      </div>
      <SubHeading>Optimization Process Flow</SubHeading>
      <div className="my-4 p-4 rounded-lg" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
        {[
          { indent: 0, text: 'PHASE 1: FEASIBILITY CHECK', color: C.red },
          { indent: 1, text: 'Can ALL hard constraints be satisfied simultaneously?', color: C.t3 },
          { indent: 1, text: 'If NO → Report infeasibility with conflicting constraints', color: C.red },
          { indent: 1, text: 'If YES → Proceed to optimization', color: C.green },
          { indent: 0, text: 'PHASE 2: INITIAL SOLUTION', color: C.blue },
          { indent: 1, text: 'Build a naive valid schedule (assigns shifts greedily)', color: C.t3 },
          { indent: 1, text: 'Score against objective function (initial score is typically low)', color: C.t3 },
          { indent: 0, text: 'PHASE 3: ITERATIVE IMPROVEMENT', color: C.green },
          { indent: 1, text: 'Swap shift start times, reassign days off, move breaks', color: C.t3 },
          { indent: 1, text: 'Evaluate each change: Does the score improve?', color: C.t3 },
          { indent: 1, text: 'Keep improvements, discard regressions', color: C.t3 },
          { indent: 1, text: 'Repeat until time limit reached or no improvement found', color: C.t3 },
          { indent: 0, text: 'PHASE 4: OUTPUT', color: C.purple },
          { indent: 1, text: 'Return the highest-scoring schedule found', color: C.t3 },
          { indent: 1, text: 'Generate schedule summary with coverage analysis', color: C.t3 },
        ].map((line, i) => (
          <div key={i} className="text-xs" style={{ paddingLeft: line.indent * 20, color: line.color, fontFamily: MONO, marginBottom: 3 }}>{line.text}</div>
        ))}
      </div>
      <CalloutBox type="warning">The optimizer has a time limit. For large management units (500+ agents), it may not find the globally optimal solution within the time window. If schedule quality is unsatisfactory, try: (1) breaking the MU into smaller groups, (2) relaxing constraints, or (3) running the optimizer multiple times and comparing results.</CalloutBox>
    </section>

    {/* T3S3 */}
    <section ref={el => sectionRefs.current['t3s3'] = el} id="t3s3">
      <SectionHeading>Multi-Channel WFM</SectionHeading>
      <Paragraph>Modern contact centers handle voice, chat, email, and messaging. Each channel has fundamentally different staffing characteristics — especially around concurrency (how many interactions one agent can handle simultaneously). Getting multi-channel WFM right requires understanding these differences.</Paragraph>
      <SubHeading>Channel Characteristics</SubHeading>
      <InteractiveTable
        headers={['Channel', 'Concurrency', 'Forecasting Model', 'Scheduling Impact']}
        rows={MULTICHANNEL_CONFIG.map(c => [c.channel, c.concurrency, c.forecasting, c.scheduling])}
      />
      <SubHeading>Concurrency Settings — The Critical Factor</SubHeading>
      <Paragraph>For chat and messaging, the concurrency setting dramatically affects staffing calculations. If agents handle 3 chats simultaneously, you need roughly 1/3 the agents compared to single-session handling. But concurrency also increases AHT per interaction (because the agent is splitting attention) and reduces quality if set too high.</Paragraph>
      <div className="my-4 p-4 rounded-lg" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
        <div className="font-bold text-xs mb-3" style={{ color: C.blue, fontFamily: MONO }}>CONCURRENCY IMPACT EXAMPLE:</div>
        <div className="space-y-2">
          {[
            { setting: 'Concurrency = 1', agents: '30 agents needed', aht: '5 min AHT', quality: 'Highest quality, highest cost' },
            { setting: 'Concurrency = 3', agents: '12 agents needed', aht: '7 min AHT (split attention)', quality: 'Good balance of cost and quality' },
            { setting: 'Concurrency = 6', agents: '8 agents needed', aht: '10 min AHT', quality: 'Lowest cost, risk of quality degradation' },
          ].map((ex, i) => (
            <div key={i} className="grid grid-cols-4 gap-2 text-xs p-2 rounded" style={{ backgroundColor: C.bg3 }}>
              <span style={{ color: C.t1, fontFamily: MONO }}>{ex.setting}</span>
              <span style={{ color: C.green }}>{ex.agents}</span>
              <span style={{ color: C.yellow }}>{ex.aht}</span>
              <span style={{ color: C.t2 }}>{ex.quality}</span>
            </div>
          ))}
        </div>
      </div>
      <SubHeading>Blended Agent Scheduling</SubHeading>
      <Paragraph>Agents skilled in multiple channels can be scheduled as "blended" — handling voice during peak phone hours and chat/email during low-volume periods. Genesys Cloud WFM supports blended scheduling by assigning agents to multiple planning groups with different channel types. The optimizer considers the agent's skills and each planning group's demand when placing them.</Paragraph>
      <CalloutBox type="info">A common best practice: use email as a "backfill" activity. During voice peak hours, all agents are on phone. When phone volume drops, some agents automatically shift to working the email backlog. This maximizes utilization without sacrificing voice service level.</CalloutBox>
    </section>

    {/* T3S4 */}
    <section ref={el => sectionRefs.current['t3s4'] = el} id="t3s4">
      <SectionHeading>API & Integration Architecture</SectionHeading>
      <Paragraph>The Genesys Cloud WFM API provides complete programmatic access to forecasting, scheduling, adherence, and time-off management. This enables integration with HRIS systems, payroll platforms, custom dashboards, and third-party WFM tools.</Paragraph>
      <SubHeading>Key API Endpoints</SubHeading>
      <InteractiveTable searchable headers={['Method', 'Endpoint', 'Use']} rows={API_ENDPOINTS.map(e => [e.method, e.path, e.use])} />
      <SubHeading>Integration Options</SubHeading>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
        {INTEGRATION_OPTIONS.map((c, i) => (
          <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
            <div className="font-bold text-sm mb-2" style={{ color: C.t1, fontFamily: MONO }}>{c.name}</div>
            <div className="text-xs" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.6 }}>{c.desc}</div>
          </div>
        ))}
      </div>
      <SubHeading>Example: Automated Schedule Export to Payroll</SubHeading>
      <CodeBlock>{`// Pseudocode: Weekly payroll export via WFM API

// 1. Get all agents in the management unit
const agents = await GET /api/v2/workforcemanagement/
  managementunits/{muId}/agents

// 2. Get schedules for the pay period
const schedules = await POST /api/v2/workforcemanagement/
  managementunits/{muId}/agents/schedules
  { startDate: "2025-01-06", endDate: "2025-01-12" }

// 3. For each agent, calculate:
//    - Total scheduled hours
//    - Overtime hours (> 40/week)
//    - Time-off hours by type (vacation, sick, personal)
//    - Activity breakdown (on-queue, training, meeting)

// 4. Map WFM activity codes to payroll codes:
//    ON_QUEUE     -> REG_HOURS
//    BREAK        -> REG_HOURS (paid break)
//    LUNCH        -> UNPAID
//    TRAINING     -> TRAINING_HOURS
//    OVERTIME     -> OT_HOURS

// 5. POST to payroll system via data action`}</CodeBlock>
      <CalloutBox type="info">
        <strong>Notification API:</strong> Subscribe to <code style={{ fontFamily: MONO }}>v2.workforcemanagement.managementunits.{'{'} muId {'}'}</code> topics for real-time events: schedule published, adherence alerts, time-off status changes, and forecast generation completion. Use WebSocket for low-latency integrations.
      </CalloutBox>
    </section>

    {/* T3S5 */}
    <section ref={el => sectionRefs.current['t3s5'] = el} id="t3s5">
      <SectionHeading>Advanced Intraday Strategies</SectionHeading>
      <Paragraph>Beyond manual intraday adjustments, advanced WFM operations use automated rules, real-time routing integration, and dynamic scheduling to respond to demand fluctuations with minimal human intervention.</Paragraph>
      <div className="space-y-4 my-4">
        {INTRADAY_STRATEGIES.map((s, i) => (
          <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
            <div className="font-bold text-sm mb-2" style={{ color: C.t1, fontFamily: MONO }}>{s.strategy}</div>
            <div className="text-xs mb-3" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.7 }}>{s.desc}</div>
            <div className="text-xs p-2 rounded" style={{ backgroundColor: C.bg3, color: C.green, fontFamily: MONO }}>Impact: {s.impact}</div>
          </div>
        ))}
      </div>
      <SubHeading>Automated Intraday Rule Framework</SubHeading>
      <div className="my-4 p-4 rounded-lg" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
        <div className="font-bold text-xs mb-3" style={{ color: C.purple, fontFamily: MONO }}>EXAMPLE RULE SET:</div>
        {[
          { condition: 'IF actual volume > 120% of forecast for 2+ consecutive intervals', action: 'THEN send overtime offers to top-skilled off-shift agents', color: C.red },
          { condition: 'IF actual volume < 80% of forecast for 3+ consecutive intervals', action: 'THEN send VTO offers to lowest-seniority on-shift agents', color: C.green },
          { condition: 'IF Planning Group A understaffed AND Planning Group B overstaffed', action: 'THEN reassign up to 5 multi-skilled agents from B to A', color: C.blue },
          { condition: 'IF service level drops below 70% for any 30-min window', action: 'THEN escalate alert to WFM manager + activate overflow routing', color: C.orange },
        ].map((rule, i) => (
          <div key={i} className="mb-3 p-2 rounded" style={{ backgroundColor: C.bg3 }}>
            <div className="text-xs mb-1" style={{ color: C.yellow, fontFamily: MONO }}>{rule.condition}</div>
            <div className="text-xs" style={{ color: rule.color, fontFamily: MONO }}>{rule.action}</div>
          </div>
        ))}
      </div>
      <CalloutBox type="warning">Automated intraday rules should always have safety limits — max VTO hours per day, max overtime hours, minimum staffing floor. Without guardrails, automated rules can overcorrect and create worse problems than they solve.</CalloutBox>
    </section>

    {/* T3S6 */}
    <section ref={el => sectionRefs.current['t3s6'] = el} id="t3s6">
      <SectionHeading>Platform Limits — The Complete Reference</SectionHeading>
      <Paragraph>Understanding platform limits is essential for capacity planning and architecture decisions. These are current as of the latest Genesys Cloud release.</Paragraph>
      <InteractiveTable searchable headers={['Resource', 'Limit', 'Notes']} rows={PLATFORM_LIMITS} />
      <CalloutBox type="info">Some limits can be increased by contacting Genesys Cloud support (e.g., Business Units per org, agents per MU). Always verify current limits in the Genesys Cloud Resource Center, as they are updated periodically.</CalloutBox>
    </section>

    {/* T3S7 */}
    <section ref={el => sectionRefs.current['t3s7'] = el} id="t3s7">
      <SectionHeading>Licensing & Feature Matrix</SectionHeading>
      <Paragraph>WFM features are primarily available in Genesys Cloud 3 (GC3) or as an add-on to Genesys Cloud 2 (GC2) via the Workforce Engagement Management (WEM) add-on. Genesys Cloud 1 (GC1) does not include WFM capabilities.</Paragraph>
      <InteractiveTable headers={['Feature', 'GC1', 'GC2', 'GC3']} rows={LICENSE_MATRIX} />
      <CalloutBox type="info">The GC2 + WEM Add-on provides the same WFM functionality as GC3. The difference is licensing model — GC3 bundles it, GC2 requires the add-on purchase. GC1 organizations must upgrade to access WFM.</CalloutBox>
    </section>

    {/* T3S8 */}
    <section ref={el => sectionRefs.current['t3s8'] = el} id="t3s8">
      <SectionHeading>Troubleshooting Decision Tree</SectionHeading>
      <Paragraph>Click each symptom to reveal the investigation path. These cover the most common WFM issues encountered in production environments.</Paragraph>
      <div className="space-y-3 my-4">
        {TROUBLESHOOTING.map((t, i) => (
          <ExpandableCard key={i} title={t.symptom} accent={C.purple}>
            <div className="text-sm" style={{ lineHeight: 1.7 }}>{t.investigation}</div>
          </ExpandableCard>
        ))}
      </div>
      <SubHeading>Common Configuration Errors</SubHeading>
      <div className="space-y-2 my-4">
        {[
          { error: 'Queues not mapped to planning groups', effect: 'Interactions from unmapped queues are not included in the forecast — resulting in systematic under-forecasting and understaffing.', fix: 'Audit all active queues and ensure each is assigned to a planning group.' },
          { error: 'Wrong timezone on Management Unit', effect: 'Schedules display at the wrong time for agents. A schedule showing 9 AM actually means 9 AM in the MU timezone, which may not match the agent\'s local time.', fix: 'Set MU timezone to match the majority of agents in that MU. Use multiple MUs for multi-timezone teams.' },
          { error: 'Activity code category mismatch', effect: 'If "Training" is categorized as "On Queue," the system thinks the agent is available for interactions during training. Adherence calculations will also be wrong.', fix: 'Review all activity codes and ensure categories match actual behavior. On Queue = handling interactions. Break/Meal = off-phone paid/unpaid.' },
          { error: 'Insufficient historical data', effect: 'Forecast accuracy degrades significantly with less than 4 weeks of data. Seasonal patterns cannot be detected with less than one full cycle of data.', fix: 'Import historical data from previous systems. If unavailable, use manual forecast entries for the first 4-6 weeks while data accumulates.' },
        ].map((item, i) => (
          <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
            <div className="font-semibold text-xs mb-1" style={{ color: C.red, fontFamily: MONO }}>Error: {item.error}</div>
            <div className="text-xs mb-1" style={{ color: C.yellow }}>Effect: {item.effect}</div>
            <div className="text-xs" style={{ color: C.green }}>Fix: {item.fix}</div>
          </div>
        ))}
      </div>
    </section>
  </div>
);

// ══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════
const GenesysWFMGuide = ({ onBack, isDark: isDarkProp, setIsDark: setIsDarkProp }) => {
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
            <span className="font-bold text-sm hidden sm:block" style={{ fontFamily: MONO, color: C.orange }}>GENESYS WFM GUIDE</span>
            <span className="font-bold text-sm sm:hidden" style={{ fontFamily: MONO, color: C.orange }}>GC WFM</span>
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
        <div className="text-xs" style={{ color: C.t3, fontFamily: MONO }}>Genesys Cloud Workforce Management — Interactive Knowledge Guide</div>
        <div className="text-[10px] mt-1" style={{ color: C.bg4 }}>Built with React • Tailwind CSS • lucide-react</div>
      </footer>
    </div>
  );
};

export default GenesysWFMGuide;
