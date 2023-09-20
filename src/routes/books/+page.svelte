<script>
    import {onMount} from "svelte";
    import {enhance} from "$app/forms";

    export let data;
    import Scanner from "./Scanner.svelte";
    import Grid from "gridjs-svelte";
    import {h} from 'gridjs'
    import Input from "$lib/components/Input.svelte";


    let addFormVisible = data.addFormVisible || false
</script>

<svelte:head>
    <title>Books</title>
</svelte:head>
<div class="text-column text-center">
    <h1>View, edit, and manage your books</h1>
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
                {#each data.columns as {id, name, type, values}}
                    <Input {id} {name} {type} {values}/>
                {/each}
            </div>
            <div class="d-grid gap-2 my-3 my-3">
                <input class="btn btn-outline-success" type="submit" value="Add"/>
            </div>
        </form>
    {/if}
    <Grid columns={data.columns.concat([{
        name: 'Actions',
        id: 'actions',
         formatter: (cell, row) => {
          return h('a', {
            className: 'btn btn-primary',
            href: '/circulation/borrow/' + row.cells[0].data,
    }, 'Borrow');
        }
      }])} data={data.borrowables.map(data => [...data, null])} search sort/>

</div>
</body>

<style global>
    @import "https://cdn.jsdelivr.net/npm/gridjs/dist/theme/mermaid.min.css";
</style>
