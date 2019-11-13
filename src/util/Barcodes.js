import JsBarcode from 'jsbarcode';

import printHtml from './PrintHTML';
import Log from './Log';

export default {
  barcodes: [],

  add(item) {
    this.barcodes.push(item);
    Log(__filename, 'Added item to barcodes', { item, barcodes: this.barcodes });
  },

  remove(item) {
    const index = this.barcodes
      .map(v => v.barcodeId)
      .indexOf(item.barcodeId);

    if (index === -1) {
      Log(__filename, 'Item not found while removing item', { item, index, barcodes: this.barcodes });
      return 'not found';
    }

    delete this.barcodes[index];
    this.barcodes = this.barcodes
      .filter(v => v);

    Log(__filename, 'Removed item from barcodes', { item, index, barcodes: this.barcodes });
    return this.barcodes;
  },

  count(item) {
    const number = this.barcodes
      .filter(v => v.barcodeId === item.barcodeId)
      .length;
    Log(__filename, 'Counted items', { item, number, barcodes: this.barcodes });
    return number;
  },

  async print() {
    // TO-LONG
    const items = this.barcodes.map((item) => {
      const div = document.createElement('div');
      div.style.border = '2px dotted grey';
      const price = document.createElement('div');
      price.style.width = '2.1in';
      price.style.textOverflow = 'wrap';
      price.style.textAlign = 'center';

      price.innerHTML = `${item.name} ($${item.price})`;
      const img = document.createElement('img');
      JsBarcode(img, item.barcodeId, {
        displayValue: false,
      });
      div.appendChild(img);
      div.appendChild(price);
      return div;
    });
    const div = document.createElement('div');
    div.style.display = 'flex';
    div.style.flexWrap = 'wrap';
    div.style.flexDirection = 'row';
    div.style.width = '8.5in';
    div.style.textOverflow = 'wrap';
    items.forEach((item) => {
      div.appendChild(item);
    });
    await printHtml(div);
    Log(__filename, 'Printed barcodes', { div, barcodes: this.barcodes });
  },
};
