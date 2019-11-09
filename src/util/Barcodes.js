import JsBarcode from 'jsbarcode';

import printHtml from './PrintHTML';

export default {
  barcodes: [],

  add(item) {
    this.barcodes.push(item);
  },

  remove(item) {
    const index = this.barcodes
      .map(v => v.barcodeId)
      .indexOf(item.barcodeId);

    if (index === -1) {
      console.log('Item Not found');
      return 'not found';
    }

    delete this.barcodes[index];
    this.barcodes = this.barcodes
      .filter(v => v);

    return this.barcodes;
  },

  count(item) {
    return this.barcodes
      .filter(v => v.barcodeId === item.barcodeId)
      .length;
  },

  async print() {
    const items = this.barcodes.map((item) => {
      const div = document.createElement('div');
      div.style.border = '2px dotted grey';
      const price = document.createElement('div');
      price.style.width = '1.2in';
      price.style.textOverflow = 'wrap';
      price.style.textAlign = 'center';

      price.innerHTML = `${item.name} ($${item.price})`;
      const img = document.createElement('img');
      JsBarcode(img, item.barcodeId.toString(36), {
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
  },
};
