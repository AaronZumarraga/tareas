<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div id="app">
    <header>
      <div class="container">
        <h1 class="logo">TaskManager</h1>
        <nav>
          <RouterLink to="/" class="nav-link">Inicio</RouterLink>
          <RouterLink to="/tareas" class="nav-link">Tareas</RouterLink>
          <RouterLink to="/acerca-de" class="nav-link">Acerca de</RouterLink>
          <RouterLink to="/iniciar-sesion" class="nav-link">Iniciar Sesión</RouterLink>
        </nav>
      </div>
    </header>
    <main class="container">
      <RouterView />
    </main>
  </div>
</template>

<style>
/* ESTILOS GLOBALES */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', system-ui, sans-serif;
  background: #f0f4f8;
  min-height: 100vh;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  max-width: 90%; /* Adjusted for responsiveness */
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
}

header {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

header .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 20px;
}

.logo {
  font-size: 1.3rem;
  color: #2563eb;
  font-weight: 600;
}

nav {
  display: flex;
  gap: 8px;
}

.nav-link {
  padding: 8px 16px;
  text-decoration: none;
  color: #64748b;
  font-weight: 500;
  font-size: 0.95rem;
  border-radius: 6px;
  transition: all 0.2s;
}

.nav-link:hover {
  background: rgba(0, 0, 0, 0.04);
  color: #2563eb;
}

.nav-link.router-link-active {
  background: #2563eb;
  color: white;
}

main {
  flex: 1;
  padding: 40px 20px;
}
</style>
