<script lang="ts" setup>
import { ref, onMounted, Ref } from "vue";
import axios from "axios";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

interface Service {
  selected: boolean;
  service: string;
}

interface Container {
  name: string;
  status: string;
}

const DockerUrl = "http://" + location.hostname + ":8456/docker";
const DockerUrlCustom = "http://" + location.hostname + ":8456/docker-custom";

const services: Ref<Service[]> = ref(getAllServices());
const runningContainers = ref([]);
const switchValues: Ref<Record<string, boolean>> = ref({});
const runningContainersFiltered = ref<Container[]>([]);

function getAllServices() {
  const AllServices: Service[] = [];
  AllServices.push({ selected: false, service: "Homeassistant" });
  AllServices.push({ selected: false, service: "Domoticz" });
  AllServices.push({ selected: false, service: "Jellyfin" });
  AllServices.push({ selected: false, service: "Nextcloud" });
  AllServices.push({ selected: false, service: "Samba" });
  AllServices.push({ selected: false, service: "Resticprofile" });

  return AllServices;
}

function action(action: string) {
  const select_action = [{ action: action }];
  const data = services.value.concat(select_action);
  const payload = JSON.stringify(data);
  axios.post(DockerUrl, payload).catch((error) => console.log(error));
  toast.success("Action has been asked, please wait ...");
  services.value.forEach((service) => {
    service.selected = false;
  });
}

function actioncustom(action: string) {
  const selectedServices = Object.entries(switchValues.value)
    .filter(([serviceName, isSelected]) => isSelected)
    .map(([serviceName, isSelected]) => serviceName);
  const payload = JSON.stringify({ selectedServices, select_action: action });
  axios.post(DockerUrlCustom, payload).catch((error) => console.log(error));
  toast.success("Action has been asked, please wait ...");
  for (const key in switchValues.value) {
    switchValues.value[key] = false;
  }
}

const fetchData = () => {
  axios
    .get(DockerUrl)
    .then((response) => {
      runningContainers.value = response.data.map(
        (item: { name: string }) => item.name,
      );
    })
    .catch((error) => {
      console.error("GET error:", error);
    });
  axios
    .get(DockerUrlCustom)
    .then((response) => {
      const containersData: { name: string; status: string }[] = response.data;
      const excludedContainers = [
        "homeassistant",
        "domoticz",
        "jellyfin",
        "nextcloud",
        "samba",
        "zigbee2mqtt",
        "resticprofile",
      ];
      const containersWithStatus: Container[] = containersData
        .filter((container) => !excludedContainers.includes(container.name))
        .map((container) => ({
          name: container.name,
          status: container.status,
        }));
      runningContainersFiltered.value = containersWithStatus;
    })
    .catch((error) => {
      console.error("GET error:", error);
    });
};

onMounted(() => {
  fetchData();
});

const interval = setInterval(() => {
  fetchData();
}, 1000); // Refresh period 1000 millisecondes
</script>

<template>
  <h4>Docker native</h4>
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
        <td>
          <v-checkbox v-model="item.selected" color="blue"></v-checkbox>
        </td>
        <td>{{ item.service }}</td>
        <td class="text-center">
          <v-icon
            v-if="
              runningContainers.some(
                (service) =>
                  service.toLowerCase() === item.service.toLowerCase(),
              )
            "
            class="status-icon"
          >
            mdi-play-circle-outline
          </v-icon>
          <v-icon v-else class="status-icon"> mdi-stop </v-icon>
        </td>
      </tr>
    </tbody>
  </v-table>
  <v-btn color="primary" class="ma-2 pa-2" @click="() => action('restart')"
    >Start/Restart</v-btn
  >
  <v-btn color="primary" class="ma-2 pa-2" @click="() => action('stop')"
    >Stop</v-btn
  >
  <v-btn color="primary" class="ma-2 pa-2" @click="() => action('update')"
    >Enable/Update</v-btn
  >

  <div class="docker ma-5">
    <h4>Docker custom</h4>
    <v-table>
      <thead>
        <tr>
          <th class="text-left">Select</th>
          <th class="text-left">Service name</th>
          <th class="text-center">Container status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in runningContainersFiltered" :key="item.name">
          <td>
            <v-checkbox
              v-model="switchValues[item.name]"
              color="blue"
            ></v-checkbox>
          </td>
          <td>{{ item.name }}</td>

          <td class="text-center">
            <v-icon class="status-icon" v-if="item.status === 'Up'"
              >mdi-play-circle-outline</v-icon
            >
            <v-icon class="status-icon" v-else>mdi-stop</v-icon>
          </td>
        </tr>
      </tbody>
    </v-table>

    <v-btn
      color="primary"
      class="ma-2 pa-2"
      @click="() => actioncustom('start')"
      >Start</v-btn
    >
    <v-btn color="primary" class="ma-2 pa-2" @click="() => actioncustom('stop')"
      >Stop</v-btn
    >
  </div>
</template>
