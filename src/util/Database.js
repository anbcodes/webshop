import Dexie from 'dexie';
import Log from './Log';

export default class {
  constructor(name, onUpdate) {
    this.name = name;
    this.onUpdate = onUpdate;
    this.db = new Dexie(name);
    this.db.version(1).stores({
      data: 'id++,data',
    });
  }

  get items() {
    return (async () => {
      const data = await this.db.data.toArray();
      Log(__filename, 'Got data from database', { data, items: data[0] || [] });
      return data[0] || [];
    })();
  }

  set items(value) {
    return (async () => {
      await this.erase();
      await this.db.data.put(value);
      this.onUpdate(value);
      Log(__filename, 'Setted data into database', { value });
      return value;
    })();
  }

  async erase() {
    Log(__filename, 'Clearing database');
    this.db.data.clear();
  }
}
