import { createApp } from 'vue';
import VueTippy from 'vue-tippy';
import { createI18n } from 'vue-i18n';

import '@/assets/scss/index.scss';
import '@@/styles/index.scss';
import 'tippy.js/dist/tippy.css';

import App from './App.vue';
import router from '@@/router/popup';

import { rootstore } from '../store/index';

import { messages } from '@/locales/en';
const i18n = createI18n({
  globalInjection: true,
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages,
  numberFormats: {
    en: {
      currency: {
        style: 'currency',
        currency: 'USD',
        notation: 'standard',
      },
    },
  },
});

const app = createApp(App);

app.use(rootstore).use(i18n).use(router).use(VueTippy).mount('#app');
