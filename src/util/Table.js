import Database from './Database';
import Log from './Log';
import Base from './Base';

export default {
  db: null,
  sortBy: null,
  sortUp: null,
  async init(onUpdate) {
    this.onUpdate = onUpdate;
    this.old_db = new Database('webshopTable', onUpdate);
    this.db = new Database('WebshopTableV2', onUpdate);
    if ((await this.old_db.items).length > 0) {
      window.alert('Migrating barcodes');

      const items = await this.old_db.items;
      for (let i = 0; i < items.length; i += 1) {
        await this.addItem({ name: items[i].name, price: items[i].price });
      }
      Log(__filename, 'Migrated table', { old_db: this.old_db });
      await this.old_db.erase();
    }
    Log(__filename, 'Inited table', { db: this.db, onUpdate });
  },

  async erase() {
    Log(__filename, 'Erasing items');
    await this.db.erase();
  },

  get items() {
    Log(__filename, 'Getting items', {
      items: this.db.items,
      sorted: this.sortItems(this.db.items),
    });
    return this.sortItems(this.db.items);
  },

  async sortItems(itemsPromise) {
    const items = await itemsPromise;
    const originalItems = [...items];
    items.sort((a, b) => {
      if (a[this.sortBy] > b[this.sortBy]) {
        return this.sortUp ? 1 : -1;
      }

      if (a[this.sortBy] < b[this.sortBy]) {
        return this.sortUp ? -1 : 1;
      }

      return 0;
    });
    Log(__filename, 'Sorted Items', {
      items,
      originalItems,
      sortUp: this.sortUp,
      sortBy: this.sortBy,
    });
    return items;
  },

  async addItem(item) {
    const items = [...(await this.db.items)];
    const itemCopy = { ...item };
    const prevBarcodeId = Math.max(...items.map(v => Base.from.b128(v.barcodeId)));
    const barcodeId = Base.to.b128(+new Date()).slice(-4);
    itemCopy.barcodeId = barcodeId !== Base.to.b128(prevBarcodeId)
      ? barcodeId
      : Base.to.b128(Base.from.b128(barcodeId) + 1);

    items.push(itemCopy);
    await (this.db.items = items);
    Log(__filename, 'Added Item', { items, itemCopy });
  },

  async removeItem(item) {
    let items = [...(await this.db.items)];
    delete items[items
      .map(v => v.barcodeId)
      .indexOf(item.barcodeId)
    ];
    items = items.filter(v => v);
    await (this.db.items = items);
    Log(__filename, 'Removed item', { item, items });
  },

  async editItem(item) {
    const items = [...(await this.db.items)];
    const index = items
      .map(v => v.barcodeId)
      .indexOf(item.barcodeId);
    if (index === -1) {
      Log(__filename, 'Item Not Found', {
        index, items, item,
      });
      return 'Item Not Found';
    }
    items[index] = item;
    items.filter(v => v);
    await (this.db.items = items);
    Log(__filename, 'Edited Item', {
      item,
      index,
      items,
    });
    return item;
  },

  async updateSort(name) {
    if (this.sortBy === name) {
      this.sortUp = !this.sortUp;
    } else {
      this.sortBy = name;
    }
    this.onUpdate(await this.items);
    Log(__filename, 'updated sort', {
      sortBy: this.sortBy,
      sortUp: this.sortUp,
      name,
    });
  },
};
