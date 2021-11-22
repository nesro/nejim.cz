<script lang="ts">
    // import Header from '$lib/header/Header.svelte';
    import '../app.css';
</script>

<!-- <Header /> -->

<main>
    <slot />
</main>

<footer>
    <ul style="line-height:1em;font-size:0.9em">
        <li>&copy; 2020-2021 nesro</li>
        <li>SvelteKit + Vercel + Mongo Altas = ❤️</li>
        <li>
            nejim.cz je open-source: <a
                href="https://github.com/nesro/nejim.cz"
                target="_blank"
                style="color:blue">https://github.com/nesro/nejim.cz</a
            > (zatim hodne wip 😹)
        </li>
        <li><a href="/privacy-policy">Zásady ochrany osobních údajů</a></li>
        <li><a href="/terms-of-service">Podmínky použití</a></li>
    </ul>
</footer>

<style>
    main {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 1rem;
        width: 100%;
        max-width: 1024px;
        margin: 0 auto;
        box-sizing: border-box;
    }

    footer {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 40px;
    }

    footer ul li {
        list-style: none;
        text-align: center;
    }

    @media (min-width: 480px) {
        footer {
            padding: 40px 0;
        }
    }
</style>
