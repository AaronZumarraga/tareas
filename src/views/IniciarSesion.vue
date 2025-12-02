<!-- filepath: c:\Users\AaronZumarraga\Downloads\tareas\src\views\IniciarSesion.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import GlassCard from '../components/GlassCard.vue'
import PageTitle from '../components/PageTitle.vue'
import AuthForm from '../components/AuthForm.vue'
import FormInput from '../components/FormInput.vue'
import BaseButton from '../components/BaseButton.vue'

const isRegistro = ref(false)

// Datos del formulario de login
const loginEmail = ref('')
const loginPassword = ref('')

// Datos del formulario de registro
const registroNombre = ref('')
const registroApellido = ref('')
const registroEmail = ref('')
const registroPassword = ref('')
const registroPasswordConfirm = ref('')

const toggleForm = () => {
  isRegistro.value = !isRegistro.value
}

const handleLoginSubmit = () => {
  console.log('Login:', { email: loginEmail.value, password: loginPassword.value })
}

const handleRegistroSubmit = () => {
  console.log('Registro:', {
    nombre: registroNombre.value,
    apellido: registroApellido.value,
    email: registroEmail.value,
    password: registroPassword.value
  })
}
</script>

<template>
  <div class="iniciar-sesion">
    <GlassCard max-width="500px">
      <PageTitle 
        :title="isRegistro ? 'Crear Cuenta' : 'Iniciar Sesión'" 
        :subtitle="isRegistro ? 'Regístrate para comenzar' : 'Accede a tu cuenta'" 
      />

      <!-- Formulario de Login -->
      <AuthForm 
        v-if="!isRegistro" 
        :is-registro="false"
        @submit="handleLoginSubmit"
        @toggle-form="toggleForm"
      >
        <FormInput
          id="email"
          v-model="loginEmail"
          label="Correo electrónico"
          type="email"
          placeholder="tu@email.com"
        />

        <FormInput
          id="password"
          v-model="loginPassword"
          label="Contraseña"
          type="password"
          placeholder="••••••••"
        />

        <BaseButton type="submit" variant="primary" full-width>
          Iniciar Sesión
        </BaseButton>
      </AuthForm>

      <!-- Formulario de Registro -->
      <AuthForm 
        v-else
        :is-registro="true"
        @submit="handleRegistroSubmit"
        @toggle-form="toggleForm"
      >
        <FormInput
          id="nombre"
          v-model="registroNombre"
          label="Nombre"
          placeholder="Juan"
        />

        <FormInput
          id="apellido"
          v-model="registroApellido"
          label="Apellido"
          placeholder="Pérez"
        />

        <FormInput
          id="email-registro"
          v-model="registroEmail"
          label="Correo electrónico"
          type="email"
          placeholder="tu@email.com"
        />

        <FormInput
          id="password-registro"
          v-model="registroPassword"
          label="Crear contraseña"
          type="password"
          placeholder="••••••••"
        />

        <FormInput
          id="password-confirm"
          v-model="registroPasswordConfirm"
          label="Confirmar contraseña"
          type="password"
          placeholder="••••••••"
        />

        <BaseButton type="submit" variant="primary" full-width>
          Crear Usuario
        </BaseButton>
      </AuthForm>
    </GlassCard>
  </div>
</template>

<style scoped>
.iniciar-sesion {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 40px;
  padding-bottom: 40px; /* Add bottom padding for footer spacing */
  min-height: auto; /* Remove fixed min-height */
}

@media (max-width: 768px) {
  .iniciar-sesion {
    padding-top: 20px;
    padding-bottom: 30px;
  }
}
</style>