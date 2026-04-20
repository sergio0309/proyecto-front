import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/auth/Login.vue";
import AppLayout from '@/layout/AppLayout.vue';
import Perfil from "../views/admin/perfil/PerfilView.vue";
import UsuariosView from "../views/admin/usuarios/UsuariosView.vue";
import FourZeroFour from "../views/errors/FourZeroFour.vue";
import Role from "../views/admin/roles/Role.vue";
import RolesView from "../views/admin/usuarios/RolesView.vue";

const routes =[
    {
        // Redirecciona a la ruta raíz a la página de login
        path: '/',
        redirect: '/auth/login',
    },
    {
        path: '/auth/login',
        component: Login,
        name: 'Login',
        meta:{ redirectIfAuth: false }
    },
    {
        path: '/admin',
        component: AppLayout,
        name: 'admin',
        children: [
            {
                path: 'dashboard',
                component: () => import('../views/dashboard/DashboardView.vue'),
                name: 'dashboard',
                meta: { requireAuth: true }
            },
            {
                path: 'perfil',
                component: Perfil,
                name: 'perfil',
                meta: { requireAuth: true }
            },
            {
                path: 'usuario',
                component: UsuariosView,
                name: 'usuarios',
                meta: { requireAuth: true }
            },
            {
                path: 'roles',
                component: RolesView,
                name: 'roles',
                meta: { requireAuth: true }
            },
            {
                path: 'pacientes',
                component: () => import('../views/pacientes/PacientesView.vue'),
                name: 'pacientes',
                meta: { requireAuth: true }
            },
            {
                path: 'ordenes',
                component: () => import('../views/ordenes/OrdenesView.vue'),
                name: 'ordenes',
                meta: { requireAuth: true }
            },
            {
                path: 'proformas',
                component: () => import('../views/proformas/ProformasView.vue'),
                name: 'proformas',
                meta: { requireAuth: true }
            },
            {
                path: 'reportes',
                component: () => import('../views/reportes/ReportesView.vue'),
                name: 'reportes',
                meta: { requireAuth: true }
            },
            {
                path: 'resultados',
                component: () => import('../views/resultados/ResultadosView.vue'),
                name: 'resultados',
                meta: { requireAuth: true }
            }
        ]
    },
    {
        path: '/error-404',
        name: 'error-404',
        // component: () => import('../views/Errors/FourZeroFour.vue'),
        component: FourZeroFour,
        meta: {
            requireAuth: false,
            title: '404 Error',
        },
    },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem("token")

    if (to.meta.requireAuth) {
        if (!token) {
            return next({ name: "Login" });
        }

        return next();
    }

    if(to.meta.redirectIfAuth && token ){
        return next({name: "perfil"})
    }

    return next()
})

export default router