import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Rocket, Settings, Cpu, Search, ChevronDown, ChevronUp, ChevronRight,
  Menu, X, Phone, Mail, MessageSquare, Bell, RefreshCw, CheckCircle,
  AlertTriangle, AlertCircle, Info, Lightbulb, Star, ExternalLink,
  BookOpen, ArrowRight, ArrowDown, ArrowLeft, Circle, Zap, Shield, Clock, Users,
  FileText, Database, Activity, BarChart3, Target, PhoneCall, Monitor,
  Hash, Layers, Eye, ClipboardList, Volume2, Sun, Moon, GitBranch, Filter,
  Shuffle, UserCheck, Radio, Headphones, Globe, Calendar, Timer, TrendingUp,
  Award, Key, Lock, Unlock, MapPin, Terminal, Code, Package, GitMerge,
  FolderGit2, Play, Upload, Download, Server, Cog, Box, Repeat
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
const TIER_COLORS = ['#F97316', '#8B5CF6'];
const TIER_NAMES = ['Foundations', 'Configuration & Advanced'];
const TIER_SUBTITLES = [
  'The Big Picture — Infrastructure as Code for Contact Centers',
  'Deep Dive — Terraform Patterns, CI/CD Pipelines, and Environment Strategy',
];
const TIER_AUDIENCES = [
  'For everyone — understand why DevOps matters for CX',
  'For engineers, DevOps practitioners & power users',
];
const TIER_ICONS_KEYS = ['Rocket', 'Cpu'];

// ══════════════════════════════════════════════════════════════
// SECTION METADATA (all tiers)
// ══════════════════════════════════════════════════════════════
const SECTIONS = [
  { tier: 0, id: 't1s1', title: 'What Is CX as Code?' },
  { tier: 0, id: 't1s2', title: 'The Building Blocks — Key Components' },
  { tier: 0, id: 't1s3', title: 'Terraform for Genesys Cloud — Explained Simply' },
  { tier: 0, id: 't1s4', title: 'Archy CLI — Architect Flow Management' },
  { tier: 0, id: 't1s5', title: 'Key Terminology Glossary' },
  { tier: 1, id: 't2s1', title: 'Prerequisites & Setup' },
  { tier: 1, id: 't2s2', title: 'Terraform Provider — Deep Dive' },
  { tier: 1, id: 't2s3', title: 'Common Terraform Patterns' },
  { tier: 1, id: 't2s4', title: 'Archy CLI — Deep Dive' },
  { tier: 1, id: 't2s5', title: 'CI/CD Pipeline Design' },
  { tier: 1, id: 't2s6', title: 'Environment Management' },
  { tier: 1, id: 't2s7', title: 'Advanced Patterns' },
  { tier: 1, id: 't2s8', title: 'Platform Limits, Gotchas & Troubleshooting' },
];

// ══════════════════════════════════════════════════════════════
// T1 DATA
// ══════════════════════════════════════════════════════════════
const WHY_DEVOPS = [
  { icon: 'RefreshCw', label: 'Repeatability', desc: 'Deploy identical configurations across dev, staging, and production without manual steps' },
  { icon: 'GitBranch', label: 'Version Control', desc: 'Track every change to your contact center config in Git — who changed what, when, and why' },
  { icon: 'Shield', label: 'Auditability', desc: 'Pull requests, code reviews, and approval gates for every configuration change' },
  { icon: 'Zap', label: 'Speed', desc: 'Stand up a complete contact center environment in minutes instead of days of manual clicking' },
  { icon: 'Repeat', label: 'Disaster Recovery', desc: 'Rebuild your entire CX configuration from code if something goes catastrophically wrong' },
  { icon: 'Users', label: 'Collaboration', desc: 'Teams work on configuration in parallel using branches, merging changes through standard Git workflows' },
];

const COMPONENT_MAP_NODES = [
  { id: 'terraform', label: 'TERRAFORM', sub: 'Infrastructure provisioning', x: 400, y: 60 },
  { id: 'archy', label: 'ARCHY CLI', sub: 'Architect flow management', x: 130, y: 150 },
  { id: 'cicd', label: 'CI/CD', sub: 'Automated pipelines', x: 670, y: 150 },
  { id: 'git', label: 'GIT', sub: 'Version control', x: 80, y: 310 },
  { id: 'configmgmt', label: 'CONFIG MGMT', sub: 'Variable management', x: 110, y: 450 },
  { id: 'environments', label: 'ENVIRONMENTS', sub: 'Dev / staging / prod', x: 300, y: 540 },
  { id: 'pipeline', label: 'PIPELINE', sub: 'Plan / approve / apply', x: 720, y: 310 },
  { id: 'automation', label: 'AUTOMATION', sub: 'Scheduled runs / hooks', x: 690, y: 450 },
];
const COMPONENT_MAP_CENTER = { x: 400, y: 300 };

const COMPONENT_NODE_TOOLTIPS = {
  terraform: { explanation: 'HashiCorp Terraform with the Genesys Cloud provider — declares your entire CX configuration as .tf files that can be planned, applied, and versioned', analogy: 'The blueprint for your building — describes exactly what should exist' },
  archy: { explanation: 'A CLI tool for exporting, editing, and importing Architect flows as YAML files — bringing flow configuration into your version-controlled DevOps pipeline', analogy: 'A translator that converts visual flow diagrams into portable text files' },
  cicd: { explanation: 'Continuous Integration / Continuous Deployment pipelines (GitHub Actions, GitLab CI, Jenkins) that automatically validate and deploy configuration changes', analogy: 'The assembly line that builds, tests, and ships your product automatically' },
  git: { explanation: 'A distributed version control system that tracks every change to your configuration files — enabling collaboration, branching, history, and rollback', analogy: 'The logbook that records every modification to the ship\'s blueprint' },
  configmgmt: { explanation: 'Variable files, tfvars, and environment-specific overrides that let you parameterize configurations for different environments without duplicating code', analogy: 'The settings dial that adjusts the same machine for different operating conditions' },
  environments: { explanation: 'Isolated Genesys Cloud orgs or divisions for development, staging, and production — each with its own state and credentials', analogy: 'The dress rehearsal stage, the preview night, and the opening night — same show, different stakes' },
  pipeline: { explanation: 'The staged workflow: terraform plan (preview changes), human approval gate, terraform apply (execute changes) — ensuring no surprises in production', analogy: 'The preflight checklist: inspect, approve, then launch' },
  automation: { explanation: 'Scheduled pipeline runs for drift detection, webhook-triggered deploys on merge, and automated testing of configuration changes', analogy: 'The autopilot that monitors and adjusts without manual intervention' },
};

