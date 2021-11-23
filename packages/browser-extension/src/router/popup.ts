import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

import Home from '../views/Home.vue';
import AccountCreate from '../views/AccountCreate.vue';
import Unlock from '../views/Unlock.vue';
import Welcome from '../views/Welcome.vue';
import WelcomeBack from '../views/WelcomeBack.vue';
import PasswordCreate from '../views/PasswordCreate.vue';
import AccountImport from '../views/AccountImport.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/create',
    name: 'Create Wallet',
    component: AccountCreate,
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
  {
    path: '/welcomeBack',
    name: 'Welcome Back',
    component: WelcomeBack,
  },
  {
    path: '/passwordCreate',
    name: 'Choose Password',
    component: PasswordCreate,
  },
  {
    path: '/accountCreate',
    name: 'Account Create',
    component: AccountCreate,
  },
  {
    path: '/accountImport',
    name: 'Account Import',
    component: AccountImport,
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

export default router;
