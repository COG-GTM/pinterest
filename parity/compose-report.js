// Builds parity/report/: side-by-side images (baseline left, upgraded right), pixel-diff %
// per page, and README.md with the test results table from report/results.json.
const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch');

const REPORT = path.join(__dirname, 'report');
const SHOTS = path.join(REPORT, 'shots');
const SIDE = path.join(REPORT, 'side-by-side');
fs.mkdirSync(SIDE, { recursive: true });

const read = f => PNG.sync.read(fs.readFileSync(f));
function pad(img, w, h) {
  const out = new PNG({ width: w, height: h });
  out.data.fill(255);
  PNG.bitblt(img, out, 0, 0, img.width, img.height, 0, 0);
  return out;
}

const rows = [];
const names = fs.existsSync(path.join(SHOTS, 'baseline')) ? fs.readdirSync(path.join(SHOTS, 'baseline')).filter(f => f.endsWith('.png')).sort() : [];
for (const name of names) {
  const b = path.join(SHOTS, 'baseline', name);
  const u = path.join(SHOTS, 'upgraded', name);
  if (!fs.existsSync(u)) { rows.push({ name, diff: 'missing upgraded screenshot' }); continue; }
  const bi = read(b), ui = read(u);
  const w = Math.max(bi.width, ui.width), h = Math.max(bi.height, ui.height);
  const bp = pad(bi, w, h), up = pad(ui, w, h);
  const diff = new PNG({ width: w, height: h });
  const changed = pixelmatch(bp.data, up.data, diff.data, w, h, { threshold: 0.1 });
  const gap = 16;
  const combo = new PNG({ width: w * 2 + gap, height: h });
  combo.data.fill(0);
  PNG.bitblt(bp, combo, 0, 0, w, h, 0, 0);
  PNG.bitblt(up, combo, 0, 0, w, h, w + gap, 0);
  fs.writeFileSync(path.join(SIDE, name), PNG.sync.write(combo));
  rows.push({ name, diff: (100 * changed / (w * h)).toFixed(2) + '%', size: `${bi.width}x${bi.height} / ${ui.width}x${ui.height}` });
}

const results = { baseline: {}, upgraded: {} };
const resultsFile = path.join(REPORT, 'results.json');
if (fs.existsSync(resultsFile)) {
  const json = JSON.parse(fs.readFileSync(resultsFile, 'utf8'));
  const walk = (suite, file) => {
    for (const spec of suite.specs || []) for (const t of spec.tests) {
      const status = t.results.length ? t.results[t.results.length - 1].status : 'skipped';
      results[t.projectName] = results[t.projectName] || {};
      results[t.projectName][`${file || suite.file} › ${spec.title}`] = status;
    }
    for (const s of suite.suites || []) walk(s, file || suite.file);
  };
  json.suites.forEach(s => walk(s, s.file));
}
const tests = [...new Set([...Object.keys(results.baseline), ...Object.keys(results.upgraded)])];
const count = (p, st) => Object.values(results[p] || {}).filter(s => s === st).length;
const icon = s => (s === 'passed' ? 'pass' : s ? s : 'not run');

let md = '# Angular 21 upgrade parity report\n\n';
md += 'Same Playwright specs run against the original Angular 4 app (`baseline`, :4000) and the upgraded app (`upgraded`, :4200), each backed by its own fresh mock API.\n\n';
md += `| Project | Passed | Failed | Not run |\n|---|---|---|---|\n`;
for (const p of ['baseline', 'upgraded']) {
  const ran = Object.keys(results[p] || {}).length;
  md += `| ${p} | ${count(p, 'passed')} | ${ran - count(p, 'passed')} | ${tests.length - ran} |\n`;
}
md += '\n## Tests\n\n| Test | Baseline | Upgraded |\n|---|---|---|\n';
for (const t of tests) md += `| ${t} | ${icon(results.baseline[t])} | ${icon(results.upgraded[t])} |\n`;
md += '\n## Screenshots (baseline left, upgraded right)\n\n| Page | Pixel diff | Size (baseline / upgraded) |\n|---|---|---|\n';
for (const r of rows) md += `| [${r.name}](side-by-side/${r.name}) | ${r.diff} | ${r.size || ''} |\n`;
md += '\n';
for (const r of rows) if (r.size) md += `### ${r.name}\n\n![${r.name}](side-by-side/${r.name})\n\n`;
fs.writeFileSync(path.join(REPORT, 'README.md'), md);
console.log(md.split('## Screenshots')[0]);
console.log(rows.map(r => `${r.name}: ${r.diff}`).join('\n'));
