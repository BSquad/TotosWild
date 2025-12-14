class Product {
  id;
  name;
  category;
  imageName;
  stock;
  stockAmount;
  variants;
  priceType;
  positions;

  constructor(data) {
    this.id = data.ID;
    this.name = data.Name;
    this.category = data.Kategorie;
    this.imageName = data.Bild || null;
    this.stock = data.Bestand === "X";
    this.stockAmount = data.BestandMenge;
    this.priceType = data.Preisart;
    this.variants = [];
    this.positions = [];

    this.variants.push(new Variant(this, data.Menge, data.Preis));
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

class Position {
  productId;
  weight;

  constructor(data) {
    this.productId = data.ProduktID;
    this.weight = data.Gewicht;
  }
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