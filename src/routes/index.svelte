<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	// import Counter from '$lib/Counter.svelte';
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<section>
	<h1>
		<div class="welcome">
			nejim
			<picture>
				<img src="favicon.png" alt="nejim.cz" />
			</picture>
			cz
		</div>
	</h1>

	<p>Karle, dáš si k telce ty <span class="red">čipsy</span>?</p>
	<p>Ne Mařeno. Já už <span class="green">nejim</span>. Nejim - tečka - cé zet.</p>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}

	h1 {
		width: 100%;
	}

	.welcome {
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}

	.welcome img {
		width: 1em;
		height: 1em;
	}
</style>
