<script>
	import Input from '$lib/components/Input.svelte';
	import { enhance } from '$app/forms';
	import { capitalize, setBookDetails } from '$lib/helpers.js';
	import Scanner from '$lib/components/Scanner.svelte';
	import { page } from '$app/stores';

	export let columns,
		scanner = null,
		inputColumns = {},
		addTogglable = true,
		addFormVisible = false,
		type = null,
		id = '',
		action = 'create';
	let scannerVisible = false;
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
	{#if Object.keys(inputColumns).length !== 0 && addTogglable}
		<!-- For different types of books -->
		<div class="d-grid gap-2">
			<div class="btn-group" role="group">
				{#each Object.entries(inputColumns) as [name]}
					<input
						type="radio"
						class="btn-check"
						name="type"
						id={name}
						value={name}
						autocomplete="off"
						bind:group={type}
						form="{action}-form"
					/>
					<label class="btn btn-outline-primary" for={name}>{capitalize(name)}</label>
				{/each}
			</div>
		</div>
	{:else if !addTogglable && type}
		<input type="hidden" name="type" bind:value={type} form="{action}-form" />
	{/if}
	{#if scanner}
		<div class="form-check form-switch my-3">
			<input
				bind:checked={scannerVisible}
				class="form-check-input"
				id="scanner-visible"
				role="switch"
				type="checkbox"
			/>
			<label class="form-check-label" for="scanner-visible">Show scanner</label>
		</div>
		{#if scannerVisible}
			<Scanner {...scanner} />
		{:else}
			<form
				class="mb-4"
				on:submit={(e) => setBookDetails(+e.target[0].value, ...Object.values(scanner))}
			>
				<Input name="Search by ISBN" on:change />
				<button class="btn btn-success my-3" type="submit">Search</button>
			</form>
		{/if}
	{/if}
	<form action="?/{action}" method="post" use:enhance id="{action}-form">
		{#if $page.form?.missing}<p class="alert alert-danger">
				The "{$page.form.name}" field is required
			</p>{/if}
		{#if $page.form?.incorrect}<p class="alert alert-danger">
				The "{$page.form.name}" field does not have a valid value: {$page.form.value}
			</p>{/if}
		{#if $page.form?.error}<p class="alert alert-danger">
				An error was raised! Did you give a duplicate value for a unique field?
			</p>{/if}
		<div class="row g-3">
			{#each columns as column}
				<Input {...column} />
			{/each}
			{#if type}
				<h3 class="text-center">{capitalize(type)}</h3>
				{#each inputColumns[type] as column}
					<Input {...column} />
				{/each}
			{/if}
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
