class Product {
    Name;
    Kategorie;
    Bild;
    Bestand;
    Varianten;

    /**
     * @param {object} data - Ein Objekt aus der TSV (ein Produkt)
     */
    constructor(data) {
        this.Name = data.Name;
        this.Kategorie = data.Kategorie;
        this.Bild = data.Bild || null;
        this.Bestand = data.Bestand === "X";
        this.Varianten = [];

        if (data.Menge && data.Preis) this.Varianten.push(new Variant(this, data.Menge, data.Preis));
        if (data.Menge2 && data.Preis2) this.Varianten.push(new Variant(this, data.Menge2, data.Preis2));
        if (data.Menge3 && data.Preis3) this.Varianten.push(new Variant(this, data.Menge3, data.Preis3));
    }
}

class Variant {
    Produkt;
    Menge;
    Preis;

    constructor(produkt, menge, preis) {
        this.Produkt = produkt;
        this.Menge = menge;
        this.Preis = preis;
    }
}