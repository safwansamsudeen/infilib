<svelte:head>
    <title>Books</title>
</svelte:head>

<script>
    export let data;
    import { enhance } from '$app/forms';
</script>
<div class="text-column">
    <h1>View, edit, and manage your books</h1>
</div>

<body>
<div class="container">
    <form action="?/create" method="post">
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
        </tr>
        </thead>
        <tbody>
        {#each data.books as {title, author, isbn, publisher, num_pages}}
            <tr>
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
                    <button class="btn btn-outline-danger delete-button" on:click={() => {
                        document.getElementById(`${isbn}-type`).value = 'delete';
                        let btn = document.getElementById(`${isbn}-confirm`);
                        btn.classList.replace("btn-dark", "btn-danger");
                        btn.textContent = "DELETE";
                    }}>❌</button>
                </td>
                <td>
                    <input id="{isbn}-type" name="{isbn}-type" value="update" hidden/>
                    <button class="btn btn-dark" id="{isbn}-confirm" on:click={() => {
                        let type = document.getElementById(`${isbn}-type`).value
                      fetch('?/update', {
                        method: 'POST',
                        body: JSON.stringify({
                          isbn,
                          type,
                          name: document.getElementById(`${isbn}-name`).value,
                          "class_": document.getElementById(`${isbn}-class`).value,
                        })
                      }).then(() => {
                        if (type === 'delete') {
                          location.reload();
                        }
                      });
                    }}>Confirm
                    </button>
                </td>
            </tr>
        {/each}
        </tbody>
    </table>
</div>
</body>

