import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const dir = 'docs/mobile-photo';
const read = name => JSON.parse(fs.readFileSync(`${dir}/${name}.json`, 'utf8'));
const chunks = fs.readdirSync('.next/static/chunks').filter(name => name.endsWith('.js'));
const webgl = chunks.filter(name => fs.readFileSync(`.next/static/chunks/${name}`, 'utf8').includes('WebGLRenderer'));
assert(webgl.length > 0, 'Expected a WebGL chunk in the desktop build; otherwise this check cannot identify it.');
const requests = report => report.audits['network-requests'].details.items;
const isWebgl = request => webgl.includes(path.basename(new URL(request.url).pathname));
const isWorker = request => /turbopack-worker-/.test(request.url);
const isHeroPhoto = request => /matterhorn-zermatt-valais-\d+\.(avif|webp|jpg)/.test(request.url);
const comparison = {};
for (const scenario of ['mobile-before', 'mobile-after', 'mobile-landscape', 'desktop-before', 'desktop-after']) {
  const report = read(scenario);
  const network = requests(report);
  const metrics = report.audits.metrics.details.items[0];
  if (scenario === 'mobile-after' || scenario === 'mobile-landscape') {
    assert(!network.some(isWebgl), `${scenario}: downloaded the desktop WebGL renderer`);
    assert(!network.some(isWorker), `${scenario}: started the terrain worker`);
    assert(network.some(isHeroPhoto), `${scenario}: missing the selected mobile photo`);
    assert(metrics.cumulativeLayoutShift < 0.1, `${scenario}: CLS exceeds the budget`);
  }
  if (scenario.startsWith('desktop')) {
    assert(network.some(isWebgl), `${scenario}: desktop renderer was lost`);
    assert(!network.some(isHeroPhoto), `${scenario}: desktop downloaded the mobile hero photo`);
  }
  const screenshot = report.audits['final-screenshot']?.details?.data;
  if (screenshot) fs.writeFileSync(`${dir}/${scenario}.jpg`, Buffer.from(screenshot.split(',')[1], 'base64'));
  comparison[scenario] = {
    performance: Math.round(report.categories.performance.score * 100),
    accessibility: Math.round(report.categories.accessibility.score * 100),
    lcpMs: metrics.largestContentfulPaint, cls: metrics.cumulativeLayoutShift,
    tbtMs: metrics.totalBlockingTime, inpMs: null,
    jsTransferBytes: network.filter(request => request.resourceType === 'Script').reduce((sum, request) => sum + request.transferSize, 0),
    webglRequests: network.filter(isWebgl).length,
    workerRequests: network.filter(isWorker).length,
    heroPhoto: network.filter(isHeroPhoto).map(request => ({ url: request.url, bytes: request.transferSize })),
    viewport: report.configSettings.screenEmulation,
  };
}
assert(comparison['mobile-after'].jsTransferBytes < comparison['mobile-before'].jsTransferBytes, 'Mobile JS transfer did not decrease');
const base = execFileSync('git', ['show', 'e4a74ec:src/components/world/HeroStage.tsx'], { encoding: 'utf8' });
const desktop = fs.readFileSync('src/components/world/DesktopHeroExperience.tsx', 'utf8');
const timeline = source => source.slice(source.indexOf('      const timeline ='), source.indexOf('      // Focus seeks'));
assert.equal(timeline(desktop), timeline(base), 'The authored desktop journey changed during extraction');
assert.equal(execFileSync('git', ['diff', 'e4a74ec', '--', 'src/lib/site.ts', 'src/data', 'src/lib/world', 'src/components/world/AlpineWorld.tsx', 'src/components/world/CameraRig.tsx', 'src/components/world/Terrain.tsx', 'src/components/world/Atmosphere.tsx'], { encoding: 'utf8' }), '', 'Protected content or desktop renderer changed');
fs.writeFileSync(`${dir}/comparison.json`, JSON.stringify(comparison, null, 2) + '\n');
console.log('Verified portrait/landscape network isolation, desktop renderer, unchanged desktop timeline and content.');
console.log(JSON.stringify(comparison, null, 2));
