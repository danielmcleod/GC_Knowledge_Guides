import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Rocket, Settings, Cpu, Search, ChevronDown, ChevronUp, ChevronRight,
  Menu, X, Phone, Mail, MessageSquare, Bell, RefreshCw, CheckCircle,
  AlertTriangle, AlertCircle, Info, Lightbulb, Star, ExternalLink,
  BookOpen, ArrowRight, ArrowDown, ArrowLeft, Circle, Zap, Shield, Clock, Users,
  FileText, Database, Activity, BarChart3, Target, PhoneCall, Monitor,
  Hash, Layers, Eye, ClipboardList, Volume2, Sun, Moon, GitBranch, Filter,
  Shuffle, UserCheck, Radio, Headphones, Globe, Calendar, Timer, TrendingUp,
  Award, Key, Lock, Unlock, MapPin
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
  'The Big Picture — What Knowledge Management Is and Why It Matters',
  'Building, Tuning & Integrating Your Knowledge Base',
];
const TIER_AUDIENCES = [
  'For everyone — no experience needed',
  'For administrators, content authors & engineers',
];
const TIER_ICONS_KEYS = ['Rocket', 'Settings'];

// ══════════════════════════════════════════════════════════════
// SECTION METADATA (all tiers)
// ══════════════════════════════════════════════════════════════
const SECTIONS = [
  { tier: 0, id: 't1s1', title: 'What Is Knowledge Management?' },
  { tier: 0, id: 't1s2', title: 'The Building Blocks — Key Components' },
  { tier: 0, id: 't1s3', title: 'How Knowledge Works — Agent & Customer Facing' },
  { tier: 0, id: 't1s4', title: 'V1 vs V2 Knowledge — Migration Guide' },
  { tier: 0, id: 't1s5', title: 'Key Terminology Glossary' },
  { tier: 1, id: 't2s1', title: 'Prerequisites & Setup' },
  { tier: 1, id: 't2s2', title: 'Creating & Organizing Knowledge Bases' },
  { tier: 1, id: 't2s3', title: 'Article Authoring Best Practices' },
  { tier: 1, id: 't2s4', title: 'Search Configuration & Tuning' },
  { tier: 1, id: 't2s5', title: 'Agent-Facing Knowledge Panel' },
  { tier: 1, id: 't2s6', title: 'Bot & AI Integration' },
  { tier: 1, id: 't2s7', title: 'API & Bulk Management' },
  { tier: 1, id: 't2s8', title: 'Platform Limits & Troubleshooting' },
];

// ══════════════════════════════════════════════════════════════
// T1 DATA
// ══════════════════════════════════════════════════════════════
const KNOWLEDGE_USE_CASES = [
  { icon: 'Users', label: 'Agent Assist', desc: 'Surface relevant articles to agents in real time during live interactions' },
  { icon: 'Globe', label: 'Customer Self-Service', desc: 'Expose FAQ content on your website or app so customers find answers without calling' },
  { icon: 'MessageSquare', label: 'Bot Answers', desc: 'Power chatbots and voicebots with knowledge articles for automated resolution' },
  { icon: 'Search', label: 'Internal Search', desc: 'Let agents search a centralized knowledge repository from the agent desktop' },
  { icon: 'FileText', label: 'Onboarding & Training', desc: 'New hires learn processes and policies through structured knowledge articles' },
  { icon: 'TrendingUp', label: 'Continuous Improvement', desc: 'Track which articles are viewed, helpful, or missing to improve content over time' },
];

const KNOWLEDGE_MAP_NODES = [
  { id: 'knowledgeBase', label: 'KNOWLEDGE BASE', sub: 'Content container', x: 400, y: 60 },
  { id: 'articles', label: 'ARTICLES', sub: 'Individual documents', x: 130, y: 150 },
  { id: 'categories', label: 'CATEGORIES', sub: 'Content taxonomy', x: 670, y: 150 },
  { id: 'search', label: 'SEARCH', sub: 'Discovery engine', x: 80, y: 310 },
  { id: 'agentPanel', label: 'AGENT PANEL', sub: 'Desktop integration', x: 110, y: 450 },
  { id: 'customerFaq', label: 'CUSTOMER FAQ', sub: 'Self-service portal', x: 300, y: 540 },
  { id: 'v2Api', label: 'V2 API', sub: 'Programmatic access', x: 720, y: 310 },
  { id: 'botIntegration', label: 'BOT INTEGRATION', sub: 'Automated answers', x: 690, y: 450 },
];
const KNOWLEDGE_MAP_CENTER = { x: 400, y: 300 };

const KNOWLEDGE_NODE_TOOLTIPS = {
  knowledgeBase: { explanation: 'A language-specific container that holds all your articles, categories, and labels — the top-level organizational unit for knowledge content', analogy: 'A library building that holds all the books on a given topic' },
  articles: { explanation: 'Individual pieces of content (FAQ answers, how-to guides, troubleshooting steps) that agents or customers can read to resolve questions', analogy: 'A single page in an encyclopedia answering one specific question' },
  categories: { explanation: 'Hierarchical folders used to organize articles by topic (e.g., Billing > Refunds, Technical > Password Reset) for easier browsing', analogy: 'The chapter headings and sub-sections in a textbook' },
  search: { explanation: 'The NLP-powered search engine that finds the most relevant articles based on a query, using semantic understanding and keyword matching', analogy: 'The librarian who understands your question and finds the right book' },
  agentPanel: { explanation: 'The knowledge widget embedded in the Genesys Cloud agent desktop that surfaces article suggestions during live interactions', analogy: 'A research assistant sitting next to you, handing you relevant notes during a meeting' },
  customerFaq: { explanation: 'An externally-facing FAQ portal or widget where customers can browse and search knowledge articles without contacting support', analogy: 'The FAQ page on a company website that answers common questions' },
  v2Api: { explanation: 'The REST API (V2) that enables programmatic creation, update, search, and bulk management of knowledge base content', analogy: 'The loading dock at the back of the library for bulk book deliveries' },
  botIntegration: { explanation: 'The connection between knowledge articles and Genesys bots (digital or voice) that enables automated answer delivery with confidence scoring', analogy: 'An automated phone operator who reads the right FAQ answer to callers' },
};

const KNOWLEDGE_SURFACES = [
  {
    name: 'Agent Assist Panel', type: 'Agent-Facing', color: C.blue,
    desc: 'Articles surface automatically in the agent desktop during live interactions. The system analyzes the conversation in real time and suggests relevant articles. Agents can also manually search the knowledge base.',
    features: ['Auto-suggestion based on conversation context', 'Manual keyword search', 'Article preview in side panel', 'Copy-paste answers into chat/email', 'Feedback: mark article as helpful or not'],
  },
  {
    name: 'Bot / Digital Assistant', type: 'Customer-Facing', color: C.green,
    desc: 'Knowledge articles power bot responses. When a customer asks a question, the bot searches the knowledge base and returns the best-matching article with a confidence score. If confidence is below threshold, the bot escalates to a live agent.',
    features: ['FAQ-style automated answers', 'Confidence threshold configuration', 'Answer highlighting from article body', 'Fallback to agent when confidence is low', 'Multi-turn follow-up support'],
  },
  {
    name: 'External FAQ / Self-Service', type: 'Customer-Facing', color: C.orange,
    desc: 'Publish knowledge articles to an external-facing FAQ page or widget embedded on your website. Customers can browse by category or search for answers without ever contacting support.',
    features: ['Public-facing article portal', 'Category-based browsing', 'Full-text search for customers', 'Embeddable widget for any website', 'Analytics on article views and searches'],
  },
];

