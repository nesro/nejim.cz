<!-- TODO move this layer up -->
<svelte:head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
    <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
</svelte:head>

<script>
    import Flatpickr from 'svelte-flatpickr/src/Flatpickr.svelte'
    import { fastingHours } from '../store.js';
    import { onDestroy } from 'svelte'

    export let name
    export let initDate

    let value = initDate
    let formattedValue
    let flatpickr

    let fastingHoursValue
	const unsubscribeFastingHours = fastingHours.subscribe(value => {
        fastingHoursValue = value;

        if (name === 'to') {
            let now = new Date()
            now.setHours(now.getHours() + fastingHoursValue)
            value = now
            flatpickr && flatpickr.setDate(value, true, 'Y-m-d H:i')

            console.log('new fasting hours', fastingHoursValue, ' new date ', now)
        }
	});

	const options = {
        enableTime: true,
        time_24hr: true,
        dateFormat: 'Y-m-d H:i',
		onChange(selectedDates, dateStr) {
			console.log('flatpickr hook', selectedDates, dateStr, " value=", value);
		},
		onOpen() {
			console.log('onOpen');
        },
        onClose() {
            console.log('onClose')
        },
        onReady() {
            console.log('onReady')
        }
    };
    
    //$: console.log({ value, formattedValue });
    
	const handleOpen = (event) => {
        event.preventDefault();
        console.log(flatpickr)
		if (flatpickr) {
			flatpickr.open();
			flatpickr.calendarContainer.focus();
		}
    }
    
	const handleChange = (event) => {
		const [ selectedDates, dateStr ] = event.detail;
		console.log({ selectedDates, dateStr });
    }

    const handleClose = (event) => {
        console.log('closed');
    }

    onDestroy(unsubscribeFastingHours)
</script>

<style>

  </style>

<main>
    <h2>{name}</h2>
    <Flatpickr
            {options}
            {name}
            bind:value
            bind:formattedValue
            bind:flatpickr
            on:change={handleChange}
            on:close={handleClose}
            on:open={handleOpen} />
</main>

