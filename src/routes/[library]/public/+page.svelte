<script>
	export let data;
	import ItemCard from '$lib/components/ItemCard.svelte';
	import { flatten } from '$lib/helpers.js';

	let user_id = data.user.id;
</script>

<svelte:head>
	<title>Public Portal</title>
	<meta content="Public Portal" name="description" />
</svelte:head>
<div class="row">
	{#await data.books}
		<p>Loading...</p>
	{:then books}
		{#each flatten(books, 'book') as book}
			<div class="col-md-4 col-sm-6">
				<ItemCard item={book} {user_id} />
			</div>
		{/each}
	{:catch}
		There was an error!
	{/await}
</div>
