<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<template>
  <div id="app">
    <header>
      <div class="container">
        <h1 class="logo">TaskManager</h1>
        <button class="hamburger" @click="toggleMenu">
          <span :class="{'open': isMenuOpen}">☰</span>
        </button>
        <nav :class="{ 'open': isMenuOpen }">
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

.hamburger {
  display: none; /* Hidden by default */
  font-size: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
}

nav {
  display: flex;
  gap: 8px;
}

nav.open {
  display: flex; /* Show menu when open */
  flex-direction: column; /* Stack items vertically */
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

@media (max-width: 768px) {
  .hamburger {
    display: block; /* Show hamburger on small screens */
  }

  nav {
    display: none; /* Hide nav by default on small screens */
    position: absolute;
    top: 60px; /* Adjust based on header height */
    left: 0;
    right: 0;
    background: white;
    z-index: 10;
  }
}
</style>
