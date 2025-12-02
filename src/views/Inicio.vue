<!-- filepath: c:\Users\AaronZumarraga\Downloads\tareas\src\views\Inicio.vue -->
<script setup lang="ts">
import GlassCard from '../components/GlassCard.vue'
import PageTitle from '../components/PageTitle.vue'
</script>

<template>
  <div class="inicio">
    <GlassCard max-width="600px" padding="50px 40px">
      <PageTitle 
        title="Bienvenido" 
        subtitle="Gestiona tus tareas de forma simple" 
      />
      <div class="features">
        <div class="feature-item">Simple</div>
        <div class="feature-item">Efectivo</div>
        <div class="feature-item">Rápido</div>
      </div>
    </GlassCard>
  </div>
</template>

<style scoped>
.inicio {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 60px;
  flex-direction: column; /* Changed to column for better responsiveness */
}

.features {
  display: flex;
  flex-wrap: wrap; /* Allow wrapping for smaller screens */
  gap: 16px;
  justify-content: center;
  margin-top: 40px;
}

.feature-item {
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  font-size: 0.9rem;
  color: #475569;
  font-weight: 500;
  flex: 1 1 100px; /* Allow items to grow and shrink */
}
</style>