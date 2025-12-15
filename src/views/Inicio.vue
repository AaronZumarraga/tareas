<!-- filepath: c:\Users\AaronZumarraga\Downloads\tareas\src\views\Inicio.vue -->
<script setup lang="ts">
import PageSection from '../components/PageSection.vue'
import WelcomeGuest from '../components/WelcomeGuest.vue'
import UserDashboard from '../components/UserDashboard.vue'
import { useAuth } from '../composables/useAuth'
import { useTasks } from '../composables/useTasks'

const { user } = useAuth()
const { stats } = useTasks()
</script>

<template>
  <PageSection max-width="900px">
    <!-- Mostrar bienvenida si NO está loggeado -->
    <WelcomeGuest v-if="!user" />

    <!-- Mostrar dashboard si está loggeado -->
    <UserDashboard 
      v-else
      :total="stats.total"
      :active="stats.active"
      :completed="stats.completed"
    />
  </PageSection>
</template>

<style scoped>
/* Estilos mínimos ya que los componentes se encargan del diseño */
</style>