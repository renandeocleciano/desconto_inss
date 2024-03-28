import { Application } from "@hotwired/stimulus";
import Chartjs from "@stimulus-components/chartjs";

const application = Application.start();
application.register("chartjs", Chartjs);

// Configure Stimulus development experience
application.debug = false;
window.Stimulus = application;

export { application };
