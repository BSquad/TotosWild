async function fetchProducts() {
  //https://docs.google.com/spreadsheets/d/1dTOeVckrXhczMe1M2IH5WsL817teLYTqHtMI0hLQDto/edit?gid=0#gid=0
  const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vREBTSfAxtL3CUUCYdfq18N96hbNra9mSQP7NjkolG--a0DeveIkb0QZhtsm39yqDCAjtebofyHod42/pub?gid=0&output=tsv";
  const response = await fetch(url);
  const tsvText = await response.text();
  const products = parseProductsTSV(tsvText);

  return products;
}

async function fetchCategories() {
  const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vREBTSfAxtL3CUUCYdfq18N96hbNra9mSQP7NjkolG--a0DeveIkb0QZhtsm39yqDCAjtebofyHod42/pub?gid=771625926&output=tsv";
  const response = await fetch(url);
  const tsvText = await response.text();
  const categories = parseCategoriesTSV(tsvText);

  return categories;
}

function parseProductsTSV(tsvText) {
  const lines = tsvText.trim().split("\n");
  const headers = lines.shift().split("\t").map(h => h.trim());

  return lines.map(line => {
    const values = line.split("\t").map(v => v.trim());
    return {
      category: values[headers.indexOf("Kategorie")],
      name: values[headers.indexOf("Name")],
      description: values[headers.indexOf("Beschreibung")],
      price: values[headers.indexOf("Preis")],
      imageName: values[headers.indexOf("Bild")]
    };
  });
}

function parseCategoriesTSV(tsvText) {
  const lines = tsvText.trim().split("\n");
  const headers = lines.shift().split("\t").map(h => h.trim());

  const map = {};

  for (const line of lines) {
    const values = line.split("\t").map(v => v.trim());
    const name = values[headers.indexOf("Name")];
    const description = values[headers.indexOf("Beschreibung")];

    if (name) {
      map[name] = description;
    }
  }

  return map;
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
  div.innerHTML = categoryInfo[category].replace(/\\n/g, "<br>");
  return div;
}

function createProductElement(product) {
  const div = document.createElement("div");
  const imageUrl = product.imageName
    ? "images/" + product.imageName
    : null;
  div.className = "product";
  div.innerHTML = `
    <div class="product-content">
      <div class="product-text">
        <div class="name">${product.name}</div>
        <div class="desc">${product.description}: ${product.price}</div>
      </div>
      ${imageUrl
      ? `<img class="product-img" src="${imageUrl}" alt="${product.name}">`
      : ""
    }
    </div>
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
  const loader = document.getElementById("loader");
  loader.classList.remove("hidden");

  try {
    const [products, categoryInfo] = await Promise.all([
      fetchProducts(),
      fetchCategories()
    ]);

    const categories = groupByCategory(products);
    loader.classList.add("hidden");
    renderCategories(container, categories, categoryInfo);
  } catch (err) {
    loader.classList.add("hidden");
    container.innerHTML = "<p>Fehler beim Laden der Produkte</p>";
    console.error(err);
  }
}

createContent();
