import React, { useEffect } from 'react';
import Chart from 'chart.js/auto';

function App() {


useEffect(()=>{
  const ctx = document.getElementById("myChart");
  const myChart = new Chart(ctx, {
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
  return () => {myChart.destroy()}
},[])

  return (<>
    <div>
      <div style={{fontSize: "40px"}}>Brutto-Netto-Rechner</div>
      <form style={{display: "grid"}}>
        <span>Bruttolohn pro Monat</span>
        <input type="number" />
        <span>Abrechnungszeitraum</span>
        <input type="radio" name="Abrechnungszeitraum" value="month" />
        <input type="radio" name="Abrechnungszeitraum" value="year" />
        <span>Steuerklasse</span>
        <select>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
        </select>
        <span>In der Kirche?</span>
        <input type="checkbox" />
        <span>Bundesland</span>
        <select>
          <option value="nrw">NRW</option>
        </select>
        <span>Alter</span>
        <select>
          <option value="24">24</option>
        </select>
        <span>Kinder?</span>
        <input type="checkbox" />
        <span>Kinderfreibetrag</span>
        <input type="number" />
      </form>
    </div>
    <div style={{position: "relative", width: "100%", height: "100%"}}>
      <canvas id="myChart"></canvas>
    </div>
    </>
  );
}

export default App;
