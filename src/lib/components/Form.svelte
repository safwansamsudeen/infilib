<script>
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import Input from '$lib/components/Input.svelte';
	import { capitalize } from '$lib/helpers.js';

	export let columns,
		action = 'create',
		nested = false,
		message = capitalize(action),
		form_word = action + 'd',
		loading = false;
</script>

{#if !nested}
	{#if $page.form?.success}
		<p class="alert alert-success">Successfully {form_word}!</p>
	{:else if $page.form?.missing}<p class="alert alert-danger">
			The "{$page.form.name}" field is required.
		</p>
	{:else if $page.form?.incorrect}<p class="alert alert-danger">
			The "{$page.form.name}" field does not have a valid value: {$page.form.value}.
		</p>
	{:else if $page.form?.error}
		<p class="alert alert-danger">
			An error was raised! Did you give a duplicate value for a unique field?
		</p>
	{/if}
	<form
		action="?/{action}"
		class="my-2"
		id="{action}-form"
		method="post"
		use:enhance={() => {
			loading = true;

			return async ({ update }) => {
				await update();
				loading = false;
			};
		}}
	>
		{#if message}
			<h1 class="text-center my-3">{message}</h1>
		{/if}
		<div class="row g-3">
			{#each columns as column}
				{#if column.type === 'object'}
					<svelte:self
						columns={column.columns}
						message={capitalize(column.id)}
						nested="{true},"
						bind:loading
					/>
				{:else if !column.opts?.formRemoved}
					<Input {...column} disabled={loading} />
				{/if}
			{/each}
			<slot name="extras" />
			{#if loading}
				<em>Please wait...</em>
			{/if}
			<div class="d-grid gap-2 my-3">
				<input
					class="btn btn-outline-success"
					disabled={loading}
					id="submit-btn"
					type="submit"
					value={capitalize(action)}
				/>
			</div>
		</div>
	</form>
{:else}
	<h3 class="text-center my-2">{message}</h3>
	<div class="row g-3">
		{#each columns as column}
			{#if column.type === 'object'}
				<svelte:self columns={column.columns} action={column.id} nested="{true}," bind:loading />
			{:else}
				<Input {...column} disabled={loading} />
			{/if}
		{/each}
	</div>
{/if}
