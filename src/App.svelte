<svelte:head>
  <title>nejim.cz - Appka na přerušovaný půst</title>
</svelte:head>

<script>
	import Info from "./components/Info.svelte";
import Progress from "./components/Progress.svelte";
	import Stopwatch from "./components/Stopwatch.svelte";
	import TopAppBar from "./components/TopAppBar.svelte";

	import { active } from './store';

	let activeValue
	const unsubscribe = active.subscribe(value => {
		activeValue = value;
	});

	export let author;

	let fastingHours = 16
	let from = new Date()
	let to = new Date()
	to.setHours(to.getHours() + fastingHours)
</script>

<main>
	<TopAppBar />

	<div style="margin: 1em auto; max-width: 768px;">
		{#if activeValue === 'info'}
			<Info />
		{:else if activeValue === 'stopwatch'}
			<h1>Work in progress :)</h1>
			<p>Fasting goal: {fastingHours}</p>

			<label for="fastingHours">Plnovaná délka půstu:</label>
			<input type="number" id="quantity" name="quantity" min="1" max="72" value="16">

			<Stopwatch name='from' initDate={from} />
			<Progress />
			<Stopwatch name='to' initDate={to} />
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