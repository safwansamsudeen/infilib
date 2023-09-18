<script>
    import {onMount} from "svelte";

    export let data;
    import {enhance} from "$app/forms";
    import Input from "$lib/components/Input.svelte";
    import DataTable from "$lib/components/DataTable.svelte";

    let addFormVisible = data.addFormVisible || false;
    let datatable;
    onMount(() => {
        datatable = new DataTable({
            target: document.getElementById('users'),
            props: {
                columns: data.columns,
                data: data.users,
                id: 'users'
            }
        });

    })

    $: data, datatable?.$set({
        columns: data.columns,
        data: data.users
    });
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
                {#each data.columns as {name, label, type, values}}
                    <Input {name} {label} {type} {values}/>
                {/each}
            </div>
            <div class="d-grid gap-2 my-3">
                <input id="submit-btn" class="btn btn-outline-success" type="submit" value="Add"/>
            </div>
        </form>
    {/if}
    <div id="users"></div>
</div>
</body>