const V1_VS_V2 = [
  ['Architecture', 'Legacy, limited API surface', 'Modern microservice, full REST API'],
  ['Article Format', 'Simple text with basic formatting', 'Rich text, structured content, images, variations'],
  ['Search', 'Basic keyword matching', 'NLP-powered semantic search with relevance tuning'],
  ['Categories', 'Flat (single level)', 'Hierarchical (nested categories)'],
  ['Labels', 'Not supported', 'Tag-based labeling for cross-cutting organization'],
  ['Variations', 'Not supported', 'Channel-specific content variations per article'],
  ['Bot Integration', 'Limited, manual configuration', 'Native Knowledge Workbench with confidence tuning'],
  ['Bulk Operations', 'Not available', 'Bulk import/export via API and UI'],
  ['Analytics', 'Basic view counts', 'Detailed search analytics, feedback tracking, gap analysis'],
  ['API Version', '/api/v2/knowledge (V1 endpoints)', '/api/v2/knowledge (V2 endpoints — different resource paths)'],
];

const GLOSSARY = [
  { term: 'Knowledge Base', def: 'A language-specific container for all knowledge content — articles, categories, and labels. Each org can have multiple knowledge bases for different languages or business units.', tier: 'Tier 1' },
  { term: 'Article', def: 'A single piece of knowledge content: a question-and-answer pair, a how-to guide, or a troubleshooting procedure. The fundamental content unit.', tier: 'Tier 1' },
  { term: 'Category', def: 'A hierarchical folder for organizing articles by topic. Categories can be nested up to 3 levels deep (e.g., Billing > Refunds > International).', tier: 'Tier 1' },
  { term: 'Label', def: 'A flat tag applied to articles for cross-cutting organization that spans categories (e.g., "VIP", "Holiday Policy", "Urgent"). An article can have multiple labels.', tier: 'Tier 1' },
  { term: 'Variation', def: 'A channel-specific version of an article. The same article can have different content for chat (short), email (detailed), and voice (scripted).', tier: 'Tier 2' },
  { term: 'Knowledge Workbench', def: 'The admin interface for creating, editing, organizing, and publishing knowledge articles. Includes bulk tools and analytics.', tier: 'Tier 2' },
  { term: 'Agent Assist', def: 'The real-time article suggestion feature that surfaces relevant knowledge to agents during live customer interactions.', tier: 'Tier 1' },
  { term: 'Confidence Score', def: 'A 0-100% score indicating how confident the search engine is that a returned article matches the query. Used by bots to decide whether to show an answer or escalate.', tier: 'Tier 2' },
  { term: 'Semantic Search', def: 'NLP-based search that understands the meaning of a query, not just keywords. "How do I get my money back?" matches an article titled "Refund Policy."', tier: 'Tier 2' },
  { term: 'Synonym', def: 'A configured word mapping that tells the search engine two terms are equivalent (e.g., "cancel" = "terminate" = "end subscription").', tier: 'Tier 2' },
  { term: 'Feedback Loop', def: 'The mechanism where agents or customers mark articles as helpful or not, driving continuous content improvement and search relevance tuning.', tier: 'Tier 2' },
  { term: 'Structured Content', def: 'Article content formatted with headings, bullet lists, numbered steps, tables, and images — as opposed to plain unformatted text.', tier: 'Tier 2' },
  { term: 'Knowledge V2', def: 'The current-generation knowledge management platform in Genesys Cloud with rich content, semantic search, and full API support. Replaces V1.', tier: 'Tier 1' },
  { term: 'Gap Analysis', def: 'An analytics feature that identifies customer questions for which no matching article exists — revealing content gaps in your knowledge base.', tier: 'Tier 2' },
  { term: 'Answer Highlighting', def: 'When a bot returns an article, the system highlights the specific passage most relevant to the customer question, rather than returning the full article.', tier: 'Tier 2' },
];

// ══════════════════════════════════════════════════════════════
// T2 DATA
// ══════════════════════════════════════════════════════════════
const PREREQUISITES = [
  { title: 'Genesys Cloud Organization', detail: 'An active Genesys Cloud CX org with admin access. Knowledge Management is available on GC2 and GC3 licenses. GC1 orgs require an add-on. Verify your license includes "Knowledge" in Admin > Organization > Subscription.' },
  { title: 'Roles & Permissions', detail: 'Key permissions: Knowledge > KnowledgeBase > Add/Edit/View/Delete for knowledge admins. Knowledge > Article > Add/Edit/View/Delete/Publish for content authors. Knowledge > Label/Category > Add/Edit/Delete for taxonomy managers. Agents need Knowledge > Article > View to access the agent assist panel.' },
  { title: 'Content Strategy Defined', detail: 'Before building, define: What topics will your knowledge base cover? Who is the audience (agents, customers, or both)? What categories and labels will you use? Who will author and maintain content? A content governance plan prevents knowledge bases from becoming stale and disorganized.' },
  { title: 'Language Planning', detail: 'Each knowledge base is tied to a single language. If you support customers in English, Spanish, and French, you need three separate knowledge bases. Plan your language coverage before creating bases — articles are not automatically translated between bases.' },
];

const KB_CREATION_STEPS = [
  { step: 'Create Knowledge Base', detail: 'Admin > Knowledge > Create Knowledge Base. Name it descriptively (e.g., "Support_EN", "Sales_ES"). Select the language. Optionally add a description.' },
  { step: 'Define Category Hierarchy', detail: 'Create top-level categories (Billing, Technical, Account). Add sub-categories as needed (Billing > Refunds, Billing > Invoices). Maximum 3 levels of nesting.' },
  { step: 'Create Labels', detail: 'Define cross-cutting labels: "VIP", "Holiday", "Deprecated", "New Hire", "Bot-Ready". Labels complement categories by enabling flexible article grouping.' },
  { step: 'Author Articles', detail: 'Create articles using the rich text editor. Each article needs: a clear title (phrased as a question works best), body content with structured formatting, category assignment, and optional labels.' },
  { step: 'Add Variations', detail: 'For multi-channel deployments, create variations: a short version for chat, a detailed version for email, a scripted version for voice agent assist.' },
  { step: 'Publish', detail: 'Articles start in Draft status. Review and publish to make them available for search, agent assist, and bot integration. Unpublished articles are invisible to agents and customers.' },
];

