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
	<div class="col-auto">
		{#if due || until || since}
			<a class="d-block" href="circulation">Back to normal view</a>
		{/if}
	</div>
	<div class="btn-group-vertical w-100 my-3" role="group">
		<a class="btn btn-outline-dark" class:active={due === 'today'} href="?due=today">Due Today</a>
	</div>
	<div class="row">
		<div class="form-check form-switch mb-3">
			<input
				bind:checked={filterable}
				class="form-check-input form-switch me-2"
				id="scanner-visible"
				role="switch"
				type="checkbox"
			/>
			<label class="form-check-label" for="scanner-visible">Filter</label>
		</div>

		{#if filterable}
			<form action="circulation" class="row mb-3 col-12 col-md-6">
				<div class="form-group col-5">
					<label for="since">Since</label>
					<input
						class="form-control"
						name="since"
						id="since"
						type="date"
						value={since || date(dayjs().subtract(1, 'month'))}
					/>
				</div>
				<div class="form-group col-5">
					<label for="since">Until</label>
					<input class="form-control" name="until" type="date" value={until || date(dayjs())} />
				</div>
				<div class="form-group col-2">
					<input
						class="btn btn-outline-dark"
						type="submit"
						value="Go!"
						style="width: 48px;height: 38px;"
					/>
				</div>
			</form>
		{/if}
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
