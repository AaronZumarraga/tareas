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
  gap: 24px;
  padding: 24px;
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.06) 0%, rgba(29, 78, 216, 0.06) 100%);
  border-radius: 14px;
  margin-bottom: 28px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  transition: transform 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-3px);
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #2563eb;
  transition: color 0.3s ease;
}
.stat-number.active {
  color: #f59e0b;
}
.stat-number.completed {
  color: #10b981;
}
.stat-label {
  font-size: 0.9rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  font-weight: 600;
}
@media (max-width: 768px) {
  .stats-bar {
    gap: 16px;
    padding: 20px;
  }
  .stat-number {
    font-size: 1.7rem;
  }
  .stat-label {
    font-size: 0.8rem;
  }
}
</style>
