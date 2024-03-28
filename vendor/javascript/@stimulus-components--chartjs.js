import { Controller as t } from "@hotwired/stimulus";
import { Chart as a } from "chart.js/auto";
const s = class _Chartjs extends t {
  connect() {
    const t = this.hasCanvasTarget ? this.canvasTarget : this.element;
    this.chart = new a(t.getContext("2d"), {
      type: this.typeValue,
      data: this.chartData,
      options: this.chartOptions,
    });
  }
  disconnect() {
    this.chart.destroy(), (this.chart = void 0);
  }
  get chartData() {
    return (
      this.hasDataValue ||
        console.warn(
          "[@stimulus-components/chartjs] You need to pass data as JSON to see the chart."
        ),
      this.dataValue
    );
  }
  get chartOptions() {
    return { ...this.defaultOptions, ...this.optionsValue };
  }
  get defaultOptions() {
    return {};
  }
};
(s.targets = ["canvas"]),
  (s.values = {
    type: { type: String, default: "line" },
    data: Object,
    options: Object,
  });
let e = s;
export { e as default };
