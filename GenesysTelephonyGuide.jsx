import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Rocket, Settings, Cpu, Search, ChevronDown, ChevronUp, ChevronRight,
  Menu, X, Phone, Mail, MessageSquare, Bell, RefreshCw, CheckCircle,
  AlertTriangle, AlertCircle, Info, Lightbulb, Star, ExternalLink,
  BookOpen, ArrowRight, ArrowDown, ArrowLeft, Circle, Zap, Shield, Clock, Users,
  FileText, Database, Activity, BarChart3, Target, PhoneCall, Monitor,
  Hash, Layers, Eye, ClipboardList, Volume2, Sun, Moon, GitBranch, Filter,
  Shuffle, UserCheck, Radio, Headphones, Globe, Calendar, Timer, TrendingUp,
  Award, Key, Lock, Unlock, MapPin, Wifi, Server, Cloud, HardDrive, Cpu as CpuIcon
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
  'The Big Picture — How Voice Gets From the Phone Network to the Agent',
  'How It All Fits Together — Trunks, Numbers, Phones, and Sites',
  'Under the Hood — SIP Signaling, Edge Appliances, and Network Architecture',
];
const TIER_AUDIENCES = [
  'For everyone — no experience needed',
  'For administrators & telephony leads',
  'For engineers, architects & network specialists',
];
const TIER_ICONS_KEYS = ['Rocket', 'Settings', 'Cpu'];

// ══════════════════════════════════════════════════════════════
// SECTION METADATA (all tiers)
// ══════════════════════════════════════════════════════════════
const SECTIONS = [
  { tier: 0, id: 't1s1', title: 'What Is Telephony in Genesys Cloud?' },
  { tier: 0, id: 't1s2', title: 'The Building Blocks — Key Components' },
  { tier: 0, id: 't1s3', title: 'Telephony Models Explained Simply' },
  { tier: 0, id: 't1s4', title: 'How a Voice Call Works — End-to-End' },
  { tier: 0, id: 't1s5', title: 'Key Terminology Glossary' },
  { tier: 1, id: 't2s1', title: 'Prerequisites — What You Need Before Telephony' },
  { tier: 1, id: 't2s2', title: 'Genesys Cloud Voice — Deep Dive' },
  { tier: 1, id: 't2s3', title: 'BYOC Cloud Setup' },
  { tier: 1, id: 't2s4', title: 'BYOC Premises & Edge Appliances' },
  { tier: 1, id: 't2s5', title: 'Number Management' },
  { tier: 1, id: 't2s6', title: 'WebRTC Phones & Softphones' },
  { tier: 1, id: 't2s7', title: 'Sites, Locations & Media Settings' },
  { tier: 1, id: 't2s8', title: 'Audio Quality & Troubleshooting' },
  { tier: 2, id: 't3s1', title: 'Telephony Architecture — How It Really Works' },
  { tier: 2, id: 't3s2', title: 'SIP Signaling Deep Dive' },
  { tier: 2, id: 't3s3', title: 'Edge Appliance Management' },
  { tier: 2, id: 't3s4', title: 'Advanced BYOC Patterns' },
  { tier: 2, id: 't3s5', title: 'API & Programmatic Management' },
  { tier: 2, id: 't3s6', title: 'Platform Limits Reference' },
  { tier: 2, id: 't3s7', title: 'Licensing & Feature Matrix' },
  { tier: 2, id: 't3s8', title: 'Network Requirements & Troubleshooting Decision Tree' },
];

// ══════════════════════════════════════════════════════════════
// T1 DATA
// ══════════════════════════════════════════════════════════════
const TELEPHONY_MODELS = [
  { icon: 'Cloud', label: 'Genesys Cloud Voice', desc: 'Fully managed PSTN with built-in carrier — simplest setup, Genesys handles everything' },
  { icon: 'Globe', label: 'BYOC Cloud', desc: 'Your SIP carrier connected to Genesys cloud infrastructure via SIP trunk' },
  { icon: 'Server', label: 'BYOC Premises', desc: 'On-premises Edge appliances connecting your local PBX/carrier to Genesys Cloud' },
  { icon: 'PhoneCall', label: 'WebRTC', desc: 'Browser-based softphone — no desk phone needed, works anywhere with internet' },
  { icon: 'Phone', label: 'SIP Phones', desc: 'Hardware or software SIP phones registered to the Genesys Cloud platform' },
  { icon: 'Headphones', label: 'Remote Phones', desc: 'External phone numbers used as agent endpoints (mobile, home phone)' },
];

const TELEPHONY_MAP_NODES = [
  { id: 'cloudVoice', label: 'CLOUD VOICE', sub: 'Built-in PSTN service', x: 400, y: 60 },
  { id: 'byocCloud', label: 'BYOC CLOUD', sub: 'Your carrier in the cloud', x: 130, y: 150 },
  { id: 'byocPrem', label: 'BYOC PREMISES', sub: 'On-prem Edge connection', x: 670, y: 150 },
  { id: 'edge', label: 'EDGE', sub: 'On-prem appliance', x: 80, y: 310 },
  { id: 'sipTrunks', label: 'SIP TRUNKS', sub: 'Voice signaling paths', x: 110, y: 450 },
  { id: 'dids', label: 'DIDs', sub: 'Phone numbers', x: 300, y: 540 },
  { id: 'webrtc', label: 'WebRTC', sub: 'Browser-based phone', x: 720, y: 310 },
  { id: 'mediaTier', label: 'MEDIA TIER', sub: 'Audio processing layer', x: 690, y: 450 },
  { id: 'numberMgmt', label: 'NUMBER MGMT', sub: 'Provisioning & porting', x: 500, y: 540 },
];
const TELEPHONY_MAP_CENTER = { x: 400, y: 300 };

const TELEPHONY_NODE_TOOLTIPS = {
  cloudVoice: { explanation: 'Genesys-managed PSTN service that provides phone numbers, call routing, and carrier connectivity without any external SIP provider', analogy: 'An all-inclusive phone plan where the provider handles everything' },
  byocCloud: { explanation: 'Bring Your Own Carrier — connect your existing SIP trunk provider directly to the Genesys Cloud platform over the internet', analogy: 'Bringing your own phone plan but using the hotel\'s phone system' },
  byocPrem: { explanation: 'Bring Your Own Carrier with on-premises Edge appliances that bridge your local telephony infrastructure to Genesys Cloud', analogy: 'Building a bridge between your office phone system and the cloud' },
  edge: { explanation: 'Physical or virtual appliance installed on-premises that handles media processing, SIP signaling, and local survivability', analogy: 'A local translator that speaks both your office phone language and cloud language' },
  sipTrunks: { explanation: 'Virtual connections that carry SIP signaling and voice media between carriers, Edge appliances, and the Genesys Cloud platform', analogy: 'The highway lanes that voice traffic travels on between systems' },
  dids: { explanation: 'Direct Inward Dialing numbers — the phone numbers customers call that are assigned to Architect call flows', analogy: 'The street addresses that tell mail (calls) where to go' },
  webrtc: { explanation: 'Web Real-Time Communication — browser-based phone technology that lets agents make and receive calls without hardware phones', analogy: 'Making a phone call through your web browser, like a video call but voice-only' },
  mediaTier: { explanation: 'The AWS-hosted audio processing layer that handles RTP media streams, recording, DTMF detection, and codec transcoding', analogy: 'The sound studio that processes, records, and routes all the audio' },
  numberMgmt: { explanation: 'The administration interface for ordering, porting, assigning, and managing phone numbers across your organization', analogy: 'The phone company office where you order and manage your phone numbers' },
};

const TELEPHONY_MODEL_COMPARISON = [
  {
    name: 'Genesys Cloud Voice', complexity: 1, best: 'New deployments, small-to-mid orgs, fastest time-to-value',
    pros: ['No carrier contract needed', 'Number ordering built in', 'Emergency services included', 'Managed by Genesys — minimal admin', 'Available in 40+ countries'],
    cons: ['Less carrier flexibility', 'Pricing per-minute (can be higher at scale)', 'Limited to supported countries', 'Cannot use existing carrier contracts'],
  },
  {
    name: 'BYOC Cloud', complexity: 3, best: 'Existing carrier relationships, specific carrier requirements, global deployments',
    pros: ['Use existing carrier contracts & pricing', 'Full codec control', 'Any SIP-compatible carrier', 'No on-prem hardware needed', 'Geo-redundant failover possible'],
    cons: ['SIP trunk configuration required', 'Carrier compatibility testing needed', 'You manage the carrier relationship', 'Firewall/NAT configuration can be complex'],
  },
  {
    name: 'BYOC Premises', complexity: 5, best: 'Existing on-prem PBX, local survivability requirements, media locality needs',
    pros: ['Local survivability if cloud connection drops', 'Media stays local (low latency)', 'Integrate with existing PBX infrastructure', 'Full control over media path', 'Supports hybrid cloud/on-prem'],
    cons: ['Edge hardware required', 'Most complex to deploy and maintain', 'Hardware lifecycle management', 'Requires network expertise', 'Higher total cost of ownership'],
  },
];

