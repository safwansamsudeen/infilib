<script>
    import CustomSelect from '$lib/components/CustomSelect.svelte';
    import {capitalize} from "$lib/helpers.js";

    export let name,
        important = false,
        type = 'text',
        label = capitalize(name),
        values = [],
        opts = {},
        required = true;
</script>
{#if type === 'custom-select'}
    <CustomSelect items={values} {name} {label}/>
{:else}
    <div class="col-md-6">
        <label for={name}>{label}</label>
        {#if type !== 'select'}
            <input class="form-control" id={name} {name} {required} {type} {...opts}/>
        {:else}
            <select class="form-select" {name} id={name} required>
                {#each values as {value, label}}
                    <option {value}>{label}</option>
                {/each}
            </select>
        {/if}
    </div>
{/if}
