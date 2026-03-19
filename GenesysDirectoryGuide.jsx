import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Rocket, Settings, Cpu, Search, ChevronDown, ChevronUp, ChevronRight,
  Menu, X, Phone, Mail, MessageSquare, Bell, RefreshCw, CheckCircle,
  AlertTriangle, AlertCircle, Info, Lightbulb, Star, ExternalLink,
  BookOpen, ArrowRight, ArrowDown, ArrowLeft, Circle, Zap, Shield, Clock, Users,
  FileText, Database, Activity, BarChart3, Target, PhoneCall, Monitor,
  Hash, Layers, Eye, ClipboardList, Volume2, Sun, Moon, GitBranch, Filter,
  Shuffle, UserCheck, Radio, Headphones, Globe, Calendar, Timer, TrendingUp,
  Award, Key, Lock, Unlock, MapPin, Building, UserPlus, UserMinus, Link,
  Briefcase, FolderOpen, Upload, Download, Grid, List, Tag, ToggleLeft
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
  'The Big Picture — Users, Groups, and Organizational Structure',
  'Building and Managing Your Directory — Users, Roles, Presence, and Integrations',
];
const TIER_AUDIENCES = [
  'For everyone — no experience needed',
  'For administrators, architects & power users',
];
const TIER_ICONS_KEYS = ['Rocket', 'Settings'];

// ══════════════════════════════════════════════════════════════
// SECTION METADATA (all tiers)
// ══════════════════════════════════════════════════════════════
const SECTIONS = [
  { tier: 0, id: 't1s1', title: 'What Is the Directory in Genesys Cloud?' },
  { tier: 0, id: 't1s2', title: 'The Building Blocks — Key Components' },
  { tier: 0, id: 't1s3', title: 'How User Management Works — The Lifecycle' },
  { tier: 0, id: 't1s4', title: 'Roles, Divisions & Permissions' },
  { tier: 0, id: 't1s5', title: 'Key Terminology Glossary' },
  { tier: 1, id: 't2s1', title: 'Prerequisites & Setup' },
  { tier: 1, id: 't2s2', title: 'User Management' },
  { tier: 1, id: 't2s3', title: 'Groups & Teams' },
  { tier: 1, id: 't2s4', title: 'Locations & Sites' },
  { tier: 1, id: 't2s5', title: 'Presence & Status Definitions' },
  { tier: 1, id: 't2s6', title: 'External Contacts & Relationships' },
  { tier: 1, id: 't2s7', title: 'SCIM Provisioning & Identity' },
  { tier: 1, id: 't2s8', title: 'API, Limits & Troubleshooting' },
];

// ══════════════════════════════════════════════════════════════
// T1 DATA
// ══════════════════════════════════════════════════════════════
const DIRECTORY_ASPECTS = [
  { icon: 'Users', label: 'People', desc: 'All user accounts — agents, supervisors, admins — with profiles, contact info, and org relationships' },
  { icon: 'Shield', label: 'Access Control', desc: 'Roles, permissions, and divisions that govern who can see and do what across the platform' },
  { icon: 'Globe', label: 'External Contacts', desc: 'Customer and partner contact records stored in the platform for relationship tracking' },
  { icon: 'MapPin', label: 'Locations & Sites', desc: 'Physical offices, data centers, and telephony sites tied to users and Edge devices' },
  { icon: 'Activity', label: 'Presence', desc: 'Real-time availability status for every user — on queue, available, away, busy, offline' },
  { icon: 'Link', label: 'Identity & SCIM', desc: 'Federated identity, SSO, and automated user provisioning from Azure AD, Okta, and other IdPs' },
];

const DIRECTORY_MAP_NODES = [
  { id: 'users', label: 'USERS', sub: 'People in the org', x: 400, y: 60 },
  { id: 'groups', label: 'GROUPS', sub: 'Teams & memberships', x: 130, y: 150 },
  { id: 'locations', label: 'LOCATIONS', sub: 'Physical offices', x: 670, y: 150 },
  { id: 'sites', label: 'SITES', sub: 'Telephony config', x: 80, y: 310 },
  { id: 'externalContacts', label: 'EXT. CONTACTS', sub: 'Customers & partners', x: 110, y: 450 },
  { id: 'roles', label: 'ROLES', sub: 'Permission bundles', x: 300, y: 540 },
  { id: 'divisions', label: 'DIVISIONS', sub: 'Access boundaries', x: 720, y: 310 },
  { id: 'presence', label: 'PRESENCE', sub: 'Availability status', x: 690, y: 450 },
  { id: 'scim', label: 'SCIM', sub: 'Auto-provisioning', x: 500, y: 540 },
];
const DIRECTORY_MAP_CENTER = { x: 400, y: 300 };

const DIRECTORY_NODE_TOOLTIPS = {
  users: { explanation: 'Every person who logs into Genesys Cloud — agents, supervisors, admins, and workforce managers — each with a profile, contact details, skills, and queue memberships', analogy: 'The employee badge and HR record for each staff member' },
  groups: { explanation: 'Collections of users organized by team, department, or function. Groups simplify queue membership, permissions, and communication. Can be official (admin-managed) or social (user-created)', analogy: 'Department teams on a company org chart' },
  locations: { explanation: 'Physical addresses representing offices, buildings, or branch locations. Used for E911 emergency calling, user assignment, and organizational reporting', analogy: 'Pin on a map showing where your offices are' },
  sites: { explanation: 'Telephony configuration containers that define media settings, codecs, outbound routes, and Edge device associations for a physical or virtual location', analogy: 'The telephone closet and wiring plan for each office building' },
  externalContacts: { explanation: 'Records of people outside your organization — customers, vendors, partners — with contact info, notes, and relationship history linked to interactions', analogy: 'Your company\'s shared address book for customers and partners' },
  roles: { explanation: 'Named bundles of permissions that control what actions a user can perform — viewing queues, editing flows, managing users, running reports, and more', analogy: 'Security keycards with different access levels in a building' },
  divisions: { explanation: 'Logical boundaries that segment your organization. Objects (users, queues, flows) belong to divisions, and roles are granted per division — enabling multi-tenant or departmental isolation', analogy: 'Separate floors in a building, each with its own access card reader' },
  presence: { explanation: 'Real-time status indicators showing whether a user is available, busy, away, on queue, in a meeting, or offline. Drives routing decisions and supervisor dashboards', analogy: 'The green/yellow/red dot next to someone\'s name in a chat app' },
  scim: { explanation: 'System for Cross-domain Identity Management — an open standard that lets identity providers (Azure AD, Okta) automatically create, update, and deactivate user accounts in Genesys Cloud', analogy: 'An automated HR system that creates and removes building access badges when employees join or leave' },
};

const USER_LIFECYCLE = [
  { step: 1, title: 'CREATE USER ACCOUNT', desc: 'User is created manually in the admin UI, via bulk CSV import, or automatically through SCIM provisioning from an identity provider', color: C.green, icon: 'UserPlus' },
  {
    step: 2, title: 'CONFIGURE PROFILE', color: C.blue, icon: 'FileText',
    desc: 'User profile is completed:',
    checks: [
      'Name, email, department, title, manager assignment',
      'Phone configuration — WebRTC, SIP phone, or remote station',
      'Location assignment for E911 and organizational reporting',
      'Profile image, contact numbers, and addresses',
    ],
  },
  {
    step: 3, title: 'ASSIGN ROLES & DIVISIONS', color: C.orange, icon: 'Shield',
    desc: 'Access control is configured:',
    checks: [
      'Grant one or more roles (e.g., Agent, Supervisor, Admin)',
      'Scope each role to specific divisions (or "All" divisions)',
      'Roles stack — user gets the union of all granted permissions',
    ],
  },
  { step: 4, title: 'ASSIGN TO QUEUES & GROUPS', desc: 'User is added to ACD queues (directly or via groups), assigned routing skills and languages, and configured with agent utilization settings for each media type', color: C.purple, icon: 'Users' },
  { step: 5, title: 'MANAGE & MAINTAIN', desc: 'Ongoing management: update skills, change roles, transfer divisions, adjust presence definitions, monitor activity, and eventually deactivate when the user leaves the organization', color: C.yellow, icon: 'Settings' },
];

