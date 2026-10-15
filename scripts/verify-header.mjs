import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
const snapshot = JSON.parse(readFileSync('docs/header/baseline.json', 'utf8'));
const read = (file) => readFileSync(file, 'utf8');
const files = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const name = `${dir}/${entry.name}`;
  return entry.isDirectory() ? files(name) : /\.(tsx?|css)$/.test(name) ? [name] : [];
});
for (const [file, hash] of Object.entries(snapshot.protectedFiles)) {
  assert.equal(createHash('sha256').update(readFileSync(file)).digest('hex'), hash, `Protected file: ${file}`);
}
assert.equal(read('src/app/globals.css').match(/@theme\s*\{[\s\S]*?\n\}/)[0], snapshot.colorTheme);
const hex = [...new Set(files('src').flatMap((file) => [...read(file).matchAll(/#[\da-fA-F]{3,8}\b/g)].map(([value]) => value)))].sort();
assert.deepEqual(hex, snapshot.hexValues, 'New hexadecimal color');
for (const file of ['src/components/Header.tsx', 'src/components/MenuOverlay.tsx', 'src/components/Header.module.css']) {
  const source = read(file);
  assert(!/#[\da-fA-F]{3,8}\b|rgba?\(|hsla?\(/.test(source), `New color literal: ${file}`);
  for (const [token] of source.matchAll(/--color-[\w-]+/g)) assert(token in snapshot.tokens, `Unknown token: ${token}`);
  assert(!/requestAnimationFrame|ticker\.(?:add|remove)|new Lenis|addEventListener\(["'](?:scroll|resize)/.test(source), `Competing scroll loop: ${file}`);
}
const diff = (args) => execFileSync('git', ['diff', snapshot.baseCommit, ...args], { encoding: 'utf8' });
const changed = diff(['--name-only']).trim().split('\n').filter(Boolean);
assert.deepEqual(changed.filter((file) => file in snapshot.protectedFiles), []);
for (const file of ['package.json', 'package-lock.json', 'next.config.ts', 'tsconfig.json', 'postcss.config.mjs']) assert.equal(diff(['--',file]), '');
assert.deepEqual(changed.filter((file) => /^(public\/|src\/fonts\/)/.test(file)), []);
console.log(JSON.stringify({ paletteDifference: 0, newHexValues: [], protectedFilesVerified: Object.keys(snapshot.protectedFiles).length, protectedDiff: [], stackAndAssetsUnchanged: true }, null, 2));
