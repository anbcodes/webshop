import Database from './Database';
import Log from './Log';

export default {
  db: null,
  sortBy: null,
  sortUp: null,
  init(onUpdate) {
    Log('Initing table', { onUpdate, __filename });
    this.onUpdate = onUpdate;
    this.db = new Database('WebShopTable', onUpdate);
  },

  get items() {
    Log('Getting items', {
      items: this.db.items,
      sorted: this.sortItems(this.db.items),
      __filename,
    });
    return this.sortItems(this.db.items);
  },

  async erase() {
    Log('Erasing items', {
      __filename,
    });
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

  async sortItems(itemsPromise) {
    const items = await itemsPromise;
    items.sort((a, b) => {
      if (a[this.sortBy] > b[this.sortBy]) {
        return this.sortUp ? 1 : -1;
      }

      if (a[this.sortBy] < b[this.sortBy]) {
        return this.sortUp ? -1 : 1;
      }

      return 0;
    });
    return items;
  },

  async updateSort(name) {
    Log('updating sort', {
      sortBy: this.sortBy,
      sortUp: this.sortUp,
      name,
      __filename,
    });
    if (this.sortBy === name) {
      this.sortUp = !this.sortUp;
    } else {
      this.sortBy = name;
    }
    this.onUpdate(await this.items);
  },
};
