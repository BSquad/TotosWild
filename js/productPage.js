const selectedOffers = new Map(); // Offer -> amount
const selectedPositions = new Map(); // Product -> Position Set

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
  const selectionControls = createSelectionControls(product);
  div.appendChild(selectionControls);

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

function createSelectionControls(product) {
  const controlsDiv = document.createElement("div");
  controlsDiv.className = "cart-controls";

  if (product.priceType === "€") {
    product.offers.forEach(offer => {
      controlsDiv.appendChild(createOfferSelectionControl(offer, product));
    });
  }
  else {
    controlsDiv.appendChild(createPositionSelectorButton(product));
  }

  return controlsDiv;
}

function createOfferSelectionControl(offer, product) {
  const offerDiv = document.createElement("div");
  offerDiv.className = "selection-control-inline";

  offerDiv.innerHTML = `
    <div class="selection-text">
      ${`<span class="offer-label">${offer.variant}:</span>`}
      <span class="offer-price">${offer.price}${product.priceType}</span>
    </div>
    <div class="selection-buttons">
      <button class="minus-btn" disabled>-</button>
      <span class="offer-count">0</span>
      <button class="plus-btn">+</button>
    </div>
  `;

  setupOfferButtons(offer, offerDiv);

  return offerDiv;
}

function setupOfferButtons(offer, offerDiv) {
  const plusBtn = offerDiv.querySelector(".plus-btn");
  const minusBtn = offerDiv.querySelector(".minus-btn");
  const countSpan = offerDiv.querySelector(".offer-count");

  plusBtn.addEventListener("click", () => {
    const currentAmount = selectedOffers.get(offer) || 0;
    const newAmount = currentAmount + 1;
    selectedOffers.set(offer, newAmount);
    countSpan.textContent = newAmount;
    minusBtn.disabled = false;
  });

  minusBtn.addEventListener("click", () => {
    const currentAmount = selectedOffers.get(offer) || 0;
    if (currentAmount <= 0) return;

    const newAmount = currentAmount - 1;

    if (newAmount > 0) {
      selectedOffers.set(offer, newAmount);
    } else {
      selectedOffers.delete(offer);
      minusBtn.disabled = true;
    }

    countSpan.textContent = newAmount;
  });
}

function createPositionSelectorButton(product) {
  const selectionDiv = document.createElement("div");
  selectionDiv.className = "selection-control-inline";

  const textDiv = document.createElement("div");
  textDiv.className = "selection-text";
  textDiv.innerHTML = `
    ${product.weightRange ? `
        <span class="offer-label">${product.weightRange}:</span>
      ` : ``}
    <span class="offer-price">${product.weightPrice}${product.priceType}</span>
  `;

  const buttonWrapper = document.createElement("div");
  buttonWrapper.className = "selection-buttons";

  const button = document.createElement("button");
  button.className = "button-default";
  button.textContent = "Auswählen";

  const hasSelections = Array.isArray(product.positions) && product.positions.length > 0;

  button.disabled = !hasSelections;

  button.addEventListener("click", () => showPositionSelection(product));

  buttonWrapper.appendChild(button);

  selectionDiv.append(textDiv, buttonWrapper);

  return selectionDiv;
}


function showPositionSelection(product) {
  const overlay = document.createElement("div");
  overlay.classList.add("popup-overlay");

  overlay.innerHTML = `
    <div class="overlay-content">
      <h2>${product.name}</h2>
      <p>Verfügbare Auswahl:</p>

      <div class="position-list">
        ${product.positions.map((pos, index) => `
          <div class="position-item">
            <div>Gewicht: ${pos.weight} kg</div>
            <button
              class="select-position-btn"
              data-index="${index}">
              Auswählen
            </button>
          </div>
        `).join("")}
      </div>

      <div style="margin-top:15px; text-align:right;">
        <button class="button-default" id="cancel-position-btn">
          Schließen
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  overlay.querySelector("#cancel-position-btn")
    .addEventListener("click", () => overlay.remove());

  overlay.querySelectorAll(".select-position-btn")
    .forEach(button => {
      const index = Number(button.dataset.index);
      const position = product.positions[index];

      updateSelectionButton(button, product, position);

      button.addEventListener("click", () => {
        togglePositionSelection(product, position);
        updateSelectionButton(button, product, position);
      });
    });
}

function updateSelectionButton(button, product, position) {
  const isSelected =
    selectedPositions.has(product) &&
    selectedPositions.get(product).has(position);

  if (isSelected) {
    button.textContent = "-";
    button.classList.add("minus-btn");
    button.classList.remove("plus-btn");
  } else {
    button.textContent = "+";
    button.classList.add("plus-btn");
    button.classList.remove("minus-btn");
  }
}

function togglePositionSelection(product, position) {
  if (!selectedPositions.has(product)) {
    selectedPositions.set(product, new Set());
  }

  const set = selectedPositions.get(product);

  if (set.has(position)) {
    set.delete(position);
  } else {
    set.add(position);
  }
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
      <p>Abholung in Neue Reihe 21 in 38315 Werlaburgdorf - Schladen</p>
      <p>oder 38667 Bad Harzburg möglich</p>
      <button class="button-default" id="close-overlay">Schließen</button>
    </div>
  `;

  document.body.appendChild(overlay);
  document.getElementById("close-overlay").addEventListener("click", () => {
    overlay.remove();
  });
}

