<script>
    import { parseISO, differenceInSeconds } from 'date-fns'
    import Button, { Label } from '@smui/button'
    import { DATETIME_FORMAT, setStore, fastStarted, fastEnded, fasts, active } from '../store.js'

    const saveFast = () => {
        $fasts = [...$fasts, {
            start: $fastStarted,
            end: $fastEnded,
            hours: differenceInSeconds(parseISO($fastEnded), parseISO($fastStarted)) / 60 / 60
        }]
        localStorage.setItem('fasts', JSON.stringify($fasts))

        setStore('fastStarted', null)
        setStore('fastEnded', null)
        setStore('active', 'history')
    }
</script>

<main>
    <p>fastStarted: {$fastStarted}</p>
    <p>fastEnded: {$fastEnded}</p>
    <ul>
        <li><Button on:click={saveFast}><Label>pokračuj v  půstu</Label></Button></li>
        <li><Button on:click={saveFast}><Label>ulož půst</Label></Button></li>
        <li><Button on:click={saveFast}><Label>smaž půst</Label></Button></li>
    </ul>
</main>