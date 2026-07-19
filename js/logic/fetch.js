async function loadData(typ) {
  const piUrl = "https://www-totos-wild-und-honig-de.k2x1vmwia2xhdx8w.myfritz.net";
  const response = await fetch(`${piUrl}?typ=${typ}`);
  const daten = await response.json();
  return daten;
}