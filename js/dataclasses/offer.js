class Offer {
  productId;
  variant;
  price;
  amount;
  threshold;

  constructor(data) {
    this.productId = data.ProduktID;
    this.variant = data.Variante;
    this.price = data.Preis;
    this.amount = data.Anzahl;
    this.threshold = data.Schwellwert;
  }
}