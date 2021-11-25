import { createApp } from 'vue';
import VueTippy from 'vue-tippy';

import '@/assets/scss/index.scss';
import '@@/styles/index.scss';
import 'tippy.js/dist/tippy.css';

import App from './App.vue';
import router from '@@/router/popup';

import { rootstore } from '../store/index';

const app = createApp(App);

app.use(rootstore).use(router).use(VueTippy).mount('#app');