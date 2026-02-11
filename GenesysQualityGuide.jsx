import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Rocket, Settings, Cpu, Search, ChevronDown, ChevronUp, ChevronRight,
  Menu, X, Phone, Mail, MessageSquare, Bell, RefreshCw, CheckCircle,
  AlertTriangle, AlertCircle, Info, Lightbulb, Star, ExternalLink,
  BookOpen, ArrowRight, ArrowDown, ArrowLeft, Circle, Zap, Shield, Clock, Users,
  FileText, Database, Activity, BarChart3, Target, Monitor,
  Hash, Layers, Eye, ClipboardList, Volume2, Sun, Moon, Calendar, Timer,
  TrendingUp, Award, Lock, Filter, Headphones, UserCheck, Mic
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
  'The Big Picture — What Is Quality Management and Why Does It Matter?',
  'How It All Fits Together — Building and Running a Quality Program',
  'Under the Hood — AI Analytics, APIs, Compliance, and Edge Cases',
];
const TIER_AUDIENCES = [
  'For everyone — no experience needed',
  'For administrators & quality analysts',
  'For engineers, architects & power users',
];
const TIER_ICONS_KEYS = ['Rocket', 'Settings', 'Cpu'];

// ══════════════════════════════════════════════════════════════
// SECTION METADATA (all tiers)
// ══════════════════════════════════════════════════════════════
const SECTIONS = [
  { tier: 0, id: 't1s1', title: 'What Is Quality Management?' },
  { tier: 0, id: 't1s2', title: 'The Quality Lifecycle' },
  { tier: 0, id: 't1s3', title: 'The Building Blocks of Quality' },
  { tier: 0, id: 't1s4', title: 'Types of Quality Programs' },
  { tier: 0, id: 't1s5', title: 'Key Terminology Glossary' },
  { tier: 1, id: 't2s1', title: 'Prerequisites — What You Need Before Starting' },
  { tier: 1, id: 't2s2', title: 'Evaluation Forms — Design & Best Practices' },
  { tier: 1, id: 't2s3', title: 'Quality Policies — Automating Evaluation Assignment' },
  { tier: 1, id: 't2s4', title: 'Performing Evaluations' },
  { tier: 1, id: 't2s5', title: 'Calibration — Ensuring Consistency' },
  { tier: 1, id: 't2s6', title: 'Coaching & Agent Development' },
  { tier: 1, id: 't2s7', title: 'Recording Policies' },
  { tier: 1, id: 't2s8', title: 'Quality Dashboards & Reporting' },
  { tier: 2, id: 't3s1', title: 'Speech & Text Analytics' },
  { tier: 2, id: 't3s2', title: 'AI-Powered Quality' },
  { tier: 2, id: 't3s3', title: 'Advanced Evaluation Design' },
  { tier: 2, id: 't3s4', title: 'API & Integration Architecture' },
  { tier: 2, id: 't3s5', title: 'Compliance & Legal Considerations' },
  { tier: 2, id: 't3s6', title: 'Platform Limits — The Complete Reference' },
  { tier: 2, id: 't3s7', title: 'Licensing & Feature Matrix' },
  { tier: 2, id: 't3s8', title: 'Troubleshooting Decision Tree' },
];

// ══════════════════════════════════════════════════════════════
// T1 DATA
// ══════════════════════════════════════════════════════════════
const QM_PURPOSES = [
  { icon: 'Shield', label: 'Compliance', desc: 'Ensure agents follow regulatory scripts and legal disclosures' },
  { icon: 'Target', label: 'Consistency', desc: 'Deliver a uniform customer experience across all agents' },
  { icon: 'TrendingUp', label: 'Improvement', desc: 'Identify skill gaps and coach agents to improve performance' },
  { icon: 'Award', label: 'Recognition', desc: 'Identify top performers and reward excellence' },
  { icon: 'BarChart3', label: 'Analytics', desc: 'Track quality trends across teams, queues, and time periods' },
  { icon: 'Users', label: 'Customer Satisfaction', desc: 'Drive higher CSAT and NPS through better interactions' },
];

const LIFECYCLE_STEPS = [
  { step: 1, title: 'RECORD INTERACTIONS', desc: 'All voice, chat, email, and message interactions are captured via recording policies. Voice recordings include audio and optional screen capture.', color: C.green, icon: 'Mic' },
  { step: 2, title: 'SELECT FOR EVALUATION', desc: 'Quality policies automatically select a sample of interactions and assign them to evaluators. Selection can be random, targeted by queue/agent/wrap-up, or manual.', color: C.blue, icon: 'Filter' },
  { step: 3, title: 'EVALUATE AGAINST FORM', desc: 'Evaluators listen to recordings, review transcripts, and score each interaction against a structured evaluation form with weighted questions and scoring criteria.', color: C.orange, icon: 'ClipboardList' },
  { step: 4, title: 'SCORE & CALIBRATE', desc: 'Scores are calculated automatically based on question weights. Calibration sessions ensure multiple evaluators score the same interaction consistently.', color: C.yellow, icon: 'BarChart3' },
  { step: 5, title: 'COACH THE AGENT', desc: 'Coaching sessions are created linking specific evaluations. Supervisors review results with agents, set improvement goals, and schedule follow-ups.', color: C.purple, icon: 'Users' },
  { step: 6, title: 'TRACK IMPROVEMENT', desc: 'Dashboards show agent score trends over time. Compare scores before and after coaching. Identify persistent gaps and repeat the cycle.', color: C.green, icon: 'TrendingUp' },
];

const BUILDING_BLOCKS = [
  { id: 'evalForm', label: 'EVALUATION FORMS', sub: 'The scoring rubric', x: 400, y: 60, explanation: 'Structured questionnaires used to score interactions — containing question groups, weighted questions, and scoring criteria', analogy: 'The exam paper' },
  { id: 'qualPolicy', label: 'QUALITY POLICIES', sub: 'Auto-assignment', x: 130, y: 150, explanation: 'Automated rules that select interactions and assign them to evaluators based on criteria like queue, agent, or time period', analogy: 'The assignment scheduler' },
  { id: 'calibration', label: 'CALIBRATION', sub: 'Evaluator alignment', x: 670, y: 150, explanation: 'Sessions where multiple evaluators score the same interaction to measure and improve inter-rater reliability', analogy: 'Judges comparing scorecards' },
  { id: 'coaching', label: 'COACHING', sub: 'Agent development', x: 80, y: 310, explanation: 'Structured sessions where supervisors review evaluations with agents, discuss performance, and set improvement goals', analogy: 'The 1-on-1 performance review' },
  { id: 'recording', label: 'RECORDING', sub: 'Interaction capture', x: 720, y: 310, explanation: 'Policies that control which interactions are recorded (voice, screen, digital), how long recordings are retained, and who can access them', analogy: 'The security camera system' },
  { id: 'analytics', label: 'SPEECH & TEXT\nANALYTICS', sub: 'AI-powered insights', x: 400, y: 440, explanation: 'AI engine that transcribes recordings, detects sentiment, identifies topics, and spots compliance issues automatically across all interactions', analogy: 'The AI assistant that listens to everything' },
];
const BLOCK_CENTER = { x: 400, y: 250 };

const QUALITY_PROGRAM_TYPES = [
  {
    name: 'Random Sampling', method: 'Policy auto-selects random interactions per agent/queue/time window',
    pros: ['Unbiased sample', 'Easy to set up', 'Scales well'],
    cons: ['May miss critical interactions', 'Sample may not represent reality if volume is uneven'],
  },
  {
    name: 'Targeted Evaluation', method: 'Policy targets interactions by queue, wrap-up code, duration, or agent group',
    pros: ['Focuses on high-risk areas', 'Efficient use of evaluator time', 'Catches compliance-critical interactions'],
    cons: ['Bias toward problem areas', 'May overlook good performance', 'Requires careful filter design'],
  },
  {
    name: 'AI-Automated Evaluation', method: 'Speech & text analytics auto-score interactions using AI models',
    pros: ['100% coverage possible', 'Instant scoring', 'Consistent (no human bias)'],
    cons: ['Requires WEM add-on license', 'AI models need tuning', 'Cannot assess nuance like empathy perfectly'],
  },
  {
    name: 'Calibration Sessions', method: 'Multiple evaluators independently score the same interaction, then compare results',
    pros: ['Improves consistency', 'Identifies evaluator bias', 'Builds shared understanding'],
    cons: ['Time-intensive', 'Requires coordination', 'Can surface uncomfortable disagreements'],
  },
  {
    name: 'Peer Review', method: 'Agents evaluate each other\'s interactions (with appropriate permissions)',
    pros: ['Builds empathy', 'Develops quality mindset', 'Cost-effective'],
    cons: ['Potential bias (friends/rivals)', 'Agents may lack evaluation skills', 'Needs supervisor oversight'],
  },
  {
    name: 'Self-Evaluation', method: 'Agents evaluate their own interactions before receiving supervisor evaluation',
    pros: ['Builds self-awareness', 'Encourages reflection', 'Rich coaching conversations when compared with supervisor score'],
    cons: ['Agents may overrate themselves', 'Time cost for agents', 'Needs cultural support'],
  },
];

