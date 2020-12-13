<svelte:head>
  <title>nejim.cz - Appka na přerušovaný půst</title>
</svelte:head>

<script>
	import Info from "./components/Info.svelte";
	import Stopwatch from "./components/Stopwatch.svelte";
	import TopAppBar from "./components/TopAppBar.svelte";

	import { active } from './store';

	let activeValue
	const unsubscribe = active.subscribe(value => {
		activeValue = value;
	});

	export let author;
</script>

<main>
	<TopAppBar />

	<div style="margin: 2.5em auto; max-width: 768px;">
		{#if activeValue === 'info'}
			<Info />
		{:else if activeValue === 'stopwatch'}
			<Stopwatch />
		{/if}
	</div>


	<!-- footer>author: {author}</footer> -->
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>