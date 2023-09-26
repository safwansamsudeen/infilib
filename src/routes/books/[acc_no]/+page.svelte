<script>
    import {enhance} from "$app/forms";
    import Grid from "gridjs-svelte";
    import {capitalize} from "$lib/helpers.js";
    import Input from "$lib/components/Input.svelte";

    export let data;
    let editable = false;
</script>

<svelte:head>
    <title>Manage: {data.borrowable.title}</title>
</svelte:head>
<div class="text-column text-center">
    <h1>Manage: <em>{data.borrowable.title}</em></h1>
</div>
<body>
<div class="container">
    <div class="d-grid gap-2 my-4" role="group">
        <a
                class="btn btn-outline-success"
                href="/circulation/borrow/{data.borrowable.acc_no}">Borrow</a
        >
        <form action="?/delete" method="POST">
            <input name="confirmed" type="hidden" value="{true}">
            <button class="btn btn-outline-danger w-100" type="submit">Delete</button>
        </form>
    </div>

    <div class="row">
        <form action="?/update" method="post" use:enhance>
            <div class="row g-3">
                {#each data.borrowableColumns as {id, opts, ...column}}
                    <Input {id} {...column} opts={{...opts, value: data.borrowable[id]}}/>
                {/each}
            </div>
            <div class="row g-3">
                <input name="type" type="hidden" value={data.bookColumns ? 'book' : 'magazine'}>
                {#if data.bookColumns}
                    <h3>Book</h3>
                    {#each data.bookColumns as {id, opts, ...column}}
                        <Input {id} {...column} opts={{...opts, value: data.borrowable[id]}}/>
                    {/each}
                {:else}
                    <h3>Magazine</h3>
                    {#each data.magazineColumns as {id, opts, ...column}}
                        <Input {id} {...column} opts={{...opts, value: data.borrowable[id]}}/>
                    {/each}
                {/if}
            </div>
            <div class="d-grid gap-2 my-3 my-3">
                <input class="btn btn-outline-success" type="submit" value="Confirm Edits"/>
            </div>
        </form>

        <h3 class="text-center">Borrowed</h3>
        <Grid columns={[
		{ id: 'user' },
		{ id: 'issued_at' },
		{ id: 'due_at' },
		{ id: 'returned_at' },
		{ id: 'comments' }
	].map((data) => ({ ...data, name: data.name || capitalize(data.id) }))} data={data.transactions} search sort/>

    </div>
</div>
</body>
<style global>
    @import "https://cdn.jsdelivr.net/npm/gridjs/dist/theme/mermaid.min.css";
</style>
