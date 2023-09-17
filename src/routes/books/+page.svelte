<script>
    import {onMount} from "svelte";

    export let data;
    import Scanner from "./Scanner.svelte";
    import AddForm from "./AddForm.svelte";
    import DataTable from "$lib/components/DataTable.svelte";

    let addFormVisible = data.addFormVisible || true;
    let datatable;
    onMount(() => {
        datatable = new DataTable({
            target: document.getElementById('borrowables'),
            props: {
                columns: data.columns,
                data: data.borrowables,
                id: 'borrowables',
            },
        });
    })

    $: data, datatable?.$set({
        columns: data.columns,
        data: data.borrowables,
        id: 'borrowables',
    });

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
        <!--        <Scanner/>-->
        <AddForm {...data}/>
    {/if}
    <div id="borrowables"></div>
</div>
</body>
