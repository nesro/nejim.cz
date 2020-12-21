<script>
    import Progress from "./Progress.svelte";
	import SelectHours from "./SelectHours.svelte";
	import Stopwatch from "./Stopwatch.svelte";
	import FastStatus from "./FastStatus.svelte";

	import { fastStarted, fastingHours } from '../store.js';

	const defaultFastingHours = "16"
	let from = new Date()
	let to = new Date()
	to.setHours(to.getHours() + defaultFastingHours)

	const handleStartFast = () => {
		fastStarted.set(from);
	}
	
	let inFast
	let fastRemaining

	const updateLoop = () => {
		if ($fastStarted !== null) {
			const now = Date.now()
			inFast = Math.floor((now - $fastStarted.getTime()) / 1000)

			fastRemaining = ($fastStarted.getTime() + ($fastingHours * 60 * 60 * 1000) - now) / 1000 / 60 / 60

			console.log({inFast})
		}

		setTimeout(updateLoop, 1000);
	}
	updateLoop()

</script>

<main>
	<h1>Work in progress :)</h1>
	
	<button on:click="{handleStartFast}">začni půst</button>

			<SelectHours name='fastingHours' value={defaultFastingHours} />
			<Stopwatch name='from' initDate={from} />
			<Progress />
			<Stopwatch name='to' initDate={to} />
			<FastStatus />

			<p>from={from}, to={to}, fastStarted={$fastStarted}, inFast={inFast}, fastingHours={$fastingHours}, fastRemaining={fastRemaining}}</p>
</main>
