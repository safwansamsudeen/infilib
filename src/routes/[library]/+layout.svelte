<script>
	import Header from '$lib/components/Header.svelte';
	import { navigating } from '$app/stores'
	export let data;
</script>
        <div class="app">
	<Header library={data.library_name} user={data.user} />
	<main style="max-width: 85%;">
        {#if $navigating}
            <div class="spinner-border d-flex align-self-center my-5" role="status">
              <span class="sr-only d-none">Loading...</span>
            </div>
      {:else}
		<slot />
      {/if}
	</main>
</div>


<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>
