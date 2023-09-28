<script>
    import {onMount} from "svelte";
    import Table from '$lib/components/Table.svelte';

    export let data;
    import {enhance} from "$app/forms";
    import Input from "$lib/components/Input.svelte";

    let addFormVisible = false;
    console.log(data.columns)
</script>

<svelte:head>
    <title>Users</title>
    <meta content="View users " name="description"/>
</svelte:head>
<div class="text-column text-center">
    <h1>Manage Users</h1>
</div>

<body>
<div class="container">
    <div class="form-check form-switch">
        <input
                bind:checked={addFormVisible}
                class="form-check-input"
                id="form-switch"
                role="switch"
                type="checkbox"
        />
        <label class="form-check-label" for="form-switch"
        >Add user</label
        >
    </div>
    {#if addFormVisible}
        <form action="?/create" method="post" use:enhance>
            <div class="row g-3">
                {#each data.columns as column}
                    <Input {...column}/>
                {/each}
            </div>
            <div class="d-grid gap-2 my-3">
                <input id="submit-btn" class="btn btn-outline-success" type="submit" value="Add"/>
            </div>
        </form>
    {/if}
    <Table columns={data.columns} data={data.users}
           url='users'/>

</div>
</body>
