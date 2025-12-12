const cart = {}; 

function assignProductsToCategories(categoriesRaw, productsRaw) {
  const categoryInfo = Object.fromEntries(categoriesRaw.map(c => [c.Name, c.Beschreibung]));
  const categories = productsRaw.reduce((acc, p) => {
    if (!acc[p.Kategorie]) acc[p.Kategorie] = [];
    acc[p.Kategorie].push(p);
    return acc;
  }, {});
  return { categories, categoryInfo };
}

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

function buildProductCard(product) {
  const div = CreateProductCardDiv(product);
  const contentDiv = createProductContent(product);
  div.appendChild(contentDiv);
  const variants = getVariants(product);
  const variantControls = createVariantControls(product, variants);
  div.appendChild(variantControls);

  return div;
}

function CreateProductCardDiv(product) {
  const div = document.createElement("div");
  div.className = "product";
  div.style.borderRight = `8px solid ${product.Bestand === "X" ? "green" : "red"}`;
  return div;
}

function createProductContent(product) {
  const contentDiv = document.createElement("div");
  contentDiv.className = "product-content";
  const imgHtml = product.Bild ? `<img class="product-img" src="images/${product.Bild}" alt="${product.Name}">` : "";
  contentDiv.innerHTML = `
    <div class="product-text">
      <div class="name">${product.Name}</div>
    </div>
    ${imgHtml}
  `;
  return contentDiv;
}

function getVariants(product) {
  return [
    { menge: product.Menge, preis: product.Preis },
    product.Menge2 && product.Preis2 ? { menge: product.Menge2, preis: product.Preis2 } : null,
    product.Menge3 && product.Preis3 ? { menge: product.Menge3, preis: product.Preis3 } : null
  ].filter(Boolean);
}

function createVariantControls(product, variants) {
  const controlsDiv = document.createElement("div");
  controlsDiv.className = "cart-controls";

  variants.forEach(v => {
    controlsDiv.appendChild(createVariantControl(product, v));
  });

  return controlsDiv;
}

function createVariantControl(product, variant) {
  const variantDiv = document.createElement("div");
  variantDiv.className = "variant-control-inline";

  variantDiv.innerHTML = `
    <div class="variant-text">
      <span class="variant-label">${variant.menge}:</span>
      <span class="variant-price">${variant.preis}</span>
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
  const key = `${product.Name}-${variant.menge}`;

  cart[key] = cart[key] || { menge: 0, preis: variant.preis };
  setupVariantButtons(key, plusBtn, minusBtn, countSpan);

  return variantDiv;
}

function setupVariantButtons(key, plusBtn, minusBtn, countSpan) {
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
}

function showImpressum() {
  const overlay = document.createElement("div");
  overlay.id = "impressum-overlay";
  overlay.classList.add("popup-overlay");
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

function showCartForm() {
  const overlay = document.createElement("div");
  overlay.id = "cart-overlay";
  overlay.classList.add("popup-overlay");

  let productList = Object.entries(cart)
  .filter(([_, item]) => item.menge > 0)
  .map(([key, item]) => `${key} - ${item.menge}x ${item.preis}`)
  .join("\n")
  .trim();

  const noProducts = productList === "";

  if (noProducts) {
    productList = "Keine Produkte im Warenkorb.";
  }

  overlay.innerHTML = `
    <div class="overlay-content">
      <h2>Bestellung aufgeben</h2>
      <form id="cart-form">
        <label for="pickup-date">Abholungsdatum:</label>
        <input type="date" id="pickup-date" required>

        <label for="customer-name">Name:</label>
        <input type="text" id="customer-name" placeholder="Dein Name" required>

        <label for="product-list">Produkte:</label>
        <textarea id="product-list" readonly>${productList}</textarea>

        <div style="margin-top:15px; display:flex; gap:10px; justify-content:flex-end;">
          <button type="submit" class="button-default" ${noProducts ? "disabled" : ""}>Email erstellen</button>

          <button type="button" class="button-default" id="cancel-btn">Abbrechen</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(overlay);
  document.getElementById("cancel-btn").addEventListener("click", () => overlay.remove());
  document.getElementById("cart-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("customer-name").value;
    const date = document.getElementById("pickup-date").value;

    sendTemplateMail(name, date, productList);

    overlay.remove();
  });
}

async function initializeProductPage() {
  const loader = document.getElementById("loader");
  loader.classList.remove("hidden");
  const container = document.getElementById("product-container");
  document.getElementById("impressum-btn").addEventListener("click", showImpressum);
  document.getElementById("cart-btn").addEventListener("click", showCartForm);

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