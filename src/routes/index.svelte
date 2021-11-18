<script context="module" lang="ts">
	// export const prerender = true;

	export async function load({ session }) {
		console.log('SESSION:', { session }, ':SESSION END');

		return {
			props: {
				user: session.user
			}
		};
	}
</script>

<script lang="ts">
	// import Counter from '$lib/Counter.svelte';
	export let user;
</script>

<svelte:head>
	<title>Home</title>
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
		<img src={user.picture} alt="avatar" style="border-radius: 50%; border: 1px solid black;" />
		<p>{JSON.stringify(user)}</p>
	{:else}
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
