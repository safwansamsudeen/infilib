<script>
    export let data;
    import {enhance} from '$app/forms';
</script>

<svelte:head>
    <title>Borrow {data.book.title}</title>
</svelte:head>

<div class="text-column text-center">
    <h1>Borrowing <em>{data.book.title}</em></h1>
</div>

<body>
<div class="container">
    <form action="?/borrow" method="post" use:enhance>
        <div class="mb-3">
            <label for="title">Title</label>
            <input
                    class="form-control"
                    type="text"
                    id="title"
                    name="title"
                    value="{data.book.title}"
                    readonly
            />
        </div>
        <div class="mb-3">
            <label for="member">Member</label>
            <select class="form-select" id="member" name="member">
                {#each data.members as {roll_no, name}}
                    <option value="{roll_no}">{roll_no} {name}</option>
                {/each}
            </select>
        </div>

        <div class="mb-3">
            <label for="borrowed">Borrowed On</label>
            <input class="form-control" type="date" id="borrowed" name="borrowed" value=""/>
        </div>
        <div class="mb-3">
            <label for="due_on">Due On</label>
            <input class="form-control" type="date" id="due_on" name="due_on" value=""/>
        </div>
        <div class="mb-3">
            <label for="comments">Comments</label>
            <textarea class="form-control" id="comments" name="comments" />
        </div>
        <div class="d-grid gap-2 my-3">
            <input class="btn btn-outline-success" type="submit" value="Submit"/>
        </div>
    </form>
</div>
<script>
    // Set borrowed date to today
    document.getElementById('borrowed').valueAsDate = new Date();
    // Add 7 days to borrowed date
    document.getElementById('due_on').valueAsDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
</script>
</body>

