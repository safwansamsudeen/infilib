<script>
	import Form from '$lib/components/Form.svelte';
	import { onMount } from 'svelte';
	import flatpickr from 'flatpickr';
	import 'flatpickr/dist/themes/airbnb.css';
	export let data;
	onMount(() => {
		flatpickr('#time_of_pickup', {
			enableTime: true,
			minDate: 'today',
			maxDate: new Date().fp_incr(2),
			minTime: '10:00',
			maxTime: '18:00'
		});
	});
</script>

<div class="text-column text-center">
	<h1>Mark <em>{data.item_name}</em> For Borrow</h1>
</div>
<svelte:head>
	<title>Mark {data.item_name}</title>
	<meta content="View users" name="description" />
</svelte:head>

<div class="container">
	<div class="grid">
		<div class="row">
			<div class="col-md-10">
				<Form action="mark" columns={data.columns} />
			</div>
			<div class="col-md-2" style="margin-top: 90px;">
				<b>Item price: </b>
				{data.item_price} INR
			</div>
		</div>
	</div>
</div>