const CALL_LIFECYCLE = [
  { step: 1, title: 'CUSTOMER DIALS NUMBER', desc: 'Customer dials a phone number (DID) from their phone. The call enters the Public Switched Telephone Network (PSTN).', color: C.green, icon: 'PhoneCall' },
  {
    step: 2, title: 'PSTN ROUTES TO GENESYS', color: C.blue, icon: 'Globe',
    desc: 'The PSTN delivers the call via SIP to Genesys Cloud:',
    checks: [
      'Cloud Voice: Genesys carrier receives the call directly',
      'BYOC Cloud: Your carrier sends SIP INVITE to Genesys cloud SIP proxy',
      'BYOC Premises: Your carrier delivers to on-prem Edge, which forwards to Genesys Cloud',
    ],
  },
  { step: 3, title: 'SIP SIGNALING ESTABLISHED', desc: 'SIP INVITE is processed, codec negotiation (SDP offer/answer) occurs, and a media path is established. SRTP encryption is applied to the audio stream.', color: C.orange, icon: 'Activity' },
  {
    step: 4, title: 'ARCHITECT FLOW EXECUTES', color: C.yellow, icon: 'GitBranch',
    desc: 'The DID is mapped to an Architect inbound call flow:',
    checks: [
      'IVR greeting plays via the media tier',
      'Schedule check, data dips, and menu options execute',
      'Skills, language, and priority are set',
      'Interaction transfers to an ACD queue',
    ],
  },
  { step: 5, title: 'AGENT PHONE RINGS', desc: 'The ACD engine selects an agent. The platform establishes a second media leg to the agent\'s phone — WebRTC browser, SIP desk phone, or remote phone number. Agent sees a screen pop with caller information.', color: C.purple, icon: 'UserCheck' },
  { step: 6, title: 'MEDIA FLOWS END-TO-END', desc: 'RTP audio streams flow: Caller PSTN -> Media Tier -> Agent Phone. The media tier handles recording, DTMF detection, comfort noise, and any conferencing or transfers during the call.', color: C.green, icon: 'Volume2' },
  { step: 7, title: 'CALL ENDS & CLEANUP', desc: 'Either party hangs up. SIP BYE terminates the session. RTP streams close. Call recording is finalized and stored. Agent enters After-Call Work (ACW).', color: C.orange, icon: 'ClipboardList' },
];

const GLOSSARY = [
  { term: 'PSTN', def: 'Public Switched Telephone Network — the global system of interconnected phone networks that carries traditional voice calls', tier: 'Tier 1' },
  { term: 'SIP', def: 'Session Initiation Protocol — the signaling protocol used to establish, modify, and terminate voice calls over IP networks', tier: 'Tier 1' },
  { term: 'SIP Trunk', def: 'A virtual connection between two SIP endpoints (e.g., carrier to Genesys Cloud) that carries voice signaling and media', tier: 'Tier 1' },
  { term: 'DID', def: 'Direct Inward Dialing — a phone number that routes directly to your Genesys Cloud organization', tier: 'Tier 1' },
  { term: 'BYOC', def: 'Bring Your Own Carrier — connecting your existing SIP provider to Genesys Cloud instead of using Genesys Cloud Voice', tier: 'Tier 1' },
  { term: 'Edge', def: 'A physical or virtual appliance deployed on-premises that bridges local telephony to Genesys Cloud', tier: 'Tier 2' },
  { term: 'WebRTC', def: 'Web Real-Time Communication — browser-based technology enabling voice/video calls without plugins or desk phones', tier: 'Tier 1' },
  { term: 'RTP/SRTP', def: 'Real-time Transport Protocol / Secure RTP — the protocol that carries actual audio data, with SRTP adding encryption', tier: 'Tier 2' },
  { term: 'Codec', def: 'Coder-Decoder — an algorithm that compresses/decompresses audio (e.g., G.711 for high quality, Opus for WebRTC)', tier: 'Tier 2' },
  { term: 'SDP', def: 'Session Description Protocol — the format used within SIP to describe media capabilities (codecs, IP addresses, ports)', tier: 'Tier 3' },
  { term: 'ICE/STUN/TURN', def: 'Interactive Connectivity Establishment — protocols that help WebRTC find the best path through firewalls and NAT', tier: 'Tier 3' },
  { term: 'MOS', def: 'Mean Opinion Score — a 1-5 scale rating voice quality where 4.0+ is considered good and below 3.5 is poor', tier: 'Tier 2' },
  { term: 'QoS/DSCP', def: 'Quality of Service / Differentiated Services Code Point — network-level traffic prioritization for voice packets', tier: 'Tier 2' },
  { term: 'Media Tier', def: 'The AWS-based audio processing infrastructure that handles RTP streams, recording, and transcoding in Genesys Cloud', tier: 'Tier 3' },
  { term: 'Trunk Base Settings', def: 'A template defining SIP trunk parameters (codecs, transport, authentication) that can be reused across multiple trunks', tier: 'Tier 2' },
  { term: 'Site', def: 'A logical grouping of Edge appliances, phones, and trunks that represents a physical location or media region', tier: 'Tier 2' },
  { term: 'Local Survivability', def: 'The ability of an Edge appliance to continue handling calls locally when the connection to Genesys Cloud is lost', tier: 'Tier 3' },
  { term: 'Number Porting', def: 'The process of transferring existing phone numbers from one carrier to Genesys Cloud Voice', tier: 'Tier 2' },
  { term: 'SBC', def: 'Session Border Controller — a network device that manages SIP traffic at the edge of a network, often used with BYOC', tier: 'Tier 3' },
];

// ══════════════════════════════════════════════════════════════
// T2 DATA
// ══════════════════════════════════════════════════════════════
const PREREQUISITES = [
  { title: 'Organization & Region Selected', detail: 'Your Genesys Cloud org must be provisioned in an AWS region (e.g., US East, EU West, AP Southeast). The region determines where media is processed and affects latency. This cannot be changed after creation.' },
  { title: 'Telephony Model Decided', detail: 'Choose between Genesys Cloud Voice, BYOC Cloud, or BYOC Premises. This decision affects everything downstream: hardware needs, carrier contracts, network configuration, and ongoing operational responsibility. Most new deployments start with Cloud Voice.' },
  { title: 'Network Readiness', detail: 'Voice traffic requires low-latency, low-jitter network paths. Ensure sufficient bandwidth (100 Kbps per concurrent call for G.711), QoS/DSCP markings enabled, firewalls configured for SIP/RTP ports, and WebRTC STUN/TURN access. Run the Genesys Cloud Network Readiness Assessment tool.' },
  { title: 'Roles & Permissions Assigned', detail: 'Key roles: Telephony > Plugin > All permissions for telephony admins. Telephony > Phone/Site/Trunk > Add/Edit/View for phone management. Directory > User > Edit for assigning phones to users. Admin > Billing for ordering Cloud Voice numbers.' },
];

const CLOUD_VOICE_FEATURES = [
  ['Number Ordering', 'Order local, toll-free, and national numbers directly from the Genesys Cloud admin console. Available in 40+ countries.'],
  ['Number Porting', 'Transfer existing numbers from your current carrier to Genesys Cloud Voice. Process takes 2-4 weeks depending on country and carrier.'],
  ['Emergency Services (E911/E112)', 'Automatic location-based emergency call routing. Requires Emergency Location configuration for each user/phone.'],
  ['International Calling', 'Outbound international dialing with per-minute billing. Managed through Genesys Cloud billing.'],
  ['Short Codes', 'Support for SMS short codes and vanity numbers where available by country.'],
  ['Caller ID', 'Configurable outbound caller ID at the site, queue, or user level. Must be a number owned by your org.'],
  ['Failover', 'Genesys-managed carrier redundancy. Automatic failover between carrier paths if primary route fails.'],
];

const BYOC_CLOUD_CONFIG = [
  { name: 'External Trunk', desc: 'The SIP connection from your carrier to Genesys Cloud. Configure SIP proxy address, authentication, transport (TCP/TLS/UDP), and codec list.' },
  { name: 'Trunk Base Settings', desc: 'Template for trunk configuration: inbound/outbound SIP URIs, media codecs (G.711u, G.711a, G.729, Opus), DTMF mode (RFC 2833, SIP INFO, in-band), and SIP timers.' },
  { name: 'Carrier Requirements', desc: 'Your carrier must support SIP over UDP/TCP/TLS, provide a public SIP proxy endpoint, support the codecs you need, and handle NAT traversal on their side.' },
  { name: 'Codec Negotiation', desc: 'Genesys Cloud sends an SDP offer with a prioritized codec list. Your carrier responds with the selected codec. Mismatch causes call failure — align codec lists with your carrier.' },
  { name: 'SIP Authentication', desc: 'Options: IP-based ACL (whitelist carrier IPs), digest authentication (username/password), or mutual TLS (certificate exchange). IP ACL is most common.' },
  { name: 'Failover Configuration', desc: 'Configure primary and secondary SIP proxy addresses. Use SRV records for DNS-based load balancing. Set SIP retry timers for automatic failover.' },
];

const BYOC_PREMISES_CONFIG = [
  { name: 'Edge Appliance Hardware', desc: 'Dell, HP, or virtual appliance (VMware/Hyper-V). Minimum: 8 cores, 16 GB RAM, 200 GB SSD. Sizing depends on concurrent call capacity — each Edge supports up to 520 concurrent calls.' },
  { name: 'Hybrid Media Handling', desc: 'Edge can process media locally (voice stays on-prem) or pass it to the cloud media tier. Local media reduces latency for same-site calls. Cloud media enables recording and analytics.' },
  { name: 'Local Survivability', desc: 'When internet to Genesys Cloud is lost, Edge continues handling active calls and can route new inbound calls to predefined local destinations. Agents on WebRTC cannot function — only SIP phones registered to Edge survive.' },
  { name: 'Phone Registration', desc: 'SIP phones can register directly to Edge appliances. The Edge acts as a SIP registrar and proxy, providing local call control even during cloud outages.' },
];