const ARTICLE_BEST_PRACTICES = [
  { title: 'Write Titles as Questions', desc: 'Phrase article titles the way a customer or agent would ask: "How do I reset my password?" not "Password Reset Procedure". This dramatically improves search relevance.', color: C.green },
  { title: 'Use Structured Formatting', desc: 'Use headings, numbered steps, bullet lists, and bold text. Structured content is easier to scan, and the search engine can extract better answers from well-formatted articles.', color: C.blue },
  { title: 'Keep Articles Focused', desc: 'One article = one topic. Avoid mega-articles that cover everything. An article titled "Billing FAQ" with 50 sub-topics is harder to search and maintain than 50 focused articles.', color: C.orange },
  { title: 'Include Keywords Naturally', desc: 'Think about what terms customers use (not internal jargon). If customers say "cancel my plan" but your article says "subscription termination," add synonyms or include both phrasings in the content.', color: C.purple },
  { title: 'Add Alt Text to Images', desc: 'When including screenshots or diagrams, add descriptive alt text. This improves accessibility and gives the search engine more context about the article content.', color: C.yellow },
  { title: 'Review and Update Regularly', desc: 'Set a review cadence (quarterly is common). Stale articles erode trust. Use analytics to identify low-rated articles and update or retire them.', color: C.red },
];

const SEARCH_CONFIG = [
  { setting: 'Semantic Search', desc: 'NLP-powered understanding of query intent. "How do I get a refund?" matches articles about returns, refund policies, and money-back guarantees even if the exact words differ.' },
  { setting: 'Keyword Matching', desc: 'Traditional word-based matching that complements semantic search. Important for product names, error codes, and specific terms the NLP model may not recognize.' },
  { setting: 'Synonyms', desc: 'Define equivalent terms: "cancel" = "terminate" = "end subscription". When a user searches for any synonym, articles containing any of the mapped terms are returned.' },
  { setting: 'Relevance Tuning', desc: 'Adjust the weight given to title matches vs. body matches vs. category context. Title matches are typically weighted highest since titles are the most concise description of article content.' },
  { setting: 'Feedback Signals', desc: 'When agents or customers mark articles as helpful, the system boosts those articles in future search results. Negative feedback deprioritizes articles. This creates a self-improving search experience.' },
  { setting: 'Gap Analysis', desc: 'The system tracks searches that returned zero or low-confidence results. These "content gaps" highlight topics where new articles need to be written.' },
];

const AGENT_PANEL_FEATURES = [
  { name: 'Auto-Suggest', desc: 'As the customer types (chat) or speaks (voice with transcription), the knowledge panel automatically surfaces relevant articles without the agent needing to search manually.', color: C.blue },
  { name: 'Manual Search', desc: 'Agents can type their own search queries into the knowledge panel to find specific articles. Useful when auto-suggest does not surface the right content.', color: C.green },
  { name: 'Article Preview', desc: 'Agents see a preview of the article directly in the side panel without navigating away from the conversation. Full article opens in an expanded view.', color: C.orange },
  { name: 'Copy to Conversation', desc: 'One-click copy of article content (or specific sections) into the active chat or email response. Saves agents from retyping standard answers.', color: C.purple },
  { name: 'Article Feedback', desc: 'Agents can rate articles as helpful or not helpful with optional comments. This feedback drives search relevance improvements and identifies articles needing updates.', color: C.yellow },
  { name: 'Interaction Context', desc: 'The panel uses the current interaction context (queue, skills, customer data) to filter and prioritize article suggestions, making results more relevant.', color: C.red },
];

const BOT_INTEGRATION_CONFIG = [
  { setting: 'Knowledge Workbench', desc: 'The admin tool for connecting knowledge bases to bots. Configure which knowledge base(s) a bot can access, set confidence thresholds, and test search queries against the bot.' },
  { setting: 'Confidence Threshold', desc: 'The minimum confidence score (0-100%) required for the bot to display an answer. Below threshold: bot says "I\'m not sure, let me connect you with an agent." Typical setting: 60-75%.' },
  { setting: 'Answer Highlighting', desc: 'Instead of showing the entire article, the bot highlights the specific paragraph or sentence most relevant to the customer question. Reduces information overload.' },
  { setting: 'Fallback Behavior', desc: 'When no article matches or confidence is too low: escalate to live agent, offer alternative suggestions, ask the customer to rephrase, or provide a generic "I couldn\'t find that" message.' },
  { setting: 'Multi-Turn Conversations', desc: 'Bots can ask clarifying questions before searching knowledge. "Are you asking about billing or technical support?" narrows the search context and improves result quality.' },
  { setting: 'FAQ Bot Template', desc: 'Genesys provides a pre-built FAQ bot template that connects directly to your knowledge base. Minimal configuration required — just link the knowledge base and deploy.' },
];

const API_ENDPOINTS = [
  { method: 'GET', path: '/api/v2/knowledge/knowledgebases', use: 'List all knowledge bases in the org' },
  { method: 'POST', path: '/api/v2/knowledge/knowledgebases', use: 'Create a new knowledge base' },
  { method: 'GET', path: '/api/v2/knowledge/knowledgebases/{knowledgeBaseId}/categories', use: 'List categories in a knowledge base' },
  { method: 'POST', path: '/api/v2/knowledge/knowledgebases/{knowledgeBaseId}/categories', use: 'Create a new category' },
  { method: 'GET', path: '/api/v2/knowledge/knowledgebases/{knowledgeBaseId}/documents', use: 'List articles (documents) in a knowledge base' },
  { method: 'POST', path: '/api/v2/knowledge/knowledgebases/{knowledgeBaseId}/documents', use: 'Create a new article' },
  { method: 'PATCH', path: '/api/v2/knowledge/knowledgebases/{knowledgeBaseId}/documents/{documentId}', use: 'Update an existing article' },
  { method: 'POST', path: '/api/v2/knowledge/knowledgebases/{knowledgeBaseId}/documents/search', use: 'Search articles with query and filters' },
  { method: 'POST', path: '/api/v2/knowledge/knowledgebases/{knowledgeBaseId}/documents/bulk', use: 'Bulk create or update articles (import)' },
  { method: 'GET', path: '/api/v2/knowledge/knowledgebases/{knowledgeBaseId}/labels', use: 'List all labels in a knowledge base' },
  { method: 'POST', path: '/api/v2/knowledge/knowledgebases/{knowledgeBaseId}/labels', use: 'Create a new label' },
  { method: 'POST', path: '/api/v2/knowledge/knowledgebases/{knowledgeBaseId}/export/jobs', use: 'Start a bulk export job (returns download link)' },
  { method: 'POST', path: '/api/v2/knowledge/knowledgebases/{knowledgeBaseId}/import/jobs', use: 'Start a bulk import job from JSON or CSV' },
];

const PLATFORM_LIMITS = [
  ['Knowledge bases per org', '100', 'One per language recommended'],
  ['Articles per knowledge base', '20,000', ''],
  ['Categories per knowledge base', '500', 'Up to 3 levels of nesting'],
  ['Labels per knowledge base', '200', ''],
  ['Labels per article', '20', ''],
  ['Variations per article', '10', 'One per channel/context'],
  ['Article body size', '200 KB', 'Rich text including formatting'],
  ['Images per article', '20', 'Max 10 MB per image'],
  ['Bulk import batch size', '500 articles', 'Per import job'],
  ['Search results per query', '50', 'Paginated, default 10 per page'],
  ['Synonyms per knowledge base', '500', 'Synonym group mappings'],
  ['API rate limit (search)', '300 requests/min', 'Per org, across all bases'],
  ['API rate limit (CRUD)', '600 requests/min', 'Per org, create/update/delete'],
  ['Export job size', '20,000 articles', 'Per export job'],
];