const ACCESS_CONTROL_COMPONENTS = [
  { name: 'Permission', desc: 'A single atomic action a user can take, such as "routing:queue:view" or "directory:user:edit". There are hundreds of individual permissions in the platform.', color: C.green },
  { name: 'Role', desc: 'A named collection of permissions bundled together. Built-in roles include Agent, Supervisor, Admin, Communicator. You can also create custom roles with any combination of permissions.', color: C.blue },
  { name: 'Division', desc: 'A logical container that segments objects. Every user, queue, flow, and managed object belongs to exactly one division. The "Home" division is the default for all objects.', color: C.orange },
  { name: 'Grant', desc: 'The combination of a Role + Division(s) assigned to a user. A grant says: "This user has these permissions within these divisions." A user can have multiple grants.', color: C.purple },
];

const GLOSSARY = [
  { term: 'Directory', def: 'The centralized people and organizational data store in Genesys Cloud — users, groups, locations, external contacts, and their relationships', tier: 'Tier 1' },
  { term: 'User', def: 'Any person with an account in Genesys Cloud — could be an agent, supervisor, admin, or view-only user depending on their assigned roles', tier: 'Tier 1' },
  { term: 'Group', def: 'A collection of users organized by team, department, or function — used for queue membership, permissions, and collaboration', tier: 'Tier 1' },
  { term: 'Role', def: 'A named bundle of permissions that determines what a user can see and do in the platform (e.g., Agent, Supervisor, Admin)', tier: 'Tier 1' },
  { term: 'Division', def: 'A logical boundary that segments objects for access control — roles are granted per division, enabling multi-department isolation', tier: 'Tier 1' },
  { term: 'Permission', def: 'A single atomic action a user can perform, like "routing:queue:view" or "directory:user:add" — bundled into roles', tier: 'Tier 2' },
  { term: 'Location', def: 'A physical address (office, branch) assigned to users for E911 emergency services and organizational reporting', tier: 'Tier 1' },
  { term: 'Site', def: 'A telephony configuration container that defines media settings, codecs, and Edge associations for a physical or virtual location', tier: 'Tier 2' },
  { term: 'Presence', def: 'A user\'s real-time availability status (Available, Busy, Away, On Queue, Offline) — drives routing decisions and visibility', tier: 'Tier 1' },
  { term: 'SCIM', def: 'System for Cross-domain Identity Management — an open standard for automatic user provisioning and deprovisioning from identity providers', tier: 'Tier 2' },
  { term: 'External Contact', def: 'A record representing a person outside the organization (customer, vendor) with contact info and relationship history', tier: 'Tier 1' },
  { term: 'External Organization', def: 'A company-level record in external contacts that groups individual external contacts under a shared business entity', tier: 'Tier 2' },
  { term: 'Manager Hierarchy', def: 'The reporting chain defined by assigning a manager to each user — enables hierarchical views, approval workflows, and reporting rollups', tier: 'Tier 2' },
  { term: 'Skill', def: 'A tag representing an agent capability (e.g., "Billing", "Spanish") used for matching interactions to qualified agents', tier: 'Tier 2' },
  { term: 'Dynamic Group', def: 'A group whose membership is automatically determined by rules based on user attributes (department, title, location) rather than manual assignment', tier: 'Tier 2' },
  { term: 'Skill Group', def: 'A virtual grouping of agents based on shared ACD skills — used for workforce management forecasting and scheduling', tier: 'Tier 2' },
  { term: 'Station', def: 'A phone endpoint (WebRTC, SIP, remote) associated with a user that enables voice interactions', tier: 'Tier 2' },
  { term: 'Edge', def: 'A Genesys appliance (physical or virtual) that handles media processing, SIP connectivity, and PSTN gateway functions at a site', tier: 'Tier 2' },
  { term: 'SSO', def: 'Single Sign-On — allows users to authenticate once through an identity provider (Okta, Azure AD, ADFS) and access Genesys Cloud without a separate password', tier: 'Tier 2' },
  { term: 'On-Queue', def: 'A secondary presence state indicating an agent is available to receive ACD-routed interactions from their assigned queues', tier: 'Tier 1' },
];

// ══════════════════════════════════════════════════════════════
// T2 DATA
// ══════════════════════════════════════════════════════════════
const PREREQUISITES = [
  { title: 'Organization Created', detail: 'A Genesys Cloud organization must exist with a valid subscription. The org short name, region (e.g., us-east-1, eu-west-1, ap-southeast-2), and base domain are set at provisioning time and cannot be changed later. Each org has a unique org ID used in API calls.' },
  { title: 'Admin Account Active', detail: 'At least one user must have the Master Admin role (full platform access). This is typically the first user created during org provisioning. Best practice: create a shared admin service account for API integrations and a named admin account for each human administrator.' },
  { title: 'Identity Provider Configured (Optional)', detail: 'For SSO and SCIM, configure your identity provider (Azure AD, Okta, ADFS, OneLogin, PingFederate) in Admin > Integrations > SSO. SAML 2.0 and OpenID Connect are supported. SSO eliminates separate Genesys passwords and enables centralized access control.' },
  { title: 'Telephony Setup (for Voice Users)', detail: 'Users who will handle voice interactions need phone configuration: Genesys Cloud Voice (built-in WebRTC), BYOC Cloud (SIP trunks to Genesys AWS), or BYOC Premises (on-prem Edge appliances). Phone base settings, line configurations, and station assignments must be completed.' },
];

const USER_CREATION_METHODS = [
  { name: 'Manual (Admin UI)', desc: 'Create individual users via Admin > People > Add Person. Enter name, email, department, title, and assign roles. The user receives an invitation email to set their password. Best for: small teams, one-off additions.', color: C.green },
  { name: 'Bulk Import (CSV)', desc: 'Upload a CSV file with user data (name, email, phone, department, title, manager) to create many users at once. Template available in Admin > People > Import. Supports up to 10,000 users per file. Best for: initial deployment, large team onboarding.', color: C.blue },
  { name: 'SCIM Auto-Provisioning', desc: 'Connect your identity provider (Azure AD, Okta) via SCIM 2.0. Users are automatically created, updated, and deactivated in Genesys Cloud when changes happen in the IdP. Best for: enterprises with centralized identity management.', color: C.orange },
  { name: 'Public API', desc: 'Create users programmatically via POST /api/v2/users. Full control over all user attributes. Supports automation, custom onboarding workflows, and integration with HR systems. Best for: developer-driven provisioning and migrations.', color: C.purple },
];

const USER_PROFILE_FIELDS = [
  ['Name', 'First name, last name, and optional display name shown across the platform'],
  ['Email', 'Primary email address — used for login (unless SSO), notifications, and email routing'],
  ['Department', 'Organizational department for filtering, reporting, and dynamic group membership'],
  ['Title', 'Job title for display and organizational context'],
  ['Manager', 'Direct reporting manager — enables hierarchy views and workforce management rollups'],
  ['Phone Numbers', 'Work, mobile, and other phone numbers for the user profile and click-to-call'],
  ['Location', 'Physical office location for E911 emergency services and location-based reporting'],
  ['Profile Images', 'Avatar photo displayed in the directory, chat, and collaboration tools'],
  ['Addresses', 'Physical mailing address(es) associated with the user'],
  ['Certifications', 'Professional certifications that can be tracked and reported on'],
  ['Biography', 'Free-text bio shown on the user\'s profile page — visible to other org members'],
];

const PHONE_TYPES = [
  { name: 'WebRTC Phone', desc: 'Browser-based softphone built into the Genesys Cloud desktop app. No external hardware needed. Supports voice, video, and screen share. Lowest latency option for cloud-first deployments.', best: 'Remote workers, cloud-first orgs, quick deployment' },
  { name: 'Managed SIP Phone', desc: 'Physical desk phone or software SIP client provisioned and managed by Genesys Cloud. Supports Polycom, AudioCodes, and other certified models. Auto-provisioned with firmware and config.', best: 'Office-based agents who prefer physical phones' },
  { name: 'Remote / BYOD Phone', desc: 'Any SIP-capable phone or client that registers to Genesys Cloud via SIP trunk. Not auto-provisioned — requires manual SIP configuration. Used for bring-your-own-device scenarios.', best: 'Existing phone infrastructure, BYOD policies' },
  { name: 'Genesys Cloud Voice', desc: 'Integrated telephony service with DIDs, toll-free numbers, and PSTN connectivity built into the platform. No external SIP provider needed. Numbers provisioned directly in Admin.', best: 'Organizations without existing PSTN provider' },
];

