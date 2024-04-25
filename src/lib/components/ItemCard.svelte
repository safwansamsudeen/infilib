<script>
	import { truncate, date } from '$lib/helpers.js';
	import { page } from '$app/stores';

	export let item, user_id;
</script>

<div class="card my-3" style="height: 50vh;">
	<div class="row">
		<div class="col-md-5 col-sm-6 overflow-scroll img-responsive">
			<img
				alt="{item.title} Cover"
				class="rounded-start"
				style="height: 50vh;"
				src={item.image_url || 'https://placehold.co/200x300/black/white?text=Cover'}
			/>
		</div>
		<div class="col-md-5 col-sm-6">
			<div class="card-body">
				<h5 class="card-title">{truncate(item.title, 40)}</h5>
				<h6 class="card-subtitle mb-2 text-muted">
					{#if item.book}
						{truncate(item.book.authors?.map(({ name }) => name).join(', '), 20, 5)}
					{:else if item.magazine}
						{date(item.magazine.from)}, {date(item.magazine.to)}
					{/if}
				</h6>
				<p>{truncate(item.remarks)}</p>
				<div class="mb-3">
					{#each item.categories as category}
						<span class="badge bg-info">{category.name}</span>
					{/each}
				</div>
				<slot name="actions" prop={item}>
					{#if item.status !== 'IN'}
						<p class="card-text">Not Available</p>
					{:else if item.mark}
						<em>Already Marked</em>
						{#if item.mark.user_id === user_id}
							<span class="badge bg-success">You</span>
						{/if}
					{:else}
						<a href="/{$page.params.library}/public/mark/{item.id}" class="btn btn-primary">Mark</a>
					{/if}
				</slot>
			</div>
		</div>
	</div>
</div>
