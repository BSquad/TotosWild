async function fetchTSV(url) {
  //https://docs.google.com/spreadsheets/d/1dTOeVckrXhczMe1M2IH5WsL817teLYTqHtMI0hLQDto/edit?gid=0#gid=0
  const res = await fetch(url);
  const tsvText = await res.text();
  const lines = tsvText.trim().split("\n");
  const headers = lines.shift().split("\t").map(h => h.trim());
  return lines.map(line => Object.fromEntries(headers.map((h, i) => [h, line.split("\t")[i]?.trim()])));
}

async function loadProductsAndCategories() {
  const [productsRaw, categoriesRaw] = await Promise.all([
    fetchTSV("https://docs.google.com/spreadsheets/d/e/2PACX-1vREBTSfAxtL3CUUCYdfq18N96hbNra9mSQP7NjkolG--a0DeveIkb0QZhtsm39yqDCAjtebofyHod42/pub?gid=0&output=tsv"),
    fetchTSV("https://docs.google.com/spreadsheets/d/e/2PACX-1vREBTSfAxtL3CUUCYdfq18N96hbNra9mSQP7NjkolG--a0DeveIkb0QZhtsm39yqDCAjtebofyHod42/pub?gid=771625926&output=tsv")
  ]);

  const products = productsRaw.map(p => new Product(p));
  const categories = categoriesRaw.map(c => new Category(c));

  return [products, categories];
}

function sendTemplateMail(name, dateInput, productList) {
  const subject = encodeURIComponent("Bestellung bei Toto's Wild & Honig");
  const date = new Date(dateInput);
  const formattedDate = new Intl.DateTimeFormat('de-DE').format(date);
  const body = encodeURIComponent(`Hallo Herr Jahn,\n\nich möchte folgende Produkte bestellen:\n\n${productList}\n\nAbholungsdatum: ${formattedDate}\nBitte bestätigen sie die Bestellung.\n\nViele Grüße,\n${name}`);
  const mailto = `mailto:toto1977@web.de?subject=${subject}&body=${body}`;

  window.location.href = mailto;
}