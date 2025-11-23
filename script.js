// --- JSON laden ---
async function fetchProducts() {
  const response = await fetch("Produkte.json?v=" + new Date().getTime());
  return await response.json();
}

// --- Produkte nach Kategorie gruppieren ---
function groupByCategory(products) {
  const categories = {};
  for (const p of products) {
    if (!categories[p.category]) categories[p.category] = [];
    categories[p.category].push(p);
  }
  return categories;
}

// --- Kategorie-Info erzeugen ---
function createCategoryInfoElement(category, categoryInfo) {
  if (!categoryInfo[category]) return null;

  const div = document.createElement("div");
  div.className = "category-info";
  div.textContent = categoryInfo[category]; // CSS white-space: pre-line beachten
  return div;
}

// --- Produktkarte erzeugen ---
function createProductElement(product) {
  const div = document.createElement("div");
  div.className = "product";
  div.innerHTML = `
    <div class="name">${product.name}</div>
    <div class="desc">${product.description}: ${product.price}</div>
  `;
  return div;
}

// --- Kategorien anzeigen ---
function renderCategories(container, categories, categoryInfo) {
  container.innerHTML = "";

  for (const category in categories) {
    const h2 = document.createElement("h2");
    h2.textContent = category;
    container.appendChild(h2);

    const infoElem = createCategoryInfoElement(category, categoryInfo);
    if (infoElem) container.appendChild(infoElem);

    for (const product of categories[category]) {
      const prodElem = createProductElement(product);
      container.appendChild(prodElem);
    }
  }
}

// --- Hauptfunktion ---
async function loadProducts() {
  const container = document.getElementById("product-container");

  const categoryInfo = {
    "Honig": "Unsere kleine Hobby-Imkerei liefert Ihnen feinsten Honig aus regionaler Blütenvielfalt\n100% naturbelassen, unverfälscht und mit Liebe gemacht\nOhne Zuckerzusatz - echter, reiner Bienenhonig",
    "Wildschwein": "Nachhaltig gejagt, regional verarbeitet, höchste Qualität",
    "Reh": "Nachhaltig gejagt, regional verarbeitet, höchste Qualität"
  };

  try {
    const products = await fetchProducts();
    const categories = groupByCategory(products);
    renderCategories(container, categories, categoryInfo);
  } catch (err) {
    container.innerHTML = "<p>Fehler beim Laden der Produkte</p>";
    console.error(err);
  }
}

loadProducts();
