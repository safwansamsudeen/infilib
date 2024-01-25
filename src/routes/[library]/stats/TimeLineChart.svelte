<script>
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';
	import 'chartjs-adapter-luxon';

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
				scales: {
					x: {
						type: 'time',
						time: { tooltipFormat: 'DD' },
						title: { display: true, text: 'Date' }
					},
					y: { ticks: { stepSize: 5 } }
				}
			},
			data: {
				labels: data[0],
				datasets: [{ data: data[1] }]
			}
		});
	});
</script>

<!-- <div style="height: {height}; width: {width}"> -->
<div>
	<canvas {id}></canvas>
</div>
