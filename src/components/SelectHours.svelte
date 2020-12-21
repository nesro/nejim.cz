<!-- TODO move this layer up -->
<svelte:head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
    <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
</svelte:head>

<script>
    import Flatpickr from 'svelte-flatpickr/src/Flatpickr.svelte'

    import { fastingHours } from '../store';

    export let name
    export let value
    
	const handleChange = (event) => {
        console.log(event.target.value)
        fastingHours.set(event.target.value);
		//const [ selectedDates, dateStr ] = event.detail;
		//console.log({ selectedDates, dateStr });
    }

</script>

<style>

  </style>

<main>
    <div class="fastingHoursDiv">
        <label for="fastingHoursInput">{name}</label>
        <input id="fastingHoursInput" type="number" {value} on:change={handleChange} />
    </div>
</main>

