function fillProducts(products, offers, positions) {
  const productMap = new Map(products.map(p => [p.id, p]));

  for (const offer of offers) {
    const product = productMap.get(offer.productId);
    if (product) product.offers.push(offer);
  }

  for (const position of positions) {
    const product = productMap.get(position.productId);
    if (product) product.positions.push(position);
  }

  return products;
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
