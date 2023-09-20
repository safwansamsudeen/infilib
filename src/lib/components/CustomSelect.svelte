<script>
    import Select from "svelte-select";

    export let id, label, items = [], multiple = false, creatable = false, required = true;
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
{#if creatable}
    <Select
            --item-height="auto"
            --item-line-height="auto"
            bind:filterText
            bind:value
            id="{id}"
            {items}
            {multiple}
            {required}
            name="{id}"
            on:change={handleChange} on:filter={handleFilter}
    >
        <div class="item" let:item slot="item">
            {item.created ? `Add new ${id}: ` : ''}
            {item.label}
        </div>
    </Select>
{:else}
    <Select {id} {multiple} {required} {items} bind:value/>
{/if}
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
