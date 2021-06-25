import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import NettoRechner from "./calc/NettoRechner";
import { Steuerklasse, Bundesländer } from "./calc/Lohnsteuermerkmale";

function App() {
  const ctxRef = useRef(null);
  const chartRef = useRef<Chart>(null);
  const [lohn, setLohn] = useState(0);

  enum AbrechnungsZeitäume {
    Month,
    Year,
  }
  const [abrechnungszeitraum, setAbrechnungszeitraum] = useState(
    AbrechnungsZeitäume.Month
  );
  const [steuerklasse, setSteuerklasse] = useState(1);
  const [isKirche, setIsKirche] = useState(false);
  const [bundesland, setBundesland] = useState("nrw");
  const [alter, setAlter] = useState(24);
  const [hasKinder, setHasKinder] = useState(false);
  const [kinderfreibetrag, setKinderfreibetrag] = useState(0);
  const [KVZusatzBeitrag, setKVZusatzBeitrag] = useState(1.3);

  useEffect(() => {
    chartRef.current = new Chart(ctxRef.current, {
      type: "doughnut",
      data: {
        labels: ["Netto", "Steuern", "Sozialabgaben", "Test", "Test2", "Test3"],
        datasets: [
          {
            data: [300, 50, 100],
            backgroundColor: [
              "rgb(255, 99, 132)",
              "rgb(54, 162, 235)",
              "rgb(255, 205, 85)",
            ],
          },
          {
            data: [300, 50, 100],
            backgroundColor: [
              "rgb(200, 99, 132)",
              "rgb(10, 162, 235)",
              "rgb(100, 205, 85)",
            ],
          },
        ],
      },
      options: {
        maintainAspectRatio: true,
      },
    });
    console.dir(
      NettoRechner.calculate(100000, {
        jahr: 2021,
        steuerklasse: Steuerklasse.I,
        kirchenMitglied: true,
        bundesland: Bundesländer["NW"],
        alter: 24,
        kinder: false,
        kvZusatzBeitrag: 1.3,
      })
    );
    return () => {
      if (chartRef && chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    // do calculations
    const chart = chartRef.current;
    if (chart) {
      console.log("here");
      const newData = [200, 100, 50];

      // chart.data.datasets[0].data = newData;
      // chart.update();
    }
  }, [lohn, steuerklasse]);

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
              value={lohn}
              onChange={(e) => setLohn(parseInt(e.target.value, 10))}
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
                  value={AbrechnungsZeitäume.Month}
                  checked={abrechnungszeitraum === AbrechnungsZeitäume.Month}
                  onChange={() =>
                    setAbrechnungszeitraum(AbrechnungsZeitäume.Month)
                  }
                />
              </label>
              <label>
                Jahr
                <input
                  type="radio"
                  name="Abrechnungszeitraum"
                  value={AbrechnungsZeitäume.Year}
                  checked={abrechnungszeitraum === AbrechnungsZeitäume.Year}
                  onChange={() =>
                    setAbrechnungszeitraum(AbrechnungsZeitäume.Year)
                  }
                />
              </label>
            </div>
          </label>
          <label>
            Steuerklasse
            <select
              value={steuerklasse}
              onChange={(e) => setSteuerklasse(parseInt(e.target.value, 10))}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
            </select>
          </label>
          <label>
            In der Kirche?
            <input
              type="checkbox"
              checked={isKirche}
              onChange={(e) => setIsKirche(e.target.checked)}
            />
          </label>
          <label>
            Bundesland
            <select
              value={bundesland}
              onChange={(e) => setBundesland(e.target.value)}
            >
              <option value="nrw">NRW</option>
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
              checked={hasKinder}
              onChange={(e) => setHasKinder(e.target.checked)}
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
              value={KVZusatzBeitrag}
              onChange={(e) => setKVZusatzBeitrag(parseInt(e.target.value, 10))}
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
