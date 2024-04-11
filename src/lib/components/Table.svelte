<script>
	import { findValue, date } from '$lib/helpers';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	export let data,
		columns,
		actions = [],
		id = 'table',
		dateFormatter = date,
		actionsHtml = (_, config) => {
			const row = data[+config[0].content - 1];
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

	const TYPE_FORMATTERS = {
		checkbox: (value) =>
			`<div class=text-center><i class="bi bi-${value ? 'check' : 'x'}"></i></div>`,
		select: function (value, _, { id: column_id }) {
			const {
				opts: { multiple, goto, label }
			} = findValue(columns, column_id);

			const linkWrapper = (value) =>
				`<a class="text-dark" href="${goto || column_id + '/'}${value.id}">${
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
		},
		date: dateFormatter
	};

	onMount(() => {
		const datatable = new DataTable('#' + id, {
			columns: [
				...columns
					.filter(
						({ important, opts }) =>
							(important || opts?.tableVisible) && opts?.tableVisible !== false
					)
					.map(({ id, name, type }) => ({
						id,
						name,
						format: TYPE_FORMATTERS[type] || ((value) => value),
						sortable: type !== 'select'
					})),
				{ name: 'Actions', format: actionsHtml }
			],
			data: data,
			cellHeight: 48
		});
	});
</script>

<table {id} style="margin: 10px auto; "></table>
