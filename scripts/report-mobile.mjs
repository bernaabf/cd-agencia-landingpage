import fs from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';

// Read-only production measurements, independent of Next's changing CLI table.
const chunks = fs.readdirSync('.next/static/chunks').filter(name => name.endsWith('.js')).map(name => {
  const bytes = fs.readFileSync(path.join('.next/static/chunks', name));
  return { name, bytes: bytes.length, gzip: gzipSync(bytes).length };
}).sort((a, b) => b.bytes - a.bytes);
const routes = {};
for (const [route, file] of [['/', 'index.html'], ['/_not-found', '_not-found.html']]) {
  const html = fs.readFileSync(path.join('.next/server/app', file), 'utf8');
  const initial = [...new Set([...html.matchAll(/<script[^>]*src="([^"]+\.js)"/g)].map(match => path.basename(match[1])))];
  const scripts = chunks.filter(chunk => initial.includes(chunk.name));
  routes[route] = { initial, bytes: scripts.reduce((n, c) => n + c.bytes, 0), gzip: scripts.reduce((n, c) => n + c.gzip, 0) };
}
fs.writeFileSync('docs/mobile/after-bundles.json', JSON.stringify({ routes, chunks }, null, 2) + '\n');
const reports = {};
for (const name of ['before', 'after', 'desktop-before', 'desktop-after']) {
  const report = JSON.parse(fs.readFileSync(`docs/mobile/lighthouse-${name}.json`));
  reports[name] = {
    performance: report.categories.performance.score * 100,
    accessibility: report.categories.accessibility.score * 100,
    lcpMs: report.audits['largest-contentful-paint'].numericValue,
    cls: report.audits['cumulative-layout-shift'].numericValue,
    tbtMs: report.audits['total-blocking-time'].numericValue,
    inpMs: null,
    imageTransferBytes: report.audits['resource-summary'].details.items.find(item => item.resourceType === 'image')?.transferSize,
    throttling: report.configSettings.throttling,
    warnings: report.runWarnings,
  };
}
fs.writeFileSync('docs/mobile/comparison.json', JSON.stringify(reports, null, 2) + '\n');
console.log(JSON.stringify({ routes, reports }, null, 2));
