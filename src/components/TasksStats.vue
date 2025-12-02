<script setup lang="ts">
defineProps<{
  total: number
  active: number
  completed: number
}>()
</script>

<template>
  <div class="stats-bar">
    <div class="stat-item">
      <span class="stat-number">{{ total }}</span>
      <span class="stat-label">Total</span>
    </div>
    <div class="stat-item">
      <span class="stat-number active">{{ active }}</span>
      <span class="stat-label">Activas</span>
    </div>
    <div class="stat-item">
      <span class="stat-number completed">{{ completed }}</span>
      <span class="stat-label">Completadas</span>
    </div>
  </div>
</template>

<style scoped>
.stats-bar {
  display: flex;
  gap: 20px;
  padding: 20px;
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.05) 0%, rgba(29, 78, 216, 0.05) 100%);
  border-radius: 12px;
  margin-bottom: 24px;
}
.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.stat-number {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2563eb;
}
.stat-number.active {
  color: #f59e0b;
}
.stat-number.completed {
  color: #10b981;
}
.stat-label {
  font-size: 0.85rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
@media (max-width: 768px) {
  .stats-bar {
    gap: 12px;
    padding: 16px;
  }
  .stat-number {
    font-size: 1.5rem;
  }
  .stat-label {
    font-size: 0.75rem;
  }
}
</style>
