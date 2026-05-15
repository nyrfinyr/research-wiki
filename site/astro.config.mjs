// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import remarkWikiLink from 'remark-wiki-link';
import { readdirSync, realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Build a slug → URL map for Obsidian-style [[wikilinks]].
// Starlight serves a file at `<dir>/<name>.md` under `/<dir>/<name>/`.
// We let users write either bare links (`[[self-attention]]`) or
// directory-qualified ones (`[[concepts/self-attention]]`).
const docsDir = realpathSync(fileURLToPath(new URL('./src/content/docs', import.meta.url)));
const slugMap = new Map();
const fullMap = new Map();
for (const entry of readdirSync(docsDir, { recursive: true })) {
	if (typeof entry !== 'string' || !/\.(md|mdx)$/i.test(entry)) continue;
	const noExt = entry.replace(/\.(md|mdx)$/i, '').split(path.sep).join('/').toLowerCase();
	const url = '/' + noExt.replace(/(^|\/)index$/i, '');
	fullMap.set(noExt, url);
	const base = path.basename(noExt);
	if (!slugMap.has(base)) slugMap.set(base, url);
}

const resolveWikiLink = (perm) => {
	if (fullMap.has(perm)) return fullMap.get(perm);
	if (slugMap.has(perm)) return slugMap.get(perm);
	return `/${perm}`;
};

export default defineConfig({
	markdown: {
		remarkPlugins: [
			[
				remarkWikiLink,
				{
					pageResolver: (name) => [name.trim().toLowerCase().replace(/\s+/g, '-')],
					hrefTemplate: resolveWikiLink,
					aliasDivider: '|',
				},
			],
		],
	},
	integrations: [
		starlight({
			title: 'Research Wiki',
			description: 'Wiki personale di ricerca, gestita dall\'LLM.',
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/nyrfinyr/research-wiki' },
			],
			sidebar: [
				{ label: 'Index', slug: 'index' },
				{ label: 'Log', slug: 'log' },
				{ label: 'Sources', items: [{ autogenerate: { directory: 'sources' } }], collapsed: true },
				{ label: 'Concepts', items: [{ autogenerate: { directory: 'concepts' } }], collapsed: true },
				{ label: 'Syntheses', items: [{ autogenerate: { directory: 'syntheses' } }], collapsed: true },
			],
		}),
	],
});