const TERRAFORM_LIFECYCLE = [
  { step: 1, title: 'WRITE CONFIGURATION', desc: 'Define your desired Genesys Cloud state in .tf files — queues, skills, users, wrap-up codes, flows, and their relationships', color: C.green, icon: 'Code' },
  { step: 2, title: 'TERRAFORM INIT', desc: 'Initialize the working directory: download the Genesys Cloud provider plugin, set up the backend for state storage, and prepare modules', color: C.blue, icon: 'Download' },
  { step: 3, title: 'TERRAFORM PLAN', desc: 'Generate an execution plan showing exactly what will be created, modified, or destroyed — without making any actual changes. This is your safety net.', color: C.yellow, icon: 'Eye' },
  { step: 4, title: 'REVIEW & APPROVE', desc: 'A human (or automated policy check) reviews the plan output. In CI/CD, this is typically a pull request review or a manual approval gate.', color: C.orange, icon: 'CheckCircle' },
  { step: 5, title: 'TERRAFORM APPLY', desc: 'Execute the approved plan: Terraform calls the Genesys Cloud APIs to create, update, or delete resources to match the desired state', color: C.purple, icon: 'Play' },
  { step: 6, title: 'STATE UPDATED', desc: 'Terraform records the current state of all managed resources in a state file. This is the source of truth for what Terraform "knows" it manages.', color: C.green, icon: 'Database' },
];

const ARCHY_OVERVIEW = [
  { title: 'Export Flows', desc: 'Export any Architect flow to a human-readable YAML file. The YAML includes every action, decision, prompt, and connection in the flow.', color: C.blue },
  { title: 'Edit as Code', desc: 'Modify flow logic by editing the YAML directly in your IDE. Add actions, change routing decisions, update prompts — all in text.', color: C.green },
  { title: 'Import & Publish', desc: 'Push YAML back into Genesys Cloud as a new or updated flow. Optionally publish immediately or leave as draft for review.', color: C.orange },
  { title: 'Version Control', desc: 'Store flow YAML in Git alongside Terraform configs. Track changes, review diffs, and roll back to any previous flow version.', color: C.purple },
];

const GLOSSARY = [
  { term: 'CX as Code', def: 'The practice of managing Genesys Cloud contact center configuration as version-controlled code files rather than through manual UI changes', tier: 'Tier 1' },
  { term: 'Terraform', def: 'An open-source infrastructure-as-code tool by HashiCorp that uses declarative configuration files to provision and manage cloud resources', tier: 'Tier 1' },
  { term: 'Provider', def: 'A Terraform plugin that translates resource declarations into API calls for a specific platform (e.g., genesyscloud provider)', tier: 'Tier 1' },
  { term: 'Resource', def: 'A single infrastructure object managed by Terraform — e.g., a queue, a skill, a user, a wrap-up code', tier: 'Tier 1' },
  { term: 'Data Source', def: 'A read-only Terraform query that fetches information about existing resources without managing them', tier: 'Tier 2' },
  { term: 'State File', def: 'A JSON file where Terraform records the current state of all resources it manages — the bridge between code and reality', tier: 'Tier 1' },
  { term: 'Plan', def: 'A preview of what Terraform will do: create, update, or destroy resources to match the desired configuration', tier: 'Tier 1' },
  { term: 'Apply', def: 'The action of executing a Terraform plan — making the actual API calls to provision or modify resources', tier: 'Tier 1' },
  { term: 'HCL', def: 'HashiCorp Configuration Language — the declarative syntax used to write Terraform configuration files (.tf)', tier: 'Tier 1' },
  { term: 'Archy', def: 'A Genesys CLI tool for exporting and importing Architect flows as YAML files, enabling version control for flow definitions', tier: 'Tier 1' },
  { term: 'Drift', def: 'When the actual state of resources in Genesys Cloud diverges from what is defined in the Terraform code (e.g., someone made a manual UI change)', tier: 'Tier 2' },
  { term: 'Remote State', def: 'Storing the Terraform state file in a shared backend (S3, Azure Blob, GCS) so multiple team members can collaborate safely', tier: 'Tier 2' },
  { term: 'Module', def: 'A reusable, self-contained package of Terraform configuration that encapsulates a common pattern (e.g., a "queue" module)', tier: 'Tier 2' },
  { term: 'tfvars', def: 'Variable definition files (.tfvars) that provide environment-specific values to parameterized Terraform configurations', tier: 'Tier 2' },
  { term: 'Backend', def: 'The storage mechanism for Terraform state — local file, S3 bucket, Azure Blob, Terraform Cloud, etc.', tier: 'Tier 2' },
  { term: 'OAuth Client Credentials', def: 'The authentication method used by Terraform and Archy to access the Genesys Cloud API — a client ID and secret with specific role permissions', tier: 'Tier 1' },
  { term: 'Idempotent', def: 'Running the same Terraform apply multiple times produces the same result — if nothing changed in code, nothing changes in the cloud', tier: 'Tier 2' },
  { term: 'Import', def: 'The process of bringing an existing manually-created Genesys Cloud resource under Terraform management without recreating it', tier: 'Tier 2' },
];

// ══════════════════════════════════════════════════════════════
// T2 DATA
// ══════════════════════════════════════════════════════════════
const PREREQUISITES = [
  { title: 'Terraform Installed', detail: 'Install Terraform CLI v1.0+ from terraform.io. Verify with "terraform version". Terraform is a single binary — no runtime dependencies. Supports Windows, macOS, and Linux. Recommended: use a version manager like tfenv to pin versions across your team.' },
  { title: 'Genesys Cloud OAuth Credentials', detail: 'Create an OAuth Client in Genesys Cloud Admin > Integrations > OAuth. Grant type: Client Credentials. Assign a role with permissions for all resources you plan to manage (e.g., Admin role for full access, or a custom role scoped to specific resources). Save the Client ID and Client Secret — you will need both for Terraform provider configuration.' },
  { title: 'Genesys Cloud Terraform Provider', detail: 'Add the provider block to your Terraform config. The provider is published on the Terraform Registry as "mypurecloud/genesyscloud". Run "terraform init" to download it. Configure with your OAuth credentials and Genesys Cloud region (e.g., us-east-1, eu-west-1, ap-southeast-2).' },
  { title: 'Archy CLI Installed', detail: 'Install Archy via npm: "npm install -g gc-archy" or download from the Genesys Cloud Developer Center. Configure with "archy setup" providing your Genesys Cloud region and OAuth credentials. Verify with "archy version".' },
  { title: 'Git Repository Initialized', detail: 'Create a Git repository for your CX configuration. Structure: /terraform for .tf files, /flows for Archy YAML exports, /environments for per-env tfvars. Add .gitignore for state files, .terraform directories, and credential files.' },
];

const RESOURCE_TYPES = [
  { resource: 'genesyscloud_routing_queue', desc: 'Queues with members, skills, bullseye rings, ACW settings, media settings', category: 'Routing' },
  { resource: 'genesyscloud_routing_skill', desc: 'ACD skills that can be assigned to agents for skill-based routing', category: 'Routing' },
  { resource: 'genesyscloud_routing_language', desc: 'Languages for language-based routing with proficiency levels', category: 'Routing' },
  { resource: 'genesyscloud_routing_wrapupcode', desc: 'Wrap-up codes for interaction disposition tracking', category: 'Routing' },
  { resource: 'genesyscloud_user', desc: 'User accounts with roles, skills, languages, phone, and queue assignments', category: 'Users' },
  { resource: 'genesyscloud_group', desc: 'Groups for queue membership, permissions, and organizational structure', category: 'Users' },
  { resource: 'genesyscloud_flow', desc: 'Architect flows deployed from Archy YAML or CX as Code flow resources', category: 'Flows' },
  { resource: 'genesyscloud_architect_schedules', desc: 'Business hours schedules with time blocks and timezone settings', category: 'Flows' },
  { resource: 'genesyscloud_architect_schedulegroups', desc: 'Schedule groups combining schedules and holiday schedules', category: 'Flows' },
  { resource: 'genesyscloud_telephony_providers_edges_did_pool', desc: 'DID number pools for telephony assignment', category: 'Telephony' },
  { resource: 'genesyscloud_auth_division', desc: 'Access control divisions for resource isolation', category: 'Admin' },
  { resource: 'genesyscloud_oauth_client', desc: 'OAuth clients for API integrations and data actions', category: 'Admin' },
];

