import { createRouter, createWebHashHistory } from 'vue-router';
import store from '@/store';
import routes from './routes';
import config from '@/config';

// 实例化路由
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// 路由守护
router.beforeEach((to, from, next) => {
  if (to.meta.needAuth !== false) {
    const account = store.state.account;
    if (!account || !account.currentAccount || !account.currentAccount.wif) {
      next({
        path: '/welcome',
      });
      return;
    }
  }
  next();
});
router.afterEach((to) => {
  document.title = to?.meta?.title || config.CONFIG_APP_NAME;
});

export default router;
