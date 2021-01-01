<script>
    import { setStore} from '../store.js'
  
    let password = ''
    let email = ''
    let error
    let user
  
    const handleLogin = async () => {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
  
      const parsed = await response.json()
  
      console.log(parsed)

      if (parsed.token) {
        //setStore('authToken', parsed.token)
        user = parsed.user
      } else {
        error = parsed.error
      }
    }
</script>
  
 <form on:submit|preventDefault="{handleLogin}" method="post">
    <label>
      Email:
      <input type="email" bind:value="{email}" />
    </label>
    <label>
      Password:
      <input type="password" bind:value="{password}" />
    </label>
    <button type="submit">Login</button>
 </form>
  
  {#if error}
    <p>{error}</p>
  {/if}

  {#if user}
  <h2>user</h2>
  <p>{user}</p>
{/if}