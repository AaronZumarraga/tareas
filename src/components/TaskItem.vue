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

const getStatusIcon = (status: string): string => {
  const icons: Record<string, string> = {
    'Pendiente': '⏳',
    'En Progreso': '🚀',
    'Completada': '✅',
    'Cancelada': '❌'
  }
  return icons[status] || '📋'
}

const getPriorityIcon = (priority: string): string => {
  const icons: Record<string, string> = {
    'Baja': '🟢',
    'Media': '🟡',
    'Alta': '🟠',
    'Urgente': '🔴'
  }
  return icons[priority] || '⚪'
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
    'Baja': '#10b981',
    'Media': '#f59e0b',
    'Alta': '#f97316',
    'Urgente': '#ef4444'
  }
  return colors[priority] || '#64748b'
}

const formatDate = (dateString: string): string => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>

<template>
  <div class="task-item" :class="{ completed: completed, editing: isEditing }">
    <!-- Barra lateral de prioridad -->
    <div class="priority-indicator" :style="{ backgroundColor: getPriorityColor(prioridad) }"></div>
    
    <div class="task-main">
      <!-- Checkbox -->
      <div class="task-checkbox-container">
        <button 
          class="checkbox" 
          :class="{ checked: completed }"
          @click="handleToggle"
          aria-label="Marcar como completada"
          :disabled="isEditing"
        >
          <span class="checkmark" v-if="completed">✓</span>
        </button>
      </div>
      
      <!-- Contenido -->
      <div class="task-body">
        <div v-if="!isEditing" class="task-view">
          <!-- Header con título y badges -->
          <div class="task-header-section">
            <h3 class="task-title">{{ titulo }}</h3>
            <div class="task-meta-badges">
              <span class="badge badge-status" :style="{ backgroundColor: getStatusColor(estado), borderColor: getStatusColor(estado) }">
                <span class="badge-icon">{{ getStatusIcon(estado) }}</span>
                <span class="badge-text">{{ estado }}</span>
              </span>
              <span class="badge badge-priority" :style="{ backgroundColor: getPriorityColor(prioridad), borderColor: getPriorityColor(prioridad) }">
                <span class="badge-icon">{{ getPriorityIcon(prioridad) }}</span>
                <span class="badge-text">{{ prioridad }}</span>
              </span>
            </div>
          </div>

          <!-- Descripción -->
          <p v-if="descripcion" class="task-description">
            <span class="description-icon">📝</span>
            {{ descripcion }}
          </p>

          <!-- Fecha de vencimiento -->
          <div v-if="dueDate" class="task-footer-info">
            <span class="task-date">
              <span class="date-icon">📅</span>
              <span class="date-text">{{ formatDate(dueDate) }}</span>
            </span>
          </div>
        </div>
        
        <!-- Modo edición -->
        <div v-else class="task-edit">
          <div class="edit-field">
            <label class="edit-label">
              <span class="label-icon">✏️</span>
              Título
            </label>
            <input 
              v-model="editTitulo"
              class="edit-input"
              placeholder="Escribe el título de la tarea"
              @keyup.esc="cancelEdit"
              @keyup.enter="saveEdit"
              autofocus
            />
          </div>

          <div class="edit-field">
            <label class="edit-label">
              <span class="label-icon">📝</span>
              Descripción
            </label>
            <textarea 
              v-model="editDescripcion"
              class="edit-textarea"
              placeholder="Agrega una descripción (opcional)"
              @keyup.esc="cancelEdit"
              rows="3"
            ></textarea>
          </div>

          <div class="edit-row">
            <div class="edit-field">
              <label class="edit-label">
                <span class="label-icon">{{ getStatusIcon(editEstado) }}</span>
                Estado
              </label>
              <select 
                v-model="editEstado"
                class="edit-select"
                @keyup.esc="cancelEdit"
              >
                <option v-for="state in states" :key="state" :value="state">
                  {{ getStatusIcon(state) }} {{ state }}
                </option>
              </select>
            </div>

            <div class="edit-field">
              <label class="edit-label">
                <span class="label-icon">{{ getPriorityIcon(editPrioridad) }}</span>
                Prioridad
              </label>
              <select 
                v-model="editPrioridad"
                class="edit-select"
                @keyup.esc="cancelEdit"
              >
                <option v-for="p in priorities" :key="p" :value="p">
                  {{ getPriorityIcon(p) }} {{ p }}
                </option>
              </select>
            </div>
          </div>

          <div class="edit-field">
            <label class="edit-label">
              <span class="label-icon">📅</span>
              Fecha de vencimiento
            </label>
            <input 
              v-model="editDueDate"
              type="date"
              class="edit-input"
              @keyup.esc="cancelEdit"
            />
          </div>
        </div>
      </div>

      <!-- Acciones -->
      <div class="task-actions">
        <template v-if="!isEditing">
          <button 
            class="btn-action btn-edit" 
            @click="startEdit"
            aria-label="Editar tarea"
            title="Editar"
          >
            <span class="action-icon">✏️</span>
          </button>
          <button 
            class="btn-action btn-delete" 
            @click="handleDelete"
            aria-label="Eliminar tarea"
            title="Eliminar"
          >
            <span class="action-icon">🗑️</span>
          </button>
        </template>
        <template v-else>
          <button 
            class="btn-action btn-save" 
            @click="saveEdit"
            aria-label="Guardar cambios"
            title="Guardar"
          >
            <span class="action-icon">💾</span>
          </button>
          <button 
            class="btn-action btn-cancel" 
            @click="cancelEdit"
            aria-label="Cancelar edición"
            title="Cancelar"
          >
            <span class="action-icon">✖️</span>
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.task-item {
  position: relative;
  display: flex;
  background: white;
  border-radius: 16px;
  margin-bottom: 16px;
  border: 2px solid rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.task-item:hover {
  border-color: rgba(37, 99, 235, 0.3);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.task-item.completed {
  opacity: 0.7;
  background: linear-gradient(to right, rgba(248, 250, 252, 0.95), rgba(241, 245, 249, 0.95));
}

.task-item.editing {
  border-color: #2563eb;
  box-shadow: 0 8px 32px rgba(37, 99, 235, 0.2);
}

.priority-indicator {
  width: 6px;
  flex-shrink: 0;
  transition: width 0.2s ease;
}

.task-item:hover .priority-indicator {
  width: 8px;
}

.task-main {
  display: flex;
  flex: 1;
  gap: 16px;
  padding: 20px;
  align-items: flex-start;
}

.task-checkbox-container {
  flex-shrink: 0;
  padding-top: 2px;
}

.checkbox {
  width: 28px;
  height: 28px;
  border: 2.5px solid #cbd5e1;
  border-radius: 9px;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
}

.checkbox:hover:not(:disabled) {
  border-color: #2563eb;
  transform: scale(1.1);
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
}

.checkbox.checked {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  border-color: #2563eb;
}

.checkbox:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.checkmark {
  color: white;
  font-size: 16px;
  font-weight: bold;
  animation: checkPop 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes checkPop {
  0% { transform: scale(0) rotate(-45deg); }
  50% { transform: scale(1.2) rotate(10deg); }
  100% { transform: scale(1) rotate(0deg); }
}

.task-body {
  flex: 1;
  min-width: 0;
}

.task-view {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-header-section {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.task-title {
  color: #1e293b;
  font-size: 1.1rem;
  font-weight: 600;
  line-height: 1.5;
  margin: 0;
  flex: 1;
  min-width: 200px;
  word-wrap: break-word;
  transition: color 0.2s ease;
}

.task-item.completed .task-title {
  text-decoration: line-through;
  color: #94a3b8;
}

.task-meta-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
  border: 2px solid;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.badge-status {
  color: white;
}

.badge-priority {
  color: white;
}

.badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.badge-icon {
  font-size: 0.9rem;
  line-height: 1;
}

.badge-text {
  line-height: 1;
}

.task-description {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0;
  padding: 12px;
  background: rgba(248, 250, 252, 0.8);
  border-radius: 10px;
  border-left: 3px solid #e2e8f0;
  transition: all 0.2s ease;
}

.task-item.completed .task-description {
  color: #94a3b8;
}

.description-icon {
  font-size: 1rem;
  flex-shrink: 0;
  margin-top: 2px;
}

.task-footer-info {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.task-date {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(248, 250, 252, 0.9);
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  color: #64748b;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.task-date:hover {
  background: rgba(241, 245, 249, 1);
  border-color: #cbd5e1;
}

.date-icon {
  font-size: 0.9rem;
}

.task-item.completed .task-date {
  color: #cbd5e1;
}

/* Estilos de edición */
.task-edit {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 4px 0;
}

.edit-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.edit-label {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #475569;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.label-icon {
  font-size: 1rem;
}

.edit-input,
.edit-textarea,
.edit-select {
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.95rem;
  font-family: inherit;
  outline: none;
  background: white;
  color: #1e293b;
  transition: all 0.2s ease;
}

.edit-input:focus,
.edit-textarea:focus,
.edit-select:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
}

.edit-textarea {
  resize: vertical;
  min-height: 80px;
  line-height: 1.6;
}

.edit-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

/* Acciones */
.task-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
  align-self: flex-start;
}

.btn-action {
  width: 42px;
  height: 42px;
  border: none;
  border-radius: 11px;
  background: rgba(0, 0, 0, 0.04);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.btn-action::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.btn-action:hover::before {
  opacity: 1;
}

.btn-action:hover {
  transform: scale(1.1);
}

.btn-action:active {
  transform: scale(0.95);
}

.action-icon {
  font-size: 1.2rem;
  line-height: 1;
}

.btn-edit:hover {
  background: rgba(37, 99, 235, 0.12);
}

.btn-delete:hover {
  background: rgba(239, 68, 68, 0.12);
}

.btn-save {
  background: rgba(34, 197, 94, 0.12);
}

.btn-save:hover {
  background: rgba(34, 197, 94, 0.2);
}

.btn-cancel {
  background: rgba(239, 68, 68, 0.12);
}

.btn-cancel:hover {
  background: rgba(239, 68, 68, 0.2);
}

/* Responsive */
@media (max-width: 768px) {
  .task-main {
    flex-direction: column;
    padding: 16px;
    gap: 12px;
  }

  .task-checkbox-container {
    padding-top: 0;
  }

  .task-header-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .task-title {
    font-size: 1rem;
    min-width: unset;
  }

  .task-meta-badges {
    width: 100%;
  }

  .badge {
    flex: 1;
    justify-content: center;
  }

  .edit-row {
    grid-template-columns: 1fr;
  }

  .task-actions {
    flex-direction: row;
    width: 100%;
    justify-content: flex-end;
  }

  .btn-action {
    width: 40px;
    height: 40px;
  }

  .action-icon {
    font-size: 1.1rem;
  }

  .priority-indicator {
    width: 5px;
  }

  .task-item:hover .priority-indicator {
    width: 6px;
  }
}
</style>
