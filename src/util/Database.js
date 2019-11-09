import Dexie from 'dexie';

export default class {
  constructor(name, onUpdate) {
    this.name = name;
    this.onUpdate = onUpdate;
    this.db = new Dexie('webshopTable');
    this.db.version(1).stores({
      data: 'id++,data',
    });
  }

  get items() {
    return (async () => {
      const data = await this.db.data.toArray();
      console.log('DATA', data);
      return data[0] || [];
    })();
  }

  set items(value) {
    return (async () => {
      await this.erase();
      await this.db.data.put(value);
      this.onUpdate(value);
      return value;
    })();
  }

  async erase() {
    this.db.data.clear();
  }
}
