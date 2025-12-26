class Position {
  /** @type {number} */
  productId;
  /** @type {string} */
  weight;
  /** @type {string} */
  price;

  constructor(data) {
    this.productId = data.ProduktID;
    this.weight = data.Gewicht;
    this.price = data.Preis;
  }
}