const NUMBER_MANAGEMENT = [
  { name: 'DID Provisioning', desc: 'Order new numbers via Admin > Telephony > DID Numbers. Select country, area code, and quantity. Numbers are provisioned within minutes for Cloud Voice, or configured manually for BYOC.' },
  { name: 'Toll-Free Numbers', desc: 'Order toll-free (800, 888, etc.) numbers. Available in most Cloud Voice countries. For BYOC, toll-free numbers are provisioned through your carrier.' },
  { name: 'Number Assignment', desc: 'Assign DIDs to Architect inbound call flows, users (as direct lines), auto-attendants, or ring groups. Each DID can only be assigned to one target.' },
  { name: 'Outbound Caller ID', desc: 'Set the number displayed when agents make outbound calls. Configurable at site level (default), queue level (per-queue), or user level (per-agent). Must be a number in your org.' },
  { name: 'Number Porting', desc: 'Transfer existing numbers from another carrier to Genesys Cloud Voice. Submit a Letter of Authorization (LOA), provide current carrier account details, and schedule the port date. Allow 2-4 weeks.' },
];

const WEBRTC_CONFIG = [
  { name: 'Persistent Connection', desc: 'WebRTC phones maintain a persistent signaling connection via WebSocket. This enables instant call delivery without registration delays. The connection auto-recovers after network interruptions.' },
  { name: 'Codec & Quality', desc: 'WebRTC uses the Opus codec by default — adaptive bitrate, excellent quality even on constrained networks. Falls back to G.711 if needed. Supports wideband (16 kHz) audio for HD voice.' },
  { name: 'Firewall Requirements', desc: 'WebRTC needs outbound HTTPS (443) for signaling and UDP ports 16384-65535 for media (STUN/TURN). If UDP is blocked, media falls back to TURN over TCP 443 — functional but higher latency.' },
  { name: 'Browser Support', desc: 'Supported on Chrome (recommended), Firefox, and Edge (Chromium). Safari has limited support. The Genesys Cloud desktop app embeds Chromium for consistent WebRTC behavior.' },
  { name: 'Headset Integration', desc: 'WebRTC supports headset call controls (answer/hangup/mute) via the WebHID API. Compatible with Jabra, Poly, EPOS, and other major brands.' },
];

const SITE_CONFIG = [
  ['Site Name', 'Logical label representing a physical location or media region (e.g., "NYC Office", "London DC", "AWS US-East")'],
  ['Location', 'Physical address associated with the site — used for emergency services (E911) routing'],
  ['Media Model', 'Cloud or Premises. Cloud = media processed in AWS. Premises = media processed by local Edge appliances'],
  ['Edge Group', 'The cluster of Edge appliances serving this site (BYOC Premises only)'],
  ['Outbound Routes', 'Rules for selecting which trunk handles outbound calls — by number pattern, classification, or priority'],
  ['Number Plans', 'Dial plan rules that normalize dialed numbers (e.g., strip 9 for outside line, add country code, handle extensions)'],
  ['Media Region', 'The AWS region where media is processed for this site. Should match or be close to the org\'s home region for lowest latency'],
];

const AUDIO_QUALITY_METRICS = [
  { metric: 'MOS (Mean Opinion Score)', healthy: '4.0 - 5.0', warning: '3.5 - 4.0', critical: '< 3.5', desc: 'Overall voice quality rating (1=bad, 5=excellent)' },
  { metric: 'Latency (one-way)', healthy: '< 150 ms', warning: '150 - 300 ms', critical: '> 300 ms', desc: 'Time for audio to travel from speaker to listener' },
  { metric: 'Jitter', healthy: '< 20 ms', warning: '20 - 50 ms', critical: '> 50 ms', desc: 'Variation in packet arrival times — causes choppy audio' },
  { metric: 'Packet Loss', healthy: '< 1%', warning: '1 - 3%', critical: '> 3%', desc: 'Percentage of audio packets lost in transit' },
  { metric: 'Round-Trip Time', healthy: '< 200 ms', warning: '200 - 400 ms', critical: '> 400 ms', desc: 'Total time for a packet to travel to destination and back' },
];

// ══════════════════════════════════════════════════════════════
// T3 DATA
// ══════════════════════════════════════════════════════════════
const ARCHITECTURE_LAYERS = [
  '1. PSTN/Carrier Layer: External phone network delivers calls via SIP trunks',
  '2. SIP Proxy Layer: Genesys Cloud SIP proxies (AWS) receive inbound SIP INVITE messages',
  '3. Conversation Service: Orchestrates call setup, Architect flow execution, and ACD routing',
  '4. Media Tier (AWS): RTP audio processing — recording, transcoding, DTMF, comfort noise, conferencing',
  '5. TURN/STUN Servers: NAT traversal for WebRTC agents behind firewalls',
  '6. WebSocket Signaling: Persistent connections to WebRTC phones for call control',
  '7. Edge Layer (BYOC Premises): On-prem SIP/RTP handling, local survivability, phone registration',
  '8. Recording Service: Call recordings stored in S3, encrypted at rest, linked to conversation records',
];

const SIP_FLOW_STEPS = [
  { step: 'INVITE', desc: 'Caller\'s carrier sends SIP INVITE with SDP offer (codecs, media IP/port) to Genesys SIP proxy', color: C.green },
  { step: '100 Trying', desc: 'Genesys acknowledges receipt and begins processing — prevents retransmission', color: C.blue },
  { step: '180 Ringing', desc: 'Genesys sends ringing indication back to caller while Architect flow executes', color: C.blue },
  { step: '183 Progress', desc: 'Optional: early media (IVR prompts) sent before the call is fully answered', color: C.yellow },
  { step: '200 OK', desc: 'Call answered — SDP answer confirms codec and media path. RTP streams begin flowing.', color: C.green },
  { step: 'ACK', desc: 'Caller\'s carrier confirms the 200 OK. Three-way SIP handshake complete.', color: C.green },
  { step: 'RTP Media', desc: 'Bidirectional SRTP audio flows between caller and agent via the media tier', color: C.purple },
  { step: 'BYE', desc: 'Either party hangs up — SIP BYE terminates the session, RTP stops, recording finalizes', color: C.red },
];

const EDGE_MANAGEMENT = [
  { title: 'Provisioning', items: ['Download Edge ISO/OVA from Genesys Cloud', 'Install on approved hardware (Dell/HP) or VMware/Hyper-V', 'Configure network (static IP, DNS, NTP)', 'Pair with Genesys Cloud org using activation code', 'Edge downloads its configuration automatically'] },
  { title: 'Firmware & Updates', items: ['Firmware updates managed via Genesys Cloud admin', 'Rolling updates with zero downtime in clustered deployments', 'Automatic or scheduled update windows', 'Rollback capability if update causes issues', 'Version lifecycle: N-2 support policy'] },
  { title: 'Clustering', items: ['Deploy 2+ Edges in an Edge Group for high availability', 'Active-active: both Edges handle calls simultaneously', 'Automatic failover if one Edge goes offline', 'Calls in progress survive single Edge failure', 'Load balancing across Edge cluster members'] },
  { title: 'Local Survivability', items: ['Configurable via site settings', 'When cloud connection lost: active calls continue', 'New inbound calls route to pre-configured local destination', 'SIP phones registered to Edge continue working', 'WebRTC phones lose functionality (no WebSocket to cloud)', 'Automatically resumes normal operation when connection restores'] },
];

const ADVANCED_BYOC_PATTERNS = [
  {
    title: 'Multi-Trunk Failover',
    steps: ['Configure primary trunk to Carrier A (priority 1)', 'Configure secondary trunk to Carrier B (priority 2)', 'Set SIP OPTIONS keep-alive to detect trunk failures', 'On primary failure: automatic failover to secondary within seconds', 'Configure outbound route with ordered trunk priority list'],
  },
  {
    title: 'Geo-Routing with Regional Trunks',
    steps: ['Deploy separate BYOC trunks per geographic region', 'US calls route through US-based carrier trunk', 'EU calls route through EU-based carrier trunk', 'APAC calls route through APAC-based carrier trunk', 'Number plan classification determines which trunk handles each call'],
  },
  {
    title: 'Custom SIP Headers',
    steps: ['Carrier sends custom SIP headers (X-headers) with call metadata', 'Genesys Cloud can read select SIP headers in Architect flows', 'Use header data for routing decisions (account ID, priority tier)', 'Outbound calls can include custom headers for carrier-side routing', 'Requires BYOC — Cloud Voice does not support custom headers'],
  },
  {
    title: 'SBC Integration',
    steps: ['Deploy Session Border Controller between carrier and Genesys', 'SBC handles protocol normalization (H.323 to SIP conversion)', 'SBC provides topology hiding (masks internal network)', 'SBC manages codec transcoding if carrier codecs differ', 'Common SBCs: AudioCodes, Oracle (Acme Packet), Ribbon'],
  },
];