const GLOSSARY = [
  { term: 'Evaluation Form', def: 'A structured questionnaire used to score agent interactions, containing question groups, individual questions with weights, and scoring criteria', tier: 'Tier 2' },
  { term: 'Quality Policy', def: 'An automated rule that selects interactions for evaluation and assigns them to evaluators based on configurable criteria', tier: 'Tier 2' },
  { term: 'Calibration', def: 'The process of having multiple evaluators score the same interaction to measure and improve scoring consistency', tier: 'Tier 2' },
  { term: 'Coaching Session', def: 'A structured meeting between a supervisor and agent to review evaluation results and set improvement goals', tier: 'Tier 2' },
  { term: 'Critical Question', def: 'A question on an evaluation form that, if failed, automatically sets the entire evaluation score to zero', tier: 'Tier 2' },
  { term: 'Fatal Question', def: 'Similar to critical — a question where failure results in an automatic score of 0% for the entire evaluation regardless of other answers', tier: 'Tier 2' },
  { term: 'Evaluation Score', def: 'The calculated percentage score of an evaluation based on weighted question responses (0–100%)', tier: 'Tier 1' },
  { term: 'Inter-Rater Reliability (IRR)', def: 'A statistical measure of how consistently different evaluators score the same interaction — higher IRR means better calibration', tier: 'Tier 2' },
  { term: 'Root Cause Analysis (RCA)', def: 'The process of identifying the underlying reason for a quality failure, not just the symptom', tier: 'Tier 2' },
  { term: 'First Contact Resolution (FCR)', def: 'The percentage of interactions resolved without requiring a follow-up — a key quality KPI', tier: 'Tier 1' },
  { term: 'CSAT', def: 'Customer Satisfaction score — typically collected via post-interaction surveys on a 1–5 scale', tier: 'Tier 1' },
  { term: 'Screen Recording', def: 'Capture of the agent\'s desktop during an interaction, synchronized with voice recording for full context', tier: 'Tier 2' },
  { term: 'Interaction Recording', def: 'The audio capture of a voice interaction, stored in Genesys Cloud with configurable retention policies', tier: 'Tier 1' },
  { term: 'Speech Analytics', def: 'AI-powered analysis of voice recordings: transcription, sentiment detection, topic identification, and acoustic analysis', tier: 'Tier 3' },
  { term: 'Text Analytics', def: 'AI-powered analysis of digital interactions (chat, email, message): sentiment, topic detection, and keyword spotting', tier: 'Tier 3' },
  { term: 'Sentiment Score', def: 'An AI-generated measure of the emotional tone of an interaction — positive, negative, or neutral, tracked over the conversation timeline', tier: 'Tier 3' },
  { term: 'Topic Detection', def: 'AI identification of conversation subjects (e.g., "billing dispute", "cancellation request") based on trained models', tier: 'Tier 3' },
  { term: 'PCI Compliance', def: 'Payment Card Industry Data Security Standard — requires pausing recording when customers share credit card details', tier: 'Tier 3' },
  { term: 'WEM', def: 'Workforce Engagement Management — the Genesys Cloud suite including Quality Management, Workforce Management, and Performance Management', tier: 'Tier 1' },
];

// ══════════════════════════════════════════════════════════════
// T2 DATA
// ══════════════════════════════════════════════════════════════
const PREREQUISITES = [
  { title: 'Licensing', detail: 'Quality Management requires Genesys Cloud 2 (GC2) or higher for basic evaluation features. Full WEM capabilities (speech analytics, AI scoring, advanced coaching) require GC3 or WEM add-on licenses. Verify your org\'s license tier under Admin > Account Settings > Organization before configuring QM.' },
  { title: 'Permissions', detail: 'Quality evaluators need: Quality > Evaluation > Add/Edit/View. Quality administrators need: Quality > Evaluation Form > Add/Edit/Delete/View, Quality > Policy > Add/Edit/Delete/View, Quality > Calibration > Add/View. Coaching requires: Coaching > Appointment > Add/Edit/View. Recording access requires: Recording > Recording > View/ViewSensitiveData.' },
  { title: 'Recording Policies Enabled', detail: 'Quality evaluations require recordings to exist. At minimum, you need a recording policy that captures interactions for the queues you want to evaluate. Without active recording policies, there are no interactions to score. Verify under Admin > Quality > Recording Policies.' },
  { title: 'Storage Configuration', detail: 'Voice recordings consume storage. Default retention is determined by your org\'s recording retention policy (Admin > Quality > Recording Settings). Consider: average call duration, number of agents, percentage of calls recorded, and required retention period. Exported recordings can be stored in AWS S3 or Azure Blob via bulk export.' },
  { title: 'Evaluation Form(s) Created', detail: 'You need at least one published evaluation form before you can create quality policies or perform evaluations. Start with a simple form (5–10 questions) and iterate based on calibration results. Forms are versioned — publishing a new version does not affect existing evaluations.' },
  { title: 'Evaluator Assignments', detail: 'Identify who will perform evaluations. Evaluators are typically quality analysts, team leads, or supervisors. Each evaluator needs the appropriate permissions and must be assigned to quality policies to receive evaluation assignments.' },
];

const QUESTION_TYPES = [
  { type: 'Yes/No', desc: 'Binary pass/fail — "Did the agent verify the caller\'s identity?"', weight: 'Typically 5–15 points', use: 'Compliance checks, process adherence' },
  { type: 'Range (1–10)', desc: 'Numeric scale — "Rate the agent\'s active listening skills"', weight: 'Typically 10–25 points', use: 'Subjective quality assessment, soft skills' },
  { type: 'Multiple Choice', desc: 'Select one option from a list — "How was the greeting? Excellent/Good/Needs Improvement/Not Done"', weight: 'Varies by option selected', use: 'Standardized rubrics with defined criteria' },
  { type: 'Free Text', desc: 'Open comment field — "Provide specific feedback on the agent\'s tone"', weight: 'No score (comments only)', use: 'Qualitative feedback, coaching notes' },
];

const FORM_BEST_PRACTICES = [
  { good: true, text: 'Limit forms to 15–25 questions — longer forms cause evaluator fatigue and inconsistency' },
  { good: true, text: 'Group questions logically: Opening, Process, Knowledge, Soft Skills, Closing' },
  { good: true, text: 'Use critical/fatal questions sparingly — only for true compliance requirements' },
  { good: true, text: 'Weight soft skills (empathy, tone) at 30–40% and process compliance at 60–70%' },
  { good: true, text: 'Include at least one free-text field for qualitative coaching feedback' },
  { good: true, text: 'Test forms with calibration sessions before deploying org-wide' },
  { good: false, text: 'Don\'t create separate forms for every queue unless scoring criteria truly differ' },
  { good: false, text: 'Don\'t weight all questions equally — this dilutes the impact of critical behaviors' },
  { good: false, text: 'Don\'t use subjective language without clear rubrics ("Was the agent nice?" vs "Did the agent use the customer\'s name at least twice?")' },
];

const POLICY_CONDITIONS = [
  { condition: 'Queue', desc: 'Select interactions from specific queues (e.g., only "Billing Support" and "Technical Support")' },
  { condition: 'Agent', desc: 'Target specific agents or agent groups for evaluation' },
  { condition: 'Wrap-Up Code', desc: 'Filter by call outcome (e.g., only evaluate "Complaint" or "Escalation" interactions)' },
  { condition: 'Duration', desc: 'Filter by interaction length (e.g., only calls longer than 3 minutes)' },
  { condition: 'Direction', desc: 'Inbound only, outbound only, or both' },
  { condition: 'Media Type', desc: 'Voice, chat, email, or message interactions' },
  { condition: 'Date/Time', desc: 'Evaluation window — which days and hours the policy applies' },
];

const EVALUATOR_WORKFLOW = [
  { step: 1, action: 'Navigate to Quality > Evaluations > My Assignments', detail: 'See all pending evaluation assignments with interaction details' },
  { step: 2, action: 'Open the assigned interaction', detail: 'The evaluation form appears alongside the recording player and transcript (if available)' },
  { step: 3, action: 'Play the recording', detail: 'Listen to the full interaction. Use speed controls (0.5x–2.0x), skip silence, and bookmark key moments' },
  { step: 4, action: 'Review the transcript', detail: 'If speech-to-text is enabled, read the synchronized transcript. Click any line to jump to that audio moment' },
  { step: 5, action: 'Score each question', detail: 'Answer each question on the evaluation form. The running score updates in real-time as you complete questions' },
  { step: 6, action: 'Add comments', detail: 'Leave specific feedback in free-text fields and question-level notes. Reference exact timestamps for coaching clarity' },
  { step: 7, action: 'Submit the evaluation', detail: 'Mark as Complete. The agent receives a notification and can view the evaluation in their quality dashboard. Scores flow into reporting.' },
];

const CALIBRATION_STEPS = [
  'Select 2–3 representative interactions (mix of good and problematic)',
  'Assign the same interaction to 3–5 evaluators independently',
  'Each evaluator scores without seeing others\' results',
  'Compare scores — look for variance greater than 10% on any question',
  'Discuss discrepancies — agree on the "correct" interpretation',
  'Document calibration decisions as reference for future evaluations',
  'Repeat monthly (or after any form change) until IRR exceeds 90%',
];

