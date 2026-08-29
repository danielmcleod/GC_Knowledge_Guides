#!/usr/bin/env node
/**
 * build-prose-index.js — Extracts narrative prose from all Genesys*Guide.jsx
 * files and generates src/prose-index.js
 *
 * Usage:  node scripts/build-prose-index.js
 *
 * Why this exists:
 *   Each guide exports a SEARCH_INDEX built from its data arrays (BOT_TYPES,
 *   GLOSSARY, etc.). That means narrative content written directly in JSX —
 *   <Paragraph>, <CalloutBox>, <SubHeading> — was never searchable, even
 *   though it carries a large share of the guides' substance.
 *
 *   This script parses the JSX, groups prose by the SubHeading it sits under,
 *   and emits one search entry per heading. Each guide imports its own slice
 *   and concatenates it into SEARCH_INDEX, which fixes both the in-guide
 *   search and the global search in App.jsx at the same time.
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT_PATH = join(ROOT, 'src', 'prose-index.js');

// Prose-bearing components. CodeBlock is deliberately excluded — code samples
// produce noisy matches (every variable name becomes a hit).
const PROSE_TAGS = ['SectionHeading', 'SubHeading', 'Paragraph', 'CalloutBox'];

function deriveGuideId(filename) {
  const match = filename.match(/^Genesys(.+)Guide\.jsx$/);
  return match ? match[1].toLowerCase() : null;
}

// ─── Turn a chunk of JSX inner content into plain text ─────────────
function toPlainText(raw) {
  let s = raw;

  // {'>'} or {"..."} → the literal string inside
  s = s.replace(/\{\s*(['"])([\s\S]*?)\1\s*\}/g, '$2');

  // Drop any remaining JSX expression blocks ({C.color}, {ARR.map(...)}, ...).
  // Balanced-brace scan, since these frequently nest.
  let out = '';
  let depth = 0;
  for (const ch of s) {
    if (ch === '{') depth++;
    else if (ch === '}') { if (depth > 0) depth--; }
    else if (depth === 0) out += ch;
  }
  s = out;

  s = s.replace(/<[^>]*>/g, ' ');            // strip tags
  s = s.replace(/&nbsp;/g, ' ')
       .replace(/&amp;/g, '&')
       .replace(/&lt;/g, '<')
       .replace(/&gt;/g, '>')
       .replace(/&quot;/g, '"')
       .replace(/&#39;/g, "'")
       .replace(/&mdash;/g, '—')
       .replace(/&rsquo;/g, '’');
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}

// ─── Find every prose element inside a chunk, in document order ────
function findProseElements(chunk) {
  const found = [];
  for (const tag of PROSE_TAGS) {
    // <Tag ...>inner</Tag> — non-greedy; these components are never
    // nested inside themselves, so this is unambiguous.
    const re = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'g');
    let m;
    while ((m = re.exec(chunk)) !== null) {
      found.push({ tag, index: m.index, inner: m[1] });
    }
  }
  return found.sort((a, b) => a.index - b.index);
}

// ─── Split a guide file into { sectionId, chunk } blocks ───────────
function splitSections(src) {
  const re = /id="(t\d+s\d+)"/g;
  const marks = [];
  let m;
  while ((m = re.exec(src)) !== null) {
    marks.push({ id: m[1], start: m.index });
  }
  return marks.map((mark, i) => ({
    sectionId: mark.id,
    chunk: src.slice(mark.start, i + 1 < marks.length ? marks[i + 1].start : src.length),
  }));
}

// ─── Build prose entries for one guide file ────────────────────────
function extractProse(filePath) {
  const src = readFileSync(filePath, 'utf-8');
  const entries = [];

  for (const { sectionId, chunk } of splitSections(src)) {
    const tierMatch = sectionId.match(/^t(\d+)s/);
    const tier = tierMatch ? parseInt(tierMatch[1], 10) - 1 : 0;

    // Group prose under the heading that precedes it, so each SubHeading
    // yields exactly one search result carrying all of its body text.
    const buckets = [];
    let current = null;

    for (const el of findProseElements(chunk)) {
      const text = toPlainText(el.inner);
      if (!text) continue;

      if (el.tag === 'SectionHeading' || el.tag === 'SubHeading') {
        current = { label: text, parts: [text] };
        buckets.push(current);
      } else {
        if (!current) {
          // Prose before any heading in this section.
          current = { label: null, parts: [] };
          buckets.push(current);
        }
        current.parts.push(text);
      }
    }

    for (const b of buckets) {
      const text = b.parts.join(' ').trim();
      // A bare heading with no body adds nothing the SECTIONS index
      // doesn't already cover.
      if (!text || b.parts.length < 2) continue;
      const label = b.label || text.slice(0, 60);
      entries.push({ text, label, sectionId, tier, type: 'Content' });
    }
  }

  return entries;
}

function main() {
  const files = readdirSync(ROOT)
    .filter(f => /^Genesys.+Guide\.jsx$/.test(f))
    .sort();

  const index = {};
  let total = 0;

  for (const file of files) {
    const guideId = deriveGuideId(file);
    if (!guideId) continue;
    const entries = extractProse(join(ROOT, file));
    index[guideId] = entries;
    total += entries.length;
    console.log(`  ${guideId.padEnd(14)} ${String(entries.length).padStart(4)} prose entries`);
  }

  const banner = `// AUTO-GENERATED by scripts/build-prose-index.js — do not edit by hand.
// Regenerate with:  npm run index:prose
//
// Narrative prose (Paragraph / CalloutBox / SubHeading) extracted from each
// Genesys*Guide.jsx, grouped by the heading it appears under. Each guide
// concatenates its own slice into SEARCH_INDEX so that both the in-guide
// search and the global search in App.jsx cover body content, not just
// the structured data arrays.

`;

  writeFileSync(OUT_PATH, banner + `export const PROSE_INDEX = ${JSON.stringify(index, null, 2)};\n`, 'utf-8');
  console.log(`\nProse index built: ${files.length} guides, ${total} entries → ${OUT_PATH}`);
}

main();
