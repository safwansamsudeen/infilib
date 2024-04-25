<script>
	import { page } from '$app/stores';
	import { date } from '$lib/helpers';
	import { enhance } from '$app/forms';
	import dayjs from 'dayjs';
	import Table from '$lib/components/Table.svelte';

	export let data, columns;
	if ($page.data.library.settings.is_free) columns = columns.filter(({ id }) => id != 'price');
	function actionsHtml(_, config) {
		const row = data[+config[0].content - 1];
		return `
				<div class="btn-group btn-group-sm w-100" role="group">
					${
						!row.returned_at
							? `<button type="submit" class="btn btn-outline-success" form="${row.id}-return-form">Return</button>`
							: ''
					}
					<button type="submit" class="btn btn-outline-danger" form="${row.id}-delete-form">Delete</button>
				</div>
			`;
	}
</script>

<Table
	{actionsHtml}
	{columns}
	data={data.map((rec) => ({ ...rec, comments: rec.comments ? rec.comments : '' }))}
	dateFormatter={(v, { returned_at, due_at }) => {
		let date_str = date(v);
		const today = dayjs();
		if (!returned_at && today > due_at) {
			const overdue = today.diff(due_at, 'days');
			let color = overdue > 4 ? 'danger' : overdue > 2 ? 'warning' : 'info';
			return `<div class="text-${color}"">${
				date_str || 'Overdue by ' + overdue + ' day' + (overdue === 1 ? '' : 's')
			}</div>`;
		}
		return date_str || 'NA';
	}}
/>
<div id="transaction-table">
	{#each data as { id, returned_at, comments }}
		{#if !returned_at}
			<form
				action="/{$page.params.library}/circulation?/return"
				method="POST"
				class="d-none"
				id="{id}-return-form"
				use:enhance
			>
				<input name="id" type="hidden" value={id} />
			</form>
		{/if}
		<form
			action="/{$page.params.library}/circulation?/delete"
			method="POST"
			class="d-none"
			id="{id}-delete-form"
			use:enhance
		>
			<input name="id" type="hidden" value={id} />
		</form>
	{/each}
</div>
