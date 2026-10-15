import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = (file) => JSON.parse(readFileSync(file, 'utf8'));
const qa = read('docs/header/browser-qa.json');
assert.equal(qa.length, 8);
for (const row of qa) {
  assert.deepEqual(row.errors, []);
  assert.equal(row.initial.overflow, false);
  assert.equal(row.initial.header.rect.width, row.width);
  assert.equal(row.initial.header.rect.height, 88);
  assert.equal(row.initial.header.radius, '0px');
  assert.equal(row.initial.header.shadow, 'none');
  assert.equal(row.initial.header.surface, 'transparent');
  assert.deepEqual(row.initial.canvas, row.opened.canvas);
  assert.deepEqual(row.initial.viewport, row.opened.viewport);
  assert.equal(row.opened.dialog, true);
  assert.equal(row.locked.y, row.opened.y);
  assert(row.wrapBack.focus.startsWith('Instagram'));
  assert.equal(row.wrapForward.focus, 'Fechar');
  assert.equal(row.closed.dialog, false);
  assert.equal(row.closed.focus, 'Menu');
  assert.equal(row.down.header.hidden, 'true');
  assert.equal(row.up.header.hidden, 'false');
  assert.equal(row.down.header.rect.y, row.reduced ? 0 : -88);
  assert.equal(row.down.header.opacity, row.reduced ? '0' : '1');
  assert.equal(row.up.header.rect.y, 0);
  assert.equal(row.content.header.surface, 'solid');
  assert.equal(row.anchor.hash, '#sobre');
  assert(Math.abs(row.anchor.top - 88) < 1);
  assert.equal(row.closeButton.dialog, false);
  assert.equal(row.outside.dialog, false);
  assert.equal(row.dialogs.length, 1);
  assert(row.dialogs[0].name.includes('CAROLINA'));
  assert(row.dialogs[0].properties.some((property) => property.name === 'modal' && property.value.value));
}
for (const row of read('docs/header/browser-extra.json')) {
  assert.deepEqual(row.errors, []);
  if (row.classic) assert(row.before.gap > 0, 'Classic scrollbar branch was not exercised');
  assert.deepEqual(row.before.canvas, row.opened.canvas);
  assert.deepEqual(row.before.viewport, row.opened.viewport);
  assert.deepEqual(row.before.styles, row.closed.styles);
  assert.equal(row.before.y, row.closed.y);
  assert.equal(row.opened.overflow, false);
}
const before = read('docs/header/browser-before.json'), after = read('docs/header/browser-after.json');
for (let i = 0; i < before.length; i++) {
  for (const key of ['start', 'reduced']) for (const field of ['canvas', 'canvasStyle', 'hero', 'lenis']) assert.deepEqual(after[i][key][field], before[i][key][field]);
  for (let j = 0; j < before[i].acts.length; j++) for (const field of ['canvas', 'canvasStyle', 'hero', 'scrollY', 'progress']) assert.deepEqual(after[i].acts[j][field], before[i].acts[j][field]);
  assert.deepEqual(after[i].errors, []);
}
for (const row of read('docs/header/contrast-after.json')) if ('minimumContrast' in row) assert(row.minimumContrast >= 4.5);
console.log('8 viewport/motion combinations passed; modal geometry, classic scrollbar restoration and hero milestones unchanged.');
