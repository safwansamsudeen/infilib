<script>
    export let data;
    import AddForm from "$lib/components/Form.svelte";
</script>
<svelte:head>
    <title>Library Settings</title>
    <meta content="Library Settings" name="description">
</svelte:head>
<h2>Manage Subscriptions</h2>
<AddForm action="create_subscription" addTogglable={false} columns={data.subsColumns} />
<h2>Manage About</h2>
TBD
