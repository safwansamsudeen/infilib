<svelte:head>
    <title>Books</title>
</svelte:head>

<script>
    export let data;
    import {enhance} from '$app/forms';
</script>
<div class="text-column text-center">
    <h1>View, edit, and manage your books</h1>
</div>

<body>
<div class="container">
    <form action="?/create" method="post" use:enhance>
        <div class="mb-3">
            <label for="title">Title</label>
            <input
                    class="form-control"
                    type="text"
                    id="title"
                    name="title"
            />
        </div>
        <div class="mb-3">
            <label for="author">Author</label>
            <input class="form-control" type="string" id="author" name="author"/>
        </div>

        <div class="mb-3">
            <label for="isbn">ISBN</label>
            <input class="form-control" type="number" id="isbn" name="isbn"/>
        </div>
        <div class="mb-3">
            <label for="publisher">Author</label>
            <input class="form-control" type="string" id="publisher" name="publisher"/>
        </div>
        <div class="mb-3">
            <label for="num_pages">Num. of pages</label>
            <input class="form-control" type="number" id="num_pages" name="num_pages"/>
        </div>
        <div class="d-grid gap-2 my-3">
            <input class="btn btn-outline-success" type="submit" value="Add"/>
        </div>
    </form>
    <table class="table">
        <thead>
        <tr>
            <th>Title</th>
            <th>Author</th>
            <th>ISBN</th>
            <th>Publisher</th>
            <th>No. of pages</th>
            <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        {#each data.books as {title, author, isbn, publisher, num_pages}}
            <tr id="{isbn}-data">
                <td>
                    <input
                            class="form-control"
                            type="text"
                            value="{title}"
                            id="{isbn}-title"
                    />
                </td>
                <td>
                    <input
                            class="form-control"
                            type="text"
                            value="{author}"
                            id="{isbn}-author"
                    />
                </td>
                <td>{isbn}</td>
                <td>
                    <input
                            class="form-control"
                            type="text"
                            value="{publisher}"
                            id="{isbn}-publisher"
                    />
                </td>
                <td>
                    <input
                            class="form-control"
                            type="text"
                            value="{num_pages}"
                            id="{isbn}-num_pages"
                    />
                </td>
                <td>
                    <div class="btn-group dropend">
                        <a href="/borrows/{isbn}/borrow" class="btn btn-outline-success">Borrow</a>
                        <button type="button" class="btn btn-outline-success dropdown-toggle dropdown-toggle-split"
                                data-bs-toggle="dropdown" aria-expanded="false"></button>
                        <ul class="dropdown-menu">
                            <li><a href="#" class="dropdown-item" on:click={() => {
                                fetch('?/update', {
                                    method: 'POST',
                                    body: JSON.stringify({
                                      isbn,
                                      title: document.getElementById(`${isbn}-title`).value,
                                      author: document.getElementById(`${isbn}-author`).value,
                                      publisher: document.getElementById(`${isbn}-publisher`).value,
                                      num_pages: document.getElementById(`${isbn}-num_pages`).value,
                                    })
                                  })
                                }}>Confirm edits</a>
                            </li>
                            <li><a href="#" class="dropdown-item text-danger" on:click={() => {
                                fetch('?/delete', {
                                    method: 'POST',
                                    body: JSON.stringify({ isbn })
                                  }).then(() => {
                                    document.getElementById(`${isbn}-data`).remove()
                                  })
                                }}>Delete</a>
                            </li>
                        </ul>
                    </div>
                </td>
            </tr>
        {/each}
        </tbody>
    </table>
</div>
</body>

