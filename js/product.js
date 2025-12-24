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

function parseNumber(numberStr) {
  return parseFloat(numberStr.toString().replace(",", "."));
}

function fillProductsWithPositions(products, positions) {
  const productMap = new Map(
    products.map(p => [p.id, p])
  );

  for (const position of positions) {
    const product = productMap.get(position.productId);
    product.positions.push(position);
  }

  return products;
}

function fillProductsWithOffers(products, offers) {
  const productMap = new Map(
    products.map(p => [p.id, p])
  );

  for (const offer of offers) {
    const product = productMap.get(offer.productId);
    product.offers.push(offer);
  }

  return products;
}

function fillProducts(products, offers, positions) {
  const productsWithPositions = fillProductsWithPositions(products, positions);
  const productsWithOffersAndPositions = fillProductsWithOffers(productsWithPositions, offers);
  return productsWithOffersAndPositions;
}