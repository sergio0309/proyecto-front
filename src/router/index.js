import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/auth/Login.vue";
import HelloWorld from "../components/HelloWorld.vue";
import Usuario from "../views/admin/usuarios/Usuario.vue";

const routes =[
    {
        path: '/',
        redirect: '/auth/login'
    },
    {
        path: '/auth/login',
        component: Login,
        name: 'Login',
        meta:{ redirectIfAuth: true }
    },
    {
        path: '/admin/usuario',
        component: Usuario,
        name: 'Usuario',
        meta: { requireAuth: true }
    }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem("access_token")

    if(to.meta.requireAuth){
        if(!token){
        return next({name: "Login"})
        }
        return next();
    }
    if(to.meta.redirectIfAuth && token ){
        return next({name: "Usuario"})
    }

    return next()
})

export default router