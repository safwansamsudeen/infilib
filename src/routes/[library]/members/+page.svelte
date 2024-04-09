<script>
	import Table from '$lib/components/Table.svelte';
	import { page } from '$app/stores';
	import { date } from '$lib/helpers';

	export let data;

	// Select the one subscription for this library, clean date, add member ID
	function cleanUp(users) {
		let library_slug = $page.params.library;
		return users.map(({ subscriptions, date_of_birth, ...user_obj }) => {
			const subscription = subscriptions.find(({ type }) => type.library_slug === library_slug);
			return {
				...user_obj,
				member_id: subscription.member_id,
				date_of_birth: date(date_of_birth),
				subscription: subscription.type.name
			};
		});
	}
</script>

<svelte:head>
	<title>Members</title>
	<meta content="View users" name="description" />
</svelte:head>
<div class="text-column text-center">
	<h1>Manage Members</h1>
</div>

<body>
	<div class="container">
		<a href="members/add">Add a member</a>
		{#await data.users}
			<p>Loading...</p>
		{:then users}
			{#key data}
				<Table
					data={cleanUp(users)}
					columns={data.columns}
					actions={[
						['Details', 'members'],
						['Borrow', 'circulation/borrow/any?user=']
					]}
				/>
			{/key}
		{:catch error}
			<p>{error.message}</p>
		{/await}
	</div>
</body>
