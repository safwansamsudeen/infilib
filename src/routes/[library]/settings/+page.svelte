<script>
	export let data;
	import Form from '$lib/components/Form.svelte';
	import { enhance } from '$app/forms';

	let changed = false;
</script>

<svelte:head>
	<title>Library Settings</title>
	<meta content="Library Settings" name="description" />
</svelte:head>
<h1 class="text-center">Manage your InfiLib settings</h1>
<a class=" my-3" href="./settings/import">Import items</a>
<h3>Add Subscription Type</h3>
<Form action="create_subscription" columns={data.subsColumns} message="" />
<h3>Add Library Subscription</h3>
<Form action="create_library_subscription" columns={data.librarySubsColumns} message="" />
<h3>Settings</h3>
<div class="my-3 row">
	<form
		action="?/update_settings"
		method="post"
		use:enhance={() =>
			async ({ update }) => {
				update({ reset: false });
				changed = false;
			}}
	>
		<div class="col-md-6 row">
			<label class="form-check-label col-6" for="scanner-visible">Free Library? </label>
			<div class="form-check form-switch mb-3 col-6">
				<input
					checked={data.library.settings.is_free}
					class="form-check-input form-switch"
					id="is_free"
					name="is_free"
					role="switch"
					type="checkbox"
					on:change={() => (changed = true)}
				/>
			</div>
		</div>
		<div class="d-grid gap-2 my-3">
			<input class="btn btn-success" disabled={!changed} type="submit" value="Update Settings" />
		</div>
	</form>
</div>