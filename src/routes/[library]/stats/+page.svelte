<script>
	import { onMount } from 'svelte';

	export let data;
	import { page } from '$app/stores';
	onMount(() => {
		const options = [
			{
				// Container: HTML Element to hold the chart
				container: document.getElementById('myChart'),
				theme: 'ag-vivid',
				data: data.transactions,
				series: [
					{
						type: 'histogram',
						xKey: 'issued_at',
						yKey: 'price',
						aggregation: 'sum'
					}
				],
				axes: [
					{
						type: 'time',
						position: 'bottom',
						title: { text: 'Month' }
					},
					{
						type: 'number',
						position: 'left',
						title: { text: 'Borrow Price Total (INR)' }
					}
				]
			}
		];
		for (let opt of options) {
			agCharts.AgCharts.create(opt);
		}
	});
</script>

<h2>Charts</h2>
<div id="myChart" style="height: 100%"></div>
<h2>Report</h2>
<h3>Members</h3>
<ul>
	<li>
		Throughout history, <b>{data.users.n}</b> people have subscribed to your wonderful library
	</li>
	<li>
		Out of this total, <b>{data.users.categories.gender[1]}</b> are registered as female, giving
		<b>{data.users.categories.gender[0]}</b> male users.
	</li>
	<li>
		<b>{data.users.categories.subscriptionActivity[0]}</b> of them still maintain an active subscription.
	</li>
	<!-- <li>
		This month, <b
			>{data.users
				.map((user) =>
					user.subscriptions.find(
						({ type, active }) => type.library_slug === $page.params.library && active
					)
				)
				.filter((user) => user?.purchased_on > new Date('12/01/2023')).length}</b
		>
		people subscribed to your library, and in this year,
		<b
			>{data.users
				.map((user) =>
					user.subscriptions.find(
						({ type, active }) => type.library_slug === $page.params.library && active
					)
				)
				.filter((user) => user?.purchased_on > new Date('01/01/2023')).length}</b
		> did.
	</li>
	<li>
		<b>{data.users.filter((user) => user.date_of_birth?.getFullYear?.() >= 2000).length}</b> of your
		subscribers were born in this century, while
		<b
			>{data.users.filter(
				(user) =>
					user.date_of_birth?.getFullYear?.() >= 1900 && user.date_of_birth?.getFullYear?.() < 2000
			).length}</b
		> are pre-2K folks.
	</li> -->
</ul>
<hr />
<h3>Items</h3>
<ul>
	<li><em>{data.library_name}</em> contains a grand total of <b>{data.items.n}</b> items.</li>
	<li>
		Out of this total, <b>{data.items.categories.referenceAndStatus.reference}</b> items are for reference.
	</li>
	<li>
		With <b>{data.items.categories.type[0]}</b> books and
		<b>{data.items.categories.type[1]}</b> magazines, your library is quite diverse.
	</li>
	<li>
		You have <b>{data.items.npages}</b> pages in your library.
	</li>
	<li>
		The worth of your library is <b>{data.items.worth}</b>
		INR.
	</li>
	<!-- <li>
		<b>{data.items.reduce((s, item) => s + (item.book?.publication_year >= 2000), 0)}</b> of these
		books have been published in this century, while
		<b
			>{data.items.reduce(
				(s, item) =>
					s + (item.book?.publication_year >= 1900 && item.book?.publication_year < 2000),
				0
			)}</b
		> have been in the previous one.
	</li>
	<li>
		<b>{data.items.reduce((s, item) => s + (item.magazine?.to > new Date()), 0)}</b> of those magazines
		are still valid.
	</li>
	<li>
		<b>{new Set(data.items.map(({ level }) => level)).size}</b> levels of books are available, and
		they are arranged over <b>{new Set(data.items.map(({ call_no }) => call_no)).size}</b> call numbers.
	</li>
	<li>
		You have <b
			>{new Set(
				data.items.reduce(
					(all_publishers, { publisher_id }) => [...all_publishers, publisher_id],
					[]
				)
			).size}</b
		>
		publishers in your library, and your books have been authored by a whopping
		<b
			>{new Set(
				data.items.reduce(
					(all_authors, { book }) => [...all_authors, ...(book?.authors.map(({ id }) => id) || [])],
					[]
				)
			).size}</b
		> authors.
	</li> -->
</ul>

<hr />
<h3>Transactions</h3>
<ul>
	<li><b>Number Of Members: </b>{data.users.n}</li>
	<li><b>Total Number of Borrows: </b>{data.transactions.length}</li>
	<li><b>Total Number of Books: </b>{data.items.n}</li>
</ul>
