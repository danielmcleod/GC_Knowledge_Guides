#!/usr/bin/env node
/**
 * build-index.js — Parses all Genesys*Guide.jsx files and generates feature-index.json
 *
 * Usage:  node scripts/build-index.js
 *
 * This script:
 *   1. Scans the project root for Genesys*Guide.jsx files
 *   2. Extracts SECTIONS metadata (tier, id, title) from each
 *   3. Merges extracted sections with the keyword/category mappings
 *      already present in feature-index.json (preserving manual enrichments)
 *   4. Writes an updated feature-index.json
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const INDEX_PATH = join(__dirname, 'feature-index.json');
const MAPPINGS_PATH = join(__dirname, 'keyword-mappings.json');

// ─── Guide ID derivation ───────────────────────────────────────────
// GenesysRoutingGuide.jsx  →  routing
// GenesysPlatformAPIGuide.jsx → platformapi
function deriveGuideId(filename) {
  const match = filename.match(/^Genesys(.+)Guide\.jsx$/);
  if (!match) return null;
  return match[1].toLowerCase();
}

// ─── Extract SECTIONS array from a guide JSX file ──────────────────
function extractSections(filePath) {
  const src = readFileSync(filePath, 'utf-8');

  // Match the SECTIONS = [ ... ]; block (supports multiline)
  const sectionsMatch = src.match(/const\s+SECTIONS\s*=\s*\[([\s\S]*?)\];/);
  if (!sectionsMatch) return [];

  const body = sectionsMatch[1];
  const sections = [];

  // Match each { tier: N, id: '...', title: '...' } entry
  const entryRe = /\{\s*tier\s*:\s*(\d+)\s*,\s*id\s*:\s*'([^']+)'\s*,\s*title\s*:\s*'([^']+)'\s*\}/g;
  let m;
  while ((m = entryRe.exec(body)) !== null) {
    sections.push({ tier: parseInt(m[1], 10), id: m[2], title: m[3] });
  }
  return sections;
}

// ─── Extract TIER_NAMES from a guide file ──────────────────────────
function extractTierNames(filePath) {
  const src = readFileSync(filePath, 'utf-8');
  const match = src.match(/const\s+TIER_NAMES\s*=\s*\[([\s\S]*?)\];/);
  if (!match) return [];
  const names = [];
  const strRe = /['"]([^'"]+)['"]/g;
  let m;
  while ((m = strRe.exec(match[1])) !== null) {
    names.push(m[1]);
  }
  return names;
}

// ─── Main ──────────────────────────────────────────────────────────
function main() {
  // Load keyword mappings (authoritative source for keywords & categories)
  let mappings = { guides: {} };
  try {
    mappings = JSON.parse(readFileSync(MAPPINGS_PATH, 'utf-8'));
  } catch { /* no mappings file yet */ }

  // Discover guide files
  const files = readdirSync(ROOT)
    .filter(f => /^Genesys.+Guide\.jsx$/.test(f))
    .sort();

  const guides = [];
  let totalSections = 0;

  for (const file of files) {
    const id = deriveGuideId(file);
    if (!id) continue;

    const filePath = join(ROOT, file);
    const sections = extractSections(filePath);
    const tierNames = extractTierNames(filePath);
    const tierCount = tierNames.length || (sections.length > 0 ? Math.max(...sections.map(s => s.tier)) + 1 : 0);

    totalSections += sections.length;

    // Apply keyword mappings from keyword-mappings.json
    const mapping = mappings.guides[id] || {};
    const sectionKeywords = mapping.sections || {};

    const enrichedSections = sections.map(s => ({
      tier: s.tier,
      id: s.id,
      title: s.title,
      keywords: sectionKeywords[s.id] || [],
    }));

    guides.push({
      id,
      file,
      title: mapping.title || file.replace(/^Genesys|Guide\.jsx$/g, ''),
      releaseNoteCategories: mapping.releaseNoteCategories || [],
      keywords: mapping.keywords || [],
      tierCount,
      tierNames: tierNames.length ? tierNames : [],
      sections: enrichedSections,
    });
  }

  const index = {
    metadata: {
      version: '1.0.0',
      generatedAt: new Date().toISOString().split('T')[0],
      totalGuides: guides.length,
      totalSections,
      releaseNotesUrl: 'https://help.genesys.cloud/release-notes/genesys-cloud/',
    },
    releaseNoteCategories: [
      'Customer engagement',
      'Data, analytics, and reporting',
      'Employee productivity',
      'Genesys Cloud',
      'Open platform',
      'Self service and automation',
      'Workforce engagement',
      'Account management',
    ],
    guides,
  };

  writeFileSync(INDEX_PATH, JSON.stringify(index, null, 2) + '\n', 'utf-8');
  console.log(`Feature index built: ${guides.length} guides, ${totalSections} sections → ${INDEX_PATH}`);
}

main();
