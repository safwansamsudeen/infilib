<script>
    import Select from "svelte-select";

    export let name, label, items = [], multiple = false;
    let value = null;
    let filterText = '';

    function handleFilter(e) {
        if (multiple && value?.find(i => i.label === filterText)) return;
        console.log(value, filterText)
        if (e.detail.length === 0 && filterText.length > 0) {
            const prev = items.filter((i) => !i.created);
            items = [...prev, {value: filterText, label: filterText, created: true}];
        }
    }

    function handleChange(e) {
        items = items.map((i) => {
            delete i.created;
            return i;
        });
    }
</script>
<div class="col-md-6">
    <label for={name}>{label}</label>
    <Select
            --item-height="auto"
            --item-line-height="auto"
            bind:filterText
            bind:value
            id="{name}"
            {items}
            {multiple}
            name="{name}"
            on:change={handleChange} on:filter={handleFilter}
    >
        <div class="item" let:item slot="item">
            {item.created ? `Add new ${name}: ` : ''}
            {item.label}
        </div>
    </Select>
</div>

<style>
    .item {
        min-height: 12px;
        padding: 15px 0;
        line-height: 16px;
        display: flex;
        line-break: auto;
        white-space: pre-wrap;
        align-items: center;
    }
</style>
