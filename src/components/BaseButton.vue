<!-- filepath: c:\Users\AaronZumarraga\Downloads\tareas\src\components\BaseButton.vue -->
<script setup lang="ts">
defineProps<{
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary'
  fullWidth?: boolean
}>()
</script>

<template>
  <button 
    :type="type || 'button'"
    :class="['base-button', `variant-${variant || 'primary'}`, { 'full-width': fullWidth }]"
  >
    <slot />
  </button>
</template>

<style scoped>
.base-button {
  padding: 14px 24px;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.variant-primary {
  background: #2563eb;
  color: white;
}

.variant-primary:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.variant-secondary {
  background: rgba(0, 0, 0, 0.05);
  color: #475569;
}

.variant-secondary:hover {
  background: rgba(0, 0, 0, 0.08);
}

.full-width {
  width: 100%;
}
</style>