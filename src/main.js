import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		author: 'nesro'
	}
});

export default app;