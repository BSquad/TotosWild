class Product {
    /**
     * @param {object} data - Ein Objekt aus der TSV (ein Produkt)
     */
    constructor(data) {
        this.Name = data.Name;
        this.Kategorie = data.Kategorie;
        this.Bild = data.Bild || null;
        this.Bestand = data.Bestand === "X" ? "Lager" : "Bestellung";
        this.Varianten = [];

        if (data.Menge && data.Preis) this.Varianten.push({ Menge: data.Menge, Preis: data.Preis });
        if (data.Menge2 && data.Preis2) this.Varianten.push({ Menge: data.Menge2, Preis: data.Preis2 });
        if (data.Menge3 && data.Preis3) this.Varianten.push({ Menge: data.Menge3, Preis: data.Preis3 });
    }
}