<script>
	export let data;
	import Form from '$lib/components/Form.svelte';
</script>

<svelte:head>
	<title>Library Settings</title>
	<meta content="Library Settings" name="description" />
</svelte:head>
<h2>Manage Subscriptions</h2>
<Form action="create" columns={data.subsColumns} message="" />
<h2>Manage About</h2>
TBD
