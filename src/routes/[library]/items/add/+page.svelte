<script>
	import Form from '$lib/components/Form.svelte';
	import Scanner from '$lib/components/Scanner.svelte';
	import { capitalize, findValue, setBookDetails } from '$lib/helpers.js';
	import Input from '$lib/subcomponents/Input.svelte';
	let type = 'book';
	let scannerVisible = false;

	function obtainOptions(columns, name) {
		return findValue(columns, name)?.opts?.options || [];
	}

	export let data;
</script>

<svelte:head>
	<title>Add Item</title>
	<meta content="Add item" name="description" />
</svelte:head>
<div>
	<input
		bind:checked={scannerVisible}
		class="form-check-input"
		id="scanner-visible"
		role="switch"
		type="checkbox"
	/>
	<label class="form-check-label" for="scanner-visible">Show scanner</label>

	<input bind:value={type} form="create-form" name="type" type="hidden" />
	{#if scannerVisible}
		<Scanner
			publishers={obtainOptions(data.itemColumns, 'publishers')}
			authors={obtainOptions(data.itemColumns, 'authors')}
			categories={obtainOptions(data.itemColumns, 'categories')}
			languages={obtainOptions(data.itemColumns, 'languages')}
		/>
	{:else}
		<form
			class="mb-4"
			on:submit={(e) => {
				e.preventDefault();
				setBookDetails(
					+e.target[0].value.replaceAll('-', ''),
					obtainOptions(data.itemColumns, 'publishers'),
					obtainOptions(data.itemColumns, 'authors'),
					obtainOptions(data.itemColumns, 'categories'),
					obtainOptions(data.itemColumns, 'languages')
				);
			}}
		>
			<Input name="Search by ISBN" id="search" />
			<button class="btn btn-success my-3" type="submit">Search</button>
		</form>
	{/if}
</div>
<Form action="create" columns={data.itemColumns} message="Add Item">
	<svelte:fragment slot="extras">
		<div class="d-grid gap-2 mt-3 mb-0">
			<div class="btn-group" role="group">
				{#each Object.entries(data.otherColumns) as [name]}
					<input
						type="radio"
						class="btn-check"
						name="type"
						id={name}
						value={name}
						autocomplete="off"
						bind:group={type}
						form="create-form"
					/>
					<label class="btn btn-outline-primary" for={name}>{capitalize(name)}</label>
				{/each}
			</div>
		</div>

		{#key type}
			<Form message="" columns={data.otherColumns[type]} nested={true}></Form>
		{/key}
	</svelte:fragment>
</Form>
