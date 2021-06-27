import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import NettoRechner from "./calc/NettoRechner";
import {
  AbrechnungsZeitraum,
  Steuerklasse,
  Bundesländer,
} from "./calc/Lohnsteuermerkmale";

function App() {
  const ctxRef = useRef(null);
  const chartRef = useRef<Chart>(null);

  const [bruttoLohn, setBruttoLohn] = useState(0);
  const [abrechnungsZeitraum, setAbrechnungsZeitraum] = useState(
    AbrechnungsZeitraum.Month
  );
  const [steuerklasse, setSteuerklasse] = useState(Steuerklasse.I);
  const [kirchenMitglied, setKirchenMitglied] = useState(false);
  const [bundesland, setBundesland] = useState("NW");
  const [alter, setAlter] = useState(24);
  const [kinder, setKinder] = useState(false);
  const [kinderfreibetrag, setKinderfreibetrag] = useState(0);
  const [kvZusatzBeitrag, setKvZusatzBeitrag] = useState(1.3);

  useEffect(() => {
    chartRef.current = new Chart(ctxRef.current, {
      type: "doughnut",
      data: {
        labels: ["Netto", "Steuern", "Sozialabgaben"],
        datasets: [
          {
            data: [300, 50, 100],
            backgroundColor: ["#1f77b4", "#ff7f0e", "#2ca02c"],
          },
          {
            data: [300, 50, 100],
            backgroundColor: [
              "#fff",
              "#ee7422",
              "#f59c3c",
              "#fcbe75",
              "#256f3d",
              "#428f4d",
              "#85ca77",
              "#a5db96",
            ],
          },
        ],
      },
      options: {
        maintainAspectRatio: true,
      },
    });

    return () => {
      chartRef?.current.destroy();
    };
  }, []);

  useEffect(() => {
    // do calculations
    const chart = chartRef.current;
    if (chart) {
      const newData = NettoRechner.calculate(bruttoLohn, {
        abrechnungsZeitraum,
        jahr: 2021,
        steuerklasse,
        kirchenMitglied,
        bundesland: Bundesländer[bundesland],
        alter,
        kinder,
        kvZusatzBeitrag,
      });
      console.dir(newData);

      const steuern =
        newData.steuern.lohnsteuer +
        newData.steuern.kirchensteuer +
        newData.steuern.soli;
      const sozialabgaben =
        newData.sozialabgaben.arbeitslosenversicherung +
        newData.sozialabgaben.krankenversicherung +
        newData.sozialabgaben.pflegeversicherung +
        newData.sozialabgaben.rentenversicherung;
      chart.data.datasets[0].data = [
        bruttoLohn - steuern,
        steuern,
        sozialabgaben,
      ];
      chart.data.datasets[1].data = [
        bruttoLohn - steuern,
        newData.steuern.lohnsteuer,
        newData.steuern.kirchensteuer,
        newData.steuern.soli,
        newData.sozialabgaben.arbeitslosenversicherung,
        newData.sozialabgaben.krankenversicherung,
        newData.sozialabgaben.pflegeversicherung,
        newData.sozialabgaben.rentenversicherung,
      ];
      chart.update();
    }
  }, [
    alter,
    bundesland,
    kinder,
    kirchenMitglied,
    kvZusatzBeitrag,
    bruttoLohn,
    steuerklasse,
    abrechnungsZeitraum,
  ]);

  return (
    <>
      <div>
        <div style={{ fontSize: "40px" }}>Brutto-Netto-Rechner</div>
        <form style={{ display: "grid", gap: 12 }}>
          <label>
            Bruttolohn
            <input
              type="number"
              min={0}
              step={1000}
              value={bruttoLohn}
              onChange={(e) => setBruttoLohn(parseInt(e.target.value, 10))}
            />
          </label>
          <label>
            Abrechnungszeitraum
            <div style={{ display: "flex", gap: 16 }}>
              <label>
                Monat
                <input
                  type="radio"
                  name="Abrechnungszeitraum"
                  value={AbrechnungsZeitraum.Month}
                  checked={abrechnungsZeitraum === AbrechnungsZeitraum.Month}
                  onChange={() =>
                    setAbrechnungsZeitraum(AbrechnungsZeitraum.Month)
                  }
                />
              </label>
              <label>
                Jahr
                <input
                  type="radio"
                  name="Abrechnungszeitraum"
                  value={AbrechnungsZeitraum.Year}
                  checked={abrechnungsZeitraum === AbrechnungsZeitraum.Year}
                  onChange={() =>
                    setAbrechnungsZeitraum(AbrechnungsZeitraum.Year)
                  }
                />
              </label>
            </div>
          </label>
          <label>
            Steuerklasse
            <select
              value={steuerklasse}
              onChange={(e) => setSteuerklasse(e.target.value as Steuerklasse)}
            >
              {Object.keys(Steuerklasse).map((key) => (
                <option value={key}>{key}</option>
              ))}
            </select>
          </label>
          <label>
            In der Kirche?
            <input
              type="checkbox"
              checked={kirchenMitglied}
              onChange={(e) => setKirchenMitglied(e.target.checked)}
            />
          </label>
          <label>
            Bundesland
            <select
              value={bundesland}
              onChange={(e) => setBundesland(e.target.value)}
            >
              {Object.keys(Bundesländer).map((key) => (
                <option value={key}>{Bundesländer[key].name}</option>
              ))}
            </select>
          </label>
          <label>
            Alter
            <select
              value={alter}
              onChange={(e) => setAlter(parseInt(e.target.value, 10))}
            >
              <option value="24">24</option>
            </select>
          </label>
          <label>
            Kinder?
            <input
              type="checkbox"
              checked={kinder}
              onChange={(e) => setKinder(e.target.checked)}
            />
          </label>
          <label>
            Kinderfreibetrag
            <input
              type="number"
              value={kinderfreibetrag}
              onChange={(e) =>
                setKinderfreibetrag(parseInt(e.target.value, 10))
              }
            />
          </label>
          <label>
            KV-Zusatzbeitrag
            <input
              type="number"
              step={0.1}
              value={kvZusatzBeitrag}
              onChange={(e) => setKvZusatzBeitrag(parseInt(e.target.value, 10))}
            />
          </label>
        </form>
      </div>
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <canvas ref={ctxRef}></canvas>
      </div>
    </>
  );
}

export default App;
