<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div id="app">
    <nav>
      <RouterLink to="/">Inicio</RouterLink>
      <RouterLink to="/tareas">Tareas</RouterLink>
      <RouterLink to="/acerca-de">Acerca de</RouterLink>
    </nav>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
nav {
  display: flex;
  gap: 20px;
  padding: 20px;
  background-color: #f0f0f0;
}

nav a {
  text-decoration: none;
  color: #333;
  font-weight: bold;
}

nav a.router-link-active {
  color: #42b983;
}

main {
  padding: 20px;
}
</style>
