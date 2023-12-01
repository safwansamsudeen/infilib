import { vitePreprocess } from '@sveltejs/kit/vite';
import adapter from '@sveltejs/adapter-netlify';
/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			// if true, will create a Netlify Edge Function rather
			// than using standard Node-based functions
			edge: false
		})
	}
};

export default config;
