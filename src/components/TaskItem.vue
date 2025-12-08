<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  id: number
  titulo: string
  descripcion: string
  estado: string
  prioridad: string
  completed: boolean
  dueDate?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  toggle: [id: number]
  delete: [id: number]
  edit: [id: number, data: { titulo: string; descripcion: string; estado: string; prioridad: string; fechaVencimiento: string }]
}>()

const isEditing = ref(false)
const editTitulo = ref(props.titulo)
const editDescripcion = ref(props.descripcion)
const editEstado = ref(props.estado)
const editPrioridad = ref(props.prioridad)
const editDueDate = ref(props.dueDate || '')
const states = ['Pendiente', 'En Progreso', 'Completada', 'Cancelada']
const priorities = ['Baja', 'Media', 'Alta', 'Urgente']

const handleToggle = () => {
  emit('toggle', props.id)
}

const handleDelete = () => {
  emit('delete', props.id)
}

const startEdit = () => {
  isEditing.value = true
  editTitulo.value = props.titulo
  editDescripcion.value = props.descripcion
  editEstado.value = props.estado
  editPrioridad.value = props.prioridad
  editDueDate.value = props.dueDate || ''
}

const saveEdit = () => {
  if (editTitulo.value.trim()) {
    emit('edit', props.id, {
      titulo: editTitulo.value,
      descripcion: editDescripcion.value,
      estado: editEstado.value,
      prioridad: editPrioridad.value,
      fechaVencimiento: editDueDate.value
    })
    isEditing.value = false
  }
}

const cancelEdit = () => {
  isEditing.value = false
}

const formatDate = (dateString: string): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })
}

const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    'Pendiente': '#f59e0b',
    'En Progreso': '#3b82f6',
    'Completada': '#10b981',
    'Cancelada': '#ef4444'
  }
  return colors[status] || '#64748b'
}

const getPriorityColor = (priority: string): string => {
  const colors: Record<string, string> = {
    'Baja': '#64748b',
    'Media': '#f59e0b',
    'Alta': '#f97316',
    'Urgente': '#ef4444'
  }
  return colors[priority] || '#64748b'
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
        <div class="task-header">
          <p class="task-text">{{ titulo }}</p>
          <div class="task-badges">
            <span class="task-status" :style="{ backgroundColor: getStatusColor(estado) }">
              {{ estado }}
            </span>
            <span class="task-priority" :style="{ backgroundColor: getPriorityColor(prioridad) }">
              🔥 {{ prioridad }}
            </span>
          </div>
        </div>
        <p v-if="descripcion" class="task-description">{{ descripcion }}</p>
        <p v-if="dueDate" class="task-due-date">📅 {{ formatDate(dueDate) }}</p>
      </div>
      
      <div v-else class="task-edit-wrapper">
        <input 
          v-model="editTitulo"
          class="task-edit-input"
          placeholder="Título"
          @keyup.esc="cancelEdit"
          autofocus
        />
        <textarea 
          v-model="editDescripcion"
          class="task-edit-textarea"
          placeholder="Descripción (opcional)"
          @keyup.esc="cancelEdit"
        ></textarea>
        <div class="edit-selects-row">
          <select 
            v-model="editEstado"
            class="task-edit-select"
            @keyup.esc="cancelEdit"
          >
            <option v-for="state in states" :key="state" :value="state">
              {{ state }}
            </option>
          </select>
          <select 
            v-model="editPrioridad"
            class="task-edit-select"
            @keyup.esc="cancelEdit"
          >
            <option v-for="p in priorities" :key="p" :value="p">
              🔥 {{ p }}
            </option>
          </select>
        </div>
        <input 
          v-model="editDueDate"
          type="date"
          class="task-edit-date"
          @keyup.esc="cancelEdit"
        />
      </div>
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
  align-items: flex-start;
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
  align-items: flex-start;
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
  margin-top: 2px;
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

.task-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 4px;
}

.task-text {
  color: #1e293b;
  font-size: 0.95rem;
  line-height: 1.5;
  word-wrap: break-word;
  overflow-wrap: break-word;
  flex: 1;
}

.task-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.task-status,
.task-priority {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 6px;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0;
}

.task-description {
  color: #64748b;
  font-size: 0.85rem;
  margin: 4px 0;
  line-height: 1.4;
  word-wrap: break-word;
}

.task-due-date {
  color: #94a3b8;
  font-size: 0.8rem;
  margin-top: 6px;
}

.task-item.completed .task-text {
  text-decoration: line-through;
  color: #94a3b8;
}

.task-edit-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.task-edit-input,
.task-edit-textarea,
.task-edit-select,
.task-edit-date {
  padding: 8px 12px;
  border: 2px solid #2563eb;
  border-radius: 8px;
  font-size: 0.9rem;
  outline: none;
  background: white;
  color: #1e293b;
  font-family: inherit;
}

.task-edit-textarea {
  resize: vertical;
  min-height: 50px;
}

.edit-selects-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
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
    flex-direction: column;
  }
  
  .task-content {
    width: 100%;
  }
  
  .task-text {
    font-size: 0.9rem;
  }
  
  .task-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .task-badges {
    width: 100%;
  }
  
  .edit-selects-row {
    grid-template-columns: 1fr;
  }
  
  .task-actions {
    width: 100%;
    margin-top: 12px;
  }
  
  .btn-action {
    width: 32px;
    height: 32px;
    font-size: 0.9rem;
  }
}
</style>
