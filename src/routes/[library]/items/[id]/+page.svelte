<script>
	import { page } from '$app/stores';
	import TransTable from '$lib/components/TransTable.svelte';
	import Form from '$lib/components/Form2.svelte';
	import { capitalize } from '$lib/helpers.js';
	import Input from '$lib/components/Input.svelte';

	export let data;
</script>

<svelte:head>
	<title>Manage: {data.item.title}</title>
	<meta content="View a specific item" name="description" />
</svelte:head>

<div class="text-column text-center">
	<h1>Manage: <em>{data.item.title}</em></h1>
</div>

<body>
	<div class="container">
		<div class="d-grid gap-2 my-4" role="group">
			{#if data.item.status === 'IN' && !data.item.reference}
				<a
					class="btn btn-outline-success"
					href="/{$page.params.library}/circulation/borrow/{data.item.id}">Borrow</a
				>
			{/if}
			<form
				action="?/delete"
				method="POST"
				on:submit={(e) => {
					if (!confirm('Are you sure you want to delete this item?')) {
						e.preventDefault();
					}
				}}
			>
				<button class="btn btn-outline-danger w-100" type="submit">Delete</button>
			</form>
		</div>

		<div class="row">
			<Form action="update" columns={data.columns}><svelte:fragment slot="extras"><input name="type" type="hidden" value = {data.item.book ? 'book' : 'magazine'}></svelte:fragment></Form>

			<h3 class="text-center">Borrowed</h3>
			{#key data.transactions}
				<TransTable columns={data.transColumns} data={data.transactions} />
			{/key}
		</div>
	</div>
</body>
