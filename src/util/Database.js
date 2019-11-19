import Dexie from 'dexie';
import Log from './Log';

export default class Database {
  /**
   * The constructor for a dexie database wraper
   * @param {String} name the name of the database
   * @param {Function} onUpdate a function called when the database has been updated
   */
  constructor(name, onUpdate) {
    this.name = name;
    this.onUpdate = onUpdate;
    this.db = new Dexie(name);
    this.db.version(1).stores({
      data: 'id++,data',
    });
  }

  /**
   * an async getter to get an object that stores the inventory
   */
  get items() {
    return (async () => {
      const data = await this.db.data.toArray();
      Log(__filename, 'Got data from database', { data, items: data[0] || [] });
      return data[0] || [];
    })();
  }

  /**
   * an async setter to set the inventory object
   */
  set items(value) {
    return (async () => {
      await this.erase();
      await this.db.data.put(value);
      this.onUpdate(value);
      Log(__filename, 'Setted data into database', { value });
      return value;
    })();
  }

  /**
   * erases the database
   */
  async erase() {
    Log(__filename, 'Clearing database');
    this.db.data.clear();
  }
}
