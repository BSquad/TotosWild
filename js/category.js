class Category {
  name;
  description;
  products;

  constructor(data) {
    this.name = data.Name;
    this.description = data.Beschreibung;
    this.products = [];
  }
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
