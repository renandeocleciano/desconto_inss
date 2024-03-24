import { Controller } from "@hotwired/stimulus";

// Connects to data-controller="proponentes"
export default class extends Controller {
  connect() {}

  static targets = ["params"];

  calcularAliquota() {
    const salario = this.paramsTarget.value;
    fetch(`/calculadora?salario=${salario}`, {
      contentType: "application/json",
      hearders: "application/json",
    })
      .then((response) => response.json())
      .then((res) => {
        document.getElementById("input_recolhido").value = res.aliquota;
        document.getElementById("salario_liquido").innerHTML =
          res.salario_liquido;
      });
  }
}
