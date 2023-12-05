<script>
	export let data;
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<section>
	<h1>InfiLib</h1>

	<h2>The fast, beautiful, and user-friendly library software.</h2>
	<div class="my-5">
		<h5>Libraries currently using InfiLib:</h5>
		<ul>
			{#each data.libraries as library}
				<li><a href="/{library.slug}">{library.name}</a></li>
			{/each}
		</ul>
	</div>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}
</style>
