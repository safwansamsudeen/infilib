<script>
	import Input from '$lib/components/Input.svelte';
	import { enhance } from '$app/forms';
	import { capitalize, setBookDetails } from '$lib/helpers.js';
	import Scanner from '$lib/components/Scanner.svelte';
	import { page } from '$app/stores';

	export let columns,
		addTogglable = true,
		addFormVisible = false,
		id = '',
		action = 'create';
	let creating = false;
</script>

<div class="form-check form-switch">
	{#if addTogglable}
		<input
			bind:checked={addFormVisible}
			class="form-check-input"
			id="form-switch"
			role="switch"
			type="checkbox"
		/>
		<label class="form-check-label" for="form-switch">{capitalize(action)} {id || ''}</label>
	{/if}
</div>
{#if addFormVisible || !addTogglable}
	<slot name="options" />
	<slot name="scanner" />
	<form action="?/{action}" method="post" use:enhance={() => {
		creating = true;

		return async ({ update }) => {
			await update();
			creating = false;
		};
	}} id="{action}-form">

		{#if $page.form?.missing}<p class="alert alert-danger">
				The "{$page.form.name}" field is required
			</p>{/if}
		{#if $page.form?.incorrect}<p class="alert alert-danger">
				The "{$page.form.name}" field does not have a valid value: {$page.form.value}
			</p>{/if}
		{#if $page.form?.error}<p class="alert alert-danger">
				An error was raised! Did you give a duplicate value for a unique field?
			</p>
		{/if}
		<div class="row g-3">
			{#each columns as column}
				<Input {...column} disabled={creating} />
			{/each}
			{#if creating}
				<em>Please wait...</em>
			{/if}
			<slot name="options-extra-columns"/>
		</div>
		<div class="d-grid gap-2 my-3">
			<input
				class="btn btn-outline-success"
				id="submit-btn"
				type="submit"
				value={capitalize(action)}
			/>
		</div>
	</form>
{/if}
