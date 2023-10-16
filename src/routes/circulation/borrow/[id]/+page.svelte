<script>
	export let data;
	import AddForm from '$lib/components/AddForm.svelte';
</script>

<svelte:head>
	<title>Borrow {data.item.title}</title>
</svelte:head>
<div class="text-column text-center">
	<h1>Borrowing <em>{data.item.title}</em></h1>
</div>

<body>
	<div class="container">
		<!--    <form action="?/borrow" method="post" use:enhance>-->
		<!--        <div class="row">-->
		<!--        {#each data.columns as column}-->
		<!--            <Input {...column} />-->
		<!--        {/each}-->
		<!--</div>-->
		<!--        <div class="d-grid gap-2 my-3">-->
		<!--            <input class="btn btn-outline-success" type="submit" value="Borrow"/>-->
		<!--        </div>-->
		<!--    </form>-->
		<AddForm action="borrow" addTogglable={false} columns={data.columns} />
	</div>
	<script>
		// Set borrowed date to today
		document.getElementById('issued_at').valueAsDate = new Date();
		// Add 7 days to borrowed date
		document.getElementById('due_at').valueAsDate = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000);
	</script>
</body>
