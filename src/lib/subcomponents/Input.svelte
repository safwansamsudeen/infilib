<script>
	import CustomSelect from '$lib/components/CustomSelect.svelte';
    import {capitalize, date} from "$lib/helpers.js";

	export let id,
		label = capitalize(id),
		type = 'text',
		important = true,
		disabled = false,
		opts = {};

</script>

{#if type === 'hidden'}
	<input {id} name={id} required={important} type="hidden" value={opts.value} />
{:else}
	<div class="col-md-{important ? '6' : '3'}" id="{id}-div">
		{#if type === 'select'}
			<label for={id}>{label}</label>
			<CustomSelect {id} required={important} {...opts} {disabled} />
		{:else if type === 'checkbox'}
			<div class="form-check">
				<label for={id} class="form-control-check">{label}</label>
				<input
					class="form-check-input"
					type="checkbox"
					checked={opts.value}
					{id}
					name={id}
					{disabled}
				/>
			</div>
		{:else if type === 'textarea'}
			<label for={id}>{label}</label>
			<textarea class="form-control" {id} name={id} required={important} {disabled} {...opts}></textarea>
		{:else if type === 'number'}
			<label for={id}>{label}</label>
			<input class="form-control" {id} name={id} type="number" min=0 required={important} {disabled} {...opts}>
		{:else if type === 'date'}
			<label for={id}>{label}</label>
			<input class="form-control" {id} name={id} type="date" required={important} {disabled} value={date(opts.value)}>
		{:else}
			<label for={id}>{label}</label>
			<input class="form-control" {id} name={id} required={important} {type} {disabled} {...opts} />
		{/if}
	</div>
{/if}
