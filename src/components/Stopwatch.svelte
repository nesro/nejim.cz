<!-- TODO move this layer up -->
<svelte:head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
    <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
</svelte:head>

<script>
    import Flatpickr from 'svelte-flatpickr/src/Flatpickr.svelte'
    import { DATETIME_FORMAT, fastStarted, fastingHours } from '../store.js';
    import { onDestroy } from 'svelte'
    import { formatDistance, formatDistanceToNow, formatDistanceStrict, parseISO, add, sub, format, differenceInSeconds } from 'date-fns'

    export let name
    export let initDate

    let value = initDate
    let formattedValue
    let flatpickr

	const options = {
        enableTime: true,
        time_24hr: true,
        dateFormat: 'Y-m-d H:i:S',
		onChange(selectedDates, dateStr) {
            if (false) {
                console.log('flatpickr hook', selectedDates, dateStr, " value=", value);
            }

            if (name === 'from') {
                const parsed = parseISO(dateStr)
                const newFastStarted = format(parsed, DATETIME_FORMAT)
                fastStarted.set(newFastStarted)
                localStorage.setItem("fastStarted", newFastStarted)
            }
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
		} else {
            console.log('flatpickr not ready')
        }
    }
    
	const handleChange = (event) => {
        const [ selectedDates, dateStr ] = event.detail;
        if (true) {
            console.log('hook2: ', { selectedDates, dateStr });
        }
    }

    const handleClose = (event) => {
        console.log('closed');
    }

    export function setDate(value) {
        if (false) {
            console.log('set date=', value)
        }
        flatpickr && flatpickr.setDate(value, true, 'Y-m-d H:i:S')
    }
</script>

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

