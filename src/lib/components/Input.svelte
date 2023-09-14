<script>
    export let name, important = false, type = 'text', label = name.replaceAll("_", " "), values = [];
</script>

<div class="mb-{important ? 6 : 3}">
    {#if label}
        <label for={name} style="text-transform: capitalize;">{label}</label>
    {/if}
    {#if type !== 'select'}
        <input
                class="form-control"
                id={name}
                name={name}
                required
                type={type}
        />
    {:else}
        <select class="form-select" {name} id={name} required>
            {#each values as {value, label}}
                <option {value}>{label}</option>
            {/each}
        </select>
    {/if}
</div>
