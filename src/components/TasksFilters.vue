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
  gap: 8px;
  margin-bottom: 24px;
  padding: 8px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 12px;
}
.filter-btn {
  flex: 1;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}
.filter-btn:hover {
  background: rgba(37, 99, 235, 0.08);
  color: #2563eb;
}
.filter-btn.active {
  background: #2563eb;
  color: white;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
}
@media (max-width: 768px) {
  .filters {
    gap: 6px;
  }
  .filter-btn {
    padding: 8px 16px;
    font-size: 0.85rem;
  }
}
</style>
