<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useAuth } from './composables/useAuth'

const { user, verifySession } = useAuth()
const isMenuOpen = ref(false)
const currentYear = computed(() => new Date().getFullYear())

onMounted(() => verifySession())

const toggleMenu = () => { isMenuOpen.value = !isMenuOpen.value }
const closeMenu = () => { isMenuOpen.value = false }
</script>

<template>
  <div id="app">
    <header>
      <div class="container">
        <h1 class="logo">TaskManager</h1>
        <button
          class="hamburger"
          :aria-expanded="isMenuOpen"
          aria-controls="main-nav"
          @click="toggleMenu"
        >
          <span class="bar" :class="{ open: isMenuOpen }"></span>
          <span class="bar" :class="{ open: isMenuOpen }"></span>
          <span class="bar" :class="{ open: isMenuOpen }"></span>
        </button>
        <nav id="main-nav" :class="{ open: isMenuOpen }">
          <RouterLink to="/" class="nav-link" @click="closeMenu">Inicio</RouterLink>
          <RouterLink to="/tareas" class="nav-link" @click="closeMenu">Tareas</RouterLink>
          <RouterLink to="/acerca-de" class="nav-link" @click="closeMenu">Acerca de</RouterLink>
          <RouterLink :to="user ? '/perfil' : '/iniciar-sesion'" class="nav-link" @click="closeMenu">
            {{ user ? 'Perfil' : 'Iniciar Sesión' }}
          </RouterLink>
        </nav>
      </div>
    </header>
    <main class="container">
      <RouterView />
    </main>
    <footer>
      <div class="container">
        <p>&copy; {{ currentYear }} TaskManager. Todos los derechos reservados.</p>
      </div>
    </footer>
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
  display: none;
  width: 42px;
  height: 42px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  background: white;
  cursor: pointer;
  padding: 10px;
  gap: 4px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: box-shadow 0.2s, transform 0.2s;
}

.hamburger:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  transform: translateY(-1px);
}

.hamburger .bar {
  width: 100%;
  height: 2px;
  background: #1f2937;
  border-radius: 999px;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.hamburger .bar:nth-child(1).open {
  transform: translateY(6px) rotate(45deg);
}
.hamburger .bar:nth-child(2).open {
  opacity: 0;
}
.hamburger .bar:nth-child(3).open {
  transform: translateY(-6px) rotate(-45deg);
}

nav {
  display: flex;
  gap: 8px;
  align-items: center;
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
  padding-bottom: 60px; /* Increased bottom padding */
  min-height: calc(100vh - 200px); /* Ensure minimum height */
}

footer {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  padding: 1.5rem 0;
  text-align: center;
  margin-top: auto;
}

footer p {
  color: #64748b;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .hamburger {
    display: inline-flex;
  }

  nav {
    display: none;
    position: absolute;
    top: 72px;
    left: 0;
    right: 0;
    background: white;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    flex-direction: column;
    padding: 12px 16px 16px;
    gap: 6px;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
  }

  nav.open {
    display: flex;
  }

  .nav-link {
    width: 100%;
    padding: 10px 12px;
    border-radius: 8px;
  }
}
</style>
