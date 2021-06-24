import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

function App() {
  const ctxRef = useRef(null);
  const chartRef = useRef<Chart>(null);
  const [lohn, setLohn] = useState(0);
  const [abrechnungszeitraum, setAbrechnungszeitraum] = useState("month");
  const [steuerklasse, setSteuerklasse] = useState(1);
  const [isKirche, setIsKirche] = useState(false);
  const [bundesland, setBundesland] = useState("nrw");
  const [alter, setAlter] = useState(24);
  const [hasKinder, setHasKinder] = useState(false);
  const [kinderfreibetrag, setKinderfreibetrag] = useState(0);

  useEffect(() => {
    console.log("herePrev");
    chartRef.current = new Chart(ctxRef.current, {
      type: "doughnut",
      data: {
        labels: ["Red", "Blue", "Yellow"],
        datasets: [
          {
            label: "My First Dataset",
            data: [300, 50, 100],
            backgroundColor: [
              "rgb(255, 99, 132)",
              "rgb(54, 162, 235)",
              "rgb(255, 205, 85)",
            ],
            hoverOffset: 4,
          },
        ],
      },
      options: {
        maintainAspectRatio: true,
      },
    });
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

      chart.data.datasets[0].data = newData;
      chart.update();
    }
  }, [lohn]);

  return (
    <>
      <div>
        <div style={{ fontSize: "40px" }}>Brutto-Netto-Rechner</div>
        <form style={{ display: "grid", gap: 12 }}>
          <label>
            Bruttolohn
            <input
              type="number"
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
                  value="month"
                  checked={abrechnungszeitraum === "month"}
                  onChange={(e) => setAbrechnungszeitraum(e.target.value)}
                />
              </label>
              <label>
                Jahr
                <input
                  type="radio"
                  name="Abrechnungszeitraum"
                  value="year"
                  checked={abrechnungszeitraum === "year"}
                  onChange={(e) => setAbrechnungszeitraum(e.target.value)}
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
        </form>
      </div>
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <canvas ref={ctxRef}></canvas>
      </div>
    </>
  );
}

export default App;
