<script>
	export let data;
	import { page } from '$app/stores';
	import TransactionTable from '$lib/components/TransactionTable.svelte';
</script>

<svelte:head>
	<title>Status</title>
</svelte:head>

<body>
	<div class="text-column text-center">
		<h1>Status of Borrows</h1>
	</div>
	<div class="btn-group-vertical w-100 my-3" role="group">
		<a class="btn btn-outline-dark px-5" class:active={$page.url.searchParams.size === 0} href="?"
			>All Circulation</a
		>
		<a
			class="btn btn-outline-dark"
			class:active={$page.url.searchParams.has('due')}
			href="?due=today">Due Today</a
		>
		<a class="btn btn-outline-dark">Blank</a>
		<a class="btn btn-outline-dark">Blank</a>
	</div>
	<div class="grid px-0 my-3">
		<div class="row align-items-start">
			<TransactionTable columns={data.columns} data={data.transactions}></TransactionTable>
		</div>
	</div>
</body>
