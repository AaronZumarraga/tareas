<!-- filepath: c:\Users\AaronZumarraga\Downloads\tareas\src\views\Tareas.vue -->
<script setup lang="ts">
import GlassCard from '../components/GlassCard.vue'
import PageTitle from '../components/PageTitle.vue'
import TaskInput from '../components/TaskInput.vue'

const handleAddTask = (taskText: string) => {
  console.log('Nueva tarea:', taskText)
  // Aquí irá la lógica para agregar tareas
}
</script>

<template>
  <div class="tareas">
    <GlassCard max-width="700px" text-align="left">
      <PageTitle title="Mis Tareas" subtitle="Organiza tu día" />
      <TaskInput @add-task="handleAddTask" />
      <div class="task-list">
        <p class="empty-state">No hay tareas aún</p>
      </div>
    </GlassCard>
  </div>
</template>

<style scoped>
.tareas {
  max-width: 700px;
  margin: 0 auto;
  padding-top: 20px;
}

.task-list {
  min-height: 200px;
  padding: 20px 0;
}

.empty-state {
  text-align: center;
  color: #94a3b8;
  padding: 40px 20px;
  font-size: 0.95rem;
}
</style>