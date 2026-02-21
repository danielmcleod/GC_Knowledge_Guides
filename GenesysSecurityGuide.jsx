import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Shield, Settings, Cpu, Search, ChevronDown, ChevronUp, ChevronRight,
  Menu, X, Phone, Mail, MessageSquare, Bell, RefreshCw, CheckCircle,
  AlertTriangle, AlertCircle, Info, Lightbulb, Star, ExternalLink,
  BookOpen, ArrowRight, ArrowDown, ArrowLeft, Circle, Zap, Clock, Users,
  FileText, Database, Activity, BarChart3, Target, Monitor,
  Hash, Layers, Eye, Sun, Moon, Lock, Unlock, Key, UserCheck, Globe, Filter,
  Rocket
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
  'The Big Picture — Why Security Matters and How Genesys Cloud Protects You',
  'Hands-On — Configuring Roles, Auth, Encryption, and Compliance Controls',
  'Under the Hood — Architecture, Regulations, APIs, and Edge Cases',
];
const TIER_AUDIENCES = [
  'For everyone — no experience needed',
  'For administrators & security teams',
  'For engineers, architects & compliance officers',
];
const TIER_ICONS_KEYS = ['Rocket', 'Settings', 'Cpu'];

// ══════════════════════════════════════════════════════════════
// SECTION METADATA (all tiers)
// ══════════════════════════════════════════════════════════════
const SECTIONS = [
  { tier: 0, id: 't1s1', title: 'Why Security Matters in a Contact Center' },
  { tier: 0, id: 't1s2', title: 'The Security Building Blocks' },
  { tier: 0, id: 't1s3', title: 'The Security Layers — Defense in Depth' },
  { tier: 0, id: 't1s4', title: 'Compliance Frameworks Overview' },
  { tier: 0, id: 't1s5', title: 'Key Terminology Glossary' },
  { tier: 1, id: 't2s1', title: 'Prerequisites — What You Need Before Configuring Security' },
  { tier: 1, id: 't2s2', title: 'Roles & Permissions — Controlling Who Can Do What' },
  { tier: 1, id: 't2s3', title: 'Divisions — Data Access Control' },
  { tier: 1, id: 't2s4', title: 'Authentication — SSO, OAuth & MFA' },
  { tier: 1, id: 't2s5', title: 'SCIM & Directory Sync' },
  { tier: 1, id: 't2s6', title: 'Encryption & Data Protection' },
  { tier: 1, id: 't2s7', title: 'Audit Logging & Monitoring' },
  { tier: 1, id: 't2s8', title: 'PCI Compliance — Secure Handling of Payment Data' },
  { tier: 2, id: 't3s1', title: 'Platform Security Architecture' },
  { tier: 2, id: 't3s2', title: 'HIPAA Configuration' },
  { tier: 2, id: 't3s3', title: 'GDPR & Data Privacy' },
  { tier: 2, id: 't3s4', title: 'API Security' },
  { tier: 2, id: 't3s5', title: 'Edge & Telephony Security' },
  { tier: 2, id: 't3s6', title: 'Platform Limits — Security Resources' },
  { tier: 2, id: 't3s7', title: 'Licensing & Feature Matrix' },
  { tier: 2, id: 't3s8', title: 'Troubleshooting Security Issues' },
];

// ══════════════════════════════════════════════════════════════
// T1 DATA
// ══════════════════════════════════════════════════════════════
const RISK_SCENARIOS = [
  { icon: 'Lock', label: 'Data Breaches', desc: 'Unauthorized access to customer PII, payment card data, or health records' },
  { icon: 'Users', label: 'Insider Threats', desc: 'Employees accessing data beyond their role or exfiltrating customer information' },
  { icon: 'Globe', label: 'Regulatory Fines', desc: 'Non-compliance with PCI DSS, HIPAA, or GDPR leading to multi-million-dollar penalties' },
  { icon: 'AlertTriangle', label: 'Social Engineering', desc: 'Phishing attacks targeting agents or admins to gain system credentials' },
  { icon: 'Activity', label: 'Service Disruption', desc: 'DDoS attacks or unauthorized configuration changes causing outages' },
  { icon: 'Eye', label: 'Eavesdropping', desc: 'Unencrypted voice/data streams intercepted during transmission' },
];

const SECURITY_BLOCKS = [
  { id: 'roles', label: 'ROLES', sub: 'What you can do', x: 130, y: 80 },
  { id: 'permissions', label: 'PERMISSIONS', sub: 'Granular actions', x: 400, y: 60 },
  { id: 'divisions', label: 'DIVISIONS', sub: 'What you can see', x: 670, y: 80 },
  { id: 'oauth', label: 'OAUTH', sub: 'API auth', x: 80, y: 250 },
  { id: 'sso', label: 'SSO / SAML', sub: 'Single sign-on', x: 80, y: 400 },
  { id: 'encryption', label: 'ENCRYPTION', sub: 'Data protection', x: 720, y: 250 },
  { id: 'audit', label: 'AUDIT LOGS', sub: 'Who did what', x: 720, y: 400 },
  { id: 'edge', label: 'EDGE SECURITY', sub: 'Telephony protection', x: 400, y: 500 },
];
const BLOCK_CENTER = { x: 400, y: 280 };

const BLOCK_TOOLTIPS = {
  roles: { explanation: 'A named set of permissions assigned to users — like Admin, Supervisor, or Agent. Determines the actions a user can perform.', analogy: 'Your job title at a bank' },
  permissions: { explanation: 'Individual capabilities within the platform — e.g., "view recordings," "edit queues," "delete users." Hundreds of granular permissions exist.', analogy: 'The specific keys on your keychain' },
  divisions: { explanation: 'Logical partitions of your organization\'s data. Users only see objects in their assigned divisions. A role grants permissions; a division limits scope.', analogy: 'Departments in a building — your badge only opens certain floors' },
  oauth: { explanation: 'The authentication standard used for API and integration access. Supports client credentials, implicit, and authorization code grant types.', analogy: 'A temporary visitor badge issued at the front desk' },
  sso: { explanation: 'Single Sign-On using SAML 2.0 — users log in once via your identity provider (Okta, Azure AD, etc.) and are automatically authenticated in Genesys Cloud.', analogy: 'Using your corporate badge to enter any building in the campus' },
  encryption: { explanation: 'All data is encrypted in transit (TLS 1.2+) and at rest (AES-256). Recording encryption uses AWS KMS with optional customer-managed keys (BYOK).', analogy: 'Every document in the vault is written in code only authorized people can read' },
  audit: { explanation: 'Every significant action is logged: login events, configuration changes, data access, permission changes. Logs are retained for up to 2 years and can be exported.', analogy: 'Security cameras recording every door that opens and who walked through' },
  edge: { explanation: 'Edge appliances use certificate-based mutual TLS, SIP TLS/SRTP for voice encryption, and secure boot processes to protect the telephony layer.', analogy: 'The armored truck that carries the cash — secured at every step of the journey' },
};

const SECURITY_LAYERS = [
  { name: 'Physical Security', icon: 'Database', color: C.orange, items: ['AWS global infrastructure — SOC 2 certified data centers', 'Multi-region deployment with automatic failover', 'Physical access controlled by AWS with biometric scanning', 'Hardware destruction on decommission'] },
  { name: 'Network Security', icon: 'Globe', color: C.blue, items: ['Virtual Private Cloud (VPC) isolation per microservice', 'TLS 1.2+ enforced on all connections', 'AWS Shield for DDoS protection', 'Web Application Firewall (WAF) for HTTP layer', 'Network segmentation between services', 'Private endpoints for internal communication'] },
  { name: 'Application Security', icon: 'Lock', color: C.green, items: ['Role-Based Access Control (RBAC) with granular permissions', 'SAML 2.0 SSO with multi-factor authentication', 'OAuth 2.0 for API authentication', 'Session management with configurable timeout', 'CSRF and XSS protections built into the platform'] },
  { name: 'Data Security', icon: 'Shield', color: C.purple, items: ['AES-256 encryption at rest for all stored data', 'TLS 1.2+ encryption in transit for all data flows', 'AWS KMS key management with optional BYOK', 'Recording encryption with separate key management', 'PII redaction capabilities in analytics', 'Configurable data retention policies'] },
  { name: 'Operational Security', icon: 'Eye', color: C.red, items: ['Comprehensive audit logging of all actions', 'Real-time monitoring and alerting', 'Automated vulnerability scanning', 'Regular third-party penetration testing', 'Change management controls', 'Incident response procedures'] },
];

const COMPLIANCE_FRAMEWORKS = [
  { name: 'PCI DSS', full: 'Payment Card Industry Data Security Standard', who: 'Any organization handling credit card data', status: 'Level 1 Service Provider (highest level)', covers: 'Secure handling, storage, and transmission of cardholder data. 12 requirement categories covering network security, encryption, access control, monitoring, and testing.' },
  { name: 'HIPAA', full: 'Health Insurance Portability and Accountability Act', who: 'Healthcare providers, insurers, and their business associates', status: 'BAA available — Genesys signs Business Associate Agreements', covers: 'Protection of Protected Health Information (PHI) including medical records, treatment history, and insurance information. Administrative, physical, and technical safeguards.' },
  { name: 'GDPR', full: 'General Data Protection Regulation', who: 'Any organization processing data of EU/EEA residents', status: 'Compliant — Data Processing Agreement available', covers: 'Individual rights (access, erasure, portability), consent management, data minimization, breach notification within 72 hours, cross-border transfer protections.' },
  { name: 'SOC 2', full: 'Service Organization Control 2', who: 'Any organization requiring trust assurance from vendors', status: 'Type II certified — annual audit', covers: 'Five trust service criteria: Security, Availability, Processing Integrity, Confidentiality, and Privacy. Independent auditor validates controls over a 12-month period.' },
  { name: 'ISO 27001', full: 'Information Security Management Systems', who: 'Organizations requiring international security certification', status: 'Certified — annual surveillance audits', covers: 'Comprehensive information security management framework covering 114 controls across 14 domains including risk assessment, access control, cryptography, and incident management.' },
  { name: 'FedRAMP', full: 'Federal Risk and Authorization Management Program', who: 'US federal government agencies and contractors', status: 'Authorized (Genesys Cloud for Government)', covers: 'Standardized approach to security assessment for cloud services used by federal agencies. Based on NIST SP 800-53 controls. Requires continuous monitoring.' },
];

