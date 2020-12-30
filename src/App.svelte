<svelte:head>
  <title>nejim.cz - Appka na přerušovaný půst</title>

  <!-- Global site tag (gtag.js) - Google Analytics -->
	<script async src="https://www.googletagmanager.com/gtag/js?id=G-LK4FPFX2XK"></script>
	<script>
	window.dataLayer = window.dataLayer || [];
	function gtag(){dataLayer.push(arguments);}
	gtag('js', new Date());

	gtag('config', 'G-LK4FPFX2XK');
	</script>
</svelte:head>

<script>
	import Info from './components/Info.svelte'
	import TopAppBar from './components/TopAppBar.svelte'
	import FastingApp from './components/FastingApp.svelte'
	import FastImport from './components/FastImport.svelte'
	import FastHistory from './components/FastHistory.svelte'
	import Settings from './components/Settings.svelte'

	import { active } from './store'
import FastSave from './components/FastSave.svelte';

	let activeValue
	const unsubscribe = active.subscribe(value => {
		activeValue = value;
	});
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
		{:else if activeValue === 'fastSave'}
			<FastSave />
		{:else if activeValue === 'settings'}
			<Settings />
		{:else if activeValue === 'import'}
			<FastImport />
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