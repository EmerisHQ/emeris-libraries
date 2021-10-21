import { createApp } from 'vue';

import App from './App.vue';
import router from '@/router/popup';

import { rootstore } from '../store/index';

const app = createApp(App);

app.use(rootstore).use(router).mount('#app');
