<script>
	export let name;
</script>

<main>
	<h1>{name}</h1>
	<h2>Aplikace pro přeušovaný půst</h2>
	<p>Work in progress! See the code for more info: <a target="_blank" href="https://github.com/nesro/nejim.cz">https://github.com/nesro/nejim.cz</a></p>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>