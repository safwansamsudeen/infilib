<script>
	import { onMount } from 'svelte';

	export let data;

	let gridElement;

	let gridStatus = {
		isScriptLoaded: false,
		isStyleLoaded: false,
		isMounted: false,
		isInited: false
	};

	onMount(() => {
		gridStatus.isMounted = true;
		if (gridStatus.isScriptLoaded && gridStatus.isStyleLoaded) gridInit();
	});

	function scriptLoaded() {
		gridStatus.isScriptLoaded = true;
		if (gridStatus.isMounted && gridStatus.isStyleLoaded) gridInit();
	}

	function styleLoaded() {
		gridStatus.isStyleLoaded = true;
		if (gridStatus.isScriptLoaded && gridStatus.isMounted) gridInit();
	}

	function gridInit() {
		if (!gridStatus.isInited) {
			gridStatus.isInited = true;
			new Handsontable(gridElement, {
				data: data,
				rowHeaders: true,
				colHeaders: true
			});
		}
	}
</script>

<svelte:head>
	<script
		on:load={scriptLoaded}
		src="https://cdn.jsdelivr.net/npm/handsontable/dist/handsontable.full.min.js"
	></script>
	<link
		href="https://cdn.jsdelivr.net/npm/handsontable/dist/handsontable.full.min.css"
		on:load={styleLoaded}
		rel="stylesheet"
	/>
</svelte:head>

<div bind:this={gridElement}></div>
