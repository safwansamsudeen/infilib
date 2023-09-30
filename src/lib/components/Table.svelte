<script>
	import { onMount } from 'svelte';
	import Toast from '$lib/components/Toast.svelte';

	export let data,
		columns,
		updateUrl,
		id = 'id',
		hiddenColumns = [0],
		columnHeaders = columns.map(({ name }) => name),
		actions = [];

	onMount(async () => {
		const { default: Handsontable } = await import('handsontable');

		function actionButtons(instance, td, row, col, prop, value, cellProperties) {
			Handsontable.renderers.TextRenderer.apply(this, arguments);
			let html = '<div class="btn-group btn-group-sm p-1 mx-auto" role="group">';
			for (let [label, url, form] of actions) {
				if (form) {
					html += `<form action="${url}" method="POST"><input name=${id} type="hidden" value="${data[row][id]}" /><button type="submit" class="btn btn-outline-primary">${label}</button></form>`;
				} else {
					html =
						html +
						`<a type="button" class="btn btn-outline-primary" href="/${url}/${data[row][id]}">${label}</a>`;
				}
			}
			td.innerHTML = html + '</div>';
		}

		const table = new Handsontable(document.getElementById('table'), {
			data,
			licenseKey: 'non-commercial-and-evaluation',
			colHeaders: columnHeaders.concat(['Actions']),
			rowHeaders: function (index) {
				return data[index][id];
			},
			stretchH: 'all',
			columns: columns
				.map(({ id, readOnly }) => ({ data: id, readOnly }))
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
					if (oldValue === value) {
						continue;
					}
					fetch('/' + updateUrl, {
						method: 'PATCH',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({ id: data[row].id, property, value })
					}).then(async (response) => {
						const { success, status_code } = await response.json();
						if (!success) {
							new Toast({
								target: document.querySelector('.container'),
								props: {
									msg:
										'Error updating ' +
										property +
										' of ' +
										data[row].id +
										' to ' +
										value +
										'status_code: ' +
										status_code,
									type: 'danger'
								}
							});
						} else {
							new Toast({
								target: document.querySelector('.container'),
								props: {
									msg: 'Updated ' + property + ' of ' + data[row].id + ' to ' + value,
									type: 'success'
								}
							});
						}
					});
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
