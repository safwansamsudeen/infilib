<svelte:options accessors />

<script>
	import Select from 'svelte-select';

	export let id,
		items = [],
		multiple = false,
		creatable = true,
		required = true,
		value = null,
		disabled = false,
		onChange = () => {};

	let filterText = '';
	function handleFilter(e) {
		if (multiple && value?.find((i) => i.label === filterText)) return;
		if (e.detail.length === 0 && filterText.length > 0) {
			const prev = items.filter((i) => !i.created);
			items = [...prev, { label: filterText, created: true }];
		}
	}
	function handleChange(e) {
		items = items.map((i) => {
			delete i.created;
			return i;
		});
		onChange(value);
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
		{disabled}
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
	<Select bind:value {id} {items} {multiple} {required} {disabled} name={id} />
{/if}
