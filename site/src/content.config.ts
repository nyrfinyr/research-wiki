import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
	docs: defineCollection({
		loader: docsLoader(),
		schema: docsSchema({
			extend: z
				.object({
					type: z.string().optional(),
					updated: z.coerce.date().optional(),
				})
				.passthrough(),
		}),
	}),
};
