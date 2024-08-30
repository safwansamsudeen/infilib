<script>
	export let data;

	import Form from '$lib/components/Form.svelte';
	import { findValue } from '$lib/helpers';
	import { page } from '$app/stores';

	let columnsCopy = structuredClone(data.columns);

	if (data.library.settings.is_free) columnsCopy = columnsCopy.filter(({ id }) => id != 'price');
	findValue(columnsCopy, 'user').opts.onChange = (e) =>
		window.location.assign(`./${$page.params.id}?user=${e.detail.id}`);
	findValue(columnsCopy, 'item').opts.onChange = (e) => {
		const userId = new URLSearchParams(window.location.search).get('user');
		window.location.assign(`./${e.detail.id}${userId && '?user=' + userId}`);
	};
</script>

<svelte:head>
	<title>Borrow {data.item?.title || ''}</title>
</svelte:head>`
<div class="text-column text-center">
	<h1>{data.user?.name || ''} Borrowing <em>{data.item?.title || ''}</em></h1>
</div>

<body>
	<div class="container">
		<input form="borrow-form" name="mark_id" type="hidden" value={data.mark_id} />
		<Form action="borrow" columns={columnsCopy} message="" />
	</div>
</body>
