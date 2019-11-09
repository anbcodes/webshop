import Database from './Database';

export default {
  db: null,
  init(onUpdate) {
    this.db = new Database('WebShopTable', onUpdate);
  },

  get items() {
    return this.db.items;
  },

  async erase() {
    await this.db.erase();
  },

  async addItem(item) {
    console.log((await this.db.items), this);
    const items = [...(await this.db.items)];
    const itemCopy = { ...item };
    const nextBarcodeId = Math.max(...items.map(v => v.barcodeId));
    itemCopy.barcodeId = nextBarcodeId === -Infinity ? 0 : nextBarcodeId;
    console.log('adding Items', items, itemCopy);

    items.push(itemCopy);
    await (this.db.items = items);
  },

  async removeItem(item) {
    console.log('removing item', item);
    let items = [...(await this.db.items)];
    delete items[items
      .map(v => v.barcodeId)
      .indexOf(item.barcodeId)
    ];
    items = items.filter(v => v);
    await (this.db.items = items);
  },

  async editItem(item) {
    const items = [...(await this.db.items)];
    console.log('ITEMS', items);
    const index = items
      .map(v => v.barcodeId)
      .indexOf(item.barcodeId);
    if (index === -1) {
      console.log('Item Not Found', index, items, item);
      return 'Item Not Found';
    }
    items[index] = item;
    items.filter(v => v);
    await (this.db.items = items);
    return item;
  },
};
