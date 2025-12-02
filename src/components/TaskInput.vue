<!-- filepath: c:\Users\AaronZumarraga\Downloads\tareas\src\components\TaskInput.vue -->
<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  addTask: [taskText: string]
}>()

const taskText = ref('')

const handleAdd = () => {
  if (taskText.value.trim()) {
    emit('addTask', taskText.value)
    taskText.value = ''
  }
}
</script>

<template>
  <div class="task-input">
    <input 
      v-model="taskText"
      type="text" 
      placeholder="Agregar nueva tarea..."
      @keyup.enter="handleAdd"
    />
    <button @click="handleAdd">Agregar</button>
  </div>
</template>

<style scoped>
.task-input {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
}

.task-input input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.6);
  color: #1e293b;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.2s;
}

.task-input input:focus {
  border-color: #2563eb;
  background: white;
}

.task-input button {
  padding: 12px 24px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.task-input button:hover {
  background: #1d4ed8;
}
</style>