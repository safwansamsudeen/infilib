<svelte:options accessors />

<script>
	import Select from 'svelte-select';

	export let id,
		options = [],
		multiple = false,
		creatable = true,
		required = true,
		value = null,
		disabled = false,
		label = 'name',
		itemId = 'id',
		onChange = () => {};
	let filterText = '';

	function handleFilter(e) {
		if (multiple && value?.find((i) => i[label] === filterText)) return;
		if (e.detail.length === 0 && filterText.length > 0) {
			const prev = options.filter((i) => !i.created);
			options = [...prev, { [label]: filterText, created: true }];
		}
	}
	function handleChange(e) {
		options = options.map((i) => {
			delete i.created;
			return i;
		});
		onChange(e);
	}
</script>

{#if creatable}
	<Select
		bind:filterText
		bind:value
		{id}
		items={options}
		{multiple}
		{required}
		{disabled}
		name={id}
		{label}
		{itemId}
		on:change={handleChange}
		on:filter={handleFilter}
	>
		<div let:item slot="item">
			{item.created ? `Add new ${id}: ` : ''}
			{item[label]}
		</div>
	</Select>
{:else}
	<Select
		bind:value
		{id}
		items={options}
		{multiple}
		{required}
		{disabled}
		{label}
		{itemId}
		on:change={onChange}
		name={id}
	/>
{/if}
