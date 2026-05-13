import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/auth/LoginView.vue'),
      meta: { guest: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/auth/RegisterView.vue'),
      meta: { guest: true },
    },
    {
      path: '/patient',
      name: 'patient',
      component: () => import('../views/patient/PatientDashboard.vue'),
      meta: { requiresAuth: true, role: 'patient' },
    },
    {
      path: '/patient/new',
      name: 'new-appointment',
      component: () => import('../views/patient/NewAppointment.vue'),
      meta: { requiresAuth: true, role: 'patient' },
    },
    {
      path: '/doctor',
      name: 'doctor',
      component: () => import('../views/doctor/DoctorDashboard.vue'),
      meta: { requiresAuth: true, role: 'doctor' },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next('/login')
  }

  if (to.meta.guest && auth.isAuthenticated) {
    return next(auth.isDoctor ? '/doctor' : '/patient')
  }

  if (to.meta.role && auth.user?.role !== to.meta.role) {
    return next(auth.isDoctor ? '/doctor' : '/patient')
  }

  next()
})

export default router