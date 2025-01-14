<script>
	import { onMount } from 'svelte';

	let token = $state();

	onMount(() => {
		// Fetch `token` from url search params
		const params = new URLSearchParams(window.location.search);
		const queryParams = Object.fromEntries(params.entries());
		console.log('🚀 ~ token:', queryParams.token); // * Successful
		token = queryParams.token;
	});
</script>

<div class="text-green-700">Login successful</div>

<br />
<br />

<h2>Token</h2>
{token}
