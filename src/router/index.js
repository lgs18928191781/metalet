import { createRouter, createWebHashHistory } from 'vue-router';
import store from '@/store';
import routes from './routes';

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
  if (to?.meta?.title) {
    document.title = to.meta.title;
  }
});

export default router;
