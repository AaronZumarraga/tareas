<!-- filepath: c:\Users\AaronZumarraga\Downloads\tareas\src\components\FormInput.vue -->
<script setup lang="ts">
defineProps<{
  id: string
  label: string
  type?: string
  placeholder?: string
  modelValue?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="form-group">
    <label :for="id">{{ label }}</label>
    <input 
      :id="id"
      :type="type || 'text'" 
      :placeholder="placeholder"
      :value="modelValue"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>

<style scoped>
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;
}

.form-group label {
  color: #334155;
  font-size: 0.9rem;
  font-weight: 500;
}

.form-group input {
  padding: 12px 16px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.6);
  color: #1e293b;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.2s;
}

.form-group input:focus {
  border-color: #2563eb;
  background: white;
}

.form-group input::placeholder {
  color: #94a3b8;
}
</style>