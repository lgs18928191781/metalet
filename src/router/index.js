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
    const user = store.state.user;
    if (!user.wif) {
      next({
        path: '/login',
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
