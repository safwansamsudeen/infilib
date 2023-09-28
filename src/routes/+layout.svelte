<script>
    import Header from "./Header.svelte";
    import Toast from "$lib/components/Toast.svelte";
</script>

<div class="app">
    <Header/>
    <main style="max-width: 85%">
        <slot/>
    </main>
</div>

<style>
    .app {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
    }

    main {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 1rem;
        width: 100%;
        max-width: 64rem;
        margin: 0 auto;
        box-sizing: border-box;
    }
</style>
