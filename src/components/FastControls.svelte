<script>
    import { fastStarted } from '../store';

    const handleStartFast = () => {
        console.log('aa');
    }
</script>

<main>
    <button on:click="{handleStartFast}">začni půst</button>
</main>