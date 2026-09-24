import {defineCliConfig} from 'sanity/cli';
import {readFileSync} from 'node:fs';
const config = JSON.parse(readFileSync(new URL('../site.config.json', import.meta.url), 'utf8'));
export default defineCliConfig({
  api: {projectId: config.projectId, dataset: config.dataset},
  studioHost: 'icon9507-portfolio',
  deployment: {appId: 'szjrkyq3yjdtrzwfv1m2mw1i', autoUpdates: false}
});
