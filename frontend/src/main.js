import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'


library.add(faUserSecret)
createApp(App).component('font-awesome-icon', FontAwesomeIcon)

createApp(App).use(store).use(router).mount("#app");
