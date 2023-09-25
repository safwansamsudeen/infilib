<script>
    import CustomSelect from '$lib/components/CustomSelect.svelte';
    import {capitalize} from "$lib/helpers.js";

    export let id,
        name = capitalize(id),
        type = 'text',
        important = false,
        required = true,
        opts = {},
        // Select fields
        multiple = false,
        items = [],
        creatable = true;
</script>
<div class="col-md-{important ? '6' : '3'}" id="{id}-div">
    {#if type === 'select'}
        <label for={id}>{name}</label>
        <CustomSelect {items} {multiple} {creatable} {id} {required} {...opts}/>
    {:else if type === 'check'}
        <div class="form-check">
            <label for={id} class="form-control-check">{name}</label>
            <input class="form-check-input" type="checkbox" value="" {id} name={id}>
        </div>
    {:else if type === 'date'}
        <label for={id}>{name}</label>
        <input class="form-control" {id} name="{id}" {required} type="date"
               value="{opts.value}"/>
    {:else if type === 'textarea'}
        <label for={id}>{name}</label>
        <textarea class="form-control" {id} name="{id}" {required} {...opts}></textarea>
    {:else}
        <label for={id}>{name}</label>
        <input class="form-control" {id} name="{id}" {required} {type} {...opts}/>
    {/if}
</div>
