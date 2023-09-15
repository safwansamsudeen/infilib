<script>
    export let data;
    import {DataHandler} from "@vincjo/datatables";
    import {enhance} from "$app/forms";
    import {page} from "$app/stores";

    const handler = new DataHandler(data.transactions, {rowsPerPage: 10});
    const transactions = handler.getRows();
    $: data, handler.setRows(data.transactions);

    import BorrowTable from "$lib/components/BorrowTable.svelte";
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
            {#each data.transactions as {_id, returned}}
                {#if !returned}
                    <form method="POST" action="?/return" id="form-{_id}" use:enhance>
                        <input type="hidden" value={_id} name="_id"/>
                    </form>
                {/if}
            {/each}
        </div>
        <div class="col-md-9">
            <BorrowTable borrows={transactions} {handler}/>
        </div>
    </div>
</div>
</body>
