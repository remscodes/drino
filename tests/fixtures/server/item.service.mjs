import { Item } from './item.mjs';

class ItemService {

  constructor() {
    this.create(new Item('My First Item'));
    this.create(new Item('My Second Item'));
    this.create(new Item('My Third Item'));
  }

  #itemMap = new Map();
  #sequence = 0;

  create(item) {
    item.id = ++this.#sequence;
    this.#itemMap.set(this.#sequence, item);
    return item;
  }

  update(id, updatedItem) {
    const item = this.#itemMap.get(id);
    if (!item) return;

    const newItem = {
      ...item,
      ...updatedItem
    }

    this.#itemMap.set(id, newItem);

    return newItem;
  }

  findById(id) {
    return this.#itemMap.get(id);
  }

  findAll() {
    return Array.from(this.#itemMap.values());
  }

  delete(_id) {
    // return this.#itemMap.delete(id);
    return true;
  }
}

export const service = new ItemService();
