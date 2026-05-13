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
        <h2>Citas del día</h2>
        <div class="stats">
          <div class="stat">
            <span class="stat__number">{{ pendingCount }}</span>
            <span class="stat__label">Pendientes</span>
          </div>
          <div class="stat">
            <span class="stat__number">{{ confirmedCount }}</span>
            <span class="stat__label">Confirmadas</span>
          </div>
        </div>
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
      <div v-else-if="appointments.length === 0" class="state">No hay citas {{ activeFilter !== 'all' ? 'con ese estado' : '' }}</div>

      <div v-else class="appointments">
        <app-card v-for="apt in appointments" :key="apt.id">
          <div class="apt">
            <div class="apt__info">
              <div class="apt__patient">
                <span class="apt__name">{{ apt.patient?.name }}</span>
                <status-badge :status="apt.status" />
              </div>
              <p>📅 {{ formatDate(apt.date) }} a las {{ apt.time }}</p>
              <p>📋 {{ apt.reason }}</p>
              <p v-if="apt.notes">📝 {{ apt.notes }}</p>
            </div>

            <div v-if="apt.status === 'pending' || apt.status === 'confirmed'" class="apt__actions">
              <button
                v-if="apt.status === 'pending'"
                class="btn btn--confirm"
                @click="updateStatus(apt, 'confirmed')"
              >
                Confirmar
              </button>
              <button
                v-if="apt.status === 'confirmed'"
                class="btn btn--complete"
                @click="updateStatus(apt, 'completed')"
              >
                Completar
              </button>
              <button
                class="btn btn--cancel"
                @click="updateStatus(apt, 'cancelled')"
              >
                Cancelar
              </button>
            </div>
          </div>
        </app-card>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
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

const pendingCount = computed(() => appointments.value.filter(a => a.status === 'pending').length)
const confirmedCount = computed(() => appointments.value.filter(a => a.status === 'confirmed').length)

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

async function updateStatus(apt, status) {
  await appointmentService.update(apt.id, { status })
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
.stats { display: flex; gap: 16px; }
.stat {
  background: white;
  border-radius: 10px;
  padding: 10px 20px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
}
.stat__number { display: block; font-size: 1.5rem; font-weight: 700; color: #0ea5e9; }
.stat__label { font-size: 0.75rem; color: #94a3b8; }
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
.apt { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
.apt__info { flex: 1; }
.apt__patient { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
.apt__name { font-weight: 600; color: #1e293b; }
.apt__info p { margin: 0 0 6px; font-size: 0.9rem; color: #475569; }
.apt__actions { display: flex; flex-direction: column; gap: 8px; }
.state { text-align: center; padding: 48px; color: #94a3b8; }
.btn {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
  white-space: nowrap;
}
.btn--outline { background: white; color: #475569; border: 1px solid #e2e8f0; }
.btn--outline:hover { border-color: #94a3b8; }
.btn--confirm { background: #d1fae5; color: #065f46; }
.btn--confirm:hover { background: #a7f3d0; }
.btn--complete { background: #dbeafe; color: #1e40af; }
.btn--complete:hover { background: #bfdbfe; }
.btn--cancel { background: #fee2e2; color: #991b1b; }
.btn--cancel:hover { background: #fecaca; }
</style>