<script>
    import AddForm from "$lib/components/AddForm.svelte";
    import {onMount} from "svelte";
    import flatpickr from "flatpickr";
    import "flatpickr/dist/themes/airbnb.css";
    export let data
    onMount(() => {
        flatpickr("#time_of_pickup", {
            enableTime: true,
            minDate: "today",
            maxDate: new Date().fp_incr(2),
            minTime: "10:00",
            maxTime: "18:00",
        });
    })
</script>
<script>
	import Table from '$lib/components/Table.svelte';
	import AddForm from '$lib/components/AddForm.svelte';

	export let data;
</script>
<div class="text-column text-center">
	<h1>Mark <em>{data.item_name}</em> For Borrow</h1>
</div>
<svelte:head>
	<title>Mark {data.item_name}</title>
	<meta content="View users" name="description" />
</svelte:head>

<div class="container">
    <AddForm action="mark" addTogglable={false} columns={data.columns} />
</div>
