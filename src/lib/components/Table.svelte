<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { findValue, date } from '$lib/helpers';

	export let data,
		columns,
		actions = [],
		id = 'table',
		actionsHtml = (_, row) => {
			let html = '<div class="btn-group btn-group-sm w-100" role="group">';
			for (let [label, url, condition] of actions) {
				if (condition && condition(row)) {
					continue;
				}
				html += `<a type="button" class="btn btn-outline-primary" href="/${
					$page.params.library
				}/${url}${url.endsWith('=') ? '' : '/'}${row.id}">${label}</a>`;
			}
			return html + '</div>';
		};
	onMount(async () => {
		await import('https://code.jquery.com/jquery-3.7.1.min.js');
		await import('https://unpkg.com/bootstrap-table@1.22.1/dist/bootstrap-table.min.js');
		let $table = jQuery(`#${id}`);
		window.actionsHtml = actionsHtml;
		window.checkbox = function (value) {
			return `<div class=text-center><i class="bi bi-${value ? 'check' : 'x'}"></i></div>`;
		};
		window.select = function (value) {
			const {
				id: columnName,
				opts: { multiple, goto, label }
			} = findValue(columns, this.field);
			const linkWrapper = (value) =>
				`<a class="text-dark" href="${goto || columnName + '/'}${value.id}">${
					value.name || value[label]
				}</a>`;
			if (goto !== false) {
				if (multiple) {
					return value.map(linkWrapper).join(', ');
				} else {
					return linkWrapper(value);
				}
			} else {
				if (multiple) {
					return value.map((val) => val.name || val[label] || value).join(', ');
				} else {
					// All this stuff because of item title and then gender.
					return value.name || value[label] || value;
				}
			}
		};
		window.date = (val) => date(val);
		$table.bootstrapTable({ data });
	});
</script>

<table
	data-pagination="true"
	data-search="true"
	data-show-columns="true"
	data-show-columns-toggle-all="true"
	data-show-fullscreen="true"
	{id}
>
	<thead>
		<tr>
			{#each columns as { id, name, important, type, opts }}
				{#if (important || opts?.tableVisible) && opts?.tableVisible !== false}
					{#if type === 'checkbox'}
						<th data-field={id} data-formatter="checkbox">{name}</th>
					{:else if type === 'select'}
						<th data-field={id} data-formatter="select">{name}</th>
					{:else if type === 'date'}
						<th data-field={id} data-formatter="date" data-sortable="true">{name}</th>
					{:else}
						<th data-field={id} data-sortable="true">{name}</th>
					{/if}
				{/if}
			{/each}
			<th data-field="actions" data-formatter="actionsHtml">Actions</th>
		</tr>
	</thead>
	<tbody></tbody>
</table>

<style>
	@import 'https://unpkg.com/bootstrap-table@1.22.1/dist/bootstrap-table.min.css';
</style>
