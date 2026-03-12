import { createApp, onMounted } from 'vue'
import { createPinia } from 'pinia'
// import './style.css'
import App from './App.vue'
import router from './router'

import Aura from '@primeuix/themes/aura';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import Chart from "primevue/chart";

import '@/assets/tailwind.css';
import '@/assets/styles.scss';

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.app-dark'
        }
    }
});
app.component("Chart", Chart);
app.use(ToastService);
app.use(ConfirmationService);

app.mount('#app')