const GROUP_TYPES = [
  { name: 'Official Groups', desc: 'Created and managed by administrators. Used for formal organizational structures — departments, teams, queue memberships. Members cannot leave on their own. Admins control membership.', color: C.blue },
  { name: 'Social Groups', desc: 'Created by any user for informal collaboration. Visible in directory for optional joining. Members can join and leave freely. Used for interest groups, project teams, cross-functional collaboration.', color: C.green },
  { name: 'Dynamic Groups', desc: 'Membership automatically determined by rules based on user attributes. Example: "All users where department = Sales AND location = New York." Membership updates automatically when user attributes change. Requires specific license.', color: C.orange },
  { name: 'Skill Groups', desc: 'Virtual groupings of agents who share specific ACD skills. Used primarily by Workforce Management for forecasting and scheduling. Not a traditional group — built from skill assignments rather than explicit membership.', color: C.purple },
];

const LOCATION_FIELDS = [
  ['Name', 'Descriptive name for the location (e.g., "New York HQ", "London Office")'],
  ['Address', 'Full physical street address — used for E911 emergency services and geocoding'],
  ['Emergency Number', 'The local emergency services number (e.g., 911, 112) for this location'],
  ['ELIN', 'Emergency Location Identification Number — ties the physical address to E911 for accurate dispatch'],
  ['Notes', 'Free-text notes about the location (parking instructions, building access, etc.)'],
];

const SITE_CONFIG_OPTIONS = [
  ['Site Name', 'Unique identifier for the telephony site (e.g., "NYC-Main", "London-DC")'],
  ['Location', 'The physical location this site is associated with — links telephony to geography'],
  ['Media Model', 'Cloud (all media through AWS) or Premises (media through on-site Edge appliances)'],
  ['Codec Preferences', 'Audio codec priority order (e.g., Opus, G.711u, G.711a, G.729) for voice quality optimization'],
  ['Outbound Routes', 'SIP trunk routes for outbound dialing — defines how calls leave the platform to reach the PSTN'],
  ['Edge Group', 'For BYOC Premises: the group of Edge appliances handling media at this site'],
  ['Number Plans', 'Dialing rules that normalize phone numbers for the region (e.g., country code handling, extension dialing)'],
];

const SYSTEM_PRESENCES = [
  { name: 'Available', desc: 'User is ready to receive interactions. The only presence from which ACD will route interactions to the user.', color: C.green },
  { name: 'Busy', desc: 'User is occupied and should not be disturbed. ACD will NOT route interactions. Often auto-set when user is on an active interaction.', color: C.red },
  { name: 'Away', desc: 'User has stepped away from their workstation. ACD will NOT route. Can be auto-triggered by idle timeout if configured.', color: C.yellow },
  { name: 'Break', desc: 'User is on a scheduled break. ACD will NOT route. Used for workforce management tracking of adherence to schedule.', color: C.orange },
  { name: 'Meeting', desc: 'User is in a meeting. ACD will NOT route. Can be auto-set from calendar integration (Google, Microsoft 365).', color: C.purple },
  { name: 'Training', desc: 'User is in a training session. ACD will NOT route. Useful for workforce management schedule adherence tracking.', color: C.blue },
  { name: 'Idle', desc: 'System-set presence when a user has been inactive beyond the configured timeout. Not manually selectable. ACD will NOT route.', color: C.red },
  { name: 'Offline', desc: 'User is logged out of Genesys Cloud entirely. No interactions can be routed. Presence is auto-set on logout.', color: C.red },
];

const ON_QUEUE_BEHAVIOR = [
  { scenario: 'Available + On Queue', result: 'Agent receives ACD-routed interactions from their assigned queues', color: C.green },
  { scenario: 'Available + Off Queue', result: 'Agent is online but will NOT receive ACD interactions — can still make/receive direct calls', color: C.yellow },
  { scenario: 'Busy + On Queue', result: 'Agent will NOT receive new interactions until their presence returns to Available', color: C.red },
  { scenario: 'Away + On Queue', result: 'Agent will NOT receive interactions — the On Queue flag is irrelevant when presence is not Available', color: C.red },
  { scenario: 'Offline', result: 'Agent is logged out — On Queue status is cleared automatically', color: C.red },
];

const EXTERNAL_CONTACT_FIELDS = [
  ['External Organization', 'The company or entity the contact belongs to (e.g., "Acme Corp")'],
  ['Contact Name', 'First name, last name, and optional title of the external person'],
  ['Phone Numbers', 'Work, mobile, home, and other phone numbers — used for ANI matching on inbound calls'],
  ['Email Addresses', 'Email addresses used for automatic contact matching on inbound emails'],
  ['Twitter Handle', 'Social media handle for matching on social messaging interactions'],
  ['Survey Opt Out', 'Whether the contact has opted out of post-interaction surveys'],
  ['External IDs', 'Custom external identifiers (CRM ID, account number) for cross-system linking'],
  ['Notes & Custom Fields', 'Free-text notes and up to 100 custom key-value fields for business data'],
];

const SCIM_ATTRIBUTES = [
  { attribute: 'userName', maps: 'Email (login)', notes: 'Required. Must be unique. Becomes the Genesys Cloud email/login.' },
  { attribute: 'name.givenName', maps: 'First Name', notes: 'Required.' },
  { attribute: 'name.familyName', maps: 'Last Name', notes: 'Required.' },
  { attribute: 'title', maps: 'Job Title', notes: 'Optional. Displayed on user profile.' },
  { attribute: 'urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:department', maps: 'Department', notes: 'Optional. Used for dynamic groups and reporting.' },
  { attribute: 'urn:ietf:params:scim:schemas:extension:enterprise:2.0:User:manager', maps: 'Manager', notes: 'Optional. Sets reporting hierarchy via manager\'s SCIM ID.' },
  { attribute: 'phoneNumbers', maps: 'Phone Numbers', notes: 'Optional. Supports work, mobile, and other types.' },
  { attribute: 'addresses', maps: 'Addresses', notes: 'Optional. Physical address for the user profile.' },
  { attribute: 'active', maps: 'Account Status', notes: 'Boolean. Set to false to deactivate (not delete) the user.' },
];

const SCIM_PROVIDERS = [
  { name: 'Azure Active Directory', steps: ['Create Enterprise Application in Azure AD for Genesys Cloud', 'Configure SCIM provisioning URL: https://login.{region}.pure.cloud/api/v2/scim/v2', 'Generate OAuth client credentials in Genesys Cloud for SCIM', 'Map Azure AD attributes to Genesys Cloud SCIM schema', 'Set provisioning scope (sync all users or assigned users/groups)', 'Enable provisioning and run initial sync'], color: C.blue },
  { name: 'Okta', steps: ['Add Genesys Cloud from Okta Integration Network (OIN)', 'Enter Genesys Cloud org URL and OAuth credentials', 'Configure attribute mapping (Okta profile → SCIM attributes)', 'Set assignment rules (who gets provisioned)', 'Enable provisioning: Create Users, Update Attributes, Deactivate Users', 'Push groups (optional) for automatic group membership sync'], color: C.purple },
];

