<!-- filepath: c:\Users\AaronZumarraga\Downloads\tareas\src\views\IniciarSesion.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import GlassCard from '../components/GlassCard.vue'
import PageTitle from '../components/PageTitle.vue'

const isRegistro = ref(false)

const toggleForm = () => {
  isRegistro.value = !isRegistro.value
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
      <form v-if="!isRegistro" class="auth-form">
        <div class="form-group">
          <label for="email">Correo electrónico</label>
          <input 
            type="email" 
            id="email" 
            placeholder="tu@email.com"
          />
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <input 
            type="password" 
            id="password" 
            placeholder="••••••••"
          />
        </div>

        <button type="submit" class="btn-primary">Iniciar Sesión</button>
        
        <p class="toggle-text">
          ¿No tienes cuenta? 
          <a @click="toggleForm">Regístrate</a>
        </p>
      </form>

      <!-- Formulario de Registro -->
      <form v-else class="auth-form">
        <div class="form-row">
          <div class="form-group">
            <label for="nombre">Nombre</label>
            <input 
              type="text" 
              id="nombre" 
              placeholder="Juan"
            />
          </div>

          <div class="form-group">
            <label for="apellido">Apellido</label>
            <input 
              type="text" 
              id="apellido" 
              placeholder="Pérez"
            />
          </div>
        </div>

        <div class="form-group">
          <label for="email-registro">Correo electrónico</label>
          <input 
            type="email" 
            id="email-registro" 
            placeholder="tu@email.com"
          />
        </div>

        <div class="form-group">
          <label for="password-registro">Crear contraseña</label>
          <input 
            type="password" 
            id="password-registro" 
            placeholder="••••••••"
          />
        </div>

        <div class="form-group">
          <label for="password-confirm">Confirmar contraseña</label>
          <input 
            type="password" 
            id="password-confirm" 
            placeholder="••••••••"
          />
        </div>

        <button type="submit" class="btn-primary">Crear Usuario</button>
        
        <p class="toggle-text">
          ¿Ya tienes cuenta? 
          <a @click="toggleForm">Inicia sesión</a>
        </p>
      </form>
    </GlassCard>
  </div>
</template>

<style scoped>
.iniciar-sesion {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 40px;
  min-height: calc(100vh - 200px);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 10px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

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

.btn-primary {
  padding: 14px 24px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 10px;
}

.btn-primary:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
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