function showCartForm(productMap) {
  const overlay = document.createElement("div");
  overlay.id = "cart-overlay";
  overlay.classList.add("popup-overlay");

  overlay.innerHTML = `
    <div class="overlay-content">
      <h2>Bestellung aufgeben</h2>
      <form id="cart-form">
        <label>Abholungsdatum:</label>
        <input type="date" id="pickup-date" required>

        <label>Name:</label>
        <input type="text" id="customer-name" placeholder="Dein Name" required>

        <label>Produkte:</label>
        <div id="cart-items" class="cart-items"></div>

        <div id="cart-total" class="cart-total"></div>

        <div style="margin-top:15px; display:flex; gap:10px; justify-content:flex-end;">
          <button type="submit" id="submit-order-btn" class="button-default">Email erstellen</button>
          <button type="button" class="button-default" id="cancel-btn">Abbrechen</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(overlay);

  updateSubmitButtonState();

  renderCartItems(productMap);

  document.getElementById("cancel-btn")
    .addEventListener("click", () => overlay.remove());

  document.getElementById("cart-form")
    .addEventListener("submit", (e) => {
      e.preventDefault();
      createEmailClick(overlay, productMap);
      overlay.remove();
    });
}

function updateSubmitButtonState() {
  const submitBtn = document.getElementById("submit-order-btn");

  const noProducts =
    selectedOffers.size === 0 &&
    selectedPositions.size === 0;

  submitBtn.disabled = noProducts;
}

function renderCartItems(productMap) {
  const container = document.getElementById("cart-items");
  const totalDiv = document.getElementById("cart-total");

  container.innerHTML = "";
  let total = 0;

  const formatter = new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  for (const [offer, amount] of selectedOffers.entries()) {
    const product = productMap.get(offer.productId);
    const price = parseNumber(offer.price) * amount;
    total += price;

    container.appendChild(
      createCartRow(
        `${product.name} (${offer.variant})`,
        `${amount} × ${offer.price}€`,
        `${formatter.format(price)}€`,
        () => {
          selectedOffers.delete(offer);
          renderCartItems(productMap);
        }
      )
    );
  }

  for (const [product, positions] of selectedPositions.entries()) {
    for (const pos of positions) {
      const price = parseNumber(pos.weight) * parseNumber(product.weightPrice);
      total += price;

      container.appendChild(
        createCartRow(
          `${product.name}`,
          `${pos.weight} kg`,
          `${formatter.format(price)}€`,
          () => {
            positions.delete(pos);
            if (positions.size === 0) selectedPositions.delete(product);
            renderCartItems(productMap);
          }
        )
      );
    }
  }

  updateSubmitButtonState();
  totalDiv.textContent = container.children.length === 0
    ? "Keine Produkte ausgewählt."
    : `Gesamtpreis: ${formatter.format(total)}€`;
}

function createCartRow(name, info, price, onRemove) {
  const row = document.createElement("div");
  row.className = "cart-row";

  row.innerHTML = `
    <div class="cart-name">${name}</div>
    <div class="cart-info">${info}</div>
    <div class="cart-price">${price}</div>
    <button class="cart-remove">✕</button>
  `;

  row.querySelector(".cart-remove")
    .addEventListener("click", onRemove);

  return row;
}

function createEmailClick(overlay, productMap) {
  const name = document.getElementById("customer-name").value;
  const date = document.getElementById("pickup-date").value;
  const productList = createProductList(productMap);

  sendTemplateMail(name, date, productList);

  overlay.remove();
}

function createProductList(productMap) {
  const formatter = new Intl.NumberFormat("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  let totalOrderPrice = 0;

  const offerLines = Array.from(selectedOffers.entries())
    .map(([offer, amount]) => {
      const totalPrice = parseNumber(offer.price) * amount;
      totalOrderPrice += totalPrice;

      return `${productMap.get(offer.productId).name} (${offer.variant}): ${amount}x${offer.price}€ = ${formatter.format(totalPrice)}€`;
    });

  const positionLines = Array.from(selectedPositions.entries())
    .flatMap(([product, positions]) => Array.from(positions).map(pos => {
      const totalPrice = (parseNumber(pos.weight) * parseNumber(product.weightPrice));
      totalOrderPrice += totalPrice;

      return `${product.name} (${pos.weight}kg): ${formatter.format(totalPrice)}€`;
    })
    );

  let productList = [...offerLines, ...positionLines]
    .join("\n")
    .trim();

  const noProducts = productList === "";

  if (noProducts) {
    productList = "Keine Produkte im Warenkorb.";
  }
  else {
    productList += `\n\nGesamtpreis: ${formatter.format(totalOrderPrice)}€`;
  }

  return productList;
}

async function initializeProductPage() {
  const loader = document.getElementById("loader");
  loader.classList.remove("hidden");
  const container = document.getElementById("product-container");
  document.getElementById("impressum-btn").addEventListener("click", showImpressum);

  try {
    const [categories, productMap] = await loadCategories();
    document.getElementById("cart-btn").addEventListener("click", () => showCartForm(productMap));
    renderProductCategories(container, categories);
  } catch (ex) {
    container.innerHTML = "<p>Fehler beim Laden der Produkte</p>";
    console.error(ex);
  } finally {
    loader.classList.add("hidden");
  }
}