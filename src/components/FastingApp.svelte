<script>
    import Progress from "./Progress.svelte"
	import SelectHours from "./SelectHours.svelte"
	import Stopwatch from "./Stopwatch.svelte"
	import FastStatus from "./FastStatus.svelte"
	import { onMount, onDestroy } from 'svelte'

	import { fastStarted, fastingHours } from '../store.js'
	import { timestampToHMS } from '../utils.js'

	const defaultFastingHours = "16"
	let from = new Date()
	let to = new Date()
	to.setHours(to.getHours() + defaultFastingHours)

	const handleStartFast = () => {
		fastStarted.set(Math.floor(from.getTime() / 1000))
	}

	const handleEndFast = () => {
		fastStarted.set(null)
	}

	const handleFastInfo = () => {
		console.log("FAST INFO:")
		console.log("fastStarted=", $fastStarted)
	}

	const fastStartedUnsubscribe = fastStarted.subscribe(value => {
		console.log('fastStarted local storage updating to: ', value)
		localStorage.setItem("fastStarted", value)
	})

	let fastRemaining
	let now

	let progressComponent

	let fastingSeconds = 0
	$: fastingSeconds = $fastingHours * 60 * 60
	$: fastRemainingHours = Math.floor(fastRemaining / 60 / 60)
	$: fastRemainingMinutes = Math.floor(fastRemaining / 60 % 60)
	$: fastRemainingSeconds = Math.floor(fastRemaining % 60)
	$: fastRemainingPercentage = 1 - (fastRemaining / fastingSeconds)


	const updateLoop = () => {
		now = Math.floor(Date.now() / 1000)
		 if ($fastStarted != null && $fastStarted > 0) {
			/* console.log("$fastStarted=", $fastStarted) */
			fastRemaining = +$fastStarted + fastingSeconds - now

			if (fastRemainingPercentage != null && fastRemainingPercentage != NaN) {
				/* console.log("fastRemainingPercentage=", fastRemainingPercentage) */
				progressComponent.progressAnimate(+fastRemainingPercentage, +fastRemainingHours, +fastRemainingMinutes, +fastRemainingSeconds)
			}
		}
		
		setTimeout(updateLoop, 1000)
	}

	onMount(updateLoop)
	onDestroy(fastStartedUnsubscribe)
</script>

<main>
	<h1>Work in progress :)</h1>
	
	<button on:click="{handleStartFast}">začni půst</button>
	<button on:click="{handleEndFast}">přeruš půst</button>
	<button on:click="{handleFastInfo}">půst info</button>

			<SelectHours name='fastingHours' value={defaultFastingHours} />
			<Stopwatch name='from' initDate={from} />
			<Progress bind:this={progressComponent} />
			<Stopwatch name='to' initDate={to} />
			<FastStatus />

			<p>from={from}, to={to}, fastingHours={$fastingHours}, fastRemaining={fastRemaining}</p>
			<ul>
				<li>fastStarted={$fastStarted}</li>
				<li>local storage fastStarted={localStorage.getItem("fastStarted")}</li>
				<li>fastRemainingHours={fastRemainingHours}</li>
				<li>fastRemainingMinutes={fastRemainingMinutes}</li>
				<li>fastRemainingSecond={fastRemainingSeconds}</li>
				<li>fastRemainingPercentage={fastRemainingPercentage}</li>
				<li>fastRemaining={fastRemaining}</li>
			</ul>
</main>
