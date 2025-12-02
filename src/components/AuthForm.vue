<!-- filepath: c:\Users\AaronZumarraga\Downloads\tareas\src\components\AuthForm.vue -->
<script setup lang="ts">
defineProps<{
  isRegistro?: boolean
}>()

const emit = defineEmits<{
  submit: []
  toggleForm: []
}>()

const handleSubmit = (e: Event) => {
  e.preventDefault()
  emit('submit')
}
</script>

<template>
  <form class="auth-form" @submit="handleSubmit">
    <slot />
    
    <p class="toggle-text">
      {{ isRegistro ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?' }}
      <a @click="emit('toggleForm')">
        {{ isRegistro ? 'Inicia sesión' : 'Regístrate' }}
      </a>
    </p>
  </form>
</template>

<style scoped>
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 10px;
}

.toggle-text {
  text-align: center;
  color: #64748b;
  font-size: 0.9rem;
  margin-top: 10px;
}

.toggle-text a {
  color: #2563eb;
  cursor: pointer;
  font-weight: 500;
  text-decoration: none;
}

.toggle-text a:hover {
  text-decoration: underline;
}
</style>