const GLOSSARY = [
  { term: 'RBAC', def: 'Role-Based Access Control — granting permissions based on a user\'s assigned role rather than individual user accounts', tier: 'Tier 1' },
  { term: 'Division', def: 'A logical partition of organizational data that limits which objects (queues, users, flows) a user can access', tier: 'Tier 2' },
  { term: 'Permission', def: 'A granular capability such as "routing:queue:view" that allows a specific action on a specific resource type', tier: 'Tier 2' },
  { term: 'Role', def: 'A named collection of permissions assigned to users — built-in (Admin, Agent) or custom-created', tier: 'Tier 2' },
  { term: 'OAuth 2.0', def: 'An authorization framework that enables secure API access using tokens rather than credentials', tier: 'Tier 2' },
  { term: 'SSO', def: 'Single Sign-On — authenticating once via an identity provider to access multiple applications', tier: 'Tier 2' },
  { term: 'SAML 2.0', def: 'Security Assertion Markup Language — the XML-based protocol used for SSO between IdP and Genesys Cloud', tier: 'Tier 2' },
  { term: 'SCIM', def: 'System for Cross-domain Identity Management — automated user provisioning/deprovisioning protocol', tier: 'Tier 2' },
  { term: 'MFA', def: 'Multi-Factor Authentication — requiring two or more verification factors (password + phone/app code)', tier: 'Tier 2' },
  { term: 'TLS', def: 'Transport Layer Security — cryptographic protocol ensuring data is encrypted during transmission (in transit)', tier: 'Tier 1' },
  { term: 'Encryption at Rest', def: 'Data stored on disk (databases, recordings, logs) is encrypted using AES-256 so it cannot be read without the key', tier: 'Tier 1' },
  { term: 'PII', def: 'Personally Identifiable Information — data that can identify an individual (name, SSN, phone number, email)', tier: 'Tier 1' },
  { term: 'PCI DSS', def: 'Payment Card Industry Data Security Standard — requirements for organizations handling credit card data', tier: 'Tier 1' },
  { term: 'HIPAA BAA', def: 'Business Associate Agreement — a contract required by HIPAA between a covered entity and a vendor handling PHI', tier: 'Tier 3' },
  { term: 'GDPR', def: 'General Data Protection Regulation — EU law governing personal data privacy and individual rights', tier: 'Tier 1' },
  { term: 'Audit Trail', def: 'A chronological record of all system activities including who performed what action and when', tier: 'Tier 2' },
  { term: 'Data Retention', def: 'Policies defining how long different types of data are kept before automatic deletion', tier: 'Tier 2' },
  { term: 'BYOK', def: 'Bring Your Own Key — using customer-managed encryption keys instead of Genesys-managed keys in AWS KMS', tier: 'Tier 3' },
  { term: 'SRTP', def: 'Secure Real-time Transport Protocol — encryption for voice media streams between endpoints', tier: 'Tier 3' },
  { term: 'WAF', def: 'Web Application Firewall — filters and monitors HTTP traffic to protect against web exploits', tier: 'Tier 3' },
];

// ══════════════════════════════════════════════════════════════
// T2 DATA
// ══════════════════════════════════════════════════════════════
const PREREQUISITES = [
  { title: 'Organization Setup Complete', detail: 'Your Genesys Cloud organization must be provisioned and operational. You need a valid subscription with at least one admin user. Verify your region selection — data residency is determined at org creation and cannot be changed. Available regions include US East, US West, EU (Frankfurt, Ireland, London), AP (Sydney, Tokyo, Mumbai), Canada, and South America.' },
  { title: 'Admin Access Confirmed', detail: 'You need the Master Admin role or a custom role with admin-level permissions across Directory, Authorization, and OAuth domains. The initial org admin is set during provisioning. It is strongly recommended to have at least two admin accounts for recovery scenarios (if one is locked out or compromised).' },
  { title: 'Identity Provider Selected', detail: 'Decide on your authentication strategy: Genesys Cloud native authentication, or SSO via SAML 2.0 with an external Identity Provider (IdP) such as Okta, Azure AD, PingFederate, ADFS, or OneLogin. If using SSO, ensure your IdP is configured and you have admin access to create SAML applications.' },
  { title: 'Directory Integration Planned', detail: 'Determine how users will be provisioned: manual creation, CSV import, SCIM automated provisioning (Azure AD, Okta), or Active Directory sync. SCIM is recommended for organizations with 50+ users as it automates user lifecycle management including creation, updates, and deactivation.' },
  { title: 'Compliance Requirements Identified', detail: 'Document which compliance frameworks apply to your organization: PCI DSS (handling payment data), HIPAA (handling health information), GDPR (EU citizen data), SOC 2 (vendor trust), FedRAMP (US government). Each framework has specific configuration requirements that should be planned before deployment.' },
  { title: 'Network & Firewall Configuration', detail: 'Ensure required ports and domains are whitelisted in your corporate firewall. Genesys Cloud requires HTTPS (443) for all API and web traffic, WebRTC ports (16384-65535 UDP) for media, and access to *.mypurecloud.com / *.use2.us-gov-pure.cloud domains. Refer to the Genesys Cloud network requirements documentation for the complete list of IPs and ports.' },
];

const SETUP_SEQUENCE = ['Identity Provider', 'SSO/SAML', 'SCIM', 'Divisions', 'Roles', 'Users', 'MFA', 'Encryption', 'Audit Config'];

const BUILT_IN_ROLES = [
  { name: 'Admin', scope: 'Full access to all administrative functions', risk: 'Highest — can modify all security settings', recommendation: 'Limit to 2-3 trusted individuals' },
  { name: 'Master Admin', scope: 'Admin + org-level settings (billing, region, integrations)', risk: 'Critical — can change org configuration', recommendation: 'Limit to 1-2 individuals, use for break-glass only' },
  { name: 'Supervisor', scope: 'Queue management, agent monitoring, quality management', risk: 'Medium — can view agent interactions and recordings', recommendation: 'Assign per division to limit scope' },
  { name: 'Agent', scope: 'Handle interactions, view assigned queues, access scripts', risk: 'Low — limited to operational actions', recommendation: 'Default for frontline staff' },
  { name: 'Communicate User', scope: 'Chat, video, directory access', risk: 'Low — collaboration features only', recommendation: 'For non-contact-center staff' },
];

const PERMISSION_CATEGORIES = [
  { category: 'Directory', examples: 'user:add, user:edit, user:view, user:delete, group:add', count: '40+' },
  { category: 'Authorization', examples: 'role:add, role:edit, division:add, division:edit, grant:add', count: '20+' },
  { category: 'Routing', examples: 'queue:add, queue:view, queue:edit, flow:add, flow:view', count: '30+' },
  { category: 'Analytics', examples: 'conversationDetail:view, userDetail:view, dashboardConfigurations:edit', count: '25+' },
  { category: 'Quality', examples: 'evaluation:add, calibration:add, recording:view, recording:delete', count: '20+' },
  { category: 'Outbound', examples: 'campaign:add, contactList:view, dncList:add, ruleset:edit', count: '30+' },
  { category: 'Architect', examples: 'flow:add, flow:edit, flow:view, datatable:add, emergencyGroup:edit', count: '15+' },
  { category: 'Integrations', examples: 'integration:add, action:execute, credential:view', count: '10+' },
];

const OAUTH_GRANTS = [
  { type: 'Client Credentials', flow: 'Server-to-server (no user context)', use: 'Backend integrations, data sync, automated tasks', security: 'Client ID + Secret stored server-side. No user impersonation. Scoped by OAuth client roles.', risk: 'Medium — if secret is leaked, attacker has API access until rotated' },
  { type: 'Authorization Code', flow: 'User-delegated access (3-legged)', use: 'Web applications where users log in and grant access', security: 'User authenticates via browser redirect. Short-lived auth code exchanged for tokens. Refresh tokens supported.', risk: 'Low — user must actively consent, tokens are short-lived' },
  { type: 'Implicit Grant', flow: 'Browser-based (no server)', use: 'Single-page applications (SPAs), client-side JS apps', security: 'Token returned directly to browser. No refresh tokens. Short-lived access token only. PKCE recommended.', risk: 'Higher — token exposed in browser. Use PKCE and short expiry.' },
  { type: 'SAML2 Bearer', flow: 'SAML assertion exchange', use: 'Systems already using SAML that need API access', security: 'Exchanges a SAML assertion from your IdP for a Genesys Cloud access token.', risk: 'Low — relies on existing SAML trust relationship' },
];

const SCIM_FEATURES = [
  { feature: 'User Provisioning', desc: 'Automatically create Genesys Cloud users when added to your IdP (Azure AD, Okta). Maps first name, last name, email, phone, department, title, and manager.' },
  { feature: 'User Deprovisioning', desc: 'Automatically deactivate users removed from IdP groups. User is disabled (not deleted) — preserving audit trail and historical data. Licenses are freed immediately.' },
  { feature: 'Attribute Sync', desc: 'Bidirectional or one-way sync of user attributes. Changes in IdP propagate to Genesys Cloud within minutes. Supports custom attribute mapping.' },
  { feature: 'Group Sync', desc: 'Map IdP groups to Genesys Cloud groups. Used for automatic queue membership, skill assignment, and division placement.' },
  { feature: 'Supported IdPs', desc: 'Azure AD (native SCIM connector), Okta (native SCIM connector), PingFederate, OneLogin, and any SCIM 2.0 compliant provider via generic connector.' },
];

const ENCRYPTION_DETAILS = [
  { layer: 'Data in Transit', method: 'TLS 1.2+ (TLS 1.3 supported)', scope: 'All API calls, web traffic, WebSocket connections, inter-service communication', note: 'Older protocols (TLS 1.0/1.1, SSL) are rejected. Perfect Forward Secrecy (PFS) enforced.' },
  { layer: 'Data at Rest', method: 'AES-256', scope: 'All databases, object storage (S3), recording files, log archives', note: 'AWS-managed keys by default. Customer-managed keys (BYOK) available via AWS KMS.' },
  { layer: 'Voice Media', method: 'SRTP (AES-128)', scope: 'Real-time voice streams between endpoints and Genesys Cloud', note: 'SRTP is enforced when using Genesys Cloud Voice. BYOC requires SIP TLS + SRTP configuration.' },
  { layer: 'Recordings', method: 'AES-256 with per-org keys', scope: 'All call recordings, screen recordings, and digital interaction transcripts', note: 'Local Key Manager (LKM) option allows customer-managed keys stored on-premises. Keys rotated on configurable schedule.' },
  { layer: 'PCI Secure Flows', method: 'Isolated encryption boundary', scope: 'Payment data collected via Secure IVR or Secure Flow', note: 'Card data never touches agent desktop or standard Genesys Cloud storage. Processed in isolated PCI-compliant environment.' },
];

const AUDIT_EVENT_TYPES = [
  { category: 'Authentication', events: 'User login (success/failure), SSO assertion, MFA challenge, password change, session timeout, API token issuance' },
  { category: 'Authorization', events: 'Role assignment/removal, division change, permission grant, OAuth client creation/modification' },
  { category: 'Configuration', events: 'Queue create/update/delete, flow publish, integration enable/disable, routing changes, IVR modifications' },
  { category: 'Data Access', events: 'Recording playback, recording download, recording delete, export creation, analytics report generation' },
  { category: 'User Management', events: 'User create/update/delete/disable, group membership changes, station association, phone provisioning' },
  { category: 'Compliance', events: 'Data retention execution, GDPR delete request, PCI secure flow invocation, HIPAA access events' },
];

