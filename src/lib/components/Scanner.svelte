<script>
	import { onDestroy, onMount } from 'svelte';

	export let onComplete;

	let scanner;
	onMount(async () => {
		const { Html5QrcodeScanner } = await import('html5-qrcode');

		scanner = new Html5QrcodeScanner('reader', { fps: 10, qrbox: { width: 250, height: 250 } });
		scanner.render(onComplete);
	});

	onDestroy(() => {
		scanner?.clear();
		if(document.getElementById('reader')) document.getElementById('reader').innerHTML = '';
	});
</script>

<div id="reader" width="600px"></div>
