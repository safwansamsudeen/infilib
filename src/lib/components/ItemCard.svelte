<script>
	import { truncate, date } from '$lib/helpers.js';
	import { page } from '$app/stores';

	export let item, user_id;
</script>

<div class="card my-3" style="height: 40vh;">
	<div class="row">
		<div class="col-md-5 col-sm-6 overflow-scroll img-responsive">
			<img
				alt="{item.title} Cover"
				class="rounded-start"
				width="100%"
				style="border-bottom-left-radius: 0 !important;"
				src={item.image_url || 'https://placehold.co/200x300/black/white?text=Cover'}
			/>
			<div class="px-2 my-1">
				{#each item.categories as category}
					<span class="badge bg-info">{category.name}</span>
				{/each}
				<slot name="details"></slot>
			</div>
		</div>
		<div class="col-md-7 col-sm-6">
			<div class="card-body px-1">
				<h5 class="card-title">{truncate(item.title, 40)}</h5>
				<h6 class="card-subtitle mb-2 text-muted">
					{#if item.book}
						{truncate(item.book.authors?.map(({ name }) => name).join(', '), 20, 5)}
					{:else if item.magazine}
						{date(item.magazine.from)}, {date(item.magazine.to)}
					{/if}
				</h6>
				<p style="overflow: scroll; height: 100px; border-bottom: 1px dotted black;"><em>Description:</em> {item.remarks}</p>
				
				<div style="position: absolute; bottom: 20px; right: 20px;">
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
</div>
