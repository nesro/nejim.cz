<svelte:head>
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">

    <link
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css"
    rel="stylesheet"
    integrity="sha384-giJF6kkoqNQ00vy+HMDP7azOuL0xtbfIcaT9wjKHr8RbDVddVHyTfAAsrekwKmP1"
    crossorigin="anonymous"/>
</svelte:head>

<script>
    import TopAppBar, { Row, Section, Title } from '@smui/top-app-bar';
    import IconButton from '@smui/icon-button';
    
    function doSomething() {
        alert('something');
    }
</script>

<style>

</style>

<main>
    <TopAppBar variant="static" >
        <Row>
            <Section>
                <!-- <IconButton class="material-icons" on:click={doSomething}>menu</IconButton>-->
                <Title>nejim.cz</Title>
            </Section>
            <Section align="end" toolbar>
                <IconButton class="material-icons" aria-label="App" on:click={() => alert('work in progress :)')}>schedule</IconButton>
                <IconButton class="material-icons" aria-label="Info" on:click={() => alert('work in progress :)')}>info</IconButton>
            </Section>
        </Row>
    </TopAppBar>
</main>