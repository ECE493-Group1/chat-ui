import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/chat/:id',
    name: 'Chat',
    component: () => import('../views/Thread.vue')
  },
  {
    path: '/convos',
    name: 'Threads',
    component: () => import('../views/ThreadFeed.vue')
  },
  {
    path: '/new',
    name: 'NewThread',
    component: () => import('../views/NewThread.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import("../views/Register.vue")
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import("../views/ForgotPassword.vue")
  },
  {
    path: '/change-password/:token',
    name: 'ChangePassword',
    component: () => import("../views/ChangePassword.vue")
  },
  {
    path: '/keywords',
    name: 'Keywords',
    component: () => import('../views/KeywordFeed.vue')
  },
  {
    path: '/keyword/:keyword',
    name: 'Keyword',
    component: () => import('../views/Keyword.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router;
export {routes};
