<script>
	export let data;
	import Form from '$lib/components/Form.svelte';
</script>

<svelte:head>
	<title>Borrow {data.item?.title || ''}</title>
</svelte:head>
<div class="text-column text-center">
	<h1>{data.user?.name || ''} Borrowing <em>{data.item?.title || ''}</em></h1>
</div>

<body>
	<div class="container">
		<input form="borrow-form" name="mark_id" type="hidden" value={data.mark_id} />
		<Form action="borrow" columns={data.columns} />
	</div>
</body>
