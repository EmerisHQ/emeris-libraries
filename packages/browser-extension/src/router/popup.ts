import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

import Home from '../views/Home.vue';
import AccountCreate from '../views/AccountCreate.vue';
// import Unlock from '../views/Unlock.vue';
import Welcome from '../views/Welcome.vue';
import WelcomeBack from '../views/WelcomeBack.vue';
import PasswordCreate from '../views/PasswordCreate.vue';
import AccountImport from '../views/AccountImport.vue';
import ExtensionReset from '../views/ExtensionReset.vue';
import ExtensionResetConfirm from '../views/ExtensionResetConfirm.vue';
import AccountBackup from '../views/AccountBackup.vue';
import MnemonicShow from '../views/MnemonicShow.vue';
import MnemonicConfirm from '../views/MnemonicConfirm.vue';
import AccountReady from '../views/AccountReady.vue';
import AccountRemove from '../views/AccountRemove.vue';
import AccountRename from '../views/AccountRename.vue';
import AccountCreationResume from '../views/AccountCreationResume.vue';
import AccountAddAdditional from '../views/AccountAddAdditional.vue';
import AccountImportLedger from '../views/AccountImportLedger.vue';
import AccountImportLedgerConnect from '../views/AccountImportLedgerConnect.vue';
import Account from '../views/Account.vue';
import Accounts from '../views/Accounts.vue';

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
  // {
  //   path: '/unlock',
  //   name: 'Unlock Wallet',
  //   component: Unlock,
  // },
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
    path: '/accountRemove/:index',
    name: 'Account Remove',
    component: AccountRemove,
    props: true
  },
  {
    path: '/accountRename/:index',
    name: 'Account Rename',
    component: AccountRename,
    props: true
  },
  {
    path: '/accountAddAdditional',
    name: 'Account Add Additional',
    component: AccountAddAdditional
  },
  {
    path: '/accountImport',
    name: 'Account Import',
    component: AccountImport,
  },
  {
    path: '/accountCreationResume',
    name: 'Account Creation Resume',
    component: AccountCreationResume,
  },
  {
    path: '/extensionReset',
    name: 'Forgot Password',
    component: ExtensionReset,
  },
  {
    path: '/extensionReset/confirm',
    name: 'Extension Reset',
    component: ExtensionResetConfirm,
  },
  {
    path: '/backup',
    name: 'Account Backup',
    component: AccountBackup,
  },
  {
    path: '/backup/show',
    name: 'Recovery Phrase',
    component: MnemonicShow,
  },
  {
    path: '/backup/confirm',
    name: 'Recovery Confirm',
    component: MnemonicConfirm,
  },
  {
    path: '/accountReady',
    name: 'Account Ready',
    component: AccountReady,
  },
  {
    path: '/ledger',
    name: 'Import Ledger',
    component: AccountImportLedger,
  },
  {
    path: '/ledger/connect',
    name: 'Connect Ledger',
    component: AccountImportLedgerConnect,
  },
  {
    path: '/account',
    name: 'Account',
    component: Account,
  },
  {
    path: '/accounts',
    name: 'Accounts',
    component: Accounts,
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

export default router;