const API_ENDPOINTS = [
  { method: 'GET', path: '/api/v2/users', use: 'List all users with profiles, roles, and presence info' },
  { method: 'POST', path: '/api/v2/users', use: 'Create a new user with profile and role assignments' },
  { method: 'GET', path: '/api/v2/users/{userId}', use: 'Get a specific user\'s complete profile and configuration' },
  { method: 'PATCH', path: '/api/v2/users/{userId}', use: 'Update user profile fields (name, title, department, etc.)' },
  { method: 'DELETE', path: '/api/v2/users/{userId}', use: 'Permanently delete a user account (irreversible)' },
  { method: 'GET', path: '/api/v2/groups', use: 'List all groups with membership counts' },
  { method: 'POST', path: '/api/v2/groups', use: 'Create a new group with initial members' },
  { method: 'GET', path: '/api/v2/locations', use: 'List all configured locations' },
  { method: 'GET', path: '/api/v2/telephony/providers/edges/sites', use: 'List all telephony sites with config' },
  { method: 'GET', path: '/api/v2/presencedefinitions', use: 'List all presence definitions (system + custom)' },
  { method: 'PATCH', path: '/api/v2/users/{userId}/presences/{source}', use: 'Set or update a user\'s presence status' },
  { method: 'GET', path: '/api/v2/externalcontacts/contacts', use: 'Search and list external contacts' },
  { method: 'POST', path: '/api/v2/externalcontacts/contacts', use: 'Create a new external contact record' },
  { method: 'GET', path: '/api/v2/authorization/roles', use: 'List all roles with permission details' },
  { method: 'PUT', path: '/api/v2/authorization/users/{userId}/roles', use: 'Set user role grants (role + division pairs)' },
  { method: 'GET', path: '/api/v2/authorization/divisions', use: 'List all divisions in the org' },
  { method: 'GET', path: '/api/v2/scim/v2/users', use: 'SCIM 2.0 endpoint — list users for identity provider sync' },
  { method: 'POST', path: '/api/v2/scim/v2/users', use: 'SCIM 2.0 endpoint — provision a new user from IdP' },
];

const PLATFORM_LIMITS = [
  ['Users per org', '25,000', 'Soft limit — contact support for increases'],
  ['Groups per org', '1,000', 'Across all group types'],
  ['Members per group', '1,000', ''],
  ['Dynamic groups per org', '300', 'Requires specific license'],
  ['Roles per org', '500', 'Including built-in and custom roles'],
  ['Permissions per custom role', '1,000+', 'No practical limit per role'],
  ['Divisions per org', '500', 'Including the default Home division'],
  ['Role grants per user', '50', 'Unique role + division combinations'],
  ['Locations per org', '1,000', ''],
  ['Sites per org', '1,000', ''],
  ['External contacts per org', '200,000', 'Soft limit — varies by license'],
  ['External organizations per org', '200,000', 'Soft limit — varies by license'],
  ['Custom presence definitions', '50', 'In addition to system presences'],
  ['Skills per org', '300', 'Shared across all queues and agents'],
  ['Skills per agent', '50', ''],
  ['Languages per org', '100', ''],
  ['Languages per agent', '25', ''],
  ['Bulk import CSV rows', '10,000', 'Per import operation'],
  ['SCIM page size', '100', 'Maximum records per SCIM list response'],
  ['API rate limit (user endpoints)', '300/min', 'Per OAuth client'],
];

const TROUBLESHOOTING = [
  { symptom: 'User cannot log in', investigation: 'Check: Is the user account active (not deactivated)? → Is SSO configured correctly (SAML certificate not expired, assertion URL correct)? → If using Genesys Cloud auth, has the user set their password via the invitation email? → Is the user in the correct org region (us-east-1 vs eu-west-1)? → Check Admin > People, search the user, verify status is "Active." → If SCIM-managed, verify the "active" flag is true in the IdP.' },
  { symptom: 'User missing permissions / "Access Denied"', investigation: 'Check: Does the user have the correct role(s) assigned? → Is the role scoped to the correct division(s)? → Remember: a role granted in "Division A" does NOT apply to objects in "Division B." → Check Admin > People > [User] > Roles tab — verify role + division pairs. → If using custom roles, check that the specific permission exists in the role definition. → Permissions are additive: user gets the union of ALL grants.' },
  { symptom: 'SCIM provisioning not creating users', investigation: 'Check: Is the SCIM OAuth client valid and not expired? → Is the provisioning URL correct for your org region? → Are required SCIM attributes mapped (userName, givenName, familyName)? → Check IdP provisioning logs for error details. → Verify the SCIM endpoint is reachable (no firewall blocking). → Check Genesys Cloud Admin > Integrations > SCIM logs for errors. → Is the user already created manually (email conflict)?' },
  { symptom: 'Presence stuck / not updating', investigation: 'Check: Is the user\'s browser session active or has it timed out? → Is there a stuck interaction holding the user in ACW or "On Call" presence? → Check Admin > People > [User] > clear stuck conversations if needed. → If using calendar integration (meeting presence), verify OAuth token for calendar access is valid. → Check for multiple active sessions (desktop app + browser) that may conflict.' },
  { symptom: 'External contacts not matching inbound calls', investigation: 'Check: Is the phone number stored in the correct format in the external contact record (E.164 recommended: +1XXXXXXXXXX)? → Is the ANI from the inbound call matching the stored number? → Are external contacts enabled for the org? → Check External Contacts permissions for the user trying to view them. → Is the external contact in the correct division?' },
  { symptom: 'Groups not populating queue membership', investigation: 'Check: Is the group added to the queue\'s member list (not just existing in the directory)? → Are the group members assigned the correct routing skills required by the queue? → For dynamic groups, are the rule conditions matching the intended users? → Check that the group type is "Official" — social groups may not be usable for queue membership in all configurations.' },
];

