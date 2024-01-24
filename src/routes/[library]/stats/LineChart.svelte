<script>
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';

	export let title;
	export let data;
	export let id;
	export let height = '350px';
	export let width = '567px';
	onMount(() => {
		new Chart(document.getElementById(id), {
			type: 'line',
			options: {
				plugins: { legend: { display: false }, title: { display: !!title, text: title } },
				scales: { y: { ticks: { stepSize: 5 } } }
			},
			data: {
				labels: Object.keys(data),
				datasets: [{ data: Object.values(data) }]
			}
		});
	});
</script>

<div style="height: {height}; width: {width}">
	<canvas {id}></canvas>
</div>