const COACHING_FEATURES = [
  { feature: 'Link to Evaluations', desc: 'Attach specific evaluation(s) to the coaching session so agent and supervisor review the same evidence' },
  { feature: 'Coaching Templates', desc: 'Pre-built templates for common coaching scenarios (compliance review, soft skills, process adherence)' },
  { feature: 'Scheduling', desc: 'Schedule coaching sessions with calendar integration — both parties receive reminders' },
  { feature: 'Agent Acknowledgment', desc: 'Agents must acknowledge receipt and review of coaching, creating an audit trail' },
  { feature: 'Goal Setting', desc: 'Set specific, measurable improvement goals with target dates' },
  { feature: 'Completion Tracking', desc: 'Track coaching session completion rates by supervisor, team, and timeframe' },
];

const RECORDING_TYPES = [
  { type: 'Trunk-Side Recording', desc: 'Records the audio directly from the SIP trunk. Captures the complete call including IVR prompts, hold music, and transfers. This is the default and most common recording method.', when: 'Default for all voice interactions' },
  { type: 'Station-Side Recording', desc: 'Records audio from the agent\'s station (phone/softphone). Only captures the audio while an agent is connected. Does not capture IVR or hold segments.', when: 'When you only need agent-present audio' },
  { type: 'Screen Recording', desc: 'Captures the agent\'s desktop video during the interaction. Synchronized with voice recording. Requires the screen recording client installed on agent workstations.', when: 'Complex desktop applications, compliance verification' },
  { type: 'Dual-Channel Recording', desc: 'Separates customer audio (left channel) and agent audio (right channel) into a stereo recording. Essential for accurate speech analytics and transcription.', when: 'Speech analytics, transcription accuracy' },
];

const DASHBOARD_METRICS = [
  { metric: 'Average Evaluation Score', desc: 'Mean score across all evaluations for a period. Track by agent, team, queue.', target: '> 85%' },
  { metric: 'Evaluation Completion Rate', desc: 'Percentage of assigned evaluations completed on time by evaluators.', target: '> 95%' },
  { metric: 'Calibration Variance', desc: 'Average score difference between evaluators on the same interaction.', target: '< 5%' },
  { metric: 'Coaching Completion Rate', desc: 'Percentage of coaching sessions completed vs. scheduled.', target: '> 90%' },
  { metric: 'Critical Question Failure Rate', desc: 'Percentage of evaluations where a critical/fatal question was failed.', target: '< 5%' },
  { metric: 'Score Trend (30-day)', desc: 'Direction and velocity of score changes over the trailing 30 days.', target: 'Improving' },
  { metric: 'Agent Score Distribution', desc: 'Distribution of agent scores to identify outliers (both high and low performers).', target: 'Normal distribution' },
];

// ══════════════════════════════════════════════════════════════
// T3 DATA
// ══════════════════════════════════════════════════════════════
const ANALYTICS_LAYERS = [
  { name: 'TRANSCRIPTION', color: C.green, desc: 'Converts voice recordings to text using Genesys ASR engine. Supports 30+ languages. Dual-channel recording improves accuracy by separating speaker audio.', features: ['Real-time transcription (during call)', 'Post-call transcription (batch)', 'Speaker separation (agent vs customer)', 'Punctuation and formatting', 'Confidence scores per word'] },
  { name: 'SENTIMENT ANALYSIS', color: C.blue, desc: 'Detects emotional tone throughout the conversation. Tracks sentiment trajectory (how mood changes over time). Identifies escalation points.', features: ['Per-phrase sentiment scoring (-100 to +100)', 'Overall interaction sentiment', 'Sentiment trend visualization', 'Customer vs agent sentiment separately', 'Escalation detection'] },
  { name: 'TOPIC DETECTION', color: C.orange, desc: 'Identifies conversation topics using trained models. Topics can be pre-built (Genesys library) or custom-defined by your org. Used for routing, reporting, and quality triggers.', features: ['Pre-built topic library (billing, cancellation, etc.)', 'Custom topic training with example phrases', 'Multi-topic detection per interaction', 'Topic frequency reporting', 'Topic-based quality policy triggers'] },
  { name: 'ACOUSTIC ANALYSIS', color: C.purple, desc: 'Analyzes audio characteristics beyond words: silence, overtalk, speaking pace, and energy levels. Key indicators of interaction quality.', features: ['Overtalk detection (both speaking simultaneously)', 'Silence detection (awkward pauses > 3 seconds)', 'Agent/customer talk ratio', 'Speaking pace (words per minute)', 'Audio energy (indicates frustration/enthusiasm)'] },
];

const AI_CAPABILITIES = [
  { name: 'Automated Evaluation Scoring', desc: 'AI evaluates 100% of interactions against your evaluation form criteria. Uses NLU to understand context, not just keywords. Results feed into the same scoring system as human evaluations.', benefit: 'Evaluate every interaction instead of 1–3% sampling' },
  { name: 'Agent Empathy Detection', desc: 'AI analyzes language patterns, tone, and response timing to assess agent empathy. Detects acknowledgment phrases, active listening signals, and emotional responsiveness.', benefit: 'Objective measurement of soft skills at scale' },
  { name: 'Compliance Monitoring', desc: 'Real-time and post-call detection of compliance phrases (disclosures, disclaimers, identity verification). Alerts on missing required statements.', benefit: 'Catch 100% of compliance violations, not just sampled ones' },
  { name: 'Topic Spotting', desc: 'Identifies emerging topics and trending issues across all interactions. Surfaces unknown-unknowns — problems you didn\'t know to look for.', benefit: 'Early warning system for emerging customer issues' },
  { name: 'Trend Analysis', desc: 'AI tracks quality trends over time, correlates quality scores with CSAT/NPS, and identifies factors that predict customer satisfaction.', benefit: 'Data-driven quality strategy instead of gut feel' },
];

const ADVANCED_SCORING = [
  { technique: 'Conditional Questions', desc: 'Questions that appear only when a previous answer triggers them. Example: "Was the disclosure read?" appears only if the interaction type is "Sales." Reduces form complexity for evaluators while maintaining comprehensive coverage.' },
  { technique: 'Weighted Scoring Formulas', desc: 'Assign different weights to question groups (not just individual questions). Example: Compliance group = 40%, Customer Experience group = 35%, Efficiency group = 25%. The group weight multiplies all question scores within it.' },
  { technique: 'Multi-Form Strategies', desc: 'Different forms for different interaction types: a short form (8 questions) for chat interactions, a comprehensive form (20 questions) for complex voice calls, and a compliance-focused form for regulated queues. Quality policies route interactions to the appropriate form.' },
  { technique: 'Quality KPI Alignment', desc: 'Map evaluation questions directly to business KPIs. Each question contributes to a KPI category (FCR, CSAT driver, compliance, efficiency). Reporting shows which KPI areas are strongest/weakest per agent and team.' },
];

const API_ENDPOINTS = [
  { method: 'GET', path: '/api/v2/quality/evaluations/query', use: 'Query evaluations with filters (agent, date, score range, form)' },
  { method: 'POST', path: '/api/v2/quality/evaluations', use: 'Create a new evaluation for a conversation' },
  { method: 'PUT', path: '/api/v2/quality/evaluations/{id}', use: 'Update an evaluation (score, complete, release)' },
  { method: 'GET', path: '/api/v2/quality/forms/evaluations', use: 'List all evaluation forms' },
  { method: 'POST', path: '/api/v2/quality/forms/evaluations', use: 'Create a new evaluation form' },
  { method: 'GET', path: '/api/v2/quality/calibrations', use: 'List calibration sessions' },
  { method: 'POST', path: '/api/v2/quality/calibrations', use: 'Create a calibration session' },
  { method: 'GET', path: '/api/v2/quality/policies', use: 'List quality policies' },
  { method: 'GET', path: '/api/v2/coaching/appointments', use: 'List coaching appointments' },
  { method: 'POST', path: '/api/v2/coaching/appointments', use: 'Create a coaching appointment' },
  { method: 'GET', path: '/api/v2/recording/conversations/{id}/recordings', use: 'Get recordings for a conversation' },
  { method: 'GET', path: '/api/v2/speechandtextanalytics/conversations/{id}', use: 'Get analytics data for a conversation' },
];

const COMPLIANCE_TOPICS = [
  { topic: 'One-Party Consent', desc: 'Most US states and many countries allow recording if at least one party (the organization) consents. A simple notification tone or agent disclosure satisfies this. Genesys Cloud can be configured to play a recording notification prompt.', risk: 'Low' },
  { topic: 'Two-Party (All-Party) Consent', desc: 'Some jurisdictions (California, Illinois, EU under GDPR) require ALL parties to consent to recording. The IVR or agent must explicitly inform the customer and obtain consent. If consent is refused, recording must be stopped or the call must not be recorded.', risk: 'High' },
  { topic: 'PCI DSS Compliance', desc: 'Payment Card Industry rules require that credit card numbers, CVV codes, and sensitive authentication data NEVER be recorded. Genesys Cloud provides Secure Pause/Resume — the agent clicks a button to pause recording during payment collection, then resumes after.', risk: 'High' },
  { topic: 'GDPR Right to Erasure', desc: 'Under GDPR, customers can request deletion of their data including recordings. Genesys Cloud supports recording deletion via API and admin console. Organizations must have a process to fulfill these requests within 30 days.', risk: 'Medium' },
  { topic: 'Retention Requirements', desc: 'Different industries have different mandatory retention periods. Financial services: often 5–7 years. Healthcare (HIPAA): 6 years. General business: typically 90 days to 2 years. Configure per-policy retention in Genesys Cloud recording settings.', risk: 'Medium' },
  { topic: 'Cross-Border Recording', desc: 'When agents and customers are in different jurisdictions, the most restrictive privacy law applies. EU-to-US calls must comply with GDPR. Recording storage location may also be regulated (data residency requirements).', risk: 'High' },
];

