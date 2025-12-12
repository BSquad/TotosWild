function assignProductsToCategories(categoriesRaw, productsRaw) {
  const categoryInfo = Object.fromEntries(categoriesRaw.map(c => [c.Name, c.Beschreibung]));
  const categories = productsRaw.reduce((acc, p) => {
    if (!acc[p.Kategorie]) acc[p.Kategorie] = [];
    acc[p.Kategorie].push(p);
    return acc;
  }, {});
  return { categories, categoryInfo };
}