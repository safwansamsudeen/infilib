<script>
	import Form from '$lib/components/Form.svelte';
	import Scanner from '$lib/components/Scanner.svelte';
	import { page } from '$app/stores';
	import {
		capitalize,
		findValue,
		setBookDetails,
		setSelectField,
		setFormField
	} from '$lib/helpers.js';
	import dayjs from 'dayjs';
	import CustomSelect from '$lib/subcomponents/CustomSelect.svelte';
	let type = 'book';
	let scannerVisible = false;
	let autofilled = false;

	function obtainOptions(columns, name) {
		return findValue(columns, name)?.opts?.options || [];
	}

	export let data;
</script>

<svelte:head>
	<title>Add Item</title>
	<meta content="Add item" name="description" />
</svelte:head>
<div class="text-column mb-3">
	<h1 class="text-center">Add Item</h1>
	{#if $page.url.searchParams.get('multiple') === 'true'}
		<a class="d-block" href="./add">Return to normal mode</a>
	{:else}
		<a class="d-block" href="./add?multiple=true">Add in bulk</a>
	{/if}
</div>
<div class="row">
	<div class="col-md-3">
		<div class="form-check form-switch mb-3">
			<input
				bind:checked={scannerVisible}
				class="form-check-input form-switch me-2"
				id="scanner-visible"
				role="switch"
				type="checkbox"
			/>
			<label class="form-check-label" for="scanner-visible">Show scanner</label>
		</div>
		<input bind:value={type} form="create-form" name="type" type="hidden" />
		{#if scannerVisible}
			<Scanner
				publishers={obtainOptions(data.itemColumns, 'publishers')}
				authors={obtainOptions(data.itemColumns, 'authors')}
				categories={obtainOptions(data.itemColumns, 'categories')}
				languages={obtainOptions(data.itemColumns, 'languages')}
				bind:autofilled
			/>
			{#if autofilled}
				<button class="btn btn-success my-3 mx-auto" type="submit" form="create-form"
					>Confirm and Add</button
				>
			{/if}
		{:else}
			<form
				class="mb-4 text-center"
				on:submit={async (e) => {
					e.preventDefault();
					await setBookDetails(
						+e.target[0].value.replaceAll('-', ''),
						obtainOptions(data.itemColumns, 'publishers'),
						obtainOptions(data.itemColumns, 'authors'),
						obtainOptions(data.itemColumns, 'categories'),
						obtainOptions(data.itemColumns, 'languages')
					);
					autofilled = true;
				}}
			>
				<label for="search">Search by ISBN</label>
				<input class="form-control" id="search" name="search" required="true" />
				{#if autofilled}
					<button class="btn btn-success my-3 mx-auto" type="submit" form="create-form"
						>Confirm and Add</button
					>
				{:else}
					<button class="btn btn-outline-dark my-3 mx-auto" type="submit">Autofill Details</button>
				{/if}
			</form>
		{/if}
	</div>

	<div class="col-md-9">
		{#if $page.url.searchParams.get('multiple') === 'true'}
			<input type="hidden" form="create-form" name="multiple" value="true" />
		{/if}
		<Form action="create" columns={data.itemColumns} message="">
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
				{#if type === 'magazine'}
					<!-- This exists to center the child -->
					<div>
						<div class="w-50 mx-auto">
							<label for="library-subscription" class="w-100 text-center">Autofill: </label>
							<CustomSelect
								id="library-subscription"
								options={data.librarySubscriptions}
								creatable={false}
								onChange={(e) => {
									const {
										name,
										recurrence,
										price,
										no_of_weeks,
										publisher,
										categories,
										languages,
										call_no
									} = e.detail;
									setFormField('title', Math.round(price / no_of_weeks));
									setFormField('purchase_price', name);
									setFormField('call_no', call_no);
									document.getElementById('from').valueAsDate = new Date();
									document.getElementById('to').valueAsDate = new Date(
										dayjs().add(recurrence, 'day')
									);
									setSelectField(
										'publisher',
										obtainOptions(data.itemColumns, 'publishers'),
										publisher.name
									);
									setSelectField(
										'categories',
										obtainOptions(data.itemColumns, 'categories'),
										categories.map(({ name }) => name),
										true
									);
									setSelectField(
										'languages',
										obtainOptions(data.itemColumns, 'languages'),
										languages.map(({ name }) => name),
										true
									);
								}}
								goto={false}
							/>
						</div>
					</div>
				{/if}
				{#key type}
					<Form message="" columns={data.otherColumns[type]} nested={true}></Form>
				{/key}
			</svelte:fragment>
		</Form>
	</div>
</div>
