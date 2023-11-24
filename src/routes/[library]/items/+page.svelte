<script>
	import Table from '$lib/components/Table.svelte';
	import AddForm from '$lib/components/AddForm.svelte';
	import { findValue } from '$lib/helpers.js';
	import { page } from '$app/stores';

	export let data;

	let publishers = findValue(data.columns, 'publisher').opts.items,
		authors = findValue(data.columns, 'authors')?.opts.items || [],
		categories = findValue(data.columns, 'categories').opts.items,
		languages = findValue(data.columns, 'languages').opts.items;
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
		<AddForm
			columns={data.columns}
			id="item"
			inputColumns={data.inputColumns}
			scanner={{ publishers, authors, categories, languages }}
			type="book"
		></AddForm>
		{#key data}
			<Table
				actions={[
					['Details', 'items'],
					['Borrow', 'circulation/borrow', (row) => row.status !== 'IN' || row.reference]
				]}
				columns={data.columns}
				promise={data.items}
				updateUrl="items"
				idColumn="acc_no"
			/>
		{/key}
	</div>
</body>
