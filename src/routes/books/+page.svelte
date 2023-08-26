<svelte:head>
    <title>Books</title>
</svelte:head>

<script>
    export let data;
    import {enhance} from '$app/forms';

    let addFormVisible = false;
</script>
<div class="text-column text-center">
    <h1>View, edit, and manage your books</h1>
</div>

<body>
<div class="container">
    <!--  Toggler for hiding  -->
    <div class="d-grid gap-2 my-3">
        <button class="btn btn-outline-success" on:click={() => addFormVisible = !addFormVisible}>
            {#if addFormVisible}
                Actions
            {:else}
                Add a book
            {/if}
        </button>
    </div>
    {#if addFormVisible}
        <form action="?/create" method="post" use:enhance>
            <div class="row g-3">
                <div class="col-md-6">
                    <label for="title">Title</label>
                    <input
                            class="form-control"
                            type="text"
                            id="title"
                            name="title"
                    />
                </div>
                <div class="col-md-6">
                    <label for="subtitle">Subtitle</label>
                    <input
                            class="form-control"
                            type="text"
                            id="subtitle"
                            name="subtitle"
                    />
                </div>
                <div class="col-md-6">
                    <label for="acc_no">Accession Number</label>
                    <input
                            class="form-control"
                            type="number"
                            id="acc_no"
                            name="acc_no"
                    />
                </div>

                <div class="col-md-6">
                    <label for="authors">Authors</label>
                    <input
                            class="form-control"
                            type="text"
                            id="authors"
                            name="authors"
                    />
                </div>
                <div class="col-lg-3 col-md-4">
                    <label for="publication_year">Year of Publication</label>
                    <input
                            class="form-control"
                            type="text"
                            id="publication_year"
                            name="publication_year"
                    />
                </div>
                <div class="col-lg-3 col-md-4">
                    <label for="edition">Edition</label>
                    <input
                            class="form-control"
                            type="text"
                            id="edition"
                            name="edition"
                    />
                </div>
                <div class="col-lg-3 col-md-4">
                    <label for="call_no">Call Number</label>
                    <input
                            class="form-control"
                            type="number"
                            id="call_no"
                            name="call_no"
                    />
                </div>
                <div class="col-lg-3 col-md-4">
                    <label for="subjects">Subjects</label>
                    <input
                            class="form-control"
                            type="text"
                            id="subjects"
                            name="subjects"
                    />
                </div>
                <div class="col-lg-3 col-md-4">
                    <label for="no_of_pages">Number of Pages</label>
                    <input
                            class="form-control"
                            type="text"
                            id="no_of_pages"
                            name="no_of_pages"
                    />
                </div>
                <div class="col-lg-3 col-md-4">
                    <label for="level">Level</label>
                    <input
                            class="form-control"
                            type="text"
                            id="level"
                            name="level"
                    />
                </div>
                <div class="col-lg-3 col-md-4">
                    <label for="purchase_price">Purchased price (INR)</label>
                    <input
                            class="form-control"
                            type="text"
                            id="purchase_price"
                            name="purchase_price"
                    />
                </div>
                <div class="col-lg-3 col-md-4">
                    <label for="purchase_details">Purchase details</label>
                    <input
                            class="form-control"
                            type="text"
                            id="purchase_details"
                            name="purchase_details"
                    />
                </div>
                <div class="col-lg-3 col-md-4">
                    <label for="publisher_name">Publisher Name</label>
                    <input
                            class="form-control"

                            type="text"
                            id="publisher_name"
                            name="publisher_name"
                    />
                </div>
                <div class="col-lg-3 col-md-4">
                    <label for="publisher_address">Publisher Name</label>
                    <input
                            class="form-control"

                            type="text"
                            id="publisher_address"
                            name="publisher_address"
                    />
                </div>
                <div class="col-lg-3 col-md-4">
                    <label for="languages">Languages</label>
                    <input
                            class="form-control"

                            type="text"
                            id="languages"
                            name="languages"
                    />
                </div>
                <div class="col-12">
                    <label for="remarks">Remarks</label>
                    <textarea
                            class="form-control"
                            id="remarks"
                            name="remarks"
                    ></textarea>
                </div>
                <div class="col-6">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" name="reference" id="reference">
                        <label class="form-check-label" for="reference">Reference</label>
                    </div>
                </div>
                <div class="col-6">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" name="cd_available" id="cd_available">
                        <label class="form-check-label" for="cd_available">CD Available</label>
                    </div>
                </div>
            </div>
            <div class="d-grid gap-2 my-3">
                <input class="btn btn-outline-success" type="submit" value="Add"/>
            </div>
        </form>
    {/if}
    {#each data.books as {acc_no}}
        <form method="POST" action="?/update" id="form-{acc_no}" use:enhance={() => {
        return async ({ update }) => {
          update({ reset: false });
        };
      }}></form>
    {/each}
    <table class="table">
        <thead>
        <tr>
            <th>Accession Number</th>
            <th>Title</th>
            <th>Authors</th>
            <th>Subjects</th>
            <th>YOP</th>
            <th>Ed.</th>
            <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        {#each data.books as {title, authors, subjects, publication_year, edition, acc_no}}
            <tr id="{acc_no}-data">
                <td><input
                            class="form-control-plaintext"
                            type="text"
                            value="{acc_no}"
                            name="acc_no"
                            form="form-{acc_no}"
                            readonly
                    /></td>
                <td>
                    <input
                            class="form-control"
                            type="text"
                            value="{title}"
                            id="{acc_no}-title"
                            name="title"
                            form="form-{acc_no}"
                    />
                </td>
                <td>
                    <input
                            class="form-control"
                            type="text"
                            value="{authors.join(', ')}"
                            id="{acc_no}-authors"
                            name="authors"
                            form="form-{acc_no}"
                    />
                </td>
                <td>
                    <input
                            class="form-control"
                            type="text"
                            value="{subjects.join(', ')}"
                            id="{acc_no}-subjects"
                            name="subjects"
                            form="form-{acc_no}"
                    />
                </td>
                <td>
                    <input
                            class="form-control"
                            type="text"
                            value="{publication_year}"
                            id="{acc_no}-publication_year"
                            name="publication_year"
                            form="form-{acc_no}"
                    />
                </td>
                <td>
                    <input
                            class="form-control"
                            type="text"
                            value="{edition}"
                            id="{acc_no}-edition"
                            name="edition"
                            form="form-{acc_no}"
                    />
                </td>
                <td>
                    <div class="btn-group dropend">
                        <a href="/borrows/{acc_no}/borrow" class="btn btn-outline-success">Borrow</a>
                        <button type="button" class="btn btn-outline-success dropdown-toggle dropdown-toggle-split"
                                data-bs-toggle="dropdown" aria-expanded="false"></button>
                        <ul class="dropdown-menu">
                            <li>
                                <button class="dropdown-item" type="submit" form="form-{acc_no}">Confirm Edits</button>
                            </li>
                            <li><a href="#" class="dropdown-item text-danger" on:click={() => {
                                fetch('?/delete', {
                                    method: 'POST',
                                    body: JSON.stringify({ acc_no })
                                  }).then(() => {
                                    document.getElementById(`${acc_no}-data`).remove()
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

