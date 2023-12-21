<script>
  import {enhance} from '$app/forms.js'
  import {page} from "$app/stores";
</script>
<form enctype="multipart/form-data" method="POST" use:enhance>
  {#if $page.form?.incorrect}<p class="alert alert-danger">
			The import failed: {$page.form.message}
		</p>
      {:else if $page.form?.error}<p class="alert alert-danger">
			An error occurred!
		</p>
    {/if}
  <div class="group">
    <label for="file">Upload a CSV file with your data</label>
    <input
      accept=".csv"
      id="importFile"
      name="importFile"
      required
      type="file"
    />
  </div>

  <button type="submit">Import</button>
</form>
