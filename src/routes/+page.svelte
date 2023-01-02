<script lang="ts">
    import { enhance } from '$app/forms';
    import type { PageData, ActionData } from './$types';
    import { onMount } from 'svelte';
    import type Fast from '$lib/models/Fast';

    export let data: PageData;

    export let activeFast: Fast | null = null;

    export let activeFastProgress = '';

    export let date = new Date();

    let startFastAtTimestampBind: number;
    let startFastAtDateBind: string;
    let startFastAtTimeBind: string;

    let endFastAtTimestampBind: number;
    let endFastAtDateBind: string;
    let endFastAtTimeBind: string;

    let startFastGoalBind = 16;
    let fastingForMs: number;
    let activeFastMissingHours: number;

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

    const editFastUpdate = (fast: Fast): undefined => {
        fast.editFromTs = new Date(`${fast.editFromDate} ${fast.editFromTime}`).getTime();
        fast.editToTs = new Date(`${fast.editToDate} ${fast.editToTime}`).getTime();

        console.log(
            `update FASTFROMTS=${fast.fromTs} -> from=${fast.editFromDate} ${
                fast.editFromTime
            }, fast.editFromTs=${
                fast.editFromTs
            } (date.getTimezoneOffset()=${date.getTimezoneOffset()})`,
        );

        // to let svelte redraw what was just set
        finishedFasts = finishedFasts;

        return undefined;
    };

    let finishedFasts = fasts
        .filter((f) => f.to && f.toTs)
        .map((fast) => {
            fast.editFromTime = formatTime(fast.fromTs);
            fast.editFromDate = formatDate(fast.fromTs);
            fast.editToTime = formatTime(fast.toTs);
            fast.editToDate = formatDate(fast.toTs);

            fast.editFromTs = fast.fromTs;
            fast.editToTs = fast.toTs;

            return fast;
        });

    const updateTimestamp = () => {
        startFastAtTimestampBind = new Date(
            `${startFastAtDateBind} ${startFastAtTimeBind}`,
        ).getTime();

        endFastAtTimestampBind = new Date(`${endFastAtDateBind} ${endFastAtTimeBind}`).getTime();
    };

    let changeStartActiveFastAtTimestampBind: number;
    let changeStartActiveFastAtDateBind: string;
    let changeStartActiveFastAtTimeBind: string;
    const updateTimestampStartActiveFast = () => {
        changeStartActiveFastAtTimestampBind = new Date(
            `${changeStartActiveFastAtDateBind} ${changeStartActiveFastAtTimeBind}`,
        ).getTime();
    };

    const initCalHeatmap = (fasts: Fast[]) => {
        const cal = new (window as any).CalHeatMap();

        const data = [];

        for (const fast of fasts) {
            if (!fast.toTs) {
                continue;
            }

            const fastedForHours = (fast.toTs - fast.fromTs) / 60 / 60 / 1000;

            // console.log({ fastedFor });
            const value = fastedForHours > (fast.goal ?? 16) ? fastedForHours : 1;

            data.push({ date: Math.floor(fast.fromTs / 1000), value });
        }

        const start = new Date();
        start.setMonth(date.getMonth() - 1);

        const parser = function (data: { date: string; value: number }[]) {
            const stats: Record<string, number> = {};
            for (const d of data) {
                stats[d.date] = d.value;
            }
            return stats;
        };

        cal.init({
            start,
            range: 2,
            domain: 'month',
            data,
            highlight: 'now',

            afterLoadData: parser,
            // itemName: ['ppb', 'ppb'],

            subDomain: 'x_day',
            cellSize: 20,
            subDomainTextFormat: function (_date: unknown, value: number) {
                return value;
            },
            subDomainTitleFormat: { Date },

            domainGutter: 10,
            verticalOrientation: false,
            label: {
                position: 'top',
                rotate: '',
                offset: {
                    x: 15,
                    y: 10,
                },
            },
            legend: [16, 19, 21, 24],
            tooltip: true,
            displayLegend: false,
        });
    };

    const getMonth = (date: Date) => String(date.getMonth() + 1).padStart(2, '0');
    const getDay = (date: Date) => String(date.getDate()).padStart(2, '0');
    const getHours = (date: Date) => String(date.getHours()).padStart(2, '0');
    const getMinutes = (date: Date) => String(date.getMinutes()).padStart(2, '0');

    onMount(async () => {
        date.setSeconds(0);
        date.setMilliseconds(0);

        const startFastAtDate = <HTMLInputElement>document.getElementById('start-fast-at-date');
        if (startFastAtDate) {
            startFastAtDateBind = `${date.getFullYear()}-${getMonth(date)}-${getDay(date)}`;
        }
        const startFastAtTime = <HTMLInputElement>document.getElementById('start-fast-at-time');
        if (startFastAtTime) {
            startFastAtTimeBind = `${getHours(date)}:${getMinutes(date)}`;
        }
        const endFastAtDate = <HTMLInputElement>document.getElementById('end-fast-at-date');
        if (endFastAtDate) {
            endFastAtDateBind = `${date.getFullYear()}-${getMonth(date)}-${getDay(date)}`;
        }
        const endFastAtTime = <HTMLInputElement>document.getElementById('end-fast-at-time');
        if (endFastAtTime) {
            endFastAtTimeBind = `${getHours(date)}:${getMinutes(date)}`;
        }
        updateTimestamp();

        if (activeFast && activeFast.fromTs) {
            const startFastDate = new Date(activeFast.fromTs);
            const changeStartActiveFastAtDate = <HTMLInputElement>(
                document.getElementById('change-start-active-fast-at-date')
            );
            if (changeStartActiveFastAtDate) {
                changeStartActiveFastAtDateBind = `${startFastDate.getFullYear()}-${getMonth(
                    startFastDate,
                )}-${getDay(startFastDate)}`;
            }
            const changeStartActiveFastAtTime = <HTMLInputElement>(
                document.getElementById('change-start-active-fast-at-time')
            );
            if (changeStartActiveFastAtTime) {
                changeStartActiveFastAtTimeBind = `${getHours(startFastDate)}:${getMinutes(
                    startFastDate,
                )}`;
            }
            updateTimestampStartActiveFast();
        }

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

        initCalHeatmap(fasts);

        return () => {
            clearInterval(interval);
        };
    });
