<script>
	import { onMount } from 'svelte';
	import Toast from '$lib/components/Toast.svelte';

	export let data,
		columns,
		hiddenColumns = [0],
		columnHeaders = columns.map(({ name }) => name);

	onMount(async () => {
		const { default: Handsontable } = await import('handsontable');

		function actionButtons(instance, td, row, col, prop, value, cellProperties) {
			Handsontable.renderers.TextRenderer.apply(this, arguments);
			td.innerHTML = `
				<form action="/circulation?/return" method="POST" class="d-none" id="${row}-return-form">
    				<input id="${row}-comments-return" name="comments" type=hidden value="${data[row].comments}" />
    				<input name="id" type="hidden" value="${data[row].id}"/>
				</form>
				<form action="/circulation?/delete" method="POST" class="d-none" id="${row}-delete-form">
    				<input name="id" type="hidden" value="${data[row].id}"/>
				</form>
				<div class="btn-group btn-group-sm p-1 mx-auto" role="group">
					<button type="submit" class="btn btn-outline-success" form="${row}-return-form">Return</button>
					<button type="submit" class="btn btn-outline-danger" form="${row}-delete-form">Delete</button>
				</div>
			`;
		}

		const table = new Handsontable(document.getElementById('table'), {
			data,
			licenseKey: 'non-commercial-and-evaluation',
			colHeaders: columnHeaders.concat(['Actions']),
			rowHeaders: function (index) {
				return data[index].id;
			},
			stretchH: 'all',
			columns: columns
				.map(({ id }) => ({ data: id }))
				.concat({
					renderer: actionButtons,
					readOnly: true,
					className: 'htCenter'
				}),
			hiddenColumns: {
				columns: hiddenColumns
			},
			search: true,
			dropdownMenu: true,
			filters: true,
			afterChange: function (changes, source) {
				// don't save loading of data
				if (source === 'loadData') {
					return;
				}
				// in case of bulk changes
				for (let change of changes) {
					const [row, property, oldValue, value] = change;
					if (property === 'comments' && oldValue !== value) {
						document.querySelector(`#${row}-comments-return`).value = value;
					}
				}
			}
		});
	});
</script>

<div class="w-100 my-4" id="table"></div>

<link
	href="https://cdn.jsdelivr.net/npm/handsontable/dist/handsontable.full.min.css"
	rel="stylesheet"
/>
