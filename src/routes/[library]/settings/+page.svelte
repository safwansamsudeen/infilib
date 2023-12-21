<script>
	export let data;
	import Form from '$lib/components/Form.svelte';
</script>

<svelte:head>
	<title>Library Settings</title>
	<meta content="Library Settings" name="description" />
</svelte:head>
<h1 class="text-center">Manage your InfiLib settings</h1>
<a class=" my-3" href="./settings/import">Import items</a>
<h3>Add Subscription Type</h3>
<Form action="create" columns={data.subsColumns} message="" />
<h3>Manage About</h3>
TBD
