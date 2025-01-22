import axios from 'axios';
import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import storage from '../StorageService';
import TabsPage from '../views/TabsPage.vue'
import LoginPage from '../views/LoginPage.vue'
import { serverURL } from '@/config.ts';

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

const getSession = async (authHeader: string) => {
  const response = await axios.get(`/api/auth`, {
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      }
    });

  return response.data;
}

//middleware
router.beforeEach(async (to, from, next) => {
  const authHeader = await storage.get('authHeader');
  const { session } = await getSession(authHeader);

  if (to.path === '/login' && session) {
    next('/tabs/tab1');
  } else {
    next();
  }
});

export default router
