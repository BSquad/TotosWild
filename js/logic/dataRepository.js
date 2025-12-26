async function loadCategories() {
  const [productsRaw, offersRaw, positionsRaw, categoriesRaw] = await Promise.all([
    fetchTSV("https://docs.google.com/spreadsheets/d/e/2PACX-1vREBTSfAxtL3CUUCYdfq18N96hbNra9mSQP7NjkolG--a0DeveIkb0QZhtsm39yqDCAjtebofyHod42/pub?gid=0&output=tsv"),
    fetchTSV("https://docs.google.com/spreadsheets/d/e/2PACX-1vREBTSfAxtL3CUUCYdfq18N96hbNra9mSQP7NjkolG--a0DeveIkb0QZhtsm39yqDCAjtebofyHod42/pub?gid=1546980724&output=tsv"),
    fetchTSV("https://docs.google.com/spreadsheets/d/e/2PACX-1vREBTSfAxtL3CUUCYdfq18N96hbNra9mSQP7NjkolG--a0DeveIkb0QZhtsm39yqDCAjtebofyHod42/pub?gid=352870673&output=tsv"),
    fetchTSV("https://docs.google.com/spreadsheets/d/e/2PACX-1vREBTSfAxtL3CUUCYdfq18N96hbNra9mSQP7NjkolG--a0DeveIkb0QZhtsm39yqDCAjtebofyHod42/pub?gid=771625926&output=tsv"),
  ]);

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