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
            <label for="_id">Admission Number</label>
            <input class="form-control" type="number" id="_id" name="_id"/>
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
    {#each data.members as {_id}}
    <form method="POST" action="?/update" id="form-{_id}" use:enhance={() => {
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
        {#each data.members as {name, _id, grade, section}}
            <tr id="{_id}-data">
                <td>
                    <input
                            class="form-control-plaintext"
                            type="text"
                            value="{_id}"
                            name="_id"
                            form="form-{_id}"
                            readonly
                    />
                </td>
                <td>
                    <input
                            class="form-control"
                            type="text"
                            value="{name}"
                            id="{_id}-name"
                            name="name"
                            form="form-{_id}"
                    />
                </td>
                <td>
                    <input
                            class="form-control"
                            type="text"
                            value="{grade}"
                            id="{_id}-grade"
                            name="grade"
                            form="form-{_id}"
                    />
                </td>
                <td>
                    <input
                            class="form-control"
                            type="text"
                            value="{section}"
                            id="{_id}-section"
                            name="section"
                            form="form-{_id}"
                    />
                </td>
                <td>
                    <div class="btn-group dropdown">
                        <button type="button" class="btn btn-outline-success dropdown-toggle"
                                data-bs-toggle="dropdown" aria-expanded="false">Actions
                        </button>
                        <ul class="dropdown-menu">
                            <li>
                                <button class="dropdown-item" type="submit" form="form-{_id}">Confirm</button>
                            </li>
                            <li><a href="#" class="dropdown-item text-danger" on:click={() => {
                                fetch('?/delete', {
                                    method: 'POST',
                                    body: JSON.stringify({ _id })
                                  }).then(() => {
                                    document.getElementById(`${_id}-data`).remove()
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

