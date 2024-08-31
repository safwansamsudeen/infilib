<script>
	import Table from '$lib/components/Table.svelte';
	import CustomSelect from '$lib/components/CustomSelect.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import ItemCard from '$lib/components/ItemCard.svelte';
	import {date} from '$lib/helpers.js';

	function updateSearchParam(key, value) {
		let newUrl = new URL($page.url);
		newUrl.searchParams.set(key, value);
		return newUrl.href;
	}
	
	export let data;
	const tableMode = $page.url.searchParams.get('display') !== 'card';
	const type = $page.url.searchParams.get('show');

	function filter(e) {
		e.preventDefault();
		const formData = new FormData(e.target);
		let filterStr = '';
		for (let { id, type } of data.columns) {
			let val = formData.get(id);
			if (type === 'select') {
				if (!val) continue;
				filterStr += `&${id}=${JSON.parse(val).map(({ id }) => id)}`;
			} else if (type === 'number' || type === 'date') {
				let min = formData.get(id + '-min');
				let max = formData.get(id + '-max');
				if (!min && !max) continue;
				filterStr += `&${id}=${min},${max}`;
			}
		}
		const book = formData.get('show-book');
		const magazine = formData.get('show-magazine');
		if (book === 'on' || magazine === 'on') {
			filterStr += '&show=' + (book === 'on' ? 'book' : 'magazine');
		}

		bootstrap.Modal.getInstance(document.getElementById('filterModal')).hide();

		goto(
			`${window.location.href}${window.location.search.length ? '&' : '?'}${filterStr.slice(1)}`
		);
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
		<div
			class="modal fade"
			id="filterModal"
			tabindex="-1"
			aria-labelledby="filterModallLabel"
			aria-hidden="true"
		>
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title" id="filterModalLabel">Filter transactions</h5>
						<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
						></button>
					</div>
					<div class="modal-body">
						<form action="items" id="filter-form" on:submit={filter}>
							<div class="form-group mb-3">
								<div class="label">Type:</div>
								<div class="form-check">
									<input class="form-check-input" type="radio" name="show-book" id="book" />
									<label class="form-check-label" for="book">Book</label>
								</div>
								<div class="form-check">
									<input class="form-check-input" type="radio" name="show-magazine" id="magazine" />
									<label class="form-check-label" for="magazine">Magazine</label>
								</div>
							</div>
							{#each data.columns.sort((a, b) => b.type.charCodeAt() - a.type.charCodeAt()) as { id, name, type, opts }}
								<div class="form-group my-3">
									{#if ['select', 'date', 'number'].includes(type)}
										<label for={id}>{name}</label>
									{/if}
									{#if type === 'select'}
										<CustomSelect {id} {...{ ...opts, multiple: true, required: false }} />
									{:else if type === 'date'}
										<div class="row">
											<div class="col-6 small">
												Minimum: <input
													class="form-control"
													{id}
													name="{id}-min"
													type="date"
													value={$page.url.searchParams.get(id)?.split(',')[0]}
												/>
											</div>
											<div class="col-6 small">
												Maximum:
												<input
													class="form-control"
													{id}
													name="{id}-max"
													type="date"
													value={$page.url.searchParams.get(id)?.split(',')[1]}
												/>
											</div>
										</div>
									{:else if type === 'number'}
										<div class="row">
											<div class="col-6 small">
												<input
													class="form-control"
													placeholder="Minimum"
													name="{id}-min"
													type="number"
													value={$page.url.searchParams.get(id)?.split(',')[0] || ''}
													{...opts}
												/>
											</div>
											<div class="col-6 small">
												<input
													class="form-control"
													{id}
													placeholder="Maximum"
													name="{id}-max"
													type="number"
													value={$page.url.searchParams.get(id)?.split(',')[1] || ''}
													{...opts}
												/>
											</div>
										</div>
									{/if}
								</div>
							{/each}
						</form>
					</div>
					<div class="modal-footer">
						<div class="d-grid gap-2 my-3 w-100">
							<input form="filter-form" class="btn btn-outline-success" type="submit" value="Go!" />
						</div>
					</div>
				</div>
			</div>
		</div>
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
							<div
								class="input-group-text"
								style="border-bottom-right-radius: 0;
							border-top-right-radius: 0;"
							>
								<i class="bi bi-search"></i>
							</div>
						</div>
						<input class="form-control" name="search" placeholder="Search all items" type="text" />
					</div>
				</form>
				<form action="?/goto" method="POST">
					<div class="input-group mb-2">
						<div class="input-group-prepend">
							<div
								class="input-group-text"
								style="border-bottom-right-radius: 0;
							border-top-right-radius: 0;"
							>
								<i class="bi bi-arrow-right"></i>
							</div>
						</div>
						<input class="form-control" name="data" placeholder="Go" type="text" />
					</div>
				</form>
				<a class="" href="./items/search">Advanced Search</a>
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
		<div class="text-center">
			<button
				type="button"
				class="btn btn-outline-primary mb-3 w-25"
				data-bs-toggle="modal"
				data-bs-target="#filterModal"
			>
				Filter
			</button>
		</div>
		{#await data.items then { newItems, items, popularItems, searchResults, filterResults, shortcutResults }}
			{#if $page.url.searchParams.has('search-results') && !$page.url.searchParams.get('search-results')}
				<div class="text-center my-4">
					<div class="h4 text-warning">No Results Found</div>
					<a href="./items/search">Go back to Search</a>
				</div>
			{/if}
			{#if items}
				<h2>All {type || 'item'}s</h2>
				{#if tableMode}
					<Table
						actions={[
							['Details', 'items'],
							['Borrow', 'circulation/borrow', (row) => row.status !== 'IN' || row.reference]
						]}
						columns={data.columns}
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
										{#if item.status === 'IN' && !item.reference}
											<a class="btn btn-outline-dark" href="circulation/borrow/{item.id}/">Borrow</a
											>
										{/if}
									</div>
								</ItemCard>
							</div>
						{/each}
					</div>
				{/if}
			{:else if filterResults}
				<h2 class="d-inline">Your items (filtered)</h2>
				<form
					action="?/saveShortcut"
					method="POST"
					id="save-shortcut "
					class="float-end"
					on:submit={(e) => {
						const name = prompt('What do you want to name this shortcut?');
						if (!name) {
							e.preventDefault();
						}
						document.getElementById('shortcut-name').value = name;
					}}
				>
					<input type="hidden" name="search_str" value={$page.url.search} />
					<input type="hidden" name="name" id="shortcut-name" />
					<button type="submit" class="btn btn-outline-dark btn-sm">Save shortcut</button>
				</form>
				{#if tableMode}
					<Table
						actions={[
							['Details', 'items'],
							['Borrow', 'circulation/borrow', (row) => row.status !== 'IN' || row.reference]
						]}
						columns={data.columns}
						data={filterResults}
						id="filtered-table"
					/>
				{:else}
					<div class="row flex-row flex-nowrap overflow-scroll h-100">
						{#each filterResults as item}
							<div class="col-md-4 col-sm-6">
								<ItemCard {item}>
									<div class="btn-group" role="group" slot="actions" let:prop={item}>
										<a class="btn btn-outline-dark" href="items/{item.id}/">Edit</a>
										{#if item.status === 'IN' && !item.reference}
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
				{#if $page.url.searchParams.get('search')}
					<p>You searched for: <b>{$page.url.searchParams.get('search')}</b></p>
				{:else}
					<p>Your advanced search results:</p>
				{/if}
				{#if tableMode}
					<Table
						actions={[
							['Details', 'items'],
							['Borrow', 'circulation/borrow', (row) => row.status !== 'IN' || row.reference]
						]}
						columns={data.columns}
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
										{#if item.status === 'IN' && !item.reference}
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
				{#each Object.entries(shortcutResults) as [name, results]}
					<div class="p-2 my-2">
						<h2>{name}</h2>
						{#if tableMode}
							<Table
								actions={[
									['Details', 'items'],
									['Borrow', 'circulation/borrow', (row) => row.status !== 'IN' || row.reference]
								]}
								columns={data.columns}
								data={results}
								id="shortcut-{name.replace(' ', '-')}-table"
							/>
						{:else}
							<div class="row flex-row flex-nowrap overflow-scroll h-100">
								{#each results as item}
									<div class="col-md-4 col-sm-6">
										<ItemCard {item}>
											<div class="btn-group" role="group" slot="actions" let:prop={item}>
												<a class="btn btn-outline-dark" href="items/{item.id}/">Edit</a>
												{#if item.status === 'IN' && !item.reference}
													<a class="btn btn-outline-dark" href="circulation/borrow/{item.id}/"
														>Borrow</a
													>
												{/if}
											</div>
										</ItemCard>
									</div>
								{/each}
							</div>
						{/if}
					</div>
				{/each}
				<div class="p-2 my-2">
					<h2>Popular</h2>
					<p>These {type || 'item'}s are borrowed very frequently at your library.</p>
					{#if tableMode}
						<Table
							actions={[
								['Details', 'items'],
								['Borrow', 'circulation/borrow', (row) => row.status !== 'IN' || row.reference]
							]}
							columns={data.columns}
							data={popularItems}
							id="popular-item-table"
						/>
					{:else}
						<div class="row flex-row flex-nowrap overflow-scroll">
							{#each popularItems as item}
								<div class="col-md-4 col-sm-6">
									<ItemCard {item}>
										<div class="my-2 px-1 card-text small" slot="details">{item.transactions.length} borrow{item.transactions.length  === 1 ? '' : 's'}</div>
										<div slot="actions">
											<div class="btn-group" role="group" let:prop={item}>
												<a class="btn btn-outline-dark" href="items/{item.id}/">Edit</a>
												{#if item.status === 'IN' && !item.reference}
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
				<div class="p-2 my-2">
					<h2>Recent Arrivals</h2>
					<p>The {type || 'item'}s you've added most recently to your library.</p>
					{#if tableMode}
						<Table
							actions={[
								['Details', 'items'],
								['Borrow', 'circulation/borrow', (row) => row.status !== 'IN' || row.reference]
							]}
							columns={data.columns}
							data={newItems}
							id="new-item-table"
						/>
					{:else}
						<div class="row flex-row flex-nowrap overflow-scroll h-100">
							{#each newItems as item}
								<div class="col-md-4 col-sm-6">
									<ItemCard {item}>
										<div class="my-2 px-1 card-text small" slot="details">{date(item.purchased_on, true, true)}</div>
										<div slot="actions">
											<div class="btn-group" role="group" let:prop={item}>
												<a class="btn btn-outline-dark" href="items/{item.id}/">Edit</a>
												{#if item.status === 'IN' && !item.reference}
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
