<script setup lang="ts">
const props = defineProps<{
  icon?: string
  title: string
  subtitle?: string
}>()
</script>

<template>
  <div class="empty-state">
    <div v-if="icon" class="empty-icon">{{ icon }}</div>
    <p class="empty-title">{{ title }}</p>
    <p v-if="subtitle" class="empty-subtitle">{{ subtitle }}</p>
    <slot />
  </div>
</template>

<style scoped>
.empty-state {
  text-align: center;
  padding: 70px 20px;
  animation: fadeIn 0.5s ease;
}
.empty-icon {
  font-size: 4.5rem;
  margin-bottom: 20px;
  opacity: 0.5;
  animation: bounce 2s infinite;
}
.empty-title {
  color: #64748b;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 8px;
}
.empty-subtitle {
  color: #94a3b8;
  font-size: 0.95rem;
}
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes bounce { 0%,100% { transform: translateY(0);} 50% { transform: translateY(-10px);} }
@media (max-width: 768px) {
  .empty-state { padding: 50px 20px; }
  .empty-icon { font-size: 3.5rem; }
}
</style>
