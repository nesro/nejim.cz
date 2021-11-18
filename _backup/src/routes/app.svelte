<script context="module">
	// import { browser, dev } from '$app/env';

	// we don't need any JS on this page, though we'll load
	// it in dev so that we get hot module replacement...
	// export const hydrate = dev;

	// ...but if the client-side router is already loaded
	// (i.e. we came here from elsewhere in the app), use it
	// export const router = browser;

	// since there's no dynamic data here, we can prerender
	// it so that it gets served as a static asset in prod
	// export const prerender = true;

	export async function load({ session }) {
		// if (!session.userId) {
		// 	return {
		// 		status: 302,
		// 		redirect: '/'
		// 	};
		// }

		console.log('SESSION:', { session }, ':SESSION END');

		return {
			props: {
				user: session.user
			}
		};
	}
</script>

<script lang="ts">
	export let user;
</script>

<svelte:head>
	<title>About</title>
	<script src="https://accounts.google.com/gsi/client" async defer></script>
</svelte:head>

<div class="content">
	<h1>Aplikace</h1>
	<p>Nejim.cz je hlavně moje kratochvíle a hraní si s frameworkem SvelteKit.</p>
	<p>Rozhodl jsem se to přepsat od základu, takže tady zase nic není. :)</p>
	<p>
		<a href="https://github.com/nesro/nejim.cz" target="_blank">https://github.com/nesro/nejim.cz</a
		>
	</p>

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
</div>

<style>
	.content {
		width: 100%;
		max-width: var(--column-width);
		margin: var(--column-margin-top) auto 0 auto;
	}
</style>
