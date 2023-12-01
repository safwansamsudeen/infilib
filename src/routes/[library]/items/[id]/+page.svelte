<script>
	import { page } from '$app/stores';
	import TransactionTable from '$lib/components/TransactionTable.svelte';
	import Form from "$lib/components/Form.svelte";
	import {capitalize} from "$lib/helpers.js";
	import Input from "$lib/components/Input.svelte";

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
				on:submit={(e) => {
					if(!confirm('Are you sure you want to delete this item?')) {
						e.preventDefault()
					}
				}}
			>
				<button class="btn btn-outline-danger w-100" type="submit">Delete</button>
			</form>
		</div>

		<div class="row">
			{#if $page.form?.success}
				<p class="alert alert-success">Successfully updated!</p>
			{/if}
			<Form action="update" addTogglable={false} columns={data.itemColumns}
				id="item">
				<svelte:fragment slot="options-extra-columns">
					<input
								class="btn-check"
								id="type"
								name="type"
								type="hidden"
								value={data.type}
							/>
					<h3 class="text-center">{capitalize(data.type)}</h3>
					{#each data.otherColumns[data.type] as column}
						<Input {...column} />
					{/each}
				</svelte:fragment>
			</Form>



			<h3 class="text-center">Borrowed</h3>
			{#key data.transactions}
				<TransactionTable columns={data.transColumns} data={data.transactions}></TransactionTable>
			{/key}
		</div>
	</div>
</body>
