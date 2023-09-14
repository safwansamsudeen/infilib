<script>
    export let columns, data;
    import "frappe-datatable/dist/frappe-datatable.min.css";

    import DataTable from "frappe-datatable";
    import {deserialize} from "$app/forms";
    import {invalidateAll} from "$app/navigation";

    let datatable;
    $: data, datatable = new DataTable("#users", {
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
                    const body = new FormData()
                    body.append('id', row[1].content)
                    let response;
                    if (value === "") {
                        if (confirm("Are you sure you want to delete this member")) {
                            response = await fetch("?/delete", {
                                method: 'POST',
                                body
                            });
                        }
                    } else {
                        body.append('property', column.id)
                        body.append('value', value)
                        response = await fetch("?/update", {
                            method: 'POST',
                            body
                        });
                    }


                    const result = deserialize(await response.text());

                    if (result.type === 'success') {
                        await invalidateAll()
                        datatable.showToastMessage("Updated!", 2)
                    } else {
                        datatable.showToastMessage("Error!", 2)
                        await window.reload()
                    }
                },
                getValue() {
                    return input.value;
                }
            }
        }
    });
</script>
