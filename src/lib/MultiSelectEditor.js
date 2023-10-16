import Handsontable from 'handsontable';
import CustomSelect from '$lib/components/CustomSelect.svelte';

export default class MultiSelectEditor extends Handsontable.editors.BaseEditor {
  init() {
    this.selectEl = this.hot.rootDocument.createElement('div');
    this.selectEl.style.display = 'none';
    this.hot.rootElement.appendChild(this.selectEl);
  }

  prepare(row, col, prop, td, originalValue, cellProperties) {
    super.prepare(row, col, prop, td, originalValue, cellProperties);
    this.select = new CustomSelect({
      target: this.selectEl,
      props: {
        items: this.cellProperties.opts.items,
        value: originalValue,
        multiple: this.cellProperties.opts.multiple || false,
        creatable: this.cellProperties.opts.creatable || true,
        required: this.cellProperties.important,
        id: cellProperties.data,
        onChange: (value) => {
          this.setValue(value);
          this.close();
          this.finishEditing();
        }
      }
    });
  }

  getValue() {
    return this.selectEl.value;
  }

  setValue() {
    this.selectEl.value = this.select.value;
    this.hot.setDataAtCell(this.row, this.col, this.select.value);
  }

  open() {
    this.selectEl.style.display = '';
  }

  focus() {
    this.selectEl.focus();
  }

  close() {
    this.selectEl.innerHTML = '';
  }
}

function MultiSelectRenderer(instance, td, row, col, prop, value, cellProperties) {
  td.textContent = value.label || value.map(({ label }) => label).join(', ');
}

Handsontable.renderers.registerRenderer('MultiSelectRenderer', MultiSelectRenderer);
