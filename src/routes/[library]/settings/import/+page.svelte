<script>
	import { enhance } from '$app/forms.js';
	import { page } from '$app/stores';

	function submitFunc() {
		var xhr = new XMLHttpRequest();
		xhr.open("POST", "?/test"); 
		xhr.onload = function(event){ 
			console.log("Success, server responded with: " + event.target.response); // raw response
		}; 
		var formData = new FormData(document.getElementById("import-form")); 
		xhr.send(formData);
	}
</script>

<form id="import-form" enctype="multipart/form-data" method="POST" use:enhance>
	{#if $page.form?.incorrect}<p class="alert alert-danger">
			The import failed: {$page.form.message}
		</p>
	{:else if $page.form?.error}<p class="alert alert-danger">An error occurred!</p>
	{/if}
	<div class="group">
		<label for="file">Upload a CSV file with your data</label>
		<input accept=".csv" id="importFile" name="importFile" required type="file" />
	</div>

	<button on:click={submitFunc}>Import</button>
</form>
