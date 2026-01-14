import { createApp } from 'vue';
import App from '@/App.vue';

const app = createApp(App);

// pinia store
import { createPinia } from 'pinia';
const pinia = createPinia();
app.use(pinia);

// load config and set default settings
import { loadConfig } from '@/config';
await loadConfig();

// Global fetch interceptor for 401 handling
const originalFetch = window.fetch;
window.fetch = async function(...args) {
  const response = await originalFetch(...args);
  
  // Handle 401 Unauthorized globally
  if (response.status === 401) {
    // Clear the invalid token from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Get current path to preserve for redirect after login
    const currentPath = window.location.pathname + window.location.search + window.location.hash;
    
    // Only redirect if not already on login page or auth routes
    if (!window.location.pathname.includes('/login') && 
        !window.location.pathname.includes('/register') &&
        !window.location.pathname.includes('/password-reset') &&
        !window.location.pathname.includes('/2fa')) {
      const redirectUrl = encodeURIComponent(currentPath);
      window.location.href = `/login?redirect=${redirectUrl}`;
    }
  }
  
  return response;
};

import router from '@/router';
app.use(router);

// main app css
import '@/assets/css/app.css';

// perfect scrollbar
import { PerfectScrollbarPlugin } from 'vue3-perfect-scrollbar';
app.use(PerfectScrollbarPlugin);

//vue-meta
import { createHead } from '@vueuse/head';
const head = createHead();
app.use(head);

//vue-i18n
import i18n from '@/i18n';
app.use(i18n);

// tippy tooltips
import { TippyPlugin } from 'tippy.vue';
app.use(TippyPlugin);

//input mask
import { vMaska } from 'maska/vue';
app.directive('maska', vMaska);

//markdown editor
import VueEasymde from 'vue3-easymde';
import 'easymde/dist/easymde.min.css';
app.use(VueEasymde);

// popper
import Popper from 'vue3-popper';
app.component('Popper', Popper);

// json to excel
import vue3JsonExcel from 'vue3-json-excel';
app.use(vue3JsonExcel);

app.mount('#app');
