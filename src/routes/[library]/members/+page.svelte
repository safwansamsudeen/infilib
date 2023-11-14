<script>
	import Table from '$lib/components/Table.svelte';
	import AddForm from '$lib/components/AddForm.svelte';

	export let data;
</script>

<svelte:head>
	<title>Members</title>
	<meta content="View users" name="description" />
</svelte:head>
<div class="text-column text-center">
	<h1>Manage Members</h1>
</div>

<body>
	<div class="container">
		<AddForm columns={data.columns} id="user"></AddForm>
		{#key data}
			<Table
				actions={[['Details', 'members']]}
				columns={data.columns}
				data={data.users}
				updateUrl="members"
			/>
		{/key}
	</div>
</body>
