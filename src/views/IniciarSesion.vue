<!-- filepath: c:\Users\AaronZumarraga\Downloads\tareas\src\views\IniciarSesion.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import PageTitle from '../components/PageTitle.vue'
import AuthForm from '../components/AuthForm.vue'
import FormInput from '../components/FormInput.vue'
import BaseButton from '../components/BaseButton.vue'
import PageSection from '../components/PageSection.vue'
import { useAuth } from '../service/tareas.service'

const { user, login, register, logout } = useAuth()
const isRegistro = ref(false)
const errorMsg = ref('')
const isLoading = ref(false)

const formData = ref({ email: '', password: '', nombre: '', apellido: '', confirm: '' })

const handleSubmit = async () => {
  errorMsg.value = ''
  isLoading.value = true
  try {
    if (isRegistro.value) {
      if (formData.value.password !== formData.value.confirm) throw new Error('Las contraseñas no coinciden')
      await register(formData.value)
    } else {
      await login(formData.value.email, formData.value.password)
    }
  } catch (err: any) {
    errorMsg.value = err.message || 'Error en la operación'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <PageSection max-width="500px">
    <PageTitle 
      :title="user ? 'Perfil' : (isRegistro ? 'Crear Cuenta' : 'Iniciar Sesión')" 
      :subtitle="user ? 'Datos de tu cuenta' : 'Bienvenido a TaskManager'" 
    />

    <p v-if="errorMsg" class="error">{{ errorMsg }}</p>

    <div v-if="user" class="perfil">
      <p><strong>Nombre:</strong> {{ user.nombre }} {{ user.apellido }}</p>
      <p><strong>Correo:</strong> {{ user.email }}</p>
      <BaseButton variant="primary" full-width @click="logout">Cerrar sesión</BaseButton>
    </div>

    <AuthForm v-else :is-registro="isRegistro" @submit="handleSubmit" @toggle-form="isRegistro = !isRegistro; errorMsg = ''">
      <template v-if="isRegistro">
        <FormInput id="nombre" v-model="formData.nombre" label="Nombre" />
        <FormInput id="apellido" v-model="formData.apellido" label="Apellido" />
      </template>
      
      <FormInput id="email" v-model="formData.email" label="Correo" type="email" />
      <FormInput id="pass" v-model="formData.password" label="Contraseña" type="password" />
      
      <FormInput v-if="isRegistro" id="conf" v-model="formData.confirm" label="Confirmar" type="password" />

      <BaseButton type="submit" variant="primary" full-width :disabled="isLoading">
        {{ isLoading ? 'Procesando...' : (isRegistro ? 'Crear Usuario' : 'Iniciar Sesión') }}
      </BaseButton>
    </AuthForm>
  </PageSection>
</template>

<style scoped>
.error { color: #ef4444; text-align: center; margin-bottom: 10px; }
.perfil { display: flex; flex-direction: column; gap: 10px; color: #1e293b; }
</style>