const TROUBLESHOOTING = [
  { symptom: 'Search returns irrelevant or no results', investigation: 'Check: Are articles published (draft articles are not searchable)? Is the search query matching the language of the knowledge base? Have synonyms been configured for common alternative terms? Is the article title phrased in a way that matches how users search? Try rephrasing the query. Check if the article body contains the relevant keywords. Review relevance tuning settings.' },
  { symptom: 'Agent assist panel not showing suggestions', investigation: 'Check: Is the knowledge panel enabled for the agent\'s queue/interaction type? Does the agent have Knowledge > Article > View permission? Is the knowledge base assigned to the agent assist configuration? Is real-time transcription enabled (required for voice auto-suggest)? Check that articles are published, not in draft. Verify the knowledge base language matches the interaction language.' },
  { symptom: 'Bot returning wrong articles or low confidence', investigation: 'Check: Is the confidence threshold set appropriately (too low = wrong answers, too high = no answers)? Are article titles written as natural questions? Is the knowledge base connected to the correct bot flow? Are there duplicate or overlapping articles confusing the search engine? Review answer highlighting settings — the bot may be extracting the wrong passage.' },
  { symptom: 'Bulk import failing or articles missing', investigation: 'Check: Is the import file in the correct format (JSON or CSV with required fields)? Are all required fields populated (title, body, category)? Does the category referenced in the import exist in the knowledge base? Is the file size within the 500-article batch limit? Check for encoding issues (UTF-8 required). Review the import job status via API for specific error messages.' },
  { symptom: 'Articles not appearing after publishing', investigation: 'Check: Is the article status truly "Published" (not stuck in "Draft" or "Archived")? Is the article assigned to a category? Search indexing may take 1-2 minutes after publishing — wait and retry. Check if a label filter is active that excludes the article. Verify the knowledge base is active (not disabled). Clear browser cache and reload the agent desktop.' },
  { symptom: 'Knowledge base performance is slow', investigation: 'Check: Are you within API rate limits (300 search/min, 600 CRUD/min)? Is the knowledge base very large (close to 20,000 articles)? Are search queries overly broad (single-word queries return too many results)? Is the integration making redundant API calls? Check network latency to Genesys Cloud API endpoints. Consider pagination — requesting all articles at once is slow; use page sizes of 10-25.' },
];

