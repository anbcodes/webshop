import Dexie from 'dexie';

export default class Table {
  constructor() {
    this.db = new Dexie('webshopTable');
    this.db.version(1).stores({
      data: 'id++,data',
    });
  }

  async get() {
    const data = await this.db.data.toArray();
    console.log('DATA', data);
    return data[0];
  }

  async erase() {
    await this.db.data.clear();
  }

  async set(data) {
    this.db.data.put(data);
    return data;
  }
}
