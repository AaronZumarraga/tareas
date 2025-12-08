<!-- filepath: c:\Users\AaronZumarraga\Downloads\tareas\src\views\IniciarSesion.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import GlassCard from '../components/GlassCard.vue'
import PageTitle from '../components/PageTitle.vue'
import AuthForm from '../components/AuthForm.vue'
import FormInput from '../components/FormInput.vue'
import BaseButton from '../components/BaseButton.vue'
import { login, register, type Usuario } from '../service/tareas.service'

const isRegistro = ref(false)
const authUser = ref<Usuario | null>(null)
const errorMsg = ref('')

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
  errorMsg.value = ''
}

const persistUser = (user: Usuario | null) => {
  if (user) {
    localStorage.setItem('auth_user', JSON.stringify(user))
  } else {
    localStorage.removeItem('auth_user')
  }
  authUser.value = user
  window.dispatchEvent(new Event('auth-change'))
}

const handleLoginSubmit = async () => {
  errorMsg.value = ''
  try {
    const user = await login(loginEmail.value, loginPassword.value)
    persistUser(user)
  } catch (err: any) {
    errorMsg.value = 'No se pudo iniciar sesión'
  }
}

const handleRegistroSubmit = async () => {
  errorMsg.value = ''
  if (registroPassword.value !== registroPasswordConfirm.value) {
    errorMsg.value = 'Las contraseñas no coinciden'
    return
  }
  try {
    const user = await register({
      nombre: registroNombre.value,
      apellido: registroApellido.value,
      email: registroEmail.value,
      password: registroPassword.value
    })
    persistUser(user)
    isRegistro.value = false
  } catch (err: any) {
    errorMsg.value = 'No se pudo registrar'
  }
}

const cerrarSesion = () => {
  persistUser(null)
}

onMounted(() => {
  const saved = localStorage.getItem('auth_user')
  if (saved) authUser.value = JSON.parse(saved)
})
</script>

<template>
  <div class="iniciar-sesion">
    <GlassCard max-width="500px">
      <PageTitle 
        :title="authUser ? 'Perfil' : (isRegistro ? 'Crear Cuenta' : 'Iniciar Sesión')" 
        :subtitle="authUser ? 'Datos de tu cuenta' : (isRegistro ? 'Regístrate para comenzar' : 'Accede a tu cuenta')" 
      />

      <p v-if="errorMsg" class="error">{{ errorMsg }}</p>

      <div v-if="authUser" class="perfil">
        <p><strong>Nombre:</strong> {{ authUser.nombre }} {{ authUser.apellido }}</p>
        <p><strong>Correo:</strong> {{ authUser.email }}</p>
        <p v-if="authUser.fechaCreacion"><strong>Creado:</strong> {{ new Date(authUser.fechaCreacion).toLocaleString() }}</p>
        <BaseButton variant="primary" full-width @click="cerrarSesion">
          Cerrar sesión
        </BaseButton>
      </div>

      <!-- Formulario de Login -->
      <AuthForm 
        v-else-if="!isRegistro" 
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

.error {
  color: #ef4444;
  text-align: center;
  margin-bottom: 4px;
  font-weight: 500;
}

.perfil {
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: #1e293b;
}

@media (max-width: 768px) {
  .iniciar-sesion {
    padding-top: 20px;
    padding-bottom: 30px;
  }
}
</style>