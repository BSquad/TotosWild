const cart = new Map();

function renderProductCategories(container, categories) {
  container.innerHTML = "";

  categories.forEach(cat => {
    const h2 = document.createElement("h2");
    h2.textContent = cat.name;
    container.appendChild(h2);

    if (cat.description) {
      const infoDiv = document.createElement("div");
      infoDiv.className = "category-info";
      infoDiv.innerHTML = cat.description.replace(/\\n/g, "<br>");
      container.appendChild(infoDiv);
    }

    cat.products.forEach(p => {
      const productDiv = buildProductCard(p);
      container.appendChild(productDiv);
    });
  });
}

function buildProductCard(product) {
  const div = CreateProductCardDiv(product);
  const contentDiv = createProductContent(product);
  div.appendChild(contentDiv);
  const variantControls = createVariantControls(product);
  div.appendChild(variantControls);

  return div;
}

function CreateProductCardDiv(product) {
  const div = document.createElement("div");
  div.className = "product";
  div.style.borderRight = `8px solid ${product.stock ? "green" : "red"}`;
  return div;
}

function createProductContent(product) {
  const contentDiv = document.createElement("div");
  contentDiv.className = "product-content";
  const imgHtml = product.imageName ? `<img class="product-img" src="images/${product.imageName}">` : "";
  contentDiv.innerHTML = `
    <div class="product-text">
      <div class="name">${product.name}</div>
    </div>
    ${imgHtml}
  `;
  return contentDiv;
}

function createVariantControls(product) {
  const controlsDiv = document.createElement("div");
  controlsDiv.className = "cart-controls";

  product.variants.forEach(variant => {
    controlsDiv.appendChild(createVariantControl(variant));
  });

  return controlsDiv;
}

function createVariantControl(variant) {
  const variantDiv = document.createElement("div");
  variantDiv.className = "variant-control-inline";

  variantDiv.innerHTML = `
    <div class="variant-text">
      <span class="variant-label">${variant.amount}:</span>
      <span class="variant-price">${variant.price}</span>
    </div>
    <div class="variant-buttons">
      <button class="minus-btn" disabled>-</button>
      <span class="variant-count">0</span>
      <button class="plus-btn">+</button>
    </div>
  `;

  setupVariantButtons(variant, variantDiv);

  return variantDiv;
}

function setupVariantButtons(variant, variantDiv) {
  const plusBtn = variantDiv.querySelector(".plus-btn");
  const minusBtn = variantDiv.querySelector(".minus-btn");
  const countSpan = variantDiv.querySelector(".variant-count");

  plusBtn.addEventListener("click", () => {
    const currentAmount = cart.get(variant) || 0;
    const newAmount = currentAmount + 1;
    cart.set(variant, newAmount);
    countSpan.textContent = newAmount;
    minusBtn.disabled = false;
  });

  minusBtn.addEventListener("click", () => {
    const currentAmount = cart.get(variant) || 0;
    if (currentAmount <= 0) return;

    const newAmount = currentAmount - 1;

    if (newAmount > 0) {
      cart.set(variant, newAmount);
    } else {
      cart.delete(variant);
    }

    countSpan.textContent = newAmount;
    minusBtn.disabled = newAmount === 0;
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

  let productList = Array.from(cart.entries())
    .map(([variant, amount]) => {
      return `${variant.product.name} ${variant.amount}: ${amount}x ${variant.price}`;
    })
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
    const [products, categoriesEmpty] = await loadProductsAndCategories();
    const categoriesMap = buildCategories(categoriesEmpty, products);
    renderProductCategories(container, categoriesMap);
  } catch (ex) {
    container.innerHTML = "<p>Fehler beim Laden der Produkte</p>";
    console.error(ex);
  } finally {
    loader.classList.add("hidden");
  }
}