<script>
    import { onMount } from 'svelte'
    //import { authToken} from '../store.js'

    let user
    let error

    const loadUser = async () => {
        // if (!$authToken) {
        //     error = 'no token'
        //     return
        // }

        //const bearer = 'Bearer ' + $authToken
        const response = await fetch('/api/users/me', {
        credentials: 'include',
        headers: {
            //'Authorization': bearer,
            'Content-Type': 'application/json',
            Accept: 'application/json',
        }
      })
  
      const parsed = await response.json()

      //console.log(parsed)
      
      if (parsed.name) {
        
        user = parsed.name
      } else {
        error = parsed.error
      }
    }

    onMount(loadUser)
</script>

{#if user}
    Jméno2: {user}
{:else}
    <p>Načítám uživatele...</p>
{/if}

{#if error}
<p>Error: {error}</p>
{/if}