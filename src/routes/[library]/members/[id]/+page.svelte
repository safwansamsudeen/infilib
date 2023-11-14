<script>
	import TransactionTable from '$lib/components/TransactionTable.svelte';
	import AddForm from '$lib/components/AddForm.svelte';
	import { page } from '$app/stores';

	export let data;
</script>

<svelte:head>
	<title>Manage: {data.user.name}</title>
</svelte:head>
<div class="text-column text-center">
	<h1>Manage: <em>{data.user.name}</em></h1>
</div>
<body>
	<div class="container">
		<div class="d-grid gap-2 my-4" role="group">
			<a class="btn btn-outline-success" href="/circulation/borrow/all?user={data.user.id}"
				>Borrow</a
			>
			<form
				action="?/delete"
				method="POST"
				on:submit={() => confirm('Are you sure you want to delete this user?')}
			>
				<button class="btn btn-outline-danger w-100" type="submit">Delete</button>
			</form>
		</div>

		<div class="row">
			{#if $page.form?.success}
				<p class="alert alert-success">Successfully updated!</p>
			{/if}
			<AddForm action="update" addTogglable={false} columns={data.columns} />

			<h3 class="text-center">Borrowed</h3>
			{#key data.transactions}
				<TransactionTable columns={data.transColumns} data={data.transactions}></TransactionTable>
			{/key}
		</div>
	</div>
</body>
