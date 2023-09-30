<script>
	export let msg = '',
		title = 'InfiLib',
		type = 'success';
	let isVisible = true;

	setTimeout(() => {
		isVisible = false;
	}, 3000);
</script>

<div
	aria-atomic="true"
	aria-live="assertive"
	class="toast {isVisible ? 'show' : 'hide'} bg-outline-{type}"
	role="alert"
>
	<div class="toast-header">
		<strong class="me-auto">{title}</strong>
		<button aria-label="Close" class="btn-close" data-bs-dismiss="toast" type="button"></button>
	</div>

	<div class="toast-body">{msg}</div>
</div>
