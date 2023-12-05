<script>
	import 'bootstrap/dist/css/bootstrap.css';
	import scriptSrc from 'bootstrap/dist/js/bootstrap.bundle.js?url';
	import 'bootstrap-icons/font/bootstrap-icons.css';
</script>

<svelte:head>
	<script src={scriptSrc}></script>
</svelte:head>
<slot />
