class Category {
  name;
  description;
  products;

  constructor(data) {
    this.name = data.Name;
    this.description = data.Beschreibung;
    this.products = [];
  }
}