<script>
    import Grid from "gridjs-svelte";

    export let data;
    import {page} from "$app/stores";

    ``

</script>

<svelte:head>
    <title>Status</title>
</svelte:head>

<body>
<div class="text-column text-center">
    <h1>Status of Borrows</h1>
    {#each $page.url.searchParams as [param, value]}
      <span class="badge bg-secondary mx-4"
      ><span class="text-capitalize">{param.replace("_", " ")}</span>: {value}</span
      >
    {/each}
</div>
<div class="grid px-0 my-3">
    <div class="row align-items-start">
        <div class="col-md-3">
            <div class="btn-group-vertical" role="group">
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
        </div>
        <div class="col-md-9">
            <Grid columns={data.columns} data={data.transactions} search/>
        </div>
    </div>
</div>
</body>

<style global>
    @import "https://cdn.jsdelivr.net/npm/gridjs/dist/theme/mermaid.min.css";
</style>
