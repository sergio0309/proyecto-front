<script setup>
import { ref } from 'vue';
import AppMenuItem from './AppMenuItem.vue';

/**
 * Menu model.
 * 
 * Menú SideBar desacoplado para facilitar su mantenimiento y escalabilidad.
 * Se renderiza en AppMenuItem.vue de forma recursiva para soportar submenús.
 * 
 * Label => Texto a mostrar en la UI (navegador)
 * to => Ruta a la que se redirige (es en realidad el "name" dado a cada ruta en el router)
 * icon => Icono a mostrar (usando clases de PrimeVue)
 * items => Submenús (si los hay), con la misma estructura que el menú principal
 */
const model = ref([
    {
        label: 'Inicio',
        items: [
            {
                label: 'Panel de administración',
                icon: 'pi pi-fw pi-home',
                to: 'dashboard'
            },
            {
                label: 'Mi Perfil',
                icon: 'pi pi-fw pi-user',
                to: 'perfil'
            }

        ]
    },
    {
        label: 'Gestion & Seguridad',
        path: '/uikit',
        items: [
            {
                label: 'Usuarios del sistema',
                icon: 'pi pi-fw pi-users',
                to: 'usuarios'
            },
            {
                label: 'Roles',
                icon: 'pi pi-fw pi-users',
                to: 'roles'
            }
        ]
    },
    {
        label: 'Opciones',
        icon: 'pi pi-fw pi-briefcase',
        path: '/admin',
        items: [
            {
                label: 'Pacientes',
                icon: 'pi pi-fw pi-users',
                to: 'pacientes'
            },
            {
                label: 'Órdenes',
                icon: 'pi pi-fw pi-book',
                to: 'ordenes'
            },
            {
                label: 'Proformas',
                icon: 'pi pi-fw pi-file',
                to: 'proformas'
            },
            {
                label: 'Resultados',
                icon: 'pi pi-fw pi-check',
                to: 'resultados'
            },
        ]
    },
    {
        label: '¿Necesitas Ayuda?',
        items: [
            {
                label: 'Contáctanos',
                url: 'https://wa.me/59164308328',
                icon: 'pi pi-fw pi-phone',
                target: '_blank'
            }
        ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
