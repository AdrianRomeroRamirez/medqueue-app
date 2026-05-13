<template>
  <div class="page">
    <header class="header">
      <div class="header__brand">
        <span>🏥</span>
        <h1>MedQueue</h1>
      </div>
      <router-link to="/patient" class="btn btn--outline">← Volver</router-link>
    </header>

    <main class="container">
      <h2>Nueva cita</h2>

      <app-card>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label>Médico</label>
            <select v-model="form.doctor_id" required>
              <option value="">Selecciona un médico</option>
              <option v-for="doctor in doctors" :key="doctor.id" :value="doctor.id">
                {{ doctor.name }}
              </option>
            </select>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Fecha</label>
              <input v-model="form.date" type="date" :min="minDate" required />
            </div>

            <div class="form-group">
              <label>Hora</label>
              <input v-model="form.time" type="time" required />
            </div>
          </div>

          <div class="form-group">
            <label>Motivo de la consulta</label>
            <input v-model="form.reason" type="text" placeholder="Describe el motivo de tu visita" required />
          </div>

          <div class="form-group">
            <label>Notas adicionales <span class="optional">(opcional)</span></label>
            <textarea v-model="form.notes" placeholder="Información adicional para el médico..." rows="3" />
          </div>

          <p v-if="error" class="error">{{ error }}</p>

          <div class="form-actions">
            <router-link to="/patient" class="btn btn--outline">Cancelar</router-link>
            <button type="submit" class="btn btn--primary" :disabled="loading">
              {{ loading ? 'Guardando...' : 'Solicitar cita' }}
            </button>
          </div>
        </form>
      </app-card>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { appointmentService } from '../../services/appointments'
import AppCard from '../../components/ui/AppCard.vue'

const router = useRouter()

const doctors = ref([])
const loading = ref(false)
const error = ref(null)

const minDate = new Date(Date.now() + 86400000).toISOString().split('T')[0]

const form = ref({
  doctor_id: '',
  date: '',
  time: '',
  reason: '',
  notes: '',
})

async function handleSubmit() {
  error.value = null
  loading.value = true
  try {
    await appointmentService.create(form.value)
    router.push('/patient')
  } catch (e) {
    error.value = e.response?.data?.message || 'Error al crear la cita'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  doctors.value = await appointmentService.getDoctors()
})
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
.container { max-width: 600px; margin: 0 auto; padding: 32px 24px; }
h2 { margin: 0 0 24px; color: #1e293b; }
.form-group { margin-bottom: 20px; }
.form-group label { display: block; margin-bottom: 6px; font-size: 0.875rem; color: #475569; font-weight: 500; }
.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  box-sizing: border-box;
  transition: border-color 0.2s;
  background: white;
  font-family: inherit;
}
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus { outline: none; border-color: #0ea5e9; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.optional { color: #94a3b8; font-weight: 400; }
.form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 8px; }
.error { color: #ef4444; font-size: 0.875rem; margin: 8px 0; }
.btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  border: none;
  transition: all 0.2s;
  display: inline-block;
}
.btn--primary { background: #0ea5e9; color: white; }
.btn--primary:hover:not(:disabled) { background: #0284c7; }
.btn--primary:disabled { opacity: 0.6; cursor: not-allowed; }
.btn--outline { background: white; color: #475569; border: 1px solid #e2e8f0; }
.btn--outline:hover { border-color: #94a3b8; }
</style>