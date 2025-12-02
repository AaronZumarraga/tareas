<!-- filepath: c:\Users\AaronZumarraga\Downloads\tareas\src\components\GlassCard.vue -->
<script setup lang="ts">
defineProps<{
  maxWidth?: string
  padding?: string
  textAlign?: 'left' | 'center' | 'right'
}>()
</script>

<template>
  <div 
    class="glass-card"
    :style="{
      maxWidth: maxWidth || 'none',
      padding: padding || '40px',
      textAlign: textAlign || 'center'
    }"
  >
    <slot />
  </div>
</template>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  width: 100%; /* Ensure it takes full width */
  max-width: 600px; /* Optional max width */
  margin: auto; /* Center the card */
}
</style>