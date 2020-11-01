import {Route, RouteConfig} from 'vue-router';

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'login',
    component: () => import('pages/Login.vue'),
    meta: {
      title: (route: Route) => 'Login',
    }
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '/schedule',
        name: 'schedule',
        component: () => import('pages/Schedules.vue'),
        meta: {
          title: (route: Route) => 'Schedules',
        }
      },
      {
        path: '/new/employees',
        name: 'newEmployees',
        component: () => import('pages/NewEmployees.vue'),
        meta: {
          title: (route: Route) => 'New Employees',
        }
      },
      {
        path: '/new/members',
        name: 'newMembers',
        component: () => import('pages/NewMembers.vue'),
        meta: {
          title: (route: Route) => 'New Members',
        }
      },
      {
        path: '/missing',
        name: 'missing',
        component: () => import('pages/Missing.vue'),
        meta: {
          title: (route: Route) => 'Missing',
        }
      },
      {
        path: '/transfers',
        name: 'transfers',
        component: () => import('pages/Transfers.vue'),
        meta: {
          title: (route: Route) => 'Transfers',
        }
      },
      {
        path: '/notYet',
        name: 'notYet',
        component: () => import('pages/NotYet.vue'),
        meta: {
          title: (route: Route) => 'Not Yet',
        }
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue'),
    meta: {
      title: (route: Route) => 'Error',
    }
  }
];

export default routes;
