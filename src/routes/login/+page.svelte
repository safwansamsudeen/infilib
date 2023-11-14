<script>
	import { PUBLIC_PASSAGE_APP_ID } from '$env/static/public';
	import '@passageidentity/passage-elements/passage-auth';
	import '@passageidentity/passage-elements/passage-login';
	import '@passageidentity/passage-elements/passage-register';
	import '@passageidentity/passage-elements/passage-profile';
</script>

<passage-auth app-id={PUBLIC_PASSAGE_APP_ID}></passage-auth>
