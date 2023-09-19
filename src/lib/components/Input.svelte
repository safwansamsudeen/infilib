<script>
    import CustomSelect from '$lib/components/CustomSelect.svelte';
    import {capitalize} from "$lib/helpers.js";

    export let name,
        important = false,
        type = 'text',
        label = capitalize(name),
        values = [],
        opts = {},
        required = true,
        creatable = true;
</script>
{#if type === 'custom-select'}
{:else}
    <div class="col-md-6">
        <label for={name}>{label}</label>
        {#if type !== 'select'}
            <input class="form-control" id={name} {name} {required} {type} {...opts}/>
        {:else}
            <CustomSelect items={values} {name} {creatable}/>
        {/if}
    </div>
{/if}
