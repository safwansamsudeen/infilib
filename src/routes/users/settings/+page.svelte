<script>
	import { PUBLIC_PASSAGE_APP_ID } from '$env/static/public';
	import '@passageidentity/passage-elements/passage-profile';
</script>

<svelte:head>
	<title>Settings</title>
	<meta content="User Settings" name="description" />
</svelte:head>
<passage-profile app-id={PUBLIC_PASSAGE_APP_ID}></passage-profile>
