<!-- filepath: c:\Users\AaronZumarraga\Downloads\tareas\src\components\WelcomeGuest.vue -->
<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="welcome-guest">
    <!-- Sección de Bienvenida -->
    <div class="welcome-section">
      <h2 class="welcome-title">Bienvenido a TaskManager</h2>
      <p class="welcome-subtitle">Tu herramienta simple y efectiva para gestionar tareas diarias</p>
    </div>

    <!-- Pasos para usar la app -->
    <div class="steps-section">
      <h3 class="section-title">¿Cómo usar TaskManager?</h3>
      <div class="steps-grid">
        <div class="step-card">
          <div class="step-number">1</div>
          <h4>Regístrate</h4>
          <p>Crea una cuenta con tu correo electrónico en menos de un minuto</p>
        </div>
        <div class="step-card">
          <div class="step-number">2</div>
          <h4>Agrega Tareas</h4>
          <p>Crea tareas con título, descripción, prioridad y fecha de vencimiento</p>
        </div>
        <div class="step-card">
          <div class="step-number">3</div>
          <h4>Organiza</h4>
          <p>Asigna estados y prioridades para mantener el control</p>
        </div>
        <div class="step-card">
          <div class="step-number">4</div>
          <h4>Completa</h4>
          <p>Marca tareas como completadas y ve tu progreso en tiempo real</p>
        </div>
      </div>
    </div>

    <!-- Beneficios principales -->
    <div class="benefits-section">
      <h3 class="section-title">Beneficios Principales</h3>
      <div class="benefits-list">
        <div class="benefit-item">
          <span class="benefit-icon">⚡</span>
          <div class="benefit-content">
            <h4>Rápido y Simple</h4>
            <p>Interfaz intuitiva diseñada para no perder tiempo configurando</p>
          </div>
        </div>
        <div class="benefit-item">
          <span class="benefit-icon">📊</span>
          <div class="benefit-content">
            <h4>Visualiza tu Progreso</h4>
            <p>Estadísticas en tiempo real de tus tareas completadas</p>
          </div>
        </div>
        <div class="benefit-item">
          <span class="benefit-icon">🎯</span>
          <div class="benefit-content">
            <h4>Prioridades Claras</h4>
            <p>Define qué es importante y evita distracciones innecesarias</p>
          </div>
        </div>
        <div class="benefit-item">
          <span class="benefit-icon">📱</span>
          <div class="benefit-content">
            <h4>Accesible en Cualquier Lugar</h4>
            <p>Gestiona tus tareas desde cualquier dispositivo</p>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA -->
    <div class="cta-section">
      <p class="cta-text">¿Listo para comenzar?</p>
      <RouterLink to="/iniciar-sesion" class="cta-button">
        Crear Cuenta / Iniciar Sesión
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.welcome-guest {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

/* Sección de Bienvenida */
.welcome-section {
  text-align: center;
  padding: 20px 0;
}

.welcome-title {
  color: #1e293b;
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 12px;
}

.welcome-subtitle {
  color: #64748b;
  font-size: 1.1rem;
  line-height: 1.6;
}

/* Sección de Pasos */
.steps-section {
  padding: 0;
}

.section-title {
  color: #1e293b;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 24px;
  text-align: center;
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}

.step-card {
  padding: 28px 20px;
  background: white;
  border: 2px solid rgba(37, 99, 235, 0.1);
  border-radius: 14px;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.step-card:hover {
  border-color: #2563eb;
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.15);
  transform: translateY(-4px);
}

.step-number {
  width: 48px;
  height: 48px;
  margin: 0 auto 16px;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  font-weight: 700;
}

.step-card h4 {
  color: #1e293b;
  font-size: 1.1rem;
  margin-bottom: 8px;
  font-weight: 600;
}

.step-card p {
  color: #64748b;
  font-size: 0.9rem;
  line-height: 1.6;
}

/* Sección de Beneficios */
.benefits-section {
  padding: 0;
}

.benefits-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.benefit-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  border-left: 4px solid #2563eb;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.benefit-item:hover {
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.1);
  transform: translateX(4px);
}

.benefit-icon {
  font-size: 1.8rem;
  flex-shrink: 0;
  line-height: 1;
}

.benefit-content h4 {
  color: #1e293b;
  font-size: 1rem;
  margin-bottom: 4px;
  font-weight: 600;
}

.benefit-content p {
  color: #64748b;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
}

/* CTA Section */
.cta-section {
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(29, 78, 216, 0.08) 100%);
  border-radius: 14px;
}

.cta-text {
  color: #1e293b;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 16px;
}

.cta-button {
  display: inline-block;
  padding: 14px 32px;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: white;
  text-decoration: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.35);
}

.cta-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.45);
}

/* Responsive */
@media (max-width: 768px) {
  .welcome-guest {
    gap: 30px;
  }

  .welcome-title {
    font-size: 1.8rem;
  }

  .welcome-subtitle {
    font-size: 1rem;
  }

  .section-title {
    font-size: 1.3rem;
    margin-bottom: 16px;
  }

  .steps-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .step-card {
    padding: 20px 16px;
  }

  .benefit-item {
    padding: 16px;
    gap: 12px;
  }

  .benefit-icon {
    font-size: 1.5rem;
  }
}
</style>