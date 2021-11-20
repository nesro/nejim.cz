<script context="module" lang="ts">
	// export const prerender = true;

	export async function load({ page, fetch, session }) {
		// console.log('SESSION:', { session }, ':SESSION END');

		let fasts;
		if (session.user) {
			fasts = await fetch(`/fasts.json?${page.query}`, { credentials: 'include' }).then((r) =>
				r.json()
			);
		}

		console.log('xxx', fasts);

		return {
			props: {
				user: session.user,
				...(!!fasts && { fasts })
			}
		};
	}
</script>

<script lang="ts">
	import type Fast from '../models/Fast';
	import { page, session } from '$app/stores';

	// import Counter from '$lib/Counter.svelte';
	export let user;
	export let fasts: Fast[];

	// last fast is missing "to"
	let activeFast = fasts?.length && !fasts[0].to;

	let fastDuration;

	let from = activeFast
		? new Date(fasts[0].from).toJSON().slice(0, 16)
		: new Date().toJSON().slice(0, 16);
	let to;

	// onMount(() => {
	// 	console.log({ from });

	// 	from = new Date();
	// 	// to.value = new Date();
	// 	// to.setDate(to.getDate() + 1);
	// });

	console.log({ fasts });

	const loop = () => {
		// console.log({ from, to });
		to = new Date().toJSON().slice(0, 16);

		fastDuration = new Date(to).getTime() - new Date(from).getTime();

		setTimeout(loop, 1000);
	};

	loop();
</script>

<svelte:head>
	<title>Nejim.cz - přerušovaný půst</title>
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

	<p>Karle, dáš si k telce ty <span class="red">čipsy</span>?</p>
	<p>Ne Mařeno. Já už <span class="green">nejim</span>. Nejim - tečka - cé zet.</p>
</section>

<section>
	{#if user}
		<p>user</p>
		<img src={user.picture} alt="avatar" style="border-radius: 50%; border: 1px solid black;" />
		<p>{JSON.stringify(user)}</p>

		<table style="border:1px solid black">
			<thead>
				<tr>
					<th>from</th>
					<th>to</th>
				</tr>
			</thead>
			<tbody>
				{#each fasts as fast}
					<tr>
						<td>{fast.from}</td>
						<td>{fast.to ?? 'running'}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{:else}
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
	{/if}
</section>

<section>
	<span>active fast = {activeFast}</span>

	{#if activeFast}
		<span>duration: {fastDuration}</span>
	{/if}
	<form action="/fast" method="post">
		<input bind:value={from} type="datetime-local" name="from" />
		<input bind:value={to} type="datetime-local" name="to" />
		<input type="submit" value="submit" />
	</form>
</section>

<style>
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
		padding: 0;
	}

	.welcome img {
		width: 1em;
		height: 1em;
	}
</style>
