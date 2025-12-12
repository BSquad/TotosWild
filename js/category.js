class Kategorie {
  name;
  description;
  products;

  constructor(name, beschreibung) {
    this.name = name;
    this.description = beschreibung;
    this.products = [];
  }
}

function buildCategories(categoriesRaw, productsRaw) {
  const categoriesMap = {};
  categoriesRaw.forEach(category => {
    categoriesMap[category.Name] = new Kategorie(category.Name, category.Beschreibung);
  });

  productsRaw.forEach(p => {
    const catName = p.Kategorie;
    if (!categoriesMap[catName]) {
      categoriesMap[catName] = new Kategorie(catName, "");
    }
    categoriesMap[catName].products.push(p);
  });

  return Object.values(categoriesMap);
}