</script>

<svelte:head>
    <script src="https://accounts.google.com/gsi/client"></script>

    <script type="text/javascript" src="//d3js.org/d3.v3.min.js"></script>
    <script
        type="text/javascript"
        src="//cdn.jsdelivr.net/cal-heatmap/3.3.10/cal-heatmap.min.js"
    ></script>
    <link rel="stylesheet" href="//cdn.jsdelivr.net/cal-heatmap/3.3.10/cal-heatmap.css" />
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
        <div class="box" style="display: inline;">
            Hey {(data.user.name ?? '').split(' ')[0]}<img
                src={data.user.picture}
                alt="avatar"
                style="vertical-align:middle; margin: 0.5em; width: 2em; height: 2em; border-radius: 25%; border: 1px solid black;"
            />, you're logged in! Want to <a href="#todo">log out</a>?
        </div>

        {#if activeFast}
            <div class="box">
                <label for="file">Fast progress:</label>
                <progress id="file" value={activeFastProgress} max="100"
                    >{activeFastProgress}%</progress
                >
                <ul>
                    <li style="font-family:'Courier New', Courier, monospace">
                        from: {new Intl.DateTimeFormat('cs-CZ', {
                            timeStyle: 'medium',
                            dateStyle: 'medium',
                        }).format(new Date(activeFast.fromTs))}
                        <small
                            >(utc: {new Date(activeFast.fromTs).toISOString()}, ts: {activeFast.fromTs})</small
                        >
                    </li>
                    <li style="font-family:'Courier New', Courier, monospace">
                        goal:
                        {new Intl.DateTimeFormat('cs-CZ', {
                            timeStyle: 'medium',
                            dateStyle: 'medium',
                        }).format(
                            new Date(activeFast.fromTs + (activeFast.goal ?? 16) * 60 * 60 * 1000),
                        )}
                        <small
                            >(utc: {new Date(
                                activeFast.fromTs + (activeFast.goal ?? 16) * 60 * 60 * 1000,
                            ).toISOString()}, ts: {activeFast.fromTs +
                                (activeFast.goal ?? 16) * 60 * 60 * 1000})</small
                        >
                    </li>

                    <li>goal:{activeFast.goal} hours, mood: {moodToEmoji(activeFast.mood)}</li>

                    <li>
                        fasting progress: {activeFastProgress} %
                    </li>
                    <li>
                        thats {(fastingForMs / 60 / 60 / 1000).toFixed(5)} hours (fastingForMs={fastingForMs})
                    </li>

                    <li>
                        {#if fastingForMs > (activeFast.goal ?? 16) * 1000 * 60 * 60}
                            Your goal is met! You are fasting for {(
                                (fastingForMs - (activeFast.goal ?? 16) * 60 * 60 * 1000) /
                                60 /
                                60 /
                                1000
                            ).toFixed(5)}
                            extra hours
                        {:else}
                            You need to fast for {(
                                ((activeFast.goal ?? 16) * 60 * 60 * 1000 - fastingForMs) /
                                60 /
                                60 /
                                1000
                            ).toFixed(5)} more hours
                        {/if}
                    </li>
                </ul>
            </div>

            <form method="POST" action="?/change-start-active-fast">
                <h2>change start of the running fast</h2>

                <input type="hidden" name="edit-fast-id" id="edit-fast-id" value={activeFast._id} />

                <input
                    name="change-start-active-fast-at-timestamp"
                    type="number"
                    id="change-start-active-fast-at-timestamp"
                    bind:value={changeStartActiveFastAtTimestampBind}
                />

                <input
                    name="change-start-active-fast-at-date"
                    type="date"
                    id="change-start-active-fast-at-date"
                    bind:value={changeStartActiveFastAtDateBind}
                    on:change={updateTimestampStartActiveFast}
                />
                ({changeStartActiveFastAtDateBind})
                <input
                    name="change-start-active-fast-at-time"
                    type="time"
                    id="change-start-active-fast-at-time"
                    bind:value={changeStartActiveFastAtTimeBind}
                    on:change={updateTimestampStartActiveFast}
                />
                <button>send!</button>
            </form>

            <form method="POST" action="?/end-fast">
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
                    on:change={updateTimestamp}
                />
                <input
                    name="end-fast-at-time"
                    type="time"
                    id="end-fast-at-time"
                    bind:value={endFastAtTimeBind}
                    on:change={updateTimestamp}
                />
                <button>send!</button>
            </form>
        {:else}
            <form method="POST" action="?/fast-start">
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
                    <form method="POST" action="?/edit-fast">
                        <input
                            type="hidden"
                            name="edit-fast-id"
                            id="edit-fast-id"
                            value={fast._id}
                        />

                        id={fast._id}
                        from:
                        <input
                            type="date"
                            bind:value={fast.editFromDate}
                            on:change={editFastUpdate(fast)}
                        />
                        <input
                            type="time"
                            bind:value={fast.editFromTime}
                            on:change={editFastUpdate(fast)}
                        />
                        <input
                            type="number"
                            name="edit-fast-from-timestamp"
                            id="edit-fast-from-timestamp"
                            bind:value={fast.editFromTs}
                        />
                        (fromTs={fast.fromTs}) to:

                        <input
                            type="date"
                            bind:value={fast.editToDate}
                            on:change={editFastUpdate(fast)}
                        />
                        <input
                            type="time"
                            bind:value={fast.editToTime}
                            on:change={editFastUpdate(fast)}
                        />
                        <input
                            type="number"
                            name="edit-fast-to-timestamp"
                            id="edit-fast-to-timestamp"
                            bind:value={fast.editToTs}
                        />

                        total time={(((fast.toTs ?? 0) - fast.fromTs) / 1000 / 60 / 60).toFixed(2)} hours

                        <button>edit</button>

                        <!-- <br /><pre>{JSON.stringify(fast)}</pre> -->
                    </form>
                </li>
            {/each}
        </ul>

        <h2>heatmap</h2>
        <div id="cal-heatmap" />
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

<hr />
user="{JSON.stringify(data.user)}"

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
        /* justify-content: center;
        align-items: center; */
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
