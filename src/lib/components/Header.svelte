<script>
	import { page } from '$app/stores';
	export let user, library;
</script>

<header>
	<nav class="navbar bg-body-tertiary navbar-expand-md w-100">
		<div class="container-fluid">
			<a class="navbar-brand" href="/{$page.params.library}">{library}</a>
			<button
				aria-controls="offcanvasNavbar"
				aria-label="Toggle navigation"
				class="navbar-toggler"
				data-bs-target="#offcanvasNavbar"
				data-bs-toggle="offcanvas"
				type="button"
			>
				<span class="navbar-toggler-icon"></span>
			</button>
			<div
				aria-labelledby="offcanvasNavbarLabel"
				class="offcanvas offcanvas-end"
				id="offcanvasNavbar"
				tabindex="-1"
			>
				<div class="offcanvas-header">
					<h5 class="offcanvas-title" id="offcanvasNavbarLabel">Menu</h5>
					<button aria-label="Close" class="btn-close" data-bs-dismiss="offcanvas" type="button"
					></button>
				</div>
				<div class="offcanvas-body">
					<ul class="navbar-nav me-auto mb-2 mb-lg-0">
						<li class="nav-item">
							<a
								class="nav-link {$page.url.pathname.split('/').length === 2 ? 'active' : ''}"
								href="/{$page.params.library}">Home</a
							>
						</li>
						{#if user.admin}
							<li class="nav-item">
								<a
									class="nav-link {$page.url.pathname.includes('/members') ? 'active' : ''}"
									href="/{$page.params.library}/members">Members</a
								>
							</li>
							<li class="nav-item">
								<a
									class="nav-link {$page.url.pathname.includes('/items') ? 'active' : ''}"
									href="/{$page.params.library}/items">Items</a
								>
							</li>
							<li class="nav-item">
								<a
									class="nav-link {$page.url.pathname.includes('/circulation') ? 'active' : ''}"
									href="/{$page.params.library}/circulation">Circulate</a
								>
							</li>
							<li class="nav-item">
								<a
									class="nav-link {$page.url.pathname.includes('/settings') ? 'active' : ''}"
									href="/{$page.params.library}/settings">Settings</a
								>
							</li>
						{:else}
							<li class="nav-item">
								<a
									class="nav-link {$page.url.pathname.includes('/public') ? 'active' : ''}"
									href="/{$page.params.library}/public">Books</a
								>
							</li>
							<li class="nav-item">
								<a
									class="nav-link {$page.url.pathname.includes('/about') ? 'active' : ''}"
									href="/{$page.params.library}/about">About</a
								>
							</li>
						{/if}
						<li class="nav-item me-auto">
							<a
								class="nav-link {$page.url.pathname.includes('/users/settings') ? 'active' : ''}"
								href="/users/settings">User Settings</a
							>
						</li>
						<li class="nav-item me-auto">
							<a class="nav-link" href="/users/logout">Logout</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</nav>
</header>

<style>
	.nav-item {
		letter-spacing: 0.02em;
		margin: 0 0.5rem;
	}

	a:hover {
		text-decoration: underline;
	}
</style>
