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

function fillCategoriesWithProducts(categories, products) {
  const categoryMap = new Map(
    categories.map(c => [c.name, c])
  );

  for (const product of products) {
    const category = categoryMap.get(product.category);
    category.products.push(product);
  }

  return categories;
}
