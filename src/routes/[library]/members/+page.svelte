<script>
	import Table from '$lib/components/Table.svelte';
	import AddForm from '$lib/components/Form.svelte';
	import { onMount } from 'svelte';

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
		{#await data.streamed.users}
			<p>Loading...</p>
		{:then { userColumns, users }}
			<AddForm id="user" columns={userColumns}></AddForm>
			{#key data}
				<Table
					actions={[['Details', 'members']]}
					columns={userColumns}
					data={users}
					updateUrl="members"
				/>
			{/key}
		{:catch error}
			<p>{error.message}</p>
		{/await}
	</div>
</body>
