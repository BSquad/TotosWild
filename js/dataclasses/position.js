class Position {
  productId;
  weight;
  price;

  constructor(data) {
    this.productId = data.ProduktID;
    this.weight = data.Gewicht;
    this.price = data.Preis;
  }
}