<script>
    import CustomSelect from '$lib/components/CustomSelect.svelte';
    import {capitalize} from "$lib/helpers.js";

    export let id,
        important = false,
        type = 'text',
        name = capitalize(name),
        values = [],
        opts = {},
        required = true,
        creatable = true;
</script>
{#if type === 'custom-select'}
{:else}
    <div class="col-md-6">
        <label for={id}>{name}</label>
        {#if type !== 'select'}
            <input class="form-control" {id} name="{id}" {required} {type} {...opts}/>
        {:else}
            <CustomSelect items={values} {name} {creatable}/>
        {/if}
    </div>
{/if}
