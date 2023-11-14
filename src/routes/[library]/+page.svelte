<script>
	import Table from '$lib/components/Table.svelte';

	export let data;
</script>

<svelte:head>
	<title>Home</title>
	<meta content="Home" name="description" />
</svelte:head>
{#if data.user.admin}

<div class="text-column text-center">
	<h1>Welcome to the Admin Panel</h1>
</div>

<body>
	<div class="container">
		{#key data}
			<Table
				actions={[['Pop', 'circulation/mark']]}
				columns={data.columns}
				data={data.marks}
				updateUrl="members"
			/>
		{/key}
	</div>
</body>
{/if}
