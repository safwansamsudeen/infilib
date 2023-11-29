<script>
	import Table from '$lib/components/Table.svelte';
	import Form from '$lib/components/Form.svelte';
	import { capitalize, findValue, setBookDetails } from '$lib/helpers.js';
	import { page } from '$app/stores';
	import Scanner from '$lib/components/Scanner.svelte';
	import Input from '$lib/components/Input.svelte';

	export let data;
	let scannerVisible = false;
	function obtainOptions(columns, name) {
		return findValue(columns, name)?.opts?.items || [];
	}

	let type = 'book';
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
		{#await data.streamed.items then { itemColumns, otherColumns, items }}
			<Form columns={itemColumns} id="item">
				<div class="d-grid gap-2" slot="options">
					<div class="btn-group" role="group">
						{#each Object.entries(otherColumns) as [name]}
							<input
								type="radio"
								class="btn-check"
								name="type"
								id={name}
								value={name}
								autocomplete="off"
								bind:group={type}
								form="create-form"
							/>
							<label class="btn btn-outline-primary" for={name}>{capitalize(name)}</label>
						{/each}
					</div>
				</div>
				<div class="form-check form-switch my-3" slot="scanner">
					<input
						bind:checked={scannerVisible}
						class="form-check-input"
						id="scanner-visible"
						role="switch"
						type="checkbox"
					/>
					<label class="form-check-label" for="scanner-visible">Show scanner</label>

					<input type="hidden" name="type" bind:value={type} form="create-form" />
					{#if scannerVisible}
						<Scanner
							publishers={obtainOptions(itemColumns, 'publishers')}
							authors={obtainOptions(itemColumns, 'authors')}
							categories={obtainOptions(itemColumns, 'categories')}
							languages={obtainOptions(itemColumns, 'languages')}
						/>
					{:else}
						<form
							class="mb-4"
							on:submit={(e) =>
								{
								e.preventDefault();
									setBookDetails(
									+e.target[0].value.replaceAll('-', ''),
									obtainOptions(itemColumns, 'publishers'),
									obtainOptions(itemColumns, 'authors'),
									obtainOptions(itemColumns, 'categories'),
									obtainOptions(itemColumns, 'languages')
								)
								}}
						>
							<Input name="Search by ISBN" id="search"on:change />
							<button class="btn btn-success my-3" type="submit">Search</button>
						</form>
					{/if}
				</div>
				<svelte:fragment slot="options-extra-columns">
					<h3 class="text-center">{capitalize(type)}</h3>
					{#each otherColumns[type] as column}
						<Input {...column} />
					{/each}
				</svelte:fragment>
			</Form>
			{#key data}
				<Table
					actions={[
						['Details', 'items'],
						['Borrow', 'circulation/borrow', (row) => row.status !== 'IN' || row.reference]
					]}
					columns={itemColumns}
					data={items}
					updateUrl="items"
					idColumn="acc_no"
				/>
			{/key}
		{:catch error}
			<p>{error.message}</p>
		{/await}
	</div>
</body>
