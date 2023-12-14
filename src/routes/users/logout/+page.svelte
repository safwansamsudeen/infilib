<script>
	import { onMount } from 'svelte';

	onMount(async () => {
		const { PassageUser } = await import('@passageidentity/passage-elements/passage-user');
		const user = new PassageUser();
		await user.signOut();
		window.location.href = '/';
	});
</script>

<h3 class="my-3 text-center">Logging you out...</h3>
