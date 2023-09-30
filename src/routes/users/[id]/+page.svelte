<script>
	import { enhance } from '$app/forms';
	import Input from '$lib/components/Input.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import TransactionTable from '$lib/components/TransactionTable.svelte';

	export let data, form;
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
			<form action="?/delete" method="POST">
				<input name="confirmed" type="hidden" value={true} />
				<button class="btn btn-outline-danger w-100" type="submit">Delete</button>
			</form>
		</div>

		<div class="row">
			<form action="?/update" method="post" use:enhance>
				<div class="row g-3">
					{#each data.columns as { id, opts, ...column }}
						<Input {id} {...column} opts={{ ...opts, value: data.user[id] }} />
					{/each}
				</div>
				<div class="d-grid gap-2 my-3 my-3">
					<input class="btn btn-outline-success" type="submit" value="Confirm Edits" />
				</div>
			</form>

			<h3 class="text-center">Borrowed</h3>

			<TransactionTable columns={data.transColumns} data={data.transactions}></TransactionTable>
		</div>
		{#if form}
			{#if form.success}
				<Toast msg="Successfully updated"></Toast>
			{:else}
				<Toast msg={form.error} type="danger"></Toast>
			{/if}
		{/if}
	</div>
</body>
