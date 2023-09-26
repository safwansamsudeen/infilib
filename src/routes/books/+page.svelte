<script>
    import {enhance} from "$app/forms";

    export let data;
    import Scanner from "./Scanner.svelte";
    import Grid from "gridjs-svelte";
    import {html} from 'gridjs'
    import Input from "$lib/components/Input.svelte";
    import {findValue} from "$lib/helpers.js";
    import {page} from "$app/stores";


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
        {#if type === 'book'}
            <Scanner publishers={findValue(data.borrowableColumns, 'publisher').items}
                     authors={findValue(data.bookColumns, 'authors').items}
                     categories={findValue(data.borrowableColumns, 'categories').items}
                     languages={findValue(data.borrowableColumns, 'languages').items}/>
        {/if}
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
    <div class="btn-group-vertical w-100 my-3" role="group">
        <a
                class="btn btn-outline-dark"
                class:active={$page.url.searchParams.size === 0}
                href="?">All Items</a
        >
        <a
                class="btn btn-outline-dark"
                class:active={$page.url.searchParams.get("show") === "book"}
                href="?show=book">Books</a
        >
        <a
                class="btn btn-outline-dark"
                class:active={$page.url.searchParams.get("show") === "magazine"}
                href="?show=magazine">Magazines</a
        >
        <a class="btn btn-outline-dark">Blank</a>
    </div>
    <div class="row align-items-start">
        <Grid columns={[...data.columns, {
                name: 'Actions',
                id: 'actions',
                formatter: (cell, row) => {
                    return html(`
                    <div class="btn-group" role="group">
                    <a class='btn btn-outline-primary' href='/circulation/borrow/${row.cells[0].data}'>Borrow</a>
                    <a class='btn btn-outline-primary' href='/books/${row.cells[0].data}'>Edit</a>
                    </div>`);
                }
            }]} data={data.borrowables.map(data => [...data, null])} search sort/>
    </div>


</div>
</body>

<style global>
    @import "https://cdn.jsdelivr.net/npm/gridjs/dist/theme/mermaid.min.css";
</style>
