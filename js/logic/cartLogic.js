/** @type {Map<Offer, number>} */
const selectedOffers = new Map();
/** @type {Map<Product, Set<Position>>} */
const selectedPositions = new Map();
/** @type {Map<Product, string>} */
const selectedRequests = new Map();

function createProductList(productMap) {
  let totalOrderPrice = 0;

  const offerLines = Array.from(selectedOffers.entries())
    .map(([offer, amount]) => {
      const totalPrice = parseNumber(offer.price) * amount;
      totalOrderPrice += totalPrice;

      return `${productMap.get(offer.productId).name} (${offer.variant}): ${amount}x${offer.price}€ = ${formatter.format(totalPrice)}€`;
    });

  const positionLines = Array.from(selectedPositions.entries())
    .flatMap(([product, positions]) => Array.from(positions).map(pos => {
      totalOrderPrice += parseNumber(pos.price);

      return `${product.name} (${pos.weight}kg): ${pos.price}€`;
    }));

  let productList = [...offerLines, ...positionLines]
    .join("\n")
    .trim();

  const noProducts = productList === "";

  if (noProducts) {
    productList = "Keine Produkte ausgewählt.";
  } else {
    productList += `\n\nGesamtpreis: ${formatter.format(totalOrderPrice)}€`;
  }

  return productList;
}

function createRequestList() {
  return Array.from(selectedRequests.entries())
    .map(([product, request]) => {
      return `${product.name}: ${request}`;
    });
}

function saveRequestText(requestText, product) {
  if (requestText !== "") {
    selectedRequests.set(product, requestText);
  }
  else {
    if (selectedRequests.has(product)) {
      selectedRequests.delete(product);
    }
  }
}

function IsSelectionEmpty() {
  return selectedOffers.size === 0 &&
    selectedPositions.size === 0 &&
    selectedRequests.size === 0;
}

function togglePositionSelection(product, position) {
  if (!selectedPositions.has(product)) {
    selectedPositions.set(product, new Set());
  }

  const set = selectedPositions.get(product);

  if (set.has(position)) {
    set.delete(position);

    if (set.size === 0) {
      selectedPositions.delete(product);
    }
  } else {
    set.add(position);
  }
}