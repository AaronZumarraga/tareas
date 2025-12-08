<!-- filepath: c:\Users\AaronZumarraga\Downloads\tareas\src\components\TaskInput.vue -->
<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  addTask: [taskData: { titulo: string; descripcion: string; estado: string; prioridad: string; fechaVencimiento: string }]
}>()

const taskText = ref('')
const description = ref('')
const dueDate = ref('')
const status = ref('Pendiente')
const priority = ref('Media')
const states = ['Pendiente', 'En Progreso', 'Completada', 'Cancelada']
const priorities = ['Baja', 'Media', 'Alta', 'Urgente']

const handleAdd = () => {
  if (taskText.value.trim()) {
    emit('addTask', {
      titulo: taskText.value,
      descripcion: description.value,
      estado: status.value,
      prioridad: priority.value,
      fechaVencimiento: dueDate.value
    })
    taskText.value = ''
    description.value = ''
    dueDate.value = ''
    status.value = 'Pendiente'
    priority.value = 'Media'
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
      <textarea 
        v-model="description"
        placeholder="Descripción (opcional)"
        class="description-input"
      ></textarea>
      <div class="selects-row">
        <select v-model="status" class="status-select">
          <option v-for="state in states" :key="state" :value="state">
            {{ state }}
          </option>
        </select>
        <select v-model="priority" class="priority-select">
          <option v-for="p in priorities" :key="p" :value="p">
            🔥 {{ p }}
          </option>
        </select>
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
  margin-bottom: 32px;
  animation: fadeInDown 0.5s ease;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.task-input {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.input-group {
  flex: 1;
  display: flex;
  align-items: center;
  background: white;
  border: 2px solid rgba(37, 99, 235, 0.1);
  border-radius: 12px;
  padding: 0 18px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.input-group:focus-within {
  border-color: #2563eb;
  box-shadow: 0 4px 20px rgba(37, 99, 235, 0.2);
  transform: translateY(-2px);
}

.input-icon {
  font-size: 1.3rem;
  margin-right: 14px;
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

.input-group:focus-within .input-icon {
  opacity: 1;
}

.task-input input[type="text"] {
  flex: 1;
  padding: 16px 0;
  border: none;
  background: transparent;
  color: #1e293b;
  font-size: 1rem;
  outline: none;
}

.task-input input::placeholder {
  color: #94a3b8;
}

.description-input {
  padding: 14px 18px;
  border: 2px solid rgba(37, 99, 235, 0.1);
  border-radius: 12px;
  background: white;
  color: #1e293b;
  font-size: 0.95rem;
  outline: none;
  resize: vertical;
  min-height: 70px;
  font-family: inherit;
  transition: all 0.3s ease;
}

.description-input:focus {
  border-color: #2563eb;
  box-shadow: 0 4px 20px rgba(37, 99, 235, 0.2);
  transform: translateY(-1px);
}

.description-input::placeholder {
  color: #94a3b8;
}

.status-select,
.priority-select {
  padding: 13px 18px;
  border: 2px solid rgba(37, 99, 235, 0.1);
  border-radius: 12px;
  background: white;
  color: #1e293b;
  font-size: 0.95rem;
  outline: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.status-select:hover,
.priority-select:hover {
  border-color: rgba(37, 99, 235, 0.3);
}

.status-select:focus,
.priority-select:focus {
  border-color: #2563eb;
  box-shadow: 0 4px 20px rgba(37, 99, 235, 0.2);
  transform: translateY(-1px);
}

.due-date-input {
  padding: 13px 18px;
  border: 2px solid rgba(37, 99, 235, 0.1);
  border-radius: 12px;
  background: white;
  color: #1e293b;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.3s ease;
  cursor: pointer;
}

.due-date-input:hover {
  border-color: rgba(37, 99, 235, 0.3);
}

.due-date-input:focus {
  border-color: #2563eb;
  box-shadow: 0 4px 20px rgba(37, 99, 235, 0.2);
  transform: translateY(-1px);
}

.btn-add {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 32px;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.35);
}

.btn-add:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.45);
}

.btn-add:active {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.35);
}

.btn-icon {
  font-size: 1.3rem;
  font-weight: bold;
}

.selects-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

@media (max-width: 768px) {
  .task-input {
    flex-direction: column;
  }
  
  .selects-row {
    grid-template-columns: 1fr;
  }
  
  .due-date-input,
  .status-select,
  .priority-select,
  .description-input {
    width: 100%;
  }
  
  .btn-add {
    justify-content: center;
    padding: 13px 28px;
  }
}
</style>