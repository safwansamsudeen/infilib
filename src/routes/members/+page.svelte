<svelte:head>
    <title>Members</title>
    <meta name="description" content="About this app"/>
    <style>
        div.table {
            display: table;
        }

        form.tr, div.tr {
            display: table-row;
        }

        span.td {
            display: table-cell;
        }
    </style>
</svelte:head>

<script>
    export let data;
    import { enhance } from '$app/forms';
</script>
<div class="text-column">
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
            <tr>
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
                    <button class="btn btn-outline-danger delete-button" on:click={() => {
                        document.getElementById(`${roll_no}-type`).value = 'delete';
                        let btn = document.getElementById(`${roll_no}-confirm`);
                        btn.classList.replace("btn-dark", "btn-danger");
                        btn.textContent = "DELETE";
                    }}>❌</button>
                </td>
                <td>
                    <input id="{roll_no}-type" name="{roll_no}-type" value="update" hidden/>
                    <button class="btn btn-dark" id="{roll_no}-confirm" on:click={() => {
                        let type = document.getElementById(`${roll_no}-type`).value
                      fetch('?/update', {
                        method: 'POST',
                        body: JSON.stringify({
                          roll_no,
                          type,
                          name: document.getElementById(`${roll_no}-name`).value,
                          "class_": document.getElementById(`${roll_no}-class`).value,
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

