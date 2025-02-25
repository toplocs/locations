import axios from 'axios';
import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue';
import { session, reloadSession } from '@/services/sessionService';

const serverURL = import.meta.env.VITE_SERVER_URL;
axios.defaults.baseURL = serverURL;

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('@/views/LoginPage.vue')
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/tab1'
      },

      {
        path: 'tab1',
        component: () => import('@/views/Tab1Page.vue'),
      },
      {
        path: 'tab1/settings',
        component: () => import('@/views/tab1/Settings.vue'),
      },

      {
        path: 'tab2',
        component: () => import('@/views/Tab2Page.vue'),
      },
      {
        path: 'tab2/new',
        component: () => import('@/views/tab2/New.vue'),
      },
      {
        path: 'tab2/location/:id',
        component: () => import('@/views/tab2/Location.vue'),
      },

      {
        path: 'tab3',
        component: () => import('@/views/Tab3Page.vue'),
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach(async (to, from, next) => {
  await reloadSession();

  if (to.path === '/login' && session) {
    next('/tabs/tab1');
  } else {
    next();
  }
});

export default router
