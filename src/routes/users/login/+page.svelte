<script>
	import { PUBLIC_PASSAGE_APP_ID } from '$env/static/public';
	import '@passageidentity/passage-elements/passage-auth';
	import '@passageidentity/passage-elements/passage-login';
	import '@passageidentity/passage-elements/passage-register';
	import { onMount } from 'svelte';

	onMount(() => {
		const passageAuth = document.querySelector('passage-auth');

		passageAuth.onSuccess = async ({ redirect_url, auth_token }) => {
			await fetch('/users/login/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ auth_token })
			});
			const params = new URL(window.location.href).searchParams;
			window.location.href = params.get('next') || redirect_url;
		};
	});
</script>

<svelte:head>
	<title>Login</title>
	<meta content="Login page" name="description" />
</svelte:head>
<passage-auth app-id={PUBLIC_PASSAGE_APP_ID}></passage-auth>
