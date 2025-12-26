class Product {
  id;
  name;
  category;
  imageName;
  offers;
  weightRange;
  basePrice;
  priceType;
  positions;

  constructor(data) {
    this.id = data.ID;
    this.name = data.Name;
    this.category = data.Kategorie;
    this.imageName = data.Bild || null;
    this.weightRange = data.Gewichtsbereich || null;
    this.weightPrice = data.Kilopreis || 0;
    this.priceType = data.Preisart; // € or €/kg
    this.offers = [];
    this.positions = [];
  }
}