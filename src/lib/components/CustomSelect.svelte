<script>
	import Select from 'svelte-select';

	export let id,
		items = [],
		multiple = false,
		creatable = true,
		required = true,
		value = null;
	let filterText = '';

	function handleFilter(e) {
		if (multiple && value?.find((i) => i.label === filterText)) return;
		if (e.detail.length === 0 && filterText.length > 0) {
			const prev = items.filter((i) => !i.created);
			items = [...prev, { value: filterText, label: filterText, created: true }];
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
		bind:filterText
		bind:value
		{id}
		{items}
		{multiple}
		{required}
		name={id}
		on:change={handleChange}
		on:filter={handleFilter}
	>
		<div let:item slot="item">
			{item.created ? `Add new ${id}: ` : ''}
			{item.label}
		</div>
	</Select>
{:else}
	<Select {id} name={id} {multiple} {required} {items} bind:value />
{/if}