// ══════════════════════════════════════════════════════════════
// SEARCH INDEX
// ══════════════════════════════════════════════════════════════
export const SEARCH_INDEX = (() => {
  const idx = [];
  SECTIONS.forEach(s => idx.push({ text: s.title, label: s.title, sectionId: s.id, tier: s.tier, type: 'Section' }));
  DIRECTORY_ASPECTS.forEach(a => idx.push({ text: `${a.label} ${a.desc}`, label: a.label, sectionId: 't1s1', tier: 0, type: 'Directory Aspect' }));
  DIRECTORY_MAP_NODES.forEach(n => idx.push({ text: `${n.label} ${n.sub}`, label: n.label, sectionId: 't1s2', tier: 0, type: 'Component' }));
  Object.entries(DIRECTORY_NODE_TOOLTIPS).forEach(([k, v]) => idx.push({ text: `${k} ${v.explanation} ${v.analogy}`, label: k, sectionId: 't1s2', tier: 0, type: 'Component Tooltip' }));
  USER_LIFECYCLE.forEach(s => idx.push({ text: `${s.title} ${s.desc} ${(s.checks || []).join(' ')}`, label: s.title, sectionId: 't1s3', tier: 0, type: 'Lifecycle Step' }));
  ACCESS_CONTROL_COMPONENTS.forEach(a => idx.push({ text: `${a.name} ${a.desc}`, label: a.name, sectionId: 't1s4', tier: 0, type: 'Access Control' }));
  GLOSSARY.forEach(g => idx.push({ text: `${g.term} ${g.def}`, label: g.term, sectionId: 't1s5', tier: 0, type: 'Glossary' }));
  PREREQUISITES.forEach(p => idx.push({ text: `${p.title} ${p.detail}`, label: p.title, sectionId: 't2s1', tier: 1, type: 'Prerequisite' }));
  USER_CREATION_METHODS.forEach(m => idx.push({ text: `${m.name} ${m.desc}`, label: m.name, sectionId: 't2s2', tier: 1, type: 'User Config' }));
  USER_PROFILE_FIELDS.forEach(([label, desc]) => idx.push({ text: `${label} ${desc}`, label: label, sectionId: 't2s2', tier: 1, type: 'User Config' }));
  PHONE_TYPES.forEach(p => idx.push({ text: `${p.name} ${p.desc} ${p.best}`, label: p.name, sectionId: 't2s2', tier: 1, type: 'Phone Type' }));
  GROUP_TYPES.forEach(g => idx.push({ text: `${g.name} ${g.desc}`, label: g.name, sectionId: 't2s3', tier: 1, type: 'Group Type' }));
  LOCATION_FIELDS.forEach(([label, desc]) => idx.push({ text: `${label} ${desc}`, label: label, sectionId: 't2s4', tier: 1, type: 'Location Config' }));
  SITE_CONFIG_OPTIONS.forEach(([label, desc]) => idx.push({ text: `${label} ${desc}`, label: label, sectionId: 't2s4', tier: 1, type: 'Site Config' }));
  SYSTEM_PRESENCES.forEach(p => idx.push({ text: `${p.name} ${p.desc}`, label: p.name, sectionId: 't2s5', tier: 1, type: 'Presence' }));
  ON_QUEUE_BEHAVIOR.forEach(b => idx.push({ text: `${b.scenario} ${b.result}`, label: b.scenario, sectionId: 't2s5', tier: 1, type: 'Queue Behavior' }));
  EXTERNAL_CONTACT_FIELDS.forEach(([label, desc]) => idx.push({ text: `${label} ${desc}`, label: label, sectionId: 't2s6', tier: 1, type: 'Contact Field' }));
  SCIM_ATTRIBUTES.forEach(a => idx.push({ text: `${a.attribute} ${a.maps} ${a.notes}`, label: a.attribute, sectionId: 't2s7', tier: 1, type: 'SCIM Attribute' }));
  SCIM_PROVIDERS.forEach(p => idx.push({ text: `${p.name} ${p.steps.join(' ')}`, label: p.name, sectionId: 't2s7', tier: 1, type: 'SCIM Provider' }));
  API_ENDPOINTS.forEach(e => idx.push({ text: `${e.method} ${e.path} ${e.use}`, label: `${e.method} ${e.path}`, sectionId: 't2s8', tier: 1, type: 'API Endpoint' }));
  PLATFORM_LIMITS.forEach(([res, limit, notes]) => idx.push({ text: `${res} ${limit} ${notes}`, label: res, sectionId: 't2s8', tier: 1, type: 'Limit' }));
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
const DirectoryComponentMapSVG = () => {
  const [active, setActive] = useState(null);
  return (
    <div className="my-6 overflow-x-auto">
      <svg viewBox="0 0 800 600" className="w-full" style={{ maxWidth: 800, minWidth: 600 }}>
        <defs>
          <filter id="glow-d"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        {DIRECTORY_MAP_NODES.map(n => (
          <line key={`line-${n.id}`} x1={DIRECTORY_MAP_CENTER.x} y1={DIRECTORY_MAP_CENTER.y} x2={n.x} y2={n.y} stroke={C.border} strokeWidth="2" strokeDasharray="6,4" />
        ))}
        <g>
          <rect x={DIRECTORY_MAP_CENTER.x - 80} y={DIRECTORY_MAP_CENTER.y - 30} width={160} height={60} rx={12} fill={C.bg3} stroke={C.blue} strokeWidth={2} />
          <text x={DIRECTORY_MAP_CENTER.x} y={DIRECTORY_MAP_CENTER.y - 5} textAnchor="middle" fill={C.t1} fontFamily={MONO} fontSize={13} fontWeight="bold">DIRECTORY</text>
          <text x={DIRECTORY_MAP_CENTER.x} y={DIRECTORY_MAP_CENTER.y + 15} textAnchor="middle" fill={C.t3} fontFamily={SANS} fontSize={10}>The people hub</text>
        </g>
        {DIRECTORY_MAP_NODES.map(n => {
          const isActive = active === n.id;
          const tooltip = DIRECTORY_NODE_TOOLTIPS[n.id];
          return (
            <g key={n.id} className="cursor-pointer" onClick={() => setActive(isActive ? null : n.id)} style={{ transition: 'transform 0.2s' }}>
              <rect x={n.x - 70} y={n.y - 25} width={140} height={50} rx={8} fill={C.bg2} stroke={isActive ? C.blue : C.border} strokeWidth={isActive ? 2 : 1} filter={isActive ? 'url(#glow-d)' : undefined} />
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
      <SectionHeading>What Is the Directory in Genesys Cloud?</SectionHeading>
      <Paragraph>The Directory is the central people and organizational data store in Genesys Cloud. It contains every user account, group, location, external contact, and the relationships between them. Think of it as your organization's digital backbone — just as a company needs an employee directory, an org chart, and an access control system, Genesys Cloud needs the Directory to know who everyone is, what they can do, and how they relate to each other.</Paragraph>
      <Paragraph>Everything in Genesys Cloud depends on the Directory. Routing needs to know which agents exist and what skills they have. Supervisors need to see who is available. Security needs to enforce who can edit what. Analytics needs to attribute performance to the right people and teams. The Directory makes all of this possible.</Paragraph>
      <SubHeading>What the Directory Manages</SubHeading>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 my-4">
        {DIRECTORY_ASPECTS.map((ch, i) => (
          <div key={i} className="rounded-lg p-4 flex items-start gap-3 transition-all duration-200 hover:-translate-y-0.5" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
            <Users size={20} style={{ color: C.blue, flexShrink: 0 }} />
            <div><div className="font-semibold text-sm" style={{ color: C.t1, fontFamily: MONO }}>{ch.label}</div><div className="text-xs mt-1" style={{ color: C.t2, fontFamily: SANS }}>{ch.desc}</div></div>
          </div>
        ))}
      </div>
      <SubHeading>Directory vs. External Identity</SubHeading>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        {[
          { title: 'GENESYS CLOUD DIRECTORY', items: ['Stores user profiles, groups, locations, presence', 'Manages roles, divisions, and permissions', 'Contains external contacts and relationships', 'Source of truth for routing and analytics', 'Managed via Admin UI, API, or SCIM sync'], color: C.blue },
          { title: 'EXTERNAL IDENTITY PROVIDER', items: ['Stores authentication credentials (passwords, MFA)', 'Manages SSO tokens and session lifecycle', 'Provides user attributes for SCIM provisioning', 'Source of truth for who CAN log in', 'Managed in Azure AD, Okta, ADFS, etc.'], color: C.orange },
        ].map((panel, i) => (
          <div key={i} className="rounded-lg p-5" style={{ backgroundColor: C.bg2, borderTop: `3px solid ${panel.color}` }}>
            <div className="font-bold mb-3 text-sm" style={{ color: panel.color, fontFamily: MONO }}>{panel.title}</div>
            {panel.items.map((item, j) => <div key={j} className="text-sm mb-1.5" style={{ color: C.t2, fontFamily: SANS }}>{item}</div>)}
          </div>
        ))}
      </div>
      <CalloutBox type="tip">The Directory and your external identity provider work together but serve different purposes. The IdP handles authentication (proving who you are), while the Genesys Cloud Directory handles authorization (determining what you can do). SCIM bridges the two by keeping user data in sync.</CalloutBox>
    </section>

    {/* T1S2 */}
    <section ref={el => sectionRefs.current['t1s2'] = el} id="t1s2">
      <SectionHeading>The Building Blocks — Key Components</SectionHeading>
      <Paragraph>The Genesys Cloud Directory is built from several interconnected components. No single piece works alone — users belong to groups, groups populate queues, roles grant permissions within divisions, and presence drives routing decisions. Think of it like a company: people (users) work in departments (groups) at offices (locations), with job-level access (roles) to specific floors (divisions).</Paragraph>
      <CalloutBox type="tip">Click any node in the diagram below to see what it does and a simple analogy.</CalloutBox>
      <DirectoryComponentMapSVG />
      <SubHeading>Component Reference</SubHeading>
      <InteractiveTable
        headers={['Component', 'Simple Explanation', 'Analogy']}
        rows={Object.entries(DIRECTORY_NODE_TOOLTIPS).map(([k, v]) => {
          const node = DIRECTORY_MAP_NODES.find(n => n.id === k);
          return [node?.label || k, v.explanation, v.analogy];
        })}
      />
    </section>

    {/* T1S3 */}
    <section ref={el => sectionRefs.current['t1s3'] = el} id="t1s3">
      <SectionHeading>How User Management Works — The Lifecycle</SectionHeading>
      <Paragraph>Every user in Genesys Cloud follows a lifecycle from creation to eventual deactivation. Understanding this lifecycle is essential for managing your directory effectively — whether you have 50 users or 50,000.</Paragraph>
      <div className="my-6 space-y-0">
        {USER_LIFECYCLE.map((s, i) => (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: s.color + '22', color: s.color, border: `2px solid ${s.color}`, fontFamily: MONO }}>{s.step}</div>
              {i < USER_LIFECYCLE.length - 1 && <div className="w-0.5 flex-1 my-1" style={{ backgroundColor: C.border }} />}
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
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: C.red + '22', border: `2px solid ${C.red}` }}>
            <AlertCircle size={16} style={{ color: C.red }} />
          </div>
          <div className="font-bold text-sm" style={{ color: C.red, fontFamily: MONO }}>DEACTIVATE — User leaves the organization</div>
        </div>
      </div>
      <CalloutBox type="warning">Deactivating a user is different from deleting a user. Deactivation preserves historical data (interaction records, analytics, audit logs) while preventing login. Deletion is permanent and removes the user record entirely. Best practice: always deactivate first; only delete if required by data retention policy.</CalloutBox>
    </section>

    {/* T1S4 */}
    <section ref={el => sectionRefs.current['t1s4'] = el} id="t1s4">
      <SectionHeading>Roles, Divisions & Permissions</SectionHeading>
      <Paragraph>Access control in Genesys Cloud is built on a simple but powerful model: Permissions are grouped into Roles, and Roles are granted to users within specific Divisions. This three-layer system allows fine-grained control over who can see and do what, while remaining manageable at scale.</Paragraph>
      <SubHeading>The Access Control Model</SubHeading>
      <div className="space-y-3 my-4">
        {ACCESS_CONTROL_COMPONENTS.map((a, i) => (
          <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, borderLeft: `4px solid ${a.color}` }}>
            <div className="font-bold text-sm mb-2" style={{ color: a.color, fontFamily: MONO }}>{a.name}</div>
            <div className="text-sm" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.6 }}>{a.desc}</div>
          </div>
        ))}
      </div>
      <SubHeading>How Grants Work — A Practical Example</SubHeading>
      <div className="my-4 p-4 rounded-lg" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
        {[
          { indent: 0, text: 'USER: Jane Smith (Agent + Supervisor)', color: C.green },
          { indent: 1, text: 'GRANT 1: Role "Agent" → Division "Support"', color: C.blue },
          { indent: 2, text: 'Can handle interactions in Support queues', color: C.t3 },
          { indent: 2, text: 'Can view Support division users and queues', color: C.t3 },
          { indent: 1, text: 'GRANT 2: Role "Supervisor" → Division "Support"', color: C.orange },
          { indent: 2, text: 'Can monitor agents in Support division', color: C.t3 },
          { indent: 2, text: 'Can view real-time analytics for Support queues', color: C.t3 },
          { indent: 2, text: 'Can change agent statuses in Support division', color: C.t3 },
          { indent: 1, text: 'GRANT 3: Role "Agent" → Division "Sales"', color: C.purple },
          { indent: 2, text: 'Can also handle interactions in Sales queues', color: C.t3 },
          { indent: 2, text: 'But CANNOT supervise in Sales (no Supervisor role there)', color: C.red },
        ].map((line, i) => (
          <div key={i} className="text-xs" style={{ paddingLeft: line.indent * 20, color: line.color, fontFamily: MONO, marginBottom: 2 }}>{line.text}</div>
        ))}
      </div>
      <SubHeading>Built-In Roles</SubHeading>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
        {[
          { name: 'Employee', desc: 'Basic access: view directory, update own profile, use collaboration tools. Default role for all users.', color: C.green },
          { name: 'Agent', desc: 'Handle interactions: accept calls/chats/emails, go on/off queue, select wrap-up codes, view own performance.', color: C.blue },
          { name: 'Supervisor', desc: 'Monitor teams: listen/whisper/barge, view real-time dashboards, change agent statuses, view team analytics.', color: C.orange },
          { name: 'Admin', desc: 'Configure platform: manage users, queues, flows, telephony, integrations, roles, and divisions.', color: C.red },
          { name: 'Master Admin', desc: 'Full access to everything. Cannot be restricted by divisions. Reserved for platform owners.', color: C.purple },
          { name: 'Communicator', desc: 'Collaboration tools: make/receive calls, use video, chat with colleagues. No ACD routing capabilities.', color: C.yellow },
        ].map((role, i) => (
          <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
            <div className="font-bold text-sm mb-2" style={{ color: role.color, fontFamily: MONO }}>{role.name}</div>
            <div className="text-xs" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.6 }}>{role.desc}</div>
          </div>
        ))}
      </div>
      <CalloutBox type="info">Roles are additive. If a user has both "Agent" and "Supervisor" in the same division, they get the combined permissions of both roles. There is no "deny" mechanism — you control access by simply not granting a role in a division.</CalloutBox>
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
  const [activeProviderTab, setActiveProviderTab] = useState(0);
  return (
    <div className="space-y-16">
      {/* T2S1 */}
      <section ref={el => sectionRefs.current['t2s1'] = el} id="t2s1">
        <SectionHeading>Prerequisites & Setup</SectionHeading>
        <Paragraph>Before configuring your directory structure, these foundational elements must be in place. Getting these right from the start prevents rework and access control headaches later.</Paragraph>
        <div className="space-y-3 my-4">
          {PREREQUISITES.map((p, i) => (
            <ExpandableCard key={i} title={`${i + 1}. ${p.title}`} accent={C.blue}>
              {p.detail}
            </ExpandableCard>
          ))}
        </div>
        <SubHeading>Recommended Setup Sequence</SubHeading>
        <div className="flex flex-wrap items-center gap-1 my-4 overflow-x-auto">
          {['SSO / IdP', 'Divisions', 'Custom Roles', 'Locations', 'Sites', 'Users', 'Groups', 'Skills', 'Queue Membership'].map((s, i) => (
            <React.Fragment key={i}>
              <span className="px-3 py-1.5 rounded text-xs whitespace-nowrap" style={{ backgroundColor: C.bg3, color: C.t1, fontFamily: MONO, border: `1px solid ${C.border}` }}>{s}</span>
              {i < 8 && <ArrowRight size={14} style={{ color: C.t3, flexShrink: 0 }} />}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* T2S2 */}
      <section ref={el => sectionRefs.current['t2s2'] = el} id="t2s2">
        <SectionHeading>User Management</SectionHeading>
        <Paragraph>User management encompasses everything from creating accounts to configuring phones, assigning managers, and maintaining user data over time. Genesys Cloud offers multiple methods for user creation, each suited to different organizational needs.</Paragraph>
        <SubHeading>User Creation Methods</SubHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
          {USER_CREATION_METHODS.map((m, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, borderLeft: `4px solid ${m.color}` }}>
              <div className="font-bold text-sm mb-2" style={{ color: m.color, fontFamily: MONO }}>{m.name}</div>
              <div className="text-sm" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.6 }}>{m.desc}</div>
            </div>
          ))}
        </div>
        <SubHeading>User Profile Fields</SubHeading>
        <div className="space-y-2 my-3">
          {USER_PROFILE_FIELDS.map(([label, desc], i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-1 p-3 rounded" style={{ backgroundColor: C.bg2 }}>
              <span className="text-xs font-semibold whitespace-nowrap min-w-[140px]" style={{ color: C.blue, fontFamily: MONO }}>{label}:</span>
              <span className="text-xs" style={{ color: C.t2, fontFamily: SANS }}>{desc}</span>
            </div>
          ))}
        </div>
        <SubHeading>Phone Configuration</SubHeading>
        <Paragraph>Every user who handles voice interactions needs a phone assigned. Genesys Cloud supports several phone types, each suited to different deployment models.</Paragraph>
        <div className="space-y-3 my-4">
          {PHONE_TYPES.map((p, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
              <div className="font-semibold text-sm mb-2" style={{ color: C.t1, fontFamily: MONO }}>{p.name}</div>
              <div className="text-sm mb-2" style={{ color: C.t2, fontFamily: SANS }}>{p.desc}</div>
              <div className="text-xs p-2 rounded" style={{ backgroundColor: C.bg3, color: C.t3 }}>Best for: {p.best}</div>
            </div>
          ))}
        </div>
        <SubHeading>Manager Hierarchy</SubHeading>
        <Paragraph>Each user can have a manager assigned, creating a reporting hierarchy. This hierarchy enables: manager-based views in analytics (see your direct reports' performance), workforce management schedule approval workflows, hierarchical access patterns (supervisors see their team's data), and org chart visualization in the directory. Set via user profile, bulk CSV import, SCIM attribute mapping, or API.</Paragraph>
        <SubHeading>Bulk Import Template</SubHeading>
        <CodeBlock>{`# CSV format for bulk user import
# Required: email, name (first + last)
# Optional: all other fields
email,firstName,lastName,department,title,manager,phoneNumber,location
jane.smith@acme.com,Jane,Smith,Support,Senior Agent,john.doe@acme.com,+15551234567,New York HQ
bob.jones@acme.com,Bob,Jones,Sales,Team Lead,,+15559876543,Chicago Office
maria.garcia@acme.com,Maria,Garcia,Support,Agent,jane.smith@acme.com,,New York HQ`}</CodeBlock>
        <CalloutBox type="warning">When importing users via CSV, the manager field must reference an email address of a user who already exists in the org. Import managers before their reports, or run two passes: first to create all users, then to set manager relationships.</CalloutBox>
      </section>

      {/* T2S3 */}
      <section ref={el => sectionRefs.current['t2s3'] = el} id="t2s3">
        <SectionHeading>Groups & Teams</SectionHeading>
        <Paragraph>Groups are the organizational backbone of Genesys Cloud. They simplify queue membership, enable team-based permissions, and provide collaboration spaces. Rather than managing each user individually, you manage groups — and group membership cascades to queues, permissions, and visibility.</Paragraph>
        <SubHeading>Group Types</SubHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
          {GROUP_TYPES.map((g, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, borderTop: `3px solid ${g.color}` }}>
              <div className="font-bold mb-3 text-sm" style={{ color: g.color, fontFamily: MONO }}>{g.name}</div>
              <div className="text-sm" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.6 }}>{g.desc}</div>
            </div>
          ))}
        </div>
        <SubHeading>Queue Membership via Groups</SubHeading>
        <Paragraph>Adding a group to a queue automatically makes all group members queue members. This is the recommended approach for large or dynamic teams. When a user is added to the group, they immediately become a queue member. When removed from the group, they are removed from the queue. This eliminates manual queue membership management.</Paragraph>
        <SubHeading>Dynamic Group Rules Example</SubHeading>
        <CodeBlock>{`// Dynamic group: "All Sales Agents in New York"
// Membership auto-updates when user attributes change
{
  "name": "NYC Sales Agents",
  "type": "dynamic",
  "rules": {
    "operator": "AND",
    "conditions": [
      { "field": "department", "operator": "equals", "value": "Sales" },
      { "field": "location", "operator": "equals", "value": "New York HQ" },
      { "field": "role", "operator": "contains", "value": "Agent" }
    ]
  }
}`}</CodeBlock>
        <CalloutBox type="tip">Use official groups for queue membership and formal team structures. Use social groups for cross-functional collaboration and interest-based communities. Use dynamic groups to automate membership based on user attributes — especially useful for large organizations where manual management is impractical.</CalloutBox>
        <CalloutBox type="info">Administrators can now include standalone phones in groups for group ring. When a group call is placed, shared location phones ring alongside individual user devices, improving accessibility for teams that rely on shared communication equipment across facilities. This is especially useful for common-area phones in lobbies, break rooms, or shared workspaces where multiple team members need to answer incoming group calls.</CalloutBox>
      </section>

      {/* T2S4 */}
      <section ref={el => sectionRefs.current['t2s4'] = el} id="t2s4">
        <SectionHeading>Locations & Sites</SectionHeading>
        <Paragraph>Locations and Sites are related but distinct concepts. A Location represents a physical place (address). A Site represents a telephony configuration tied to that place. You need both when deploying voice services at a physical office.</Paragraph>
        <SubHeading>Location Configuration</SubHeading>
        <div className="space-y-2 my-3">
          {LOCATION_FIELDS.map(([label, desc], i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-1 p-3 rounded" style={{ backgroundColor: C.bg2 }}>
              <span className="text-xs font-semibold whitespace-nowrap min-w-[160px]" style={{ color: C.blue, fontFamily: MONO }}>{label}:</span>
              <span className="text-xs" style={{ color: C.t2, fontFamily: SANS }}>{desc}</span>
            </div>
          ))}
        </div>
        <SubHeading>Site Configuration</SubHeading>
        <div className="space-y-2 my-3">
          {SITE_CONFIG_OPTIONS.map(([label, desc], i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-1 p-3 rounded" style={{ backgroundColor: C.bg2 }}>
              <span className="text-xs font-semibold whitespace-nowrap min-w-[160px]" style={{ color: C.blue, fontFamily: MONO }}>{label}:</span>
              <span className="text-xs" style={{ color: C.t2, fontFamily: SANS }}>{desc}</span>
            </div>
          ))}
        </div>
        <SubHeading>Media Settings Per Site</SubHeading>
        <Paragraph>Each site has its own media settings that control voice quality and behavior: codec priority order (Opus preferred for WebRTC, G.711 for PSTN compatibility), DTMF method (RFC 2833 or in-band), voice quality metrics collection, and recording configuration. Sites with BYOC Premises also configure Edge appliance associations and trunk groups.</Paragraph>
        <SubHeading>Edge Association (BYOC Premises)</SubHeading>
        <Paragraph>For organizations using BYOC Premises telephony, Edge appliances (physical or virtual) are associated with sites. Edges handle local media processing, SIP connectivity, and PSTN gateway functions. Each site can have one or more Edges in an Edge Group for redundancy. Edges register with the Genesys Cloud platform and receive configuration updates automatically.</Paragraph>
        <CalloutBox type="info">
          <strong>E911 Requirement:</strong> In the United States, every location where users make voice calls must have a valid E911 address configured. This ensures emergency services can locate the caller. Genesys Cloud validates E911 addresses during location creation. Remote workers should have their home address set as their location for E911 compliance.
        </CalloutBox>
      </section>

      {/* T2S5 */}
      <section ref={el => sectionRefs.current['t2s5'] = el} id="t2s5">
        <SectionHeading>Presence & Status Definitions</SectionHeading>
        <Paragraph>Presence is the real-time status system that tells the platform (and other users) whether someone is available, busy, away, or offline. Presence directly impacts routing — only users with "Available" presence AND "On Queue" status will receive ACD-routed interactions.</Paragraph>
        <SubHeading>System Presences</SubHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          {SYSTEM_PRESENCES.map((p, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, borderLeft: `4px solid ${p.color}` }}>
              <div className="font-bold text-sm mb-2" style={{ color: p.color, fontFamily: MONO }}>{p.name}</div>
              <div className="text-xs" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.6 }}>{p.desc}</div>
            </div>
          ))}
        </div>
        <SubHeading>Custom Presence Definitions</SubHeading>
        <Paragraph>Organizations can create custom presence sub-statuses under the system presences. For example, under "Away" you might create "Lunch", "Doctor Appointment", or "Personal Errand." Under "Busy" you might create "In Coaching Session" or "Project Work." Custom presences map to a parent system presence for routing purposes — a custom "Lunch" status maps to "Away" and prevents routing just like the base "Away" presence.</Paragraph>
        <SubHeading>On Queue Behavior</SubHeading>
        <div className="space-y-2 my-4">
          {ON_QUEUE_BEHAVIOR.map((b, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: b.color }} />
              <div className="flex-1">
                <span className="text-xs font-semibold" style={{ color: C.t1, fontFamily: MONO }}>{b.scenario}</span>
                <span className="text-xs mx-2" style={{ color: C.t3 }}> &rarr; </span>
                <span className="text-xs" style={{ color: C.t2, fontFamily: SANS }}>{b.result}</span>
              </div>
            </div>
          ))}
        </div>
        <CalloutBox type="tip">On Queue is a separate toggle from Presence. An agent can be "Available" (green presence) but "Off Queue" — meaning they are reachable for direct calls and collaboration, but will NOT receive ACD-routed interactions from queues. This is useful for agents doing non-queue work like outbound calls or administrative tasks.</CalloutBox>
      </section>

      {/* T2S6 */}
      <section ref={el => sectionRefs.current['t2s6'] = el} id="t2s6">
        <SectionHeading>External Contacts & Relationships</SectionHeading>
        <Paragraph>External Contacts is Genesys Cloud's built-in contact management system for people outside your organization — customers, vendors, partners, and prospects. When an interaction arrives, the system automatically matches the caller's number or email to an external contact record, providing agents with context before they even say hello.</Paragraph>
        <SubHeading>External Contact Fields</SubHeading>
        <InteractiveTable headers={['Field', 'Description']} rows={EXTERNAL_CONTACT_FIELDS} />
        <SubHeading>External Organizations</SubHeading>
        <Paragraph>External contacts can be grouped under External Organizations. An external org represents a company or entity (e.g., "Acme Corporation") and contains multiple individual contacts (e.g., "John Smith - CTO", "Jane Doe - Procurement Manager"). This enables company-level views: see all interactions with Acme Corp across all their contacts.</Paragraph>
        <SubHeading>Relationship Tracking</SubHeading>
        <Paragraph>Each external contact maintains a relationship history: every interaction (call, chat, email) linked to the contact, notes added by agents, custom fields tracking business data (contract value, support tier, renewal date), and timestamps showing last contact date. This creates a lightweight CRM capability built into the contact center platform.</Paragraph>
        <SubHeading>Merge & Deduplication</SubHeading>
        <Paragraph>When the same person is created as multiple external contact records (e.g., different phone numbers for the same person), administrators can merge records. The merge process combines all interaction history, notes, and custom data into a single unified record. To prevent duplicates proactively, standardize phone numbers to E.164 format (+1XXXXXXXXXX) and use consistent email addresses.</Paragraph>
        <CalloutBox type="info">External contacts are matched automatically on inbound interactions: phone number for voice calls, email address for emails, and social handle for messaging. Matched contacts appear in the agent's interaction panel with full history and notes. Agents can also create new external contact records during or after an interaction.</CalloutBox>
        <CalloutBox type="info">A new PATCH API endpoint enables partial updates to external contact records in the Genesys Cloud Customer Profile. Instead of replacing entire contact records with a PUT, integrations and services can now modify specific fields individually — reducing the risk of accidental data overwrites. This is particularly valuable for CRM synchronization and Architect workflows where only a subset of contact fields needs updating at a given time.</CalloutBox>
      </section>

      {/* T2S7 */}
      <section ref={el => sectionRefs.current['t2s7'] = el} id="t2s7">
        <SectionHeading>SCIM Provisioning & Identity</SectionHeading>
        <Paragraph>SCIM (System for Cross-domain Identity Management) 2.0 is the standard protocol for automating user lifecycle management. Instead of manually creating and deactivating users in Genesys Cloud, SCIM synchronizes your identity provider (Azure AD, Okta, OneLogin, PingFederate) with the Genesys Cloud directory — automatically.</Paragraph>
        <SubHeading>How SCIM Works</SubHeading>
        <div className="my-4 p-4 rounded-lg space-y-2" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
          {[
            '1. Identity Provider (IdP) is configured as the source of truth for user accounts',
            '2. SCIM connector is established: IdP → Genesys Cloud SCIM endpoint (OAuth 2.0 authenticated)',
            '3. Initial sync: all assigned users in the IdP are created in Genesys Cloud',
            '4. Ongoing sync: when a user is created/updated/deactivated in the IdP, changes push to Genesys Cloud',
            '5. Attribute mapping: IdP fields map to Genesys Cloud user profile fields (name, email, dept, manager)',
            '6. Deprovisioning: when a user is removed from the IdP scope, their Genesys Cloud account is deactivated',
          ].map((step, i) => <div key={i} className="text-xs" style={{ color: C.t2, fontFamily: MONO }}>{step}</div>)}
        </div>
        <SubHeading>SCIM Attribute Mapping</SubHeading>
        <InteractiveTable headers={['SCIM Attribute', 'Maps To', 'Notes']} rows={SCIM_ATTRIBUTES.map(a => [a.attribute, a.maps, a.notes])} />
        <SubHeading>Provider Setup Guides</SubHeading>
        <div className="flex gap-1 mb-3 overflow-x-auto flex-wrap">
          {SCIM_PROVIDERS.map((p, i) => (
            <button key={i} className="px-3 py-1.5 rounded text-xs whitespace-nowrap cursor-pointer transition-colors" onClick={() => setActiveProviderTab(i)} style={{ backgroundColor: activeProviderTab === i ? p.color : C.bg3, color: activeProviderTab === i ? '#fff' : C.t2, fontFamily: MONO }}>{p.name}</button>
          ))}
        </div>
        <div className="p-4 rounded-lg" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
          <div className="space-y-1">
            {SCIM_PROVIDERS[activeProviderTab].steps.map((s, j) => (
              <div key={j} className="text-xs flex items-start gap-2" style={{ color: C.t2, fontFamily: MONO }}>
                <ArrowRight size={10} style={{ color: C.blue, flexShrink: 0, marginTop: 3 }} />
                <span>{s}</span>
              </div>
            ))}
          </div>
        </div>
        <SubHeading>Auto-Provisioning Best Practices</SubHeading>
        <div className="space-y-1 my-3">
          {[
            { good: true, text: 'Use SCIM as the sole user creation method — avoid mixing manual creation with SCIM to prevent conflicts' },
            { good: true, text: 'Map the manager attribute to maintain org hierarchy automatically' },
            { good: true, text: 'Scope SCIM provisioning to specific IdP groups rather than syncing the entire directory' },
            { good: true, text: 'Test attribute mapping with a small pilot group before enabling org-wide sync' },
            { good: false, text: 'Don\'t manually edit SCIM-managed user attributes in Genesys Cloud — the next sync will overwrite your changes' },
            { good: false, text: 'Don\'t delete SCIM-managed users manually — deactivate them in the IdP and let SCIM propagate the change' },
            { good: false, text: 'Don\'t forget to assign roles separately — SCIM provisions user accounts but does NOT assign Genesys Cloud roles' },
          ].map((p, i) => (
            <div key={i} className="text-xs flex items-start gap-2" style={{ color: p.good ? C.green : C.red, fontFamily: SANS }}>
              <span>{p.good ? 'DO' : 'AVOID'}</span><span style={{ color: C.t2 }}>{p.text}</span>
            </div>
          ))}
        </div>
        <CalloutBox type="warning">
          <strong>Critical limitation:</strong> SCIM provisions user accounts and profile data only. It does NOT assign roles, divisions, queue memberships, skills, or phone configurations. After SCIM creates a user, an administrator (or automation via API) must still assign roles and configure the user for contact center operations.
        </CalloutBox>
      </section>

      {/* T2S8 */}
      <section ref={el => sectionRefs.current['t2s8'] = el} id="t2s8">
        <SectionHeading>API, Limits & Troubleshooting</SectionHeading>
        <Paragraph>The Genesys Cloud Directory API provides complete programmatic control over users, groups, locations, roles, divisions, presence, and external contacts. This enables automated provisioning, custom admin tools, and integration with HR and CRM systems.</Paragraph>
        <SubHeading>Key API Endpoints</SubHeading>
        <InteractiveTable searchable headers={['Method', 'Endpoint', 'Use']} rows={API_ENDPOINTS.map(e => [e.method, e.path, e.use])} />
        <SubHeading>Bulk Operations</SubHeading>
        <CodeBlock>{`// Example: Bulk assign roles to multiple users via API
// POST /api/v2/authorization/users/{userId}/roles
{
  "roles": [
    {
      "roleId": "role-uuid-agent",
      "divisionIds": ["division-uuid-support"]
    },
    {
      "roleId": "role-uuid-supervisor",
      "divisionIds": ["division-uuid-support", "division-uuid-sales"]
    }
  ]
}

// Example: Search users by department
// GET /api/v2/users?department=Support&pageSize=100&pageNumber=1`}</CodeBlock>
        <SubHeading>Platform Limits</SubHeading>
        <InteractiveTable searchable headers={['Resource', 'Limit', 'Notes']} rows={PLATFORM_LIMITS} />
        <SubHeading>Troubleshooting</SubHeading>
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
const GenesysDirectoryGuide = ({ onBack, isDark: isDarkProp, setIsDark: setIsDarkProp, initialNav }) => {
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
            <span className="font-bold text-sm hidden sm:block" style={{ fontFamily: MONO, color: C.blue }}>GENESYS DIRECTORY GUIDE</span>
            <span className="font-bold text-sm sm:hidden" style={{ fontFamily: MONO, color: C.blue }}>GC DIRECTORY</span>
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
      <Footer title="Genesys Cloud Directory & People — Interactive Knowledge Guide" />
    </div>
  );
};

export default GenesysDirectoryGuide;
