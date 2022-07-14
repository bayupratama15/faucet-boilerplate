import { createRouter, createWebHashHistory } from 'vue-router';

import Faucet from '../views/Faucet.vue';
const routes = [
  {
    path: '/',
    name: 'faucet',
    component: Faucet,
  },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
