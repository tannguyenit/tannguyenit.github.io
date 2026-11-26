import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const SRC = 'public/labs';
const OUT = 'src/labs';
const ROOT = '.lab-root';

function prefixSelector(sel) {
  if (sel === ':root' || sel === 'body' || sel === 'html') return ROOT;
  if (sel === '*') return `${ROOT} *`;
  const m = sel.match(/^:root((?:\[[^\]]*\]|:not\([^)]*\))*)(.*)$/);
  if (m) return `:root${m[1]} ${ROOT}${m[2]}`;
  return `${ROOT} ${sel}`;
}

function scopeCss(css) {
  let out = '';
  let i = 0;
  while (i < css.length) {
    const open = css.indexOf('{', i);
    if (open < 0) break;
    const head = css.slice(i, open).trim();
    let depth = 1;
    let j = open + 1;
    while (depth) {
      if (css[j] === '{') depth++;
      else if (css[j] === '}') depth--;
      j++;
    }
    const body = css.slice(open + 1, j - 1);
    if (/^@(media|supports)/.test(head)) out += `${head}{${scopeCss(body)}}\n`;
    else if (head.startsWith('@')) out += `${head}{${body}}\n`;
    else out += head.split(',').map((s) => prefixSelector(s.trim())).join(', ') + `{${body}}\n`;
    i = j;
  }
  return out;
}

function toFragment(html) {
  const css = [...html.matchAll(/<style>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join('\n').replace(/\/\*[\s\S]*?\*\//g, '');
  const fonts = html.match(/<link rel="stylesheet"[^>]*>/)?.[0] ?? '';
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  const script = scripts[scripts.length - 1][1];
  return `${fonts}<style>${scopeCss(css)}</style>` +
    `<div class="${ROOT.slice(1)}"><nav id="tabs" hidden></nav><main id="lessons"></main></div>` +
    `<script>(function () {\n${script}\n})();</script>`;
}

for (const group of readdirSync(SRC, { withFileTypes: true }).filter((d) => d.isDirectory())) {
  const dir = join(SRC, group.name);
  mkdirSync(join(OUT, group.name), { recursive: true });
  for (const file of readdirSync(dir).filter((f) => /^\d\d-.*\.html$/.test(f))) {
    writeFileSync(join(OUT, group.name, file), toFragment(readFileSync(join(dir, file), 'utf8')));
  }
}
console.log('labs imported');
