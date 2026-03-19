#!/usr/bin/env node
/**
 * scan-updates.js — Scans Genesys Cloud release notes for changes that
 * may impact the knowledge guides, and generates an update plan.
 *
 * Usage:
 *   node scripts/scan-updates.js                    # Scan notes since last scan
 *   node scripts/scan-updates.js --since 2026-03-01 # Scan notes since a specific date
 *   node scripts/scan-updates.js --weeks 4          # Scan last N weeks of notes
 *   node scripts/scan-updates.js --all              # Scan all visible release notes
 *
 * Output:
 *   - Console summary of impacted guides/sections
 *   - scripts/reports/update-plan-{date}.md  — detailed update plan
 *   - Updates scripts/scan-state.json with last scan timestamp
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const INDEX_PATH = join(__dirname, 'feature-index.json');
const STATE_PATH = join(__dirname, 'scan-state.json');
const REPORTS_DIR = join(__dirname, 'reports');

const RELEASE_NOTES_URL = 'https://help.genesys.cloud/release-notes/genesys-cloud/';

// ─── Helpers ───────────────────────────────────────────────────────

function parseDate(str) {
  if (!str) return null;
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

function formatDate(d) {
  return d.toISOString().split('T')[0];
}

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { since: null, weeks: null, all: false };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--since' && args[i + 1]) {
      opts.since = args[++i];
    } else if (args[i] === '--weeks' && args[i + 1]) {
      opts.weeks = parseInt(args[++i], 10);
    } else if (args[i] === '--all') {
      opts.all = true;
    }
  }
  return opts;
}

// ─── Fetch & parse release notes ───────────────────────────────────

async function fetchReleaseNotes(url) {
  console.log(`Fetching release notes from ${url} ...`);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  return await res.text();
}

/**
 * Parse the release notes HTML page into structured entries.
 * Each entry: { date: Date, dateStr: string, categories: { name: string, items: string[] }[], detailUrl: string }
 */
