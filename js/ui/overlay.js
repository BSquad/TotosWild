let escHandler;

function showImageOverlay(src) {
  const overlay = document.createElement("div");
  overlay.id = "image-overlay";
  overlay.className = "popup-overlay";

  overlay.innerHTML = `
    <img src="${src}">
  `;

  document.body.appendChild(overlay);
  const closeEvent = createCloseHandler(overlay);
  bindCloseEvents(overlay, closeEvent);
}

function bindCloseEvents(overlay, onCloseEvent, button = null) {
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      onCloseEvent();
    }
  });

  if (button !== null) {
    button.addEventListener("click", onCloseEvent);
  }

  escHandler = createEscHandler(onCloseEvent);
  document.addEventListener("keydown", escHandler);
}

function createEscHandler(onCloseEvent) {
  return (e) => {
    if (e.key === "Escape") {
      onCloseEvent();
    }
  };
}

function createCloseHandler(overlay, onCloseEvent = null) {
  return () => {
    if (onCloseEvent) onCloseEvent();
    overlay.remove();
    document.removeEventListener("keydown", escHandler);
  };
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
            <div>Gewicht: ${pos.weight}kg, Preis: ${pos.price}€</div>
            <button
              class="select-position-btn"
              data-index="${index}">
              Auswählen
            </button>
          </div>
        `).join("")}
      </div>

      <div style="margin-top:15px; text-align:right;">
        <button class="button-default" id="close-position-btn">
          Schließen
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  const closeEvent = createCloseHandler(overlay);
  const closeButton = overlay.querySelector("#close-position-btn");
  bindCloseEvents(overlay, closeEvent, closeButton);

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
    button.style.backgroundColor = "red";
  } else {
    button.textContent = "+";
    button.classList.add("plus-btn");
    button.classList.remove("minus-btn");
    button.style.backgroundColor = "green";
  }
}

function showRequestForm(product) {
  const overlay = document.createElement("div");
  overlay.id = "request-form-overlay";
  overlay.className = "popup-overlay";
  overlay.innerHTML = `
    <div class="overlay-content">
    <h2>Anfrage</h2>
    <label>Bemerkung:</label>
    <textarea id="request-textarea" placeholder="Anzahl, Gewicht, Wünsche, Anmerkungen, etc." required>${selectedRequests.get(product) ?? ""}</textarea>
    <button class="button-default" id="close-request-form-overlay">Schließen</button>
    </div>
  `;

  document.body.appendChild(overlay);
  const closeEvent = createCloseHandler(overlay, () => saveRequestText(overlay.querySelector("#request-textarea").value, product))
  const closeButton = overlay.querySelector("#close-request-form-overlay");
  bindCloseEvents(overlay, closeEvent, closeButton);
}

function showImpressum() {
  const overlay = document.createElement("div");
  overlay.id = "impressum-overlay";
  overlay.className = "popup-overlay";
  overlay.innerHTML = `
    <div class="overlay-content">
      <h2>Impressum</h2>
      <p>
        Thorsten Jahn<br>
        Neue Reihe 21<br>
        38315 Werlaburgdorf<br>
        Deutschland
      </p>
      <p>
        Telefon: <a href="tel:+4915140309056">0151 40309056</a><br>
        E-Mail: <a href="mailto:totos-wild@web.de">totos-wild@web.de</a>
      </p>

      <p>
        Privater Direktvermarkter / Hobbyjäger und Imker
        Gemäß §19 UStG wird keine Umsatzsteuer berechnet.
      </p>

      <p>
        Verantwortlich für den Inhalt nach §18 Abs. 2 MStV:
        Thorsten Jahn (Adresse wie oben)
      </p>

      <p>
        Verkauf von Honig/Wildprodukten erfolgt gemäß den geltenden lebensmittelrechtlichen Vorschriften. Nur Abholung nach Vereinbarung.
      </p>

      <p style="margin-top:20px;">
        <a href="#" id="open-privacy">Datenschutzerklärung</a>
      </p>

      <button class="button-default" id="close-impressum-overlay">Schließen</button>
    </div>
  `;

  document.body.appendChild(overlay);
  const closeEvent = createCloseHandler(overlay);
  const closeButton = overlay.querySelector("#close-impressum-overlay");
  bindCloseEvents(overlay, closeEvent, closeButton);
  document.getElementById("open-privacy").addEventListener("click", (e) => {
    e.preventDefault();
    showPrivacyPolicy();
  });
}

function showPrivacyPolicy() {
  const overlay = document.createElement("div");
  overlay.id = "privacy-policy-overlay";
  overlay.className = "popup-overlay";
  overlay.innerHTML = `
    <div class="overlay-content">
      <h2>Datenschutzerklärung</h2>

      <p><strong>1. Verantwortlicher</strong><br>
      Thorsten Jahn<br>
      Neue Reihe 21<br>
      38315 Werlaburgdorf<br>
      E-Mail: totos-wild@web.de</p>

      <p><strong>2. Kontaktaufnahme / Bestellung</strong><br>
      Wenn Sie per E-Mail oder über den auf der Website bereitgestellten E-Mail-Link Kontakt aufnehmen,
      werden die von Ihnen übermittelten Daten (z. B. Name, E-Mail-Adresse, Bestellinformationen)
      ausschließlich zur Bearbeitung Ihrer Anfrage bzw. Bestellung verwendet.</p>

      <p><strong>3. Speicherung und Weitergabe</strong><br>
      Die Daten werden nicht an Dritte weitergegeben und nur so lange gespeichert,
      wie dies zur Bearbeitung der Anfrage erforderlich ist.</p>

      <p><strong>4. Server-Logfiles</strong><br>
      Beim Aufruf der Website werden durch den Hostinganbieter automatisch Informationen
      in sogenannten Server-Logfiles erhoben. Diese Daten dienen ausschließlich der
      technischen Bereitstellung und Sicherheit der Website.</p>

      <p><strong>5. Ihre Rechte</strong><br>
      Sie haben das Recht auf Auskunft über Ihre gespeicherten personenbezogenen Daten
      sowie auf Berichtigung oder Löschung. Hierzu genügt eine formlose E-Mail.</p>
      <button class="button-default" id="close-privacy-policy-overlay">Schließen</button>
    </div>
  `;

  document.body.appendChild(overlay);
  const closeEvent = createCloseHandler(overlay);
  const closeButton = overlay.querySelector("#close-privacy-policy-overlay");
  bindCloseEvents(overlay, closeEvent, closeButton);
}

function showCartForm(productMap) {
  const overlay = document.createElement("div");
  overlay.id = "cart-overlay";
  overlay.className = "popup-overlay";

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
          <button type="button" class="button-default" id="close-cart-btn">Abbrechen</button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(overlay);
  const closeEvent = createCloseHandler(overlay);
  const closeButton = overlay.querySelector("#close-cart-btn");
  bindCloseEvents(overlay, closeEvent, closeButton);
  updateSubmitButtonState();
  renderCartItems(productMap);

  document.getElementById("cart-form")
    .addEventListener("submit", (e) => {
      e.preventDefault();
      createEmailClick(overlay, productMap);
      closeEvent();
    });
}

function updateSubmitButtonState() {
  const submitBtn = document.getElementById("submit-order-btn");
  submitBtn.disabled = IsSelectionEmpty();
}

function renderCartItems(productMap) {
  const container = document.getElementById("cart-items");
  const totalDiv = document.getElementById("cart-total");

  container.innerHTML = "";
  let total = 0;

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
      total += parseNumber(pos.price);

      container.appendChild(
        createCartRow(
          `${product.name}`,
          `${pos.weight} kg`,
          `${pos.price}€`,
          () => {
            positions.delete(pos);
            if (positions.size === 0) selectedPositions.delete(product);
            renderCartItems(productMap);
          }
        )
      );
    }
  }

  let requestSeparatorAdded = false;

  for (const [product, requestText] of selectedRequests.entries()) {
    if (!requestSeparatorAdded) {
      container.appendChild(createRequestSeparator());
      requestSeparatorAdded = true;
    }

    container.appendChild(
      createRequestEntry(
        product.name,
        `Anfrage: ${truncate(requestText)}`,
        () => {
          selectedRequests.delete(product);
          renderCartItems(productMap);
        }
      )
    );
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

function createRequestEntry(name, requestText, onRemove) {
  const entry = document.createElement("div");
  entry.className = "request-entry";

  entry.innerHTML = `
    <div class="request-entry-text">
      <div class="request-entry-name">${name}</div>
      <div class="request-entry-info">${requestText}</div>
    </div>
    <button class="cart-remove">✕</button>
  `;

  entry.querySelector(".cart-remove")
    .addEventListener("click", onRemove);

  return entry;
}

function createRequestSeparator() {
  const sep = document.createElement("div");
  sep.className = "cart-separator";
  sep.textContent = "Anfragen";
  return sep;
}

function createEmailClick(overlay, productMap) {
  const name = document.getElementById("customer-name").value;
  const date = document.getElementById("pickup-date").value;
  const productList = createProductList(productMap);
  const RequestList = createRequestList()

  const body = createMailBody(name, date, productList, RequestList);
  sendTemplateMail(body);

  overlay.remove();
}