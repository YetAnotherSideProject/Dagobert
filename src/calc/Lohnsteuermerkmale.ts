export default interface Lohnsteuermerkmale {
  jahr: number;
  steuerklasse: Steuerklasse;
  kirchenMitglied: boolean;
  bundesland: Bundesland;
  alter: number;
  kinder: boolean;
  kvZusatzBeitrag: number;
}

export enum Steuerklasse {
  I = "I",
  II = "II",
  III = "III",
  IV = "IV",
  V = "V",
  VI = "VI",
}

export const Bundesländer: Länder = {
  BW: { name: "Baden-Württemberg", osten: false },
  BY: { name: "Bayern", osten: false },
  BE: { name: "Berlin", osten: true },
  BB: { name: "Brandenburg", osten: true },
  HB: { name: "Bremen", osten: false },
  HH: { name: "Hamburg", osten: false },
  HE: { name: "Hessen", osten: false },
  MV: { name: "Mecklenburg-Vorpommern", osten: true },
  NI: { name: "Niedersachsen", osten: false },
  NW: { name: "Nordrhein-Westfalen", osten: false },
  RP: { name: "Rheinland-Pfalz", osten: false },
  SL: { name: "Saaarland", osten: false },
  SN: { name: "Sachsen", osten: true },
  ST: { name: "Sachsen-Anhalt", osten: true },
  SH: { name: "Schleswig-Holstein", osten: false },
  TH: { name: "Thüringen", osten: true },
};

interface Länder {
  [id: string]: Bundesland;
}

export interface Bundesland {
  name: string;
  osten: boolean;
}
