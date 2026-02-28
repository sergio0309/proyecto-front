<template>
  <div class="grid gap-4">
    <!-- Pacientes (Bar Chart) -->
    <div class="card">
      <h2 class="text-lg font-semibold mb-2">Pacientes por Mes</h2>
      <Chart type="bar" :data="patientsData" :options="options" class="h-48" />
    </div>

    <!-- Reportes (Pie Chart) -->
    <div class="card">
      <h2 class="text-lg font-semibold mb-2">Reportes</h2>
      <Chart type="pie" :data="reportsData" :options="options" class="h-48" />
    </div>

    <!-- Usuarios (Line Chart) -->
    <div class="card">
      <h2 class="text-lg font-semibold mb-2">Usuarios Activos</h2>
      <Chart type="line" :data="usersData" :options="options" class="h-48" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const options = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top"
    }
  }
});

// TODO: Reemplazar con datos reales desde el backend (Esto debe hacerlo Wil)
// ******** Datos simulados para tus KPIs ********
const patientsData = ref({
  labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
  datasets: [
    {
      label: "Pacientes",
      data: [120, 150, 180, 170, 200, 220],
      backgroundColor: "rgba(59, 130, 246, 0.7)"
    }
  ]
});

const reportsData = ref({
  labels: ["Activos", "Completados", "Pendientes"],
  datasets: [
    {
      label: "Reportes",
      data: [45, 30, 25],
      backgroundColor: [
        "rgba(239, 68, 68, 0.7)",
        "rgba(34, 197, 94, 0.7)",
        "rgba(250, 204, 21, 0.7)"
      ]
    }
  ]
});

const usersData = ref({
  labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
  datasets: [
    {
      label: "Usuarios",
      data: [50, 65, 80, 70, 90, 105],
      borderColor: "rgb(16, 185, 129)",
      fill: false,
      tension: 0.3
    }
  ]
});
</script>

<style scoped>
</style>