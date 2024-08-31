<svelte:options accessors />

<script>
	import Select from 'svelte-select';
	import { page } from '$app/stores';

	export let id,
		options = [],
		multiple = false,
		creatable = true,
		required = true,
		value = null,
		disabled = false,
		label = 'name',
		itemId = 'id',
		goto = true,
		onChange = () => {};

	let optionsConfig = {};
	if (typeof options.length === 'number') {
		optionsConfig.items = options;
	} else {
		optionsConfig.loadOptions = async () => await options;
	}

	let filterText = '';

	function handleFilter(e) {
		if (multiple && value?.find((i) => i[label] === filterText)) return;
		if (e.detail.length === 0 && filterText.length > 0) {
			const prev = options.filter((i) => !i.created);
			options = [...prev, { [label]: filterText, created: true }];
		}
	}

	function handleChange(e) {
		if(!options.length) {
			optionsConfig.loadOptions().then((opts) => {
				options = opts.map((i) => {
					delete i.created;
					return i;
				});
				onChange(e);
			})
		} else {
			options = options.map((i) => {
				delete i.created;
				return i;
			});
			onChange(e);
		}
	}
</script>
{#if creatable}
<Select
	bind:filterText
	bind:value
	{id}
	{...optionsConfig}
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
	{...optionsConfig}
	{multiple}
	{required}
	{disabled}
	{label}
	{itemId}
	on:change={onChange}
	name={id}
/>
{/if}
{#if value && !multiple && goto}
<a href="/{$page.params.library}/{goto === true ? id + 's/' : goto}{value.id}">goto</a>
{/if}

