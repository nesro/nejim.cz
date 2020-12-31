<script>
	import { onMount, onDestroy } from 'svelte'
	import Info from './components/Info.svelte'
	import TopAppBar from './components/TopAppBar.svelte'
	import FastingApp from './components/FastingApp.svelte'
	import FastImport from './components/FastImport.svelte'
	import FastHistory from './components/FastHistory.svelte'
	import Settings from './components/Settings.svelte'
	import Login from './components/Login.svelte'
	import User from './components/User.svelte'

	import { active } from './store'
	import FastSave from './components/FastSave.svelte';

	const cookieConsent = () => {
		const options = {
			cookieName: 'nejim_gdpr',
			heading: 'Nejim.cz GDPR upozornění',
			description: 'Nejim.cz používá Google Analytics, které Vám do prohlížeče uloží sušenky.',
			acceptLabel: 'Přijímam',
			settingsLabel: 'Chci si nastavit',
			closeLabel: 'Zavři',
			choices: {
				necessary: {
					label: 'Required cookies',
					description: "These can't be turned off as they are used to control all the other cookies",
					value: true
				},
				analytics: false
			},
			showOnInit: true,
			categories: {
				analytics: function() {
				console.log('No analytics cookies specified')
				},
				tracking: function() {
				console.log('No tracking cookies specified')
				},
				marketing: function() {
				console.log('No marketing cookies specified')
				},
				necessary: function() {
				console.log('No necessary cookies specified')
				}
			}
		}
		GdprConsent.attachBanner(document.body, options)
	}

	let activeValue
	const activeUnsubscribe = active.subscribe(value => {
		activeValue = value;
	});

	onMount(() => {
		window.dataLayer = window.dataLayer || [];
		function gtag(){dataLayer.push(arguments);}
		gtag('js', new Date());

		gtag('config', 'G-LK4FPFX2XK');
	})

	onDestroy(activeUnsubscribe)

</script>

<svelte:head>
  <title>nejim.cz - Appka na přerušovaný půst</title>

	<!-- Global site tag (gtag.js) - Google Analytics -->
	<script async src="https://www.googletagmanager.com/gtag/js?id=G-LK4FPFX2XK"></script>

	<link rel="stylesheet" type="text/css" href="//unpkg.com/@beyonk/gdpr-cookie-consent-banner/dist/style.css">
	<script src="//unpkg.com/@beyonk/gdpr-cookie-consent-banner/dist/browser/bundle.min.js" on:load={cookieConsent}></script>
</svelte:head>

<main>
	<TopAppBar />

	<div style="margin: 1em auto; max-width: 768px;">
		{#if activeValue === 'info'}
			<Info />
		{:else if activeValue === 'stopwatch'}
			<FastingApp />
		{:else if activeValue === 'history'}
			<FastHistory />
		{:else if activeValue === 'fastSave'}
			<FastSave />
		{:else if activeValue === 'settings'}
			<Settings />
		{:else if activeValue === 'import'}
			<FastImport />
		{:else if activeValue === 'login'}
			<Login />
		{:else if activeValue === 'user'}
			<User />
		{/if}
	</div>


	<!-- footer>author: {author}</footer> -->
</main>

<style>
	main {
		text-align: center;
		max-width: 240px;
		margin: 0 auto;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>