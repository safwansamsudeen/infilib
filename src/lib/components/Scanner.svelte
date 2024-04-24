<script>
	import { setBookDetails } from '$lib/helpers.js';
	import { onDestroy, onMount } from 'svelte';

	export let publishers,
		authors,
		languages,
		categories,
		autofilled,
		onCompleteFunc = async (decodedText) => {
			await setBookDetails(decodedText, publishers, authors, languages, categories, scanner);
			autofilled = true;
		};
	let scanner;
	onMount(async () => {
		const { Html5QrcodeScanner } = await import('html5-qrcode');

		scanner = new Html5QrcodeScanner(
			'reader',
			{ fps: 10, qrbox: { width: 250, height: 250 } },
			true
		);
		scanner.render(onCompleteFunc);
	});
	onDestroy(() => {
		scanner?.clear();
		document.getElementById('reader').innerHTML = '';
	});
</script>

<div id="reader" width="600px"></div>
