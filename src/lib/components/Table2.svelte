<script>
    import {onMount} from "svelte";
    import {page} from "$app/stores";
    export let data, columns, actions = [], actionsHtml = (value, row, id) => {
        let html = '<div class="btn-group btn-group-sm w-100" role="group">';
        for (let [label, url, condition] of actions) {
            if (condition && condition(value)) {
                continue;
            }
            html +=
                `<a type="button" class="btn btn-outline-primary" href="/${$page.params.library}/${url}${
                    url.endsWith('=') ? '' : '/'
                }${row.id}">${label}</a>`;
        }
        return html + '</div>';
    };
    onMount(() => {
        let $table = jQuery('#table');
    window.actionsHtml = actionsHtml;
        $table.bootstrapTable({data})
    })
</script>


<table data-click-to-select="true"
  data-minimum-count-columns="2"
  data-pagination="true"
  data-search="true"
  data-show-columns="true"
  data-show-columns-toggle-all="true"
  data-show-export="true"
  data-show-fullscreen="true"
  data-show-toggle="true"
  id="table"
>
  <thead>
    <tr>
        {#each columns as {id, name, important}}
            {#if important}
            <th data-field={id}>{name}</th>
            {/if}
        {/each}
        <th  data-field="actions" data-formatter="actionsHtml">Actions</th>
    </tr>
  </thead>
</table>
