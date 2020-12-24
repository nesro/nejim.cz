<script>
	
	import Dialog, { Title, Content, Actions, InitialFocus } from '@smui/dialog'
	import Button, { Label } from '@smui/button'
	import { Text } from '@smui/list';
    import Progress from './Progress.svelte'
	import SelectHours from './SelectHours.svelte'
	import Stopwatch from './Stopwatch.svelte'
	import FastStatus from './FastStatus.svelte'
	import { onMount, onDestroy } from 'svelte'

	import { fastStarted, fastingHours } from '../store.js'

	const defaultFastingHours = "16"
	let from = new Date()
	let to = new Date()

	let xxx = new Date()

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

	
	let simpleDialog
	let clicked

</script>

<main>
	<h1>Work in progress :)</h1>
	

	<div>
		<Dialog bind:this={simpleDialog} aria-labelledby="simple-title" aria-describedby="simple-content">
		  <!-- Title cannot contain leading whitespace due to mdc-typography-baseline-top() -->
		  <Title id="simple-title">Uložit půst</Title>
		  <Content id="simple-content">
			Super awesome dialog body text?

			<Stopwatch name='from' initDate={xxx} />
			<Stopwatch name='to' initDate={xxx} />

			Půst lze po uložení editovat v historii půstů.

		  </Content>
		  <Actions>
			<Button color="secondary" on:click={() => clicked = 'No'}>
			  	<Label>No</Label>
			</Button>
			<Button color="secondary"on:click={() => clicked = 'Yes'} default use={[InitialFocus]}>
				<Label>Yes</Label>
			</Button>
		  </Actions>
		</Dialog>
	
		<Button on:click={() => simpleDialog.open()}><Label>Open Dialog</Label></Button>
	  </div>

	<Button on:click="{handleStartFast}">začni půst</Button>
	<Button on:click="{handleEndFast}">přeruš půst</Button>
	<Button on:click="{handleFastInfo}">půst info</Button>

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
