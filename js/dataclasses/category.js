class Category {
  /** @type {string} */
  name;
  /** @type {string} */
  description;
  /** @type {[Product]} */
  products;

  constructor(data) {
    this.name = data.Name;
    this.description = data.Beschreibung;
    this.products = [];
  }
}