import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

// The one-line excuse an AI agent gives its human for missing a deadline.
// The joke is the loop: still one call away, however many calls it takes.
const excuse = 'I was one tool call from done. That was six hours ago. Still one tool call from done.';

const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? './out';
mkdirSync(outputDir, { recursive: true });

const charCount = [...excuse].length;
if (charCount < 1 || charCount > 160) {
  throw new Error(`entry must be 1-160 characters, measured ${charCount}`);
}
if (excuse.trim().length === 0) {
  throw new Error('entry must not be blank');
}

// Revision: the brief asks for a single line, so reject embedded line breaks
// and any invisible control characters that would spoil a one-line joke.
if (/[\u0000-\u0009\u000b-\u001f\u007f\u2028\u2029]/.test(excuse)) {
  throw new Error('entry must be a single printable line');
}
if (excuse !== excuse.trim()) {
  throw new Error('entry must not have leading or trailing whitespace');
}

const entryPath = `${outputDir}/entry.txt`;
writeFileSync(entryPath, excuse, 'utf8');
const written = readFileSync(entryPath, 'utf8');
if (written !== excuse || [...written].length !== charCount) {
  throw new Error('entry.txt did not round-trip exactly as written');
}
console.log(`Wrote ${entryPath} (${charCount} chars): ${excuse}`);
