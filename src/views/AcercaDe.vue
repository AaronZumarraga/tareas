<!-- filepath: c:\Users\AaronZumarraga\Downloads\tareas\src\views\AcercaDe.vue -->
<script setup lang="ts">
import GlassCard from '../components/GlassCard.vue'
import PageTitle from '../components/PageTitle.vue'
</script>

<template>
  <div class="acerca-de">
    <GlassCard max-width="700px">
      <PageTitle title="Acerca de" subtitle="TaskManager v1.0" />
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
    </GlassCard>
  </div>
</template>

<style scoped>
.acerca-de {
  max-width: 90%; /* Adjusted for responsiveness */
  margin: 0 auto;
  padding-top: 20px;
}

.info-section {
  display: flex;
  flex-direction: column; /* Changed to column for better responsiveness */
  gap: 16px;
  margin-top: 40px;
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