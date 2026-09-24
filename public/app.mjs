import {contentUrl, checkContent} from './content.mjs';

const el = (tag, text) => {const node = document.createElement(tag); if (text) node.textContent = text; return node;};
const safeAsset = value => {
  if (typeof value !== 'string') return null;
  try {const url = new URL(value); return url.protocol === 'https:' && url.hostname === 'cdn.sanity.io' ? url.href : null;} catch {return null;}
};
let displayed;
function render(content) {
  const serialized = JSON.stringify(content);
  if (displayed === serialized) return;
  displayed = serialized;
  const title = content.settings?.title || 'Portfolio';
  document.title = title;
  document.querySelector('#site-title').textContent = title;
  document.querySelector('#site-description').textContent = content.settings?.description || '作品即将上线。';
  const fragment = document.createDocumentFragment();
  for (const project of content.projects) {
    const article = el('article');
    article.id = project.slug || project._id;
    article.append(el('h2', project.title || '未命名作品'));
    if (project.description) article.append(el('p', project.description));
    const cover = safeAsset(project.cover);
    if (cover) {const img = el('img'); img.src = cover; img.alt = project.title || ''; img.loading = 'lazy'; article.append(img);}
    for (const media of project.media || []) {
      const url = safeAsset(media.kind === 'video' ? media.videoUrl : media.imageUrl);
      if (!url) continue;
      const figure = el('figure');
      if (media.kind === 'video') {
        const video = el('video');
        video.src = url;
        video.controls = true;
        video.playsInline = true;
        video.preload = 'none';
        video.loop = Boolean(media.loop);
        const poster = safeAsset(media.posterUrl);
        if (poster) video.poster = poster;
        video.setAttribute('aria-label', media.caption || project.title || '作品视频');
        if (media.autoplay && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          video.muted = true;
          video.dataset.autoplay = 'true';
        }
        figure.append(video);
      } else {
        const img = el('img'); img.src = url; img.alt = media.caption || project.title || ''; img.loading = 'lazy'; figure.append(img);
      }
      if (media.caption) figure.append(el('figcaption', media.caption));
      article.append(figure);
    }
    fragment.append(article);
  }
  document.querySelector('#projects').replaceChildren(fragment);
  observeVideos();
}

let observer;
function observeVideos() {
  observer?.disconnect();
  if (!('IntersectionObserver' in window)) return;
  observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const video = entry.target;
      if (!entry.isIntersecting) video.pause();
      else if (video.dataset.autoplay === 'true') video.play().catch(() => {});
    }
  }, {threshold: .3});
  document.querySelectorAll('video').forEach(video => observer.observe(video));
}

render(checkContent(JSON.parse(document.querySelector('#initial-content').textContent)));
try {
  const configResponse = await fetch('/site-config.json');
  if (!configResponse.ok) throw new Error('Configuration unavailable');
  const config = await configResponse.json();
  const response = await fetch(contentUrl(config), {signal: AbortSignal.timeout(12000)});
  if (!response.ok) throw new Error('Content unavailable');
  const {result} = await response.json();
  render(checkContent(result));
} catch {
  // The build-time snapshot remains visible if the CMS cannot be reached.
}
