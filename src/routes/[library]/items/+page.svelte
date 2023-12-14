<script>
	import Table from '$lib/components/Table.svelte';
	import { findValue, setBookDetails } from '$lib/helpers.js';
	import { page } from '$app/stores';
	import Scanner from '$lib/components/Scanner.svelte';

	export let data;
</script>

<svelte:head>
	<title>Items</title>
	<meta content="View, edit, and manage all the items in your library." name="description" />
</svelte:head>

<div class="text-column text-center">
	<h1>Manage Items</h1>
</div>

<body>
	<div class="container">
		<a href="items/add">Add an item</a>
		<div class="btn-group-vertical w-100 my-3" role="group">
			<a class="btn btn-outline-dark" class:active={$page.url.searchParams.size === 0} href="?"
				>All Items</a
			>
			<a
				class="btn btn-outline-dark"
				class:active={$page.url.searchParams.get('show') === 'book'}
				href="?show=book">Books</a
			>
			<a
				class="btn btn-outline-dark"
				class:active={$page.url.searchParams.get('show') === 'magazine'}
				href="?show=magazine">Magazines</a
			>
		</div>
		{#await data.streamed.items then { columns, items }}
			{#key data}
				<Table
					actions={[
						['Details', 'items'],
						['Borrow', 'circulation/borrow', (row) => row.status !== 'IN' || row.reference]
					]}
					{columns}
					data={items}
				/>
			{/key}
		{:catch error}
			<p>{error.message}</p>
		{/await}
	</div>
</body>
