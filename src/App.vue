<script setup lang="ts">
    import { onMounted, ref } from 'vue'
    import { useVersionStore } from '@/store/version'

    const versionStore = useVersionStore()

    const drawer = ref(true)

    onMounted(() => versionStore.refresh())
</script>

<template>
    <v-app>
        <v-layout>
            <v-app-bar color="light-blue-darken-3 overflow-visible" prominent>
                <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

                <v-toolbar-title class="font-weight-bold">{{ versionStore.os_version }}</v-toolbar-title>
            </v-app-bar>

            <v-navigation-drawer v-model="drawer" floating color="light-blue-lighten-4" permanent>
                <v-list density="compact" nav>
                    <v-list-item prepend-icon="mdi-view-dashboard" title="Home" value="home" href="/"></v-list-item>
                    <v-list-item prepend-icon="mdi-wifi" title="Wifi" value="wifi" href="/wifi"></v-list-item>
                    <v-list-item prepend-icon="mdi-update" title="update" value="update" href="/update"></v-list-item>
                    <v-list-item prepend-icon="mdi-ssh" title="ssh" value="ssh" href="/ssh"></v-list-item>
                    <v-list-item prepend-icon="mdi-docker" title="docker" value="docker" href="/docker"></v-list-item>
                    <v-list-item prepend-icon="mdi-text-box" title="logs" value="logs" href="/logs"></v-list-item>
                </v-list>
            </v-navigation-drawer>
            <v-main>
                <router-view />
            </v-main>
        </v-layout>
    </v-app>
</template>
