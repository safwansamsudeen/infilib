<script>
  export let data;
  import { DataHandler, Datatable, Th } from "@vincjo/datatables";
  import { enhance } from "$app/forms";

  let addFormVisible = false;

  const handler = new DataHandler(data.books, { rowsPerPage: 10 });
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
        class="form-check-input"
        type="checkbox"
        role="switch"
        id="flexSwitchCheckDefault"
        bind:checked={addFormVisible}
      />
      <label class="form-check-label" for="flexSwitchCheckDefault"
        >Add book</label
      >
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
              required
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
            <label for="_id">Accession Number</label>
            <input
              class="form-control"
              type="number"
              id="_id"
              name="_id"
              required
            />
          </div>

          <div class="col-md-6">
            <label for="authors">Authors</label>
            <input
              class="form-control"
              type="text"
              id="authors"
              name="authors"
              required
            />
          </div>
          <div class="col-lg-3 col-md-4">
            <label for="publication_year">Year of Publication</label>
            <input
              class="form-control"
              type="text"
              id="publication_year"
              name="publication_year"
              required
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
              required
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
            <input class="form-control" type="text" id="level" name="level" />
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
              required
            />
          </div>
          <div class="col-lg-3 col-md-4">
            <label for="publisher_address">Publisher Address</label>
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
            <textarea class="form-control" id="remarks" name="remarks"
            ></textarea>
          </div>
          <div class="col-6">
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                name="reference"
                id="reference"
              />
              <label class="form-check-label" for="reference">Reference</label>
            </div>
          </div>
          <div class="col-6">
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                name="cd_available"
                id="cd_available"
              />
              <label class="form-check-label" for="cd_available"
                >CD Available</label
              >
            </div>
          </div>
        </div>
        <div class="d-grid gap-2 my-3">
          <input class="btn btn-outline-success" type="submit" value="Add" />
        </div>
      </form>
    {/if}
    {#each data.books as { _id }}
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
          {#each $books as { title, authors, subjects, publication_year, edition, _id }}
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
                        form="form-{_id}">Confirm Edits</button
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
