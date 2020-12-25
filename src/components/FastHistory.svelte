<script>
    import { fasts } from '../store.js'
</script>

<main>
    {#each $fasts as { start, end, hours }, i}
        <li>
            {i}: {start}, {end}, {hours}
        </li>
    {:else}
        <li>Zatím žádný půst</li>
    {/each}
</main>