Scan Genesys Cloud release notes for new features, compare them against the knowledge guide index, and update impacted guide sections.

## Phase 1 — Scan for New Release Notes

Run the scanner with any arguments the user provided: `npm run index:scan -- $ARGUMENTS`

If no arguments were provided, run `npm run index:scan` (scans since last scan date).

If the scanner reports "No new release notes to scan", tell the user everything is up to date and stop.

## Phase 2 — Read & Triage the Report

Read the generated report from `scripts/reports/update-plan-{today's date}.md`.

Focus on the **"Action Items by Guide"** section. For each action item, assess:

1. **Match confidence**: Score >= 20 is likely a real match. Score 10-15 may be a false positive — check if the release note text is actually relevant to the matched section.
2. **Coverage gap**: Read the matched section in the guide file (locate it by searching for `id="{sectionId}"` like `id="t2s5"`). Is this feature already adequately covered? If the guide already explains the feature, it may only need a minor note about the update rather than a full rewrite.
3. **Impact level**: Is this a minor change (new parameter, limit increase, language support) or a substantial new capability?

Present a triage summary table to the user:

```
| # | Guide | Section | Release Note | Recommendation | Reason |
|---|-------|---------|-------------|----------------|--------|
| 1 | Digital & Omnichannel | Third-Party Messaging (t2s3) | WhatsApp rich link support | UPDATE | New capability not covered |
| 2 | Telephony & Edge | Building Blocks (t1s2) | Knowledge config languages | SKIP | False positive — not telephony |
| 3 | Agent Desktop | Agent Assist (t2s5) | Copilot summaries | UPDATE | Major new AI feature |
```

Recommendations:
- **UPDATE** — Genuine gap, guide section needs new content
- **SKIP** — False positive, already covered, or not relevant to the guide's scope
- **NEEDS_DETAIL** — Looks relevant but the one-line summary isn't enough to write content; need to fetch the full release note

Also list any items from the **"Unmatched Release Note Items"** section that look like they should be covered by an existing guide but weren't matched (potential keyword mapping gaps).

**Wait for the user to confirm which items to proceed with before continuing.**

## Phase 3 — Gather Full Release Note Details

For each confirmed UPDATE or NEEDS_DETAIL item, fetch the detailed release notes page:

- URL pattern: `https://help.genesys.cloud/release-notes/genesys-cloud/{month-day-year}/`
- Example: For "March 16, 2026" → fetch `https://help.genesys.cloud/release-notes/genesys-cloud/march-16-2026/`
- Extract the specific feature description relevant to the item being updated

If the detail page cannot be fetched, note this and work with the summary text only — flag to the user that the update may be less detailed.

## Phase 4 — Update the Guide Files

For each guide that needs updates:

1. **Read the target section** — Search for `id="{sectionId}"` in the guide file (e.g., `id="t2s5"`). Read enough context to understand the section structure, existing content, and code style.

2. **Determine the edit type**:
   - **ADD**: New entry in a data array (e.g., a new object in a features array). Match the exact shape/fields of existing entries.
   - **EXPAND**: Add a new `<SubHeading>`, `<Paragraph>`, or `<CalloutBox>` to the section's JSX. Place it logically within the existing flow.
   - **REVISE**: Modify existing text to reflect changed behavior or updated limits.

3. **Make the edit**:
   - Preserve the exact code style (indentation, component usage, data array shapes)
   - For new features: add a `<CalloutBox type="info">` highlighting the new capability
   - For deprecations: add a `<CalloutBox type="warning">` with migration guidance
   - Keep the existing writing style: clear, practical, analogy-rich
   - Never remove existing content unless the feature is deprecated and replaced

4. **Verify validity**: After editing, check that the JSX around your edit is syntactically correct (matching tags, proper attribute syntax).

## Phase 5 — Finalize

1. Run `npm run index:build` to regenerate `feature-index.json` with any structural changes.
2. Summarize all changes made:
   - Which guide files were modified
   - Which sections were updated
   - What content was added/changed and why
   - Any items that were deferred or need manual review
