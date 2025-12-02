<!-- filepath: c:\Users\AaronZumarraga\Downloads\tareas\src\views\AcercaDe.vue -->
<script setup lang="ts">
</script>

<template>
  <div class="acerca-de">
    <div class="glass-card">
      <h1>Acerca de</h1>
      <p class="subtitle">TaskManager v1.0</p>
      <div class="info-section">
        <div class="info-item">
          <h3>Tecnologías</h3>
          <p>Vue 3, TypeScript, Vue Router</p>
        </div>
        <div class="info-item">
          <h3>Diseño</h3>
          <p>Glassmorphism minimalista</p>
        </div>
        <div class="info-item">
          <h3>Propósito</h3>
          <p>Gestión simple de tareas diarias</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ESTILOS LOCALES - Solo para Acerca De */
.acerca-de {
  max-width: 700px;
  margin: 0 auto;
  padding-top: 20px;
}

.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
}

h1 {
  color: #1e293b;
  font-size: 1.9rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.subtitle {
  color: #64748b;
  font-size: 1rem;
  margin-bottom: 40px;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-item {
  padding: 24px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 10px;
  text-align: left;
}

.info-item h3 {
  color: #334155;
  font-size: 1.05rem;
  margin-bottom: 8px;
  font-weight: 600;
}

.info-item p {
  color: #64748b;
  font-size: 0.95rem;
}
</style>