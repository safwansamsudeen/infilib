<script>
  import { DataHandler } from "@vincjo/datatables";
  import { enhance } from "$app/forms";
  import BorrowTable from "$lib/BorrowTable.svelte";

  export let data;

  const handler = new DataHandler(data.borrows, { rowsPerPage: 10 });
  const borrows = handler.getRows();
  $: data, handler.setRows(data.borrows);
  let editable = false;
</script>

<svelte:head>
  <title>Manage: {data.book.title}</title>
</svelte:head>
<div class="text-column text-center">
  <h1>Manage: <em>{data.book.title}</em></h1>
</div>
<body>
  <div class="container">
    <div class="d-grid gap-2 my-4" role="group">
      <a
        class="btn btn-outline-success"
        href="/circulation/borrow/{data.book._id}">Borrow</a
      >
      <a class="btn btn-outline-danger" href="/books?/delete">TBD (Delete)</a>
    </div>

    {#each data.borrows as { _id, returned }}
      {#if !returned}
        <form
          method="POST"
          action="/circulation?/return"
          id="form-{_id}"
          use:enhance
        >
          <input type="hidden" value={_id} name="_id" />
        </form>
      {/if}
    {/each}
    <div class="row">
      <form
        action="?/update"
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
        <div class="row g-3">
          <div class="col-md-6">
            <label for="title">Title</label>
            <input
              class={editable ? "form-control" : "form-control-plaintext"}
              id="title"
              name="title"
              readonly={!editable}
              required
              type="text"
              value={data.book.title}
            />
          </div>
          <div class="col-md-6">
            <label for="subtitle">Subtitle</label>
            <input
              class={editable ? "form-control" : " form-control-plaintext"}
              id="subtitle"
              name="subtitle"
              readonly={!editable}
              type="text"
              value={data.book.subtitle}
            />
          </div>
          <div class="col-md-6">
            <label for="_id">Accession Number</label>
            <input
              class={editable ? "form-control" : " form-control-plaintext"}
              id="_id"
              name="_id"
              readonly={!editable}
              required
              type="number"
              value={data.book._id}
            />
          </div>
          <div class="col-md-6">
            <label for="authors">Authors</label>
            <input
              class={editable ? "form-control" : " form-control-plaintext"}
              id="authors"
              name="authors"
              readonly={!editable}
              required
              type="text"
              value={data.book.authors.join(", ")}
            />
          </div>
          <div class="col-md-6">
            <label for="isbn">ISBN</label>
            <input
              class={editable ? "form-control" : " form-control-plaintext"}
              id="isbn"
              name="isbn"
              readonly={!editable}
              required
              type="text"
              value={data.book.isbn}
            />
          </div>
          <div class="col-lg-3 col-md-4">
            <label for="publication_year">Year of Publication</label>
            <input
              class={editable ? "form-control" : " form-control-plaintext"}
              id="publication_year"
              name="publication_year"
              readonly={!editable}
              required
              type="text"
              value={data.book.publication_year}
            />
          </div>
          <div class="col-lg-3 col-md-4">
            <label for="edition">Edition</label>
            <input
              class={editable ? "form-control" : " form-control-plaintext"}
              id="edition"
              name="edition"
              readonly={!editable}
              type="text"
              value={data.book.edition}
            />
          </div>
          <div class="col-lg-3 col-md-4">
            <label for="call_no">Call Number</label>
            <input
              class={editable ? "form-control" : " form-control-plaintext"}
              id="call_no"
              name="call_no"
              readonly={!editable}
              required
              step="0.01"
              type="number"
              value={data.book.call_no}
            />
          </div>
          <div class="col-lg-3 col-md-4">
            <label for="subjects">Subjects</label>
            <input
              class="form-control form-control-plaintext"
              id="subjects"
              name="subjects"
              readonly={!editable}
              type="text"
              value={data.book.subjects.join(", ")}
            />
          </div>
          <div class="col-lg-3 col-md-4">
            <label for="no_of_pages">Number of Pages</label>
            <input
              class={editable ? "form-control" : " form-control-plaintext"}
              id="no_of_pages"
              name="no_of_pages"
              readonly={!editable}
              type="text"
              value={data.book.no_of_pages}
            />
          </div>
          <div class="col-lg-3 col-md-4">
            <label for="level">Level</label>
            <input
              class={editable ? "form-control" : " form-control-plaintext"}
              id="level"
              name="level"
              readonly={!editable}
              type="text"
              value={data.book.level}
            />
          </div>
          <div class="col-lg-3 col-md-4">
            <label for="purchase_price">Purchased price (INR)</label>
            <input
              class={editable ? "form-control" : " form-control-plaintext"}
              id="purchase_price"
              name="purchase_price"
              readonly={!editable}
              type="text"
              value={data.book.purchase_price}
            />
          </div>
          <div class="col-lg-3 col-md-4">
            <label for="purchase_details">Purchase details</label>
            <input
              class={editable ? "form-control" : " form-control-plaintext"}
              id="purchase_details"
              name="purchase_details"
              readonly={!editable}
              type="text"
              value={data.book.purchase_details}
            />
          </div>
          <div class="col-lg-3 col-md-4">
            <label for="publisher_name">Publisher Name</label>
            <input
              class={editable ? "form-control" : " form-control-plaintext"}
              id="publisher_name"
              name="publisher_name"
              readonly={!editable}
              required
              type="text"
              value={data.book.publisher_name}
            />
          </div>
          <div class="col-lg-3 col-md-4">
            <label for="publisher_address">Publisher Address</label>
            <input
              class={editable ? "form-control" : " form-control-plaintext"}
              id="publisher_address"
              name="publisher_address"
              readonly={!editable}
              type="text"
              value={data.book.publisher_address}
            />
          </div>
          <div class="col-lg-3 col-md-4">
            <label for="languages">Languages</label>
            <input
              class={editable ? "form-control" : " form-control-plaintext"}
              id="languages"
              name="languages"
              readonly={!editable}
              type="text"
              value={data.book.languages.join(", ")}
            />
          </div>
          <div class="col-12">
            <label for="remarks">Remarks</label>
            <textarea
              class={editable ? "form-control" : " form-control-plaintext"}
              id="remarks"
              name="remarks"
              readonly={!editable}
            ></textarea>
          </div>
          <div class="col-6">
            <div class="form-check">
              <input
                class="form-check-input"
                disabled={!editable}
                id="reference"
                name="reference"
                type="checkbox"
                value={data.book.reference}
              />
              <label class="form-check-label" for="reference">Reference </label>
            </div>
          </div>
          <div class="col-6">
            <div class="form-check">
              <input
                class="form-check-input"
                disabled={!editable}
                id="cd_available"
                name="cd_available"
                type="checkbox"
                value={data.book.cd_available}
              />
              <label class="form-check-label" for="cd_available"
                >CD Available</label
              >
            </div>
          </div>
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
        <BorrowTable {borrows} {handler} />
      </div>
    </div>
  </div>
</body>
