import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'path';
export default defineConfig({
	plugins: [sveltekit()],
	resolve: {
		alias: {
			'~bootstrap': path.resolve(__dirname, 'node_modules/bootstrap')
		}
	},
	build: {
		// https://github.com/vitejs/vite/issues/6985
		target: 'esnext'
	},
	server: { hmr: false }
});