const API_ENDPOINTS = [
  { method: 'GET', path: '/api/v2/telephony/providers/edges', use: 'List all Edge appliances in the org with status' },
  { method: 'GET', path: '/api/v2/telephony/providers/edges/sites', use: 'List all telephony sites' },
  { method: 'POST', path: '/api/v2/telephony/providers/edges/sites', use: 'Create a new telephony site' },
  { method: 'GET', path: '/api/v2/telephony/providers/edges/trunks', use: 'List all SIP trunks and their status' },
  { method: 'GET', path: '/api/v2/telephony/providers/edges/phones', use: 'List all provisioned phones' },
  { method: 'POST', path: '/api/v2/telephony/providers/edges/phones', use: 'Create/provision a new phone' },
  { method: 'GET', path: '/api/v2/telephony/providers/edges/didpools', use: 'List DID pools and assignments' },
  { method: 'GET', path: '/api/v2/telephony/providers/edges/trunkbasesettings', use: 'List trunk base settings templates' },
  { method: 'GET', path: '/api/v2/telephony/providers/edges/{edgeId}/metrics', use: 'Get Edge appliance metrics (CPU, memory, calls)' },
  { method: 'POST', path: '/api/v2/telephony/providers/edges/{edgeId}/reboot', use: 'Reboot an Edge appliance' },
  { method: 'GET', path: '/api/v2/telephony/siptraces', use: 'Retrieve SIP trace data for troubleshooting' },
  { method: 'GET', path: '/api/v2/quality/conversations/{id}/audits', use: 'Get call quality metrics for a specific conversation' },
];

const PLATFORM_LIMITS = [
  ['Sites per org', '1,000', ''],
  ['Edges per org', '1,000', ''],
  ['Edges per site', '50', 'Clustered for HA'],
  ['Concurrent calls per Edge', '520', 'Hardware-dependent'],
  ['SIP trunks per org', '500', 'Across all types'],
  ['External trunks per site', '50', 'BYOC Cloud/Premises'],
  ['DIDs per org', '10,000', 'Can be increased by request'],
  ['DID pools per org', '1,000', ''],
  ['Phones per org', '50,000', ''],
  ['Phones per site', '10,000', ''],
  ['Phone base settings', '1,000', 'Templates per org'],
  ['WebRTC concurrent sessions', 'Unlimited', 'Licensed per user'],
  ['Number plans per site', '50', ''],
  ['Outbound routes per site', '50', ''],
  ['SIP trunk concurrent calls', 'Carrier-dependent', 'No platform hard limit'],
  ['Cloud Voice countries', '40+', 'Expanding regularly'],
  ['Trunk base settings per org', '500', ''],
  ['Recording storage', 'Unlimited', 'Billed per GB/month'],
];

const LICENSE_MATRIX = [
  ['Genesys Cloud Voice (built-in PSTN)', true, true, true],
  ['BYOC Cloud', true, true, true],
  ['BYOC Premises', true, true, true],
  ['WebRTC softphone', true, true, true],
  ['SIP phone support', true, true, true],
  ['Call recording', true, true, true],
  ['Voicemail', true, true, true],
  ['IVR / Architect flows', true, true, true],
  ['Screen recording', false, 'add-on', true],
  ['Speech analytics', false, false, true],
  ['Voice transcription', false, false, true],
  ['Workforce management', false, 'add-on', true],
  ['Quality management', false, 'add-on', true],
  ['Predictive routing', false, false, true],
  ['Advanced number porting', true, true, true],
  ['Emergency services (E911)', true, true, true],
];

const NETWORK_REQUIREMENTS = [
  { category: 'Bandwidth', items: ['G.711 codec: 87 Kbps per call (with IP overhead)', 'Opus codec: 30-60 Kbps per call (adaptive)', 'Signaling: < 5 Kbps per call', 'Rule of thumb: 100 Kbps per concurrent call for capacity planning'] },
  { category: 'Firewall Ports', items: ['HTTPS 443 (TCP): API, signaling, WebSocket, TURN fallback', 'SIP: UDP/TCP 5060 or TLS 5061 (BYOC trunks)', 'RTP Media: UDP 16384-65535 (Genesys media tier)', 'STUN/TURN: UDP 3478 (WebRTC NAT traversal)', 'NTP: UDP 123 (Edge appliance time sync)'] },
  { category: 'DSCP/QoS Markings', items: ['Voice RTP: DSCP EF (46) — Expedited Forwarding', 'SIP Signaling: DSCP CS3 (24) — recommended', 'Video RTP: DSCP AF41 (34) — if applicable', 'Ensure QoS is honored end-to-end (ISP, WAN, LAN)'] },
  { category: 'DNS Requirements', items: ['Resolve *.mypurecloud.com (or regional domain)', 'SRV records for BYOC trunk failover', 'Low TTL for dynamic endpoint resolution', 'NTP sync: time.mypurecloud.com or public NTP pool'] },
];

const TROUBLESHOOTING = [
  { symptom: 'No audio (one-way or no-way)', investigation: 'Check: Is RTP media flowing? (SIP trace shows 200 OK with SDP but no audio) -> Firewall blocking UDP ports 16384-65535? -> NAT/STUN issue for WebRTC? (Check TURN connectivity) -> Codec mismatch between carrier and Genesys? (Check SDP offer/answer) -> SRTP vs RTP mismatch? (Both sides must agree on encryption) -> Check headset/microphone permissions in browser for WebRTC.' },
  { symptom: 'Calls dropping after 30 seconds', investigation: 'Check: SIP ACK not reaching Genesys? (Firewall blocking return SIP traffic) -> SIP session timer expiring? (Carrier requires re-INVITE, Genesys not responding) -> NAT binding timeout too short? (SIP keep-alive not configured) -> Check for SIP 408 or BYE from carrier side in SIP traces.' },
  { symptom: 'Poor voice quality (choppy, robotic, echo)', investigation: 'Check: Packet loss > 1%? (Run network quality test) -> Jitter > 30ms? (Enable jitter buffer, check QoS) -> Latency > 200ms? (Check routing path, wrong media region?) -> Codec set to G.729? (Low bandwidth but lower quality — try G.711) -> Duplex issue on network switch? -> Echo: check headset/speakerphone AEC settings.' },
  { symptom: 'WebRTC phone not connecting', investigation: 'Check: Browser supported? (Chrome recommended) -> WebSocket connection established? (Check browser console for WS errors) -> STUN/TURN ports accessible? (UDP 3478, TCP 443 fallback) -> Persistent connection enabled in phone settings? -> VPN splitting WebRTC traffic incorrectly? -> Third-party browser extensions blocking WebRTC?' },
  { symptom: 'BYOC trunk not registering / no inbound calls', investigation: 'Check: SIP proxy address correct? -> Authentication configured (IP ACL or digest)? -> Carrier whitelisted Genesys SIP proxy IPs? -> TLS certificate valid (if using TLS transport)? -> SIP OPTIONS health check passing? -> DNS resolving correctly? -> Check SIP traces for 401/403/503 responses.' },
  { symptom: 'Edge appliance offline or degraded', investigation: 'Check: Edge network connectivity (ping, DNS, NTP) -> Edge pairing with org still valid? (Check activation status) -> Firmware version supported? (Must be within N-2) -> Edge resource usage (CPU > 90%, memory > 85%?) -> Cluster partner healthy? (Failover should have occurred) -> Check Edge logs in Genesys Cloud admin.' },
];

