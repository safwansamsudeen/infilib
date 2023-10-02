<script>
    import {onMount} from 'svelte';
    import Toast from '$lib/components/Toast.svelte';
    import {capitalize} from '$lib/helpers.js';

    export let data,
        columns,
        updateUrl,
        id = 'id',
        hiddenColumns = columns
            .map(({id: colId, important}, index) => (colId !== id && important) ? false : index)
            .filter((x, i) => x !== false),
        columnHeaders = columns.map(({name, id}) => name),
        actions = [];

    const columnMap = {
        number: 'numeric',
        hidden: 'text',
        textarea: 'text',
        email: 'text'
    };

    onMount(async () => {
        const {default: Handsontable} = await import('handsontable');
        // const { MultiSelectEditor, MultiSelectRenderer } = await import('handsontable-multi-select');

        columns = columns
            .map(({id, type, items}) => {
                if (type === 'select') {
                    return {
                        data: id,
                        editor: 'select',
                        selectOptions: items
                    };
                }
                return {data: id, type: columnMap[type] || type || 'text'};
            })
            .concat({
                renderer: actionButtons,
                readOnly: true,
                className: 'htCenter'
            });

        function actionButtons(instance, td, row) {
            Handsontable.renderers.TextRenderer.apply(this, arguments);
            let html = '<div class="btn-group btn-group-sm p-1 mx-auto" role="group">';
            for (let [label, url] of actions) {
                html =
                    html +
                    `<a type="button" class="btn btn-outline-primary" href="/${url}/${data[row][id]}">${label}</a>`;
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
            columns,
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
                        body: JSON.stringify({[id]: data[row][id], property, value})
                    })
                        .then(async (response) => {
                            const {success, error, status_code} = await response.json();
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
                                            ', with a status code of: ' +
                                            status_code,
                                        type: 'danger'
                                    }
                                });
                                console.log(error);
                            } else {
                                new Toast({
                                    target: document.querySelector('.container'),
                                    props: {
                                        msg: 'Updated ' + property + ' of ' + data[row].id + ' to ' + value,
                                        type: 'success'
                                    }
                                });
                            }
                        })
                        .catch((error) => {
                            new Toast({
                                target: document.querySelector('.container'),
                                props: {
                                    msg: 'Error updating ' + property + ' of ' + data[row].id + ' to ' + value,
                                    type: 'danger'
                                }
                            });
                            console.log(error)
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
