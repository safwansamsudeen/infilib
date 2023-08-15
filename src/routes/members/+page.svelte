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
            <label for="roll_no">Roll Number</label>
            <input class="form-control" type="integer" id="roll_no" name="roll_no"/>
        </div>
        <div class="mb-3">
            <label for="class">Class</label>
            <input class="form-control" type="string" id="class" name="class"/>
        </div>
        <input class="form-control" name="type" value="create" hidden/>
        <div class="d-grid gap-2 my-3">
            <input class="btn btn-outline-success" type="submit" value="Add"/>
        </div>
    </form>
    <table class="table">
        <thead>
        <tr>
            <th>Name</th>
            <th>Joined</th>
            <th>Roll Number</th>
        </tr>
        </thead>
        <tbody>
        {#each data.members as {name, roll_no, class_}}
            <tr id="{roll_no}-data">
                <td>
                    <input
                            class="form-control"
                            type="text"
                            value="{name}"
                            id="{roll_no}-name"
                    />
                </td>
                <td>
                    <input
                            class="form-control"
                            type="text"
                            value="{class_}"
                            id="{roll_no}-class"
                    />
                </td>
                <td>{roll_no}</td>
                <td>
                    <div class="btn-group dropdown">
                        <button type="button" class="btn btn-outline-success dropdown-toggle"
                                data-bs-toggle="dropdown" aria-expanded="false">Actions
                        </button>
                        <ul class="dropdown-menu">
                            <li><a href="#" class="dropdown-item" on:click={() => {
                                fetch('?/update', {
                        method: 'POST',
                        body: JSON.stringify({
                          roll_no,
                          name: document.getElementById(`${roll_no}-name`).value,
                          "class_": document.getElementById(`${roll_no}-class`).value,
                        })
                      })
                                }}>Confirm edits</a>
                            </li>
                            <li><a href="#" class="dropdown-item text-danger" on:click={() => {
                                fetch('?/delete', {
                                    method: 'POST',
                                    body: JSON.stringify({ roll_no })
                                  }).then(() => {
                                    document.getElementById(`${roll_no}-data`).remove()
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

