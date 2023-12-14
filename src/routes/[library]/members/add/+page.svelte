<script>
	import Form from '$lib/components/Form.svelte';
	export let data;
</script>

<svelte:head>
	<title>Add Member</title>
	<meta content="Add member" name="description" />
</svelte:head>

<Form action="create" columns={data.columns} message="Add Member"></Form>
