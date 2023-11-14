<script>
export let data;
import {page} from '$app/stores';
import {truncate} from '$lib/helpers'
</script>
<div class="row">
    {#each data.books as book}
  <div class="col-md-4 col-sm-6">
    <div class="card my-3">
      <div class="row">
      <div class="col-md-4 col-sm-6 overflow-scroll img-responsive">
        <img src="{book.image_url}" class="rounded-start h-100" alt="{book.title} Cover">
      </div>
      <div class="col-md-8 col-sm-6">
        <div class="card-body">
          <h5 class="card-title">{book.title}</h5>
          <h6 class="card-subtitle mb-2 text-muted">{book.authors.map(({ label }) => label).join(', ')}</h6>
          <p class="card-text">{truncate(book.remarks)}</p>
          {#if book.status !== 'IN'}
          <p class="card-text">Not Available</p>
          {:else if book.mark}
          <em>Already Marked</em> {#if book.mark.user_id === data.user.id} <span class="badge bg-success">You</span> {/if}
          {:else}
          <a href="/{$page.params.library}/public/mark/{book.id}" class="btn btn-primary">Mark for Borrow</a>
          {/if}
        </div>
      </div>
    </div>
  </div>
  </div>
 {/each}
</div>