function parseReleaseNotesHtml(html) {
  const entries = [];

  // The page groups release notes by date. Each date section typically contains
  // a heading with the date and categorized bullet points.
  // We'll extract using regex patterns that match the page structure.

  // Strategy: split by date headings, then extract categories and items within each.
  // Date pattern: "March 16, 2026" or similar
  const datePattern = /(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4}/g;

  // First, convert HTML to simplified text for easier parsing
  let text = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/?(p|div|h[1-6]|li|ul|ol|tr|td|th|section|article|header|footer)[^>]*>/gi, '\n')
    .replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#\d+;/g, '')
    .replace(/\n{3,}/g, '\n\n');

  // Find all dates in the text
  const dates = [];
  let match;
  while ((match = datePattern.exec(text)) !== null) {
    dates.push({ dateStr: match[0], index: match.index });
  }

  // Filter out page navigation, footer, and boilerplate noise
  const noisePatterns = [
    /^copyright/i,
    /^terms of use/i,
    /^privacy policy/i,
    /^\[.*\]\(https?:\/\/(www\.)?(twitter|facebook|linkedin|youtube|instagram|genesys\.com\/(blog|company))/i,
    /^\[.*\]\(\/release-notes\/genesys-cloud\/(archive|category)\//i,
    /^\[?\]?\(http/,    // bare link-only lines
    /^(see all in|monthly archive|categories|submit feedback|feedback|html block)/i,
    /^I have read and understand/i,
    /^if you still have questions/i,
    /^\[ask the community/i,
    /^\[NEXT\]/i,
    /^(was this article helpful|get user feedback)/i,
    /^email subscription/i,
    /^cookies settings/i,
  ];

  function isNoiseLine(line) {
    return noisePatterns.some(p => p.test(line));
  }

  // Known release note categories
  const knownCategories = [
    'Customer engagement',
    'Data, analytics, and reporting',
    'Employee productivity',
    'Genesys Cloud',
    'Open platform',
    'Self service and automation',
    'Workforce engagement',
    'Account management',
    'Deprecations',
    'Platform',
  ];

  for (let i = 0; i < dates.length; i++) {
    const start = dates[i].index;
    const end = i + 1 < dates.length ? dates[i + 1].index : text.length;
    const block = text.substring(start, end);

    const dateObj = new Date(dates[i].dateStr);
    if (isNaN(dateObj.getTime())) continue;

    const categories = [];
    let currentCategory = null;

    const lines = block.split('\n').map(l => l.trim()).filter(Boolean);

    for (const line of lines) {
      // Skip the date line itself
      if (line === dates[i].dateStr) continue;

      // Check if this line is a category heading
      const isCategoryHeading = knownCategories.some(
        cat => line.toLowerCase().includes(cat.toLowerCase())
      );

      if (isCategoryHeading && line.length < 80) {
        // Determine which category
        const matchedCat = knownCategories.find(
          cat => line.toLowerCase().includes(cat.toLowerCase())
        );
        currentCategory = { name: matchedCat || line, items: [] };
        categories.push(currentCategory);
      } else if (currentCategory && line.length > 5 && !line.startsWith('View detail') && !isNoiseLine(line)) {
        currentCategory.items.push(line);
      }
    }

    // Extract detail URL if present
    const detailMatch = block.match(/\[.*?View detail.*?\]\(([^)]+)\)/i);
    const detailUrl = detailMatch ? detailMatch[1] : null;

    if (categories.length > 0) {
      entries.push({
        date: dateObj,
        dateStr: dates[i].dateStr,
        categories,
        detailUrl,
      });
    }
  }

  return entries;
}

// ─── Keyword matching engine ───────────────────────────────────────

/**
 * Score how well a release note item matches a set of keywords.
 * Returns a score 0-100 based on keyword density and exact phrase matches.
 */
function matchScore(text, keywords) {
  if (!keywords || keywords.length === 0) return 0;
  const lower = text.toLowerCase();
  let score = 0;
  let matches = 0;

  for (const kw of keywords) {
    const kwLower = kw.toLowerCase();
    if (lower.includes(kwLower)) {
      matches++;
      // Bonus for longer keyword phrases (more specific matches)
      score += kwLower.split(/\s+/).length;
    }
  }

  if (matches === 0) return 0;
  // Normalize: base score from match ratio, boosted by phrase specificity
  return Math.min(100, Math.round((matches / keywords.length) * 50 + score * 5));
}

/**
 * Find all guide sections that may be impacted by a release note item.
 * Returns array of { guideId, guideTitle, file, sectionId, sectionTitle, tier, score }
 */
function findImpactedSections(itemText, categoryName, index) {
  const impacts = [];

  for (const guide of index.guides) {
    // First filter: does this release note category map to this guide?
    const categoryMatch = guide.releaseNoteCategories.some(
      cat => cat.toLowerCase() === categoryName.toLowerCase()
    );

    // Second filter: does the item text match any guide-level keywords?
    const guideScore = matchScore(itemText, guide.keywords);

    // Skip if no category match AND no keyword match
    if (!categoryMatch && guideScore === 0) continue;

    // Now check each section for more specific matches
    for (const section of guide.sections) {
      if (section.keywords.length === 0) continue; // Skip glossary/generic sections

      const sectionScore = matchScore(itemText, section.keywords);
      // Combined score: section-level match is most important, guide-level adds context
      const combinedScore = sectionScore * 0.7 + guideScore * 0.3;

      if (combinedScore >= 10) {
        impacts.push({
          guideId: guide.id,
          guideTitle: guide.title,
          file: guide.file,
          sectionId: section.id,
          sectionTitle: section.title,
          tier: section.tier,
          score: Math.round(combinedScore),
        });
      }
    }

    // If no section-level match but strong guide-level match, flag the guide broadly
    if (!impacts.some(i => i.guideId === guide.id) && (categoryMatch && guideScore >= 15)) {
      impacts.push({
        guideId: guide.id,
        guideTitle: guide.title,
        file: guide.file,
        sectionId: null,
        sectionTitle: '(general — review needed)',
        tier: null,
        score: guideScore,
      });
    }
  }

  // Sort by score descending and limit to top 5 most relevant matches
  impacts.sort((a, b) => b.score - a.score);
  return impacts.slice(0, 5);
}

// ─── Report generation ─────────────────────────────────────────────

function generateReport(entries, allImpacts, sinceDate) {
  const now = new Date();
  const lines = [];

  lines.push('# Genesys Cloud Knowledge Guide — Update Scan Report');
  lines.push('');
  lines.push(`**Scan Date:** ${formatDate(now)}`);
  lines.push(`**Reviewing Since:** ${sinceDate ? formatDate(sinceDate) : 'all available'}`);
  lines.push(`**Release Note Periods Reviewed:** ${entries.length}`);
  lines.push('');

  // Aggregate stats
  let totalItems = 0;
  for (const e of entries) {
    for (const c of e.categories) {
      totalItems += c.items.length;
    }
  }

  const impactedGuides = new Set();
  const impactedSections = new Set();
  for (const { impacts } of allImpacts) {
    for (const imp of impacts) {
      impactedGuides.add(imp.guideId);
      if (imp.sectionId) impactedSections.add(`${imp.guideId}:${imp.sectionId}`);
    }
  }

  lines.push('## Summary');
  lines.push('');
  lines.push(`- **${entries.length}** release note periods reviewed`);
  lines.push(`- **${totalItems}** total feature items scanned`);
  lines.push(`- **${impactedGuides.size}** guides potentially impacted`);
  lines.push(`- **${impactedSections.size}** specific sections flagged for review`);
  lines.push('');

  // Group impacts by release date
  lines.push('---');
  lines.push('');
  lines.push('## Detailed Findings');
  lines.push('');

  for (const { entry, item, categoryName, impacts } of allImpacts) {
    if (impacts.length === 0) continue;

    lines.push(`### ${entry.dateStr} — ${categoryName}`);
    lines.push('');
    lines.push(`> ${item}`);
    lines.push('');
    lines.push('| Guide | Section | Tier | Match Score |');
    lines.push('|-------|---------|------|------------|');

    for (const imp of impacts) {
      const tierLabel = imp.tier !== null ? `T${imp.tier + 1}` : '—';
      lines.push(`| ${imp.guideTitle} | ${imp.sectionTitle} | ${tierLabel} | ${imp.score} |`);
    }
    lines.push('');
  }

  // Action items grouped by guide
  lines.push('---');
  lines.push('');
  lines.push('## Action Items by Guide');
  lines.push('');

  const guideActions = new Map();
  for (const { entry, item, categoryName, impacts } of allImpacts) {
    for (const imp of impacts) {
      if (!guideActions.has(imp.guideId)) {
        guideActions.set(imp.guideId, { title: imp.guideTitle, file: imp.file, actions: [] });
      }
      guideActions.get(imp.guideId).actions.push({
        sectionId: imp.sectionId,
        sectionTitle: imp.sectionTitle,
        tier: imp.tier,
        releaseDate: entry.dateStr,
        category: categoryName,
        item,
        score: imp.score,
      });
    }
  }

  for (const [guideId, { title, file, actions }] of guideActions) {
    lines.push(`### ${title}`);
    lines.push(`**File:** \`${file}\``);
    lines.push('');

    // Deduplicate by section
    const bySectionMap = new Map();
    for (const a of actions) {
      const key = a.sectionId || 'general';
      if (!bySectionMap.has(key)) bySectionMap.set(key, []);
      bySectionMap.get(key).push(a);
    }

    let actionNum = 1;
    for (const [sectionKey, sectionActions] of bySectionMap) {
      const first = sectionActions[0];
      lines.push(`${actionNum}. **${first.sectionTitle}** ${first.tier !== null ? `(Tier ${first.tier + 1}, ${first.sectionId})` : ''}`);
      for (const a of sectionActions) {
        lines.push(`   - [${a.releaseDate}] ${a.item.substring(0, 120)}${a.item.length > 120 ? '...' : ''}`);
      }
      actionNum++;
    }
    lines.push('');
  }

  if (guideActions.size === 0) {
    lines.push('No action items identified — all guides appear up to date for the scanned period.');
    lines.push('');
  }

  // Unmatched items (release note items that didn't match any guide)
  const unmatchedItems = allImpacts.filter(a => a.impacts.length === 0);
  if (unmatchedItems.length > 0) {
    lines.push('---');
    lines.push('');
    lines.push('## Unmatched Release Note Items');
    lines.push('');
    lines.push('These items did not match any guide section. They may relate to features not yet covered, or may not be relevant to the knowledge guides.');
    lines.push('');

    for (const { entry, item, categoryName } of unmatchedItems) {
      lines.push(`- [${entry.dateStr}] **${categoryName}:** ${item.substring(0, 150)}${item.length > 150 ? '...' : ''}`);
    }
    lines.push('');
  }

  lines.push('---');
  lines.push(`*Generated by scan-updates.js on ${formatDate(now)}*`);
  lines.push('');

  return lines.join('\n');
}

// ─── Main ──────────────────────────────────────────────────────────

async function main() {
  const opts = parseArgs();

  // Load feature index
  if (!existsSync(INDEX_PATH)) {
    console.error('Feature index not found. Run "node scripts/build-index.js" first.');
    process.exit(1);
  }
  const index = JSON.parse(readFileSync(INDEX_PATH, 'utf-8'));
  console.log(`Loaded feature index: ${index.metadata.totalGuides} guides, ${index.metadata.totalSections} sections`);

  // Load scan state
  let state = { lastScanDate: null, scanHistory: [] };
  try {
    state = JSON.parse(readFileSync(STATE_PATH, 'utf-8'));
  } catch { /* first run */ }

  // Determine "since" date
  let sinceDate = null;
  if (opts.all) {
    sinceDate = null;
  } else if (opts.since) {
    sinceDate = parseDate(opts.since);
    if (!sinceDate) {
      console.error(`Invalid date: ${opts.since}`);
      process.exit(1);
    }
  } else if (opts.weeks) {
    sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - opts.weeks * 7);
  } else if (state.lastScanDate) {
    sinceDate = parseDate(state.lastScanDate);
  }

  if (sinceDate) {
    console.log(`Scanning release notes since ${formatDate(sinceDate)}`);
  } else {
    console.log('Scanning all available release notes');
  }

  // Fetch release notes
  let html;
  try {
    html = await fetchReleaseNotes(RELEASE_NOTES_URL);
  } catch (err) {
    console.error(`Failed to fetch release notes: ${err.message}`);
    console.error('');
    console.error('If you cannot access the URL directly, you can:');
    console.error('  1. Open the release notes page in a browser');
    console.error('  2. Save the page HTML to scripts/release-notes-cache.html');
    console.error('  3. The scanner will use the cached file as fallback');

    // Try cached fallback
    const cachePath = join(__dirname, 'release-notes-cache.html');
    if (existsSync(cachePath)) {
      console.log('Using cached release notes...');
      html = readFileSync(cachePath, 'utf-8');
    } else {
      process.exit(1);
    }
  }

  // Parse release notes
  const entries = parseReleaseNotesHtml(html);
  console.log(`Parsed ${entries.length} release note periods`);

  // Filter by date
  const filteredEntries = sinceDate
    ? entries.filter(e => e.date >= sinceDate)
    : entries;

  console.log(`${filteredEntries.length} periods after date filter`);

  if (filteredEntries.length === 0) {
    console.log('No new release notes to scan.');
    return;
  }

  // Match release note items against the feature index
  const allImpacts = [];

  for (const entry of filteredEntries) {
    for (const category of entry.categories) {
      for (const item of category.items) {
        const impacts = findImpactedSections(item, category.name, index);
        allImpacts.push({
          entry,
          item,
          categoryName: category.name,
          impacts,
        });
      }
    }
  }

  const matchedCount = allImpacts.filter(a => a.impacts.length > 0).length;
  console.log(`\nResults: ${allImpacts.length} items scanned, ${matchedCount} matched to guide sections`);

  // Generate report
  const report = generateReport(filteredEntries, allImpacts, sinceDate);

  // Write report
  if (!existsSync(REPORTS_DIR)) mkdirSync(REPORTS_DIR, { recursive: true });
  const reportFile = join(REPORTS_DIR, `update-plan-${formatDate(new Date())}.md`);
  writeFileSync(reportFile, report, 'utf-8');
  console.log(`\nUpdate plan written to: ${reportFile}`);

  // Update scan state
  const now = new Date();
  state.lastScanDate = formatDate(now);
  state.scanHistory.push({
    date: formatDate(now),
    releaseNotesCovered: filteredEntries.map(e => e.dateStr),
    itemsScanned: allImpacts.length,
    itemsMatched: matchedCount,
    reportFile: `reports/update-plan-${formatDate(now)}.md`,
  });

  // Keep only last 50 scan history entries
  if (state.scanHistory.length > 50) {
    state.scanHistory = state.scanHistory.slice(-50);
  }

  writeFileSync(STATE_PATH, JSON.stringify(state, null, 2) + '\n', 'utf-8');
  console.log('Scan state updated.');

  // Console summary
  console.log('\n════════════════════════════════════════════');
  console.log('  SCAN COMPLETE — SUMMARY');
  console.log('════════════════════════════════════════════');

  const impactedGuides = new Set();
  for (const { impacts } of allImpacts) {
    for (const imp of impacts) impactedGuides.add(imp.guideTitle);
  }

  if (impactedGuides.size > 0) {
    console.log(`\n  Guides with potential updates needed:`);
    for (const g of impactedGuides) {
      console.log(`    • ${g}`);
    }
  } else {
    console.log('\n  No guide updates needed for this period.');
  }

  console.log(`\n  Full report: ${reportFile}`);
  console.log('════════════════════════════════════════════\n');
}

main().catch(err => {
  console.error('Scan failed:', err);
  process.exit(1);
});
