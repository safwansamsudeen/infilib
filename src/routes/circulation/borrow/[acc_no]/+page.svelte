<script>
    import Input from "$lib/components/Input.svelte";

    export let data;
    import {enhance} from "$app/forms";
</script>

<svelte:head>
    <title>Borrow {data.borrowable.title}</title>
</svelte:head>
<div class="text-column text-center">
    <h1>Borrowing <em>{data.borrowable.title}</em></h1>
</div>

<body>
<div class="container">
    <form action="?/borrow" method="post" use:enhance>
        <div class="row g-3">
            <Input label="Borrowable"
                   opts="{{disabled: true, value: `${data.borrowable.acc_no} ${data.borrowable.title}`}}"/>
            <Input creatable={false} label="User" name="user_id" type="select" values="{data.users}"/>
            <Input name="issued_at" type="date"/>
            <Input name="due_at" type="date"/>
        </div>
        <div class="mb-3">
            <label for="comments">Comments</label>
            <textarea class="form-control" id="comments" name="comments"></textarea>
        </div>
        <div class="d-grid gap-2 my-3">
            <input class="btn btn-outline-success" type="submit" value="Submit"/>
        </div>
    </form>
</div>
<script>
    // Set borrowed date to today
    document.getElementById("issued_at").valueAsDate = new Date();
    // Add 7 days to borrowed date
    document.getElementById("due_at").valueAsDate = new Date(
        Date.now() + 4 * 24 * 60 * 60 * 1000,
    );
</script>
</body>
