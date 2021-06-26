import Lohnsteuermerkmale, {
  AbrechnungsZeitraum,
  Bundesland,
  Bundesländer,
} from "./Lohnsteuermerkmale";
import { Jahr, JahresMerkmale } from "./Jahressteuermerkmale";

export default class NettoRechner {
  private static jahr: Jahr;

  static calculate(
    bruttoLohn: number,
    calcConfig: Lohnsteuermerkmale
  ): NettoCalcResult {
    console.log(`Input Brutto Lohn: ${bruttoLohn}`);
    console.log(`Input calc config:`);
    console.dir(calcConfig);

    //Zwischenspeicher, da öfter benötigt und sich nur einmal je Berechnung ändern könnte
    NettoRechner.jahr = JahresMerkmale[calcConfig.jahr];
    let jahresBruttoLohn = bruttoLohn;
    if (calcConfig.abrechnungsZeitraum === AbrechnungsZeitraum.Month) {
      jahresBruttoLohn = bruttoLohn * 12;
    }

    const zvE =
      jahresBruttoLohn -
      this.calcVorsorgepauschale(jahresBruttoLohn, calcConfig.bundesland) -
      NettoRechner.jahr.anPauschbetrag -
      NettoRechner.jahr.sonderausgabenPauschbetrag;
    console.log(`Zu versteuerndes Einkommen: ${zvE}`);

    const lohnsteuer = this.calcEinkommenssteuer(zvE);
    return {
      steuern: {
        lohnsteuer: Math.floor(lohnsteuer),
        kirchensteuer: Math.floor(
          this.calcKirchensteuer(lohnsteuer, calcConfig.bundesland)
        ),
        soli: Math.floor(this.calcSoli(lohnsteuer)),
      },
      sozialabgaben: {
        rentenversicherung: Math.floor(
          this.calcRentenVersicherung(jahresBruttoLohn, calcConfig.bundesland)
        ),
        arbeitslosenversicherung: Math.floor(
          this.calcArbeitslosenversicherung(
            jahresBruttoLohn,
            calcConfig.bundesland
          )
        ),
        krankenversicherung: Math.floor(
          this.calcKrankenversicherung(
            jahresBruttoLohn,
            calcConfig.kvZusatzBeitrag
          )
        ),
        pflegeversicherung: Math.floor(
          this.calcPflegeversicherung(
            jahresBruttoLohn,
            calcConfig.bundesland,
            calcConfig.alter,
            calcConfig.kinder
          )
        ),
      },
    };
  }

  // Berechnung nötig für das zu versteuernde Einkommen
  private static calcVorsorgepauschale(
    jahresBruttoLohn: number,
    bundesland: Bundesland
  ): number {
    // s. https://de.wikipedia.org/wiki/Vorsorgepauschale
    // 1. Teil-Vorsorgepauschale für Rentenversicherung
    const part1 =
      this.getRvAvBasis(jahresBruttoLohn, bundesland) *
      (NettoRechner.jahr.rvBeitrag / 2) *
      NettoRechner.jahr.rvKorrekturFaktor;
    // 2. Teil-Vorsorgepauschale für Kranken- und Pflegeversicherung
    // a Mindestansatz 12%
    const part2a =
      jahresBruttoLohn * 0.12 > 1900 ? 1900 : jahresBruttoLohn * 0.12;
    // b Basisversorgung Krankenversicherung: Krankenversicherungsbeitrag abzgl. Krankentagebettbeitrag zzgl. Pflegeversicherungsbeitrag
    const part2b = this.getKvPvBasis(jahresBruttoLohn) * 0.09425;
    // 3. Vergleichsrechnung:
    // Max. aus 1 + 2a oder 1 + 2b aufgerundet zurückgeben
    return Math.ceil(Math.max(part1 + part2a, part1 + part2b));
  }

  // Berechnungen der Steuerarten
  private static calcEinkommenssteuer(zuVersteuerndeEinkommen: number): number {
    //TODO das ist fix 2021 nach aktuellem Gesetzestext, s. https://www.gesetze-im-internet.de/estg/__32a.html
    if (zuVersteuerndeEinkommen <= 9744) {
      // Tarifzone 1
      return 0;
    } else if (zuVersteuerndeEinkommen <= 14753) {
      // Tarifzone 2
      const y = (zuVersteuerndeEinkommen - 9744) / 10000;
      return (995.21 * y + 1400) * y;
    } else if (zuVersteuerndeEinkommen <= 57918) {
      // Tarifzone 3
      const z = (zuVersteuerndeEinkommen - 14753) / 10000;
      return (208.85 * z + 2397) * z + 950.96;
    } else {
      // Gemeinsame Variable für Tarifzone 4 & 5
      const x = Math.floor(zuVersteuerndeEinkommen);
      if (zuVersteuerndeEinkommen <= 274612) {
        // Tarifzone 4
        return 0.42 * x - 9136.63;
      } else {
        // Tarifzone 5 ab dem 274613'en Euro
        return 0.45 * x - 17374.99;
      }
    }
  }