const PCI_CONTROLS = [
  { control: 'Secure IVR (Architect)', desc: 'Collect card numbers via DTMF tones in an Architect flow. Digits are never displayed to agents, never written to standard logs, and are routed directly to the payment processor. The agent hears silence or comfort tones during entry.', status: 'Built-in' },
  { control: 'Pause/Resume Recording', desc: 'Agent or supervisor manually pauses recording before the customer provides card data, then resumes. Simple but relies on human action — risk of forgetting to pause. Most organizations prefer automated approaches.', status: 'Built-in' },
  { control: 'Secure External Web App', desc: 'An iframe within the agent desktop hosts a PCI-compliant third-party payment page. Card data is entered directly into the external app — Genesys Cloud never sees or stores it.', status: 'Integration' },
  { control: 'Agent Desktop Isolation', desc: 'During PCI secure flows, the agent screen shows masked data (****1234). DTMF tones from the customer are suppressed from the agent audio stream so the agent cannot hear card numbers being entered.', status: 'Built-in' },
  { control: 'Secure Flow (Script Action)', desc: 'The "Invoke Secure Flow" script action triggers a separate Architect secure flow. While active, all recording and screen capture is suspended, and DTMF tones are masked from the agent.', status: 'Built-in' },
];

// ══════════════════════════════════════════════════════════════
// T3 DATA
// ══════════════════════════════════════════════════════════════
const ARCHITECTURE_COMPONENTS = [
  { name: 'AWS Multi-Region', desc: 'Genesys Cloud runs across multiple AWS regions. Each region has independent infrastructure with automatic failover. Customer data is stored within the selected region for data residency compliance. Active-active architecture across availability zones.', color: C.orange },
  { name: 'Microservices Isolation', desc: 'Each platform capability (routing, recording, analytics, etc.) runs as an independent microservice with its own database, network boundary, and scaling. A vulnerability in one service does not automatically compromise others.', color: C.blue },
  { name: 'Network Segmentation', desc: 'VPC isolation between services, security groups limiting inter-service communication to only required ports/protocols. No service has unrestricted network access. East-west traffic is encrypted and monitored.', color: C.green },
  { name: 'DDoS Protection', desc: 'AWS Shield Standard protects against volumetric attacks automatically. AWS Shield Advanced provides additional protection for targeted attacks. CloudFront CDN absorbs traffic spikes at the edge.', color: C.purple },
  { name: 'WAF (Web Application Firewall)', desc: 'Inspects all HTTP/HTTPS traffic for common attack patterns: SQL injection, cross-site scripting (XSS), request forgery, and bot activity. Custom rules block known malicious IPs and patterns.', color: C.red },
  { name: 'Security Groups & NACLs', desc: 'Stateful security groups on every EC2 instance and container restrict traffic to explicitly allowed ports and protocols. Network ACLs provide subnet-level defense as an additional layer.', color: C.yellow },
];

const HIPAA_REQUIREMENTS = [
  { requirement: 'Business Associate Agreement (BAA)', detail: 'Genesys must sign a BAA before any PHI is processed. The BAA defines responsibilities, permitted uses, breach notification obligations, and termination procedures. Request via your Genesys account team.', category: 'Administrative' },
  { requirement: 'Access Controls', detail: 'Implement role-based access with minimum necessary principle. Agents should only see PHI required for their role. Use divisions to segment patient data by department or facility. Enable MFA for all users accessing PHI.', category: 'Technical' },
  { requirement: 'Audit Controls', detail: 'Enable comprehensive audit logging. Monitor access to recordings containing PHI. Set up alerts for unusual access patterns (e.g., an agent accessing 100+ recordings in an hour). Export logs to SIEM for long-term retention (HIPAA requires 6 years).', category: 'Technical' },
  { requirement: 'Transmission Security', detail: 'TLS 1.2+ is enforced by default for all data in transit. SRTP for voice media. Ensure BYOC SIP trunks are configured with TLS and SRTP — unencrypted SIP/RTP would be a HIPAA violation for calls containing PHI.', category: 'Technical' },
  { requirement: 'Recording Controls', detail: 'Implement recording policies that comply with your organization\'s PHI handling procedures. Consider enabling recording encryption with customer-managed keys (BYOK/LKM). Establish retention policies that align with HIPAA\'s 6-year retention requirement.', category: 'Operational' },
  { requirement: 'Secure Messaging', detail: 'If using Genesys Cloud for internal messaging (Collaborate), ensure PHI is not shared in general channels. Use secure chat features and configure message retention appropriately.', category: 'Operational' },
];

const GDPR_RIGHTS = [
  { right: 'Right of Access (Art. 15)', implementation: 'Use the GDPR API endpoint to retrieve all data associated with a data subject. Export includes interaction history, recordings, survey responses, and analytics data. Must respond within 30 days.' },
  { right: 'Right to Erasure (Art. 17)', implementation: 'Submit GDPR delete requests via API or admin UI. Genesys Cloud permanently removes all PII including recordings, transcripts, analytics, and interaction records. Some anonymized analytics data may be retained. Deletion is irreversible.' },
  { right: 'Right to Portability (Art. 20)', implementation: 'Export data in machine-readable format (JSON). Includes interaction records, recording files, quality evaluations, and customer journey data. API supports bulk export.' },
  { right: 'Consent Management', implementation: 'Use external consent management platforms integrated via data actions. Genesys Cloud can check consent status before initiating outbound contact or recording. Architect flows can branch based on consent attributes.' },
  { right: 'Data Retention Policies', implementation: 'Configure per-entity retention policies: recordings (30-730 days), interaction data (25 months default), analytics (25 months), audit logs (2 years). Data is automatically purged after retention period expires.' },
  { right: 'Cross-Border Transfer', implementation: 'Data stays within the selected AWS region by default. For transfers outside EU/EEA, Genesys relies on Standard Contractual Clauses (SCCs) and supplementary measures per Schrems II requirements.' },
];

const API_SECURITY_CONTROLS = [
  { control: 'OAuth Scopes', detail: 'Each API call requires a valid OAuth token with appropriate scopes. Scopes map to permission categories (e.g., "routing:readonly" only allows GET requests on routing endpoints). Tokens without required scopes receive 403 Forbidden.' },
  { control: 'Rate Limiting', detail: 'API rate limits are enforced per OAuth client: 300 requests/minute for standard endpoints, lower limits for resource-intensive operations (e.g., recording export). 429 Too Many Requests returned with Retry-After header.' },
  { control: 'Token Management', detail: 'Access tokens expire after 24 hours (configurable). Refresh tokens available for Authorization Code grant. Token revocation API available for immediate invalidation. All token issuances are audit logged.' },
  { control: 'Webhook Security', detail: 'Outbound webhooks include a cryptographic signature header (X-Genesys-Signature) for payload verification. Configure webhook endpoints to validate signatures before processing. HTTPS required for all webhook URLs.' },
  { control: 'IP Restrictions', detail: 'OAuth clients can be configured with IP address allowlists. API calls from non-allowlisted IPs are rejected. Supports CIDR notation for IP ranges. Recommended for service accounts and server-to-server integrations.' },
  { control: 'API Audit Logging', detail: 'Every API call is logged with: client ID, user ID (if applicable), endpoint, method, response code, IP address, and timestamp. Logs available via audit API and exportable to external SIEM systems.' },
];

const EDGE_SECURITY = [
  { topic: 'Certificate Management', detail: 'Edge appliances use X.509 certificates for mutual TLS authentication with Genesys Cloud. Certificates are automatically provisioned during Edge setup and rotated on a configurable schedule. Expired certificates prevent the Edge from connecting — monitor expiry proactively.' },
  { topic: 'SIP TLS / SRTP', detail: 'Configure SIP trunks to require TLS for signaling and SRTP for media. Without these, voice data is transmitted in cleartext on your network. BYOC premises trunks should always enable "Require Media Encryption" to enforce SRTP. SIP TLS uses port 5061 (vs. unencrypted SIP on 5060).' },
  { topic: 'VPN Considerations', detail: 'Edge appliances connect to Genesys Cloud over the internet using encrypted HTTPS tunnels. A VPN is NOT required and not recommended — it adds latency and complexity. If your security policy mandates VPN, use AWS Direct Connect or a split-tunnel VPN to avoid routing media through the VPN.' },
  { topic: 'BYOC Security', detail: 'BYOC Cloud: SIP trunks connect to Genesys Cloud\'s public SIP proxies — TLS is recommended. IP authentication or digest authentication secures the trunk. BYOC Premises: SIP trunks terminate on local Edge appliances — your network security perimeter applies. Ensure trunks are on a dedicated VLAN with firewall rules.' },
  { topic: 'Secure Boot & Updates', detail: 'Edge appliances run a hardened OS with secure boot. Automatic updates are pushed from Genesys Cloud — they are signed and verified before installation. Manual update mode available for change-controlled environments. Edge logs are encrypted and forwarded to the cloud for centralized monitoring.' },
];

const PLATFORM_LIMITS = [
  ['Custom roles per org', '500', 'Built-in roles do not count toward limit'],
  ['Permissions per role', '~1,000 available', 'No hard limit on assignments per role'],
  ['Divisions per org', '500', 'Default division always exists'],
  ['Roles per user', '25', 'Each role+division combination is one grant'],
  ['OAuth clients per org', '500', ''],
  ['OAuth token lifetime', '24 hours (default)', 'Configurable per client'],
  ['SCIM provisioning rate', '60 users/minute', 'Burst limit for bulk operations'],
  ['Audit log retention', '2 years', 'Exportable for long-term storage'],
  ['Audit log query range', '30 days per query', 'Use date pagination for older data'],
  ['Recording retention', '30–730 days', 'Configurable per policy'],
  ['Interaction data retention', '25 months', 'Default; not configurable for reduction'],
  ['API rate limit (standard)', '300 req/min per client', '429 response when exceeded'],
  ['API rate limit (analytics)', '40 req/min', 'Lower limit for heavy queries'],
  ['GDPR delete processing', '72 hours max', 'Usually completes within 24 hours'],
  ['Password minimum length', '8 characters', 'Configurable up to 24'],
  ['MFA enforcement', 'Per org or per role', 'TOTP and SMS supported'],
  ['SSO certificate validity', '3 years typical', 'Monitor for expiry'],
  ['IP allowlist entries per OAuth client', '50', ''],
  ['Concurrent sessions per user', 'Unlimited', 'But audited'],
  ['Login attempt lockout', '5 failed attempts', '15-minute lockout duration'],
];

