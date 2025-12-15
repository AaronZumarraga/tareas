import { ref, computed, watchEffect } from 'vue'
import { authStore } from '../store/auth.store'
import { TaskService, type Tarea } from '../service/api.services'

export type { Tarea }

export const useTasks = () => {
  const tasks = ref<Tarea[]>([])
  const isLoading = ref(false)

  // Cargar tareas automáticamente cuando cambia el usuario
  watchEffect(async () => {
    if (authStore.user.value) {
      try {
        isLoading.value = true
        tasks.value = await TaskService.getAll()
      } catch (e) {
        console.error(e)
      } finally {
        isLoading.value = false
      }
    } else {
      tasks.value = []
    }
  })

  const stats = computed(() => ({
    total: tasks.value.length,
    active: tasks.value.filter(t => t.estado !== 'Completada').length,
    completed: tasks.value.filter(t => t.estado === 'Completada').length
  }))

  const addTask = async (data: any) => {
    try {
      const newTask = await TaskService.create(data)
      tasks.value.push(newTask)
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  const toggleTask = async (id: number) => {
    const task = tasks.value.find(t => t.id === id)
    if (!task) return
    try {
      const updated = await TaskService.update(id, {
        ...task,
        estado: task.estado === 'Completada' ? 'Pendiente' : 'Completada'
      })
      Object.assign(task, updated)
    } catch (e) {
      console.error(e)
    }
  }

  const deleteTask = async (id: number) => {
    try {
      await TaskService.delete(id)
      tasks.value = tasks.value.filter(t => t.id !== id)
    } catch (e) {
      console.error(e)
    }
  }

  const editTask = async (id: number, data: any) => {
    try {
      const updated = await TaskService.update(id, data)
      const task = tasks.value.find(t => t.id === id)
      if (task) Object.assign(task, updated)
    } catch (e) {
      console.error(e)
    }
  }

  return {
    tasks,
    isLoading,
    stats,
    addTask,
    toggleTask,
    deleteTask,
    editTask
  }
}
