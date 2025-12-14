class Product {
  name;
  category;
  imageName;
  stock;
  variants;

  /**
   * @param {object} data - Ein Objekt aus der TSV (ein Produkt)
   */
  constructor(data) {
    this.name = data.Name;
    this.category = data.Kategorie;
    this.imageName = data.Bild || null;
    this.stock = data.Bestand === "X";
    this.variants = [];

    if (data.Menge && data.Preis) this.variants.push(new Variant(this, data.Menge, data.Preis));
    if (data.Menge2 && data.Preis2) this.variants.push(new Variant(this, data.Menge2, data.Preis2));
    if (data.Menge3 && data.Preis3) this.variants.push(new Variant(this, data.Menge3, data.Preis3));
  }
}

class Variant {
  product;
  amount;
  price;

  constructor(product, amount, price) {
    this.product = product;
    this.amount = amount;
    this.price = price;
  }
}