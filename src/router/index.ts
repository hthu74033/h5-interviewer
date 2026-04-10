import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/candidate/:no',
    name: 'CandidateDetail',
    component: () => import('../views/CandidateDetail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/onboarding-admin',
    name: 'OnboardingAdmin',
    component: () => import('../views/OnboardingAdmin.vue'),
    meta: { requiresAuth: true, adminOnly: true }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('interviewer_token')
  if (to.meta.requiresAuth && !token) {
    next({ name: 'Login' })
    return
  }
  if (to.name === 'Login' && token) {
    next({ name: 'Home' })
    return
  }
  if (to.meta.adminOnly) {
    const userStr = localStorage.getItem('interviewer_user')
    const user = userStr ? JSON.parse(userStr) : null
    if (!user || user.role !== 'super_admin') {
      next({ name: 'Home' })
      return
    }
  }
  next()
})

export default router
