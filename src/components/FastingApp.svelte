<script>
	import { onMount, onDestroy } from 'svelte'
	import { formatDistance, formatDistanceToNow, formatDistanceStrict, parseISO, add, sub, format, differenceInSeconds } from 'date-fns'
	import { cs } from 'date-fns/esm/locale'
	import Button, { Label } from '@smui/button'
    import Progress from './Progress.svelte'
	import SelectHours from './SelectHours.svelte'
	import Stopwatch from './Stopwatch.svelte'

	import { DATETIME_FORMAT, drawer, active, fastStarted, fastEnded, fastingHours, fasts, setStore } from '../store.js'

	let from = parseISO($fastStarted) || new Date()
	let to = null

	const handleStartFast = () => {
		setStore('fastStarted', format(from, DATETIME_FORMAT))
	}

	const handleEndFast = () => {
		setStore('fastStarted', null)
	}

	let fastStartedValue = $fastStarted !== 'null' ? $fastStarted : null
	const fastStartedUnsubscribe = fastStarted.subscribe(value => {
		if (value === 'null') {
			console.log('setting fastStartedValue = null')
			fastStartedValue = null
		} else {
			fastStartedValue = value
		}

		
		console.log('new fastStartedValue=', fastStartedValue)
		/*console.log('fastStarted local storage updating to: ', value)
		localStorage.setItem("fastStarted", value)*/
	})

	$: fastToValue = to !== null && format(to, DATETIME_FORMAT)

	let progressComponent
	let fromComponent

	let wordsFastStarted
	let wordsFastRemaining
	let remainingSeconds
	let remainingPercent
	let remainingSecondsTotal

	let fastRemainingSeconds
	let fastRemainingMinutes
	let fastRemainingHours

	let nowIs
	let endsIn

	const updateLoop = () => {
		if (active === 'stopwatch') {
			return
		}

		if (fastStartedValue === null) {
			from = new Date()
			nowIs = format(from, DATETIME_FORMAT)
			to = add(from, {hours: $fastingHours})
			endsIn = format(to, DATETIME_FORMAT)
		} else {

			const started = parseISO(fastStartedValue);
			to = add(started, {hours: $fastingHours})

			if (false) {
				console.log('')
				console.log('updateLoop:')
				console.log({fastStartedValue})
				console.log({$fastStarted})
				console.log({started})
				console.log({from})
				console.log({to})
			}

			remainingSecondsTotal = differenceInSeconds(to, started)
			remainingSeconds = differenceInSeconds(to, new Date())
			remainingPercent = (1 - (remainingSeconds / remainingSecondsTotal))
			
			wordsFastRemaining = formatDistance(new Date(), to, { addSuffix: false, includeSeconds: true, locale: cs })

			wordsFastStarted = formatDistanceToNow(started, { addSuffix: true, includeSeconds: true, locale: cs })

			fastRemainingHours = Math.floor(remainingSeconds / 60 / 60)
			fastRemainingMinutes = Math.floor(remainingSeconds / 60 % 60)
			fastRemainingSeconds = Math.floor(remainingSeconds % 60)

			if (progressComponent) {
				progressComponent.progressAnimate(+remainingPercent, +fastRemainingHours, +fastRemainingMinutes, +fastRemainingSeconds)
			}
		}

		setTimeout(updateLoop, 1000)
	}

	onMount(() => {
		updateLoop();
	})
	onDestroy(fastStartedUnsubscribe)

	const setActiveFromFastingApp = (toActive) => {
        drawer.set(false)
        active.set(toActive)
        localStorage.setItem("active", toActive)
    }

	const actionFastSave = () => {
		const fastEndedDate = format(new Date(), DATETIME_FORMAT)

		fastEnded.set(fastEndedDate)
		localStorage.setItem('fastEnded', fastEndedDate) 		
		setActiveFromFastingApp('fastSave')
	}
</script>

<main>
	<h1>Work in progress :)</h1>

	{#if fastStartedValue === null}
	<ul>
		<li><Button on:click={handleStartFast}><Label>začni půst teď</Label></Button></li>
		<li><Button><Label>změn cíl ({$fastingHours} hodin)</Label></Button></li>
	</ul>
	<p>Právě je {nowIs}</p>
	<p>Půst skončí v {endsIn}</p>
	{:else}
	<ul>
		<li><Button on:click={actionFastSave}><Label>ulož půst</Label></Button></li>
		<li><Button on:click={handleEndFast}><Label>zruš půst</Label></Button></li>
	</ul>

	<p>Půst začal {wordsFastStarted} ({fastStartedValue})</p>
	<p>Půst skončí za {wordsFastRemaining} ({fastToValue})</p>
	
	<!--<p>{wordsFastRemainingStrict}, remainingSecondsTotal={remainingSecondsTotal}, remainingSeconds={remainingSeconds}, remainingPercent={remainingPercent}%</p>-->

	<Stopwatch bind:this={fromComponent} name='from' initDate={from} />
	<Progress bind:this={progressComponent} />

	<!--<ul>
		<li>from={format(from, DATETIME_FORMAT)}</li>
		<li>to={format(to, DATETIME_FORMAT)}</li>
		<li>fastingHours={$fastingHours}</li>
		<li>fastRemaining={fastRemaining}</li>
		<li>fastStarted={$fastStarted}</li>
		<li>local storage fastStarted={localStorage.getItem("fastStarted")}</li>
		<li>fastRemainingHours={fastRemainingHours}</li>
		<li>fastRemainingMinutes={fastRemainingMinutes}</li>
		<li>fastRemainingSecond={fastRemainingSeconds}</li>
		<li>fastRemainingPercentage={fastRemainingPercentage}</li>
		<li>fastRemaining={fastRemaining}</li>
	</ul>-->

	{/if}

	<SelectHours name='fastingHours' value={$fastingHours} />
</main>
