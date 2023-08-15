<svelte:head>
    <title>Status</title>
</svelte:head>

<script>
    export let data;
    let datatable;
    import { invalidateAll } from '$app/navigation';

</script>
<div class="text-column text-center">
    <h1>Status of Borrows</h1>
</div>

<body>
<div class="container">
    <table class="table" id="borrows-table">
        <thead>
        <tr>
            <th>Member</th>
            <th>Book</th>
            <th>Borrowed on</th>
            <th>Due on</th>
            <th>Returned on</th>
            <th>Comments</th>
            <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        {#each data.transactions as {_id, book, member, borrowed, due_on, returned, comments}}
            <tr class="{_id}-data">
                <td><a href="/members/{member.roll_no}">{member.name}</a></td>
                <td><a href="/books/{book.isbn}">{book.title}</a></td>
                <td>{borrowed.toDateString()}</td>
                <td>{due_on.toDateString()}</td>
                <td>{returned?.toDateString() || 'NYR'}</td>
                <td>{comments}</td>

                <td>
                    {#if !returned}
                        <div class="btn-group dropend">
                            <button type="button" class="btn btn-outline-success"
                                    on:click={fetch('?/return', {method: 'POST',body: JSON.stringify({_id})}).then(invalidateAll)}>
                                Return

                            </button>
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
    dataTable = new simpleDatatables.DataTable("#borrows-table", {
        searchable: true,
    })
</script>
</body>

