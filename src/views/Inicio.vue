<!-- filepath: c:\Users\AaronZumarraga\Downloads\tareas\src\views\Inicio.vue -->
<script setup lang="ts">
</script>

<template>
  <div class="inicio">
    <div class="glass-card">
      <h1>Bienvenido</h1>
      <p class="subtitle">Gestiona tus tareas de forma simple</p>
      <div class="features">
        <div class="feature-item">Simple</div>
        <div class="feature-item">Efectivo</div>
        <div class="feature-item">Rápido</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ESTILOS LOCALES - Solo afectan este componente */
.inicio {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 60px;
}

.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  padding: 50px 40px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  max-width: 600px;
  width: 100%;
}

h1 {
  color: #1e293b;
  font-size: 2.2rem;
  font-weight: 600;
  margin-bottom: 12px;
}

.subtitle {
  color: #64748b;
  font-size: 1.05rem;
  margin-bottom: 40px;
}

.features {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.feature-item {
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  font-size: 0.9rem;
  color: #475569;
  font-weight: 500;
}
</style>