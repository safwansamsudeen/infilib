<script>
    import Form from '$lib/components/Form2.svelte';
	import Scanner from '$lib/components/Scanner.svelte';
	import {capitalize} from "$lib/helpers.js";
	let type = 'book';

    export let data
</script>
<svelte:head>
	<title>Add Item</title>
	<meta content="Add item" name="description" />
</svelte:head>

<Form action="create" columns={data.itemColumns} message="Add Item">
	<svelte:fragment slot="extras">
	<div class="d-grid gap-2 mt-3 mb-0"  >
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
