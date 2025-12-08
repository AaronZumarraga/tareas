<!-- filepath: c:\Users\AaronZumarraga\Downloads\tareas\src\views\Tareas.vue -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import GlassCard from '../components/GlassCard.vue'
import PageTitle from '../components/PageTitle.vue'
import TaskInput from '../components/TaskInput.vue'
import TaskItem from '../components/TaskItem.vue'
import TasksStats from '../components/TasksStats.vue'
import TasksFilters from '../components/TasksFilters.vue'
import { fetchTareas, crearTarea, eliminarTarea, updateTarea, type Tarea } from '../service/tareas.service.ts'

const tasks = ref<Tarea[]>([])
const filter = ref<'all' | 'active' | 'completed'>('all')

const loadTasks = async () => {
  try {
    const fetched = await fetchTareas()
    tasks.value = fetched
  } catch (error) {
    console.error('Error cargando tareas:', error)
  }
}

onMounted(loadTasks)

const handleAddTask = async (taskData: { titulo: string; descripcion: string; estado: string; prioridad: string; fechaVencimiento: string }) => {
  try {
    const newTask = await crearTarea(taskData)
    tasks.value.push(newTask)
  } catch (error) {
    console.error('Error creando tarea:', error)
  }
}

const handleToggleTask = async (id: number) => {
  const task = tasks.value.find(t => t.id === id)
  if (task) {
    const newState = task.estado === 'Completada' ? 'Pendiente' : 'Completada'
    try {
      const updated = await updateTarea(id, {
        titulo: task.titulo,
        descripcion: task.descripcion,
        estado: newState,
        prioridad: task.prioridad,
        fechaVencimiento: task.fechaVencimiento || ''
      })
      const index = tasks.value.findIndex(t => t.id === id)
      if (index !== -1) {
        tasks.value[index] = updated
      }
    } catch (error) {
      console.error('Error actualizando tarea:', error)
    }
  }
}

const handleDeleteTask = async (id: number) => {
  try {
    await eliminarTarea(id)
    tasks.value = tasks.value.filter(t => t.id !== id)
  } catch (error) {
    console.error('Error eliminando tarea:', error)
  }
}

const handleEditTask = async (id: number, data: { titulo: string; descripcion: string; estado: string; prioridad: string; fechaVencimiento: string }) => {
  try {
    const updated = await updateTarea(id, data)
    const index = tasks.value.findIndex(t => t.id === id)
    if (index !== -1) {
      tasks.value[index] = updated
    }
  } catch (error) {
    console.error('Error editando tarea:', error)
  }
}

const filteredTasks = computed(() => {
  if (filter.value === 'active') {
    return tasks.value.filter(t => t.estado !== 'Completada')
  }
  if (filter.value === 'completed') {
    return tasks.value.filter(t => t.estado === 'Completada')
  }
  return tasks.value
})

const tasksStats = computed(() => ({
  total: tasks.value.length,
  active: tasks.value.filter(t => t.estado !== 'Completada').length,
  completed: tasks.value.filter(t => t.estado === 'Completada').length
}))
</script>

<template>
  <div class="tareas">
    <GlassCard max-width="800px" text-align="left">
      <PageTitle title="Mis Tareas" subtitle="Organiza tu día de forma efectiva" />
      <TaskInput @add-task="handleAddTask" />

      <TasksStats
        v-if="tasks.length > 0"
        :total="tasksStats.total"
        :active="tasksStats.active"
        :completed="tasksStats.completed"
      />

      <TasksFilters
        v-if="tasks.length > 0"
        :model-value="filter"
        @update:modelValue="filter = $event"
      />

      <div class="task-list">
        <TransitionGroup name="list">
          <TaskItem
            v-for="task in filteredTasks"
            :key="task.id"
            :id="task.id"
            :titulo="task.titulo"
            :descripcion="task.descripcion"
            :estado="task.estado"
            :prioridad="task.prioridad"
            :completed="task.estado === 'Completada'"
            :dueDate="task.fechaVencimiento"
            @toggle="handleToggleTask"
            @delete="handleDeleteTask"
            @edit="handleEditTask"
          />
        </TransitionGroup>

        <div v-if="tasks.length === 0" class="empty-state">
          <div class="empty-icon">📝</div>
          <p class="empty-title">No hay tareas aún</p>
          <p class="empty-subtitle">Comienza agregando tu primera tarea</p>
        </div>

        <div v-else-if="filteredTasks.length === 0" class="empty-state">
          <div class="empty-icon">🎯</div>
          <p class="empty-title">No hay tareas {{ filter === 'active' ? 'activas' : 'completadas' }}</p>
        </div>
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