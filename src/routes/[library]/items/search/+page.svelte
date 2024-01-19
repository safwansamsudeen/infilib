<script>
	import Form from '$lib/components/Form.svelte';
	export let data;
</script>

<svelte:head>
	<title>Advanced Search</title>
</svelte:head>
<Form action="search" columns={data.searchColumns} message="Advanced Search"></Form>
