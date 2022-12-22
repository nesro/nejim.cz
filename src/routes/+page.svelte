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

    let startFastAtTimestampBind: number;
    let startFastAtDateBind: string;
    let startFastAtTimeBind: string;

    let endFastAtTimestampBind: number;
    let endFastAtDateBind: string;
    let endFastAtTimeBind: string;

    let startFastGoalBind = 16;
    let fastingForMs: number;
    let activeFastMissingHours: number;

    let pastFastFromTs: number[] = [];

    let moodBind = '50';

    const fasts = JSON.parse(data.fasts ?? '[]') as Fast[];

    const formatDate = (value?: string | number | Date): string => {
        if (!value) {
            value = 0;
        }
        const date = new Date(value);
        return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
            .toISOString()
            .split('T')[0];
    };
    const formatTime = (value?: string | number | Date): string => {
        if (!value) {
            value = 0;
        }
        const date = new Date(value);
        return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
            .toISOString()
            .split('T')[1]
            .slice(0, 5);
    };

    export let fastingForSeconds = 0;

    const moodToEmoji = (mood?: number) => {
        switch (mood) {
            case 100:
                return '😄';
            case 50:
                return '🙂';
            case 0:
                return '😔';
            default:
                return '?';
        }
    };

    if (fasts[0] && !fasts[0].to) {
        activeFast = fasts[0];
    }

    const finishedFasts = fasts.filter((f) => f.to && f.toTs).map((f)=>{
        ...f,
    });

    const updateTimestamp = () => {
        startFastAtTimestampBind = new Date(
            `${startFastAtDateBind} ${startFastAtTimeBind}`,
        ).getTime();

        endFastAtTimestampBind = new Date(`${endFastAtDateBind} ${endFastAtTimeBind}`).getTime();
    };

    // TODO: rename
    const setTimestamp = (date: string, time: string) => {
        return new Date(
            `${startFastAtDateBind} ${startFastAtTimeBind}`,
        ).getTime();
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
        updateTimestamp();

        // const startFastGoal = <HTMLInputElement>document.getElementById('start-fast-goal');
        // if (startFastGoal) {
        //     startFastGoal.value = 16;
        // }

        const intervalFunction = () => {
            if (!activeFast || !activeFast.fromTs) {
                return;
            }

            fastingForMs = Date.now() - activeFast.fromTs;
            fastingForSeconds = Math.floor(fastingForMs / 1000);

            // how long the fast lasts / 8 hours
            activeFastProgress = (
                (fastingForMs / ((activeFast.goal ?? 16) * 60 * 60 * 1000)) *
                100
            ).toFixed(4);

            activeFastMissingHours =
                (fastingForMs -
                    new Date(
                        activeFast.fromTs + (activeFast.goal ?? 16) * 60 * 60 * 1000,
                    ).getTime()) /
                1000 /
                60 /
                60;
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

<svelte:head>
    <script src="https://accounts.google.com/gsi/client"></script>
</svelte:head>

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
                    <li>
                        from: {new Intl.DateTimeFormat('cs-CZ', {
                            timeStyle: 'medium',
                            dateStyle: 'medium',
                        }).format(new Date(activeFast.fromTs))}
                        <small>(utc: {new Date(activeFast.fromTs).toISOString()})</small>
                    </li>

                    <li>goal:{activeFast.goal} hours, mood: {moodToEmoji(activeFast.mood)}</li>
                    <li>
                        fasting progress: {activeFastProgress} %
                    </li>
                    <li>thats {(fastingForMs / 60 / 60 / 1000).toFixed(5)} hours</li>

                    <li>
                        goal meet:
                        {new Intl.DateTimeFormat('cs-CZ', {
                            timeStyle: 'medium',
                            dateStyle: 'medium',
                        }).format(
                            new Date(activeFast.fromTs + (activeFast.goal ?? 16) * 60 * 60 * 1000),
                        )}
                        <small
                            >(utc: {new Date(
                                activeFast.fromTs + (activeFast.goal ?? 16) * 60 * 60 * 1000,
                            ).toISOString()})</small
                        >
                    </li>

                    <li>
                        {#if activeFastMissingHours > 0}
                            You need to fast for {activeFastMissingHours} more hours
                        {:else}
                            Your goal is met! You are fasting for {Math.abs(activeFastMissingHours)}
                            extra hours
                        {/if}
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
                    name="end-fast-at-timestamp"
                    type="number"
                    id="end-fast-at-timestamp"
                    bind:value={endFastAtTimestampBind}
                />

                <input
                    name="end-fast-at-date"
                    type="date"
                    id="end-fast-at-date"
                    bind:value={endFastAtDateBind}
                    on:input={endFastInput}
                    on:change={updateTimestamp}
                />
                <input
                    name="end-fast-at-time"
                    type="time"
                    id="end-fast-at-time"
                    bind:value={endFastAtTimeBind}
                    on:input={endFastInput}
                    on:change={updateTimestamp}
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
                    name="start-fast-at-timestamp"
                    type="number"
                    id="start-fast-at-timestamp"
                    bind:value={startFastAtTimestampBind}
                />

                <input
                    name="start-fast-at-date"
                    type="date"
                    id="start-fast-at-date"
                    bind:value={startFastAtDateBind}
                    on:change={updateTimestamp}
                />
                <input
                    name="start-fast-at-time"
                    type="time"
                    id="start-fast-at-time"
                    bind:value={startFastAtTimeBind}
                    on:change={updateTimestamp}
                />

                <input
                    name="start-fast-goal"
                    type="number"
                    id="start-fast-goal"
                    bind:value={startFastGoalBind}
                />

                <ul>
                    <li>mood={moodBind}</li>
                    <li>
                        <input
                            type="radio"
                            id="mood100"
                            name="mood"
                            value="100"
                            bind:group={moodBind}
                        />
                        <label for="mood100">😄</label>
                    </li>
                    <li>
                        <input
                            type="radio"
                            id="mood50"
                            name="mood"
                            value="50"
                            bind:group={moodBind}
                        />
                        <label for="mood50">🙂</label>
                    </li>
                    <li>
                        <input
                            type="radio"
                            id="mood0"
                            name="mood"
                            value="0"
                            bind:group={moodBind}
                        />
                        <label for="mood0">😔</label>
                    </li>
                </ul>

                <b
                    >end time: startFastAtTimestampBind={startFastAtTimestampBind},
                    startFastGoalBind={startFastGoalBind} - {new Date(
                        startFastAtTimestampBind + startFastGoalBind * 1000 * 60 * 60,
                    )}</b
                >
                <button>send!</button>
            </form>
        {/if}

        <h2>Past Fasts:</h2>

        <ul>
            {#each finishedFasts as fast, i}
                <li>
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
                        id={fast._id}
                        from: <input type="date" value={formatDate(fast.fromTs)} />
                        <input type="time" value={formatTime(fast.fromTs)} />
                        <input type="number" value="fast.fromTs" bind:value={pastFastFromTs[i]} />

                        to: <input type="date" value={formatDate(fast.toTs)} />
                        <input type="time" value={formatTime(fast.toTs)} />

                        total time={(((fast.toTs ?? 0) - fast.fromTs) / 1000 / 60 / 60).toFixed(2)} hours

                        <button>edit</button>
                    </form>
                </li>
            {/each}
        </ul>
    {:else}
        <div class="box" style="max-width: 300px">
            To track your progress, log in with Google:
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


<p>ahoj :)</p>

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
