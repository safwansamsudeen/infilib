<script>
  export let data;
  import { enhance } from "$app/forms";
  import { DataHandler, Datatable, Th } from "@vincjo/datatables";

  const handler = new DataHandler(data.members, { rowsPerPage: 10 });
  const members = handler.getRows();
  $: data, handler.setRows(data.members);

  let addFormVisible = false;
</script>

<svelte:head>
  <title>Members</title>
  <meta name="description" content="View members " />
</svelte:head>
<div class="text-column text-center">
  <h1>Manage members</h1>
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
        >Add member</label
      >
    </div>
    {#if addFormVisible}
      <form action="?/create" method="post" use:enhance>
        <div class="mb-3">
          <label for="name">Name</label>
          <input
            class="form-control"
            type="text"
            id="name"
            name="name"
            required
          />
        </div>
        <div class="mb-3">
          <label for="_id">Admission Number</label>
          <input
            class="form-control"
            type="number"
            id="_id"
            name="_id"
            required
          />
        </div>
        <div class="mb-3">
          <label for="grade">Grade</label>
          <input
            class="form-control"
            type="text"
            id="grade"
            name="grade"
            required
          />
        </div>
        <div class="mb-3">
          <label for="section">Section</label>
          <input
            class="form-control"
            type="text"
            id="section"
            name="section"
            required
          />
        </div>
        <div class="mb-3">
          <label for="gender">Gender</label>
          <select class="form-select" name="gender" id="gender" required>
            <option value="">Select</option>
            <option value="F">Female</option>
            <option value="M">Male</option>
          </select>
        </div>
        <div class="d-grid gap-2 my-3">
          <input class="btn btn-outline-success" type="submit" value="Add" />
        </div>
      </form>
    {/if}
    {#each data.members as { _id }}
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
            <Th {handler} orderBy="_id">Admission Number</Th>
            <Th {handler} orderBy="name">Name</Th>
            <Th {handler} orderBy="grade">Grade</Th>
            <Th {handler} orderBy="section">Section</Th>
            <Th {handler} orderBy="section">Gender</Th>
          </tr>
        </thead>
        <tbody>
          {#each $members as { name, _id, grade, section, gender }}
            <tr id="{_id}-data">
              <td>
                <input
                  class="form-control-plaintext"
                  type="text"
                  value={_id}
                  name="_id"
                  form="form-{_id}"
                  readonly
                />
              </td>
              <td>
                <input
                  class="form-control"
                  type="text"
                  value={name}
                  name="name"
                  form="form-{_id}"
                />
              </td>
              <td>
                <input
                  class="form-control"
                  type="text"
                  value={grade}
                  name="grade"
                  form="form-{_id}"
                />
              </td>
              <td>
                <input
                  class="form-control"
                  type="text"
                  value={section}
                  name="section"
                  form="form-{_id}"
                />
              </td>
              <td>
                <select class="form-select" name="gender" form="form-{_id}">
                  <option value="F" selected={gender === "F"}>Female</option>
                  <option value="M" selected={gender === "M"}>Male</option>
                </select>
              </td>
              <td>
                <div class="btn-group dropdown">
                  <a
                    href="/members/{_id}/"
                    class="btn btn-outline-success">Detail</a
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
                        form="form-{_id}">Confirm</button
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
