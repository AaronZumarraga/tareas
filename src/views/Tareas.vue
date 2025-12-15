<!-- filepath: c:\Users\AaronZumarraga\Downloads\tareas\src\views\Tareas.vue -->
<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import GlassCard from '../components/GlassCard.vue'
import PageTitle from '../components/PageTitle.vue'
import TaskInput from '../components/TaskInput.vue'
import TaskItem from '../components/TaskItem.vue'
import TasksStats from '../components/TasksStats.vue'
import TasksFilters from '../components/TasksFilters.vue'
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
  <div class="tareas">
    <GlassCard max-width="800px" text-align="left">
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
          
          <div v-if="tasks.length === 0" class="empty-state">
            <div class="empty-icon">📝</div>
            <p class="empty-title">No hay tareas aún</p>
          </div>
          <div v-else-if="filteredTasks.length === 0" class="empty-state">
            <div class="empty-icon">🎯</div>
            <p class="empty-title">No hay tareas {{ filter === 'active' ? 'activas' : 'completadas' }}</p>
          </div>
        </div>
      </template>

      <div v-else class="empty-state">
        <p>Por favor, inicia sesión o regístrate para ver tus tareas.</p>
      </div>
    </GlassCard>
  </div>
</template>

<style scoped>
.tareas {
  max-width: 90%;
  margin: 0 auto;
  padding-top: 24px;
  padding-bottom: 48px;
  animation: fadeIn 0.6s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.task-list {
  min-height: 220px;
  position: relative;
}

.empty-state {
  text-align: center;
  padding: 70px 20px;
  animation: fadeIn 0.5s ease;
}

.empty-icon {
  font-size: 4.5rem;
  margin-bottom: 20px;
  opacity: 0.5;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.empty-title {
  color: #64748b;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 10px;
}

.empty-subtitle {
  color: #94a3b8;
  font-size: 0.95rem;
}

/* List Transitions - Simplificadas y básicas */
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
}

.list-enter-from {
  transform: scale(0.95);
}

.list-leave-to {
  transform: scale(0.95);
}

.list-leave-active {
  position: absolute;
  width: 100%;
  left: 0;
}

@media (max-width: 768px) {
  .tareas {
    padding-top: 20px;
    padding-bottom: 36px;
  }
  
  .empty-state {
    padding: 50px 20px;
  }
  
  .empty-icon {
    font-size: 3.5rem;
  }
}
</style>