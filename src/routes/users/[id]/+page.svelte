<script>
    import {enhance} from '$app/forms';
    import Input from '$lib/components/Input.svelte';
    import TransactionTable from '$lib/components/TransactionTable.svelte';

    export let data, form;
    if (form?.error) {
        console.log(form.error)
    }
</script>

<svelte:head>
    <title>Manage: {data.user.name}</title>
</svelte:head>
<div class="text-column text-center">
    <h1>Manage: <em>{data.user.name}</em></h1>
</div>
<body>
<div class="container">
    <div class="d-grid gap-2 my-4" role="group">
        <a class="btn btn-outline-success" href="/circulation/borrow/all?user={data.user.id}"
        >Borrow</a
        >
        <form action="?/delete" method="POST"
              on:submit={() => confirm('Are you sure you want to delete this user?')}>
            <input name="confirmed" type="hidden" value={true}/>
            <button class="btn btn-outline-danger w-100" type="submit">Delete</button>
        </form>
    </div>

    <div class="row">
        {#if form?.success}
            <p class="alert alert-success">Successfully updated!</p>
        {/if}
        <form action="?/update" method="post" use:enhance>
            {#if form?.missing}<p class="alert alert-danger">The "{form.name}" field is required</p>{/if}
            {#if form?.incorrect}<p class="alert alert-danger">The "{form.name}" field does not have a valid
                value: {form.value}</p>{/if}
            {#if form?.error}
                <p class="alert alert-danger">An error was raised! Did you give an ID that already
                    exists?</p>{/if}

            <div class="row g-3">
                {#each data.columns as {id, opts, ...column}}
                    <Input {id} {...column} opts={{ ...opts, value: data.user[id] }}/>
                {/each}
            </div>
            <div class="d-grid gap-2 my-3 my-3">
                <input class="btn btn-outline-success" type="submit" value="Confirm Edits"/>
            </div>
        </form>

        <h3 class="text-center">Borrowed</h3>
        {#key data}
            <TransactionTable columns={data.transColumns} data={data.transactions}></TransactionTable>
        {/key}
    </div>
</div>
</body>
