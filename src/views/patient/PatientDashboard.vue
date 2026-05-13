<template>
  <div class="page">
    <header class="header">
      <div class="header__brand">
        <span>🏥</span>
        <h1>MedQueue</h1>
      </div>
      <div class="header__user">
        <span>{{ auth.user.name }}</span>
        <button class="btn btn--outline" @click="handleLogout">Cerrar sesión</button>
      </div>
    </header>

    <main class="container">
      <div class="page-title">
        <h2>Mis citas</h2>
        <router-link to="/patient/new" class="btn btn--primary">+ Nueva cita</router-link>
      </div>

      <div class="filters">
        <button
          v-for="f in filters"
          :key="f.value"
          :class="['filter-btn', { active: activeFilter === f.value }]"
          @click="setFilter(f.value)"
        >
          {{ f.label }}
        </button>
      </div>

      <div v-if="loading" class="state">Cargando citas...</div>
      <div v-else-if="appointments.length === 0" class="state">No tienes citas {{ activeFilter !== 'all' ? 'con ese estado' : '' }}</div>

      <div v-else class="appointments">
        <app-card
          v-for="apt in appointments"
          :key="apt.id"
          :title="apt.doctor?.name || 'Médico'"
        >
          <div class="apt">
            <div class="apt__info">
              <p>📅 {{ formatDate(apt.date) }} a las {{ apt.time }}</p>
              <p>📋 {{ apt.reason }}</p>
              <p v-if="apt.notes">📝 {{ apt.notes }}</p>
            </div>
            <status-badge :status="apt.status" />
          </div>
        </app-card>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { appointmentService } from '../../services/appointments'
import AppCard from '../../components/ui/AppCard.vue'
import StatusBadge from '../../components/ui/StatusBadge.vue'

const router = useRouter()
const auth = useAuthStore()

const appointments = ref([])
const loading = ref(false)
const activeFilter = ref('all')

const filters = [
  { label: 'Todas', value: 'all' },
  { label: 'Pendientes', value: 'pending' },
  { label: 'Confirmadas', value: 'confirmed' },
  { label: 'Completadas', value: 'completed' },
  { label: 'Canceladas', value: 'cancelled' },
]

async function loadAppointments() {
  loading.value = true
  try {
    appointments.value = await appointmentService.getAll(
      activeFilter.value !== 'all' ? activeFilter.value : null
    )
  } finally {
    loading.value = false
  }
}

async function setFilter(value) {
  activeFilter.value = value
  await loadAppointments()
}

async function handleLogout() {
  await auth.logout()
  router.push('/login')
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('es-ES', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })
}

onMounted(loadAppointments)
</script>

<style scoped>
.page { min-height: 100vh; background: #f0f9ff; }
.header {
  background: white;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}
.header__brand { display: flex; align-items: center; gap: 10px; }
.header__brand span { font-size: 1.5rem; }
.header__brand h1 { margin: 0; font-size: 1.2rem; color: #0ea5e9; }
.header__user { display: flex; align-items: center; gap: 16px; font-size: 0.9rem; color: #475569; }
.container { max-width: 800px; margin: 0 auto; padding: 32px 24px; }
.page-title { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.page-title h2 { margin: 0; color: #1e293b; }
.filters { display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap; }
.filter-btn {
  padding: 6px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  background: white;
  cursor: pointer;
  font-size: 0.875rem;
  color: #475569;
  transition: all 0.2s;
}
.filter-btn.active { background: #0ea5e9; color: white; border-color: #0ea5e9; }
.appointments { display: flex; flex-direction: column; gap: 16px; }
.apt { display: flex; justify-content: space-between; align-items: flex-start; }
.apt__info p { margin: 0 0 6px; font-size: 0.9rem; color: #475569; }
.apt__info p:last-child { margin-bottom: 0; }
.state { text-align: center; padding: 48px; color: #94a3b8; }
.btn {
  padding: 8px 18px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  border: none;
  transition: all 0.2s;
}
.btn--primary { background: #0ea5e9; color: white; }
.btn--primary:hover { background: #0284c7; }
.btn--outline { background: white; color: #475569; border: 1px solid #e2e8f0; }
.btn--outline:hover { border-color: #94a3b8; }
</style>