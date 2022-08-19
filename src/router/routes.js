import Layout from '@/layout';

export default [
  {
    name: 'welcome',
    path: '/welcome',
    component: () => import('@/page/welcome/index.vue'),
    meta: {
      needAuth: false,
    },
  },
  {
    name: 'account',
    path: '/account',
    component: () => import('@/page/account/index.vue'),
    meta: {
      needAuth: false,
    },
  },
  {
    name: 'layout',
    path: '/',
    component: Layout,
    children: [
      {
        name: 'home',
        path: '/',
        component: () => import('@/page/home/index.vue'),
        meta: {},
      },
      {
        name: 'test',
        path: '/test',
        component: () => import('@/page/test/index.vue'),
        meta: {
          needAuth: false,
        },
      },
    ],
  },
  {
    name: 'notFound',
    path: '/:pathMatch(.*)*',
    component: () => import('@/page/notFound/index.vue'),
    meta: {
      needAuth: false,
    },
  },
];