const TERRAFORM_PATTERNS_QUEUE = `resource "genesyscloud_routing_queue" "support_voice" {
  name                = "Support_Voice_\${var.environment}"
  description         = "Tier 1 voice support queue"
  acw_wrapup_prompt   = "MANDATORY_TIMEOUT"
  acw_timeout_ms      = 30000
  skill_evaluation_method = "BEST"
  auto_answer_only    = false
  enable_transcription = true

  media_settings_call {
    alerting_timeout_sec  = 8
    service_level_percentage = 0.8
    service_level_duration_ms = 20000
  }

  bullseye_rings {
    expansion_timeout_seconds = 15
    skills_to_remove          = []
  }
  bullseye_rings {
    expansion_timeout_seconds = 30
    skills_to_remove          = [genesyscloud_routing_skill.tier2.id]
  }
  bullseye_rings {
    expansion_timeout_seconds = 60
  }

  members {
    user_id  = genesyscloud_user.agent_smith.id
    ring_num = 1
  }
}`;

const TERRAFORM_PATTERNS_SKILL = `resource "genesyscloud_routing_skill" "billing" {
  name = "Billing"
}

resource "genesyscloud_routing_skill" "technical" {
  name = "Technical_Support"
}

resource "genesyscloud_routing_skill" "tier2" {
  name = "Tier2_Escalation"
}

# Assign skills to a user
resource "genesyscloud_user_roles" "agent_smith_skills" {
  user_id = genesyscloud_user.agent_smith.id
  # Skills assigned via routing_skill resources + user config
}`;

const TERRAFORM_PATTERNS_WRAPUP = `resource "genesyscloud_routing_wrapupcode" "resolved" {
  name = "Resolved_First_Contact"
}

resource "genesyscloud_routing_wrapupcode" "escalation" {
  name = "Escalation_Required"
}

resource "genesyscloud_routing_wrapupcode" "callback" {
  name = "Callback_Scheduled"
}`;

const ARCHY_COMMANDS = [
  { cmd: 'archy export', desc: 'Export a flow to YAML file', example: 'archy export --flowName "Main_IVR" --flowType inboundcall --exportDir ./flows' },
  { cmd: 'archy import', desc: 'Import a YAML flow into Genesys Cloud', example: 'archy import --file ./flows/Main_IVR.yaml' },
  { cmd: 'archy publish', desc: 'Import AND publish a flow in one step', example: 'archy publish --file ./flows/Main_IVR.yaml' },
  { cmd: 'archy export --all', desc: 'Bulk export all flows of a type', example: 'archy export --flowType inboundcall --exportAll --exportDir ./flows/inbound' },
  { cmd: 'archy validate', desc: 'Validate a YAML flow without importing', example: 'archy validate --file ./flows/Main_IVR.yaml' },
  { cmd: 'archy version', desc: 'Check installed Archy version', example: 'archy version' },
];

const ARCHY_YAML_EXAMPLE = `inboundCall:
  name: Support_IVR
  defaultLanguage: en-us
  startUpRef: /inboundCall/menus/menu[Main Menu]
  initialGreeting:
    tts: "Thank you for calling support."
  menus:
    - menu:
        name: Main Menu
        audio:
          tts: "Press 1 for billing. Press 2 for technical."
        choices:
          - choice:
              dtmf: digit_1
              targetTask:
                ref: /inboundCall/tasks/task[Route Billing]
          - choice:
              dtmf: digit_2
              targetTask:
                ref: /inboundCall/tasks/task[Route Technical]
  tasks:
    - task:
        name: Route Billing
        actions:
          - transferToAcd:
              name: Transfer to Billing Queue
              queue:
                lit:
                  name: Billing_Voice`;

const CICD_GITHUB_ACTIONS = `name: Deploy CX Configuration
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  GENESYSCLOUD_OAUTHCLIENT_ID: \${{ secrets.GC_CLIENT_ID }}
  GENESYSCLOUD_OAUTHCLIENT_SECRET: \${{ secrets.GC_CLIENT_SECRET }}
  GENESYSCLOUD_REGION: us-east-1

jobs:
  plan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: hashicorp/setup-terraform@v3
      - run: terraform init
      - run: terraform plan -var-file=env/prod.tfvars -out=tfplan
      - uses: actions/upload-artifact@v4
        with:
          name: tfplan
          path: tfplan

  apply:
    needs: plan
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    environment: production  # Requires manual approval
    steps:
      - uses: actions/checkout@v4
      - uses: hashicorp/setup-terraform@v3
      - uses: actions/download-artifact@v4
        with:
          name: tfplan
      - run: terraform init
      - run: terraform apply -auto-approve tfplan`;

const ENV_STRATEGY = [
  { env: 'Development', purpose: 'Experimentation and rapid iteration. Safe to break.', state: 'Local or shared dev bucket', credentials: 'Dev org OAuth client', promotion: 'Merge feature branch to dev branch', color: C.green },
  { env: 'Staging', purpose: 'Pre-production validation. Mirrors prod configuration.', state: 'Shared staging bucket', credentials: 'Staging org OAuth client', promotion: 'PR from dev to staging branch, requires 1 approval', color: C.yellow },
  { env: 'Production', purpose: 'Live customer-facing environment. Changes require approval.', state: 'Isolated prod bucket with versioning + locking', credentials: 'Prod org OAuth client (restricted access)', promotion: 'PR from staging to main, requires 2 approvals + plan review', color: C.red },
];

const ADVANCED_PATTERNS = [
  {
    title: 'Module Composition',
    steps: ['Create a "queue" module that encapsulates queue + skills + wrap-up codes + members', 'Parameterize with variables: queue_name, skills_list, acw_mode, bullseye_rings', 'Call the module multiple times with different variable values for each queue', 'Store modules in a shared Git repository for reuse across orgs', 'Pin module versions using Git tags: source = "git::https://github.com/org/modules.git//queue?ref=v1.2.0"'],
  },
  {
    title: 'Import Existing Resources',
    steps: ['Identify manually-created resources to bring under Terraform management', 'Write the resource block in .tf matching the existing resource', 'Run: terraform import genesyscloud_routing_queue.support_voice <queue-id>', 'Run terraform plan to verify — should show "No changes" if config matches', 'Fix any drift between your .tf code and the actual resource state'],
  },
  {
    title: 'Remote State & Collaboration',
    steps: ['Configure an S3/Azure Blob/GCS backend for shared state storage', 'Enable state locking (DynamoDB for S3, built-in for Azure/GCS) to prevent concurrent modifications', 'Use terraform_remote_state data source to reference outputs from other state files', 'Separate state per environment: dev.tfstate, staging.tfstate, prod.tfstate', 'Enable state file versioning for point-in-time recovery'],
  },
  {
    title: 'Blue/Green Deployment Pattern',
    steps: ['Maintain two parallel sets of queues: "blue" (current live) and "green" (new version)', 'Deploy changes to the green environment while blue continues serving traffic', 'Validate green: test routing, confirm agent assignments, verify flow behavior', 'Switch traffic by updating Architect flow to route to green queues', 'If issues arise, instantly switch back to blue queues — near-zero downtime'],
  },
];

