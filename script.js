async function fetchProducts() {
  const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vREBTSfAxtL3CUUCYdfq18N96hbNra9mSQP7NjkolG--a0DeveIkb0QZhtsm39yqDCAjtebofyHod42/pub?output=tsv";
  const response = await fetch(url);
  const tsvText = await response.text();

  return parseTSV(tsvText);
}

function parseTSV(tsvText) {
  const lines = tsvText.trim().split("\n");
  const headers = lines.shift().split("\t").map(h => h.trim());

  return lines.map(line => {
    const values = line.split(",").map(v => v.trim());
    return {
      category: values[headers.indexOf("Kategorie")],
      name: values[headers.indexOf("Name")],
      description: values[headers.indexOf("Beschreibung")],
      price: values[headers.indexOf("Preis")]
    };
  });
}

function groupByCategory(products) {
  const categories = {};
  for (const p of products) {
    if (!categories[p.category]) categories[p.category] = [];
    categories[p.category].push(p);
  }
  return categories;
}

function createCategoryInfoElement(category, categoryInfo) {
  if (!categoryInfo[category]) return null;

  const div = document.createElement("div");
  div.className = "category-info";
  div.textContent = categoryInfo[category];
  return div;
}

function createProductElement(product) {
  const div = document.createElement("div");
  div.className = "product";
  div.innerHTML = `
    <div class="name">${product.name}</div>
    <div class="desc">${product.description}: ${product.price}</div>
  `;
  return div;
}


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

async function createContent() {
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

createContent();
