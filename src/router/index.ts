import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  }, {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }, {
    path: '/calculator',
    name: 'calculator',
    component: () => import('../page/calculator/calculator.vue')
  }, {
    path: '/tree',
    name: 'tree',
    component: () => import('../page/data-structure/tree.vue')
  }, {
    path: '/stack',
    name: 'stack',
    component: () => import('../page/data-structure/stack.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
