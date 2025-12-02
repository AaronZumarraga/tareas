<!-- filepath: c:\Users\AaronZumarraga\Downloads\tareas\src\views\Tareas.vue -->
<script setup lang="ts">
</script>

<template>
  <div class="tareas">
    <div class="glass-card">
      <h1>Mis Tareas</h1>
      <p class="subtitle">Organiza tu día</p>
      <div class="task-input">
        <input type="text" placeholder="Agregar nueva tarea..." />
        <button>Agregar</button>
      </div>
      <div class="task-list">
        <p class="empty-state">No hay tareas aún</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ESTILOS LOCALES - Solo para vista Tareas */
.tareas {
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
  margin-bottom: 30px;
}

.task-input {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
}

.task-input input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.6);
  color: #1e293b;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.2s;
}

.task-input input:focus {
  border-color: #2563eb;
  background: white;
}

.task-input button {
  padding: 12px 24px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.task-input button:hover {
  background: #1d4ed8;
}

.task-list {
  min-height: 200px;
  padding: 20px 0;
}

.empty-state {
  text-align: center;
  color: #94a3b8;
  padding: 40px 20px;
  font-size: 0.95rem;
}
</style>