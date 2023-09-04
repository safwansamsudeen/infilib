<script>
  import { invalidateAll } from "$app/navigation";
  import { Datatable, Th, ThFilter } from "@vincjo/datatables";

  export let handler, borrows;
</script>

<Datatable {handler}>
  <table class="table">
    <thead>
      <tr>
        <Th {handler} orderBy="student">Student</Th>
        <Th {handler} orderBy="book">Book</Th>
        <Th {handler} orderBy="borrowed">Borrowed</Th>
        <Th {handler} orderBy="due_on">Due on</Th>
        <Th {handler} orderBy="returned_on">Returned on</Th>
        <Th {handler} orderBy="comments">Comments</Th>
        <th>Actions</th>
      </tr>
      <tr>
        <ThFilter {handler} filterBy="member" />
        <ThFilter {handler} filterBy="book" />
        <ThFilter {handler} filterBy="borrowed" />
        <ThFilter {handler} filterBy="due_on" />
        <ThFilter {handler} filterBy="returned_on" />
        <ThFilter {handler} filterBy="comments" />
      </tr>
    </thead>
    <tbody>
      {#each $borrows as { _id, book, member, borrowed, due_on, returned, comments }}
        <tr class="{_id}-data">
          <td
            ><a href="/members/{member._id}"
              >{member.name} ({member.grade}-{member.section})</a
            ></td
          >
          <td><a href="/books/{book._id}">{book.title} ({book._id})</a></td>
          <td>{borrowed.toDateString()}</td>
          <td>{due_on.toDateString()}</td>
          <td class:text-danger={new Date() > due_on}
            >{returned?.toDateString() || "NA"}</td
          >
          <td>
            {#if !returned}
              <label for="comments"></label><input
                type="text"
                id="comments"
                name="comments"
                value={comments}
                form="form-{_id}"
              />
            {:else}
              {comments}
            {/if}
          </td>

          <td>
            {#if !returned}
              <div class="btn-group dropend">
                <button
                  type="submit"
                  form="form-{_id}"
                  class="btn btn-outline-success"
                >
                  Return
                </button>
                <button
                  type="button"
                  class="btn btn-outline-success dropdown-toggle dropdown-toggle-split"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                ></button>
                <ul class="dropdown-menu">
                  <li>
                    <a
                      href="#"
                      class="dropdown-item text-danger"
                      on:click={() => {
                        fetch("?/delete", {
                          method: "POST",
                          body: JSON.stringify({ _id }),
                        }).then(() => {
                          invalidateAll();
                        });
                      }}>Delete</a
                    >
                  </li>
                </ul>
              </div>
            {:else}
              <button
                class="btn btn-danger"
                on:click={() => {
                  fetch("?/delete", {
                    method: "POST",
                    body: JSON.stringify({ _id }),
                  }).then(() => {
                    invalidateAll();
                  });
                }}
                >Delete
              </button>
            {/if}
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</Datatable>
