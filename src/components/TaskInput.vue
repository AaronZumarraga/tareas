<!-- filepath: c:\Users\AaronZumarraga\Downloads\tareas\src\components\TaskInput.vue -->
<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  addTask: [taskText: string, dueDate: string]
}>()

const taskText = ref('')
const dueDate = ref('')

const handleAdd = () => {
  if (taskText.value.trim()) {
    emit('addTask', taskText.value, dueDate.value)
    taskText.value = ''
    dueDate.value = ''
  }
}
</script>

<template>
  <div class="task-input-wrapper">
    <div class="task-input">
      <div class="input-group">
        <span class="input-icon">✏️</span>
        <input 
          v-model="taskText"
          type="text" 
          placeholder="¿Qué necesitas hacer hoy?"
          @keyup.enter="handleAdd"
        />
      </div>
      <input 
        v-model="dueDate"
        type="date"
        class="due-date-input"
      />
      <button @click="handleAdd" class="btn-add">
        <span class="btn-icon">+</span>
        <span class="btn-text">Agregar</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.task-input-wrapper {
  margin-bottom: 30px;
}

.task-input {
  display: flex;
  gap: 12px;
  align-items: stretch;
}

.due-date-input {
  padding: 14px 12px;
  border: 2px solid rgba(37, 99, 235, 0.1);
  border-radius: 12px;
  background: white;
  color: #1e293b;
  font-size: 0.9rem;
  outline: none;
  transition: all 0.3s ease;
}

.due-date-input:focus {
  border-color: #2563eb;
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.15);
}

.input-group {
  flex: 1;
  display: flex;
  align-items: center;
  background: white;
  border: 2px solid rgba(37, 99, 235, 0.1);
  border-radius: 12px;
  padding: 0 16px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.input-group:focus-within {
  border-color: #2563eb;
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.15);
  transform: translateY(-1px);
}

.input-icon {
  font-size: 1.2rem;
  margin-right: 12px;
  opacity: 0.6;
}

.task-input input {
  flex: 1;
  padding: 14px 0;
  border: none;
  background: transparent;
  color: #1e293b;
  font-size: 0.95rem;
  outline: none;
}

.task-input input::placeholder {
  color: #94a3b8;
}

.btn-add {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  white-space: nowrap;
}

.btn-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
}

.btn-add:active {
  transform: translateY(0);
}

.btn-icon {
  font-size: 1.2rem;
  font-weight: bold;
}

@media (max-width: 768px) {
  .task-input {
    flex-direction: column;
  }
  
  .due-date-input {
    width: 100%;
  }
  
  .btn-add {
    justify-content: center;
    padding: 14px 24px;
  }
  
  .btn-text {
    display: inline;
  }
}
</style>