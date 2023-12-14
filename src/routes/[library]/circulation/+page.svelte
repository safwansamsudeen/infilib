<script>
	export let data;
	import { page } from '$app/stores';
	import TransTable from '$lib/components/TransTable.svelte';
</script>

<svelte:head>
	<title>Status of Borrows</title>
	<meta content="View transactions" name="description" />
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
	</div>
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
