<script>
	export let data;
	import ItemCard from '$lib/components/ItemCard.svelte';
</script>

<svelte:head>
	<title>Public Portal</title>
	<meta content="Public Portal" name="description" />
</svelte:head>
<div class="row">
	{#each data.books as book}
		<div class="col-md-4 col-sm-6">
			<ItemCard item={book} />
		</div>
	{/each}
</div>
