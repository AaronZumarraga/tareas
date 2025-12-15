<!-- filepath: c:\Users\AaronZumarraga\Downloads\tareas\src\views\Inicio.vue -->
<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import PageSection from '../components/PageSection.vue'
import WelcomeGuest from '../components/WelcomeGuest.vue'
import UserDashboard from '../components/UserDashboard.vue'
import { useAuth, taskService, type Tarea } from '../service/tareas.service'

const { user } = useAuth()
const tasks = ref<Tarea[]>([])

// Cargar tareas cuando el usuario se autentica
watchEffect(async () => {
  if (user.value) {
    try { tasks.value = await taskService.getAll() } 
    catch (e) { console.error(e) }
  } else {
    tasks.value = []
  }
})

const stats = computed(() => ({
  total: tasks.value.length,
  active: tasks.value.filter(t => t.estado !== 'Completada').length,
  completed: tasks.value.filter(t => t.estado === 'Completada').length
}))
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