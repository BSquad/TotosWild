class Product {
  /** @type {number} */
  id;
  /** @type {string} */
  name;
  /** @type {string} */
  category;
  /** @type {string} */
  imageName;
  /** @type {[Offer]} */
  offers;
  /** @type {string} */
  weightRange;
  /** @type {string} */
  basePrice;
  /** @type {string} */
  priceType;
  /** @type {[Position]} */
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