import { Controller } from "@hotwired/stimulus";

// Connects to data-controller="dashboard"
export default class extends Controller {
  static targets = ["grafico"];

  canvasContext() {
    return this.graficoTarget.getContext("2d");
  }

  getLegends(data) {
    const keys = Object.keys(data);
    return keys.map((k) => this.getLegend(parseInt(k)));
  }

  getLegend(key) {
    switch (key) {
      case 1:
        return "Até R$ 1.045,00";
      case 2:
        return "De R$ 1.045,01 a R$ 2.089,60";
      case 3:
        return "De R$ 2.089,61 até R$ 3.134,40";
      case 4:
        return "De R$ 3.134,41 até R$ 6.101,06";
      default:
        return "Fora da Faixa";
    }
  }

  async getData() {
    fetch(`/dashboard/proponentes`, {
      contentType: "application/json",
      hearders: "application/json",
    })
      .then((response) => response.json())
      .then((res) => {
        new Chart(this.canvasContext(), {
          type: "bar",
          data: {
            labels: this.getLegends(res),
            datasets: [
              {
                label: "Gráfico Por Agrupamento de Faixa",
                data: Object.values(res),
                backgroundColor: [
                  "rgba(255, 99, 132, 0.2)",
                  "rgba(54, 162, 235, 0.2)",
                  "rgba(255, 206, 86, 0.2)",
                  "rgba(75, 192, 192, 0.2)",
                  "rgba(153, 102, 255, 0.2)",
                  "rgba(255, 159, 64, 0.2)",
                ],
                borderColor: [
                  "rgba(255, 99, 132, 1)",
                  "rgba(54, 162, 235, 1)",
                  "rgba(255, 206, 86, 1)",
                  "rgba(75, 192, 192, 1)",
                  "rgba(153, 102, 255, 1)",
                  "rgba(255, 159, 64, 1)",
                ],
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      });
  }
  connect() {
    this.getData();
  }
}
