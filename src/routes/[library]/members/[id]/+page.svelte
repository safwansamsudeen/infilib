<script>
	import Form from '$lib/components/Form2.svelte';
	import { page } from '$app/stores';
	import TransTable from "$lib/components/TransTable.svelte";

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
			<a
				class="btn btn-outline-success"
				href="/{$page.params.library}/circulation/borrow/any?user={data.user.id}">Borrow</a
			>
			<form
				action="?/delete"
				method="POST"
				on:submit={(e) => {
					if (!confirm('Are you sure you want to remove this user from your library?')) {
						e.preventDefault();
					}
				}}
			>
				<button class="btn btn-outline-danger w-100" type="submit">Delete</button>
			</form>
		</div>

		<div class="row">

			<Form action="update" addTogglable={false} columns={data.userColumns} message="" />

			<h3 class="text-center">Borrowed</h3>
			{#key data.transactions}
				<TransTable columns={data.transColumns} data={data.transactions} />
			{/key}
		</div>
	</div>
</body>
