<script>
    import {onMount} from "svelte";

    export let data;
    import {enhance} from "$app/forms";
    import Input from "$lib/components/Input.svelte";
    import Grid from "gridjs-svelte";

    let addFormVisible = data.addFormVisible || false;
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
        <label class="form-check-label" for="form-switch"
        >Add user</label
        >
    </div>
    {#if addFormVisible}
        <form action="?/create" method="post" use:enhance>
            <div class="row g-3">
                {#each data.columns as {name, label, type, values, creatable}}
                    <Input {name} {label} {type} {values} {creatable}/>
                {/each}
            </div>
            <div class="d-grid gap-2 my-3">
                <input id="submit-btn" class="btn btn-outline-success" type="submit" value="Add"/>
            </div>
        </form>
    {/if}
    <Grid columns={data.columns} data={data.users} search sort/>
</div>
</body>

<style global>
    @import "https://cdn.jsdelivr.net/npm/gridjs/dist/theme/mermaid.min.css";
</style>
