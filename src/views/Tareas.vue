<!-- filepath: c:\Users\AaronZumarraga\Downloads\tareas\src\views\Tareas.vue -->
<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import PageTitle from '../components/PageTitle.vue'
import TaskInput from '../components/TaskInput.vue'
import TaskItem from '../components/TaskItem.vue'
import TasksStats from '../components/TasksStats.vue'
import TasksFilters from '../components/TasksFilters.vue'
import PageSection from '../components/PageSection.vue'
import EmptyState from '../components/EmptyState.vue'
import { taskService, useAuth, type Tarea } from '../service/tareas.service'

const { user } = useAuth()
const tasks = ref<Tarea[]>([])
const filter = ref<'all' | 'active' | 'completed'>('all')

// Patrón Observer: Reacciona automáticamente a cambios en el usuario
watchEffect(async () => {
  if (user.value) {
    try { tasks.value = await taskService.getAll() } 
    catch (e) { console.error(e) }
  } else {
    tasks.value = []
  }
})

const handleAddTask = async (data: any) => {
  try { tasks.value.push(await taskService.create(data)) } catch (e) { console.error(e) }
}

const handleToggleTask = async (id: number) => {
  const task = tasks.value.find(t => t.id === id)
  if (!task) return
  try {
    const updated = await taskService.update(id, { ...task, estado: task.estado === 'Completada' ? 'Pendiente' : 'Completada' })
    Object.assign(task, updated)
  } catch (e) { console.error(e) }
}

const handleDeleteTask = async (id: number) => {
  try {
    await taskService.delete(id)
    tasks.value = tasks.value.filter(t => t.id !== id)
  } catch (e) { console.error(e) }
}

const handleEditTask = async (id: number, data: any) => {
  try {
    const updated = await taskService.update(id, data)
    const task = tasks.value.find(t => t.id === id)
    if (task) Object.assign(task, updated)
  } catch (e) { console.error(e) }
}

const filteredTasks = computed(() => {
  if (filter.value === 'active') return tasks.value.filter(t => t.estado !== 'Completada')
  if (filter.value === 'completed') return tasks.value.filter(t => t.estado === 'Completada')
  return tasks.value
})

const stats = computed(() => ({
  total: tasks.value.length,
  active: tasks.value.filter(t => t.estado !== 'Completada').length,
  completed: tasks.value.filter(t => t.estado === 'Completada').length
}))
</script>

<template>
  <PageSection max-width="800px" text-align="left">
    <PageTitle title="Mis Tareas" subtitle="Organiza tu día de forma efectiva" />
    
    <template v-if="user">
      <TaskInput @add-task="handleAddTask" />
      <TasksStats v-if="tasks.length" :total="stats.total" :active="stats.active" :completed="stats.completed" />
      <TasksFilters v-if="tasks.length" :model-value="filter" @update:modelValue="filter = $event" />
      
      <div class="task-list">
        <TransitionGroup name="list">
          <TaskItem
            v-for="task in filteredTasks" :key="task.id"
            v-bind="task"
            :completed="task.estado === 'Completada'"
            :dueDate="task.fechaVencimiento"
            @toggle="handleToggleTask" @delete="handleDeleteTask" @edit="handleEditTask"
          />
        </TransitionGroup>
        
        <EmptyState v-if="tasks.length === 0" icon="📝" title="No hay tareas aún" subtitle="Agrega tu primera tarea para comenzar" />
        <EmptyState
          v-else-if="filteredTasks.length === 0"
          :icon="filter === 'active' ? '🎯' : '✅'"
          :title="`No hay tareas ${filter === 'active' ? 'activas' : 'completadas'}`"
        />
      </div>
    </template>

    <EmptyState v-else icon="🔒" title="Inicia sesión" subtitle="Por favor, inicia sesión o regístrate para ver tus tareas." />
  </PageSection>
</template>

<style scoped>
.task-list {
  min-height: 220px;
  position: relative;
}

/* List transitions remain unchanged */
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