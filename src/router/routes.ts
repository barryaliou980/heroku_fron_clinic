import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../pages/LoginPage.vue'),
  },
  {
    path: '/',
    redirect: { name: 'admin.dashboard' },
    component: () => import('src/layouts/MainLayout.vue'),
    children: [
      {
        path: '/',
        name: 'admin.dashboard',
        component: () => import('../pages/DashboardPage.vue'),
      },
      {
        path: 'add-patient',
        name: 'admin.add.patient',
        component: () => import('../pages/add-patient/AddPAtient.vue'),
      },
      {
        path: 'detail-patient/:id',
        name: 'admin.detail.patient',
        component: () => import('../pages/add-patient/AddPAtient.vue'),
      },
      {
        path: 'list-patients',
        name: 'admin.list.patient',
        component: () => import('../pages/ListPatient.vue'),
      },
      {
        path: 'users',
        name: 'admin.users',
        component: () => import('../pages/UserPage.vue'),
      },
      {
        path: 'test',
        name: 'admin.test',
        component: () => import('pages/TestAccueil.vue'),
      },
      {
        path: 'card',
        name: 'admin.card',
        component: () => import('../pages/add-patient/pages/QrCard.vue'),
      },
      {
        path: 'statistics',
        name: 'admin.stats',
        component: () => import('../pages/statistics/pages/PatientStatistic.vue'),
      },
      {
        path: 'consultations',
        name: 'admin.consult',
        component: () => import('../pages/Consultation/Consultation.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
