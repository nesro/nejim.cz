<script>
    import Button, { Label } from '@smui/button'
    import { setStore} from '../store.js'

    const handleDeleteHistory = () => {
        setStore('fasts', [])
        console.log('history deleted')
    }
</script>

<main>
    <Button on:click={handleDeleteHistory}><Label>Smaž historii</Label></Button>
</main>