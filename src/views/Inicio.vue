<!-- filepath: c:\Users\AaronZumarraga\Downloads\tareas\src\views\Inicio.vue -->
<script setup lang="ts">
import PageTitle from '../components/PageTitle.vue'
import PageSection from '../components/PageSection.vue'
</script>

<template>
  <PageSection max-width="600px" padding="50px 40px">
    <PageTitle 
      title="Bienvenido" 
      subtitle="Gestiona tus tareas de forma simple" 
    />
    <div class="features">
      <div class="feature-item">Simple</div>
      <div class="feature-item">Efectivo</div>
      <div class="feature-item">Rápido</div>
    </div>
  </PageSection>
</template>

<style scoped>
.features {
  display: flex;
  flex-wrap: wrap;
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
  flex: 1 1 100px;
}

@media (max-width: 768px) {
  .inicio {
    padding-top: 40px;
    padding-bottom: 30px;
  }
}
</style>