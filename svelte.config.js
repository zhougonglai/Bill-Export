import vercel from '@sveltejs/adapter-vercel';
import preprocess from 'svelte-preprocess';
import { optimizeImports } from 'carbon-preprocess-svelte';

export default {
  preprocess: [preprocess({ postcss: true, pug: true }), optimizeImports()],
  kit: {
    adapter: vercel(),
    target: '#svelte'
  }
};
