<script>
    import { fastingHours } from '../store';
    import { onDestroy } from 'svelte'

    let fastingHoursValue
	const unsubscribeFastingHours = fastingHours.subscribe(value => {
        fastingHoursValue = value;
	});

    onDestroy(unsubscribeFastingHours)

</script>

<main>

    <p>fastingHours: {fastingHoursValue}, activeFast: xx</p>

</main>