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

  return div;
}

function getColor(amount, threshold) {
  if (amount >= threshold) {
    return "green";
  }
  else if (amount > 0) {
    return "yellow";
  }
  else {
    return "red";
  }
}

function createProductContent(product) {
  const contentDiv = document.createElement("div");
  contentDiv.className = "product-content";

  const textDiv = document.createElement("div");
  textDiv.className = "product-text";
  textDiv.innerHTML = `<div class="name">${product.name}</div>`;

  contentDiv.appendChild(textDiv);

  if (product.imageName) {
    const img = document.createElement("img");
    img.className = "product-img";
    img.src = `images/${product.imageName}`;
    img.alt = product.name;

    img.addEventListener("click", () => {
      showImageOverlay(img.src);
    });

    contentDiv.appendChild(img);
  }

  return contentDiv;
}

function createSelectionControls(product) {
  const controlsDiv = document.createElement("div");
  controlsDiv.className = "cart-controls";

  if (product.priceType === "€") {
    product.offers.forEach(offer => {
      controlsDiv.appendChild(createOfferSelectionControl(offer, product));
    });
  } else {
    controlsDiv.appendChild(createPositionSelectorButton(product));
  }

  return controlsDiv;
}

function createOfferSelectionControl(offer, product) {
  const offerDiv = document.createElement("div");
  offerDiv.className = "selection-control-inline";

  offerDiv.innerHTML = `
    <div class="selection-text">
      <span class="offer-label">${offer.variant}:</span>
      <span class="offer-price">${offer.price}${product.priceType}</span>
    </div>
    <div class="selection-buttons">
      <button class="minus-btn hidden">-</button>
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

  plusBtn.style.backgroundColor = getColor(offer.amount, offer.threshold);

  plusBtn.addEventListener("click", () => {
    const currentAmount = selectedOffers.get(offer) || 0;
    const newAmount = currentAmount + 1;
    selectedOffers.set(offer, newAmount);
    countSpan.textContent = newAmount;
    minusBtn.classList.remove("hidden");
  });

  minusBtn.addEventListener("click", () => {
    const currentAmount = selectedOffers.get(offer) || 0;
    if (currentAmount <= 0) return;

    const newAmount = currentAmount - 1;

    if (newAmount > 0) {
      selectedOffers.set(offer, newAmount);
    } else {
      selectedOffers.delete(offer);
      minusBtn.classList.add("hidden");
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
    ${product.weightRange
      ? `<span class="offer-label">${product.weightRange}:</span>`
      : ``}
    <span class="offer-price">${product.weightPrice}${product.priceType}</span>
  `;

  const hasSelections = Array.isArray(product.positions) && product.positions.length > 0;
  const buttonWrapper = document.createElement("div");
  buttonWrapper.className = "selection-buttons";
  const button = document.createElement("button");
  button.className = "button-default";

  if (hasSelections) {
    button.textContent = "Auswählen";
    button.addEventListener("click", () => showPositionSelection(product));
  } else {
    button.textContent = "Anfrage";
    button.addEventListener("click", () => showRequestForm(product));
  }
  buttonWrapper.appendChild(button);
  selectionDiv.append(textDiv, buttonWrapper);

  return selectionDiv;
}