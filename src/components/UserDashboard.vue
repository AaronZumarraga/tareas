<script setup lang="ts">
import { computed } from 'vue'
import { useAuth } from '../composables/useAuth'

interface Props {
  total: number
  active: number
  completed: number
}

const props = defineProps<Props>()
const { user } = useAuth()

const completionRate = computed(() => {
  if (props.total === 0) return 0
  return Math.round((props.completed / props.total) * 100)
})

const motivationalMessage = computed(() => {
  const rate = completionRate.value
  if (rate === 0) return '¡Comienza agregando una tarea!'
  if (rate < 25) return '¡Buen inicio! Sigue adelante'
  if (rate < 50) return '¡Vas por buen camino!'
  if (rate < 75) return '¡Casi la mitad! Sigue así'
  if (rate < 100) return '¡Ya casi terminas!'
  return '¡Felicidades! ¡Todas tus tareas completadas!'
})
</script>

<template>
  <div class="user-dashboard">
    <!-- Saludo personalizado -->
    <div class="greeting-section">
      <h2 class="greeting-title">
        👋 ¡Hola, <span class="user-name">{{ user?.nombre }}</span>!
      </h2>
      <p class="greeting-subtitle">Aquí está tu resumen de productividad</p>
    </div>

    <!-- Tarjeta de progreso principal -->
    <div class="progress-card">
      <div class="progress-content">
        <div class="progress-text">
          <h3>Tu Progreso Hoy</h3>
          <p class="completion-rate">{{ completionRate }}% Completado</p>
          <p class="motivational-msg">{{ motivationalMessage }}</p>
        </div>
        <div class="progress-visual">
          <div class="progress-circle">
            <svg viewBox="0 0 120 120" class="progress-svg">
              <circle cx="60" cy="60" r="54" class="progress-bg" />
              <circle 
                cx="60" 
                cy="60" 
                r="54" 
                class="progress-fill"
                :style="{ 
                  strokeDasharray: `${(completionRate / 100) * 339.29} 339.29`
                }"
              />
            </svg>
            <div class="progress-percent">{{ completionRate }}%</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Grid de estadísticas -->
    <div class="stats-grid">
      <div class="stat-card stat-total">
        <div class="stat-icon">📋</div>
        <div class="stat-info">
          <p class="stat-value">{{ total }}</p>
          <p class="stat-label">Tareas Totales</p>
        </div>
      </div>

      <div class="stat-card stat-active">
        <div class="stat-icon">🚀</div>
        <div class="stat-info">
          <p class="stat-value">{{ active }}</p>
          <p class="stat-label">En Progreso</p>
        </div>
      </div>

      <div class="stat-card stat-completed">
        <div class="stat-icon">✅</div>
        <div class="stat-info">
          <p class="stat-value">{{ completed }}</p>
          <p class="stat-label">Completadas</p>
        </div>
      </div>
    </div>

    <!-- Consejo motivacional -->
    <div class="tip-section">
      <div class="tip-card">
        <span class="tip-icon">💡</span>
        <div class="tip-content">
          <h4>Consejo</h4>
          <p>Prioriza tus tareas según urgencia e importancia. Esto te ayudará a ser más productivo.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-dashboard {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

/* Sección de Saludo */
.greeting-section {
  text-align: center;
  padding: 20px 0;
}

.greeting-title {
  color: #1e293b;
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 8px;
}

.user-name {
  color: #2563eb;
  font-weight: 700;
}

.greeting-subtitle {
  color: #64748b;
  font-size: 1rem;
  margin: 0;
}

/* Tarjeta de Progreso */
.progress-card {
  padding: 32px;
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.06) 0%, rgba(29, 78, 216, 0.06) 100%);
  border: 2px solid rgba(37, 99, 235, 0.2);
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(37, 99, 235, 0.08);
}

.progress-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
}

.progress-text h3 {
  color: #1e293b;
  font-size: 1.3rem;
  margin: 0 0 12px 0;
  font-weight: 600;
}

.completion-rate {
  color: #2563eb;
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.motivational-msg {
  color: #64748b;
  font-size: 0.95rem;
  margin: 0;
  font-style: italic;
}

/* Círculo de Progreso */
.progress-visual {
  flex-shrink: 0;
}

.progress-circle {
  position: relative;
  width: 140px;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.progress-bg {
  fill: none;
  stroke: rgba(0, 0, 0, 0.08);
  stroke-width: 8;
}

.progress-fill {
  fill: none;
  stroke: url(#progressGradient);
  stroke-width: 8;
  stroke-linecap: round;
  transition: stroke-dasharray 0.6s ease;
}

.progress-percent {
  position: absolute;
  font-size: 2rem;
  font-weight: 700;
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Grid de Estadísticas */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stat-card {
  padding: 20px;
  background: white;
  border-radius: 12px;
  border: 2px solid rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.stat-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 2rem;
  line-height: 1;
  flex-shrink: 0;
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  color: #1e293b;
}

.stat-label {
  font-size: 0.85rem;
  color: #64748b;
  margin: 0;
  font-weight: 500;
}

.stat-total .stat-value {
  color: #2563eb;
}

.stat-active .stat-value {
  color: #f59e0b;
}

.stat-completed .stat-value {
  color: #10b981;
}

/* Sección de Consejo */
.tip-section {
  padding: 0;
}

.tip-card {
  padding: 20px;
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.06) 0%, rgba(34, 197, 94, 0.03) 100%);
  border: 2px solid rgba(34, 197, 94, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.tip-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
  margin-top: 2px;
}

.tip-content h4 {
  color: #10b981;
  font-size: 1rem;
  margin: 0 0 4px 0;
  font-weight: 600;
}

.tip-content p {
  color: #64748b;
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.5;
}

/* Responsive */
@media (max-width: 768px) {
  .user-dashboard {
    gap: 20px;
  }

  .greeting-title {
    font-size: 1.5rem;
  }

  .progress-card {
    padding: 20px;
  }

  .progress-content {
    flex-direction: column;
    gap: 20px;
  }

  .progress-circle {
    width: 120px;
    height: 120px;
  }

  .progress-percent {
    font-size: 1.6rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .stat-card {
    padding: 16px;
  }

  .stat-value {
    font-size: 1.5rem;
  }

  .stat-icon {
    font-size: 1.8rem;
  }
}
</style>
