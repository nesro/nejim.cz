<script lang="ts">
    import { enhance } from '$app/forms';
    import type { PageData, ActionData } from './$types';
    import { onMount } from 'svelte';
    import type Fast from '$lib/models/Fast';

    export let data: PageData;
    export let form: ActionData;

    export let activeFast: Fast | null = null;

    export let activeFastProgress = 0;

    export let date = new Date();

    console.log(`NESRO DATE: ${date}, ${date.getHours()}`);

    let startFastAtDateBind: string;
    let startFastAtTimeBind: string;
    let endFastAtDateBind: string;
    let endFastAtTimeBind: string;
    let startFastGoalBind: number;

    console.error(data, form);

    const fasts = JSON.parse(data.fasts ?? '');

    export let fastingForSeconds = 0;

    if (fasts[0] && !fasts[0].to) {
        activeFast = fasts[0];
    }

    onMount(async () => {
        date.setSeconds(0);
        date.setMilliseconds(0);

        const startFastAtDate = <HTMLInputElement>document.getElementById('start-fast-at-date');
        if (startFastAtDate) {
            startFastAtDateBind = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        }
        const startFastAtTime = <HTMLInputElement>document.getElementById('start-fast-at-time');
        if (startFastAtTime) {
            startFastAtTimeBind = `${date.getHours()}:${String(date.getMinutes()).padStart(
                2,
                '0',
            )}`;
        }
        const endFastAtDate = <HTMLInputElement>document.getElementById('end-fast-at-date');
        if (endFastAtDate) {
            endFastAtDateBind = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        }
        const endFastAtTime = <HTMLInputElement>document.getElementById('end-fast-at-time');
        if (endFastAtTime) {
            endFastAtTimeBind = `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
        }

        const startFastGoal = <HTMLInputElement>document.getElementById('start-fast-goal');
        if (startFastGoal) {
            startFastGoal.value = '16';
        }

        const intervalFunction = () => {
            if (!activeFast) {
                return;
            }

            const fromTimestamp = new Date(activeFast!.from).getTime();
            fastingForSeconds = Math.floor((Date.now() - fromTimestamp) / 1000);

            // how long the fast lasts / 8 hours
            activeFastProgress = (fastingForSeconds / ((activeFast.goal ?? 16) * 60 * 60)) * 100;
        };

        const interval = setInterval(intervalFunction, 1000);
        intervalFunction();

        return () => {
            clearInterval(interval);
        };
    });

    const endFastInput = () => {
        console.error(endFastAtDateBind, endFastAtTimeBind);
    };
</script>

<h1>nejim</h1>

<p>now: {new Date()}</p>

<p>data={data.raz}</p>

<pre>
    {JSON.stringify(data.fasts)}
</pre>

{#if activeFast}
    <!-- <p>active fast={JSON.stringify(activeFast)}</p> -->

    <label for="file">Fast progress:</label>
    <progress id="file" value={activeFastProgress} max="100">{activeFastProgress}%</progress>
    <ul>
        <li>from: {new Date(activeFast.from)} (utc: {activeFast.from})</li>
        <li>goal: {activeFast.goal} hours</li>
        <li>
            to: {new Date(
                new Date(activeFast.from).getTime() + (activeFast.goal ?? 16) * 60 * 60 * 1000,
            )} - (utc: {new Date(
                new Date(activeFast.from).getTime() + (activeFast.goal ?? 16) * 60 * 60 * 1000,
            ).toISOString()})
        </li>
        <li>activeFastProgress: {activeFastProgress} %</li>
        <li>
            fastingForSeconds: {fastingForSeconds} (hours: {(fastingForSeconds / 60 / 60).toFixed(
                3,
            )})
        </li>
    </ul>

    <form
        method="POST"
        action="?/end-fast"
        use:enhance={() => {
            // prevent default callback from resetting the form
            return ({ update }) => {
                update({ reset: false });
            };
        }}
    >
        <h2>end the fast!</h2>
        <input
            name="end-fast-at-date"
            type="date"
            id="end-fast-at-date"
            bind:value={endFastAtDateBind}
            on:input={endFastInput}
        />
        <input
            name="end-fast-at-time"
            type="time"
            id="end-fast-at-time"
            bind:value={endFastAtTimeBind}
            on:input={endFastInput}
        />
        <button>send!</button>
    </form>
{:else}
    <p>no active fast</p>
{/if}

<form
    method="POST"
    action="?/fast-start"
    use:enhance={() => {
        // prevent default callback from resetting the form
        return ({ update }) => {
            update({ reset: false });
        };
    }}
>
    <h2>start fast at</h2>

    <input
        name="start-fast-at-date"
        type="date"
        id="start-fast-at-date"
        bind:value={startFastAtDateBind}
    />
    <input
        name="start-fast-at-time"
        type="time"
        id="start-fast-at-time"
        bind:value={startFastAtTimeBind}
    />

    <input
        name="start-fast-goal"
        type="number"
        id="start-fast-goal"
        bind:value={startFastGoalBind}
    />

    <b>total fast duration=</b>
    <button>send!</button>
</form>

<style>
    form {
        padding: 0.5rem;
        border: 1px solid gray;
    }

    progress {
        height: 2rem;
        width: 100%;
    }
</style>
