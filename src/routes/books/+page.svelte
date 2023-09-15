<script>
    import Scanner from "./Scanner.svelte";
    import AddForm from "./AddForm.svelte";

    export let data;

    import {enhance} from "$app/forms";

    let addFormVisible = true;

    const handler = new DataHandler(data.books, {rowsPerPage: 10});
    const books = handler.getRows();
    $: data, handler.setRows(data.books);

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
    {#each data.books as {_id}}
        <form
                method="POST"
                action="?/update"
                id="form-{_id}"
                use:enhance={() => {
          return async ({ update }) => {
            update({ reset: false });
          };
        }}
        ></form>
    {/each}
    <Datatable {handler}>
        <table class="table">
            <thead>
            <tr>
                <Th {handler} orderBy="acc_no">Accession Number</Th>
                <Th {handler} orderBy="title">Title</Th>
                <Th {handler} orderBy="authors">Authors</Th>
                <Th {handler} orderBy="subjects">Subjects</Th>
                <Th {handler} orderBy="publication_year">YOP</Th>
                <Th {handler} orderBy="edition">Ed.</Th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {#each $books as {title, authors, subjects, publication_year, edition, _id}}
                <tr id="{_id}-data">
                    <td
                    ><input
                            class="form-control-plaintext"
                            type="text"
                            value={_id}
                            name="_id"
                            form="form-{_id}"
                            readonly
                    /></td
                    >
                    <td>
                        <input
                                class="form-control"
                                type="text"
                                value={title}
                                name="title"
                                form="form-{_id}"
                        />
                    </td>
                    <td>
                        <input
                                class="form-control"
                                type="text"
                                value={authors.join(", ")}
                                name="authors"
                                form="form-{_id}"
                        />
                    </td>
                    <td>
                        <input
                                class="form-control"
                                type="text"
                                value={subjects.join(", ")}
                                name="subjects"
                                form="form-{_id}"
                        />
                    </td>
                    <td>
                        <input
                                class="form-control"
                                type="text"
                                value={publication_year}
                                name="publication_year"
                                form="form-{_id}"
                        />
                    </td>
                    <td>
                        <input
                                class="form-control"
                                type="text"
                                value={edition}
                                name="edition"
                                form="form-{_id}"
                        />
                    </td>
                    <td>
                        <div class="btn-group dropend">
                            <a
                                    href="/books/{_id}/"
                                    class="btn btn-outline-success">Detail</a
                            >
                            <a
                                    href="/circulation/borrow/{_id}/"
                                    class="btn btn-outline-success">Borrow</a
                            >
                            <button
                                    type="button"
                                    class="btn btn-outline-success dropdown-toggle dropdown-toggle-split"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                            ></button>
                            <ul class="dropdown-menu">
                                <li>
                                    <button
                                            class="dropdown-item"
                                            type="submit"
                                            form="form-{_id}">Confirm Edits
                                    </button
                                    >
                                </li>
                                <li>
                                    <a
                                            href="#"
                                            class="dropdown-item text-danger"
                                            on:click={() => {
                          fetch("?/delete", {
                            method: "POST",
                            body: JSON.stringify({ _id }),
                          }).then(() => {
                            document.getElementById(`${_id}-data`).remove();
                          });
                        }}>Delete</a
                                    >
                                </li>
                            </ul>
                        </div>
                    </td>
                </tr>
            {/each}
            </tbody>
        </table>
    </Datatable>
</div>
</body>
