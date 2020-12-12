<svelte:head>
  <title>nejim.cz</title>
</svelte:head>

<script>
	import Info from "./components/Info.svelte";
	import TopAppBar from "./components/TopAppBar.svelte";

	export let author;
</script>

<main>
	<TopAppBar />


	<div style="margin: 2.5em auto; max-width: 768px;">
	<Info />
	</div>

	<!-- footer>author: {author}</footer> -->

</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>