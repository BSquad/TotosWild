class Offer {
  /** @type {number} */
  productId;
  /** @type {string} */
  variant;
  /** @type {string} */
  price;
  /** @type {number} */
  amount;
  /** @type {number} */
  threshold;

  constructor(data) {
    this.productId = data.ProduktID;
    this.variant = data.Variante;
    this.price = data.Preis;
    this.amount = data.Anzahl;
    this.threshold = data.Schwellwert;
  }
}