const LICENSE_MATRIX = [
  ['Role-Based Access Control (RBAC)', true, true, true],
  ['Divisions (data access control)', true, true, true],
  ['SAML 2.0 SSO', true, true, true],
  ['Multi-Factor Authentication (MFA)', true, true, true],
  ['OAuth 2.0 API authentication', true, true, true],
  ['TLS 1.2+ encryption in transit', true, true, true],
  ['AES-256 encryption at rest', true, true, true],
  ['Audit logging', true, true, true],
  ['SCIM directory sync', true, true, true],
  ['Recording encryption', true, true, true],
  ['Customer-managed keys (BYOK)', 'add-on', 'add-on', true],
  ['Local Key Manager (LKM)', 'add-on', 'add-on', true],
  ['PCI DSS secure flows', true, true, true],
  ['HIPAA BAA availability', true, true, true],
  ['GDPR subject rights API', true, true, true],
  ['FedRAMP (Gov Cloud)', false, false, 'Separate offering'],
  ['Advanced audit exports', true, true, true],
  ['IP allowlisting for OAuth', true, true, true],
];

const TROUBLESHOOTING = [
  { symptom: 'SSO login fails — "Invalid SAML Response"', investigation: 'Check: SAML certificate expiry (most common cause) → Verify Issuer URL matches exactly between IdP and Genesys Cloud → Confirm ACS URL is correct (https://login.{region}.pure.cloud/saml) → Check clock skew between IdP server and Genesys (must be < 5 minutes) → Verify NameID format matches configuration (email vs. persistent) → Test with SAML tracer browser extension to inspect the assertion.' },
  { symptom: 'User gets "Permission Denied" error', investigation: 'Check: Does the user have the correct role assigned? → Is the role assigned in the correct division? (A role in Division A does not grant access to objects in Division B) → Is the specific permission included in the role? (Check Admin → People → [User] → Roles tab) → Was the role recently changed? (Changes propagate within seconds, but the user may need to refresh their browser).' },
  { symptom: 'Division access issues — user can\'t see expected objects', investigation: 'Check: Which division is the object in? (Admin → Objects → look for Division column) → Does the user have a role in THAT division? → Does the user need "All Divisions" access? → Is the object in the Home division and the user only has access to a sub-division? → For queues: users need both the routing permission AND division access to see a queue.' },
  { symptom: 'Audit log gaps — expected events missing', investigation: 'Check: Audit logs have a slight delay (up to 15 minutes) → Ensure you are searching the correct date range (logs are UTC-based) → Some actions generate events under unexpected categories (e.g., a flow publish shows under Architect, not Configuration) → API-driven changes may log under the OAuth client name rather than a user name → Export and search logs via the API for more comprehensive results.' },
  { symptom: 'OAuth token not working — 401 Unauthorized', investigation: 'Check: Is the token expired? (Default 24h lifetime) → Was the OAuth client deleted or disabled? → Do the client\'s assigned roles include the required permissions? → Is the request hitting the correct region endpoint? (e.g., api.mypurecloud.com for US East, api.mypurecloud.ie for EU Ireland) → Is the client IP-restricted and the request coming from a non-allowlisted IP?' },
  { symptom: 'MFA not prompting users', investigation: 'Check: Is MFA enforced at the org level or only for specific roles? → SSO users: MFA should be enforced at the IdP, not in Genesys Cloud → Native auth users: verify MFA policy is enabled in Admin → Security → Authentication → Users may need to sign out and back in for policy changes to take effect.' },
  { symptom: 'Recording encryption key issues', investigation: 'Check: For BYOK/LKM — is the key accessible? (Network/firewall issues can block key retrieval) → Has the key been rotated and old recordings need the previous key? → Is the KMS key policy granting Genesys Cloud access? → For LKM — is the on-premises key management server online and reachable? → Contact Genesys support with the org ID and recording IDs for investigation.' },
];

