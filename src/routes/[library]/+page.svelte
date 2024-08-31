<script>
	import Table from '$lib/components/Table.svelte';
	import Scanner from '$lib/components/Scanner.svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';

	export let data;
</script>

<svelte:head>
	<title>Home</title>
	<meta content="Home" name="description" />
</svelte:head>
{#if data.user.admin}
	<div class="text-column text-center">
		<h1>Welcome to the Admin Panel</h1>
	</div>

	<div class="container my-3">
		<h4>Marks</h4>
		{#key data}
			<Table
				actions={[['Pop', 'circulation/borrow/any?mark=']]}
				columns={data.columns}
				data={data.marks}
			/>
		{/key}
	</div>
	<div class="container my-3">
		<h4>Quick Scan</h4>
		{#if browser}
			<div style="width: 50vw; margin: 0 auto;"></div>
			<Scanner
				onComplete={(decodedText, scanner) => {
					scanner.pause()
					const body = new FormData()
					body.append(data, decodedText)
					fetch(`${data.library}/items/?/goto/`, {
						method: 'POST',
						body
					})
				}}
			/>
		{/if}
	</div>
{/if}