  private static calcKirchensteuer(
    einkommenssteuer: number,
    bundesland: Bundesland
  ): number {
    //TODO das ist fix 2021
    if (
      bundesland === Bundesländer["BW"] ||
      bundesland === Bundesländer["BY"]
    ) {
      return 0.08 * einkommenssteuer;
    } else {
      return 0.09 * einkommenssteuer;
    }
  }

  private static calcSoli(einkommenssteuer: number): number {
    //TODO das ist fix 2021
    if (einkommenssteuer <= 16956) {
      // Freibetrag
      return 0;
    } else if (einkommenssteuer < 31528) {
      // Gleitzone nach Freibetrag
      // Grenzsteuersatz auf jeden Euro in der Gleitzone 11,9%
      //TODO überprüfen, keien Ahnung ob richtig
      return 0.119 * (31528 - 16956);
    } else {
      // Fix 5,5% nach Gleitone
      return 0.05 * einkommenssteuer;
    }
  }

  // Hilfsmethoden für die Basis der RV/AV und  KV/PV Jahresbruttolohn bis zur Beitragsbemessungsrenze
  private static getRvAvBasis(
    jahresBruttoLohn: number,
    bundesland: Bundesland
  ): number {
    //Bei RV/AV Bundesland relevant, da "Osten" niedrigere Bemessungsgrenze (Stand 2021)
    return bundesland.osten
      ? Math.min(
          jahresBruttoLohn,
          NettoRechner.jahr.rvBeitragsbemessungsgrenzeOst
        )
      : Math.min(
          jahresBruttoLohn,
          NettoRechner.jahr.rvBeitragsbemessungsgrenze
        );
  }

  private static getKvPvBasis(jahresBruttoLohn: number): number {
    return Math.min(
      jahresBruttoLohn,
      NettoRechner.jahr.kvBeitragsbemessungsgrenze
    );
  }

  // Berechnungen der Sozialversicherungsabgaben
  private static calcRentenVersicherung(
    jahresBruttoLohn: number,
    bundesland: Bundesland
  ): number {
    const anRvBeitrag = NettoRechner.jahr.rvBeitrag / 2;
    return this.getRvAvBasis(jahresBruttoLohn, bundesland) * anRvBeitrag;
  }

  private static calcArbeitslosenversicherung(
    jahresBruttoLohn: number,
    bundesland: Bundesland
  ): number {
    const anAvBeitrag = NettoRechner.jahr.avBeitrag / 2;
    return this.getRvAvBasis(jahresBruttoLohn, bundesland) * anAvBeitrag;
  }

  private static calcKrankenversicherung(
    jahresBruttoLohn: number,
    kvZusatzBeitrag: number
  ): number {
    // kvZusatzbeitrag kommt als volle Prozent und nicht dezimal
    const anKvBeitrag =
      (NettoRechner.jahr.kvBeitrag + kvZusatzBeitrag / 100) / 2;
    return this.getKvPvBasis(jahresBruttoLohn) * anKvBeitrag;
  }

  private static calcPflegeversicherung(
    jahresBruttoLohn: number,
    bundesland: Bundesland,
    alter: number,
    kinder: boolean
  ) {
    let anPvBeitrag = NettoRechner.jahr.pvBeitrag / 2;
    if (bundesland === Bundesländer["SN"]) {
      // Sonderregel Sachsen wegen irgendnem Feiertrag Streit...
      anPvBeitrag += 0.005;
    }
    if (alter > 23 && kinder === false) {
      // Sonderregel Kinderlose ab vollendetem 23. Lebensjahr (24)
      anPvBeitrag += 0.0025;
    }
    return this.getKvPvBasis(jahresBruttoLohn) * anPvBeitrag;
  }
}

interface NettoCalcResult {
  steuern: Steuern;
  sozialabgaben: Sozialabgaben;
}

interface Steuern {
  lohnsteuer: number;
  kirchensteuer: number;
  soli: number;
}

interface Sozialabgaben {
  rentenversicherung: number;
  arbeitslosenversicherung: number;
  krankenversicherung: number;
  pflegeversicherung: number;
}
