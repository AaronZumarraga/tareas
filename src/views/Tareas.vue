<!-- filepath: c:\Users\AaronZumarraga\Downloads\tareas\src\views\Tareas.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import GlassCard from '../components/GlassCard.vue'
import PageTitle from '../components/PageTitle.vue'
import TaskInput from '../components/TaskInput.vue'
import TaskItem from '../components/TaskItem.vue'
import TasksStats from '../components/TasksStats.vue'
import TasksFilters from '../components/TasksFilters.vue'

interface Task {
  id: number
  text: string
  completed: boolean
}

const tasks = ref<Task[]>([])
const filter = ref<'all' | 'active' | 'completed'>('all')
let nextId = 1

const handleAddTask = (taskText: string) => {
  tasks.value.push({
    id: nextId++,
    text: taskText,
    completed: false
  })
}

const handleToggleTask = (id: number) => {
  const task = tasks.value.find(t => t.id === id)
  if (task) {
    task.completed = !task.completed
  }
}

const handleDeleteTask = (id: number) => {
  tasks.value = tasks.value.filter(t => t.id !== id)
}

const handleEditTask = (id: number, text: string) => {
  const task = tasks.value.find(t => t.id === id)
  if (task) {
    task.text = text
  }
}

const filteredTasks = computed(() => {
  if (filter.value === 'active') {
    return tasks.value.filter(t => !t.completed)
  }
  if (filter.value === 'completed') {
    return tasks.value.filter(t => t.completed)
  }
  return tasks.value
})

const tasksStats = computed(() => ({
  total: tasks.value.length,
  active: tasks.value.filter(t => !t.completed).length,
  completed: tasks.value.filter(t => t.completed).length
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

      <!-- Task List -->
      <div class="task-list">
        <TransitionGroup name="list">
          <TaskItem
            v-for="task in filteredTasks"
            :key="task.id"
            :id="task.id"
            :text="task.text"
            :completed="task.completed"
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
  padding-top: 20px;
  padding-bottom: 40px;
}

.task-list {
  min-height: 200px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-title {
  color: #64748b;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.empty-subtitle {
  color: #94a3b8;
  font-size: 0.9rem;
}

/* List Transitions */
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-active {
  position: absolute;
  width: calc(100% - 40px);
}

@media (max-width: 768px) {
  .tareas {
    padding-bottom: 30px;
  }
  
}
</style>