<svelte:head>
    <title>Members</title>
    <meta name="description" content="About this app"/>
</svelte:head>

<script>
    export let data;
    import {enhance} from '$app/forms';
</script>
<div class="text-column text-center">
    <h1>About this app</h1>
</div>

<body>
<div class="container">
    <form action="?/create" method="post" use:enhance>
        <div class="mb-3">
            <label for="name">Name</label>
            <input
                    class="form-control"
                    type="text"
                    id="name"
                    name="name"
            />
        </div>
        <div class="mb-3">
            <label for="admn_no">Admission Number</label>
            <input class="form-control" type="number" id="admn_no" name="admn_no"/>
        </div>
        <div class="mb-3">
            <label for="grade">Grade</label>
            <input class="form-control" type="text" id="grade" name="grade"/>
        </div>
        <div class="mb-3">
            <label for="section">Section</label>
            <input class="form-control" type="text" id="section" name="section"/>
        </div>
        <div class="d-grid gap-2 my-3">
            <input class="btn btn-outline-success" type="submit" value="Add"/>
        </div>
    </form>
    {#each data.members as {admn_no}}
    <form method="POST" action="?/update" id="form-{admn_no}" use:enhance={() => {
    return async ({ update }) => {
      update({ reset: false });
    };
  }}></form>
    {/each}
    <table class="table">
        <thead>
        <tr>
            <th>Admission Number</th>
            <th>Name</th>
            <th>Grade</th>
            <th>Section</th>
        </tr>
        </thead>
        <tbody>
        {#each data.members as {name, admn_no, grade, section}}
            <tr id="{admn_no}-data">
                <td>
                    <input
                            class="form-control-plaintext"
                            type="text"
                            value="{admn_no}"
                            name="admn_no"
                            form="form-{admn_no}"
                            readonly
                    />
                </td>
                <td>
                    <input
                            class="form-control"
                            type="text"
                            value="{name}"
                            id="{admn_no}-name"
                            name="name"
                            form="form-{admn_no}"
                    />
                </td>
                <td>
                    <input
                            class="form-control"
                            type="text"
                            value="{grade}"
                            id="{admn_no}-grade"
                            name="grade"
                            form="form-{admn_no}"
                    />
                </td>
                <td>
                    <input
                            class="form-control"
                            type="text"
                            value="{section}"
                            id="{admn_no}-section"
                            name="section"
                            form="form-{admn_no}"
                    />
                </td>
                <td>
                    <div class="btn-group dropdown">
                        <button type="button" class="btn btn-outline-success dropdown-toggle"
                                data-bs-toggle="dropdown" aria-expanded="false">Actions
                        </button>
                        <ul class="dropdown-menu">
                            <li>
                                <button class="dropdown-item" type="submit" form="form-{admn_no}">Confirm</button>
                            </li>
                            <li><a href="#" class="dropdown-item text-danger" on:click={() => {
                                fetch('?/delete', {
                                    method: 'POST',
                                    body: JSON.stringify({ admn_no })
                                  }).then(() => {
                                    document.getElementById(`${admn_no}-data`).remove()
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

