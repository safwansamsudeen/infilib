<script>
    import {DataHandler} from "@vincjo/datatables";
    import {enhance} from "$app/forms";
    import BorrowTable from "$lib/components/BorrowTable.svelte";

    export let data;

    const handler = new DataHandler(data.borrows, {rowsPerPage: 10});
    const borrows = handler.getRows();
    $: data, handler.setRows(data.borrows);
    let editable = false;
</script>

<svelte:head>
    <title>Manage: {data.member.name}</title>
</svelte:head>
<div class="text-column text-center">
    <h1>Manage: <em>{data.member.name}</em></h1>
</div>
<body>
<div class="container">
    <div class="d-grid gap-2 my-4" role="group">
        <a class="btn btn-outline-danger" href="/books?/delete">TBD (Delete)</a>
    </div>

    {#each data.borrows as {_id, returned}}
        {#if !returned}
            <form
                    method="POST"
                    action="/circulation?/return"
                    id="form-{_id}"
                    use:enhance
            >
                <input type="hidden" value={_id} name="_id"/>
            </form>
        {/if}
    {/each}
    <div class="row">
        <form
                action="/members?/update"
                class="col-md-6"
                method="post"
                use:enhance={() => {
          return async ({ update }) => {
            update({ reset: false });
          };
        }}
        >
            <h3 class="text-center">Details</h3>
            <div class="form-check form-switch">
                <input
                        bind:checked={editable}
                        class="form-check-input me-2"
                        id="editableSwitch"
                        role="switch"
                        type="checkbox"
                />
                <label class="form-check-label" for="editableSwitch">Editable</label>
            </div>

            <div class="mb-3">
                <label for="name">Name</label>
                <input
                        class={editable ? "form-control" : "form-control-plaintext"}
                        id="name"
                        name="name"
                        required
                        type="text"
                        value={data.member.name}
                />
            </div>
            <div class="mb-3">
                <label for="_id">Admission Number</label>
                <input
                        class={editable ? "form-control" : "form-control-plaintext"}
                        id="_id"
                        name="_id"
                        required
                        type="number"
                        value={data.member._id}
                />
            </div>
            <div class="mb-3">
                <label for="grade">Grade</label>
                <input
                        class={editable ? "form-control" : "form-control-plaintext"}
                        id="grade"
                        name="grade"
                        required
                        type="text"
                        value={data.member.grade}
                />
            </div>
            <div class="mb-3">
                <label for="section">Section</label>
                <input
                        class={editable ? "form-control" : "form-control-plaintext"}
                        id="section"
                        name="section"
                        required
                        type="text"
                        value={data.member.section}
                />
            </div>
            <div class="mb-3">
                <label for="gender">Gender</label>
                <select
                        class="form-select"
                        disabled={!editable}
                        id="gender"
                        name="gender"
                >
                    <option selected={data.member.gender === "F"} value="F"
                    >Female
                    </option
                    >
                    <option selected={data.member.gender === "M"} value="M">Male
                    </option
                    >
                </select>
            </div>
            <div class="d-grid gap-2 my-3" class:d-none={!editable}>
                <input
                        class="btn btn-outline-success"
                        type="submit"
                        value="Confirm Edits"
                />
            </div>
        </form>
        <div class="col-md-6">
            <h3 class="text-center">Borrowed</h3>
            <BorrowTable {borrows} {handler}/>
        </div>
    </div>
</div>
</body
>
