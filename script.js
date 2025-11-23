// Funktion: Produkte aus JSON laden und anzeigen
async function loadProducts() {
  const container = document.getElementById("product-container");

  try {
    const response = await fetch("Produkte.json");
    const products = await response.json();

    // Produkte nach Kategorien gruppieren
    const categories = {};
    for (const p of products) {
      if (!categories[p.category]) {
        categories[p.category] = [];
      }
      categories[p.category].push(p);
    }

    // Kategorien ausgeben
    for (const category in categories) {
      const h2 = document.createElement("h2");
      h2.textContent = category;
      container.appendChild(h2);

      // Produkte je Kategorie anzeigen
      for (const product of categories[category]) {
        const div = document.createElement("div");
        div.className = "product";
        div.innerHTML = `
          <div class="name">${product.name}</div>
          <div class="desc">${product.description}: ${product.price}</div>
        `;
        container.appendChild(div);
      }
    }
  } catch (err) {
    container.innerHTML = "<p>Fehler beim Laden der Produkte.</p>";
    console.error(err);
  }
}

loadProducts();
