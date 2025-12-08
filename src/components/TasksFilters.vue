<script setup lang="ts">
import { computed } from 'vue'

type Filter = 'all' | 'active' | 'completed'

const props = defineProps<{
  modelValue: Filter
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: Filter): void
}>()

const filter = computed({
  get: () => props.modelValue,
  set: (val: Filter) => emit('update:modelValue', val)
})
</script>

<template>
  <div class="filters">
    <button
      class="filter-btn"
      :class="{ active: filter === 'all' }"
      @click="filter = 'all'"
    >
      Todas
    </button>
    <button
      class="filter-btn"
      :class="{ active: filter === 'active' }"
      @click="filter = 'active'"
    >
      Activas
    </button>
    <button
      class="filter-btn"
      :class="{ active: filter === 'completed' }"
      @click="filter = 'completed'"
    >
      Completadas
    </button>
  </div>
</template>

<style scoped>
.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 28px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.025);
  border-radius: 14px;
  animation: slideUp 0.4s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.filter-btn {
  flex: 1;
  padding: 12px 24px;
  border: none;
  border-radius: 10px;
  background: transparent;
  color: #64748b;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.filter-btn:hover {
  background: rgba(37, 99, 235, 0.1);
  color: #2563eb;
  transform: translateY(-2px);
}

.filter-btn.active {
  background: #2563eb;
  color: white;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .filters {
    gap: 8px;
  }
  .filter-btn {
    padding: 11px 20px;
    font-size: 0.9rem;
  }
}
</style>
