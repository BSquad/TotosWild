async function fetchTSV(url) {
  //https://docs.google.com/spreadsheets/d/1dTOeVckrXhczMe1M2IH5WsL817teLYTqHtMI0hLQDto/edit?gid=0#gid=0
  const res = await fetch(url);
  const tsvText = await res.text();
  const lines = tsvText.trim().split("\n");
  const headers = lines.shift().split("\t").map(h => h.trim());
  return lines.map(line => Object.fromEntries(headers.map((h, i) => [h, line.split("\t")[i]?.trim()])));
}

function assignProductsToCategories(categoriesRaw, productsRaw) {
  const categoryInfo = Object.fromEntries(categoriesRaw.map(c => [c.Name, c.Beschreibung]));
  const categories = productsRaw.reduce((acc, p) => {
      if (!acc[p.Kategorie]) acc[p.Kategorie] = [];
      acc[p.Kategorie].push(p);
      return acc;
    }, {});
  return { categories, categoryInfo };
}


function renderContent(container, categories, categoryInfo) {
  container.innerHTML = "";

  for (const [catName, prods] of Object.entries(categories)) {
    container.appendChild(Object.assign(document.createElement("h2"), { textContent: catName }));

    if (categoryInfo[catName]) {
      const infoDiv = document.createElement("div");
      infoDiv.className = "category-info";
      infoDiv.innerHTML = categoryInfo[catName].replace(/\\n/g, "<br>");
      container.appendChild(infoDiv);
    }

    for (const p of prods) {
      const div = document.createElement("div");
      div.className = "product";
      const img = p.Bild ? `<img class="product-img" src="images/${p.Bild}" alt="${p.Name}">` : "";
      let priceText = `${p.Menge}: ${p.Preis}`;
      if (p.Menge2 && p.Preis2) {
        priceText += `<br>${p.Menge2}: ${p.Preis2}`;
      }
      if (p.Menge3 && p.Preis3) {
        priceText += `<br>${p.Menge3}: ${p.Preis3}`;
      }
      div.innerHTML = `
          <div class="product-content">
            <div class="product-text">
              <div class="name">${p.Name}</div>
              <div class="price">${priceText}</div>
            </div>
            ${img}
          </div>`;
      container.appendChild(div);
    }
  }
}

async function createContent() {
  const container = document.getElementById("product-container");
  const loader = document.getElementById("loader");
  loader.classList.remove("hidden");

  try {
    const [productsRaw, categoriesRaw] = await Promise.all([
      fetchTSV("https://docs.google.com/spreadsheets/d/e/2PACX-1vREBTSfAxtL3CUUCYdfq18N96hbNra9mSQP7NjkolG--a0DeveIkb0QZhtsm39yqDCAjtebofyHod42/pub?gid=0&output=tsv"),
      fetchTSV("https://docs.google.com/spreadsheets/d/e/2PACX-1vREBTSfAxtL3CUUCYdfq18N96hbNra9mSQP7NjkolG--a0DeveIkb0QZhtsm39yqDCAjtebofyHod42/pub?gid=771625926&output=tsv")
    ]);
    const { categories, categoryInfo } = assignProductsToCategories(categoriesRaw, productsRaw);
    renderContent(container, categories, categoryInfo);
  } catch (err) {
    container.innerHTML = "<p>Fehler beim Laden der Produkte</p>";
    console.error(err);
  } finally {
    loader.classList.add("hidden");
  }
}

createContent();
