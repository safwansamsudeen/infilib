<svelte:head>
    <title>Status</title>
</svelte:head>

<script>
    export let data;
    let datatable;
    import {invalidateAll} from "$app/navigation";
    import {enhance} from "$app/forms";

</script>
<div class="text-column text-center">
    <h1>Status of Borrows</h1>
</div>
{#each data.transactions as {_id, returned}}
    {#if !returned}
        <form method="POST" action="?/update" id="form-{_id}" use:enhance={() => {
    return async ({ update }) => {
      update({ reset: false });
    };
  }}>
            <input type="hidden" value="{_id}" name="_id">
        </form>
    {/if}
{/each}
<body>
<div class="container">
    <table class="table" id="circulation-table">
        <thead>
        <tr>
            <th>Student</th>
            <th>Book</th>
            <th>Borrowed</th>
            <th>Due on</th>
            <th>Returned on</th>
            <th>Comments</th>
            <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        {#each data.transactions as {_id, book, member, borrowed, due_on, returned, comments}}
            <tr class="{_id}-data">
                <td><a href="/members/{member._id}">{member.name}</a></td>
                <td><a href="/books/{book._id}">{book.title} ({book._id})</a></td>
                <td>{borrowed.toDateString()}</td>
                <td>{due_on.toDateString()}</td>
                <td>{returned?.toDateString() || 'NA'}</td>
                <td>
                    {#if !returned}
                        <label for="comments"></label><input type="text" id="comments" name="comments" value="{comments}" form="form-{_id}">
                    {:else}
                        {comments}
                    {/if}
                </td>

                <td>
                    {#if !returned}
                        <div class="btn-group dropend">
                            <button type="submit" form="form-{_id}" class="btn btn-outline-success"> Return</button>
                            <button type="button" class="btn btn-outline-success dropdown-toggle dropdown-toggle-split"
                                    data-bs-toggle="dropdown" aria-expanded="false"></button>
                            <ul class="dropdown-menu">
                                <li><a href="#" class="dropdown-item text-danger" on:click={() => {
                                fetch('?/delete', {
                                    method: 'POST',
                                    body: JSON.stringify({ _id })
                                }).then(() => {
                                    invalidateAll()
                                })
                                }}>Delete</a>
                                </li>
                            </ul>
                        </div>
                    {:else}
                        <button class="btn btn-danger " on:click={() => {
                            fetch('?/delete', {
                                method: 'POST',
                                body: JSON.stringify({ _id })
                              }).then(() => {
                                invalidateAll()
                              })
                        }}>Delete
                        </button>
                    {/if}
                </td>
            </tr>
        {/each}
        </tbody>
    </table>
</div>
<link href="https://cdn.jsdelivr.net/npm/simple-datatables@latest/dist/style.css" rel="stylesheet" type="text/css">
<script src="https://cdn.jsdelivr.net/npm/simple-datatables@latest" type="text/javascript"></script>
<script>
    dataTable = new simpleDatatables.DataTable("#circulation-table", {
        searchable: true,
    })
</script>
</body>

