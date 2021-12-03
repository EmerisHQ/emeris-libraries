import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

import Home from '../views/Home.vue';
import Create from '../views/Create.vue';
import Unlock from '../views/Unlock.vue';
import Welcome from '../views/Welcome.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/create',
    name: 'Create Wallet',
    component: Create,
  },
  {
    path: '/unlock',
    name: 'Unlock Wallet',
    component: Unlock,
  },
  {
    path: '/welcome',
    name: 'Welcome',
    component: Welcome,
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

export default router;
