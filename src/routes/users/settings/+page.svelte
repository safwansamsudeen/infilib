<script>
	import { PUBLIC_PASSAGE_APP_ID } from '$env/static/public';
	import '@passageidentity/passage-elements/passage-profile';
</script>

<svelte:head>
	<title>Settings</title>
	<meta content="User Settings" name="description" />
</svelte:head>
<h2 class="text-center my-3">User Settings</h2>
<a class="mx-3" href="/">Go home</a>
<passage-profile app-id={PUBLIC_PASSAGE_APP_ID}></passage-profile>
