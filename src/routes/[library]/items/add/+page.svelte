<script>
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import dayjs from 'dayjs';

	import CustomSelect from '$lib/components/CustomSelect.svelte';
	import Form from '$lib/components/Form.svelte';
	import Scanner from '$lib/components/Scanner.svelte';

	import {
		capitalize,
		findValue,
		getBookDetails,
		setBookDetails,
		setSelectField,
		setFormField,
		LANG_MAPPING
	} from '$lib/helpers';

	let type = 'book';
	let scannerVisible = false;
	let autofilled = false;
	let quickadd = false;
	let called;

	if (browser) quickadd = localStorage.getItem('quickadd') || false;

	function obtainOptions(columns, name) {
		return findValue(columns, name)?.opts?.options || [];
	}

	async function getSelectField(optionsPromise, value, multi) {
		let options =
			optionsPromise.status === 'fulfilled' ? optionsPromise.result : await optionsPromise;

		let result = [];
		if (multi) {
			for (let sub_value of value) {
				let option = options.find(({ name }) => name === sub_value);
				result.push(option ? option : { id: sub_value, name: sub_value });
			}
		} else {
			let option = options.find(({ name }) => name === value);
			result = option ? option : { id: new_value, name: new_value };
		}

		return JSON.stringify(result);
	}
	$: 	console.log(called)
	async function quickAdd(e) {
		e.preventDefault();
		if (called) {
			return
		}
		
		called = true
		let isbn = +e.target.previousElementSibling.value.replaceAll('-', '');
		let item = await getBookDetails(isbn);
		setTimeout(() => called = false, 2000)
		let volumeInfo = item.volumeInfo;

		const data_ = new FormData();
		data_.append('title', volumeInfo.title);
		data_.append('subtitle', volumeInfo.subtitle);
		data_.append('no_of_pages', volumeInfo.pageCount || 0);
		data_.append('remarks', volumeInfo.description);
		data_.append('publication_year', volumeInfo.publishedDate?.split('-')[0]);
		data_.append('purchase_price', item.saleInfo.listPrice?.amount || 0);
		data_.append('purchase_details', item.saleInfo.listPrice?.buyLink || 0);
		data_.append('isbn', isbn);

		let publishers = obtainOptions(data.itemColumns, 'publisher'),
			authors = obtainOptions(data.otherColumns.book, 'authors'),
			categories = obtainOptions(data.itemColumns, 'categories'),
			languages = obtainOptions(data.itemColumns, 'languages');

		data_.append('publisher', await getSelectField(publishers, volumeInfo.publisher));
		data_.append('authors', await getSelectField(authors, volumeInfo.authors, true));
		data_.append(
			'languages',
			await getSelectField(languages, [LANG_MAPPING[volumeInfo.language]], true)
		);
		data_.append('categories', await getSelectField(categories, volumeInfo.categories, true));

		data_.append('acc_no', +document.querySelector('#acc_no').value);
		data_.append('status', 'IN');

		let res = await fetch('?/create', {
			method: 'POST',
			body: data_
		});
	}
	export let data;
</script>

<svelte:head>
	<title>Add Item</title>
	<meta content="Add item" name="description" />
</svelte:head>
<div class="text-column mb-3">
	<h1 class="text-center">Add Item</h1>
	<div class="options w-100">
		{#if $page.url.searchParams.get('multiple') === 'true'}
			<a href="./add">Return to normal mode</a>
		{:else}
			<a href="./add?multiple=true">Add in bulk</a>
		{/if}
		<div class="form-check form-switch mb-3 float-end">
			<input
				bind:checked={quickadd}
				on:change={(e) => localStorage.setItem('quickadd', e.target.value === 'on')}
				class="form-check-input form-switch me-2"
				id="quickadd"
				role="switch"
				type="checkbox"
			/>
			<label class="form-check-label" for="quickadd">Quick Add</label>
		</div>
	</div>
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
				onComplete={async (decodedText, scanner) => {
					await setBookDetails(decodedText, 
						obtainOptions(data.itemColumns, 'publishers'), 
						obtainOptions(data.itemColumns, 'authors'), 
						obtainOptions(data.itemColumns, 'languages'), 
						obtainOptions(data.itemColumns, 'languages'), 
					scanner);
					autofilled = true;
				}}
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
				{:else if quickadd}
					<button class="btn btn-success my-3 mx-auto" on:click={quickAdd}>Quick Add</button>
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
							<label for="library-subscription" class="w-100 text-center">Subscription: </label>
							<CustomSelect
								id="library_subscription"
								options={data.librarySubscriptions}
								creatable={false}
								onChange={(e) => {
									const {
										name,
										recurrence,
										purchase_details,
										purchase_price,
										no_of_weeks,
										publisher,
										categories,
										languages,
										call_no
									} = e.detail;
									setFormField('title', name);
									setFormField('purchase_details', purchase_details);
									setFormField('purchase_price', Math.round(purchase_price / no_of_weeks));
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
