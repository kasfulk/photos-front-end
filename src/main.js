import { createApp } from "vue";
import bootstrap from "bootstrap";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import "bootstrap/dist/css/bootstrap.css";

createApp(App).use(router).use(bootstrap).mount("#app");
