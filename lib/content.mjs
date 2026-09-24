export const query = `{
  "settings": *[_type == "siteSettings" && _id == "siteSettings"][0]{title, description},
  "projects": *[_type == "portfolioProject" && visible == true && !(_id in path("drafts.**"))]
    | order(sortOrder asc, _createdAt desc){
      _id, title, description, "slug": slug.current,
      "cover": cover.asset->url,
      media[]{_key, kind, caption, autoplay, loop,
        "imageUrl": image.asset->url,
        "videoUrl": video.asset->url,
        "posterUrl": poster.asset->url}
    }
}`;

export function contentUrl(config, useCdn = true) {
  if (!/^[a-z0-9-]+$/.test(config.projectId)) throw new Error('Missing or invalid Sanity project ID');
  if (!/^[a-z0-9_-]+$/.test(config.dataset)) throw new Error('Invalid dataset');
  const url = new URL(`https://${config.projectId}.${useCdn ? 'apicdn' : 'api'}.sanity.io/v${config.apiVersion}/data/query/${config.dataset}`);
  url.searchParams.set('query', query);
  url.searchParams.set('perspective', 'published');
  return url;
}

export function checkContent(result) {
  if (!result || !Array.isArray(result.projects)) throw new Error('Invalid CMS response');
  return { settings: result.settings ?? null, projects: result.projects };
}
