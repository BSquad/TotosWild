function sendTemplateMail(body) {
  const subject = encodeURIComponent("Bestellung bei Toto's Wild & Honig");
  const mailto = `mailto:totos-wild@web.de?subject=${subject}&body=${body}`;

  window.location.href = mailto;
}

function createMailBody(name, dateInput, productList, requestList) {
  const date = new Date(dateInput);
  const formattedDate = new Intl.DateTimeFormat('de-DE').format(date);
  return encodeURIComponent(`Hallo Herr Jahn,\n\nich möchte folgende Produkte bestellen:\nAbholungsdatum: ${formattedDate}\n\n${productList}\n\nch möchte folgende Prdukte anfragen:\n${requestList}\nBitte bestätigen sie die Bestellung.\n\nViele Grüße,\n${name}`);
}