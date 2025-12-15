<!-- filepath: c:\Users\AaronZumarraga\Downloads\tareas\src\views\Tareas.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import PageTitle from '../components/PageTitle.vue'
import TaskInput from '../components/TaskInput.vue'
import TaskItem from '../components/TaskItem.vue'
import TasksStats from '../components/TasksStats.vue'
import TasksFilters from '../components/TasksFilters.vue'
import PageSection from '../components/PageSection.vue'
import EmptyState from '../components/EmptyState.vue'
import { useAuth } from '../composables/useAuth'
import { useTasks } from '../composables/useTasks'

const { user } = useAuth()
const { tasks, stats, addTask, toggleTask, deleteTask, editTask } = useTasks()
const filter = ref<'all' | 'active' | 'completed'>('all')

const filteredTasks = computed(() => {
  if (filter.value === 'active') return tasks.value.filter(t => t.estado !== 'Completada')
  if (filter.value === 'completed') return tasks.value.filter(t => t.estado === 'Completada')
  return tasks.value
})
</script>

<template>
  <PageSection max-width="800px" text-align="left">
    <PageTitle title="Mis Tareas" subtitle="Organiza tu día de forma efectiva" />
    
    <template v-if="user">
      <TaskInput @add-task="addTask" />
      <TasksStats v-if="tasks.length" :total="stats.total" :active="stats.active" :completed="stats.completed" />
      <TasksFilters v-if="tasks.length" :model-value="filter" @update:modelValue="filter = $event" />
      
      <div class="task-list">
        <TransitionGroup name="list">
          <TaskItem
            v-for="task in filteredTasks" :key="task.id"
            v-bind="task"
            :completed="task.estado === 'Completada'"
            :dueDate="task.fechaVencimiento"
            @toggle="toggleTask" @delete="deleteTask" @edit="editTask"
          />
        </TransitionGroup>
        
        <EmptyState v-if="tasks.length === 0" title="No hay tareas aún" subtitle="Agrega tu primera tarea para comenzar" />
        <EmptyState
          v-else-if="filteredTasks.length === 0"
          :title="`No hay tareas ${filter === 'active' ? 'activas' : 'completadas'}`"
        />
      </div>
    </template>

    <EmptyState v-else title="Inicia sesión" subtitle="Por favor, inicia sesión o regístrate para ver tus tareas." />
  </PageSection>
</template>

<style scoped>
.task-list {
  min-height: 220px;
  position: relative;
}

.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to { opacity: 0; }
.list-enter-from { transform: scale(0.95); }
.list-leave-to { transform: scale(0.95); }
.list-leave-active { position: absolute; width: 100%; left: 0; }
</style>