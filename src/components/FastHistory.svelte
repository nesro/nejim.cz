<svelte:head>
    <script src="https://unpkg.com/papaparse@5.3.0/papaparse.min.js"></script>
</svelte:head>

<script>
    import { onMount } from 'svelte'

    let data = []

    onMount(async () => {
        const response = await fetch('http://localhost:5000/zero.csv')
        const text = await response.text()
        
        Papa.parse(text, {
            complete: function(results) {
                results.data.shift() // remove csv header

                results.data.map((value) => {
                    const s = value[0].split('/')
                    const startDateTime = value[1].split(':')
                    const endDateTime = value[2].split(':')

                    const timeValue = s[2] +'-'+ s[0] +'-'+ s[1]
                    console.log(timeValue)
                    let startDate = new Date(timeValue)
                    startDate.setHours(+startDateTime[0], +startDateTime[1])

                    let endDate  = new Date(startDate)
                    endDate.setDate(startDate.getDate() + 1) // this doesn't work for 24+hours fasts                    
                    endDate.setHours(+endDateTime[0], +endDateTime[1])

                    const options = {
                        year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric',
                    };

                    value[0] = new Intl.DateTimeFormat('cs-CZ', options).format(startDate)
                    value[1] = new Intl.DateTimeFormat('cs-CZ', options).format(endDate)
                })

                data = results.data
            }
        })
    })
</script>

<main>
    <h1>fast history</h1>
    <ul>
        {#each data as [ start, end ], i}
        <li>
            {i}: {start}, {end}
        </li>
        {:else}
            <li>Loading....</li>
        {/each}
    </ul>
</main>