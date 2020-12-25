<svelte:head>
    <link
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet" />

    <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1"
        crossorigin="anonymous" />
</svelte:head>

<script>
    import Drawer from "./Drawer.svelte"
    import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';
    import IconButton from '@smui/icon-button';
    import { active, drawer } from '../store';
    
    let drawerValue
	const unsubscribeDrawer = drawer.subscribe(value => {
		drawerValue = value;
	});

    const drawerOpenAction = () => {
        drawer.set(!drawerValue)
    }

    const setActiveFromTopAppBar = (toActive) => {
        drawer.set(false)
        active.set(toActive)
        localStorage.setItem("active", toActive)
    }
</script>

<style>

</style>

<main>
    <TopAppBar variant="static" >
        <Row>
            <Section>
                <IconButton class="material-icons" on:click={drawerOpenAction}>menu</IconButton>
                <Title>nejim<img src="nejim.png" alt="nejim.cz logo" width="28" height="28" />cz</Title>
            </Section>
            <Section align="end" toolbar>
                <IconButton class="material-icons" aria-label="App" on:click={() => setActiveFromTopAppBar('stopwatch')}>schedule</IconButton>
                <IconButton class="material-icons" aria-label="Info" on:click={() => setActiveFromTopAppBar('info')}>info</IconButton>
                <IconButton class="material-icons" aria-label="History" on:click={() => setActiveFromTopAppBar('history')}>auto_graph</IconButton>
            </Section>
        </Row>
    </TopAppBar>

    <Drawer />
</main>