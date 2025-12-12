function renderProductCategories(container, categories, categoryInfo) {
  container.innerHTML = "";

  for (const [catName, prods] of Object.entries(categories)) {
    container.appendChild(Object.assign(document.createElement("h2"), { textContent: catName }));

    if (categoryInfo[catName]) {
      const infoDiv = buildCategoryInfoElement(categoryInfo, catName);
      container.appendChild(infoDiv);
    }

    for (const p of prods) {
      const div = buildProductCard(p);
      container.appendChild(div);
    }
  }
}

function buildCategoryInfoElement(categoryInfo, catName) {
  const infoDiv = document.createElement("div");
  infoDiv.className = "category-info";
  infoDiv.innerHTML = categoryInfo[catName].replace(/\\n/g, "<br>");
  return infoDiv;
}

function buildProductCard(p) {
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

  div.style.borderRight = `8px solid ${p.Bestand === "X" ? "green" : "red"}`;
  return div;
}

function showImpressum() {
  const overlay = document.createElement("div");
  overlay.id = "impressum-overlay";
  overlay.classList.add("impressum-overlay");
  overlay.innerHTML = `
    <div class="overlay-content">
      <h2>Impressum</h2>
      <p>Thorsten Jahn</p>
      <p>Telefon: 0151/40309056</p>
      <p>E-Mail: toto1977@web.de</p>
      <p>Abholung in 38315 Werlaburgdorf - Schladen</p>
      <p>oder 38667 Bad Harzburg möglich</p>
      <button id="close-overlay">Schließen</button>
    </div>
  `;

  document.body.appendChild(overlay);
  document.getElementById("close-overlay").addEventListener("click", () => {
    overlay.remove();
  });
}

async function initializeProductPage() {
  const container = document.getElementById("product-container");
  const loader = document.getElementById("loader");
  loader.classList.remove("hidden");

  try {
    const [productsRaw, categoriesRaw] = await loadProductsAndCategories();
    const { categories, categoryInfo } = assignProductsToCategories(categoriesRaw, productsRaw);
    renderProductCategories(container, categories, categoryInfo);
  } catch (err) {
    container.innerHTML = "<p>Fehler beim Laden der Produkte</p>";
    console.error(err);
  } finally {
    loader.classList.add("hidden");
  }
}