const PLATFORM_LIMITS = [
  ['Terraform provider version', 'Keep current (monthly releases)', 'Check registry for latest'],
  ['API rate limits', '300 requests/min (org-wide)', 'Terraform auto-retries on 429'],
  ['Concurrent Terraform applies', '1 per state file', 'Use state locking to enforce'],
  ['Resources per Terraform state', '~500-1000 recommended', 'Split larger orgs into multiple states'],
  ['Archy flow export size', 'No hard limit', 'Very large flows may timeout — export incrementally'],
  ['Archy concurrent operations', '1 (CLI is single-threaded)', 'Script sequential operations in CI/CD'],
  ['OAuth token lifetime', '24 hours', 'Terraform provider auto-refreshes'],
  ['State file size', 'No hard limit', 'Large states slow plan/apply — split when > 5MB'],
  ['Terraform plan timeout', '10 minutes (default)', 'Increase with -parallelism flag for large configs'],
  ['Max Architect flows per org', '1,000', 'Across all flow types'],
  ['Environment variables', 'GENESYSCLOUD_OAUTHCLIENT_ID, _SECRET, _REGION', 'Set in CI/CD secrets, never in code'],
];

const TROUBLESHOOTING = [
  { symptom: 'Terraform plan shows unexpected changes / wants to recreate resources', investigation: 'Check: Has someone modified the resource manually in the Genesys Cloud UI? (drift) --> Run terraform refresh to update state. Is the provider version different? (breaking changes between versions) --> Pin provider version in required_providers. Are you using the correct state file? (wrong environment state) --> Verify backend configuration. Does the resource ID in state still exist? --> terraform state show <resource> to inspect.' },
  { symptom: 'Terraform apply fails with 409 Conflict', investigation: 'Check: Is another Terraform process running against the same state? (state lock collision) --> Wait for the other process or force-unlock if it crashed. Is a resource being modified concurrently by the UI or API? --> Retry the apply. Does the resource have a dependency that was not yet created? --> Check resource ordering with depends_on.' },
  { symptom: 'Terraform apply fails with 403 Forbidden', investigation: 'Check: Does the OAuth client have the required permissions? --> Verify role assignments in Admin > Integrations > OAuth. Is the resource in a division the OAuth client cannot access? --> Add division permissions. Has the OAuth client secret been rotated? --> Update credentials in CI/CD secrets. Is the token expired? --> Provider auto-refreshes, but check network connectivity.' },
  { symptom: 'Archy import fails with validation errors', investigation: 'Check: Is the YAML syntax valid? (indentation, quoting) --> Validate with "archy validate". Do referenced resources exist? (queues, skills, data actions) --> Create dependencies first via Terraform. Is the flow type correct? (inboundcall vs inboundchat) --> Verify YAML root key matches flow type. Is the Archy version compatible with the YAML format? --> Update Archy to latest.' },
  { symptom: 'State file is corrupted or out of sync', investigation: 'Check: Do you have state versioning enabled? --> Restore from a previous version in S3/Blob storage. Can you reconstruct state? --> Use "terraform import" to re-import each resource. Is the state locked by a crashed process? --> Use "terraform force-unlock <lock-id>" with caution. Consider: terraform state pull > backup.json before any recovery steps.' },
  { symptom: 'CI/CD pipeline times out during terraform apply', investigation: 'Check: How many resources are being created/modified? (large configs are slow) --> Increase pipeline timeout, or split into smaller states. Are API rate limits being hit? --> Reduce parallelism with -parallelism=5. Is the Genesys Cloud region experiencing latency? --> Check status.genesys.com. Are there circular dependencies causing infinite waits? --> Review resource dependency graph with terraform graph.' },
];

