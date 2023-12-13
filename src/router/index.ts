import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'home',
        component: HomeView,
    },
    {
        path: '/wifi',
        name: 'wifi',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/WifiView.vue'),
    },
    {
        path: '/update',
        name: 'update',
        component: () => import('../views/UpdateView.vue'),
    },
    {
        path: '/ssh',
        name: 'ssh',
        component: () => import('../views/SshView.vue'),
    },
    {
        path: '/docker',
        name: 'docker',
        component: () => import('../views/DockerView.vue'),
    },
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
})

export default router
