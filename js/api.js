async function fetchTSV(url) {
  const res = await fetch(url);
  const tsvText = await res.text();
  const lines = tsvText.trim().split("\n");
  const headers = lines.shift().split("\t").map(h => h.trim());
  return lines.map(line => Object.fromEntries(headers.map((h, i) => [h, line.split("\t")[i]?.trim()])));
}

async function loadCategories() {
  const [productsRaw, offersRaw, positionsRaw, categoriesRaw] = await Promise.all([
    fetchTSV("https://docs.google.com/spreadsheets/d/e/2PACX-1vREBTSfAxtL3CUUCYdfq18N96hbNra9mSQP7NjkolG--a0DeveIkb0QZhtsm39yqDCAjtebofyHod42/pub?gid=0&output=tsv"),
    fetchTSV("https://docs.google.com/spreadsheets/d/e/2PACX-1vREBTSfAxtL3CUUCYdfq18N96hbNra9mSQP7NjkolG--a0DeveIkb0QZhtsm39yqDCAjtebofyHod42/pub?gid=1546980724&output=tsv"),
    fetchTSV("https://docs.google.com/spreadsheets/d/e/2PACX-1vREBTSfAxtL3CUUCYdfq18N96hbNra9mSQP7NjkolG--a0DeveIkb0QZhtsm39yqDCAjtebofyHod42/pub?gid=352870673&output=tsv"),
    fetchTSV("https://docs.google.com/spreadsheets/d/e/2PACX-1vREBTSfAxtL3CUUCYdfq18N96hbNra9mSQP7NjkolG--a0DeveIkb0QZhtsm39yqDCAjtebofyHod42/pub?gid=771625926&output=tsv"),
  ]);

  const productsEmpty = productsRaw.map(d => new Product(d));
  const offers = offersRaw.map(d => new Offer(d));
  const categoriesEmpty = categoriesRaw.map(d => new Category(d));
  const positions = positionsRaw
    .filter(d => d.ProduktID != null && d.ProduktID !== "" && d.Gewicht != null && d.Gewicht !== "")
    .map(d => new Position(d));


  const products = fillProducts(productsEmpty, offers, positions);
  const categories = fillCategoriesWithProducts(categoriesEmpty, products);

  const productMap = new Map(
    products.map(p => [p.id, p])
  );

  return [categories, productMap];
}

function sendTemplateMail(body) {
  const subject = encodeURIComponent("Bestellung bei Toto's Wild & Honig");
  const mailto = `mailto:toto1977@web.de?subject=${subject}&body=${body}`;

  window.location.href = mailto;
}

function createMailBody(name, dateInput, productList, requestList) {
  const date = new Date(dateInput);
  const formattedDate = new Intl.DateTimeFormat('de-DE').format(date);
  return encodeURIComponent(`Hallo Herr Jahn,\n\nich möchte folgende Produkte bestellen:\nAbholungsdatum: ${formattedDate}\n\n${productList}\n\nch möchte folgende Prdukte anfragen:\n${requestList}\nBitte bestätigen sie die Bestellung.\n\nViele Grüße,\n${name}`);
}