export const JahresMerkmale: Jahre = {
  2021: {
    rvBeitrag: 0.186,
    rvKorrekturFaktor: 0.84,
    rvBeitragsbemessungsgrenze: 85200,
    rvBeitragsbemessungsgrenzeOst: 80400,
    kvBeitragsbemessungsgrenze: 58050,
    anPauschbetrag: 1000,
    sonderausgabenPauschbetrag: 36,
  },
};

interface Jahre {
  [id: string]: Jahr;
}

export interface Jahr {
  rvBeitrag: number;
  rvKorrekturFaktor: number;
  rvBeitragsbemessungsgrenze: number;
  rvBeitragsbemessungsgrenzeOst: number;
  kvBeitragsbemessungsgrenze: number;
  anPauschbetrag: number;
  sonderausgabenPauschbetrag: number;
}
