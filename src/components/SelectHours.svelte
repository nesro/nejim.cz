<script>
    import { fastingHours } from '../store';

    export let name
    export let value
    
	const handleChange = (event) => {
        fastingHours.set(event.target.value);
    }
</script>

<main>
    <div class="fastingHoursDiv">
        <label for="fastingHoursInput">{name}</label>
        <input id="fastingHoursInput" type="number" {value} on:change={handleChange} />
    </div>
</main>
