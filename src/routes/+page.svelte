<script lang="ts">
    import { enhance } from '$app/forms';
    import type { PageData, ActionData } from './$types';
    import { onMount } from 'svelte';
    import type Fast from '$lib/models/Fast';

    export let data: PageData;

    // export let form: ActionData;

    export let activeFast: Fast | null = null;

    export let activeFastProgress = '';

    export let date = new Date();

    // console.log(`NESRO DATE: ${date}, ${date.getHours()}`);
    // console.error(data, form);

    let startFastAtDateBind: string;
    let startFastAtTimeBind: string;
    let endFastAtDateBind: string;
    let endFastAtTimeBind: string;
    let startFastGoalBind: number;
    let fastingForMs: number;

    const fasts = JSON.parse(data.fasts ?? '[]') as Fast[];

    export let fastingForSeconds = 0;

    if (fasts[0] && !fasts[0].to) {
        activeFast = fasts[0];
    }

    const finishedFasts = fasts.filter((f) => f.to);

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
            fastingForMs = Date.now() - fromTimestamp;
            fastingForSeconds = Math.floor(fastingForMs / 1000);

            // how long the fast lasts / 8 hours
            activeFastProgress = (
                (fastingForMs / ((activeFast.goal ?? 16) * 60 * 60 * 1000)) *
                100
            ).toFixed(4);
        };

        const interval = setInterval(intervalFunction, 100);
        intervalFunction();

        return () => {
            clearInterval(interval);
        };
    });

    const endFastInput = () => {
        console.error(endFastAtDateBind, endFastAtTimeBind);
    };
</script>

<section>
    <h1>
        <div class="welcome">
            nejim
            <sub
                ><picture>
                    <img src="favicon.png" alt="nejim.cz" />
                </picture>
            </sub>
            cz
        </div>
    </h1>

    {#if data.user}
        {JSON.stringify(data.user)}
        <div class="box" style="display: inline;">
            Hey {(data.user.name ?? '').split(' ')[0]}<img
                src={data.user.picture}
                alt="avatar"
                style="vertical-align:middle; margin: 0.5em; width: 2em; height: 2em; border-radius: 25%; border: 1px solid black;"
            />, you're logged in! Want to <a href="">log out</a>?
        </div>

        {#if activeFast}
            <div class="box">
                <label for="file">Fast progress:</label>
                <progress id="file" value={activeFastProgress} max="100"
                    >{activeFastProgress}%</progress
                >
                <ul>
                    <li>from: {new Date(activeFast.from)} (utc: {activeFast.from})</li>
                    <li>goal: {activeFast.goal} hours</li>
                    <li>
                        to: {new Date(
                            new Date(activeFast.from).getTime() +
                                (activeFast.goal ?? 16) * 60 * 60 * 1000,
                        )} - (utc: {new Date(
                            new Date(activeFast.from).getTime() +
                                (activeFast.goal ?? 16) * 60 * 60 * 1000,
                        ).toISOString()})
                    </li>
                    <li>
                        activeFastProgress: {activeFastProgress} %, (thats {(
                            fastingForMs /
                            60 /
                            60 /
                            1000
                        ).toFixed(5)} hours)
                    </li>
                </ul>
            </div>

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
        {/if}

        <h2>Past Fasts:</h2>

        <ul>
            {#each finishedFasts as fast}
                <li>from={fast.from}, to={fast.to}, goal={fast.goal}</li>
            {/each}
        </ul>
    {:else}
        <div class="box" style="max-width: 300px">
            To track your progress, log in with Google:

            <script src="https://accounts.google.com/gsi/client" async defer></script>
            <div
                id="g_id_onload"
                data-client_id="441424513410-ck588arbet3mcbm3794vkl8ppr6ht1im.apps.googleusercontent.com"
                data-login_uri="https://nejim.cz/google-login"
                data-auto_prompt="false"
            />
            <div
                class="g_id_signin"
                data-type="standard"
                data-size="large"
                data-theme="outline"
                data-text="sign_in_with"
                data-shape="rectangular"
                data-logo_alignment="left"
            />
        </div>
    {/if}
</section>

<style>
    form,
    .box {
        padding: 0.5rem;
        margin: 0.5rem;
        border: 1px solid gray;
    }

    progress {
        height: 2rem;
        width: 100%;
    }

    /* logo styles */
    section {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex: 1;
    }

    h1 {
        width: 100%;
    }

    .welcome {
        position: relative;
        width: 100%;
        height: 0;
        padding-bottom: 1em;
    }

    .welcome img {
        position: relative;
        top: 0.4em;
        left: 2px;
        width: 2em;
        height: 2em;
        margin: 0 -0.8em;
    }
</style>
