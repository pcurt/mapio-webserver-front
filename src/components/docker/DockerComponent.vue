<script lang="ts" setup>
    import { ref, onMounted, Ref } from 'vue'
    import axios from 'axios'
    import { useToast } from 'vue-toastification'

    interface Service {
        selected: boolean
        service: string
    }

    const toast = useToast()
    const DockerUrl = 'http://' + location.hostname + ':8456/docker'

    const services: Ref<Service[]> = ref(getAllServices())
    const runningContainers = ref([])

    function getAllServices() {
        const AllServices: Service[] = []
        AllServices.push({ selected: false, service: 'Homeassistant' })
        AllServices.push({ selected: false, service: 'Domoticz' })
        AllServices.push({ selected: false, service: 'Jellyfin' })
        AllServices.push({ selected: false, service: 'Nextcloud' })
        AllServices.push({ selected: false, service: 'Samba' })

        return AllServices
    }

    function action(action: string) {
        const select_action = [{ action: action }]
        const data = services.value.concat(select_action)
        const payload = JSON.stringify(data)
        axios.post(DockerUrl, payload).catch((error) => console.log(error))

        toast.success('Action has been asked, please wait ...')
    }

    const fetchData = () => {
        axios
            .get(DockerUrl)
            .then((response) => {
                runningContainers.value = response.data.map((item: { name: string }) => item.name)
            })
            .catch((error) => {
                console.error('GET error:', error)
            })
    }

    onMounted(() => {
        fetchData()
    })

    const interval = setInterval(() => {
        fetchData()
    }, 1000) // Refresh period 1000 millisecondes
</script>

<template>
    <v-table>
        <thead>
            <tr>
                <th class="text-left">Service name</th>
                <th class="text-left">Select</th>
                <th class="text-center">Container status</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in services" :key="item.service">
                <td>{{ item.service }}</td>
                <td>
                    <v-switch v-model="item.selected" color="blue"></v-switch>
                </td>
                <td class="text-center">
                    <v-icon
                        v-if="runningContainers.some((service) => service.toLowerCase() === item.service.toLowerCase())"
                        class="status-icon">
                        mdi-play-circle-outline
                    </v-icon>
                    <v-icon v-else class="status-icon"> mdi-stop </v-icon>
                </td>
            </tr>
        </tbody>
    </v-table>
    <v-btn color="primary" class="ma-2 pa-2" @click="() => action('restart')">Start/Restart</v-btn>
    <v-btn color="primary" class="ma-2 pa-2" @click="() => action('stop')">Stop</v-btn>
    <v-btn color="primary" class="ma-2 pa-2" @click="() => action('update')">Enable/Update</v-btn>
</template>
