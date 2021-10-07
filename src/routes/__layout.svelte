<script lang="ts">
	import Header from '$lib/header/Header.svelte';
	import '../app.css';
</script>

<Header />

<main>
	<slot />
</main>

<footer>
	<ul>
		<li>&copy; 2020-2021 nesro :)</li>
		<li>s ❤️ běží na SvelteKit u Vercel, data jsou na Mongo Altas</li>
		<li><a href="/privacy-policy">Zásady ochrany osobních údajů</a></li>
		<li><a href="/terms-of-service">Podmínky použití</a></li>
	</ul>
</footer>

<style>
	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 1024px;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 40px;
	}

	footer ul li {
		list-style: none;
		text-align: center;
	}

	@media (min-width: 480px) {
		footer {
			padding: 40px 0;
		}
	}
</style>
