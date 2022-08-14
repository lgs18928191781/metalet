import Layout from '@/layout';

export default [
  {
    name: 'login',
    path: '/login',
    component: () => import('@/page/login/index.vue'),
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
        meta: {
          title: '',
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