// ══════════════════════════════════════════════════════════════
// SEARCH INDEX
// ══════════════════════════════════════════════════════════════
const SEARCH_INDEX = (() => {
  const idx = [];
  SECTIONS.forEach(s => idx.push({ text: s.title, label: s.title, sectionId: s.id, tier: s.tier, type: 'Section' }));
  WHY_DEVOPS.forEach(w => idx.push({ text: `${w.label} ${w.desc}`, label: w.label, sectionId: 't1s1', tier: 0, type: 'DevOps Benefit' }));
  COMPONENT_MAP_NODES.forEach(n => idx.push({ text: `${n.label} ${n.sub}`, label: n.label, sectionId: 't1s2', tier: 0, type: 'Component' }));
  Object.entries(COMPONENT_NODE_TOOLTIPS).forEach(([k, v]) => idx.push({ text: `${k} ${v.explanation} ${v.analogy}`, label: k, sectionId: 't1s2', tier: 0, type: 'Component Tooltip' }));
  TERRAFORM_LIFECYCLE.forEach(s => idx.push({ text: `${s.title} ${s.desc}`, label: s.title, sectionId: 't1s3', tier: 0, type: 'Terraform Step' }));
  ARCHY_OVERVIEW.forEach(a => idx.push({ text: `${a.title} ${a.desc}`, label: a.title, sectionId: 't1s4', tier: 0, type: 'Archy Feature' }));
  GLOSSARY.forEach(g => idx.push({ text: `${g.term} ${g.def}`, label: g.term, sectionId: 't1s5', tier: 0, type: 'Glossary' }));
  PREREQUISITES.forEach(p => idx.push({ text: `${p.title} ${p.detail}`, label: p.title, sectionId: 't2s1', tier: 1, type: 'Prerequisite' }));
  RESOURCE_TYPES.forEach(r => idx.push({ text: `${r.resource} ${r.desc} ${r.category}`, label: r.resource, sectionId: 't2s2', tier: 1, type: 'Terraform Resource' }));
  ARCHY_COMMANDS.forEach(c => idx.push({ text: `${c.cmd} ${c.desc} ${c.example}`, label: c.cmd, sectionId: 't2s4', tier: 1, type: 'CLI Command' }));
  ENV_STRATEGY.forEach(e => idx.push({ text: `${e.env} ${e.purpose} ${e.state} ${e.promotion}`, label: e.env, sectionId: 't2s6', tier: 1, type: 'Environment' }));
  ADVANCED_PATTERNS.forEach(p => idx.push({ text: `${p.title} ${p.steps.join(' ')}`, label: p.title, sectionId: 't2s7', tier: 1, type: 'Advanced Pattern' }));
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

const ExpandableCard = ({ title, defaultOpen = false, accent = C.purple, children }) => {
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
const CXCodeComponentMapSVG = () => {
  const [active, setActive] = useState(null);
  return (
    <div className="my-6 overflow-x-auto">
      <svg viewBox="0 0 800 600" className="w-full" style={{ maxWidth: 800, minWidth: 600 }}>
        <defs>
          <filter id="glow-c"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        {COMPONENT_MAP_NODES.map(n => (
          <line key={`line-${n.id}`} x1={COMPONENT_MAP_CENTER.x} y1={COMPONENT_MAP_CENTER.y} x2={n.x} y2={n.y} stroke={C.border} strokeWidth="2" strokeDasharray="6,4" />
        ))}
        <g>
          <rect x={COMPONENT_MAP_CENTER.x - 80} y={COMPONENT_MAP_CENTER.y - 30} width={160} height={60} rx={12} fill={C.bg3} stroke={C.purple} strokeWidth={2} />
          <text x={COMPONENT_MAP_CENTER.x} y={COMPONENT_MAP_CENTER.y - 5} textAnchor="middle" fill={C.t1} fontFamily={MONO} fontSize={13} fontWeight="bold">CX AS CODE</text>
          <text x={COMPONENT_MAP_CENTER.x} y={COMPONENT_MAP_CENTER.y + 15} textAnchor="middle" fill={C.t3} fontFamily={SANS} fontSize={10}>The DevOps engine</text>
        </g>
        {COMPONENT_MAP_NODES.map(n => {
          const isActive = active === n.id;
          const tooltip = COMPONENT_NODE_TOOLTIPS[n.id];
          return (
            <g key={n.id} className="cursor-pointer" onClick={() => setActive(isActive ? null : n.id)} style={{ transition: 'transform 0.2s' }}>
              <rect x={n.x - 70} y={n.y - 25} width={140} height={50} rx={8} fill={C.bg2} stroke={isActive ? C.purple : C.border} strokeWidth={isActive ? 2 : 1} filter={isActive ? 'url(#glow-c)' : undefined} />
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
      <SectionHeading>What Is CX as Code?</SectionHeading>
      <Paragraph>CX as Code is the practice of managing your Genesys Cloud contact center configuration as version-controlled code files rather than through manual clicks in the admin UI. Think of it as the difference between hand-drawing a building on a napkin every time versus having a precise, repeatable blueprint that an automated factory can execute identically on demand.</Paragraph>
      <Paragraph>In a traditional Genesys Cloud deployment, an administrator logs into the UI, clicks through forms to create queues, skills, users, wrap-up codes, and flows, then repeats the entire process for staging and production environments. CX as Code replaces this with declarative configuration files that describe the DESIRED state of your contact center. Tools like Terraform and Archy then make reality match that desired state automatically.</Paragraph>
      <SubHeading>Why DevOps Matters for CX</SubHeading>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        {[
          { title: 'MANUAL CONFIGURATION', items: ['Click-by-click in the admin UI', 'No audit trail for changes', 'Impossible to replicate exactly across environments', 'Single person bottleneck — the "admin who knows where everything is"', 'Disaster recovery: rebuild from memory and screenshots'], color: C.red },
          { title: 'CX AS CODE (DEVOPS)', items: ['Declarative config files in Git', 'Full change history with who, what, when, and why', 'Identical environments from the same code', 'Team collaboration via branches, PRs, and code reviews', 'Disaster recovery: terraform apply and rebuild in minutes'], color: C.purple },
        ].map((panel, i) => (
          <div key={i} className="rounded-lg p-5" style={{ backgroundColor: C.bg2, borderTop: `3px solid ${panel.color}` }}>
            <div className="font-bold mb-3 text-sm" style={{ color: panel.color, fontFamily: MONO }}>{panel.title}</div>
            {panel.items.map((item, j) => <div key={j} className="text-sm mb-1.5" style={{ color: C.t2, fontFamily: SANS }}>{item}</div>)}
          </div>
        ))}
      </div>
      <SubHeading>Key Benefits</SubHeading>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 my-4">
        {WHY_DEVOPS.map((ch, i) => (
          <div key={i} className="rounded-lg p-4 flex items-start gap-3 transition-all duration-200 hover:-translate-y-0.5" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
            <RefreshCw size={20} style={{ color: C.purple, flexShrink: 0 }} />
            <div><div className="font-semibold text-sm" style={{ color: C.t1, fontFamily: MONO }}>{ch.label}</div><div className="text-xs mt-1" style={{ color: C.t2, fontFamily: SANS }}>{ch.desc}</div></div>
          </div>
        ))}
      </div>
      <CalloutBox type="tip">CX as Code does not replace the Genesys Cloud UI — it augments it. You can still use the UI for one-off investigations, real-time monitoring, and ad-hoc changes. But for repeatable, auditable, multi-environment deployments, code is king.</CalloutBox>
    </section>

    {/* T1S2 */}
    <section ref={el => sectionRefs.current['t1s2'] = el} id="t1s2">
      <SectionHeading>The Building Blocks — Key Components</SectionHeading>
      <Paragraph>CX as Code is built from several interconnected tools and practices. No single piece works alone — they combine to create a complete DevOps pipeline for your contact center. Think of it like a modern software delivery pipeline: source control holds the code, CI/CD automates the build, and infrastructure-as-code tools provision the environment.</Paragraph>
      <CalloutBox type="tip">Click any node in the diagram below to see what it does and a simple analogy.</CalloutBox>
      <CXCodeComponentMapSVG />
      <SubHeading>Component Reference</SubHeading>
      <InteractiveTable
        headers={['Component', 'Simple Explanation', 'Analogy']}
        rows={Object.entries(COMPONENT_NODE_TOOLTIPS).map(([k, v]) => {
          const node = COMPONENT_MAP_NODES.find(n => n.id === k);
          return [node?.label || k, v.explanation, v.analogy];
        })}
      />
    </section>

    {/* T1S3 */}
    <section ref={el => sectionRefs.current['t1s3'] = el} id="t1s3">
      <SectionHeading>Terraform for Genesys Cloud — Explained Simply</SectionHeading>
      <Paragraph>Terraform is a tool that lets you describe WHAT your contact center should look like in text files, and then automatically makes it happen. Instead of clicking buttons in the Genesys Cloud admin UI, you write a configuration file that says "I want a queue called Support_Voice with these skills and these agents" — and Terraform creates it for you.</Paragraph>
      <SubHeading>Declarative vs Imperative</SubHeading>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        {[
          { title: 'IMPERATIVE (Manual)', items: ['Step 1: Log into admin UI', 'Step 2: Click Routing > Queues > Create', 'Step 3: Type "Support_Voice" in name field', 'Step 4: Set evaluation method to Best Available', 'Step 5: Add agents one by one...', '(Repeat for every environment)'], color: C.orange },
          { title: 'DECLARATIVE (Terraform)', items: ['Write: resource "queue" { name = "Support_Voice" }', 'Run: terraform plan (preview changes)', 'Run: terraform apply (make it happen)', 'Same config deploys to dev, staging, prod', 'Changes tracked in Git automatically', 'Rollback: revert the Git commit and re-apply'], color: C.purple },
        ].map((panel, i) => (
          <div key={i} className="rounded-lg p-5" style={{ backgroundColor: C.bg2, borderTop: `3px solid ${panel.color}` }}>
            <div className="font-bold mb-3 text-sm" style={{ color: panel.color, fontFamily: MONO }}>{panel.title}</div>
            {panel.items.map((item, j) => <div key={j} className="text-sm mb-1.5" style={{ color: C.t2, fontFamily: SANS }}>{item}</div>)}
          </div>
        ))}
      </div>
      <SubHeading>The Terraform Lifecycle</SubHeading>
      <Paragraph>Every Terraform deployment follows the same lifecycle: Write, Init, Plan, Review, Apply, State Updated. This predictable cycle is what makes Terraform safe and reliable.</Paragraph>
      <div className="my-6 space-y-0">
        {TERRAFORM_LIFECYCLE.map((s, i) => (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: s.color + '22', color: s.color, border: `2px solid ${s.color}`, fontFamily: MONO }}>{s.step}</div>
              {i < TERRAFORM_LIFECYCLE.length - 1 && <div className="w-0.5 flex-1 my-1" style={{ backgroundColor: C.border }} />}
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
          <div className="font-bold text-sm" style={{ color: C.green, fontFamily: MONO }}>CONFIGURATION DEPLOYED — DESIRED STATE ACHIEVED</div>
        </div>
      </div>
      <SubHeading>State Management — The Source of Truth</SubHeading>
      <Paragraph>Terraform maintains a "state file" that records every resource it manages. This file is the bridge between your code and reality. When you run terraform plan, Terraform compares your .tf files (desired state) against the state file (known state) and the actual Genesys Cloud resources (real state) to determine what needs to change. Never edit the state file manually — let Terraform manage it.</Paragraph>
      <CalloutBox type="warning">The state file contains sensitive information (resource IDs, configuration values). Never commit it to Git. Use a remote backend (S3, Azure Blob, Terraform Cloud) for team collaboration, and enable encryption at rest.</CalloutBox>
    </section>

    {/* T1S4 */}
    <section ref={el => sectionRefs.current['t1s4'] = el} id="t1s4">
      <SectionHeading>Archy CLI — Architect Flow Management</SectionHeading>
      <Paragraph>While Terraform manages infrastructure resources (queues, skills, users), Archy handles the other critical piece: Architect flows. Archy is a command-line tool that exports Genesys Cloud Architect flows to YAML files and imports them back. This means your IVR logic, routing decisions, and call flows can live in version control alongside your Terraform configuration.</Paragraph>
      <SubHeading>What Archy Does</SubHeading>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
        {ARCHY_OVERVIEW.map((a, i) => (
          <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, borderLeft: `4px solid ${a.color}` }}>
            <div className="font-bold text-sm mb-2" style={{ color: a.color, fontFamily: MONO }}>{a.title}</div>
            <div className="text-xs" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.6 }}>{a.desc}</div>
          </div>
        ))}
      </div>
      <SubHeading>The Flow-as-Code Workflow</SubHeading>
      <div className="flex flex-wrap items-center gap-1 my-4 overflow-x-auto">
        {['Design in Architect UI', 'archy export', 'Edit YAML in IDE', 'Commit to Git', 'PR Review', 'archy publish', 'Flow Live'].map((s, i) => (
          <React.Fragment key={i}>
            <span className="px-3 py-1.5 rounded text-xs whitespace-nowrap" style={{ backgroundColor: C.bg3, color: C.t1, fontFamily: MONO, border: `1px solid ${C.border}` }}>{s}</span>
            {i < 6 && <ArrowRight size={14} style={{ color: C.t3, flexShrink: 0 }} />}
          </React.Fragment>
        ))}
      </div>
      <CalloutBox type="info">Archy and Terraform are complementary tools. Terraform provisions the infrastructure (queues, skills, schedules) that flows reference. Archy provisions the flows themselves. A complete CX as Code pipeline uses both together — Terraform first (create the queues), then Archy (deploy the flows that route to those queues).</CalloutBox>
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
  const [activePatternTab, setActivePatternTab] = useState(0);
  const patternTabs = ['Queue', 'Skills', 'Wrap-Up Codes'];
  const patternCode = [TERRAFORM_PATTERNS_QUEUE, TERRAFORM_PATTERNS_SKILL, TERRAFORM_PATTERNS_WRAPUP];
  return (
    <div className="space-y-16">
      {/* T2S1 */}
      <section ref={el => sectionRefs.current['t2s1'] = el} id="t2s1">
        <SectionHeading>Prerequisites & Setup</SectionHeading>
        <Paragraph>Before building your CX as Code pipeline, these tools and credentials must be in place. Think of this as installing the workshop tools before building the furniture.</Paragraph>
        <div className="space-y-3 my-4">
          {PREREQUISITES.map((p, i) => (
            <ExpandableCard key={i} title={`${i + 1}. ${p.title}`} accent={C.purple}>
              {p.detail}
            </ExpandableCard>
          ))}
        </div>
        <SubHeading>Minimal Provider Configuration</SubHeading>
        <CodeBlock>{`terraform {
  required_providers {
    genesyscloud = {
      source  = "mypurecloud/genesyscloud"
      version = "~> 1.0"  # Pin to latest stable major
    }
  }
  backend "s3" {
    bucket = "my-gc-terraform-state"
    key    = "prod/terraform.tfstate"
    region = "us-east-1"
    encrypt = true
    dynamodb_table = "terraform-locks"
  }
}

provider "genesyscloud" {
  oauthclient_id     = var.gc_client_id
  oauthclient_secret = var.gc_client_secret
  aws_region         = var.gc_region  # e.g., "us-east-1"
}`}</CodeBlock>
        <CalloutBox type="warning">Never hardcode OAuth credentials in .tf files. Use environment variables (GENESYSCLOUD_OAUTHCLIENT_ID, GENESYSCLOUD_OAUTHCLIENT_SECRET), tfvars files excluded from Git, or CI/CD secret managers.</CalloutBox>
      </section>

      {/* T2S2 */}
      <section ref={el => sectionRefs.current['t2s2'] = el} id="t2s2">
        <SectionHeading>Terraform Provider — Deep Dive</SectionHeading>
        <Paragraph>The Genesys Cloud Terraform provider translates HCL resource declarations into Genesys Cloud Platform API calls. It supports a comprehensive set of resource types covering routing, users, telephony, integrations, and administration.</Paragraph>
        <SubHeading>Key Resource Types</SubHeading>
        <InteractiveTable searchable headers={['Resource', 'Description', 'Category']} rows={RESOURCE_TYPES.map(r => [r.resource, r.desc, r.category])} />
        <SubHeading>Data Sources</SubHeading>
        <Paragraph>Data sources let you READ existing Genesys Cloud resources without managing them. This is essential for referencing resources created outside Terraform (like the default division or pre-existing skills).</Paragraph>
        <CodeBlock>{`# Look up an existing queue by name (read-only)
data "genesyscloud_routing_queue" "existing_support" {
  name = "Support_Voice_Legacy"
}

# Reference its ID in another resource
resource "genesyscloud_routing_queue" "overflow" {
  name        = "Support_Voice_Overflow"
  description = "Overflow for \${data.genesyscloud_routing_queue.existing_support.name}"
  # ...
}`}</CodeBlock>
        <SubHeading>Dependencies & Lifecycle</SubHeading>
        <Paragraph>Terraform automatically detects dependencies between resources. If a queue references a skill, Terraform creates the skill first. For implicit dependencies (not visible in resource attributes), use the depends_on meta-argument. Lifecycle blocks control how Terraform handles updates: prevent_destroy protects critical resources, create_before_destroy ensures zero-downtime replacements, and ignore_changes excludes attributes managed outside Terraform.</Paragraph>
        <CodeBlock>{`resource "genesyscloud_routing_queue" "critical_queue" {
  name = "VIP_Support"
  # ...
  lifecycle {
    prevent_destroy = true  # Terraform will refuse to delete this
    ignore_changes  = [members]  # Members managed via UI, not Terraform
  }
}`}</CodeBlock>
        <CalloutBox type="info">Use ignore_changes strategically: if supervisors manage queue membership in the UI, add "members" to ignore_changes so Terraform does not overwrite their assignments on every apply.</CalloutBox>
      </section>

      {/* T2S3 */}
      <section ref={el => sectionRefs.current['t2s3'] = el} id="t2s3">
        <SectionHeading>Common Terraform Patterns</SectionHeading>
        <Paragraph>These are the most common resource configurations you will write when managing Genesys Cloud with Terraform. Click through the tabs to see patterns for queues, skills, and wrap-up codes.</Paragraph>
        <div className="flex gap-1 mb-3 overflow-x-auto flex-wrap">
          {patternTabs.map((t, i) => (
            <button key={i} className="px-3 py-1.5 rounded text-xs whitespace-nowrap cursor-pointer transition-colors" onClick={() => setActivePatternTab(i)} style={{ backgroundColor: activePatternTab === i ? C.purple : C.bg3, color: activePatternTab === i ? '#fff' : C.t2, fontFamily: MONO }}>{t}</button>
          ))}
        </div>
        <CodeBlock>{patternCode[activePatternTab]}</CodeBlock>
        <SubHeading>Variable Parameterization</SubHeading>
        <Paragraph>Parameterize your configurations so the same code works across environments. Use variables for environment names, queue prefixes, and any value that differs between dev, staging, and production.</Paragraph>
        <CodeBlock>{`variable "environment" {
  description = "Target environment (dev, staging, prod)"
  type        = string
}

variable "gc_region" {
  description = "Genesys Cloud region"
  type        = string
  default     = "us-east-1"
}

variable "acw_timeout_ms" {
  description = "After-call work timeout in milliseconds"
  type        = number
  default     = 30000
}

# Usage: terraform apply -var-file=env/prod.tfvars`}</CodeBlock>
        <CalloutBox type="tip">Create a .tfvars file for each environment: env/dev.tfvars, env/staging.tfvars, env/prod.tfvars. Each file overrides the same variables with environment-specific values. This is the single most important pattern for multi-environment management.</CalloutBox>
      </section>

      {/* T2S4 */}
      <section ref={el => sectionRefs.current['t2s4'] = el} id="t2s4">
        <SectionHeading>Archy CLI — Deep Dive</SectionHeading>
        <Paragraph>Archy is the bridge between visual flow design in Architect and version-controlled flow-as-code. This section covers the complete command reference, YAML structure, and advanced bulk operations.</Paragraph>
        <SubHeading>Command Reference</SubHeading>
        <div className="space-y-2 my-4">
          {ARCHY_COMMANDS.map((c, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
              <div className="font-semibold text-sm mb-1" style={{ color: C.purple, fontFamily: MONO }}>{c.cmd}</div>
              <div className="text-xs mb-2" style={{ color: C.t2, fontFamily: SANS }}>{c.desc}</div>
              <div className="text-xs p-2 rounded" style={{ backgroundColor: C.bg3, color: 'var(--code-fg)', fontFamily: MONO }}>{c.example}</div>
            </div>
          ))}
        </div>
        <SubHeading>YAML Flow Structure</SubHeading>
        <Paragraph>When you export a flow, Archy generates a YAML file that represents the complete flow logic. Here is a simplified example of an inbound call flow.</Paragraph>
        <CodeBlock>{ARCHY_YAML_EXAMPLE}</CodeBlock>
        <SubHeading>Bulk Operations</SubHeading>
        <Paragraph>For large environments, export and import all flows of a given type in a single operation. This is invaluable for environment migration and disaster recovery.</Paragraph>
        <CodeBlock>{`# Export ALL inbound call flows to a directory
archy export --flowType inboundcall --exportAll --exportDir ./flows/inbound

# Export ALL in-queue flows
archy export --flowType inqueuecall --exportAll --exportDir ./flows/inqueue

# Import all YAML files in a directory (scripted)
for file in ./flows/inbound/*.yaml; do
  archy publish --file "$file"
done`}</CodeBlock>
        <CalloutBox type="warning">Archy YAML files reference queues, skills, and data actions by NAME, not by ID. Ensure all referenced resources exist in the target environment before importing. Deploy Terraform resources first, then Archy flows.</CalloutBox>
      </section>

      {/* T2S5 */}
      <section ref={el => sectionRefs.current['t2s5'] = el} id="t2s5">
        <SectionHeading>CI/CD Pipeline Design</SectionHeading>
        <Paragraph>A CI/CD pipeline automates the plan-review-apply cycle so configuration changes are validated, approved, and deployed without manual intervention. The gold standard: every change goes through a pull request, is automatically planned, reviewed by a human, and applied on merge.</Paragraph>
        <SubHeading>Pipeline Architecture</SubHeading>
        <div className="flex flex-wrap items-center gap-1 my-4 overflow-x-auto">
          {['Git Push', 'CI Triggered', 'terraform plan', 'Plan Output in PR', 'Human Review', 'PR Approved + Merged', 'terraform apply', 'Deployed'].map((s, i) => (
            <React.Fragment key={i}>
              <span className="px-3 py-1.5 rounded text-xs whitespace-nowrap" style={{ backgroundColor: C.bg3, color: C.t1, fontFamily: MONO, border: `1px solid ${C.border}` }}>{s}</span>
              {i < 7 && <ArrowRight size={14} style={{ color: C.t3, flexShrink: 0 }} />}
            </React.Fragment>
          ))}
        </div>
        <SubHeading>GitHub Actions Example</SubHeading>
        <CodeBlock>{CICD_GITHUB_ACTIONS}</CodeBlock>
        <SubHeading>Pipeline Best Practices</SubHeading>
        <div className="space-y-1 my-3">
          {[
            { good: true, text: 'Always run terraform plan on pull requests so reviewers can see exactly what will change' },
            { good: true, text: 'Require manual approval gates for production deployments — never auto-apply to prod' },
            { good: true, text: 'Store OAuth credentials in CI/CD secret managers, never in code or environment files' },
            { good: true, text: 'Pin Terraform and provider versions to prevent unexpected behavior from upgrades' },
            { good: true, text: 'Use separate CI/CD pipelines (or stages) for Terraform and Archy deployments' },
            { good: false, text: 'Do not use terraform apply -auto-approve in production pipelines without a prior approval step' },
            { good: false, text: 'Do not share state files across environments — each environment needs its own state' },
            { good: false, text: 'Do not skip the plan step — blind applies are the most common cause of production incidents' },
          ].map((p, i) => (
            <div key={i} className="text-xs flex items-start gap-2" style={{ color: p.good ? C.green : C.red, fontFamily: SANS }}>
              <span>{p.good ? 'DO' : 'AVOID'}</span><span style={{ color: C.t2 }}>{p.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* T2S6 */}
      <section ref={el => sectionRefs.current['t2s6'] = el} id="t2s6">
        <SectionHeading>Environment Management</SectionHeading>
        <Paragraph>A mature CX as Code practice maintains multiple isolated environments that mirror each other structurally but differ in scale and access controls. Changes flow from development through staging to production in a controlled promotion pipeline.</Paragraph>
        <SubHeading>Environment Strategy</SubHeading>
        <div className="space-y-3 my-4">
          {ENV_STRATEGY.map((e, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, borderLeft: `4px solid ${e.color}` }}>
              <div className="font-bold text-sm mb-2" style={{ color: e.color, fontFamily: MONO }}>{e.env}</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs" style={{ color: C.t2, fontFamily: SANS }}>
                <div><strong style={{ color: C.t1 }}>Purpose:</strong> {e.purpose}</div>
                <div><strong style={{ color: C.t1 }}>State:</strong> {e.state}</div>
                <div><strong style={{ color: C.t1 }}>Credentials:</strong> {e.credentials}</div>
                <div><strong style={{ color: C.t1 }}>Promotion:</strong> {e.promotion}</div>
              </div>
            </div>
          ))}
        </div>
        <SubHeading>Variable Substitution Pattern</SubHeading>
        <CodeBlock>{`# env/dev.tfvars
environment      = "dev"
gc_region        = "us-east-1"
gc_client_id     = "dev-client-id-here"
acw_timeout_ms   = 15000  # Shorter in dev for testing

# env/prod.tfvars
environment      = "prod"
gc_region        = "us-east-1"
gc_client_id     = "prod-client-id-here"
acw_timeout_ms   = 30000  # Standard in prod

# Deploy: terraform apply -var-file=env/dev.tfvars
# Deploy: terraform apply -var-file=env/prod.tfvars`}</CodeBlock>
        <SubHeading>Drift Detection</SubHeading>
        <Paragraph>Drift occurs when someone modifies a Genesys Cloud resource manually (through the UI or API) without updating the Terraform code. This creates a discrepancy between your code and reality. Schedule periodic terraform plan runs (e.g., nightly in CI/CD) to detect drift. If the plan shows unexpected changes, investigate whether the manual change should be incorporated into code or reverted.</Paragraph>
        <CodeBlock>{`# Nightly drift detection pipeline step
terraform plan -var-file=env/prod.tfvars -detailed-exitcode
# Exit code 0 = no changes (clean)
# Exit code 2 = drift detected (changes needed)
# Alert on exit code 2 → investigate manual changes`}</CodeBlock>
        <CalloutBox type="warning">Drift is inevitable in real organizations — supervisors will make UI changes during incidents. The goal is not to prevent ALL manual changes, but to detect and reconcile them. Use lifecycle ignore_changes for attributes intentionally managed outside Terraform.</CalloutBox>
      </section>

      {/* T2S7 */}
      <section ref={el => sectionRefs.current['t2s7'] = el} id="t2s7">
        <SectionHeading>Advanced Patterns</SectionHeading>
        <Paragraph>These patterns are used by mature CX as Code teams managing large, multi-environment Genesys Cloud deployments. Each pattern solves a specific scaling or operational challenge.</Paragraph>
        <div className="space-y-4 my-4">
          {ADVANCED_PATTERNS.map((p, i) => (
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
        <SubHeading>Module Example — Reusable Queue</SubHeading>
        <CodeBlock>{`# modules/queue/main.tf
variable "queue_name"   { type = string }
variable "environment"  { type = string }
variable "acw_mode"     { type = string, default = "MANDATORY_TIMEOUT" }
variable "acw_timeout"  { type = number, default = 30000 }
variable "skills"       { type = list(string), default = [] }

resource "genesyscloud_routing_queue" "this" {
  name              = "\${var.queue_name}_\${var.environment}"
  acw_wrapup_prompt = var.acw_mode
  acw_timeout_ms    = var.acw_timeout
  skill_evaluation_method = "BEST"
  media_settings_call {
    alerting_timeout_sec = 8
    service_level_percentage = 0.8
    service_level_duration_ms = 20000
  }
}

output "queue_id" { value = genesyscloud_routing_queue.this.id }

# Root module usage:
module "billing_queue" {
  source      = "./modules/queue"
  queue_name  = "Billing_Voice"
  environment = var.environment
  acw_timeout = 45000
}`}</CodeBlock>
        <CalloutBox type="tip">Start simple: manage everything in a single state file until you hit performance issues (~500+ resources). Then split into logical state boundaries: routing.tfstate, users.tfstate, telephony.tfstate. Use terraform_remote_state data sources to share outputs between states.</CalloutBox>
      </section>

      {/* T2S8 */}
      <section ref={el => sectionRefs.current['t2s8'] = el} id="t2s8">
        <SectionHeading>Platform Limits, Gotchas & Troubleshooting</SectionHeading>
        <SubHeading>Platform Limits</SubHeading>
        <InteractiveTable searchable headers={['Resource / Setting', 'Limit', 'Notes']} rows={PLATFORM_LIMITS} />
        <SubHeading>Common Gotchas</SubHeading>
        <div className="space-y-1 my-3">
          {[
            'Resource ordering matters: create skills BEFORE queues that reference them, create queues BEFORE flows that route to them',
            'The Terraform provider uses the Genesys Cloud Public API — all API rate limits apply (300 req/min org-wide)',
            'State file locking is critical for team collaboration — without it, concurrent applies can corrupt state',
            'Some resources have eventual consistency — a resource may not be immediately available after creation. Use depends_on for explicit ordering.',
            'Archy YAML references resources by NAME, but Terraform tracks resources by ID. Keep naming consistent across environments.',
            'Terraform destroy is irreversible for most Genesys Cloud resources — deleted queues, flows, and users cannot be recovered from a trash bin',
            'OAuth client credentials must have sufficient permissions for ALL resources in the Terraform config — a missing permission fails the entire apply',
            'Large Terraform states (1000+ resources) significantly slow plan and apply operations — split into smaller states',
          ].map((g, i) => (
            <div key={i} className="text-xs flex items-start gap-2" style={{ fontFamily: SANS }}>
              <span style={{ color: C.yellow }}>!</span><span style={{ color: C.t2 }}>{g}</span>
            </div>
          ))}
        </div>
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
const GenesysCXasCodeGuide = ({ onBack, isDark: isDarkProp, setIsDark: setIsDarkProp }) => {
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
    const icons = [Rocket, Cpu];
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
            <span className="font-bold text-sm hidden sm:block" style={{ fontFamily: MONO, color: C.purple }}>GENESYS CX AS CODE GUIDE</span>
            <span className="font-bold text-sm sm:hidden" style={{ fontFamily: MONO, color: C.purple }}>GC DEVOPS</span>
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
      <Footer title="Genesys Cloud CX as Code — Interactive Knowledge Guide" />
    </div>
  );
};

export default GenesysCXasCodeGuide;
