import {readFile, mkdir, cp, writeFile, rm} from 'node:fs/promises';
import {contentUrl, checkContent} from '../lib/content.mjs';

const config = JSON.parse(await readFile(new URL('../site.config.json', import.meta.url), 'utf8'));
const response = await fetch(contentUrl(config, false), {signal: AbortSignal.timeout(30000)});
if (!response.ok) throw new Error(`CMS fetch failed: HTTP ${response.status}`);
const {result} = await response.json();
const content = checkContent(result);
const root = new URL('../', import.meta.url);
const out = new URL('dist/', root);
await rm(out, {recursive: true, force: true});
await mkdir(out, {recursive: true});
await cp(new URL('public/', root), out, {recursive: true});
await cp(new URL('lib/content.mjs', root), new URL('content.mjs', out));
await writeFile(new URL('site-config.json', out), JSON.stringify(config));
await writeFile(new URL('content.json', out), JSON.stringify(content));
await writeFile(new URL('.nojekyll', out), '');
const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const template = await readFile(new URL('index.html', out), 'utf8');
const html = template
  .replaceAll('<!--TITLE-->', escapeHtml(content.settings?.title || 'Portfolio'))
  .replace('<!--DESCRIPTION-->', escapeHtml(content.settings?.description || '作品即将上线。'))
  .replace('<!--CONTENT-->', JSON.stringify(content).replaceAll('<', '\\u003c').replaceAll('\u2028', '\\u2028').replaceAll('\u2029', '\\u2029'));
await writeFile(new URL('index.html', out), html);
console.log(`Built ${content.projects.length} published projects for ${config.siteUrl}`);
