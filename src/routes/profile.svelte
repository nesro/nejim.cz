<script context="module" lang="ts">
	export async function load({ session }) {
		if (!session.userId) {
			return {
				status: 302,
				redirect: '/'
			};
		}

		console.log('SESSION:', { session }, ':SESSION END');

		return {
			props: {
				// userId: session.userId,
				user: session.user
			}
		};
	}
</script>

<script lang="ts">
	// export let userId;
	export let user;
</script>

<section>
	<h1>Hello, {user.name}</h1>
	<img src={user.picture} alt="avatar" style="border-radius: 50%; border: 1px solid black;" />
	<pre>{JSON.stringify(user)}</pre>
</section>
