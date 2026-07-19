async function loadCategories() {
  const productsRaw = await loadData("products");
  const offersRaw = await loadData("offers");
  const positionsRaw = await loadData("positions");
  const categoriesRaw = await loadData("categories");

  const productsEmpty = productsRaw.map(d => new Product(d));
  const offers = offersRaw.map(d => new Offer(d));
  const categoriesEmpty = categoriesRaw.map(d => new Category(d));
  const positions = positionsRaw
    .filter(d => d.ProduktID != null && d.ProduktID !== "" && d.Gewicht != null && d.Gewicht !== "")
    .map(d => new Position(d));


  const products = fillProducts(productsEmpty, offers, positions);
  const categories = fillCategoriesWithProducts(categoriesEmpty, products);

  const productMap = new Map(
    products.map(p => [p.id, p])
  );

  return [categories, productMap];
}