const PLATFORM_LIMITS = [
  ['Evaluation forms per org', '500', ''],
  ['Published forms per org', '200', ''],
  ['Questions per evaluation form', '100', 'Recommended: 15–25'],
  ['Question groups per form', '50', ''],
  ['Quality policies per org', '100', ''],
  ['Evaluations per agent per month', 'No hard limit', 'Practical: 4–8 per agent'],
  ['Calibration sessions per org', '1,000', ''],
  ['Evaluators per calibration', '25', ''],
  ['Coaching appointments per org', 'No hard limit', ''],
  ['Recording retention', '1 day – 10 years', 'Default varies by license'],
  ['Screen recording file size', '2 GB per recording', ''],
  ['Bulk recording export', '10,000 per job', ''],
  ['Speech analytics languages', '30+', 'See Genesys docs for full list'],
  ['Custom topics per org', '200', ''],
  ['Topic phrases per topic', '150', ''],
  ['Concurrent transcription jobs', '50 per org', ''],
  ['Evaluation form versions', 'Unlimited', 'Only one "published" at a time'],
  ['Quality policy evaluation limit', '1,000 per policy per week', 'Configurable sample size'],
];

const LICENSE_MATRIX = [
  ['Interaction recording (voice)', true, true, true],
  ['Recording playback & download', true, true, true],
  ['Evaluation forms & scoring', false, true, true],
  ['Quality policies (auto-assignment)', false, true, true],
  ['Calibration sessions', false, true, true],
  ['Coaching appointments', false, true, true],
  ['Screen recording', false, true, true],
  ['Speech & text analytics', false, false, true],
  ['AI-powered evaluation scoring', false, false, true],
  ['Sentiment analysis', false, false, true],
  ['Topic detection & management', false, false, true],
  ['Advanced quality dashboards', false, false, true],
  ['Recording bulk export', false, true, true],
];

