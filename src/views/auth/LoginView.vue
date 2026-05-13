<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-logo">
        <span>🏥</span>
        <h1>MedQueue</h1>
      </div>

      <h2>Iniciar sesión</h2>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Email</label>
          <input v-model="form.email" type="email" placeholder="tu@email.com" required />
        </div>

        <div class="form-group">
          <label>Contraseña</label>
          <input v-model="form.password" type="password" placeholder="••••••" required />
        </div>

        <p v-if="error" class="error">{{ error }}</p>

        <button type="submit" :disabled="loading">
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>

      <p class="auth-footer">
        ¿No tienes cuenta?
        <router-link to="/register">Regístrate</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const form = ref({ email: '', password: '' })
const error = ref(null)
const loading = ref(false)

async function handleLogin() {
  error.value = null
  loading.value = true
  try {
    await auth.login(form.value)
    router.push(auth.isDoctor ? '/doctor' : '/patient')
  } catch (e) {
    error.value = 'Email o contraseña incorrectos'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f9ff;
}
.auth-card {
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  width: 100%;
  max-width: 400px;
}
.auth-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
}
.auth-logo span { font-size: 2rem; }
.auth-logo h1 { margin: 0; font-size: 1.5rem; color: #0ea5e9; }
h2 { margin: 0 0 24px; color: #1e293b; font-size: 1.1rem; }
.form-group { margin-bottom: 16px; }
.form-group label { display: block; margin-bottom: 6px; font-size: 0.875rem; color: #475569; font-weight: 500; }
.form-group input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.95rem;
  box-sizing: border-box;
  transition: border-color 0.2s;
}
.form-group input:focus { outline: none; border-color: #0ea5e9; }
button {
  width: 100%;
  padding: 12px;
  background: #0ea5e9;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 8px;
  transition: background 0.2s;
}
button:hover:not(:disabled) { background: #0284c7; }
button:disabled { opacity: 0.6; cursor: not-allowed; }
.error { color: #ef4444; font-size: 0.875rem; margin: 8px 0; }
.auth-footer { text-align: center; margin-top: 20px; font-size: 0.875rem; color: #64748b; }
.auth-footer a { color: #0ea5e9; text-decoration: none; font-weight: 500; }
</style>