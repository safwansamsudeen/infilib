<script>
	import CustomSelect from '$lib/components/CustomSelect.svelte';
	import { capitalize } from '$lib/helpers.js';

	export let id,
		name = capitalize(id),
		type = 'text',
		important = false,
		required = important,
		hidden = false, disabled = false,
		opts = {};
</script>

{#if type === 'hidden' || hidden}
	<input {id} name={id} {required} type="hidden" value={opts.value} />
{:else}
	<div class="col-md-{required ? '6' : '3'}" id="{id}-div">
		{#if type === 'select'}
			<label for={id}>{name}</label>
			<CustomSelect {id} {required} {...opts} {disabled}/>
		{:else if type === 'checkbox'}
			<div class="form-check">
				<label for={id} class="form-control-check">{name}</label>
				<input class="form-check-input" type="checkbox" checked={opts.value} {id} name={id} {disabled} />
			</div>
		{:else if type === 'textarea'}
			<label for={id}>{name}</label>
			<textarea class="form-control" {id} name={id} {required} {disabled} {...opts}></textarea>
		{:else}
			<label for={id}>{name}</label>
			<input class="form-control" {id} name={id} {required} {type} {disabled} {...opts} />
		{/if}
	</div>
{/if}