const TROUBLESHOOTING = [
  { symptom: 'Recording is missing for an interaction', investigation: 'Check: Is a recording policy active for this queue/flow? → Was the interaction type included (voice vs digital)? → Did the call last long enough to trigger recording (very short calls may not generate a file)? → Check Admin > Quality > Recording Policies — is the policy enabled and does it match the queue? → For screen recording: is the agent\'s screen recording client installed and running? → Check recording retention — was it already deleted by retention policy?' },
  { symptom: 'Evaluation form questions not displaying correctly', investigation: 'Check: Was the form published (not just saved as draft)? → Is the evaluator using the correct form version? → For conditional questions: verify the trigger conditions are properly configured → Check browser console for JavaScript errors → Try clearing browser cache and reloading → Verify the form wasn\'t accidentally archived.' },
  { symptom: 'Quality policy is not assigning evaluations', investigation: 'Check: Is the policy enabled? → Does the policy\'s date range include current dates? → Do interactions match ALL policy conditions (queue AND agent AND direction)? → Is the sample size set correctly (not 0)? → Are there available evaluators assigned to the policy? → Have the evaluators reached their maximum evaluation limit? → Check policy schedule — does it run during current hours?' },
  { symptom: 'Calibration scores show high variance', investigation: 'This is often a people/process issue, not technical: → Review the evaluation form for ambiguous question wording → Ensure all evaluators have the same rubric/guide document → Hold a calibration review meeting to align on interpretation → Consider adding detailed answer descriptions to each score option → Identify which specific questions have highest variance and focus rewriting those → Track IRR over time (target > 90%).' },
  { symptom: 'Speech analytics not generating transcripts', investigation: 'Check: Is speech analytics enabled for your org (requires GC3 or WEM add-on)? → Is the recording format supported (dual-channel recommended)? → Check the language setting — does it match the interaction language? → Verify the recording is complete (still in progress calls won\'t transcribe) → Check Admin > Speech & Text Analytics > Settings for processing status → Look for processing errors in the analytics dashboard.' },
  { symptom: 'Agents cannot see their evaluations', investigation: 'Check: Has the evaluation been released/completed by the evaluator? (In-progress evaluations are not visible to agents) → Does the agent have the Quality > Evaluation > View permission? → Check if "Agent View" is enabled on the evaluation form → Verify the evaluation wasn\'t deleted or reassigned → Check if there\'s a release delay configured in quality settings.' },
];

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
// BUILDING BLOCKS SVG (T1S3)
// ══════════════════════════════════════════════════════════════
const BuildingBlocksSVG = () => {
  const [active, setActive] = useState(null);
  return (
    <div className="my-6 overflow-x-auto">
      <svg viewBox="0 0 800 500" className="w-full" style={{ maxWidth: 800, minWidth: 600 }}>
        <defs>
          <filter id="glow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        {BUILDING_BLOCKS.map(n => (
          <line key={`line-${n.id}`} x1={BLOCK_CENTER.x} y1={BLOCK_CENTER.y} x2={n.x} y2={n.y} stroke={C.border} strokeWidth="2" strokeDasharray="6,4" />
        ))}
        <g>
          <rect x={BLOCK_CENTER.x - 80} y={BLOCK_CENTER.y - 30} width={160} height={60} rx={12} fill={C.bg3} stroke={C.orange} strokeWidth={2} />
          <text x={BLOCK_CENTER.x} y={BLOCK_CENTER.y - 5} textAnchor="middle" fill={C.t1} fontFamily={MONO} fontSize={13} fontWeight="bold">QUALITY</text>
          <text x={BLOCK_CENTER.x} y={BLOCK_CENTER.y + 15} textAnchor="middle" fill={C.t3} fontFamily={SANS} fontSize={10}>Management</text>
        </g>
        {BUILDING_BLOCKS.map(n => {
          const isActive = active === n.id;
          return (
            <g key={n.id} className="cursor-pointer" onClick={() => setActive(isActive ? null : n.id)} style={{ transition: 'transform 0.2s' }}>
              <rect x={n.x - 75} y={n.y - 25} width={150} height={50} rx={8} fill={C.bg2} stroke={isActive ? C.orange : C.border} strokeWidth={isActive ? 2 : 1} filter={isActive ? 'url(#glow)' : undefined} />
              <text x={n.x} y={n.y - 4} textAnchor="middle" fill={C.t1} fontFamily={MONO} fontSize={10} fontWeight="600">{n.label.includes('\n') ? n.label.split('\n').map((line, i) => <tspan key={i} x={n.x} dy={i === 0 ? 0 : 12}>{line}</tspan>) : n.label}</text>
              {!n.label.includes('\n') && <text x={n.x} y={n.y + 12} textAnchor="middle" fill={C.t3} fontFamily={SANS} fontSize={9}>{n.sub}</text>}
              {isActive && (() => {
                const tw = 280;
                const tx = Math.max(8, Math.min(n.x - tw / 2, 800 - tw - 8));
                const above = n.y > 300;
                const ty = above ? n.y - 135 : n.y + 30;
                return (
                  <foreignObject x={tx} y={ty} width={tw} height={130}>
                    <div xmlns="http://www.w3.org/1999/xhtml" style={{ background: 'var(--bg3)', border: `1px solid ${C.orange}`, borderRadius: 8, padding: '10px 12px', boxSizing: 'border-box' }}>
                      <div style={{ color: 'var(--t1)', fontSize: 11, fontFamily: SANS, lineHeight: 1.5, marginBottom: 6 }}>{n.explanation}</div>
                      <div style={{ color: C.yellow, fontSize: 10, fontFamily: MONO }}>Analogy: {n.analogy}</div>
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
      <SectionHeading>What Is Quality Management?</SectionHeading>
      <Paragraph>Quality Management (QM) is the discipline of systematically evaluating and improving customer interactions. Think of it as two roles combined: a restaurant health inspector who ensures minimum standards are met (compliance, process adherence), and a Michelin star reviewer who drives excellence (customer experience, agent skill development).</Paragraph>
      <Paragraph>In Genesys Cloud, Quality Management is part of the Workforce Engagement Management (WEM) suite. It provides tools to record interactions, score them against structured evaluation forms, calibrate evaluator consistency, coach agents based on evidence, and track improvement over time — all within a single platform.</Paragraph>
      <SubHeading>Why Quality Management Matters</SubHeading>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 my-4">
        {QM_PURPOSES.map((p, i) => {
          const iconMap = { Shield, Target, TrendingUp, Award, BarChart3, Users };
          const Icon = iconMap[p.icon] || Info;
          return (
            <div key={i} className="rounded-lg p-4 flex items-start gap-3 transition-all duration-200 hover:-translate-y-0.5" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
              <Icon size={20} style={{ color: C.orange, flexShrink: 0 }} />
              <div><div className="font-semibold text-sm" style={{ color: C.t1, fontFamily: MONO }}>{p.label}</div><div className="text-xs mt-1" style={{ color: C.t2, fontFamily: SANS }}>{p.desc}</div></div>
            </div>
          );
        })}
      </div>
      <SubHeading>Traditional QA vs. Modern Quality Management</SubHeading>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        {[
          { title: 'TRADITIONAL QA', items: ['Manual selection of calls to review', 'Spreadsheet-based scoring', '1–3% of interactions sampled', 'Reactive — discovers problems after the fact', 'Evaluator bias unchecked'], color: C.blue },
          { title: 'MODERN QM (Genesys Cloud)', items: ['Automated policy-based selection', 'Digital evaluation forms with weighted scoring', '100% analysis possible with AI/analytics', 'Proactive — real-time alerts and trend detection', 'Calibration ensures consistency'], color: C.orange },
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
      <SectionHeading>The Quality Lifecycle</SectionHeading>
      <Paragraph>Quality Management follows a continuous improvement cycle. Each step feeds into the next, creating a loop that drives ongoing agent development and customer experience enhancement.</Paragraph>
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
          <div className="font-bold text-sm" style={{ color: C.green, fontFamily: MONO }}>REPEAT — Quality is a continuous loop, not a one-time event</div>
        </div>
      </div>
      <CalloutBox type="tip">The most effective quality programs complete this full cycle weekly for each agent. Monthly is acceptable for mature programs. Quarterly is too infrequent to drive meaningful behavior change.</CalloutBox>
    </section>

    {/* T1S3 */}
    <section ref={el => sectionRefs.current['t1s3'] = el} id="t1s3">
      <SectionHeading>The Building Blocks of Quality</SectionHeading>
      <Paragraph>Quality Management in Genesys Cloud is built from six interconnected components. No single piece works alone — they form an integrated system. Click any node in the diagram below to learn more.</Paragraph>
      <BuildingBlocksSVG />
      <SubHeading>Component Reference</SubHeading>
      <InteractiveTable
        headers={['Component', 'Purpose', 'Analogy']}
        rows={BUILDING_BLOCKS.map(b => [b.label.replace('\n', ' '), b.explanation, b.analogy])}
      />
    </section>

    {/* T1S4 */}
    <section ref={el => sectionRefs.current['t1s4'] = el} id="t1s4">
      <SectionHeading>Types of Quality Programs</SectionHeading>
      <Paragraph>Organizations typically use a combination of these approaches. The right mix depends on your volume, team size, regulatory requirements, and maturity level.</Paragraph>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {QUALITY_PROGRAM_TYPES.map((p, i) => (
          <ExpandableCard key={i} title={p.name} accent={C.orange}>
            <div className="space-y-3">
              <div><strong style={{ color: C.t1 }}>How it works:</strong> {p.method}</div>
              <div>
                <strong style={{ color: C.green }}>Pros:</strong>
                <ul className="mt-1 space-y-1">{p.pros.map((pro, j) => <li key={j} className="text-xs" style={{ color: C.t3 }}>+ {pro}</li>)}</ul>
              </div>
              <div>
                <strong style={{ color: C.red }}>Cons:</strong>
                <ul className="mt-1 space-y-1">{p.cons.map((con, j) => <li key={j} className="text-xs" style={{ color: C.t3 }}>- {con}</li>)}</ul>
              </div>
            </div>
          </ExpandableCard>
        ))}
      </div>
      <CalloutBox type="info">Most organizations start with random sampling (Tier 2), add targeted evaluation for high-risk queues, and then layer in AI-automated evaluation as they mature. The goal is to move from sampling 1–3% of interactions to analyzing 100%.</CalloutBox>
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
  const [activeQTab, setActiveQTab] = useState(0);
  return (
    <div className="space-y-16">
      {/* T2S1 */}
      <section ref={el => sectionRefs.current['t2s1'] = el} id="t2s1">
        <SectionHeading>Prerequisites — What You Need Before Starting</SectionHeading>
        <Paragraph>Before launching a quality management program in Genesys Cloud, these foundational elements must be in place. Think of this as the infrastructure that all quality activities depend on.</Paragraph>
        <div className="space-y-3 my-4">
          {PREREQUISITES.map((p, i) => (
            <ExpandableCard key={i} title={`${i + 1}. ${p.title}`} accent={C.blue}>
              {p.detail}
            </ExpandableCard>
          ))}
        </div>
        <SubHeading>Recommended Setup Sequence</SubHeading>
        <div className="flex flex-wrap items-center gap-1 my-4 overflow-x-auto">
          {['Licensing', 'Permissions', 'Recording Policy', 'Eval Form', 'Quality Policy', 'Calibrate', 'Coach'].map((s, i) => (
            <React.Fragment key={i}>
              <span className="px-3 py-1.5 rounded text-xs whitespace-nowrap" style={{ backgroundColor: C.bg3, color: C.t1, fontFamily: MONO, border: `1px solid ${C.border}` }}>{s}</span>
              {i < 6 && <ArrowRight size={14} style={{ color: C.t3, flexShrink: 0 }} />}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* T2S2 */}
      <section ref={el => sectionRefs.current['t2s2'] = el} id="t2s2">
        <SectionHeading>Evaluation Forms — Design & Best Practices</SectionHeading>
        <Paragraph>Evaluation forms are the backbone of quality management. A well-designed form drives consistent scoring, meaningful coaching, and actionable insights. A poorly designed form creates evaluator fatigue, inconsistency, and useless data.</Paragraph>
        <SubHeading>Question Types</SubHeading>
        <div className="flex gap-1 mb-3 overflow-x-auto">
          {QUESTION_TYPES.map((t, i) => (
            <button key={i} className="px-3 py-1.5 rounded text-xs whitespace-nowrap cursor-pointer transition-colors" onClick={() => setActiveQTab(i)} style={{ backgroundColor: activeQTab === i ? C.blue : C.bg3, color: activeQTab === i ? '#fff' : C.t2, fontFamily: MONO }}>{t.type}</button>
          ))}
        </div>
        <div className="p-4 rounded-lg text-sm" style={{ backgroundColor: C.bg2, color: C.t2, fontFamily: SANS, border: `1px solid ${C.border}`, lineHeight: 1.7 }}>
          <div className="mb-2"><strong style={{ color: C.t1 }}>Example:</strong> {QUESTION_TYPES[activeQTab].desc}</div>
          <div className="mb-2"><strong style={{ color: C.t1 }}>Typical Weight:</strong> {QUESTION_TYPES[activeQTab].weight}</div>
          <div><strong style={{ color: C.t1 }}>Best For:</strong> {QUESTION_TYPES[activeQTab].use}</div>
        </div>

        <SubHeading>Form Structure</SubHeading>
        <div className="my-4 p-4 rounded-lg space-y-3" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
          <div className="font-bold text-xs" style={{ color: C.orange, fontFamily: MONO }}>EVALUATION FORM ANATOMY</div>
          <div className="pl-4" style={{ borderLeft: `2px solid ${C.orange}33` }}>
            {[
              { indent: 0, text: 'Form Name & Description', color: C.t1 },
              { indent: 1, text: 'Question Group 1: "Opening & Greeting" (Weight: 20%)', color: C.blue },
              { indent: 2, text: 'Q1: "Did the agent greet the customer by name?" [Yes/No] — 10 pts', color: C.t3 },
              { indent: 2, text: 'Q2: "Was the greeting professional and warm?" [Range 1-5] — 15 pts', color: C.t3 },
              { indent: 1, text: 'Question Group 2: "Process & Compliance" (Weight: 40%)', color: C.blue },
              { indent: 2, text: 'Q3: "Did the agent verify caller identity?" [Yes/No] — CRITICAL', color: C.red },
              { indent: 2, text: 'Q4: "Was the hold process followed correctly?" [Multiple Choice] — 20 pts', color: C.t3 },
              { indent: 2, text: 'Q5: "Were required disclosures read?" [Yes/No] — FATAL', color: C.red },
              { indent: 1, text: 'Question Group 3: "Soft Skills" (Weight: 25%)', color: C.blue },
              { indent: 2, text: 'Q6: "Rate the agent\'s active listening" [Range 1-10] — 25 pts', color: C.t3 },
              { indent: 2, text: 'Q7: "Rate empathy and rapport building" [Range 1-10] — 25 pts', color: C.t3 },
              { indent: 1, text: 'Question Group 4: "Closing" (Weight: 15%)', color: C.blue },
              { indent: 2, text: 'Q8: "Did the agent summarize next steps?" [Yes/No] — 10 pts', color: C.t3 },
              { indent: 2, text: 'Q9: "Additional coaching notes" [Free Text] — 0 pts', color: C.t3 },
            ].map((line, i) => (
              <div key={i} className="text-xs" style={{ paddingLeft: line.indent * 20, color: line.color, fontFamily: MONO, marginBottom: 2 }}>{line.text}</div>
            ))}
          </div>
        </div>

        <SubHeading>Critical vs. Fatal Questions</SubHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          {[
            { title: 'CRITICAL QUESTION', desc: 'If the agent fails this question, the entire evaluation score is set to 0%. Used for absolute compliance requirements.', examples: ['Identity verification', 'Required legal disclosures', 'PCI compliance procedures'], color: C.red },
            { title: 'STANDARD QUESTION', desc: 'Contributes its weighted points to the total score. Failing a standard question reduces the score proportionally but does not zero it out.', examples: ['Greeting quality', 'Active listening', 'Closing summary'], color: C.blue },
          ].map((panel, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, borderTop: `3px solid ${panel.color}` }}>
              <div className="font-bold text-sm mb-2" style={{ color: panel.color, fontFamily: MONO }}>{panel.title}</div>
              <div className="text-xs mb-3" style={{ color: C.t2 }}>{panel.desc}</div>
              <div className="text-xs font-semibold mb-1" style={{ color: C.t1 }}>Examples:</div>
              {panel.examples.map((ex, j) => <div key={j} className="text-xs" style={{ color: C.t3 }}>• {ex}</div>)}
            </div>
          ))}
        </div>

        <SubHeading>Best Practices</SubHeading>
        <div className="space-y-1 my-3">
          {FORM_BEST_PRACTICES.map((p, i) => (
            <div key={i} className="text-xs flex items-start gap-2" style={{ color: p.good ? C.green : C.red, fontFamily: SANS }}>
              <span>{p.good ? '+' : '-'}</span><span style={{ color: C.t2 }}>{p.text}</span>
            </div>
          ))}
        </div>

        <CalloutBox type="info">
          <strong>Form Versioning:</strong> When you publish a new version of an evaluation form, all existing completed evaluations retain their original form version and scores. Only NEW evaluations use the updated form. This means you can safely iterate on forms without affecting historical data.
        </CalloutBox>
      </section>

      {/* T2S3 */}
      <section ref={el => sectionRefs.current['t2s3'] = el} id="t2s3">
        <SectionHeading>Quality Policies — Automating Evaluation Assignment</SectionHeading>
        <Paragraph>Quality policies are the automation engine that connects interactions to evaluators. Instead of manually searching for calls to evaluate, policies automatically select interactions that match your criteria and assign them to the right evaluators.</Paragraph>
        <SubHeading>Policy Conditions</SubHeading>
        <div className="space-y-2 my-3">
          {POLICY_CONDITIONS.map((c, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-1 p-3 rounded" style={{ backgroundColor: C.bg2 }}>
              <span className="text-xs font-semibold whitespace-nowrap min-w-[120px]" style={{ color: C.blue, fontFamily: MONO }}>{c.condition}:</span>
              <span className="text-xs" style={{ color: C.t2, fontFamily: SANS }}>{c.desc}</span>
            </div>
          ))}
        </div>
        <SubHeading>Evaluator Assignment Methods</SubHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          {[
            { title: 'Round-Robin', desc: 'Evaluations are distributed evenly across all assigned evaluators. Best for: balanced workload distribution.', color: C.green },
            { title: 'Specific Evaluator', desc: 'All evaluations from the policy go to one named evaluator. Best for: specialized queues where domain expertise is required.', color: C.blue },
          ].map((m, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, borderLeft: `4px solid ${m.color}` }}>
              <div className="font-bold text-sm mb-2" style={{ color: m.color, fontFamily: MONO }}>{m.title}</div>
              <div className="text-xs" style={{ color: C.t2, fontFamily: SANS }}>{m.desc}</div>
            </div>
          ))}
        </div>
        <SubHeading>Sample Size & Scheduling</SubHeading>
        <Paragraph>Each policy has a configurable sample size — the number of evaluations generated per policy execution. Example: "Evaluate 5 random interactions per agent per week from the Billing queue." The policy runs on its configured schedule, selects matching interactions, and creates evaluation assignments in evaluators' queues.</Paragraph>
        <CalloutBox type="warning">Policies evaluate interactions AFTER they occur (post-interaction). There is typically a delay of 15–60 minutes between the interaction ending and the evaluation assignment appearing, as recording processing must complete first.</CalloutBox>
      </section>

      {/* T2S4 */}
      <section ref={el => sectionRefs.current['t2s4'] = el} id="t2s4">
        <SectionHeading>Performing Evaluations</SectionHeading>
        <Paragraph>The evaluator workflow is designed to be efficient while ensuring thorough, consistent scoring. Here is the step-by-step process.</Paragraph>
        <div className="my-6 space-y-0">
          {EVALUATOR_WORKFLOW.map((s, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: C.blue + '22', color: C.blue, border: `2px solid ${C.blue}`, fontFamily: MONO }}>{s.step}</div>
                {i < EVALUATOR_WORKFLOW.length - 1 && <div className="w-0.5 flex-1 my-1" style={{ backgroundColor: C.border }} />}
              </div>
              <div className="pb-6 flex-1">
                <div className="font-bold text-sm mb-1" style={{ color: C.t1, fontFamily: MONO }}>{s.action}</div>
                <div className="text-sm" style={{ color: C.t2, fontFamily: SANS }}>{s.detail}</div>
              </div>
            </div>
          ))}
        </div>
        <SubHeading>Agent Visibility</SubHeading>
        <Paragraph>Once an evaluation is completed and released, agents can view their scores, read evaluator comments, and listen to the recorded interaction. This transparency is essential for agent buy-in and effective coaching. Agents can also dispute evaluations if they disagree with the scoring — disputes trigger a review workflow.</Paragraph>
        <CalloutBox type="tip">
          <strong>Pro Tip:</strong> Reference specific timestamps in your comments. Instead of "The agent was rude," write "At 2:34, the agent interrupted the customer mid-sentence." Specific feedback is actionable; vague feedback is demoralizing.
        </CalloutBox>
      </section>

      {/* T2S5 */}
      <section ref={el => sectionRefs.current['t2s5'] = el} id="t2s5">
        <SectionHeading>Calibration — Ensuring Consistency</SectionHeading>
        <Paragraph>Calibration is the process of aligning evaluators so they score the same interaction the same way. Without calibration, quality scores reflect evaluator opinion rather than objective quality — making the data unreliable and coaching unfair.</Paragraph>
        <SubHeading>The Calibration Process</SubHeading>
        <div className="my-4 space-y-0">
          {CALIBRATION_STEPS.map((step, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: C.purple + '22', color: C.purple, border: `2px solid ${C.purple}`, fontFamily: MONO }}>{i + 1}</div>
                {i < CALIBRATION_STEPS.length - 1 && <div className="w-0.5 flex-1 my-1" style={{ backgroundColor: C.border }} />}
              </div>
              <div className="pb-4 flex-1">
                <div className="text-sm" style={{ color: C.t2, fontFamily: SANS }}>{step}</div>
              </div>
            </div>
          ))}
        </div>
        <SubHeading>Calibration Reports</SubHeading>
        <Paragraph>Genesys Cloud generates calibration reports showing: score distribution across evaluators, question-level variance analysis, overall inter-rater reliability (IRR) percentage, and trending IRR over time. Target an IRR of 90% or higher.</Paragraph>
        <div className="my-4 rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
          <div className="font-bold text-xs mb-3" style={{ color: C.purple, fontFamily: MONO }}>CALIBRATION VARIANCE EXAMPLE</div>
          <InteractiveTable
            headers={['Question', 'Evaluator A', 'Evaluator B', 'Evaluator C', 'Variance']}
            rows={[
              ['Greeting quality', '8/10', '7/10', '8/10', '< 10% (OK)'],
              ['Identity verification', 'Yes', 'Yes', 'Yes', '0% (Perfect)'],
              ['Active listening', '6/10', '9/10', '5/10', '> 30% (Problem!)'],
              ['Closing summary', 'Yes', 'No', 'Yes', '> 20% (Needs discussion)'],
            ]}
          />
          <div className="text-xs mt-2" style={{ color: C.t3, fontFamily: SANS }}>High variance on "Active listening" suggests the rubric is too subjective. Add specific criteria: "Did the agent paraphrase the customer's concern? Did the agent ask clarifying questions?"</div>
        </div>
      </section>

      {/* T2S6 */}
      <section ref={el => sectionRefs.current['t2s6'] = el} id="t2s6">
        <SectionHeading>Coaching & Agent Development</SectionHeading>
        <Paragraph>Coaching is where quality scores translate into actual improvement. An evaluation without coaching is just surveillance. Coaching sessions create a structured bridge between identifying problems and fixing them.</Paragraph>
        <SubHeading>Coaching Features in Genesys Cloud</SubHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
          {COACHING_FEATURES.map((f, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
              <div className="font-bold text-sm mb-2" style={{ color: C.t1, fontFamily: MONO }}>{f.feature}</div>
              <div className="text-xs" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
        <SubHeading>Coaching Workflow</SubHeading>
        <div className="my-4 p-4 rounded-lg" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
          {[
            { text: 'Supervisor reviews evaluation scores and identifies coaching opportunity', color: C.orange },
            { text: 'Creates coaching appointment, links relevant evaluation(s)', color: C.blue },
            { text: 'Agent receives notification with scheduled time', color: C.green },
            { text: 'During session: review recording together, discuss scores, set goals', color: C.purple },
            { text: 'Agent acknowledges coaching and goals', color: C.blue },
            { text: 'Supervisor marks session complete, tracks follow-up', color: C.green },
            { text: 'Next evaluation cycle: measure improvement against goals', color: C.orange },
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3 mb-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0" style={{ backgroundColor: step.color + '22', color: step.color, fontFamily: MONO }}>{i + 1}</div>
              <div className="text-xs" style={{ color: C.t2, fontFamily: SANS }}>{step.text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* T2S7 */}
      <section ref={el => sectionRefs.current['t2s7'] = el} id="t2s7">
        <SectionHeading>Recording Policies</SectionHeading>
        <Paragraph>Recording policies control WHAT gets recorded, HOW it gets recorded, and HOW LONG recordings are retained. They are the foundation of quality management — without recordings, there is nothing to evaluate.</Paragraph>
        <SubHeading>Recording Types</SubHeading>
        <div className="space-y-3 my-4">
          {RECORDING_TYPES.map((r, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
              <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                <span className="font-bold text-sm" style={{ color: C.t1, fontFamily: MONO }}>{r.type}</span>
                <span className="text-[10px] px-2 py-0.5 rounded" style={{ backgroundColor: C.bg3, color: C.t3 }}>{r.when}</span>
              </div>
              <div className="text-xs" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.6 }}>{r.desc}</div>
            </div>
          ))}
        </div>
        <SubHeading>Selective Recording</SubHeading>
        <Paragraph>Not every interaction needs to be recorded. Selective recording policies allow you to record only specific queues, flows, or interaction types. Conditions include: queue membership, direction (inbound/outbound), media type (voice/chat/email), time of day, and custom participant data values. This reduces storage costs while ensuring critical interactions are always captured.</Paragraph>
        <SubHeading>PCI Pause/Resume</SubHeading>
        <Paragraph>For PCI DSS compliance, Genesys Cloud provides a Secure Pause feature. When an agent needs to collect sensitive payment information, they click "Secure Pause" — this stops the recording, mutes DTMF tones, and pauses screen recording. After payment processing, the agent clicks "Resume" to restart recording. The pause event is logged for audit purposes.</Paragraph>
        <div className="my-4 p-4 rounded-lg" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
          <div className="font-bold text-xs mb-3" style={{ color: C.red, fontFamily: MONO }}>PCI SECURE PAUSE FLOW</div>
          {[
            { text: 'Agent is on call, recording is active', color: C.green },
            { text: 'Customer needs to provide credit card number', color: C.orange },
            { text: 'Agent clicks "Secure Pause" button in toolbar', color: C.blue },
            { text: 'Recording STOPS, DTMF tones MUTED, screen recording PAUSED', color: C.red },
            { text: 'Customer provides payment information', color: C.t3 },
            { text: 'Agent processes payment in PCI-compliant system', color: C.t3 },
            { text: 'Agent clicks "Resume" — recording restarts', color: C.green },
            { text: 'Final recording has a gap where payment data was captured', color: C.blue },
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3 mb-1">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0" style={{ backgroundColor: step.color + '22', color: step.color, fontFamily: MONO }}>{i + 1}</div>
              <div className="text-xs" style={{ color: C.t2, fontFamily: SANS }}>{step.text}</div>
            </div>
          ))}
        </div>
        <SubHeading>Retention Policies</SubHeading>
        <div className="space-y-2 my-3">
          {[
            ['Default Retention', 'Configured per policy — typically 30–365 days for general business'],
            ['Regulatory Retention', 'Financial services may require 5–7 years; healthcare (HIPAA) requires 6 years'],
            ['Bulk Export', 'Export recordings to AWS S3 or Azure Blob for long-term archival outside Genesys Cloud'],
            ['Deletion', 'Recordings are permanently deleted after retention period expires — no recovery possible'],
          ].map(([label, desc], i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-1 p-3 rounded" style={{ backgroundColor: C.bg2 }}>
              <span className="text-xs font-semibold whitespace-nowrap min-w-[160px]" style={{ color: C.blue, fontFamily: MONO }}>{label}:</span>
              <span className="text-xs" style={{ color: C.t2, fontFamily: SANS }}>{desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* T2S8 */}
      <section ref={el => sectionRefs.current['t2s8'] = el} id="t2s8">
        <SectionHeading>Quality Dashboards & Reporting</SectionHeading>
        <Paragraph>Genesys Cloud provides built-in quality dashboards that give real-time visibility into your quality program's health. These dashboards are accessible to quality administrators, supervisors, and agents (with appropriate permissions).</Paragraph>
        <SubHeading>Key Quality Metrics</SubHeading>
        <InteractiveTable
          headers={['Metric', 'Description', 'Target']}
          rows={DASHBOARD_METRICS.map(m => [m.metric, m.desc, m.target])}
        />
        <SubHeading>Available Reports</SubHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
          {[
            { name: 'Evaluation Summary', desc: 'Aggregate scores by agent, team, queue, and time period. Shows score distribution and trends.', icon: BarChart3 },
            { name: 'Agent Score Trends', desc: 'Individual agent score history over time. Compare before/after coaching. Identify improvement velocity.', icon: TrendingUp },
            { name: 'Form Performance', desc: 'Analyze how each evaluation form is performing: average scores, question-level pass rates, common failure points.', icon: FileText },
            { name: 'Calibration Report', desc: 'Inter-rater reliability metrics, evaluator variance analysis, and calibration session outcomes.', icon: Target },
            { name: 'Coaching Completion', desc: 'Track coaching session completion rates, agent acknowledgment rates, and goal achievement.', icon: UserCheck },
            { name: 'Evaluator Productivity', desc: 'Evaluations completed per evaluator, average time per evaluation, completion rate vs. assignments.', icon: Activity },
          ].map((r, i) => (
            <div key={i} className="rounded-lg p-4 flex items-start gap-3" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
              <r.icon size={20} style={{ color: C.blue, flexShrink: 0 }} />
              <div>
                <div className="font-bold text-sm mb-1" style={{ color: C.t1, fontFamily: MONO }}>{r.name}</div>
                <div className="text-xs" style={{ color: C.t2, fontFamily: SANS }}>{r.desc}</div>
              </div>
            </div>
          ))}
        </div>
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
      <SectionHeading>Speech & Text Analytics — How It Works</SectionHeading>
      <Paragraph>Speech and text analytics is the AI engine that transforms raw recordings and transcripts into actionable insights. It operates in four layers, each building on the previous one to create a comprehensive understanding of every interaction.</Paragraph>
      <div className="space-y-4 my-4">
        {ANALYTICS_LAYERS.map((layer, i) => (
          <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, borderLeft: `4px solid ${layer.color}` }}>
            <div className="font-bold text-sm mb-2" style={{ color: layer.color, fontFamily: MONO }}>LAYER {i + 1}: {layer.name}</div>
            <div className="text-xs mb-3" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.6 }}>{layer.desc}</div>
            <div className="space-y-1">
              {layer.features.map((f, j) => <div key={j} className="text-xs" style={{ color: C.t3, fontFamily: SANS }}>• {f}</div>)}
            </div>
          </div>
        ))}
      </div>
      <SubHeading>Configuration & Training</SubHeading>
      <Paragraph>Speech analytics requires initial configuration: selecting the primary language(s), enabling dual-channel recording for accuracy, and training custom topics with example phrases. Genesys provides a pre-built topic library covering common contact center scenarios (billing inquiries, cancellation requests, complaints, escalations). Custom topics are trained by providing 5–20 example phrases per topic.</Paragraph>
      <CalloutBox type="tip">
        <strong>Accuracy Tip:</strong> Dual-channel (stereo) recording dramatically improves transcription accuracy because the system can isolate customer and agent audio. Mono recordings with crosstalk reduce accuracy by 15–25%.
      </CalloutBox>
      <SubHeading>Analytics Processing Pipeline</SubHeading>
      <div className="my-4 p-4 rounded-lg" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
        <div className="font-bold text-xs mb-3" style={{ color: C.green, fontFamily: MONO }}>END-TO-END ANALYTICS PIPELINE</div>
        {[
          { label: 'Interaction Ends', detail: 'Recording file is finalized and stored', color: C.green },
          { label: 'Audio Processing', detail: 'Dual-channel separation, noise reduction, normalization', color: C.blue },
          { label: 'ASR Transcription', detail: 'Speech-to-text conversion with speaker diarization', color: C.orange },
          { label: 'NLU Analysis', detail: 'Sentiment scoring, topic detection, intent classification', color: C.purple },
          { label: 'Acoustic Analysis', detail: 'Overtalk, silence, pace, and energy measurement', color: C.yellow },
          { label: 'Results Available', detail: 'Analytics data accessible via UI and API (typically 5–15 minutes post-call)', color: C.green },
        ].map((step, i) => (
          <div key={i} className="flex items-start gap-3 mb-2">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0" style={{ backgroundColor: step.color + '22', color: step.color, fontFamily: MONO }}>{i + 1}</div>
            <div>
              <span className="text-xs font-semibold" style={{ color: step.color, fontFamily: MONO }}>{step.label}: </span>
              <span className="text-xs" style={{ color: C.t2, fontFamily: SANS }}>{step.detail}</span>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* T3S2 */}
    <section ref={el => sectionRefs.current['t3s2'] = el} id="t3s2">
      <SectionHeading>AI-Powered Quality</SectionHeading>
      <Paragraph>AI transforms quality management from a sample-based review process into comprehensive, data-driven quality assurance. Instead of evaluating 1–3% of interactions manually, AI can analyze 100% of interactions consistently.</Paragraph>
      <div className="space-y-3 my-4">
        {AI_CAPABILITIES.map((cap, i) => (
          <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <span className="font-bold text-sm" style={{ color: C.t1, fontFamily: MONO }}>{cap.name}</span>
              <span className="text-[10px] px-2 py-0.5 rounded" style={{ backgroundColor: C.green + '22', color: C.green }}>{cap.benefit}</span>
            </div>
            <div className="text-xs" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.6 }}>{cap.desc}</div>
          </div>
        ))}
      </div>
      <CalloutBox type="warning">
        <strong>AI is an augmentation tool, not a replacement for human evaluators.</strong> AI excels at scale and consistency but struggles with nuance, context, and judgment. Best practice: use AI to screen 100% of interactions and flag potential issues, then have human evaluators validate the most critical or edge-case interactions.
      </CalloutBox>
    </section>

    {/* T3S3 */}
    <section ref={el => sectionRefs.current['t3s3'] = el} id="t3s3">
      <SectionHeading>Advanced Evaluation Design</SectionHeading>
      <Paragraph>Beyond basic forms, Genesys Cloud supports sophisticated evaluation strategies that align quality scoring with business outcomes.</Paragraph>
      <div className="space-y-3 my-4">
        {ADVANCED_SCORING.map((tech, i) => (
          <ExpandableCard key={i} title={tech.technique} accent={C.purple}>
            <div className="text-sm" style={{ lineHeight: 1.7 }}>{tech.desc}</div>
          </ExpandableCard>
        ))}
      </div>
      <SubHeading>Quality KPI Dashboard Design</SubHeading>
      <div className="my-4 p-4 rounded-lg" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
        {[
          { kpi: 'Customer Satisfaction', questions: 'Greeting warmth, empathy, active listening, closing', weight: '35%', color: C.green },
          { kpi: 'Compliance', questions: 'Identity verification, disclosures, PCI procedures', weight: '30%', color: C.red },
          { kpi: 'First Contact Resolution', questions: 'Problem understanding, solution accuracy, next steps', weight: '20%', color: C.blue },
          { kpi: 'Efficiency', questions: 'Hold time management, transfer appropriateness, documentation', weight: '15%', color: C.orange },
        ].map((row, i) => (
          <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 rounded-lg text-xs mb-2" style={{ backgroundColor: C.bg3, fontFamily: SANS }}>
            <span className="font-semibold min-w-[160px]" style={{ color: row.color, fontFamily: MONO }}>{row.kpi}</span>
            <span className="flex-1" style={{ color: C.t2 }}>{row.questions}</span>
            <span className="font-bold" style={{ color: C.t1, fontFamily: MONO }}>{row.weight}</span>
          </div>
        ))}
      </div>
    </section>

    {/* T3S4 */}
    <section ref={el => sectionRefs.current['t3s4'] = el} id="t3s4">
      <SectionHeading>API & Integration Architecture</SectionHeading>
      <Paragraph>The Quality Management API provides complete programmatic control over evaluations, forms, policies, coaching, and recordings. This enables custom dashboards, LMS integration, and automated quality workflows.</Paragraph>
      <SubHeading>Key API Endpoints</SubHeading>
      <InteractiveTable searchable headers={['Method', 'Endpoint', 'Use']} rows={API_ENDPOINTS.map(e => [e.method, e.path, e.use])} />
      <SubHeading>Integration Patterns</SubHeading>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
        {[
          { name: 'LMS Integration', desc: 'Export evaluation data and coaching needs to Learning Management Systems. Auto-assign training modules based on quality score deficiencies.' },
          { name: 'Custom Dashboards', desc: 'Pull evaluation scores, analytics data, and coaching metrics into BI tools (Power BI, Tableau, Looker) via API or data export.' },
          { name: 'Notification Workflows', desc: 'Subscribe to quality events (evaluation completed, critical failure, coaching due) via the Notification API to trigger automated workflows.' },
        ].map((c, i) => (
          <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
            <div className="font-bold text-sm mb-2" style={{ color: C.t1, fontFamily: MONO }}>{c.name}</div>
            <div className="text-xs" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.6 }}>{c.desc}</div>
          </div>
        ))}
      </div>
      <SubHeading>Example: Auto-Assign Training on Critical Failure</SubHeading>
      <CodeBlock>{`// Notification subscription: quality evaluation completed
// Topic: v2.quality.evaluations.{evaluationId}

// Webhook handler pseudocode:
async function onEvaluationComplete(event) {
  const evaluation = await getEvaluation(event.evaluationId);

  if (evaluation.criticalScore === true && evaluation.score === 0) {
    // Critical failure detected — auto-assign remedial training
    const agent = evaluation.agentId;
    const failedQuestions = evaluation.questions
      .filter(q => q.isCritical && q.score === 0);

    // Map failed questions to training modules
    for (const question of failedQuestions) {
      await lmsApi.assignModule({
        userId: agent,
        moduleId: QUESTION_TO_TRAINING_MAP[question.id],
        dueDate: addDays(new Date(), 7),
        reason: 'Critical quality failure - auto-assigned'
      });
    }

    // Create coaching appointment
    await gcApi.post('/api/v2/coaching/appointments', {
      facilitatorId: evaluation.evaluatorId,
      attendeeIds: [agent],
      conversationIds: [evaluation.conversationId],
      description: 'Critical failure review - mandatory'
    });
  }
}`}</CodeBlock>
    </section>

    {/* T3S5 */}
    <section ref={el => sectionRefs.current['t3s5'] = el} id="t3s5">
      <SectionHeading>Compliance & Legal Considerations</SectionHeading>
      <Paragraph>Recording and quality management intersect with significant legal and regulatory requirements. Getting this wrong can result in lawsuits, fines, and criminal liability. Always consult with your legal team.</Paragraph>
      <div className="space-y-3 my-4">
        {COMPLIANCE_TOPICS.map((topic, i) => (
          <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <span className="font-bold text-sm" style={{ color: C.t1, fontFamily: MONO }}>{topic.topic}</span>
              <span className="text-[10px] px-2 py-0.5 rounded font-bold" style={{
                backgroundColor: topic.risk === 'High' ? C.red + '22' : topic.risk === 'Medium' ? C.yellow + '22' : C.green + '22',
                color: topic.risk === 'High' ? C.red : topic.risk === 'Medium' ? C.yellow : C.green,
              }}>Risk: {topic.risk}</span>
            </div>
            <div className="text-xs" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.6 }}>{topic.desc}</div>
          </div>
        ))}
      </div>
      <CalloutBox type="critical">
        <strong>IMPORTANT:</strong> This guide provides general information about compliance topics. It is NOT legal advice. Recording laws vary by jurisdiction and change frequently. Always consult with qualified legal counsel to determine the specific requirements for your organization, industry, and geographic regions.
      </CalloutBox>
    </section>

    {/* T3S6 */}
    <section ref={el => sectionRefs.current['t3s6'] = el} id="t3s6">
      <SectionHeading>Platform Limits — The Complete Reference</SectionHeading>
      <InteractiveTable searchable headers={['Resource', 'Limit', 'Notes']} rows={PLATFORM_LIMITS} />
    </section>

    {/* T3S7 */}
    <section ref={el => sectionRefs.current['t3s7'] = el} id="t3s7">
      <SectionHeading>Licensing & Feature Matrix</SectionHeading>
      <Paragraph>Quality Management features are distributed across Genesys Cloud license tiers. The following matrix shows which features are available at each level.</Paragraph>
      <InteractiveTable headers={['Feature', 'GC1', 'GC2', 'GC3']} rows={LICENSE_MATRIX} />
      <CalloutBox type="info">
        <strong>WEM Add-on:</strong> Organizations on GC1 or GC2 can purchase the Workforce Engagement Management (WEM) add-on to access GC3-level quality features (speech analytics, AI scoring, sentiment analysis) without upgrading all user licenses to GC3. The WEM add-on is licensed per-user.
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
const GenesysQualityGuide = ({ onBack, isDark: isDarkProp, setIsDark: setIsDarkProp }) => {
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
    return SECTIONS.filter(s => s.title.toLowerCase().includes(q)).slice(0, 8);
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
            <span className="font-bold text-sm hidden sm:block" style={{ fontFamily: MONO, color: C.orange }}>GENESYS QUALITY GUIDE</span>
            <span className="font-bold text-sm sm:hidden" style={{ fontFamily: MONO, color: C.orange }}>GC QUALITY</span>
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
                <div className="absolute right-0 top-10 w-72 rounded-lg shadow-xl p-3 z-50" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
                  <input autoFocus className="w-full px-3 py-2 rounded text-sm mb-2" style={{ backgroundColor: C.bg3, border: `1px solid ${C.border}`, color: C.t1, fontFamily: SANS }} placeholder="Search sections..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                  {searchResults.map(r => (
                    <button key={r.id} onClick={() => { handleTierSwitch(r.tier); setTimeout(() => scrollToSection(r.id), 100); }}
                      className="w-full text-left px-3 py-2 rounded text-xs cursor-pointer transition-colors" style={{ color: C.t2, fontFamily: SANS }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = C.bg3} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: TIER_COLORS[r.tier] }} />
                      {r.title}
                    </button>
                  ))}
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
        <div className="text-xs" style={{ color: C.t3, fontFamily: MONO }}>Genesys Cloud Quality Management — Interactive Knowledge Guide</div>
        <div className="text-[10px] mt-1" style={{ color: C.bg4 }}>Built with React • Tailwind CSS • lucide-react</div>
      </footer>
    </div>
  );
};

export default GenesysQualityGuide;
