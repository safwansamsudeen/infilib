<script>
	import Table from '$lib/components/Table2.svelte';

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
		<a href="members/add">Add a member</a>
		{#await data.streamed.users}
			<p>Loading...</p>
		{:then { columns, users }}
			{#key data}
				<Table data={users} {columns} actions={[['Details', 'members'], ['Borrow', 'circulation/borrow/any?user='], ]}/>
			{/key}
		{:catch error}
			<p>{error.message}</p>
		{/await}
	</div>
</body>
