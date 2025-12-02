<!-- filepath: c:\Users\AaronZumarraga\Downloads\tareas\src\components\PageTitle.vue -->
<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<template>
  <div class="page-title">
    <h1>{{ title }}</h1>
    <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
  </div>
</template>

<style scoped>
.page-title {
  margin-bottom: 30px;
}

h1 {
  color: #1e293b;
  font-size: 1.9rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.subtitle {
  color: #64748b;
  font-size: 1rem;
}
</style>