<script>
	import { page } from '$app/stores';
	export let admin;
</script>

<header>
	<nav>
		<ul>
			<li
				aria-current={$page.url.pathname.split('/').length === 2 ? 'page' : undefined}
				class="mx-3 mx-md-4"
			>
				<a href="/{$page.params.library}">Home</a>
			</li>
			{#if admin}
			<li
				aria-current={$page.url.pathname.includes('/members') ? 'page' : undefined}
				class="mx-2 mx-md-4"
			>
				<a href="/{$page.params.library}/members">Members</a>
			</li>
			<li
				aria-current={$page.url.pathname.includes('/items') ? 'page' : undefined}
				class="mx-2 mx-md-4"
			>
				<a class="mx-2 mx-md-4" href="/{$page.params.library}/items">Items</a>
			</li>
			<li aria-current={$page.url.pathname.includes('/circulation') ? 'page' : undefined}>
				<a href="/{$page.params.library}/circulation">Circulate</a>
			</li>
				{:else}
			<li
				aria-current={$page.url.pathname.includes('/public') ? 'page' : undefined}
				class="mx-2 mx-md-4"
			>
				<a href="/{$page.params.library}/public">Books</a>
			</li>
			<li
				aria-current={$page.url.pathname.includes('/about') ? 'page' : undefined}
				class="mx-2 mx-md-4"
			>
				<a class="mx-2 mx-md-4" href="/{$page.params.library}/about">About</a>
			</li>
			{/if}
		</ul>
	</nav>
</header>

<style>
	header {
		display: flex;
		justify-content: space-between;
	}

	nav {
		width: 100%;
		display: flex;
		justify-content: center;
		--background: rgba(255, 255, 255, 0.7);
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
		background: var(--background);
		background-size: contain;
	}

	li {
		position: relative;
		height: 100%;
	}

	li[aria-current='page']::before {
		--size: 6px;
		content: '';
		width: 0;
		height: 0;
		position: absolute;
		top: 0;
		left: calc(50% - var(--size));
		border: var(--size) solid transparent;
		border-top: var(--size) solid black;
	}

	nav a {
		display: flex;
		height: 100%;
		align-items: center;
		color: black;
		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;
		transition: color 0.2s linear;
	}

	a:hover {
		text-decoration: underline;
	}
</style>
