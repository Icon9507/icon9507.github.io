import {defineConfig} from 'sanity';
import {structureTool} from 'sanity/structure';
import config from '../site.config.json';
import {schemaTypes} from './schemaTypes.js';

export default defineConfig({
  name: 'portfolio',
  title: '作品集管理',
  projectId: config.projectId,
  dataset: config.dataset,
  plugins: [structureTool({
    structure: S => S.list().title('内容管理').items([
      S.listItem().title('网站设置').id('siteSettings').child(
        S.document().schemaType('siteSettings').documentId('siteSettings').title('网站设置')
      ),
      S.divider(),
      S.documentTypeListItem('portfolioProject').title('作品')
    ])
  })],
  schema: {
    types: schemaTypes,
    templates: templates => templates.filter(template => template.schemaType !== 'siteSettings')
  },
  document: {
    actions: (actions, context) => context.schemaType === 'siteSettings'
      ? actions.filter(action => !['delete', 'duplicate', 'unpublish'].includes(action.action))
      : actions
  }
});
