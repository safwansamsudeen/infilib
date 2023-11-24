<script>
	import AddForm from '$lib/components/AddForm.svelte';
	import { page } from '$app/stores';
	import TransactionTable from '$lib/components/TransactionTable.svelte';

	export let data;
</script>

<svelte:head>
	<title>Manage: {data.item.title}</title>
	<meta content="View all the users, and manage them." name="description" />
</svelte:head>
<div class="text-column text-center">
	<h1>Manage: <em>{data.item.title}</em></h1>
</div>
<body>
	<div class="container">
		<div class="d-grid gap-2 my-4" role="group">
			{#if data.item.status === 'IN' && !data.item.reference}
				<a class="btn btn-outline-success" href="/{$page.params.library}/circulation/borrow/{data.item.id}">Borrow</a>
			{/if}
			<form
				action="?/delete"
				method="POST"
				on:submit={() => confirm('Are you sure you want to delete this item?')}
			>
				<button class="btn btn-outline-danger w-100" type="submit">Delete</button>
			</form>
		</div>

		<div class="row">
			{#if $page.form?.success}
				<p class="alert alert-success">Successfully updated!</p>
			{/if}

			<AddForm
				action="update"
				addTogglable={false}
				columns={data.columns}
				inputColumns={data.inputColumns}
				type={data.type}
			/>

			<h3 class="text-center">Borrowed</h3>
			{#key data.transactions}
				<TransactionTable columns={data.transColumns} data={data.transactions}></TransactionTable>
			{/key}
		</div>
	</div>
</body>
