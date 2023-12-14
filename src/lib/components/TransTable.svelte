<script>
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import Table from '$lib/components/Table.svelte';

	export let data, columns;
	function actionsHtml(value, row) {
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

<Table {actionsHtml} {columns} {data} />
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
