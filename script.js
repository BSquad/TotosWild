// Funktion: Produkte aus JSON laden und anzeigen
async function loadProducts() {
  const container = document.getElementById("product-container");
  
  const categoryInfo = {
    "Honig": "Unsere kleine Hobby-Imkerei liefert Ihnen feinsten Honig aus regionaler Blütenvielfalt<br>100% naturbelassen, unverfälscht und mit Liebe gemacht Ohne Zuckerzusatz - echter, reiner Bienenhonig",
    "Wildschwein": "Nachhaltig gejagt, regional verarbeitet, höchste Qualität",
    "Reh": "Nachhaltig gejagt, regional verarbeitet, höchste Qualität"
  };

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
	  
	  if (categoryInfo[category]) {
        const pInfo = document.createElement("p");
        pInfo.className = "category-info";
        pInfo.textContent = categoryInfo[category];
        container.appendChild(pInfo);
      }

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
