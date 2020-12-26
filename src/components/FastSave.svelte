<script>
    import { format, parseISO } from 'date-fns'
    import Button, { Label } from '@smui/button'
    import { DATETIME_FORMAT, fastStarted, fastEnded, fasts } from '../store.js'

    let fastStartedValue = $fastStarted || localStorage.getItem('fastStarted')
    let fastEndedValue = $fastEnded || localStorage.getItem('fastEnded')

    const saveFast = () => {
        $fasts.push({
            start: $fastStarted,
            end: $fastEnded,
            hours: 16.5
        })
        localStorage.setItem('fasts', $fasts)
        
        fastStarted.set(null)
        fastEnded.set(null)
    }
</script>

<main>
    <p>fastStarted: {fastStartedValue}</p>
    <p>fastEnded: {fastEndedValue}</p>
    <ul>
        <li><Button on:click={saveFast}><Label>pokračuj v  půstu</Label></Button></li>
        <li><Button on:click={saveFast}><Label>ulož půst</Label></Button></li>
        <li><Button on:click={saveFast}><Label>smaž půst</Label></Button></li>
    </ul>
</main>