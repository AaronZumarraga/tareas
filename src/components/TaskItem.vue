<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  id: number
  text: string
  completed: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  toggle: [id: number]
  delete: [id: number]
  edit: [id: number, text: string]
}>()

const isEditing = ref(false)
const editText = ref(props.text)

const handleToggle = () => {
  emit('toggle', props.id)
}

const handleDelete = () => {
  emit('delete', props.id)
}

const startEdit = () => {
  isEditing.value = true
  editText.value = props.text
}

const saveEdit = () => {
  if (editText.value.trim()) {
    emit('edit', props.id, editText.value)
    isEditing.value = false
  }
}

const cancelEdit = () => {
  isEditing.value = false
  editText.value = props.text
}
</script>

<template>
  <div class="task-item" :class="{ completed: completed }">
    <div class="task-content">
      <button 
        class="checkbox" 
        :class="{ checked: completed }"
        @click="handleToggle"
        aria-label="Marcar como completada"
      >
        <span class="checkmark" v-if="completed">✓</span>
      </button>
      
      <div class="task-text-wrapper" v-if="!isEditing">
        <p class="task-text">{{ text }}</p>
      </div>
      
      <input 
        v-else
        v-model="editText"
        class="task-edit-input"
        @keyup.enter="saveEdit"
        @keyup.esc="cancelEdit"
        autofocus
      />
    </div>
    
    <div class="task-actions">
      <template v-if="!isEditing">
        <button 
          class="btn-action btn-edit" 
          @click="startEdit"
          aria-label="Editar"
        >
          ✏️
        </button>
        <button 
          class="btn-action btn-delete" 
          @click="handleDelete"
          aria-label="Eliminar"
        >
          🗑️
        </button>
      </template>
      <template v-else>
        <button 
          class="btn-action btn-save" 
          @click="saveEdit"
          aria-label="Guardar"
        >
          ✓
        </button>
        <button 
          class="btn-action btn-cancel" 
          @click="cancelEdit"
          aria-label="Cancelar"
        >
          ✕
        </button>
      </template>
    </div>
  </div>
</template>

<style scoped>
.task-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: white;
  border-radius: 12px;
  margin-bottom: 12px;
  border: 2px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.task-item:hover {
  border-color: rgba(37, 99, 235, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.task-item.completed {
  opacity: 0.7;
  background: rgba(248, 250, 252, 0.8);
}

.task-content {
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1;
  min-width: 0;
}

.checkbox {
  width: 24px;
  height: 24px;
  border: 2px solid #cbd5e1;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.checkbox:hover {
  border-color: #2563eb;
  transform: scale(1.1);
}

.checkbox.checked {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  border-color: #2563eb;
}

.checkmark {
  color: white;
  font-size: 14px;
  font-weight: bold;
}

.task-text-wrapper {
  flex: 1;
  min-width: 0;
}

.task-text {
  color: #1e293b;
  font-size: 0.95rem;
  line-height: 1.5;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.task-item.completed .task-text {
  text-decoration: line-through;
  color: #94a3b8;
}

.task-edit-input {
  flex: 1;
  padding: 8px 12px;
  border: 2px solid #2563eb;
  border-radius: 8px;
  font-size: 0.95rem;
  outline: none;
  background: white;
}

.task-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.btn-action {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.04);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.btn-action:hover {
  transform: scale(1.1);
}

.btn-edit:hover {
  background: rgba(37, 99, 235, 0.1);
}

.btn-delete:hover {
  background: rgba(239, 68, 68, 0.1);
}

.btn-save {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
  font-weight: bold;
}

.btn-save:hover {
  background: rgba(34, 197, 94, 0.2);
}

.btn-cancel {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
  font-weight: bold;
}

.btn-cancel:hover {
  background: rgba(239, 68, 68, 0.2);
}

@media (max-width: 768px) {
  .task-item {
    padding: 14px 16px;
  }
  
  .task-text {
    font-size: 0.9rem;
  }
  
  .btn-action {
    width: 32px;
    height: 32px;
    font-size: 0.9rem;
  }
}
</style>
