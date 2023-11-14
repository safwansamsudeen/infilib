<script>
	import Table from '$lib/components/Table.svelte';

	export let data;
</script>

<svelte:head>
	<title>Admin Panel - Home</title>
	<meta content="Admin Panel - Home" name="description" />
</svelte:head>

<div class="text-column text-center">
	<h1>Manage Members</h1>
</div>

<body>
	<div class="container">
		{#key data}
			<Table
				actions={[['Details', 'members']]}
				columns={data.columns}
				data={data.marks}
				updateUrl="members"
			/>
		{/key}
	</div>
</body>
