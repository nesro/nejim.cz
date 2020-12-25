<script>
    import Button, { Label } from '@smui/button'

    const handleDeleteHistory = () => {
        localStorage.setItem("fasts", [])
        console.log('history deleted')
    }
</script>

<main>
    <Button on:click={handleDeleteHistory}><Label>Smaž historii</Label></Button>
</main>