// ══════════════════════════════════════════════════════════════
// SEARCH INDEX
// ══════════════════════════════════════════════════════════════
const SEARCH_INDEX = (() => {
  const idx = [];
  SECTIONS.forEach(s => idx.push({ text: s.title, label: s.title, sectionId: s.id, tier: s.tier, type: 'Section' }));
  KNOWLEDGE_USE_CASES.forEach(u => idx.push({ text: `${u.label} ${u.desc}`, label: u.label, sectionId: 't1s1', tier: 0, type: 'Use Case' }));
  KNOWLEDGE_SURFACES.forEach(s => idx.push({ text: `${s.name} ${s.type} ${s.desc} ${s.features.join(' ')}`, label: s.name, sectionId: 't1s3', tier: 0, type: 'Knowledge Surface' }));
  V1_VS_V2.forEach(v => idx.push({ text: `${v[0]} ${v[1]} ${v[2]}`, label: v[0], sectionId: 't1s4', tier: 0, type: 'V1 vs V2' }));
  GLOSSARY.forEach(g => idx.push({ text: `${g.term} ${g.def}`, label: g.term, sectionId: 't1s5', tier: 0, type: 'Glossary' }));
  PREREQUISITES.forEach(p => idx.push({ text: `${p.title} ${p.detail}`, label: p.title, sectionId: 't2s1', tier: 1, type: 'Prerequisite' }));
  KB_CREATION_STEPS.forEach(s => idx.push({ text: `${s.step} ${s.detail}`, label: s.step, sectionId: 't2s2', tier: 1, type: 'Knowledge Base' }));
  ARTICLE_BEST_PRACTICES.forEach(a => idx.push({ text: `${a.title} ${a.desc}`, label: a.title, sectionId: 't2s3', tier: 1, type: 'Best Practice' }));
  SEARCH_CONFIG.forEach(s => idx.push({ text: `${s.setting} ${s.desc}`, label: s.setting, sectionId: 't2s4', tier: 1, type: 'Search Config' }));
  AGENT_PANEL_FEATURES.forEach(f => idx.push({ text: `${f.name} ${f.desc}`, label: f.name, sectionId: 't2s5', tier: 1, type: 'Agent Panel' }));
  BOT_INTEGRATION_CONFIG.forEach(b => idx.push({ text: `${b.setting} ${b.desc}`, label: b.setting, sectionId: 't2s6', tier: 1, type: 'Bot Integration' }));
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
const KnowledgeComponentMapSVG = () => {
  const [active, setActive] = useState(null);
  return (
    <div className="my-6 overflow-x-auto">
      <svg viewBox="0 0 800 600" className="w-full" style={{ maxWidth: 800, minWidth: 600 }}>
        <defs>
          <filter id="glow-k"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        {KNOWLEDGE_MAP_NODES.map(n => (
          <line key={`line-${n.id}`} x1={KNOWLEDGE_MAP_CENTER.x} y1={KNOWLEDGE_MAP_CENTER.y} x2={n.x} y2={n.y} stroke={C.border} strokeWidth="2" strokeDasharray="6,4" />
        ))}
        <g>
          <rect x={KNOWLEDGE_MAP_CENTER.x - 90} y={KNOWLEDGE_MAP_CENTER.y - 30} width={180} height={60} rx={12} fill={C.bg3} stroke={C.green} strokeWidth={2} />
          <text x={KNOWLEDGE_MAP_CENTER.x} y={KNOWLEDGE_MAP_CENTER.y - 5} textAnchor="middle" fill={C.t1} fontFamily={MONO} fontSize={12} fontWeight="bold">KNOWLEDGE ENGINE</text>
          <text x={KNOWLEDGE_MAP_CENTER.x} y={KNOWLEDGE_MAP_CENTER.y + 15} textAnchor="middle" fill={C.t3} fontFamily={SANS} fontSize={10}>The content brain</text>
        </g>
        {KNOWLEDGE_MAP_NODES.map(n => {
          const isActive = active === n.id;
          const tooltip = KNOWLEDGE_NODE_TOOLTIPS[n.id];
          return (
            <g key={n.id} className="cursor-pointer" onClick={() => setActive(isActive ? null : n.id)} style={{ transition: 'transform 0.2s' }}>
              <rect x={n.x - 70} y={n.y - 25} width={140} height={50} rx={8} fill={C.bg2} stroke={isActive ? C.green : C.border} strokeWidth={isActive ? 2 : 1} filter={isActive ? 'url(#glow-k)' : undefined} />
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
      <SectionHeading>What Is Knowledge Management?</SectionHeading>
      <Paragraph>Knowledge Management in Genesys Cloud is the practice of creating, organizing, and delivering the right information to the right person at the right time. Think of it as building a centralized brain for your organization — one that agents can consult during live interactions, bots can use to answer customer questions automatically, and customers can browse for self-service.</Paragraph>
      <Paragraph>Without a knowledge management system, agents rely on tribal knowledge, bookmarked documents, and asking colleagues. Answers are inconsistent, onboarding takes longer, and customers get different responses depending on which agent they reach. A well-built knowledge base solves all of these problems.</Paragraph>
      <SubHeading>Why Knowledge Management Matters</SubHeading>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        {[
          { title: 'WITHOUT KNOWLEDGE MANAGEMENT', items: ['Agents search emails, PDFs, and shared drives for answers', 'Inconsistent responses — each agent gives a different answer', 'Long handle times as agents hunt for information', 'No self-service — customers must call for every question', 'New hires take weeks to learn processes'], color: C.red },
          { title: 'WITH KNOWLEDGE MANAGEMENT', items: ['Centralized, searchable repository of approved answers', 'Consistent responses across all agents and channels', 'Faster handle times — answers are a click away', 'Bot-powered self-service resolves common questions automatically', 'New hires onboard faster with structured knowledge articles'], color: C.green },
        ].map((panel, i) => (
          <div key={i} className="rounded-lg p-5" style={{ backgroundColor: C.bg2, borderTop: `3px solid ${panel.color}` }}>
            <div className="font-bold mb-3 text-sm" style={{ color: panel.color, fontFamily: MONO }}>{panel.title}</div>
            {panel.items.map((item, j) => <div key={j} className="text-sm mb-1.5" style={{ color: C.t2, fontFamily: SANS }}>{item}</div>)}
          </div>
        ))}
      </div>
      <SubHeading>Common Use Cases</SubHeading>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 my-4">
        {KNOWLEDGE_USE_CASES.map((ch, i) => (
          <div key={i} className="rounded-lg p-4 flex items-start gap-3 transition-all duration-200 hover:-translate-y-0.5" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
            <BookOpen size={20} style={{ color: C.green, flexShrink: 0 }} />
            <div><div className="font-semibold text-sm" style={{ color: C.t1, fontFamily: MONO }}>{ch.label}</div><div className="text-xs mt-1" style={{ color: C.t2, fontFamily: SANS }}>{ch.desc}</div></div>
          </div>
        ))}
      </div>
      <CalloutBox type="tip">Knowledge Management is not just a tool — it is a practice. The technology is only as good as the content you put into it. Plan for ongoing content creation, review, and retirement as part of your operational workflow.</CalloutBox>
    </section>

    {/* T1S2 */}
    <section ref={el => sectionRefs.current['t1s2'] = el} id="t1s2">
      <SectionHeading>The Building Blocks — Key Components</SectionHeading>
      <Paragraph>Knowledge Management in Genesys Cloud is built from several interconnected components. The knowledge base holds articles organized into categories, tagged with labels, and delivered through search, agent panels, bots, and APIs. Think of it like a well-organized library: the building (knowledge base) contains books (articles) organized by section (categories) with index tags (labels) and a librarian (search engine) who helps you find what you need.</Paragraph>
      <CalloutBox type="tip">Click any node in the diagram below to see what it does and a simple analogy.</CalloutBox>
      <KnowledgeComponentMapSVG />
      <SubHeading>Component Reference</SubHeading>
      <InteractiveTable
        headers={['Component', 'Simple Explanation', 'Analogy']}
        rows={Object.entries(KNOWLEDGE_NODE_TOOLTIPS).map(([k, v]) => {
          const node = KNOWLEDGE_MAP_NODES.find(n => n.id === k);
          return [node?.label || k, v.explanation, v.analogy];
        })}
      />
    </section>

    {/* T1S3 */}
    <section ref={el => sectionRefs.current['t1s3'] = el} id="t1s3">
      <SectionHeading>How Knowledge Works — Agent & Customer Facing</SectionHeading>
      <Paragraph>Knowledge content in Genesys Cloud is surfaced through three primary channels: the agent assist panel (agent-facing), bot integrations (customer-facing), and external FAQ portals (customer-facing). Each channel delivers the same content but in different ways optimized for the audience.</Paragraph>
      <div className="space-y-4 my-6">
        {KNOWLEDGE_SURFACES.map((s, i) => (
          <div key={i} className="rounded-lg p-5" style={{ backgroundColor: C.bg2, borderLeft: `4px solid ${s.color}` }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold text-sm" style={{ color: s.color, fontFamily: MONO }}>{s.name}</span>
              <span className="text-[10px] px-2 py-0.5 rounded" style={{ backgroundColor: s.color + '22', color: s.color, fontFamily: MONO }}>{s.type}</span>
            </div>
            <div className="text-sm mb-3" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.7 }}>{s.desc}</div>
            <div className="space-y-1 pl-2" style={{ borderLeft: `2px solid ${s.color}33` }}>
              {s.features.map((f, fi) => <div key={fi} className="text-xs" style={{ color: C.t3, fontFamily: SANS }}>* {f}</div>)}
            </div>
          </div>
        ))}
      </div>
      <SubHeading>The Knowledge Flow</SubHeading>
      <div className="my-6 space-y-0">
        {[
          { step: 1, title: 'CONTENT AUTHORED', desc: 'Knowledge admins or content authors create articles in the Knowledge Workbench using the rich text editor. Articles are categorized, labeled, and reviewed.', color: C.green },
          { step: 2, title: 'ARTICLE PUBLISHED', desc: 'After review, articles are published and become available for search. Published articles are indexed by the search engine for both semantic and keyword matching.', color: C.blue },
          { step: 3, title: 'QUERY RECEIVED', desc: 'A search query arrives — from an agent typing in the panel, a bot processing a customer message, or a customer searching the FAQ portal.', color: C.orange },
          { step: 4, title: 'SEARCH ENGINE MATCHES', desc: 'The NLP-powered search engine analyzes the query, considers synonyms and semantic meaning, and returns ranked results with confidence scores.', color: C.purple },
          { step: 5, title: 'CONTENT DELIVERED', desc: 'The best-matching article is displayed to the agent, returned by the bot, or shown on the FAQ page. The right answer reaches the right person.', color: C.green },
          { step: 6, title: 'FEEDBACK CAPTURED', desc: 'The agent or customer rates the article as helpful or not. Feedback improves future search rankings and identifies content that needs improvement.', color: C.yellow },
        ].map((s, i) => (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: s.color + '22', color: s.color, border: `2px solid ${s.color}`, fontFamily: MONO }}>{s.step}</div>
              {i < 5 && <div className="w-0.5 flex-1 my-1" style={{ backgroundColor: C.border }} />}
            </div>
            <div className="pb-6 flex-1">
              <div className="font-bold text-sm mb-1" style={{ color: C.t1, fontFamily: MONO }}>{s.title}</div>
              <div className="text-sm" style={{ color: C.t2, fontFamily: SANS }}>{s.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* T1S4 */}
    <section ref={el => sectionRefs.current['t1s4'] = el} id="t1s4">
      <SectionHeading>V1 vs V2 Knowledge — Migration Guide</SectionHeading>
      <Paragraph>Genesys Cloud originally shipped with a V1 knowledge management system that had limited functionality. The current V2 platform is a complete rewrite with rich content, semantic search, hierarchical categories, labels, and a full API. If your org was created before the V2 rollout, you may still have V1 knowledge bases that need to be migrated.</Paragraph>
      <SubHeading>Feature Comparison</SubHeading>
      <InteractiveTable headers={['Feature', 'V1 (Legacy)', 'V2 (Current)']} rows={V1_VS_V2} />
      <SubHeading>Migration Steps</SubHeading>
      <div className="my-4 p-4 rounded-lg" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
        {[
          { indent: 0, text: 'MIGRATION PLAN', color: C.green },
          { indent: 1, text: '1. Audit existing V1 knowledge base — document article count, categories, and usage', color: C.t2 },
          { indent: 1, text: '2. Export V1 articles (manually or via API — V1 has limited export)', color: C.t2 },
          { indent: 1, text: '3. Create new V2 knowledge base with proper language and category structure', color: C.blue },
          { indent: 1, text: '4. Transform V1 content to V2 format (add rich formatting, structured content)', color: C.blue },
          { indent: 1, text: '5. Bulk import articles into V2 knowledge base via API or UI', color: C.blue },
          { indent: 1, text: '6. Configure V2 search settings: synonyms, relevance tuning, feedback', color: C.orange },
          { indent: 1, text: '7. Update bot flows and agent assist configurations to point to V2 base', color: C.orange },
          { indent: 1, text: '8. Test search quality — compare V1 vs V2 results for key queries', color: C.purple },
          { indent: 1, text: '9. Decommission V1 knowledge base after validation period', color: C.red },
        ].map((line, i) => (
          <div key={i} className="text-xs" style={{ paddingLeft: line.indent * 20, color: line.color, fontFamily: MONO, marginBottom: 2 }}>{line.text}</div>
        ))}
      </div>
      <CalloutBox type="warning">V1 and V2 knowledge bases coexist in the same org but are completely separate systems. You cannot upgrade a V1 base to V2 in place — you must create a new V2 base and migrate content. Plan the migration carefully to avoid disrupting live agent assist and bot integrations.</CalloutBox>
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
  const [activeSearchTab, setActiveSearchTab] = useState(0);
  return (
    <div className="space-y-16">
      {/* T2S1 */}
      <section ref={el => sectionRefs.current['t2s1'] = el} id="t2s1">
        <SectionHeading>Prerequisites & Setup</SectionHeading>
        <Paragraph>Before building your first knowledge base, ensure these platform-level components are in place. Knowledge Management requires both technical prerequisites and a content strategy.</Paragraph>
        <div className="space-y-3 my-4">
          {PREREQUISITES.map((p, i) => (
            <ExpandableCard key={i} title={`${i + 1}. ${p.title}`} accent={C.blue}>
              {p.detail}
            </ExpandableCard>
          ))}
        </div>
        <SubHeading>Recommended Setup Sequence</SubHeading>
        <div className="flex flex-wrap items-center gap-1 my-4 overflow-x-auto">
          {['License Verification', 'Roles & Permissions', 'Content Strategy', 'Create Knowledge Base', 'Build Categories', 'Define Labels', 'Author Articles', 'Configure Search', 'Enable Agent Assist'].map((s, i) => (
            <React.Fragment key={i}>
              <span className="px-3 py-1.5 rounded text-xs whitespace-nowrap" style={{ backgroundColor: C.bg3, color: C.t1, fontFamily: MONO, border: `1px solid ${C.border}` }}>{s}</span>
              {i < 8 && <ArrowRight size={14} style={{ color: C.t3, flexShrink: 0 }} />}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* T2S2 */}
      <section ref={el => sectionRefs.current['t2s2'] = el} id="t2s2">
        <SectionHeading>Creating & Organizing Knowledge Bases</SectionHeading>
        <Paragraph>The knowledge base is the top-level container for all your content. Each base is tied to a single language and contains articles organized into categories and tagged with labels. Getting the structure right from the start prevents costly reorganizations later.</Paragraph>
        <SubHeading>Step-by-Step Creation</SubHeading>
        <div className="my-6 space-y-0">
          {KB_CREATION_STEPS.map((s, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: C.green + '22', color: C.green, border: `2px solid ${C.green}`, fontFamily: MONO }}>{i + 1}</div>
                {i < KB_CREATION_STEPS.length - 1 && <div className="w-0.5 flex-1 my-1" style={{ backgroundColor: C.border }} />}
              </div>
              <div className="pb-6 flex-1">
                <div className="font-bold text-sm mb-1" style={{ color: C.t1, fontFamily: MONO }}>{s.step}</div>
                <div className="text-sm" style={{ color: C.t2, fontFamily: SANS }}>{s.detail}</div>
              </div>
            </div>
          ))}
        </div>
        <SubHeading>Category Design Patterns</SubHeading>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          {[
            { title: 'BY TOPIC (RECOMMENDED)', items: ['Billing > Refunds, Invoices, Payment Methods', 'Technical > Password, Connectivity, Errors', 'Account > Profile, Settings, Cancellation', 'Intuitive for agents and customers alike'], color: C.green },
            { title: 'BY AUDIENCE', items: ['Agent-Only > Internal Procedures, Escalation Paths', 'Customer-Facing > FAQs, How-To Guides', 'Bot-Ready > Short Answers, Structured Responses', 'Best when content differs significantly by audience'], color: C.blue },
          ].map((panel, i) => (
            <div key={i} className="rounded-lg p-5" style={{ backgroundColor: C.bg2, borderTop: `3px solid ${panel.color}` }}>
              <div className="font-bold mb-3 text-sm" style={{ color: panel.color, fontFamily: MONO }}>{panel.title}</div>
              {panel.items.map((item, j) => <div key={j} className="text-sm mb-1.5" style={{ color: C.t2, fontFamily: SANS }}>{item}</div>)}
            </div>
          ))}
        </div>
        <SubHeading>Labels vs Categories</SubHeading>
        <Paragraph>Categories provide hierarchical organization (an article lives in ONE category). Labels provide flat, cross-cutting tags (an article can have MANY labels). Use categories for primary taxonomy and labels for secondary attributes. Example: an article in category "Billing > Refunds" might also have labels "VIP", "Holiday Policy", and "Bot-Ready".</Paragraph>
        <CalloutBox type="info">Plan your category hierarchy before creating articles. Restructuring categories after articles are assigned requires reassigning each article individually. Labels, by contrast, are easy to add and remove at any time.</CalloutBox>
      </section>

      {/* T2S3 */}
      <section ref={el => sectionRefs.current['t2s3'] = el} id="t2s3">
        <SectionHeading>Article Authoring Best Practices</SectionHeading>
        <Paragraph>The quality of your knowledge base depends entirely on the quality of your articles. Well-written, well-structured articles improve search accuracy, reduce handle times, and increase customer self-service success rates.</Paragraph>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-4">
          {ARTICLE_BEST_PRACTICES.map((p, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, borderLeft: `4px solid ${p.color}` }}>
              <div className="font-bold text-sm mb-2" style={{ color: p.color, fontFamily: MONO }}>{p.title}</div>
              <div className="text-xs" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.6 }}>{p.desc}</div>
            </div>
          ))}
        </div>
        <SubHeading>Article Structure Template</SubHeading>
        <CodeBlock>{`TITLE: "How do I [action] my [object]?"
Example: "How do I reset my password?"

BODY STRUCTURE:
  ## Overview
  Brief 1-2 sentence summary of the answer.

  ## Steps
  1. Go to Settings > Account > Security
  2. Click "Reset Password"
  3. Enter your email address
  4. Check your inbox for the reset link
  5. Click the link and enter a new password

  ## Important Notes
  - Password must be at least 8 characters
  - Reset links expire after 24 hours
  - Contact support if you don't receive the email

  ## Related Articles
  - "How do I change my email address?"
  - "What are the password requirements?"`}</CodeBlock>
        <SubHeading>Variations by Channel</SubHeading>
        <Paragraph>Different channels need different article formats. A chat bot needs a short, direct answer. An email response needs a complete, polished explanation. An agent assist panel needs quick reference points. Use article variations to serve the same content in the right format for each channel.</Paragraph>
        <div className="space-y-2 my-3">
          {[
            { channel: 'Chat / Messaging', format: 'Short, direct answer in 2-3 sentences. No formatting heavy content. Include a link to the full article if more detail is needed.', color: C.blue },
            { channel: 'Email', format: 'Complete, well-formatted response with greeting, step-by-step instructions, and closing. Can include images and links.', color: C.orange },
            { channel: 'Voice (Agent Script)', format: 'Conversational talking points the agent can read aloud. Short sentences, no bullet lists. Natural language the agent can paraphrase.', color: C.green },
            { channel: 'Bot / FAQ', format: 'Single-paragraph answer optimized for the bot to display. Must be self-contained — no "see above" references. Keep under 500 characters.', color: C.purple },
          ].map((v, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-start gap-1 p-3 rounded" style={{ backgroundColor: C.bg2 }}>
              <span className="text-xs font-semibold whitespace-nowrap min-w-[160px]" style={{ color: v.color, fontFamily: MONO }}>{v.channel}:</span>
              <span className="text-xs" style={{ color: C.t2, fontFamily: SANS }}>{v.format}</span>
            </div>
          ))}
        </div>
      </section>

      {/* T2S4 */}
      <section ref={el => sectionRefs.current['t2s4'] = el} id="t2s4">
        <SectionHeading>Search Configuration & Tuning</SectionHeading>
        <Paragraph>The search engine is the most critical component of your knowledge system. Even a perfect library is useless if the search function cannot find the right book. Genesys Cloud Knowledge V2 uses NLP-powered semantic search combined with keyword matching and configurable relevance tuning.</Paragraph>
        <SubHeading>Search Capabilities</SubHeading>
        <div className="flex gap-1 mb-3 overflow-x-auto flex-wrap">
          {SEARCH_CONFIG.map((t, i) => (
            <button key={i} className="px-3 py-1.5 rounded text-xs whitespace-nowrap cursor-pointer transition-colors" onClick={() => setActiveSearchTab(i)} style={{ backgroundColor: activeSearchTab === i ? C.green : C.bg3, color: activeSearchTab === i ? '#fff' : C.t2, fontFamily: MONO }}>{t.setting}</button>
          ))}
        </div>
        <div className="p-4 rounded-lg text-sm" style={{ backgroundColor: C.bg2, color: C.t2, fontFamily: SANS, border: `1px solid ${C.border}`, lineHeight: 1.7 }}>{SEARCH_CONFIG[activeSearchTab].desc}</div>
        <SubHeading>Synonym Configuration Example</SubHeading>
        <CodeBlock>{`// Synonym groups — search treats all terms as equivalent
Group 1: "cancel" = "terminate" = "end subscription" = "close account"
Group 2: "refund" = "money back" = "reimbursement" = "credit"
Group 3: "password" = "passphrase" = "login credentials" = "sign-in"
Group 4: "broken" = "not working" = "error" = "malfunction" = "bug"

// When a user searches "money back", articles containing
// "refund", "reimbursement", or "credit" will also be returned.`}</CodeBlock>
        <SubHeading>Search Tuning Best Practices</SubHeading>
        <div className="space-y-1 my-3">
          {[
            { good: true, text: 'Write article titles as natural questions — they receive the highest search weight' },
            { good: true, text: 'Add synonyms for industry jargon, abbreviations, and common misspellings' },
            { good: true, text: 'Review gap analysis weekly — write articles for the top unanswered queries' },
            { good: true, text: 'Encourage agents to submit feedback on article relevance after every interaction' },
            { good: false, text: 'Do not keyword-stuff articles — the semantic engine understands context, not just word frequency' },
            { good: false, text: 'Do not ignore low-rated articles — if agents consistently rate an article as unhelpful, update or retire it' },
            { good: false, text: 'Do not create duplicate articles for the same topic — duplicates confuse search ranking and split feedback' },
          ].map((p, i) => (
            <div key={i} className="text-xs flex items-start gap-2" style={{ color: p.good ? C.green : C.red, fontFamily: SANS }}>
              <span>{p.good ? 'DO' : 'AVOID'}</span><span style={{ color: C.t2 }}>{p.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* T2S5 */}
      <section ref={el => sectionRefs.current['t2s5'] = el} id="t2s5">
        <SectionHeading>Agent-Facing Knowledge Panel</SectionHeading>
        <Paragraph>The agent-facing knowledge panel is the primary way agents access knowledge during live interactions. Embedded in the Genesys Cloud agent desktop, it provides both automatic article suggestions and manual search. When configured correctly, it dramatically reduces the time agents spend searching for answers.</Paragraph>
        <SubHeading>Panel Features</SubHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          {AGENT_PANEL_FEATURES.map((f, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, borderLeft: `4px solid ${f.color}` }}>
              <div className="font-bold text-sm mb-2" style={{ color: f.color, fontFamily: MONO }}>{f.name}</div>
              <div className="text-xs" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
        <SubHeading>Agent Workflow Integration</SubHeading>
        <div className="my-4 p-4 rounded-lg" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
          {[
            { indent: 0, text: 'AGENT RECEIVES INTERACTION', color: C.green },
            { indent: 1, text: 'Knowledge panel opens automatically alongside the interaction', color: C.t2 },
            { indent: 1, text: 'Auto-suggest analyzes customer message / transcript in real time', color: C.blue },
            { indent: 2, text: 'Relevant articles surface in the panel with confidence indicators', color: C.blue },
            { indent: 1, text: 'Agent reviews suggested articles', color: C.t2 },
            { indent: 2, text: 'IF article matches → click to preview → copy answer to conversation', color: C.green },
            { indent: 2, text: 'IF no match → agent searches manually with custom query', color: C.orange },
            { indent: 2, text: 'IF still no match → agent handles from experience, flags content gap', color: C.red },
            { indent: 1, text: 'Agent rates article helpfulness (thumbs up / thumbs down)', color: C.yellow },
            { indent: 0, text: 'FEEDBACK IMPROVES FUTURE SEARCH RESULTS', color: C.green },
          ].map((line, i) => (
            <div key={i} className="text-xs" style={{ paddingLeft: line.indent * 20, color: line.color, fontFamily: MONO, marginBottom: 2 }}>{line.text}</div>
          ))}
        </div>
        <CalloutBox type="tip">For voice interactions, auto-suggest requires real-time speech transcription to be enabled. Without transcription, agents must manually search the knowledge panel. Enable transcription in Admin &gt; Speech & Text Analytics for the best agent assist experience on voice channels.</CalloutBox>
      </section>

      {/* T2S6 */}
      <section ref={el => sectionRefs.current['t2s6'] = el} id="t2s6">
        <SectionHeading>Bot & AI Integration</SectionHeading>
        <Paragraph>Knowledge-powered bots are the front line of customer self-service. By connecting your knowledge base to a Genesys bot, you can automatically answer customer questions without human intervention. When the bot is confident in its answer, the customer gets instant resolution. When confidence is low, the bot smoothly escalates to a live agent.</Paragraph>
        <SubHeading>Integration Configuration</SubHeading>
        <div className="space-y-3 my-4">
          {BOT_INTEGRATION_CONFIG.map((c, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
              <div className="font-semibold text-sm mb-2" style={{ color: C.green, fontFamily: MONO }}>{c.setting}</div>
              <div className="text-sm" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.6 }}>{c.desc}</div>
            </div>
          ))}
        </div>
        <SubHeading>Confidence Threshold Guide</SubHeading>
        <div className="my-4 p-4 rounded-lg" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
          <div className="text-center mb-4 text-sm font-bold" style={{ color: C.green, fontFamily: MONO }}>CONFIDENCE SCORING RANGES</div>
          {[
            { range: '90-100%', label: 'Very High', action: 'Show answer directly with high confidence', color: C.green },
            { range: '75-89%', label: 'High', action: 'Show answer with "Was this helpful?" prompt', color: C.blue },
            { range: '60-74%', label: 'Moderate', action: 'Show answer as "I think this might help..." with alternatives', color: C.yellow },
            { range: '40-59%', label: 'Low', action: 'Offer multiple possible answers and ask customer to choose', color: C.orange },
            { range: '0-39%', label: 'Very Low', action: 'Escalate to live agent — "Let me connect you with someone who can help"', color: C.red },
          ].map((b, i) => (
            <div key={i} className="flex items-start gap-3 mb-3 p-2 rounded" style={{ backgroundColor: i === 0 ? C.green + '11' : 'transparent' }}>
              <div className="w-16 text-center flex-shrink-0">
                <span className="text-xs font-semibold" style={{ color: b.color, fontFamily: MONO }}>{b.range}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-semibold" style={{ color: C.t1, fontFamily: MONO }}>{b.label}</span>
                </div>
                <div className="text-xs" style={{ color: C.t3, fontFamily: SANS }}>{b.action}</div>
              </div>
            </div>
          ))}
        </div>
        <CalloutBox type="warning">Setting the confidence threshold too low causes the bot to give wrong answers, frustrating customers. Setting it too high causes excessive escalations, defeating the purpose of self-service. Start at 70% and adjust based on customer feedback and escalation rates. Monitor the "bot resolved vs. escalated" ratio weekly.</CalloutBox>
      </section>

      {/* T2S7 */}
      <section ref={el => sectionRefs.current['t2s7'] = el} id="t2s7">
        <SectionHeading>API & Bulk Management</SectionHeading>
        <Paragraph>The Knowledge V2 API provides complete programmatic control over knowledge bases, articles, categories, labels, and search. This enables automated content pipelines, bulk imports from external CMS systems, and custom search integrations.</Paragraph>
        <SubHeading>Key API Endpoints</SubHeading>
        <InteractiveTable searchable headers={['Method', 'Endpoint', 'Use']} rows={API_ENDPOINTS.map(e => [e.method, e.path, e.use])} />
        <SubHeading>Bulk Import / Export</SubHeading>
        <Paragraph>For large-scale content management, use the bulk import and export APIs. Export produces a JSON file containing all articles with their metadata. Import accepts JSON or CSV files with article content, categories, and labels.</Paragraph>
        <CodeBlock>{`// Example: Bulk import articles via API
POST /api/v2/knowledge/knowledgebases/{kbId}/import/jobs
Content-Type: application/json

{
  "uploadKey": "uploaded-file-key-from-presigned-url",
  "fileType": "Json",
  "settings": {
    "importAsNew": false,
    "visible": true,
    "categoryId": "category-uuid",
    "labelIds": ["label-uuid-1", "label-uuid-2"]
  }
}

// Import file format (JSON):
[
  {
    "title": "How do I reset my password?",
    "alternatives": [
      { "phrase": "forgot password" },
      { "phrase": "can't log in" }
    ],
    "answer": {
      "contentType": "text/html",
      "content": "<p>To reset your password...</p>"
    },
    "categoryId": "category-uuid",
    "labelIds": ["label-uuid"]
  }
]`}</CodeBlock>
        <SubHeading>Programmatic Article Management</SubHeading>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
          {[
            { title: 'Automated Publishing', desc: 'Build a CI/CD pipeline that pushes knowledge content from your documentation system to Genesys Cloud on every release. Articles stay in sync with product changes.', color: C.green },
            { title: 'Content Sync', desc: 'Synchronize content between Genesys Cloud and external CMS platforms (Confluence, SharePoint, Zendesk) using the API. Maintain a single source of truth.', color: C.blue },
            { title: 'Analytics Export', desc: 'Pull search analytics, feedback data, and gap analysis via API. Feed into your BI tools (Tableau, Power BI) for content performance dashboards.', color: C.orange },
          ].map((u, i) => (
            <div key={i} className="rounded-lg p-4" style={{ backgroundColor: C.bg2, border: `1px solid ${C.border}` }}>
              <div className="font-bold text-sm mb-2" style={{ color: u.color, fontFamily: MONO }}>{u.title}</div>
              <div className="text-xs" style={{ color: C.t2, fontFamily: SANS, lineHeight: 1.6 }}>{u.desc}</div>
            </div>
          ))}
        </div>
        <CalloutBox type="info">
          <strong>Rate limits:</strong> The Knowledge API enforces rate limits of 300 search requests/minute and 600 CRUD requests/minute per org. For bulk operations, use the dedicated bulk import/export endpoints rather than making thousands of individual API calls.
        </CalloutBox>
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
            <ExpandableCard key={i} title={t.symptom} accent={C.green}>
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
const GenesysKnowledgeGuide = ({ onBack, isDark: isDarkProp, setIsDark: setIsDarkProp }) => {
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
            <span className="font-bold text-sm hidden sm:block" style={{ fontFamily: MONO, color: C.green }}>GENESYS KNOWLEDGE GUIDE</span>
            <span className="font-bold text-sm sm:hidden" style={{ fontFamily: MONO, color: C.green }}>GC KNOWLEDGE</span>
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
        <div className="text-xs" style={{ color: C.t3, fontFamily: MONO }}>Genesys Cloud Knowledge Management — Interactive Knowledge Guide</div>
        <div className="text-[10px] mt-1" style={{ color: C.bg4 }}>Built with React * Tailwind CSS * lucide-react</div>
      </footer>
    </div>
  );
};

export default GenesysKnowledgeGuide;