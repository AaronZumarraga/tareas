<script setup lang="ts">
const props = defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<template>
  <div class="empty-state">
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
@media (max-width: 768px) {
  .empty-state { padding: 50px 20px; }
}
</style>
