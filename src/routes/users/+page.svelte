<script>
    import Table from '$lib/components/Table.svelte';

    export let data, form;
    import {enhance} from '$app/forms';
    import Input from '$lib/components/Input.svelte';

    let addFormVisible = false;
    console.log(form)
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
        <label class="form-check-label" for="form-switch">Add user</label>
    </div>
    {#if addFormVisible}
        <form action="?/create" method="post" use:enhance>
            {#if form?.missing}<p class="alert alert-danger">The "{form.label}" field is required</p>{/if}
            {#if form?.incorrect}<p class="alert alert-danger">The "{form.label}" field does not have a valid

                value: {form.value}</p>{/if}
            {#if form?.error}<p class="alert alert-danger">An error was raised! Did you give an ID that already
                exists?</p>{/if}

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
    {#key data}
        <Table
                actions={[['Details', 'users']]}
                columns={data.columns}
                data={data.users}
                updateUrl="users"
        />
    {/key}
</div>
</body>
