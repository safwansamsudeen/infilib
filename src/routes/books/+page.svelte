<script>
    import {enhance} from "$app/forms";

    export let data;
    import Scanner from "./Scanner.svelte";
    import Grid from "gridjs-svelte";
    import {html} from 'gridjs'
    import Input from "$lib/components/Input.svelte";


    let addFormVisible = data.addFormVisible || false
    let type = data.type || 'book';
</script>

<svelte:head>
    <title>Borrowables</title>
</svelte:head>
<div class="text-column text-center">
    <h1>View, edit, and manage your borrowables</h1>
</div>

<body>
<div class="container">
    <div class="form-check form-switch">
        <input
                bind:checked={addFormVisible}
                class="form-check-input"
                id="add-form"
                role="switch"
                type="checkbox"
        />
        <label class="form-check-label" for="add-form">Add</label>
    </div>
    {#if addFormVisible}
        <Scanner/>
        <form action="?/create" method="post" use:enhance>
            <div class="row g-3">
                {#each data.borrowableColumns as column}
                    <Input {...column}/>
                {/each}
            </div>
            <div class="row my-3 g-3">

                <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
                    <input type="radio" class="btn-check" bind:group={type} id="book" value={"book"}>
                    <label class="btn btn-outline-primary" for="book">Book</label>
                    <input type="radio" class="btn-check" id="magazine" bind:group={type}
                           value={"magazine"}
                    >
                    <label class="btn btn-outline-primary" for="magazine">Magazine</label>
                    <input type="hidden" name="type" bind:value={type}>
                </div>
                {#if type === 'book'}
                    <h3>Book</h3>
                    {#each data.bookColumns as column}
                        <Input {...column}/>
                    {/each}
                {:else}
                    <h3>Magazine</h3>
                    {#each data.magazineColumns as column}
                        <Input {...column}/>
                    {/each}
                {/if}
            </div>
            <div class="d-grid gap-2 my-3 my-3">
                <input class="btn btn-outline-success" type="submit" value="Add"/>
            </div>
        </form>
    {/if}
    <Grid columns={[...data.borrowableColumns, {
                name: 'Actions',
                id: 'actions',
                sort: false,
                formatter: (cell, row) => {
                    return html(`
                    <div class="btn-group" role="group">
                    <a class='btn btn-outline-primary' href='/circulation/borrow/${row.cells[0].data}'>Borrow</a>
                    <a class='btn btn-outline-primary' href='/books/${row.cells[0].data}'>Edit</a>
                    </div>`);
                }
            }]} data={data.borrowables.map(data => [...data, null])} search sort/>

</div>
</body>

<style global>
    @import "https://cdn.jsdelivr.net/npm/gridjs/dist/theme/mermaid.min.css";
</style>
