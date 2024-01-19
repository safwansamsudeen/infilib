<script>
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';

	export let title;
	export let data;
	export let id;
	export let size = '300px';
	export let legend = true;

	onMount(() => {
		new Chart(document.getElementById(id), {
			type: 'pie',
			options: {
				plugins: { legend: { display: legend }, title: { display: !!title, text: title } }
			},
			data: {
				labels: Object.keys(data),
				datasets: [{ data: Object.values(data) }]
			}
		});
	});
</script>

<div style="height: {size}; width: {size}">
	<canvas {id}></canvas>
</div>
