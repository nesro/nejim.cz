<svelte:head>
  <title>nejim.cz - Appka na přerušovaný půst</title>
</svelte:head>

<script>
	import Info from "./components/Info.svelte";
	import TopAppBar from "./components/TopAppBar.svelte";
	import FastingApp from "./components/FastingApp.svelte";

	import { writable } from 'svelte/store';

	import { active } from './store';
import FastHistory from "./components/FastHistory.svelte";
	

	let activeValue
	const unsubscribe = active.subscribe(value => {
		activeValue = value;
	});

	export let author;

</script>

<main>
	<TopAppBar />

	<div style="margin: 1em auto; max-width: 768px;">
		{#if activeValue === 'info'}
			<Info />
		{:else if activeValue === 'stopwatch'}
			<FastingApp />
		{:else if activeValue === 'history'}
			<FastHistory />
		{/if}
	</div>


	<!-- footer>author: {author}</footer> -->
</main>

<style>
	main {
		text-align: center;
		max-width: 240px;
		margin: 0 auto;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>