class ItemService {

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

  delete(id) {
    return this.#itemMap.delete(id);
  }
}

export const service = new ItemService();
