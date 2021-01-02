<!-- TODO move this layer up -->
<svelte:head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
    <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
</svelte:head>

<script>
    import Flatpickr from 'svelte-flatpickr/src/Flatpickr.svelte'
    import { DATETIME_FORMAT, fastStarted, fastingHours } from '../store.js';
    import { parseISO, format } from 'date-fns'

    export let name
    export let initDate

    let value = initDate
    let formattedValue
    let flatpickr

    // https://flatpickr.js.org/options/
    // don't try to make it work on mobile. it uses native date pickers :(
	const options = {
        enableTime: true,
        time_24hr: true,
        static: true,
        //wrap: true,
        dateFormat: 'Y-m-d H:i:S',
        altInput: true,
        altFormat: 'Y-m-d H:i:S',
		onChange(selectedDates, dateStr) {
            if (false) {
                console.log('flatpickr hook', selectedDates, dateStr, " value=", value);
            }

            if (name === 'from') {
                console.log({dateStr})
                const parsed = parseISO(dateStr)
                console.log({parsed})
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
    
	const handleOpen = (event) => {
        event.preventDefault();
        console.log(flatpickr)
		if (flatpickr) {
            flatpickr.open();
            console.log('flatpickr opened')
            flatpickr.calendarContainer.focus();
            console.log('flatpickr focused')
		} else {
            console.log('flatpickr not ready')
        }
    }
    
	const handleChange = (event) => {
        const [ selectedDates, dateStr ] = event.detail;
        if (false) {
            console.log('hook2: ', { selectedDates, dateStr });
        }
    }

    const handleClose = (event) => {
        console.log('closed');
    }

    export function setDate(value) {
        if (true) {
            console.log('set date=', value)
        }
        if (flatpickr) {
            flatpickr.setDate(value, true, DATETIME_FORMAT)
        } else {
            console.log('flatpickr not ready for setValue')
        }
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

