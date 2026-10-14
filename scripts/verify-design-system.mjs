import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const snapshot = JSON.parse(readFileSync(path.join(root, "docs/design-system/palette-before.json"), "utf8"));
const read = (name) => readFileSync(path.join(root, name), "utf8");
const colors = /#[\da-fA-F]{3,8}\b|rgba?\([^)]*\)|hsla?\([^)]*\)|(?:bg|text|border|shadow|outline|ring)-(?:brown|cream|sand|white|black)[\w./-]*/g;
const literals = (content) => [...content.matchAll(colors)].map(([value]) => value).sort();
const files = (dir) => readdirSync(path.join(root, dir), { withFileTypes: true }).flatMap((entry) => {
  const name = path.posix.join(dir, entry.name);
  return entry.isDirectory() ? files(name) : /\.(tsx?|css)$/.test(name) ? [name] : [];
});

for (const [name, expected] of Object.entries(snapshot.colorLiterals)) {
  assert.deepEqual(literals(read(name)), expected, `Color declarations changed: ${name}`);
}
for (const [name, expected] of Object.entries(snapshot.protectedFiles)) {
  const actual = createHash("sha256").update(readFileSync(path.join(root, name))).digest("hex");
  assert.equal(actual, expected, `Protected file changed: ${name}`);
}

const sources = files("src");
const currentHex = [...new Set(sources.flatMap((name) => [...read(name).matchAll(/#[\da-fA-F]{3,8}\b/g)].map(([value]) => value)))].sort();
assert.deepEqual(currentHex, snapshot.hexValues, "Hex inventory changed");
const newSources = sources.filter((name) => !(name in snapshot.colorLiterals));
for (const name of newSources) {
  assert.deepEqual(literals(read(name)), [], `New color literal: ${name}`);
  assert(!/src\/(?:components|lib)\/world\//.test(name), `New protected-zone file: ${name}`);
}

const changed = execFileSync("git", ["diff", snapshot.baseCommit, "--name-only"], { cwd: root, encoding: "utf8" }).trim().split("\n").filter(Boolean);
assert.deepEqual(changed.filter((name) => name in snapshot.protectedFiles), [], "Protected file present in git diff");
for (const name of ["package.json", "package-lock.json", "next.config.ts", "tsconfig.json", "postcss.config.mjs"]) {
  const diff = execFileSync("git", ["diff", snapshot.baseCommit, "--", name], { cwd: root, encoding: "utf8" });
  assert.equal(diff, "", `Stack/config changed: ${name}`);
}
assert.deepEqual(changed.filter((name) => name.startsWith("public/") || name.startsWith("src/fonts/")), [], "Brand assets changed");

const css = read("src/components/sections/Editorial.module.css");
assert(!/:root|:global|@theme|--color-|\b(?:color|background|border-color|fill|stroke)\s*:/.test(css), "Editorial styles must remain scoped and color-free");
console.log(JSON.stringify({ paletteDifference: 0, newHexValues: [], colorLiteralsUnchanged: true, protectedFilesVerified: Object.keys(snapshot.protectedFiles).length, protectedDiff: [], stackAndAssetsUnchanged: true, changedFiles: changed }, null, 2));
