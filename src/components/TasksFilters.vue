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
  transition: all 0.2s ease;
}

.filter-btn:hover {
  background: rgba(37, 99, 235, 0.1);
  color: #2563eb;
}

.filter-btn.active {
  background: #2563eb;
  color: white;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.3);
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
