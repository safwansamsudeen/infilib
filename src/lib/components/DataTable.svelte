<script>
    export let columns, data, id;
    import "frappe-datatable/dist/frappe-datatable.min.css";
    import DataTable from "frappe-datatable";
    import {invalidateAll} from "$app/navigation";

    let datatable;
    $: data, datatable = new DataTable("#" + id, {
        columns: columns.map(({name, label}) => ({
            id: name,
            name: label || name[0].toUpperCase() + name.slice(1)
        })),
        data,
        getEditor(colIndex, rowIndex, value, parent, column, row) {
            const input = document.createElement('input')
            parent.appendChild(input);
            return {
                initValue(value) {
                    input.focus();
                    input.value = value;
                },
                // called when cell value is set
                async setValue(value) {
                    input.value = value;
                    let body = {id: row[1].content}
                    let response;
                    if (value === "") {
                        if (confirm("Are you sure you want to delete this record?")) {
                            response = await fetch("?/", {
                                method: 'DELETE',
                                body: JSON.stringify(body),
                                type: 'json'
                            });
                        } else {
                            await window.location.reload()
                        }
                    } else {
                        response = await fetch("?/", {
                            method: 'PATCH',
                            body: JSON.stringify({...body, value, property: column.id}),
                            type: 'json'
                        });

                    }

                    let res = await response.json();
                    if (res.type === 'success') {
                        await invalidateAll()
                        datatable.showToastMessage("Updated!", 2)
                    } else {
                        datatable.showToastMessage("Error!", 2)
                    }

                },
                getValue() {
                    return input.value;
                }
            }
        }
    });
</script>
