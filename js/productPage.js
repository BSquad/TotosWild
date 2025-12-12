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

  const variants = [
    { menge: p.Menge, preis: p.Preis },
    p.Menge2 && p.Preis2 ? { menge: p.Menge2, preis: p.Preis2 } : null,
    p.Menge3 && p.Preis3 ? { menge: p.Menge3, preis: p.Preis3 } : null,
  ].filter(Boolean);

  div.style.borderRight = `8px solid ${p.Bestand === "X" ? "green" : "red"}`;

  const contentDiv = document.createElement("div");
  contentDiv.className = "product-content";
  contentDiv.innerHTML = `
    <div class="product-text">
      <div class="name">${p.Name}</div>
    </div>
    ${img}
  `;
  
  div.appendChild(contentDiv);

  const controlsDiv = document.createElement("div");
  controlsDiv.className = "cart-controls";

  variants.forEach(v => {
    const variantDiv = document.createElement("div");
    variantDiv.className = "variant-control-inline";

    variantDiv.innerHTML = `
      <div class="variant-text">
        <span class="variant-label">${v.menge}:</span>
        <span class="variant-price">${v.preis}</span>
      </div>
      <div class="variant-buttons">
        <button class="minus-btn" disabled>-</button>
        <span class="variant-count">0</span>
        <button class="plus-btn">+</button>
      </div>
    `;

    const plusBtn = variantDiv.querySelector(".plus-btn");
    const minusBtn = variantDiv.querySelector(".minus-btn");
    const countSpan = variantDiv.querySelector(".variant-count");

    const key = `${p.Name}-${v.menge}`;
    cart[key] = cart[key] || { menge: 0, preis: v.preis };

    plusBtn.addEventListener("click", () => {
      cart[key].menge += 1;
      countSpan.textContent = cart[key].menge;
      minusBtn.disabled = false;
    });

    minusBtn.addEventListener("click", () => {
      if (cart[key].menge > 0) {
        cart[key].menge -= 1;
        countSpan.textContent = cart[key].menge;
        if (cart[key].menge === 0) minusBtn.disabled = true;
      }
    });

    controlsDiv.appendChild(variantDiv);
  });

  div.appendChild(controlsDiv);
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
      <button class="button-default" id="close-overlay">Schließen</button>
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