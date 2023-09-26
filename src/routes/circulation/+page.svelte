<script>
    import Grid from "gridjs-svelte";

    export let data;
    import {page} from "$app/stores";
    import {html} from "gridjs";

    ``

</script>

<svelte:head>
    <title>Status</title>
</svelte:head>

<body>
<div class="text-column text-center">
    <h1>Status of Borrows</h1>
</div>
<div class="btn-group-vertical w-100 my-3" role="group">
    <a
            class="btn btn-outline-dark px-5"
            class:active={$page.url.searchParams.size === 0}
            href="?">All Circulation</a
    >
    <a
            class="btn btn-outline-dark"
            class:active={$page.url.searchParams.has("due")}
            href="?due=today">Due Today</a
    >
    <a class="btn btn-outline-dark">Blank</a>
    <a class="btn btn-outline-dark">Blank</a>
</div>
<div class="grid px-0 my-3">
    <div class="row align-items-start">
        <Grid columns={[...data.columns, {
                name: 'Actions',
                id: 'actions',
                formatter: (cell, row) => {
                    if (row.cells[5].data === 'NA') {
                        return html(`<form action="?/return" method="POST">
            <input name=id type="hidden" value="${row.cells[0].data}">
            <button class="btn btn-outline-success" type="submit">Return</button>
        </form>`);

                    } else {
                        return html(`<form action="?/delete" method="POST" >
            <input name=id type="hidden" value="${row.cells[0].data}">
            <button class="btn btn-outline-danger" type="submit">Delete</button>
        </form>`);
                    }

                }
        }]} data={data.transactions.map(data => [...data, null])} search sort/>
    </div>
</div>
</body>

<style global>
    @import "https://cdn.jsdelivr.net/npm/gridjs/dist/theme/mermaid.min.css";
</style>