// ══════════════════════════════════════════════════════════════
// SEARCH INDEX
// ══════════════════════════════════════════════════════════════
const SEARCH_INDEX = (() => {
  const idx = [];
  SECTIONS.forEach(s => idx.push({ text: s.title, label: s.title, sectionId: s.id, tier: s.tier, type: 'Section' }));
  TELEPHONY_MODELS.forEach(m => idx.push({ text: `${m.label} ${m.desc}`, label: m.label, sectionId: 't1s3', tier: 0, type: 'Telephony Model' }));
  TELEPHONY_MODEL_COMPARISON.forEach(m => idx.push({ text: `${m.name} ${m.best} ${m.pros.join(' ')} ${m.cons.join(' ')}`, label: m.name, sectionId: 't1s3', tier: 0, type: 'Telephony Model' }));
  CALL_LIFECYCLE.forEach(s => idx.push({ text: `${s.title} ${s.desc} ${(s.checks || []).join(' ')}`, label: s.title, sectionId: 't1s4', tier: 0, type: 'Call Lifecycle' }));
  GLOSSARY.forEach(g => idx.push({ text: `${g.term} ${g.def}`, label: g.term, sectionId: 't1s5', tier: 0, type: 'Glossary' }));
  PREREQUISITES.forEach(p => idx.push({ text: `${p.title} ${p.detail}`, label: p.title, sectionId: 't2s1', tier: 1, type: 'Prerequisite' }));
  CLOUD_VOICE_FEATURES.forEach(f => idx.push({ text: `${f[0]} ${f[1]}`, label: f[0], sectionId: 't2s2', tier: 1, type: 'Cloud Voice Feature' }));
  BYOC_CLOUD_CONFIG.forEach(c => idx.push({ text: `${c.name} ${c.desc}`, label: c.name, sectionId: 't2s3', tier: 1, type: 'BYOC Cloud Config' }));
  BYOC_PREMISES_CONFIG.forEach(c => idx.push({ text: `${c.name} ${c.desc}`, label: c.name, sectionId: 't2s4', tier: 1, type: 'BYOC Premises Config' }));
  NUMBER_MANAGEMENT.forEach(n => idx.push({ text: `${n.name} ${n.desc}`, label: n.name, sectionId: 't2s5', tier: 1, type: 'Number Management' }));
  WEBRTC_CONFIG.forEach(w => idx.push({ text: `${w.name} ${w.desc}`, label: w.name, sectionId: 't2s6', tier: 1, type: 'WebRTC Config' }));
  SITE_CONFIG.forEach(s => idx.push({ text: `${s[0]} ${s[1]}`, label: s[0], sectionId: 't2s7', tier: 1, type: 'Site Config' }));
  AUDIO_QUALITY_METRICS.forEach(m => idx.push({ text: `${m.metric} ${m.desc} ${m.healthy} ${m.warning} ${m.critical}`, label: m.metric, sectionId: 't2s8', tier: 1, type: 'Audio Metric' }));
  ARCHITECTURE_LAYERS.forEach(l => idx.push({ text: l, label: l.split(':')[0], sectionId: 't3s1', tier: 2, type: 'Architecture Layer' }));
  SIP_FLOW_STEPS.forEach(s => idx.push({ text: `${s.step} ${s.desc}`, label: s.step, sectionId: 't3s2', tier: 2, type: 'SIP Term' }));
  EDGE_MANAGEMENT.forEach(e => idx.push({ text: `${e.title} ${e.items.join(' ')}`, label: e.title, sectionId: 't3s3', tier: 2, type: 'Edge Management' }));
  ADVANCED_BYOC_PATTERNS.forEach(p => idx.push({ text: `${p.title} ${p.steps.join(' ')}`, label: p.title, sectionId: 't3s4', tier: 2, type: 'BYOC Pattern' }));
  API_ENDPOINTS.forEach(a => idx.push({ text: `${a.method} ${a.path} ${a.use}`, label: `${a.method} ${a.path}`, sectionId: 't3s5', tier: 2, type: 'API Endpoint' }));
  PLATFORM_LIMITS.forEach(l => idx.push({ text: `${l[0]} ${l[1]} ${l[2]}`, label: l[0], sectionId: 't3s6', tier: 2, type: 'Limit' }));
  LICENSE_MATRIX.forEach(l => idx.push({ text: `${l[0]}`, label: l[0], sectionId: 't3s7', tier: 2, type: 'License Feature' }));
  NETWORK_REQUIREMENTS.forEach(n => idx.push({ text: `${n.category} ${n.items.join(' ')}`, label: n.category, sectionId: 't3s8', tier: 2, type: 'Network Requirement' }));
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
const TelephonyComponentMapSVG = () => {
  const [active, setActive] = useState(null);
  return (
    <div className="my-6 overflow-x-auto">
      <svg viewBox="0 0 800 600" className="w-full" style={{ maxWidth: 800, minWidth: 600 }}>
        <defs>
          <filter id="glow-t"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        {TELEPHONY_MAP_NODES.map(n => (
          <line key={`line-${n.id}`} x1={TELEPHONY_MAP_CENTER.x} y1={TELEPHONY_MAP_CENTER.y} x2={n.x} y2={n.y} stroke={C.border} strokeWidth="2" strokeDasharray="6,4" />
        ))}
        <g>
          <rect x={TELEPHONY_MAP_CENTER.x - 80} y={TELEPHONY_MAP_CENTER.y - 30} width={160} height={60} rx={12} fill={C.bg3} stroke={C.red} strokeWidth={2} />
          <text x={TELEPHONY_MAP_CENTER.x} y={TELEPHONY_MAP_CENTER.y - 5} textAnchor="middle" fill={C.t1} fontFamily={MONO} fontSize={13} fontWeight="bold">TELEPHONY CORE</text>
          <text x={TELEPHONY_MAP_CENTER.x} y={TELEPHONY_MAP_CENTER.y + 15} textAnchor="middle" fill={C.t3} fontFamily={SANS} fontSize={10}>Voice infrastructure</text>
        </g>
        {TELEPHONY_MAP_NODES.map(n => {
          const isActive = active === n.id;
          const tooltip = TELEPHONY_NODE_TOOLTIPS[n.id];
          return (
            <g key={n.id} className="cursor-pointer" onClick={() => setActive(isActive ? null : n.id)} style={{ transition: 'transform 0.2s' }}>
              <rect x={n.x - 70} y={n.y - 25} width={140} height={50} rx={8} fill={C.bg2} stroke={isActive ? C.red : C.border} strokeWidth={isActive ? 2 : 1} filter={isActive ? 'url(#glow-t)' : undefined} />
              <text x={n.x} y={n.y - 4} textAnchor="middle" fill={C.t1} fontFamily={MONO} fontSize={11} fontWeight="600">{n.label}</text>
              <text x={n.x} y={n.y + 12} textAnchor="middle" fill={C.t3} fontFamily={SANS} fontSize={9}>{n.sub}</text>
              {isActive && tooltip && (() => {
                const tw = 280;
                const tx = Math.max(8, Math.min(n.x - tw / 2, 800 - tw - 8));
                const above = n.y > 350;
                const ty = above ? n.y - 135 : n.y + 30;
                return (
                  <foreignObject x={tx} y={ty} width={tw} height={130}>
                    <div xmlns="http://www.w3.org/1999/xhtml" style={{ background: 'var(--bg3)', border: `1px solid ${C.red}`, borderRadius: 8, padding: '10px 12px', boxSizing: 'border-box' }}>
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
      <SectionHeading>What Is Telephony in Genesys Cloud?</SectionHeading>
      <Paragraph>Telephony is the voice infrastructure layer of Genesys Cloud CX — the technology that connects the outside world's phone network to your contact center agents. Think of it as the plumbing: before a call can be routed to the right agent (that's routing), the call must first physically arrive at your platform, be converted into digital audio, and be delivered to the agent's phone or browser. That's telephony.</Paragraph>
      <Paragraph>Genesys Cloud offers three telephony models — from fully managed (Genesys Cloud Voice) to fully self-managed (BYOC Premises). Choosing the right model is one of the most important infrastructure decisions you'll make, as it affects reliability, cost, call quality, and operational complexity.</Paragraph>
      <SubHeading>Why Telephony Matters</SubHeading>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        {[
          { title: 'WITHOUT PROPER TELEPHONY', items: ['Calls fail to connect or drop mid-conversation', 'Poor audio quality (echo, static, one-way audio)', 'No redundancy — single carrier failure = total outage', 'Emergency calls cannot route to local PSAP', 'No visibility into call quality metrics'], color: C.red },
          { title: 'WITH PROPER TELEPHONY', items: ['Crystal-clear voice quality with MOS 4.0+', 'Carrier redundancy and automatic failover', 'E911/E112 emergency services properly configured', 'Flexible agent endpoints (WebRTC, SIP, mobile)', 'Full quality monitoring with real-time alerting'], color: C.green },
        ].map((panel, i) => (
          <div key={i} className="rounded-lg p-5" style={{ backgroundColor: C.bg2, borderTop: `3px solid ${panel.color}` }}>
            <div className="font-bold mb-3 text-sm" style={{ color: panel.color, fontFamily: MONO }}>{panel.title}</div>
            {panel.items.map((item, j) => <div key={j} className="text-sm mb-1.5" style={{ color: C.t2, fontFamily: SANS }}>{item}</div>)}
          </div>
        ))}
      </div>
      <SubHeading>Agent Phone Options</SubHeading>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 my-4">
        {TELEPHONY_MODELS.map((ch, i) => (
          <div key={i} className="rounded-lg p-4 flex items-start gap-3 transition-all duration-200 hover:-translate-y-0.5" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
            <Phone size={20} style={{ color: C.red, flexShrink: 0 }} />
            <div><div className="font-semibold text-sm" style={{ color: C.t1, fontFamily: MONO }}>{ch.label}</div><div className="text-xs mt-1" style={{ color: C.t2, fontFamily: SANS }}>{ch.desc}</div></div>
          </div>
        ))}
      </div>
      <CalloutBox type="tip">Telephony and routing are separate layers. Telephony gets the call TO the platform. Routing decides WHERE within the platform the call goes. You can change your telephony model without changing any routing configuration.</CalloutBox>
    </section>

    {/* T1S2 */}
    <section ref={el => sectionRefs.current['t1s2'] = el} id="t1s2">
      <SectionHeading>The Building Blocks — Key Components</SectionHeading>
      <Paragraph>Genesys Cloud telephony is built from several interconnected components that work together to carry voice from the public phone network to your agents. Think of it like a highway system: SIP trunks are the roads, DIDs are the addresses, Edge appliances are the local on-ramps, and the media tier is the traffic control center.</Paragraph>
      <CalloutBox type="tip">Click any node in the diagram below to see what it does and a simple analogy.</CalloutBox>
      <TelephonyComponentMapSVG />
      <SubHeading>Component Reference</SubHeading>
      <InteractiveTable
        headers={['Component', 'Simple Explanation', 'Analogy']}
        rows={Object.entries(TELEPHONY_NODE_TOOLTIPS).map(([k, v]) => {
          const node = TELEPHONY_MAP_NODES.find(n => n.id === k);
          return [node?.label || k, v.explanation, v.analogy];
        })}
      />
    </section>

    {/* T1S3 */}
    <section ref={el => sectionRefs.current['t1s3'] = el} id="t1s3">
      <SectionHeading>Telephony Models Explained Simply</SectionHeading>
      <Paragraph>Genesys Cloud offers three telephony models. The right choice depends on your existing infrastructure, carrier relationships, regulatory requirements, and tolerance for operational complexity. Think of it as a spectrum from "fully managed" to "fully self-managed."</Paragraph>
      <div className="my-6 rounded-lg p-4 overflow-x-auto" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
        <div className="flex items-center justify-between mb-2 min-w-[500px]">
          <span className="text-xs font-bold" style={{ color: C.green, fontFamily: MONO }}>SIMPLE</span>
          <span className="text-xs font-bold" style={{ color: C.purple, fontFamily: MONO }}>COMPLEX</span>
        </div>
        <div className="h-2 rounded-full min-w-[500px]" style={{ background: `linear-gradient(90deg, ${C.green}, ${C.blue}, ${C.purple})` }} />
        <div className="flex justify-between mt-2 min-w-[500px]">
          {TELEPHONY_MODEL_COMPARISON.map((m, i) => <span key={i} className="text-[10px] text-center" style={{ color: C.t3, fontFamily: MONO, width: 120 }}>{m.name}</span>)}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {TELEPHONY_MODEL_COMPARISON.map((m, i) => (
          <ExpandableCard key={i} title={m.name} accent={C.red}>
            <div className="space-y-3">
              <div className="flex items-center gap-2"><strong style={{ color: C.t1 }}>Complexity:</strong> <StarRating count={m.complexity} /></div>
              <div><strong style={{ color: C.t1 }}>Best for:</strong> {m.best}</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                <div className="p-3 rounded" style={{ backgroundColor: C.bg3 }}>
                  <div className="text-xs font-bold mb-2" style={{ color: C.green, fontFamily: MONO }}>PROS</div>
                  {m.pros.map((p, pi) => <div key={pi} className="text-xs mb-1" style={{ color: C.t2 }}>+ {p}</div>)}
                </div>
                <div className="p-3 rounded" style={{ backgroundColor: C.bg3 }}>
                  <div className="text-xs font-bold mb-2" style={{ color: C.red, fontFamily: MONO }}>CONS</div>
                  {m.cons.map((c, ci) => <div key={ci} className="text-xs mb-1" style={{ color: C.t2 }}>- {c}</div>)}
                </div>
              </div>
            </div>
          </ExpandableCard>
        ))}
      </div>
    </section>

    {/* T1S4 */}
    <section ref={el => sectionRefs.current['t1s4'] = el} id="t1s4">
      <SectionHeading>How a Voice Call Works — End-to-End</SectionHeading>
      <Paragraph>Every voice call in Genesys Cloud follows a lifecycle from the moment a customer picks up their phone to the moment the agent wraps up. Understanding this flow is the key to understanding how telephony, routing, and agent endpoints work together.</Paragraph>
      <div className="my-6 space-y-0">
        {CALL_LIFECYCLE.map((s, i) => (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: s.color + '22', color: s.color, border: `2px solid ${s.color}`, fontFamily: MONO }}>{s.step}</div>
              {i < CALL_LIFECYCLE.length - 1 && <div className="w-0.5 flex-1 my-1" style={{ backgroundColor: C.border }} />}
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
          <div className="font-bold text-sm" style={{ color: C.green, fontFamily: MONO }}>CALL COMPLETE — RECORDING STORED, AGENT AVAILABLE</div>
        </div>
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
const Tier2Content = ({ sectionRefs }) => (
  <div className="space-y-16">
    {/* T2S1 */}
    <section ref={el => sectionRefs.current['t2s1'] = el} id="t2s1">
      <SectionHeading>Prerequisites — What You Need Before Telephony</SectionHeading>
      <Paragraph>Before configuring any telephony in Genesys Cloud, these foundational decisions and platform components must be in place. Think of this as the land survey before building the house.</Paragraph>
      <div className="space-y-3 my-4">
        {PREREQUISITES.map((p, i) => (
          <ExpandableCard key={i} title={`${i + 1}. ${p.title}`} accent={C.red}>
            {p.detail}
          </ExpandableCard>
        ))}
      </div>
      <SubHeading>Recommended Setup Sequence</SubHeading>
      <div className="flex flex-wrap items-center gap-1 my-4 overflow-x-auto">
        {['Network Prep', 'Choose Model', 'Create Sites', 'Configure Trunks', 'Provision Numbers', 'Set Up Phones', 'Assign DIDs to Flows', 'Test Calls'].map((s, i) => (
          <React.Fragment key={i}>
            <span className="px-3 py-1.5 rounded text-xs whitespace-nowrap" style={{ backgroundColor: C.bg3, color: C.t1, fontFamily: MONO, border: `1px solid ${C.border}` }}>{s}</span>
            {i < 7 && <ArrowRight size={14} style={{ color: C.t3, flexShrink: 0 }} />}
          </React.Fragment>
        ))}
      </div>
    </section>

    {/* T2S2 */}
    <section ref={el => sectionRefs.current['t2s2'] = el} id="t2s2">
      <SectionHeading>Genesys Cloud Voice — Deep Dive</SectionHeading>
      <Paragraph>Genesys Cloud Voice is the fully managed PSTN service built into Genesys Cloud. Genesys contracts with telecom carriers worldwide and provides phone numbers, call routing, emergency services, and international dialing — all managed from the Genesys Cloud admin console. No external carrier contracts or SIP configuration required.</Paragraph>
      <SubHeading>Key Capabilities</SubHeading>
      <div className="space-y-2 my-3">
        {CLOUD_VOICE_FEATURES.map(([label, desc], i) => (
          <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-1 p-3 rounded" style={{ backgroundColor: C.bg2 }}>
            <span className="text-xs font-semibold whitespace-nowrap min-w-[180px]" style={{ color: C.red, fontFamily: MONO }}>{label}:</span>
            <span className="text-xs" style={{ color: C.t2, fontFamily: SANS }}>{desc}</span>
          </div>
        ))}
      </div>
      <SubHeading>When to Choose Cloud Voice</SubHeading>
      <Paragraph>Cloud Voice is ideal when you want the fastest time-to-value, have no existing carrier contracts you must preserve, operate in supported countries, and prefer Genesys to manage the carrier infrastructure. It is the default recommendation for new Genesys Cloud deployments.</Paragraph>
      <CalloutBox type="warning">Cloud Voice pricing is per-minute for PSTN usage. For very high-volume contact centers (millions of minutes/month), BYOC with a negotiated carrier contract may be more cost-effective. Run a cost comparison before committing.</CalloutBox>
    </section>

    {/* T2S3 */}
    <section ref={el => sectionRefs.current['t2s3'] = el} id="t2s3">
      <SectionHeading>BYOC Cloud Setup</SectionHeading>
      <Paragraph>BYOC Cloud lets you connect your existing SIP carrier directly to the Genesys Cloud platform — no on-premises hardware required. Your carrier sends SIP traffic to Genesys's AWS-hosted SIP proxy, and Genesys handles everything from there. You get the flexibility of choosing your own carrier with the simplicity of a cloud-only deployment.</Paragraph>
      <SubHeading>Configuration Components</SubHeading>
      <div className="space-y-3 my-4">
        {BYOC_CLOUD_CONFIG.map((c, i) => (
          <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
            <div className="font-semibold text-sm mb-2" style={{ color: C.t1, fontFamily: MONO }}>{i + 1}. {c.name}</div>
            <div className="text-sm" style={{ color: C.t2, fontFamily: SANS }}>{c.desc}</div>
          </div>
        ))}
      </div>
      <SubHeading>BYOC Cloud Setup Checklist</SubHeading>
      <CodeBlock>{`1. Create Trunk Base Settings (Admin > Telephony > Trunk Base Settings)
   - Set transport: TLS recommended, TCP/UDP as fallback
   - Set codecs: G.711u (US), G.711a (EU), Opus for WebRTC
   - Set DTMF mode: RFC 2833 (most compatible)

2. Create External Trunk (Admin > Telephony > Trunks)
   - Select trunk base settings template
   - Enter carrier SIP proxy address (e.g., sip.carrier.com:5061)
   - Configure authentication (IP ACL or digest)
   - Set concurrent call limit

3. Create Outbound Route (per site)
   - Map number classifications to trunks
   - Set trunk priority for failover

4. Test: Place inbound and outbound test calls
   - Verify codec negotiation (check SDP in SIP traces)
   - Verify DTMF works end-to-end
   - Verify caller ID displays correctly`}</CodeBlock>
      <CalloutBox type="info">Genesys publishes the SIP proxy IP addresses/FQDNs per region. Your carrier must whitelist these addresses. See the Genesys Cloud Resource Center for the current list — it changes when new AWS regions are added.</CalloutBox>
    </section>

    {/* T2S4 */}
    <section ref={el => sectionRefs.current['t2s4'] = el} id="t2s4">
      <SectionHeading>BYOC Premises & Edge Appliances</SectionHeading>
      <Paragraph>BYOC Premises is the most powerful but most complex telephony model. It deploys physical or virtual Edge appliances on your premises that bridge your local telephony infrastructure (PBX, carrier connections, SIP phones) to the Genesys Cloud platform. The Edge handles media locally, provides survivability during cloud outages, and integrates with existing on-prem equipment.</Paragraph>
      <SubHeading>Configuration Components</SubHeading>
      <div className="space-y-3 my-4">
        {BYOC_PREMISES_CONFIG.map((c, i) => (
          <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
            <div className="font-semibold text-sm mb-2" style={{ color: C.t1, fontFamily: MONO }}>{i + 1}. {c.name}</div>
            <div className="text-sm" style={{ color: C.t2, fontFamily: SANS }}>{c.desc}</div>
          </div>
        ))}
      </div>
      <CalloutBox type="warning">
        <strong>Edge Hardware Lifecycle:</strong> Edge appliances require ongoing hardware maintenance, firmware updates, and capacity planning. Budget for hardware refresh every 4-5 years. Virtual Edge (VMware/Hyper-V) reduces hardware dependency but still requires host maintenance.
      </CalloutBox>
    </section>

    {/* T2S5 */}
    <section ref={el => sectionRefs.current['t2s5'] = el} id="t2s5">
      <SectionHeading>Number Management</SectionHeading>
      <Paragraph>Phone numbers (DIDs) are the entry point for all inbound voice traffic. Managing them properly — ordering, porting, assigning, and maintaining caller ID — is a critical operational function that directly affects whether calls reach your contact center.</Paragraph>
      <SubHeading>Number Operations</SubHeading>
      <div className="space-y-3 my-4">
        {NUMBER_MANAGEMENT.map((n, i) => (
          <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
            <div className="font-semibold text-sm mb-2" style={{ color: C.t1, fontFamily: MONO }}>{n.name}</div>
            <div className="text-sm" style={{ color: C.t2, fontFamily: SANS }}>{n.desc}</div>
          </div>
        ))}
      </div>
      <CalloutBox type="tip">Keep a spreadsheet of all your DIDs, their assignments (which flow/user), and their purpose. As your org grows, untracked numbers become orphaned — still billing but not serving any function.</CalloutBox>
    </section>

    {/* T2S6 */}
    <section ref={el => sectionRefs.current['t2s6'] = el} id="t2s6">
      <SectionHeading>WebRTC Phones & Softphones</SectionHeading>
      <Paragraph>WebRTC is the most common agent phone type in Genesys Cloud. It turns the agent's web browser into a full-featured phone — no desk phone, no softphone application, no SIP registration. Agents simply log into Genesys Cloud and their browser becomes their phone.</Paragraph>
      <SubHeading>WebRTC Configuration</SubHeading>
      <div className="space-y-3 my-4">
        {WEBRTC_CONFIG.map((w, i) => (
          <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
            <div className="font-semibold text-sm mb-2" style={{ color: C.t1, fontFamily: MONO }}>{w.name}</div>
            <div className="text-sm" style={{ color: C.t2, fontFamily: SANS }}>{w.desc}</div>
          </div>
        ))}
      </div>
      <CalloutBox type="info">WebRTC is the recommended phone type for most deployments. It requires zero hardware, works from any location with internet, and provides excellent audio quality with the Opus codec. The main limitation is dependency on the cloud connection — if the agent loses internet, they lose their phone.</CalloutBox>
    </section>

    {/* T2S7 */}
    <section ref={el => sectionRefs.current['t2s7'] = el} id="t2s7">
      <SectionHeading>Sites, Locations & Media Settings</SectionHeading>
      <Paragraph>Sites are the foundational organizational unit for telephony in Genesys Cloud. Every phone, trunk, and Edge belongs to a site. Sites define how outbound calls are handled, which media region processes audio, and how number dialing plans work.</Paragraph>
      <SubHeading>Site Configuration</SubHeading>
      <div className="space-y-2 my-3">
        {SITE_CONFIG.map(([label, desc], i) => (
          <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-1 p-3 rounded" style={{ backgroundColor: C.bg2 }}>
            <span className="text-xs font-semibold whitespace-nowrap min-w-[160px]" style={{ color: C.red, fontFamily: MONO }}>{label}:</span>
            <span className="text-xs" style={{ color: C.t2, fontFamily: SANS }}>{desc}</span>
          </div>
        ))}
      </div>
      <SubHeading>Media Regions</SubHeading>
      <Paragraph>Media regions determine where audio is processed. Genesys Cloud runs media processing in multiple AWS regions globally. Choosing the right media region minimizes audio latency. For example, if your agents are in London and your customers call from the UK, configure the site's media region to EU-West (Ireland/London) rather than US-East.</Paragraph>
      <CalloutBox type="warning">Mismatched media regions are a common cause of high latency and poor audio quality. If agents report echo or delay, verify that the site's media region is geographically close to both the agents AND the carrier's SIP endpoint.</CalloutBox>
    </section>

    {/* T2S8 */}
    <section ref={el => sectionRefs.current['t2s8'] = el} id="t2s8">
      <SectionHeading>Audio Quality & Troubleshooting</SectionHeading>
      <Paragraph>Voice quality is the single most visible indicator of telephony health. A perfectly routed call means nothing if the audio is choppy, echoing, or cutting out. Genesys Cloud provides built-in quality metrics and tools for monitoring and troubleshooting.</Paragraph>
      <SubHeading>Key Audio Quality Metrics</SubHeading>
      <InteractiveTable
        headers={['Metric', 'Healthy', 'Warning', 'Critical']}
        rows={AUDIO_QUALITY_METRICS.map(m => [m.metric, m.healthy, m.warning, m.critical])}
      />
      <SubHeading>Common Quality Issues</SubHeading>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
        {[
          { name: 'One-Way Audio', desc: 'Usually a NAT/firewall issue. RTP media is being blocked in one direction. Check that UDP ports 16384-65535 are open bidirectionally.', color: C.red },
          { name: 'Echo', desc: 'Caused by acoustic feedback between speaker and microphone. Fix: use headsets instead of speakerphones, enable Acoustic Echo Cancellation (AEC).', color: C.orange },
          { name: 'Choppy / Robotic Audio', desc: 'Usually caused by packet loss or high jitter. Check network path for congestion, ensure QoS/DSCP is properly configured end-to-end.', color: C.yellow },
          { name: 'High Latency / Delay', desc: 'Audio arrives late, causing cross-talk. Check media region configuration, network hops, and whether VPN is adding unnecessary latency.', color: C.purple },
        ].map((issue, i) => (
          <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, borderLeft: `4px solid ${issue.color}` }}>
            <div className="font-bold text-sm mb-2" style={{ color: issue.color, fontFamily: MONO }}>{issue.name}</div>
            <div className="text-xs" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.6 }}>{issue.desc}</div>
          </div>
        ))}
      </div>
      <SubHeading>DSCP / QoS Configuration</SubHeading>
      <Paragraph>Quality of Service markings tell network equipment to prioritize voice packets over data traffic. Without QoS, a large file download can cause voice quality degradation. Configure DSCP EF (46) for voice RTP and CS3 (24) for SIP signaling on all network devices between agents and the internet edge.</Paragraph>
    </section>
  </div>
);

// ══════════════════════════════════════════════════════════════
// TIER 3 CONTENT
// ══════════════════════════════════════════════════════════════
const Tier3Content = ({ sectionRefs }) => (
  <div className="space-y-16">
    {/* T3S1 */}
    <section ref={el => sectionRefs.current['t3s1'] = el} id="t3s1">
      <SectionHeading>Telephony Architecture — How It Really Works</SectionHeading>
      <Paragraph>Understanding the internal architecture of Genesys Cloud telephony is essential for troubleshooting complex issues, designing high-availability deployments, and optimizing call quality. The platform runs on AWS with multiple specialized service layers.</Paragraph>
      <SubHeading>Architecture Layers</SubHeading>
      <div className="my-4 p-4 rounded-lg space-y-2" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
        {ARCHITECTURE_LAYERS.map((layer, i) => (
          <div key={i} className="text-xs" style={{ color: C.t2, fontFamily: MONO }}>{layer}</div>
        ))}
      </div>
      <SubHeading>Media Path Details</SubHeading>
      <Paragraph>All voice media in Genesys Cloud is encrypted with SRTP (Secure Real-time Transport Protocol). The media tier runs in AWS and handles codec transcoding (e.g., G.711 from PSTN to Opus for WebRTC), call recording, DTMF detection, comfort noise generation, and conferencing. For BYOC Premises, media can optionally stay on-premises (processed by Edge) to reduce latency for same-site calls.</Paragraph>
      <SubHeading>ICE / STUN / TURN for WebRTC</SubHeading>
      <CodeBlock>{`WebRTC Media Path Negotiation:

1. Agent's browser generates ICE candidates (possible network paths)
   - Host candidate: direct IP address
   - Server-reflexive: public IP via STUN (UDP 3478)
   - Relay candidate: TURN server relay (UDP 3478, TCP 443 fallback)

2. ICE connectivity checks test each candidate pair
   - Tries direct connection first (fastest)
   - Falls back to STUN-assisted path through NAT
   - Last resort: TURN relay (all media proxied through server)

3. Best working path is selected
   - Direct: lowest latency (~5ms overhead)
   - STUN: moderate latency (~10-20ms overhead)
   - TURN: highest latency (~30-80ms overhead, avoid if possible)

Most corporate networks: STUN path is used
Restrictive firewalls (UDP blocked): TURN over TCP 443 fallback`}</CodeBlock>
      <CalloutBox type="info">
        <strong>TURN relay is a last resort.</strong> If more than 20% of your agents are using TURN, investigate firewall rules. TURN adds latency and consumes Genesys bandwidth. Opening UDP 3478 and UDP 16384-65535 eliminates the need for TURN in most cases.
      </CalloutBox>
    </section>

    {/* T3S2 */}
    <section ref={el => sectionRefs.current['t3s2'] = el} id="t3s2">
      <SectionHeading>SIP Signaling Deep Dive</SectionHeading>
      <Paragraph>SIP (Session Initiation Protocol) is the signaling protocol that controls call setup, modification, and teardown. Understanding SIP message flow is critical for troubleshooting BYOC connectivity issues, codec negotiation failures, and call establishment problems.</Paragraph>
      <SubHeading>SIP INVITE Flow</SubHeading>
      <div className="my-4 p-4 rounded-lg" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
        <div className="text-center mb-4 text-sm font-bold" style={{ color: C.red, fontFamily: MONO }}>SIP CALL ESTABLISHMENT</div>
        {SIP_FLOW_STEPS.map((s, i) => (
          <div key={i} className="flex items-start gap-3 mb-3 p-2 rounded" style={{ backgroundColor: i === 4 ? C.green + '11' : 'transparent' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ backgroundColor: s.color + '22', color: s.color, border: `2px solid ${s.color}`, fontFamily: MONO }}>{i + 1}</div>
            <div className="flex-1">
              <div className="text-xs font-semibold mb-1" style={{ color: s.color, fontFamily: MONO }}>{s.step}</div>
              <div className="text-xs" style={{ color: C.t2, fontFamily: SANS }}>{s.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <SubHeading>SDP (Session Description Protocol)</SubHeading>
      <CodeBlock>{`Example SDP Offer (from carrier):
v=0
o=- 12345 1 IN IP4 203.0.113.10
s=SIP Call
c=IN IP4 203.0.113.10
t=0 0
m=audio 20000 RTP/SAVP 0 8 18 101
a=rtpmap:0 PCMU/8000       (G.711 u-law)
a=rtpmap:8 PCMA/8000       (G.711 a-law)
a=rtpmap:18 G729/8000      (G.729)
a=rtpmap:101 telephone-event/8000  (DTMF)
a=crypto:1 AES_CM_128_HMAC_SHA1_80 inline:...  (SRTP key)

Genesys SDP Answer (accepting G.711u + SRTP):
m=audio 30000 RTP/SAVP 0 101
a=rtpmap:0 PCMU/8000
a=rtpmap:101 telephone-event/8000
a=crypto:1 AES_CM_128_HMAC_SHA1_80 inline:...`}</CodeBlock>
      <CalloutBox type="warning">Codec mismatch is the #1 cause of BYOC call failures. If the carrier offers only G.729 but Genesys is configured for G.711 only, the SDP negotiation fails and the call drops. Always align your trunk base settings codec list with your carrier's capabilities.</CalloutBox>
    </section>

    {/* T3S3 */}
    <section ref={el => sectionRefs.current['t3s3'] = el} id="t3s3">
      <SectionHeading>Edge Appliance Management</SectionHeading>
      <Paragraph>Edge appliances are the workhorses of BYOC Premises deployments. They require careful provisioning, ongoing maintenance, and monitoring. This section covers the full lifecycle from deployment to troubleshooting.</Paragraph>
      <div className="space-y-4 my-4">
        {EDGE_MANAGEMENT.map((e, i) => (
          <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
            <div className="font-bold text-sm mb-3" style={{ color: C.t1, fontFamily: MONO }}>{e.title}</div>
            <div className="space-y-1">
              {e.items.map((item, j) => (
                <div key={j} className="text-xs flex items-start gap-2" style={{ color: C.t2, fontFamily: MONO }}>
                  <ArrowRight size={10} style={{ color: C.red, flexShrink: 0, marginTop: 3 }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <SubHeading>Media Bypass</SubHeading>
      <Paragraph>Media bypass allows RTP audio to flow directly between the PSTN carrier and the agent's SIP phone, bypassing the Edge's media processing. This reduces latency and Edge CPU usage but disables recording and transcoding for those calls. Use for high-volume, low-priority calls where recording is not required.</Paragraph>
    </section>

    {/* T3S4 */}
    <section ref={el => sectionRefs.current['t3s4'] = el} id="t3s4">
      <SectionHeading>Advanced BYOC Patterns</SectionHeading>
      <Paragraph>Advanced BYOC configurations enable enterprise-grade telephony architectures with carrier redundancy, geographic routing, custom signaling, and SBC integration. These patterns are common in large, multi-site contact center deployments.</Paragraph>
      <div className="space-y-4 my-4">
        {ADVANCED_BYOC_PATTERNS.map((p, i) => (
          <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
            <div className="font-bold text-sm mb-3" style={{ color: C.t1, fontFamily: MONO }}>{p.title}</div>
            <div className="space-y-1">
              {p.steps.map((s, j) => (
                <div key={j} className="text-xs flex items-start gap-2" style={{ color: C.t2, fontFamily: MONO }}>
                  <ArrowRight size={10} style={{ color: C.red, flexShrink: 0, marginTop: 3 }} />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* T3S5 */}
    <section ref={el => sectionRefs.current['t3s5'] = el} id="t3s5">
      <SectionHeading>API & Programmatic Management</SectionHeading>
      <Paragraph>The Genesys Cloud Telephony API provides complete programmatic control over Edge appliances, trunks, phones, DIDs, and sites. This enables infrastructure-as-code deployments, automated provisioning, and custom monitoring dashboards.</Paragraph>
      <SubHeading>Key API Endpoints</SubHeading>
      <InteractiveTable searchable headers={['Method', 'Endpoint', 'Use']} rows={API_ENDPOINTS.map(e => [e.method, e.path, e.use])} />
      <SubHeading>SIP Trace API</SubHeading>
      <Paragraph>The SIP trace API is invaluable for troubleshooting. It captures SIP signaling messages for specific conversations, showing the full INVITE/200 OK/BYE flow with SDP payloads. Use it to diagnose codec negotiation failures, authentication errors, and call routing issues.</Paragraph>
      <CodeBlock>{`// Retrieve SIP traces for a conversation
GET /api/v2/telephony/siptraces?conversationId={id}

// Response includes:
{
  "entities": [
    {
      "method": "INVITE",
      "requestUri": "sip:+15551234567@sip.genesys.com",
      "fromUser": "carrier-proxy",
      "toUser": "+15551234567",
      "sdp": { ... },     // Full SDP offer/answer
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ]
}`}</CodeBlock>
    </section>

    {/* T3S6 */}
    <section ref={el => sectionRefs.current['t3s6'] = el} id="t3s6">
      <SectionHeading>Platform Limits Reference</SectionHeading>
      <InteractiveTable searchable headers={['Resource', 'Limit', 'Notes']} rows={PLATFORM_LIMITS} />
    </section>

    {/* T3S7 */}
    <section ref={el => sectionRefs.current['t3s7'] = el} id="t3s7">
      <SectionHeading>Licensing & Feature Matrix</SectionHeading>
      <Paragraph>Genesys Cloud is available in three license tiers: GC1, GC2, and GC3. Core telephony features — Cloud Voice, BYOC, WebRTC, call recording — are available across all tiers. Advanced voice capabilities like speech analytics and voice transcription require higher tiers.</Paragraph>
      <InteractiveTable headers={['Feature', 'GC1', 'GC2', 'GC3']} rows={LICENSE_MATRIX} />
      <CalloutBox type="info">
        <strong>License note:</strong> GC1 includes full telephony (Cloud Voice, BYOC, WebRTC, recording). GC2 adds quality management and workforce management as add-ons. GC3 includes AI features: speech analytics, voice transcription, predictive routing, and full workforce engagement management.
      </CalloutBox>
    </section>

    {/* T3S8 */}
    <section ref={el => sectionRefs.current['t3s8'] = el} id="t3s8">
      <SectionHeading>Network Requirements & Troubleshooting Decision Tree</SectionHeading>
      <SubHeading>Network Requirements</SubHeading>
      <div className="space-y-4 my-4">
        {NETWORK_REQUIREMENTS.map((r, i) => (
          <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
            <div className="font-bold text-sm mb-3" style={{ color: C.red, fontFamily: MONO }}>{r.category}</div>
            <div className="space-y-1">
              {r.items.map((item, j) => (
                <div key={j} className="text-xs flex items-start gap-2" style={{ color: C.t2, fontFamily: MONO }}>
                  <ArrowRight size={10} style={{ color: C.blue, flexShrink: 0, marginTop: 3 }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <SubHeading>Troubleshooting Decision Tree</SubHeading>
      <Paragraph>Click each symptom to reveal the investigation path.</Paragraph>
      <div className="space-y-3 my-4">
        {TROUBLESHOOTING.map((t, i) => (
          <ExpandableCard key={i} title={t.symptom} accent={C.red}>
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
const GenesysTelephonyGuide = ({ onBack, isDark: isDarkProp, setIsDark: setIsDarkProp }) => {
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
            <span className="font-bold text-sm hidden sm:block" style={{ fontFamily: MONO, color: C.red }}>GENESYS TELEPHONY GUIDE</span>
            <span className="font-bold text-sm sm:hidden" style={{ fontFamily: MONO, color: C.red }}>GC TELEPHONY</span>
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
        <div className="text-xs" style={{ color: C.t3, fontFamily: MONO }}>Genesys Cloud Telephony & Edge — Interactive Knowledge Guide</div>
        <div className="text-[10px] mt-1" style={{ color: C.bg4 }}>Built with React * Tailwind CSS * lucide-react</div>
      </footer>
    </div>
  );
};

export default GenesysTelephonyGuide;
