<script>
	import Table from '$lib/components/Table.svelte';
	import AddForm from '$lib/components/AddForm.svelte';

	export let data;
</script>

<svelte:head>
	<title>Users</title>
	<meta content="View users" name="description" />
</svelte:head>
<div class="text-column text-center">
	<h1>Manage Users</h1>
</div>

<body>
	<div class="container">
		<AddForm columns={data.columns} id="user"></AddForm>
		{#key data}
			<Table
				actions={[['Details', 'users']]}
				columns={data.columns}
				promise={data.users}
				updateUrl="users"
			/>
		{/key}
	</div>
</body>
