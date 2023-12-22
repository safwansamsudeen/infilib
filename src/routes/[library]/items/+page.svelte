<script>
	import Table from '$lib/components/Table.svelte';
	import { page } from '$app/stores';
	import ItemCard from '$lib/components/ItemCard.svelte';

	export let data;
	const tableMode = $page.url.searchParams.get('display') !== 'card';
	const type = $page.url.searchParams.get('show');

	function updateSearchParam(key, value) {
		let newUrl = new URL($page.url);
		newUrl.searchParams.set(key, value);
		return newUrl.href;
	}
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
		<div class="row justify-content-between mb-5">
			<div class="col-auto">
				<a class="d-block" href="items/add">Add an item</a>

				<a class="d-block" href={updateSearchParam('display', tableMode ? 'card' : 'table')}
					>Shift to {tableMode ? 'card' : 'table'} display</a
				>
				<a class="d-block" href={updateSearchParam('all', 'true')}>View all items</a>
				{#if $page.url.searchParams.get('all') || $page.url.searchParams.get('search')}
					<a class="d-block" href="items">Back to normal view</a>
				{/if}
			</div>
			<div class="col-auto">
				<form action="items">
					<div class="input-group mb-2">
						<div class="input-group-prepend">
							<div class="input-group-text"><i class="bi bi-search"></i></div>
						</div>
						<input class="form-control" name="search" placeholder="Search all items" type="text" />
					</div>
				</form>
			</div>
		</div>
		<div class="btn-group-vertical w-100 mb-3" role="group">
			<a class="btn btn-outline-dark" class:active={!type} href="?">All Items</a>
			<a
				class="btn btn-outline-dark"
				class:active={type === 'book'}
				href={updateSearchParam('show', 'book')}>Books</a
			>
			<a
				class="btn btn-outline-dark"
				class:active={type === 'magazine'}
				href={updateSearchParam('show', 'magazine')}>Magazines</a
			>
		</div>
		{#await data.streamed.items then { columns, newItems, items, popularItems, searchResults }}
			{#if items}
				<h2>All {type || 'item'}s</h2>
				{#if tableMode}
					<Table
						actions={[
							['Details', 'items'],
							['Borrow', 'circulation/borrow', (row) => row.status !== 'IN' || row.reference]
						]}
						{columns}
						data={items}
						id="new-item-table"
					/>
				{:else}
					<div class="row flex-row flex-nowrap overflow-scroll h-100">
						{#each items as item}
							<div class="col-md-4 col-sm-6">
								<ItemCard {item}>
									<div class="btn-group" role="group" slot="actions" let:prop={item}>
										<a class="btn btn-outline-dark" href="items/{item.id}/">Edit</a>
										{#if item.status === 'IN' && item.reference}
											<a class="btn btn-outline-dark" href="circulation/borrow/{item.id}/">Borrow</a
											>
										{/if}
									</div>
								</ItemCard>
							</div>
						{/each}
					</div>
				{/if}
			{:else if searchResults}
				<h2>Search Results</h2>
				<p>You searched for: <b>{$page.url.searchParams.get('search')}</b></p>
				{#if tableMode}
					<Table
						actions={[
							['Details', 'items'],
							['Borrow', 'circulation/borrow', (row) => row.status !== 'IN' || row.reference]
						]}
						{columns}
						data={searchResults}
						id="new-item-table"
					/>
				{:else}
					<div class="row flex-row flex-nowrap overflow-scroll h-100">
						{#each searchResults as item}
							<div class="col-md-4 col-sm-6">
								<ItemCard {item}>
									<div class="btn-group" role="group" slot="actions" let:prop={item}>
										<a class="btn btn-outline-dark" href="items/{item.id}/">Edit</a>
										{#if item.status === 'IN' && item.reference}
											<a class="btn btn-outline-dark" href="circulation/borrow/{item.id}/">Borrow</a
											>
										{/if}
									</div>
								</ItemCard>
							</div>
						{/each}
					</div>
				{/if}
			{:else}
				<div class="p-2 my-2" style="border: 2px dotted black; border-radius: 5px;">
					<h3>Popular Items</h3>
					<p>These {type || 'item'}s are borrowed very frequently at your library.</p>
					{#if tableMode}
						<Table
							actions={[
								['Details', 'items'],
								['Borrow', 'circulation/borrow', (row) => row.status !== 'IN' || row.reference]
							]}
							{columns}
							data={popularItems}
							id="popular-item-table"
						/>
					{:else}
						<div class="row flex-row flex-nowrap overflow-scroll">
							{#each popularItems as item}
								<div class="col-md-4 col-sm-6">
									<ItemCard {item}>
										<div slot="actions">
											<div class="card-text small">{item.transactions.length} borrows</div>
											<div class="btn-group" role="group" let:prop={item}>
												<a class="btn btn-outline-dark" href="items/{item.id}/">Edit</a>
												{#if item.status === 'IN' && item.reference}
													<a class="btn btn-outline-dark" href="circulation/borrow/{item.id}/"
														>Borrow</a
													>
												{/if}
											</div>
										</div>
									</ItemCard>
								</div>
							{/each}
						</div>
					{/if}
				</div>
				<div class="p-2 my-2" style="border: 2px dotted black; border-radius: 5px;">
					<h3>Recent Arrivals</h3>
					<p>The {type || 'item'}s you've added most recently to your library.</p>
					{#if tableMode}
						<Table
							actions={[
								['Details', 'items'],
								['Borrow', 'circulation/borrow', (row) => row.status !== 'IN' || row.reference]
							]}
							{columns}
							data={newItems}
							id="new-item-table"
						/>
					{:else}
						<div class="row flex-row flex-nowrap overflow-scroll h-100">
							{#each newItems as item}
								<div class="col-md-4 col-sm-6">
									<ItemCard {item}>
										<div slot="actions">
											<div class="card-text small">{item.purchased_on}</div>
											<div class="btn-group" role="group" let:prop={item}>
												<a class="btn btn-outline-dark" href="items/{item.id}/">Edit</a>
												{#if item.status === 'IN' && item.reference}
													<a class="btn btn-outline-dark" href="circulation/borrow/{item.id}/"
														>Borrow</a
													>
												{/if}
											</div>
										</div>
									</ItemCard>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			{/if}
		{:catch error}
			<p>{error.message}</p>
		{/await}
	</div>
</body>