// ══════════════════════════════════════════════════════════════
// SEARCH INDEX
// ══════════════════════════════════════════════════════════════
const SEARCH_INDEX = (() => {
  const idx = [];
  SECTIONS.forEach(s => idx.push({ text: s.title, label: s.title, sectionId: s.id, tier: s.tier, type: 'Section' }));
  RISK_SCENARIOS.forEach(r => idx.push({ text: `${r.label} ${r.desc}`, label: r.label, sectionId: 't1s1', tier: 0, type: 'Risk' }));
  SECURITY_BLOCKS.forEach(b => idx.push({ text: `${b.label} ${b.sub}`, label: b.label, sectionId: 't1s2', tier: 0, type: 'Building Block' }));
  Object.entries(BLOCK_TOOLTIPS).forEach(([k, v]) => {
    const node = SECURITY_BLOCKS.find(n => n.id === k);
    idx.push({ text: `${node?.label || k} ${v.explanation} ${v.analogy}`, label: node?.label || k, sectionId: 't1s2', tier: 0, type: 'Building Block' });
  });
  SECURITY_LAYERS.forEach(l => idx.push({ text: `${l.name} ${l.items.join(' ')}`, label: l.name, sectionId: 't1s3', tier: 0, type: 'Security Layer' }));
  COMPLIANCE_FRAMEWORKS.forEach(f => idx.push({ text: `${f.name} ${f.full} ${f.who} ${f.status} ${f.covers}`, label: `${f.name} - ${f.full}`, sectionId: 't1s4', tier: 0, type: 'Compliance' }));
  GLOSSARY.forEach(g => idx.push({ text: `${g.term} ${g.def} ${g.tier}`, label: g.term, sectionId: 't1s5', tier: 0, type: 'Glossary' }));
  PREREQUISITES.forEach(p => idx.push({ text: `${p.title} ${p.detail}`, label: p.title, sectionId: 't2s1', tier: 1, type: 'Prerequisite' }));
  BUILT_IN_ROLES.forEach(r => idx.push({ text: `${r.name} ${r.scope} ${r.risk} ${r.recommendation}`, label: r.name, sectionId: 't2s2', tier: 1, type: 'Role' }));
  PERMISSION_CATEGORIES.forEach(p => idx.push({ text: `${p.category} ${p.examples} ${p.count}`, label: p.category, sectionId: 't2s2', tier: 1, type: 'Permission' }));
  OAUTH_GRANTS.forEach(g => idx.push({ text: `${g.type} ${g.flow} ${g.use} ${g.security} ${g.risk}`, label: g.type, sectionId: 't2s4', tier: 1, type: 'OAuth Grant' }));
  SCIM_FEATURES.forEach(f => idx.push({ text: `${f.feature} ${f.desc}`, label: f.feature, sectionId: 't2s5', tier: 1, type: 'SCIM' }));
  ENCRYPTION_DETAILS.forEach(e => idx.push({ text: `${e.layer} ${e.method} ${e.scope} ${e.note}`, label: e.layer, sectionId: 't2s6', tier: 1, type: 'Encryption' }));
  AUDIT_EVENT_TYPES.forEach(a => idx.push({ text: `${a.category} ${a.events}`, label: a.category, sectionId: 't2s7', tier: 1, type: 'Audit Event' }));
  PCI_CONTROLS.forEach(c => idx.push({ text: `${c.control} ${c.desc} ${c.status}`, label: c.control, sectionId: 't2s8', tier: 1, type: 'PCI Control' }));
  ARCHITECTURE_COMPONENTS.forEach(c => idx.push({ text: `${c.name} ${c.desc}`, label: c.name, sectionId: 't3s1', tier: 2, type: 'Architecture' }));
  HIPAA_REQUIREMENTS.forEach(r => idx.push({ text: `${r.requirement} ${r.detail} ${r.category}`, label: r.requirement, sectionId: 't3s2', tier: 2, type: 'HIPAA' }));
  GDPR_RIGHTS.forEach(r => idx.push({ text: `${r.right} ${r.implementation}`, label: r.right, sectionId: 't3s3', tier: 2, type: 'GDPR' }));
  API_SECURITY_CONTROLS.forEach(c => idx.push({ text: `${c.control} ${c.detail}`, label: c.control, sectionId: 't3s4', tier: 2, type: 'API Security' }));
  EDGE_SECURITY.forEach(e => idx.push({ text: `${e.topic} ${e.detail}`, label: e.topic, sectionId: 't3s5', tier: 2, type: 'Edge Security' }));
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
// SECURITY BLOCKS SVG (T1S2)
// ══════════════════════════════════════════════════════════════
const SecurityBlocksSVG = () => {
  const [active, setActive] = useState(null);
  return (
    <div className="my-6 overflow-x-auto">
      <svg viewBox="0 0 800 560" className="w-full" style={{ maxWidth: 800, minWidth: 600 }}>
        <defs>
          <filter id="glow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        {SECURITY_BLOCKS.map(n => (
          <line key={`line-${n.id}`} x1={BLOCK_CENTER.x} y1={BLOCK_CENTER.y} x2={n.x} y2={n.y} stroke={C.border} strokeWidth="2" strokeDasharray="6,4" />
        ))}
        <g>
          <rect x={BLOCK_CENTER.x - 90} y={BLOCK_CENTER.y - 30} width={180} height={60} rx={12} fill={C.bg3} stroke={C.green} strokeWidth={2} />
          <text x={BLOCK_CENTER.x} y={BLOCK_CENTER.y - 5} textAnchor="middle" fill={C.t1} fontFamily={MONO} fontSize={13} fontWeight="bold">SECURITY MODEL</text>
          <text x={BLOCK_CENTER.x} y={BLOCK_CENTER.y + 15} textAnchor="middle" fill={C.t3} fontFamily={SANS} fontSize={10}>Defense in depth</text>
        </g>
        {SECURITY_BLOCKS.map(n => {
          const isActive = active === n.id;
          const tooltip = BLOCK_TOOLTIPS[n.id];
          return (
            <g key={n.id} className="cursor-pointer" onClick={() => setActive(isActive ? null : n.id)} style={{ transition: 'transform 0.2s' }}>
              <rect x={n.x - 70} y={n.y - 25} width={140} height={50} rx={8} fill={C.bg2} stroke={isActive ? C.green : C.border} strokeWidth={isActive ? 2 : 1} filter={isActive ? 'url(#glow)' : undefined} />
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
      <SectionHeading>Why Security Matters in a Contact Center</SectionHeading>
      <Paragraph>Contact centers are treasure troves of sensitive data. Every day, agents handle personally identifiable information (PII), payment card numbers, health records, account details, and authentication credentials. A single breach can expose thousands of customers and cost millions in fines, remediation, and reputational damage.</Paragraph>
      <Paragraph>Think of security like the layers of a bank vault. No single lock is enough — you need reinforced walls, a combination lock, a time delay, security cameras, armed guards, and strict access policies all working together. If any one layer fails, the others contain the threat. This principle is called "defense in depth," and it is the foundation of Genesys Cloud's security model.</Paragraph>
      <SubHeading>Key Risk Scenarios</SubHeading>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 my-4">
        {RISK_SCENARIOS.map((r, i) => (
          <div key={i} className="rounded-lg p-4 flex items-start gap-3 transition-all duration-200 hover:-translate-y-0.5" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
            <Shield size={20} style={{ color: C.red, flexShrink: 0 }} />
            <div><div className="font-semibold text-sm" style={{ color: C.t1, fontFamily: MONO }}>{r.label}</div><div className="text-xs mt-1" style={{ color: C.t2, fontFamily: SANS }}>{r.desc}</div></div>
          </div>
        ))}
      </div>
      <SubHeading>The Stakes: Real-World Impact</SubHeading>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        {[
          { title: 'WITHOUT SECURITY', items: ['Customer data exposed in breach', 'Regulatory fines ($100K to $50M+)', 'Loss of customer trust and brand damage', 'Legal liability and lawsuits', 'Business disruption and downtime'], color: C.red },
          { title: 'WITH SECURITY', items: ['Data protected at every layer', 'Compliance certifications maintained', 'Customer confidence preserved', 'Audit-ready documentation', 'Resilient, always-on operations'], color: C.green },
        ].map((panel, i) => (
          <div key={i} className="rounded-lg p-5" style={{ backgroundColor: C.bg2, borderTop: `3px solid ${panel.color}` }}>
            <div className="font-bold mb-3 text-sm" style={{ color: panel.color, fontFamily: MONO }}>{panel.title}</div>
            {panel.items.map((item, j) => <div key={j} className="text-sm mb-1.5" style={{ color: C.t2, fontFamily: SANS }}>{item}</div>)}
          </div>
        ))}
      </div>
      <SubHeading>Types of Sensitive Data in a Contact Center</SubHeading>
      <InteractiveTable headers={['Data Type', 'Examples', 'Applicable Framework']} rows={[
        ['Personal Identifiable Information (PII)', 'Name, address, SSN, email, phone number, date of birth', 'GDPR, SOC 2'],
        ['Payment Card Data', 'Credit/debit card numbers, CVV, expiry date, cardholder name', 'PCI DSS'],
        ['Protected Health Information (PHI)', 'Medical records, diagnoses, prescriptions, insurance details', 'HIPAA'],
        ['Authentication Credentials', 'Passwords, security questions, PINs, account numbers', 'SOC 2, ISO 27001'],
        ['Financial Information', 'Bank account numbers, balances, transaction history', 'PCI DSS, SOC 2'],
        ['Interaction Recordings', 'Call recordings, chat transcripts, screen captures', 'GDPR, HIPAA, PCI DSS'],
        ['Behavioral Data', 'Customer journey, sentiment analysis, interaction history', 'GDPR'],
      ]} />
      <CalloutBox type="critical">
        <strong>The average cost of a data breach in 2024 was $4.88 million (IBM Cost of a Data Breach Report).</strong> For contact centers handling financial or healthcare data, the cost can be significantly higher due to regulatory penalties on top of remediation costs.
      </CalloutBox>
    </section>

    {/* T1S2 */}
    <section ref={el => sectionRefs.current['t1s2'] = el} id="t1s2">
      <SectionHeading>The Security Building Blocks</SectionHeading>
      <Paragraph>Genesys Cloud's security model is built on interconnected components that work together. Just as a campaign needs a contact list, queue, and dialing mode, your security posture needs roles, divisions, authentication, encryption, and auditing all configured correctly.</Paragraph>
      <CalloutBox type="tip">Click any node in the diagram below to see what it does and a simple analogy.</CalloutBox>
      <SecurityBlocksSVG />
      <SubHeading>Component Reference</SubHeading>
      <InteractiveTable
        headers={['Component', 'What It Does', 'Analogy']}
        rows={Object.entries(BLOCK_TOOLTIPS).map(([k, v]) => {
          const node = SECURITY_BLOCKS.find(n => n.id === k);
          return [node?.label || k, v.explanation, v.analogy];
        })}
      />
    </section>

    {/* T1S3 */}
    <section ref={el => sectionRefs.current['t1s3'] = el} id="t1s3">
      <SectionHeading>The Security Layers — Defense in Depth</SectionHeading>
      <Paragraph>Genesys Cloud implements security as a series of concentric layers — like the layers of an onion or a medieval castle with walls within walls. An attacker would need to breach multiple independent defenses to reach sensitive data. This is the "defense in depth" principle in action.</Paragraph>
      <div className="my-6 space-y-0">
        {SECURITY_LAYERS.map((layer, i) => (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: layer.color + '22', color: layer.color, border: `2px solid ${layer.color}`, fontFamily: MONO }}>{i + 1}</div>
              {i < SECURITY_LAYERS.length - 1 && <div className="w-0.5 flex-1 my-1" style={{ backgroundColor: C.border }} />}
            </div>
            <div className="pb-6 flex-1">
              <div className="font-bold text-sm mb-1" style={{ color: layer.color, fontFamily: MONO }}>{layer.name}</div>
              <div className="mt-2 space-y-1 pl-2" style={{ borderLeft: `2px solid ${layer.color}33` }}>
                {layer.items.map((item, j) => <div key={j} className="text-xs" style={{ color: C.t3, fontFamily: SANS }}>• {item}</div>)}
              </div>
            </div>
          </div>
        ))}
      </div>
      <CalloutBox type="info">
        <strong>Why layers matter:</strong> TLS encryption protects data in transit, but if an attacker has valid credentials, TLS alone will not stop them. That is why you also need RBAC (to limit what they can access), divisions (to limit which data they see), MFA (to make credential theft harder), and audit logging (to detect the breach quickly).
      </CalloutBox>
    </section>

    {/* T1S4 */}
    <section ref={el => sectionRefs.current['t1s4'] = el} id="t1s4">
      <SectionHeading>Compliance Frameworks Overview</SectionHeading>
      <Paragraph>Compliance frameworks are standardized sets of security requirements created by governments and industry bodies. They define the minimum security controls your organization must implement to handle specific types of data. Genesys Cloud maintains certifications and compliance for all major frameworks.</Paragraph>
      <div className="space-y-3 my-4">
        {COMPLIANCE_FRAMEWORKS.map((f, i) => (
          <ExpandableCard key={i} title={`${f.name} — ${f.full}`} accent={C.blue}>
            <div className="space-y-2">
              <div><strong style={{ color: C.t1 }}>Who needs it:</strong> {f.who}</div>
              <div><strong style={{ color: C.t1 }}>Genesys Cloud status:</strong> <span style={{ color: C.green }}>{f.status}</span></div>
              <div><strong style={{ color: C.t1 }}>What it covers:</strong> {f.covers}</div>
            </div>
          </ExpandableCard>
        ))}
      </div>
      <CalloutBox type="warning">
        <strong>Shared Responsibility Model:</strong> Genesys Cloud provides the compliant platform, but your organization is responsible for configuring it correctly. Having a PCI-compliant platform does not automatically make your contact center PCI-compliant — you must also follow the configuration guidelines, train your staff, and maintain your own security controls.
      </CalloutBox>
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
  const [activeOAuthTab, setActiveOAuthTab] = useState(0);
  return (
    <div className="space-y-16">
      {/* T2S1 */}
      <section ref={el => sectionRefs.current['t2s1'] = el} id="t2s1">
        <SectionHeading>Prerequisites — What You Need Before Configuring Security</SectionHeading>
        <Paragraph>Before hardening your Genesys Cloud security posture, these foundational elements must be in place. Think of this as preparing the building before you install the security system.</Paragraph>
        <div className="space-y-3 my-4">
          {PREREQUISITES.map((p, i) => (
            <ExpandableCard key={i} title={`${i + 1}. ${p.title}`} accent={C.blue}>
              {p.detail}
            </ExpandableCard>
          ))}
        </div>
        <SubHeading>Recommended Configuration Sequence</SubHeading>
        <div className="flex flex-wrap items-center gap-1 my-4 overflow-x-auto">
          {SETUP_SEQUENCE.map((s, i) => (
            <React.Fragment key={i}>
              <span className="px-3 py-1.5 rounded text-xs whitespace-nowrap" style={{ backgroundColor: C.bg3, color: C.t1, fontFamily: MONO, border: `1px solid ${C.border}` }}>{s}</span>
              {i < SETUP_SEQUENCE.length - 1 && <ArrowRight size={14} style={{ color: C.t3, flexShrink: 0 }} />}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* T2S2 */}
      <section ref={el => sectionRefs.current['t2s2'] = el} id="t2s2">
        <SectionHeading>Roles & Permissions — Controlling Who Can Do What</SectionHeading>
        <Paragraph>Genesys Cloud uses Role-Based Access Control (RBAC) as its primary authorization mechanism. Every action a user takes is checked against their assigned roles and permissions. No role = no access. This is the gatekeeper of your entire platform.</Paragraph>
        <SubHeading>Built-in Roles</SubHeading>
        <div className="space-y-3 my-4">
          {BUILT_IN_ROLES.map((r, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
              <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                <span className="font-bold text-sm" style={{ color: C.t1, fontFamily: MONO }}>{r.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded" style={{ backgroundColor: r.risk.startsWith('Critical') ? C.red + '22' : r.risk.startsWith('Highest') ? C.orange + '22' : r.risk.startsWith('Medium') ? C.yellow + '22' : C.green + '22', color: r.risk.startsWith('Critical') ? C.red : r.risk.startsWith('Highest') ? C.orange : r.risk.startsWith('Medium') ? C.yellow : C.green }}>{r.risk}</span>
              </div>
              <div className="text-xs mb-1" style={{ color: C.t2 }}><strong style={{ color: C.t1 }}>Scope:</strong> {r.scope}</div>
              <div className="text-xs" style={{ color: C.t2 }}><strong style={{ color: C.t1 }}>Recommendation:</strong> {r.recommendation}</div>
            </div>
          ))}
        </div>
        <SubHeading>Permission Categories</SubHeading>
        <InteractiveTable headers={['Category', 'Example Permissions', 'Count']} rows={PERMISSION_CATEGORIES.map(p => [p.category, p.examples, p.count])} />
        <SubHeading>Creating Custom Roles</SubHeading>
        <Paragraph>Custom roles let you build precisely scoped access. Best practice: start with zero permissions and add only what is needed (principle of least privilege). Never clone the Admin role and remove permissions — start empty and build up.</Paragraph>
        <CodeBlock>{`Example: "Quality Analyst" Custom Role
├── Quality > evaluation:add, evaluation:edit, evaluation:view
├── Quality > calibration:add, calibration:view
├── Quality > recording:view (NOT recording:delete)
├── Analytics > conversationDetail:view
├── Analytics > userDetail:view
└── NO routing, directory, outbound, or admin permissions`}</CodeBlock>
        <CalloutBox type="tip">
          <strong>Role + Division = Grant.</strong> A role alone defines WHAT a user can do. A division defines WHERE (which objects) they can do it. The combination of role + division is called a "grant." A user can have multiple grants — for example, "Supervisor" in "Sales Division" AND "Agent" in "Support Division."
        </CalloutBox>
      </section>

      {/* T2S3 */}
      <section ref={el => sectionRefs.current['t2s3'] = el} id="t2s3">
        <SectionHeading>Divisions — Data Access Control</SectionHeading>
        <Paragraph>Divisions are Genesys Cloud's mechanism for limiting which data a user can see and interact with. While roles control WHAT actions are allowed, divisions control WHICH objects those actions apply to. Together, they form a powerful two-dimensional access control model.</Paragraph>
        <SubHeading>How Divisions Work</SubHeading>
        <div className="my-4 p-4 rounded-lg space-y-3" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
          <div className="font-bold text-sm" style={{ color: C.t1, fontFamily: MONO }}>DIVISION MODEL</div>
          <div className="pl-4" style={{ borderLeft: `2px solid ${C.border}` }}>
            {[
              'Every org has a "Home" division (default — cannot be deleted)',
              'New objects are created in the Home division unless specified otherwise',
              'Users, queues, flows, campaigns, management units — all assignable to divisions',
              'A user sees ONLY objects in their assigned division(s)',
              '"All Divisions" access grants visibility across the entire org (use sparingly)',
            ].map((item, i) => (
              <div key={i} className="text-xs mb-1" style={{ color: C.t3, fontFamily: SANS }}>• {item}</div>
            ))}
          </div>
        </div>
        <SubHeading>Division Configuration Example</SubHeading>
        <CodeBlock>{`Organization: "Acme Healthcare"
├── Home Division (default)
│   ├── IT Admin users
│   └── Shared resources (global flows, system queues)
├── Sales Division
│   ├── Sales agents, Sales supervisors
│   ├── Sales queues, Sales campaigns
│   └── Sales contact lists
├── Support Division
│   ├── Support agents, Support supervisors
│   ├── Support queues, Support flows
│   └── Support wrap-up codes
└── HIPAA Division
    ├── Medical staff agents
    ├── PHI-handling queues
    ├── Encrypted recording policies
    └── Restricted access — MFA required`}</CodeBlock>
        <SubHeading>Division Best Practices</SubHeading>
        <div className="space-y-1 my-3">
          {[
            { good: true, text: 'Plan your division structure BEFORE creating users — retrofitting is labor-intensive' },
            { good: true, text: 'Align divisions with business units, regions, or compliance boundaries' },
            { good: true, text: 'Create a dedicated division for sensitive/regulated data (PCI, HIPAA)' },
            { good: true, text: 'Audit Home division monthly — move new objects to correct divisions' },
            { good: true, text: 'Use "All Divisions" access only for IT admins who genuinely need org-wide visibility' },
            { good: true, text: 'Document your division structure and the rationale for each division' },
            { good: false, text: 'Do not use divisions as a substitute for roles — they serve different purposes' },
            { good: false, text: 'Do not create hundreds of divisions — complexity increases exponentially' },
            { good: false, text: 'Do not leave all objects in the Home division — this negates the benefit of divisions' },
          ].map((p, i) => (
            <div key={i} className="text-xs flex items-start gap-2" style={{ color: p.good ? C.green : C.red, fontFamily: SANS }}>
              <span>{p.good ? 'DO' : 'DON\'T'}</span><span style={{ color: C.t2 }}>{p.text}</span>
            </div>
          ))}
        </div>
        <SubHeading>Objects Assignable to Divisions</SubHeading>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 my-3">
          {['Users', 'Queues', 'Flows', 'Campaigns', 'Contact Lists', 'DNC Lists', 'Management Units', 'Business Units', 'Emergency Groups', 'Schedules', 'Schedule Groups', 'Data Tables', 'Scripts', 'Phone Base Settings', 'Trunks', 'IVRs'].map((obj, i) => (
            <div key={i} className="text-xs p-2 rounded text-center" style={{ backgroundColor: C.bg2, color: C.t2, fontFamily: MONO, border: `1px solid ${C.border}` }}>{obj}</div>
          ))}
        </div>
        <CalloutBox type="warning">
          <strong>Common mistake:</strong> Creating divisions but forgetting to move objects out of the Home division. If all queues remain in the Home division, division-based access control provides no benefit. Audit your Home division regularly and ensure objects are in the correct divisions.
        </CalloutBox>
      </section>

      {/* T2S4 */}
      <section ref={el => sectionRefs.current['t2s4'] = el} id="t2s4">
        <SectionHeading>Authentication — SSO, OAuth & MFA</SectionHeading>
        <Paragraph>Authentication is the process of proving identity — answering the question "Who are you?" Genesys Cloud supports multiple authentication methods depending on the use case: SSO for human users, OAuth for applications and APIs, and MFA as an additional layer on top of both.</Paragraph>
        <SubHeading>SAML 2.0 SSO Setup</SubHeading>
        <div className="my-4 p-4 rounded-lg space-y-3" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
          {[
            { step: 1, title: 'Create SAML app in your IdP', desc: 'In Okta/Azure AD/etc., create a new SAML 2.0 application. Set the ACS URL to https://login.{region}.pure.cloud/saml and the Entity ID to the Genesys Cloud org.', color: C.orange },
            { step: 2, title: 'Upload IdP certificate to Genesys Cloud', desc: 'Admin > Integrations > SSO > Upload the X.509 certificate from your IdP. This certificate validates SAML assertions.', color: C.blue },
            { step: 3, title: 'Configure attribute mapping', desc: 'Map IdP attributes to Genesys Cloud fields: email (required), first name, last name, department. The NameID must be the user\'s email address.', color: C.green },
            { step: 4, title: 'Enable SSO and test', desc: 'Enable SSO in admin settings. Test with a non-admin user first. Keep native login enabled as a fallback until SSO is verified working.', color: C.purple },
          ].map((s, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ backgroundColor: s.color + '22', color: s.color, fontFamily: MONO }}>{s.step}</div>
              <div>
                <div className="font-semibold text-sm" style={{ color: C.t1, fontFamily: MONO }}>{s.title}</div>
                <div className="text-xs mt-1" style={{ color: C.t3 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <SubHeading>OAuth 2.0 Grant Types</SubHeading>
        <div className="flex gap-1 mb-3 overflow-x-auto">
          {OAUTH_GRANTS.map((g, i) => (
            <button key={i} className="px-3 py-1.5 rounded text-xs whitespace-nowrap cursor-pointer transition-colors" onClick={() => setActiveOAuthTab(i)} style={{ backgroundColor: activeOAuthTab === i ? C.blue : C.bg3, color: activeOAuthTab === i ? '#fff' : C.t2, fontFamily: MONO }}>{g.type}</button>
          ))}
        </div>
        <div className="p-4 rounded-lg" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
          <div className="space-y-2 text-sm" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.7 }}>
            <div><strong style={{ color: C.t1 }}>Flow:</strong> {OAUTH_GRANTS[activeOAuthTab].flow}</div>
            <div><strong style={{ color: C.t1 }}>Best for:</strong> {OAUTH_GRANTS[activeOAuthTab].use}</div>
            <div><strong style={{ color: C.t1 }}>Security:</strong> {OAUTH_GRANTS[activeOAuthTab].security}</div>
            <div><strong style={{ color: C.t1 }}>Risk level:</strong> <span style={{ color: OAUTH_GRANTS[activeOAuthTab].risk.startsWith('Higher') ? C.yellow : C.green }}>{OAUTH_GRANTS[activeOAuthTab].risk}</span></div>
          </div>
        </div>
        <SubHeading>Multi-Factor Authentication (MFA)</SubHeading>
        <Paragraph>MFA adds a second verification step after password entry. Even if a password is compromised, the attacker cannot log in without the second factor. Genesys Cloud supports TOTP (authenticator apps like Google Authenticator, Microsoft Authenticator) and SMS-based codes.</Paragraph>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          {[
            { title: 'NATIVE AUTH + MFA', items: ['Enable MFA in Admin > Security > Authentication', 'Choose enforcement: All users, specific roles, or optional', 'Users enroll by scanning QR code with authenticator app', 'Recovery codes provided for backup access'], color: C.blue },
            { title: 'SSO + MFA (RECOMMENDED)', items: ['MFA enforced at the Identity Provider level', 'Genesys Cloud defers to IdP\'s MFA policy', 'Supports hardware keys (YubiKey), push notifications, biometrics', 'Centralized MFA management across all applications'], color: C.green },
          ].map((panel, i) => (
            <div key={i} className="rounded-lg p-5" style={{ backgroundColor: C.bg2, borderTop: `3px solid ${panel.color}` }}>
              <div className="font-bold mb-3 text-sm" style={{ color: panel.color, fontFamily: MONO }}>{panel.title}</div>
              {panel.items.map((item, j) => <div key={j} className="text-sm mb-1.5" style={{ color: C.t2, fontFamily: SANS }}>• {item}</div>)}
            </div>
          ))}
        </div>
        <SubHeading>Password Policies</SubHeading>
        <Paragraph>For organizations using native authentication (not SSO), configure password policies under Admin &gt; Security: minimum length (8-24 characters), complexity requirements (uppercase, lowercase, numbers, special characters), password expiry (30-365 days), password history (prevent reuse of last N passwords), and account lockout (configurable attempts and duration).</Paragraph>
      </section>

      {/* T2S5 */}
      <section ref={el => sectionRefs.current['t2s5'] = el} id="t2s5">
        <SectionHeading>SCIM & Directory Sync</SectionHeading>
        <Paragraph>Manual user management does not scale. SCIM (System for Cross-domain Identity Management) automates the entire user lifecycle — creation, updates, and deactivation — by syncing your identity provider with Genesys Cloud. When an employee is hired, they automatically appear in Genesys Cloud. When they leave, their account is automatically disabled.</Paragraph>
        <div className="space-y-3 my-4">
          {SCIM_FEATURES.map((f, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
              <div className="font-semibold text-sm mb-2" style={{ color: C.t1, fontFamily: MONO }}>{f.feature}</div>
              <div className="text-sm" style={{ color: C.t2, fontFamily: SANS }}>{f.desc}</div>
            </div>
          ))}
        </div>
        <SubHeading>Azure AD SCIM Configuration</SubHeading>
        <CodeBlock>{`Azure AD → Enterprise Applications → Genesys Cloud
├── Provisioning Mode: Automatic
├── Tenant URL: https://scim.{region}.pure.cloud/v2
├── Secret Token: OAuth client credentials (Client Credentials grant)
├── Attribute Mapping:
│   ├── userPrincipalName → emails[type eq "work"].value
│   ├── displayName → displayName
│   ├── givenName → name.givenName
│   ├── surname → name.familyName
│   ├── department → urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:department
│   └── jobTitle → title
└── Scope: Sync assigned users and groups only (recommended)`}</CodeBlock>
        <CalloutBox type="warning">
          <strong>Critical:</strong> SCIM deactivates users — it does not delete them. This is by design: deleting a user removes their audit trail, historical analytics, and interaction records. Deactivated users cannot log in but their data is preserved for compliance.
        </CalloutBox>
      </section>

      {/* T2S6 */}
      <section ref={el => sectionRefs.current['t2s6'] = el} id="t2s6">
        <SectionHeading>Encryption & Data Protection</SectionHeading>
        <Paragraph>Encryption transforms readable data into unreadable ciphertext that can only be decoded with the correct key. Genesys Cloud encrypts ALL data — both while it is being transmitted across networks (in transit) and while it is stored on disk (at rest). No exceptions.</Paragraph>
        <div className="space-y-3 my-4">
          {ENCRYPTION_DETAILS.map((e, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, borderLeft: `4px solid ${[C.blue, C.green, C.orange, C.purple, C.red][i % 5]}` }}>
              <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                <span className="font-bold text-sm" style={{ color: C.t1, fontFamily: MONO }}>{e.layer}</span>
                <span className="text-[10px] px-2 py-0.5 rounded" style={{ backgroundColor: C.bg3, color: C.t3 }}>{e.method}</span>
              </div>
              <div className="text-xs mb-1" style={{ color: C.t2 }}><strong>Scope:</strong> {e.scope}</div>
              <div className="text-xs" style={{ color: C.t3 }}>{e.note}</div>
            </div>
          ))}
        </div>
        <SubHeading>Key Management Options</SubHeading>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
          {[
            { title: 'AWS KMS (Default)', desc: 'Genesys manages encryption keys in AWS Key Management Service. No configuration required. Keys are automatically rotated. Suitable for most organizations.', color: C.green },
            { title: 'BYOK (Customer-Managed)', desc: 'You create and manage the master key in your own AWS KMS account. Genesys Cloud uses this key to encrypt data. You retain full control — including the ability to revoke access (which would make data unreadable).', color: C.blue },
            { title: 'LKM (Local Key Manager)', desc: 'Encryption keys are stored on your own on-premises hardware security module (HSM) or key server. The most secure option for organizations requiring full key custody. Keys never leave your premises.', color: C.purple },
          ].map((opt, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
              <div className="font-bold text-sm mb-3" style={{ color: opt.color, fontFamily: MONO }}>{opt.title}</div>
              <div className="text-xs" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.6 }}>{opt.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* T2S7 */}
      <section ref={el => sectionRefs.current['t2s7'] = el} id="t2s7">
        <SectionHeading>Audit Logging & Monitoring</SectionHeading>
        <Paragraph>Every significant action in Genesys Cloud is recorded in the audit log. This creates a tamper-proof trail of who did what, when, and from where. Audit logs are essential for compliance (PCI DSS requires logging all access to cardholder data), incident investigation, and operational monitoring.</Paragraph>
        <SubHeading>Audit Event Categories</SubHeading>
        <div className="space-y-3 my-4">
          {AUDIT_EVENT_TYPES.map((a, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
              <div className="font-semibold text-sm mb-2" style={{ color: C.t1, fontFamily: MONO }}>{a.category}</div>
              <div className="text-sm" style={{ color: C.t2, fontFamily: SANS }}>{a.events}</div>
            </div>
          ))}
        </div>
        <SubHeading>Accessing Audit Logs</SubHeading>
        <div className="space-y-2 my-3">
          {[
            ['Admin UI', 'Admin > Audit > Audit Viewer. Filter by user, date range, entity type, and action. Limited to 30-day query window per search.'],
            ['API Export', 'GET /api/v2/audits/query — programmatic access for custom reporting and SIEM ingestion. Supports pagination for large result sets.'],
            ['SIEM Integration', 'Export audit events to Splunk, Sumo Logic, Datadog, or any SIEM via the Notification API. Subscribe to v2.audits.* topics for real-time streaming.'],
            ['Alert Configuration', 'Set up alert rules for critical events: admin role changes, SSO certificate modifications, mass user deactivation, unusual login patterns.'],
          ].map(([label, desc], i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-1 p-3 rounded" style={{ backgroundColor: C.bg2 }}>
              <span className="text-xs font-semibold whitespace-nowrap min-w-[150px]" style={{ color: C.blue, fontFamily: MONO }}>{label}:</span>
              <span className="text-xs" style={{ color: C.t2, fontFamily: SANS }}>{desc}</span>
            </div>
          ))}
        </div>
        <CalloutBox type="info">
          <strong>Retention:</strong> Audit logs are retained for 2 years within Genesys Cloud. For compliance frameworks requiring longer retention (HIPAA: 6 years, SOX: 7 years), export logs to your own storage via API or SIEM integration.
        </CalloutBox>
      </section>

      {/* T2S8 */}
      <section ref={el => sectionRefs.current['t2s8'] = el} id="t2s8">
        <SectionHeading>PCI Compliance — Secure Handling of Payment Data</SectionHeading>
        <Paragraph>PCI DSS requires that credit card numbers never be stored, displayed, or transmitted in an insecure manner. Genesys Cloud provides multiple mechanisms to handle payment data without exposing it to agents, recordings, or standard logs. The goal: your contact center can process payments while remaining completely out of PCI scope where possible.</Paragraph>
        <SubHeading>PCI Security Controls</SubHeading>
        <div className="space-y-3 my-4">
          {PCI_CONTROLS.map((c, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
              <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                <span className="font-bold text-sm" style={{ color: C.t1, fontFamily: MONO }}>{c.control}</span>
                <span className="text-[10px] px-2 py-0.5 rounded" style={{ backgroundColor: c.status === 'Built-in' ? C.green + '22' : C.blue + '22', color: c.status === 'Built-in' ? C.green : C.blue }}>{c.status}</span>
              </div>
              <div className="text-sm" style={{ color: C.t2, fontFamily: SANS }}>{c.desc}</div>
            </div>
          ))}
        </div>
        <SubHeading>Recommended PCI Architecture</SubHeading>
        <div className="my-4 p-4 rounded-lg" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
          {[
            { indent: 0, text: 'CUSTOMER CALLS IN (or agent calls out)', color: C.green },
            { indent: 1, text: 'Agent handles conversation normally (recorded)', color: C.t2 },
            { indent: 1, text: 'Customer needs to make a payment', color: C.yellow },
            { indent: 2, text: 'Agent clicks "Invoke Secure Flow" in script', color: C.blue },
            { indent: 3, text: 'Recording PAUSES automatically', color: C.red },
            { indent: 3, text: 'DTMF tones MASKED from agent audio', color: C.red },
            { indent: 3, text: 'Agent screen shows "Secure payment in progress"', color: C.t3 },
            { indent: 3, text: 'Architect Secure Flow collects card data via DTMF', color: C.purple },
            { indent: 4, text: 'Card data sent DIRECTLY to payment processor', color: C.green },
            { indent: 4, text: 'Payment processor returns success/failure', color: C.green },
            { indent: 3, text: 'Secure Flow ends — returns result to agent', color: C.blue },
            { indent: 2, text: 'Recording RESUMES automatically', color: C.green },
            { indent: 1, text: 'Agent confirms payment result with customer', color: C.t2 },
          ].map((line, i) => (
            <div key={i} className="text-xs" style={{ paddingLeft: line.indent * 20, color: line.color, fontFamily: MONO, marginBottom: 2 }}>{line.text}</div>
          ))}
        </div>
        <CalloutBox type="critical">
          <strong>Never store full card numbers.</strong> Even in contact list columns, agent notes, or wrap-up code comments. PCI DSS allows storing only the last four digits. Genesys Cloud's secure flows ensure card data never touches standard storage — but agent behavior must also be controlled through training and monitoring.
        </CalloutBox>
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
      <SectionHeading>Platform Security Architecture</SectionHeading>
      <Paragraph>Genesys Cloud runs entirely on Amazon Web Services (AWS) and inherits AWS's world-class physical and infrastructure security. On top of this foundation, Genesys implements multiple layers of application-level security controls that protect customer data and ensure service availability.</Paragraph>
      <div className="space-y-4 my-4">
        {ARCHITECTURE_COMPONENTS.map((comp, i) => (
          <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, borderLeft: `4px solid ${comp.color}` }}>
            <div className="font-bold text-sm mb-2" style={{ color: comp.color, fontFamily: MONO }}>{comp.name}</div>
            <div className="text-sm" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.7 }}>{comp.desc}</div>
          </div>
        ))}
      </div>
      <SubHeading>AWS Regions & Data Residency</SubHeading>
      <InteractiveTable headers={['Region', 'AWS Region', 'Domain']} rows={[
        ['US East (Virginia)', 'us-east-1', 'mypurecloud.com'],
        ['US West (Oregon)', 'us-west-2', 'usw2.pure.cloud'],
        ['Canada (Montreal)', 'ca-central-1', 'cac1.pure.cloud'],
        ['EU Ireland', 'eu-west-1', 'mypurecloud.ie'],
        ['EU Frankfurt', 'eu-central-1', 'mypurecloud.de'],
        ['EU London', 'eu-west-2', 'euw2.pure.cloud'],
        ['AP Sydney', 'ap-southeast-2', 'mypurecloud.com.au'],
        ['AP Tokyo', 'ap-northeast-1', 'mypurecloud.jp'],
        ['AP Mumbai', 'ap-south-1', 'aps1.pure.cloud'],
        ['US Gov (FedRAMP)', 'us-gov-west-1', 'use2.us-gov-pure.cloud'],
      ]} />
      <CalloutBox type="warning">
        <strong>Data residency is permanent.</strong> The region selected during org provisioning determines where all data is stored. It cannot be changed after creation. Choose carefully based on your regulatory requirements (GDPR mandates EU data residency for EU citizen data, for example).
      </CalloutBox>
    </section>

    {/* T3S2 */}
    <section ref={el => sectionRefs.current['t3s2'] = el} id="t3s2">
      <SectionHeading>HIPAA Configuration</SectionHeading>
      <Paragraph>HIPAA compliance in Genesys Cloud requires both a contractual agreement (BAA) and specific technical configuration. The platform provides all necessary controls, but they must be explicitly enabled and properly configured for your organization to be HIPAA-compliant.</Paragraph>
      <div className="space-y-3 my-4">
        {HIPAA_REQUIREMENTS.map((req, i) => (
          <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <span className="font-bold text-sm" style={{ color: C.t1, fontFamily: MONO }}>{req.requirement}</span>
              <span className="text-[10px] px-2 py-0.5 rounded" style={{ backgroundColor: req.category === 'Administrative' ? C.orange + '22' : req.category === 'Technical' ? C.blue + '22' : C.green + '22', color: req.category === 'Administrative' ? C.orange : req.category === 'Technical' ? C.blue : C.green }}>{req.category}</span>
            </div>
            <div className="text-sm" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.7 }}>{req.detail}</div>
          </div>
        ))}
      </div>
      <CalloutBox type="critical">
        <strong>No BAA = No HIPAA compliance.</strong> Without a signed Business Associate Agreement, you cannot legally process PHI through Genesys Cloud. Contact your Genesys account team to initiate the BAA process BEFORE deploying any healthcare-related workloads.
      </CalloutBox>
    </section>

    {/* T3S3 */}
    <section ref={el => sectionRefs.current['t3s3'] = el} id="t3s3">
      <SectionHeading>GDPR & Data Privacy</SectionHeading>
      <Paragraph>The General Data Protection Regulation requires organizations to protect the personal data of EU/EEA residents and provides individuals with specific rights over their data. Genesys Cloud provides APIs and tools to fulfill these obligations.</Paragraph>
      <SubHeading>Data Subject Rights Implementation</SubHeading>
      <div className="space-y-3 my-4">
        {GDPR_RIGHTS.map((r, i) => (
          <ExpandableCard key={i} title={r.right} accent={C.purple}>
            <div className="text-sm" style={{ lineHeight: 1.7 }}>{r.implementation}</div>
          </ExpandableCard>
        ))}
      </div>
      <SubHeading>GDPR API Example</SubHeading>
      <CodeBlock>{`// Submit a GDPR deletion request
POST /api/v2/gdpr/requests
{
  "subject": {
    "name": "John Doe",
    "addresses": [
      { "email": "john.doe@example.com" },
      { "phone": "+14155551234" }
    ]
  },
  "requestType": "GDPR_DELETE",
  "createdBy": {
    "id": "admin-user-uuid",
    "name": "Privacy Officer"
  }
}

// Response: 202 Accepted
// Processing time: typically 24-72 hours
// All PII permanently deleted across all subsystems`}</CodeBlock>
      <SubHeading>Data Retention Configuration</SubHeading>
      <InteractiveTable headers={['Data Type', 'Default Retention', 'Configurable Range', 'GDPR Recommendation']} rows={[
        ['Call Recordings', '30 days', '30–730 days', 'Minimum needed for business purpose'],
        ['Screen Recordings', '30 days', '30–730 days', 'Same as call recordings'],
        ['Interaction Details', '25 months', 'Fixed', 'Cannot reduce — plan disclosure accordingly'],
        ['Analytics Aggregates', '25 months', 'Fixed', 'Anonymized — less privacy risk'],
        ['Audit Logs', '2 years', 'Fixed', 'Legitimate interest for security'],
        ['Quality Evaluations', '25 months', 'Fixed', 'Document purpose and legal basis'],
        ['Transcripts', '25 months', 'Fixed', 'Consider PII redaction features'],
        ['Voicemails', '30 days', '30–730 days', 'Set to minimum needed'],
      ]} />
      <CalloutBox type="info">
        <strong>Privacy by Design:</strong> Configure data retention policies BEFORE going live, not after. Default retention periods may be longer than GDPR requires for your use case. Review recording retention, interaction data retention, and analytics data retention and set them to the minimum period required by your business.
      </CalloutBox>
    </section>

    {/* T3S4 */}
    <section ref={el => sectionRefs.current['t3s4'] = el} id="t3s4">
      <SectionHeading>API Security</SectionHeading>
      <Paragraph>Genesys Cloud exposes a comprehensive REST API for programmatic access. Every API call is authenticated, authorized, rate-limited, and audit-logged. Understanding API security is critical for any integration, automation, or custom application built on the platform.</Paragraph>
      <div className="space-y-3 my-4">
        {API_SECURITY_CONTROLS.map((ctrl, i) => (
          <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
            <div className="font-bold text-sm mb-2" style={{ color: C.t1, fontFamily: MONO }}>{ctrl.control}</div>
            <div className="text-sm" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.7 }}>{ctrl.detail}</div>
          </div>
        ))}
      </div>
      <SubHeading>OAuth Client Best Practices</SubHeading>
      <div className="space-y-1 my-3">
        {[
          { good: true, text: 'Create separate OAuth clients per integration/application (never share clients)' },
          { good: true, text: 'Assign minimum required roles to each OAuth client (principle of least privilege)' },
          { good: true, text: 'Enable IP allowlisting for server-to-server integrations' },
          { good: true, text: 'Rotate client secrets on a regular schedule (quarterly recommended)' },
          { good: true, text: 'Monitor API usage via audit logs for anomalous patterns' },
          { good: true, text: 'Use Authorization Code grant (not Implicit) for web applications when possible' },
          { good: false, text: 'Do not embed client secrets in client-side JavaScript or mobile apps' },
          { good: false, text: 'Do not grant Admin role to OAuth clients — create specific custom roles' },
          { good: false, text: 'Do not disable rate limiting safeguards with aggressive retry logic' },
        ].map((p, i) => (
          <div key={i} className="text-xs flex items-start gap-2" style={{ color: p.good ? C.green : C.red, fontFamily: SANS }}>
            <span>{p.good ? 'DO' : 'DON\'T'}</span><span style={{ color: C.t2 }}>{p.text}</span>
          </div>
        ))}
      </div>
    </section>

    {/* T3S5 */}
    <section ref={el => sectionRefs.current['t3s5'] = el} id="t3s5">
      <SectionHeading>Edge & Telephony Security</SectionHeading>
      <Paragraph>The telephony layer requires special security attention because voice data traverses networks outside of Genesys Cloud's direct control. Whether you use Genesys Cloud Voice, BYOC Cloud, or BYOC Premises, the goal is the same: encrypt signaling, encrypt media, and authenticate endpoints.</Paragraph>
      <div className="space-y-3 my-4">
        {EDGE_SECURITY.map((e, i) => (
          <ExpandableCard key={i} title={e.topic} accent={C.purple}>
            <div className="text-sm" style={{ lineHeight: 1.7 }}>{e.detail}</div>
          </ExpandableCard>
        ))}
      </div>
      <SubHeading>Telephony Security Comparison</SubHeading>
      <InteractiveTable headers={['Feature', 'GC Voice', 'BYOC Cloud', 'BYOC Premises']} rows={[
        ['SIP Encryption', 'TLS (always)', 'TLS (configurable)', 'TLS (configurable)'],
        ['Media Encryption', 'SRTP (always)', 'SRTP (configurable)', 'SRTP (configurable)'],
        ['Certificate Management', 'Automatic', 'Genesys-managed proxy certs', 'Customer-managed Edge certs'],
        ['Network Path', 'Genesys > Carrier (encrypted)', 'Genesys > Your SIP provider', 'Edge > Your SIP provider (local)'],
        ['DDoS Protection', 'AWS Shield', 'AWS Shield', 'Customer responsibility'],
        ['Firewall Control', 'Genesys-managed', 'Genesys + customer', 'Customer-managed'],
      ]} />
      <CalloutBox type="warning">
        <strong>BYOC Premises security is your responsibility.</strong> When using on-premises Edge appliances, the SIP trunk between your Edge and your carrier traverses YOUR network. If you do not enable TLS and SRTP on this trunk, voice calls are transmitted in cleartext — vulnerable to eavesdropping by anyone with network access.
      </CalloutBox>
    </section>

    {/* T3S6 */}
    <section ref={el => sectionRefs.current['t3s6'] = el} id="t3s6">
      <SectionHeading>Platform Limits — Security Resources</SectionHeading>
      <Paragraph>Understanding platform limits is essential for capacity planning and avoiding unexpected errors during security configuration. These limits are enforced by the platform and cannot be changed without a Genesys support request.</Paragraph>
      <InteractiveTable searchable headers={['Resource', 'Limit', 'Notes']} rows={PLATFORM_LIMITS} />
      <CalloutBox type="info">
        <strong>Approaching a limit?</strong> Contact Genesys Cloud support (Genesys Care) to request an increase. Most limits can be raised for enterprise accounts. Include your organization ID, current usage, and business justification in the request.
      </CalloutBox>
    </section>

    {/* T3S7 */}
    <section ref={el => sectionRefs.current['t3s7'] = el} id="t3s7">
      <SectionHeading>Licensing & Feature Matrix</SectionHeading>
      <Paragraph>Most security features are available across all Genesys Cloud license tiers. Advanced key management options (BYOK, LKM) and FedRAMP compliance are available as add-ons or separate offerings.</Paragraph>
      <InteractiveTable headers={['Security Feature', 'GC1', 'GC2', 'GC3']} rows={LICENSE_MATRIX} />
    </section>

    {/* T3S8 */}
    <section ref={el => sectionRefs.current['t3s8'] = el} id="t3s8">
      <SectionHeading>Troubleshooting Security Issues</SectionHeading>
      <Paragraph>Click each symptom to reveal the investigation path.</Paragraph>
      <div className="space-y-3 my-4">
        {TROUBLESHOOTING.map((t, i) => (
          <ExpandableCard key={i} title={t.symptom} accent={C.purple}>
            <div className="text-sm" style={{ lineHeight: 1.7 }}>{t.investigation}</div>
          </ExpandableCard>
        ))}
      </div>
      <SubHeading>Security Hardening Checklist</SubHeading>
      <Paragraph>Use this checklist to verify your Genesys Cloud organization is properly hardened. Each item represents a critical security control.</Paragraph>
      <div className="space-y-2 my-4">
        {[
          { category: 'Authentication', items: ['SSO configured and tested', 'MFA enabled for all users (or enforced at IdP)', 'Native login disabled (SSO-only mode) if SSO is primary', 'Password policy configured with complexity requirements', 'Account lockout policy enabled'] },
          { category: 'Authorization', items: ['Custom roles created following least privilege principle', 'Admin role limited to 2-3 users maximum', 'Divisions configured and objects properly assigned', 'All users reviewed quarterly for appropriate access', 'Unused roles identified and removed'] },
          { category: 'Data Protection', items: ['Recording encryption enabled', 'Key management strategy selected (KMS, BYOK, or LKM)', 'Data retention policies configured per data type', 'PCI secure flows implemented for payment handling', 'GDPR deletion process documented and tested'] },
          { category: 'Monitoring', items: ['Audit log review process established', 'SIEM integration configured for critical events', 'Alert rules created for admin role changes', 'Regular access review schedule documented', 'Incident response plan includes Genesys Cloud procedures'] },
        ].map((section, i) => (
          <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
            <div className="font-bold text-sm mb-2" style={{ color: [C.orange, C.blue, C.green, C.purple][i], fontFamily: MONO }}>{section.category}</div>
            {section.items.map((item, j) => (
              <div key={j} className="text-xs flex items-center gap-2 mb-1" style={{ color: C.t2, fontFamily: SANS }}>
                <div className="w-3 h-3 rounded border flex-shrink-0" style={{ borderColor: C.border }} />
                {item}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  </div>
);

// ══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════
const GenesysSecurityGuide = ({ onBack, isDark: isDarkProp, setIsDark: setIsDarkProp }) => {
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
            <span className="font-bold text-sm hidden sm:block" style={{ fontFamily: MONO, color: C.green }}>GENESYS SECURITY GUIDE</span>
            <span className="font-bold text-sm sm:hidden" style={{ fontFamily: MONO, color: C.green }}>GC SECURITY</span>
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
      <Footer title="Genesys Cloud Security & Compliance — Interactive Knowledge Guide" />
    </div>
  );
};

export default GenesysSecurityGuide;
