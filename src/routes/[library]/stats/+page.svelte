<script>
	import PieChart from '$lib/components/PieChart.svelte';
	import TimeLineChart from '$lib/components/TimeLineChart.svelte';
	export let data;

	const ageData = {};
	for (const pair of Object.entries(data.users.categories.age)) {
		let label;
		let bounds = pair[0].split(',');
		if (bounds[0] == -Infinity) {
			label = `${bounds[1]} and under`;
		} else if (bounds[1] == Infinity) {
			label = `${bounds[0]} and above`;
		} else {
			label = `${bounds[0]}-${bounds[1]}`;
		}
		ageData[label] = pair[1];
	}
</script>

<h2>Charts</h2>
<h3>Members</h3>
<div class="chart-grid">
	<PieChart
		id="member-gender-chart"
		title="Gender"
		data={{ Male: data.users.categories.gender[0], Female: data.users.categories.gender[1] }}
	/>
	<PieChart id="member-age-chart" title="Age" data={ageData} legend={false} />
	<PieChart
		id="member-subscription-type-chart"
		title="Subscription types"
		data={data.users.subscriptionTypes}
	/>
</div>
<hr />
<h3>Items</h3>
<div class="chart-grid">
	<PieChart
		id="item-status-chart"
		title="Status"
		data={{
			'For reference': data.items.categories.status.reference,
			Borrowed: data.items.categories.status.borrowed,
			Available: data.items.categories.status.available,
			'Damaged or lost': data.items.categories.status.damagedLost
		}}
	/>
	<div>
		<h4 class="chart-group-title">Type</h4>
		<div class="chart-group">
			<PieChart
				id="item-unborrowed-type-chart"
				title="All items"
				data={{ Books: data.items.categories.type[0], Magazines: data.items.categories.type[1] }}
			/>
			<PieChart
				id="item-borrowed-type-chart"
				title="Borrowed items"
				data={{
					Books: data.borrowedItems.categories.type[0],
					Magazines: data.borrowedItems.categories.type[1]
				}}
			/>
		</div>
	</div>
	<div>
		<h4 class="chart-group-title">Authors</h4>
		<div class="chart-group">
			<PieChart
				id="item-unborrowed-author-chart"
				title="All Items"
				data={data.items.authorCounts}
				legend={false}
			/>
			<PieChart
				id="item-borrowed-author-chart"
				title="Borrowed items"
				data={data.borrowedItems.authorCounts}
				legend={false}
			/>
		</div>
	</div>
	<div>
		<h4 class="chart-group-title">Publishers</h4>
		<div class="chart-group">
			<PieChart
				id="item-unborrowed-publisher-chart"
				title="Publishers"
				data={data.items.publisherCounts}
				legend={false}
			/>
			<PieChart
				id="item-borrowed-publisher-chart"
				title="Borrowed items"
				data={data.borrowedItems.publisherCounts}
				legend={false}
			/>
		</div>
	</div>
	<div>
		<h4 class="chart-group-title">Categories</h4>
		<div class="chart-group">
			<PieChart
				id="item-unborrowed-category-chart"
				title="All items"
				data={data.items.categoryCounts}
				legend={false}
			/>
			<PieChart
				id="item-borrowed-category-chart"
				title="Borrowed items"
				data={data.borrowedItems.categoryCounts}
				legend={false}
			/>
		</div>
	</div>
	<div>
		<h4 class="chart-group-title">Language</h4>
		<div class="chart-group">
			<PieChart
				id="item-unborrowed-language-chart"
				title="All items"
				data={data.items.languageCounts}
				legend={false}
			/>
			<PieChart
				id="item-borrowed-language-chart"
				title="Borrowed items"
				data={data.borrowedItems.languageCounts}
				legend={false}
			/>
		</div>
	</div>
</div>
<hr />
<h3>Transactions</h3>
<TimeLineChart
	id="transaction-daily-chart"
	title="Daily"
	data={data.transactions.overTimePeriod.daily}
/>
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
	<li>
		This month, <b>{data.users.nsubscribed.thisMonth}</b>
		people subscribed to your library, and in this year,
		<b>{data.users.nsubscribed.thisYear}</b> did.
	</li>
	<!-- <li>
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
	<li><em>{data.library.name}</em> contains a grand total of <b>{data.items.n}</b> items.</li>
	<li>
		Out of this total, <b>{data.items.categories.status.reference}</b> items are for reference.
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
	</li> -->
	<li>
		<b>{data.items.nValidMagazines}</b> of your library's magazines are still valid.
	</li>
	<li>
		<b>{data.items.nBookLevels}</b> levels of books are available, and they are arranged over
		<b>{data.items.nCallNums}</b> call numbers.
	</li>
	<li>
		You have <b>{data.items.nPublishers}</b>
		publishers in your library, and your books have been authored by a whopping
		<b>{data.items.nAuthors}</b> authors.
	</li>
</ul>

<hr />
<h3>Transactions</h3>
<ul>
	<li><b>Number Of Members: </b>{data.users.n}</li>
	<li><b>Total Number of Borrows: </b>{data.transactions.n}</li>
	<li><b>Total Number of Books: </b>{data.items.n}</li>
</ul>

<style>
	div.chart-grid {
		display: flex;
		align-items: center;
		justify-content: space-evenly;
		flex-wrap: wrap;
		border: 1px double #eee;
	}

	div.chart-group {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		flex-wrap: wrap;
		border: 1px solid #eee;
		padding: 8px;
		margin: 8px;
	}

	.chart-group-title {
		padding-top: 1rem;
		margin-left: 8px;
	}
</style>
