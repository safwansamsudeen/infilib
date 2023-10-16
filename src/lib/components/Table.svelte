<script>
	import { onMount } from 'svelte';
	import Toast from '$lib/components/Toast.svelte';
	import { page } from '$app/stores';

	export let data,
		columns,
		updateUrl = '',
		hiddenColumns = columns
			.map(({ id, important, type }, index) =>
				id === 'id' || important === false || type === 'heading' ? index : false
			)
			.filter((x) => x !== false),
		columnHeaders = columns.map(({ name }) => name),
		actions = [],
		actionButtonsFunc = null,
		afterChangeFunc = null,
		table = null;

	const columnMap = {
		number: 'numeric',
		hidden: 'text',
		heading: 'text',
		textarea: 'text',
		email: 'text'
	};

	onMount(async () => {
		const { default: MultiSelectEditor } = await import('$lib/MultiSelectEditor.js');
		const { default: Handsontable } = await import('handsontable');

		columns = columns
			.map(({ id, type, opts }) => {
				if (type === 'select') {
					return {
						data: id,
						renderer: 'MultiSelectRenderer',
						editor: MultiSelectEditor,
						opts
					};
				}
				return { data: id, type: columnMap[type] || type || 'text', ...opts };
			})
			.concat({
				renderer: actionButtonsFunc || actionButtons,
				readOnly: true,
				className: 'htCenter'
			});

		function actionButtons(instance, td, row) {
			Handsontable.renderers.TextRenderer.apply(this, arguments);
			let html = '<div class="btn-group btn-group-sm p-1 mx-auto" role="group">';
			for (let [label, url, condition] of actions) {
				if (condition && condition(data[row])) {
					continue;
				}
				html =
					html +
					`<a type="button" class="btn btn-outline-primary" href="/${url}/${data[row].id}">${label}</a>`;
			}
			td.innerHTML = html + '</div>';
		}

		table = new Handsontable(document.getElementById('table'), {
			data,
			licenseKey: 'non-commercial-and-evaluation',
			colHeaders: columnHeaders.concat(['Actions']),
			rowHeaders: function (index) {
				return data[index].id;
			},
			stretchH: 'all',
			width: '100%',
			height: '100%',
			columns,
			hiddenColumns: {
				columns: hiddenColumns
			},
			search: true,
			dropdownMenu: true,
			filters: true,
			afterChange:
				afterChangeFunc ||
				function (changes, source) {
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
						console.log('Updating');
						fetch('/' + updateUrl, {
							method: 'PATCH',
							headers: {
								'Content-Type': 'application/json'
							},
							body: JSON.stringify({
								id: data[row].id,
								property,
								value,
								type: $page.url.searchParams.get('show')
							})
						})
							.then(async (response) => {
								const { success } = await response.json();
								if (!success) {
									new Toast({
										target: document.querySelector('.toast-container'),
										props: {
											msg: `Error updating "${property}" of ${data[row].id} to ${
												value.label ?? value
											}.`,
											type: 'danger'
										}
									});
								} else {
									new Toast({
										target: document.querySelector('.toast-container'),
										props: {
											msg: `Updated "${property}" of ${data[row].id} to ${value.label ?? value}`,
											type: 'success'
										}
									});
								}
							})
							.catch((error) => {
								new Toast({
									target: document.querySelector('.toast-container'),
									props: {
										msg: `Error updating "${property}" of ${data[row].id} to ${
											value.label ?? value
										}.`,
										type: 'danger'
									}
								});
								console.log(error);
							});
					}
				}
		});
	});
</script>

<div style="height: 500px;">
	<div class="toast-container"></div>
	<div class="my-4 h-50" id="table"></div>
</div>

<link
	href="https://cdn.jsdelivr.net/npm/handsontable/dist/handsontable.full.min.css"
	rel="stylesheet"
/>
