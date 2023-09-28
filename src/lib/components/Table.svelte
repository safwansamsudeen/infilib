<script>
    import {onMount} from "svelte";
    import Toast from "$lib/components/Toast.svelte";

    export let data, columns, url, id = 'id', hiddenColumns = [0], columnHeaders = columns.map(({name}) => name)

    onMount(async () => {
        const {default: Handsontable} = await import("handsontable");

        const table = new Handsontable(document.getElementById('table'), {
            data,
            licenseKey: 'non-commercial-and-evaluation',
            colHeaders: columnHeaders,
            rowHeaders: function (index) {
                return data[index][id];
            },
            columns: columns.map(({id, readOnly}) => ({data: id, readOnly})),
            hiddenColumns: {
                columns: hiddenColumns,
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
                    const [row, property, _, value] = change;
                    fetch('/' + url, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({id: data[row].id, property, value})
                    }).then(async response => {
                        const {success, status_code} = await response.json()
                        if (!success) {
                            new Toast({
                                target: document.querySelector('.container'),
                                props: {
                                    msg: 'Error updating ' + property + ' of ' + data[row].id + ' to ' + value,
                                    type: 'danger'
                                }
                            })
                        } else {
                            new Toast({
                                target: document.querySelector('.container'),
                                props: {
                                    msg: 'Updated ' + property + ' of ' + data[row].id + ' to ' + value,
                                    type: 'success'
                                }
                            })
                        }
                    })
                }
            },
        });
    })

</script>
<div class="w-100" id="table"></div>

<link href="https://cdn.jsdelivr.net/npm/handsontable/dist/handsontable.full.min.css" rel="stylesheet"/>
