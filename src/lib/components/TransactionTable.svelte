<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	export let promise = undefined,
		data = undefined,
		columns;
	import { enhance } from '$app/forms';
	import Table from '$lib/components/Table.svelte';

	onMount(async () => {
		if (!data) {
			return;
		}
		const { default: Handsontable } = await import('handsontable');
		new Table({
			target: document.getElementById('transaction-table'),
			props: {
				data,
				columns,
				afterChangeFunc: function (changes, source) {
					// don't save loading of data
					if (source === 'loadData') {
						return;
					}
					// in case of bulk changes
					for (let change of changes) {
						const [row, property, oldValue, value] = change;
						if (property === 'comments' && oldValue !== value) {
							document.getElementById(`${data[row].id}-comments-return`).value = value;
						}
					}
				},
				actionButtonsFunc(instance, td, row) {
					Handsontable.renderers.TextRenderer.apply(this, arguments);
					td.innerHTML = `
				<div class="btn-group btn-group-sm p-1 mx-auto" role="group">
					${
						data[row].returned_at === 'Invalid Date'
							? `<button type="submit" class="btn btn-outline-success" form="${data[row].id}-return-form">Return</button>`
							: ''
					}
					<button type="submit" class="btn btn-outline-danger" form="${
						data[row].id
					}-delete-form">Delete</button>
				</div>
			`;
				}
			}
		});
	});
</script>

{#if promise !== undefined}
	{#await promise.data}
		Loading...
	{:then data}
		<svelte:self {columns} {data} />
	{:catch error}
		{error.message}
	{/await}
{:else}
	<div id="transaction-table">
		{#each data as { id, returned_at, comments }}
			{#if returned_at === 'Invalid Date'}
				<form
					action="/{$page.params.library}/circulation?/return"
					method="POST"
					class="d-none"
					id="{id}-return-form"
					use:enhance
				>
					<input id="{id}-comments-return" name="comments" type="hidden" value={comments} />
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
{/if}
