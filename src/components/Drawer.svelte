<script>
    import Drawer, { Content, Header, Title, Subtitle } from '@smui/drawer';
    import List, { Item, Text } from '@smui/list';
    import { active, drawer } from '../store';
    
    let myDrawer

    let activeValue
	const unsubscribeActive = active.subscribe(value => {
		activeValue = value;
    });
    
    let drawerValue
	const unsubscribeDrawer = drawer.subscribe(value => {
		drawerValue = value;
	});

    const setActiveFromDrawer = (toActive) => {
        drawer.set(false)
        active.set(toActive)
        localStorage.setItem("active", toActive)
    }
</script>

<main>
    <div>
        <div class="drawer-container">
          <Drawer variant="dismissible" bind:this={myDrawer} bind:open={drawerValue}>
            <Header>
              <Title>nejim.cz</Title>
              <Subtitle>Menu</Subtitle>
            </Header>
            <Content>
              <List>
                <Item href="javascript:void(0)" on:click={() => setActiveFromDrawer('stopwatch')} activated={activeValue === 'stopwatch'}>
                  <Text>Aplikace</Text>
                </Item>
                <Item href="javascript:void(0)" on:click={() => setActiveFromDrawer('info')} activated={activeValue === 'info'}>
                  <Text>Informace</Text>
                </Item>
                <Item href="javascript:void(0)" on:click={() => setActiveFromDrawer('history')} activated={activeValue === 'history'}>
                  <Text>Historie</Text>
                </Item>
                <Item href="javascript:void(0)" on:click={() => setActiveFromDrawer('import')} activated={activeValue === 'import'}>
                  <Text>Import</Text>
                </Item>
                <Item href="javascript:void(0)" on:click={() => setActiveFromDrawer('settings')} activated={activeValue === 'settings'}>
                  <Text>Nastavení</Text>
                </Item>
                <Item href="javascript:void(0)" on:click={() => setActiveFromDrawer('login')} activated={activeValue === 'login'}>
                  <Text>Přihlášení</Text>
                </Item>
                <Item href="javascript:void(0)" on:click={() => setActiveFromDrawer('user')} activated={activeValue === 'user'}>
                  <Text>Můj profil</Text>
                </Item>
              </List>
            </Content>
          </Drawer>

        </div>
      </div>

</main>


