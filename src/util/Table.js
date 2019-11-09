import Dexie from 'dexie';

export default {
  db: null,
  init(onChange) {
    this.onChange = onChange;
    this.db = new Dexie('webshopTable');
    this.db.version(1).stores({
      data: 'id++,data',
    });
    return this.items;
  },

  get items() {
    return (async () => {
      const data = await this.db.data.toArray();
      console.log('DATA', data);
      return data[0] || [];
    })();
  },

  async erase() {
    await this.db.data.clear();
  },

  set items(data) {
    return (async () => {
      await this.erase();
      await this.db.data.put(data);
      this.onChange(data);
      return data;
    })();
  },

  async addItem(item) {
    console.log((await this.items), this);
    const items = [...(await this.items)];
    const itemCopy = { ...item };
    const nextBarcodeId = Math.max(...items.map(v => v.barcodeId));
    itemCopy.barcodeId = nextBarcodeId === -Infinity ? 0 : nextBarcodeId;
    console.log('adding Items', items, itemCopy);

    items.push(itemCopy);
    await (this.items = items);
  },

  async removeItem(item) {
    console.log('removing item', item);
    let items = [...(await this.items)];
    delete items[items
      .map(v => v.barcodeId)
      .indexOf(item.barcodeId)
    ];
    items = items.filter(v => v);
    await (this.items = items);
  },

  async editItem(item) {
    const items = [...(await this.items)];
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
    await (this.items = items);
    return item;
  },
};
