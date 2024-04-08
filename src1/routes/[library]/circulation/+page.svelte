<script>
	export let data;
	import { date } from '$lib/helpers';
	import { page } from '$app/stores';
	import TransTable from '$lib/components/TransTable.svelte';
	import dayjs from 'dayjs';

	const since = $page.url.searchParams.get('since');
	const until = $page.url.searchParams.get('until');
	const due = $page.url.searchParams.get('due');
	let filterable = false;
</script>

<svelte:head>
	<title>Status of Borrows</title>
	<meta content="View transactions" name="description" />
</svelte:head>

<body>
	<div class="text-column text-center">
		<h1>Status of Borrows</h1>
	</div>
	<div class="col-auto mb-3">
		<button
			type="button"
			class="btn btn-outline-primary float-end"
			data-bs-toggle="modal"
			data-bs-target="#filterModal"
		>
			Filter
		</button>
		{#if due || until || since}
			<a class="d-block" href="circulation">Clear all filters</a>
		{/if}
		{#if due !== 'today'}
			<a class="d-block" href="?due=today">Due Today</a>
		{/if}
	</div>

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
					<form action="circulation" id="filter-form">
						<div class="form-group my-3">
							<label for="since">Since</label>
							<input
								class="form-control"
								name="since"
								id="since"
								type="date"
								value={since || date(dayjs().subtract(1, 'month'))}
							/>
						</div>
						<div class="form-group my-3">
							<label for="since">Until</label>
							<input class="form-control" name="until" type="date" value={until || date(dayjs())} />
						</div>
					</form>
				</div>
				<div class="modal-footer">
					<div class="d-grid gap-2 my-3 w-100">
						<input
							form="filter-form"
							class="btn btn-outline-success"
							type="submit"
							value="Go!"
							data-bs-dismiss="modal"
						/>
					</div>
				</div>
			</div>
		</div>
	</div>

	{#if due}
		Showing all the transactions that are <b>due today</b>.
	{:else if !since && !until}Showing all the transactions this month.
	{:else}Showing all the transactions since <b>{since}</b> until <b>{until || 'today'}</b>.{/if}
	<div class="grid px-0 my-3">
		<div class="row align-items-start">
			{#await data.streamed.transactions then { columns, transactions }}
				{#key data}
					<TransTable {columns} data={transactions} />
				{/key}
			{:catch error}
				<p>{error.message}</p>
			{/await}
		</div>
	</div>
</body>
