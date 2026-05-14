# MedQueue App 🏥

Frontend para la gestión de citas médicas, construido con Vue 3 y Vite.

## 🚀 Demo en producción

- **Frontend:** https://medqueue-app-example.netlify.app
- **API:** https://medqueue-api.onrender.com

## Stack Técnico

- **Framework:** Vue 3 (Composition API)
- **Router:** Vue Router 4
- **Estado global:** Pinia
- **HTTP Client:** Axios
- **Build tool:** Vite

## Decisiones técnicas

- **Composition API sobre Options API:** Mejor organización del código, lógica más reutilizable y tipado más sencillo si se migra a TypeScript.
- **Pinia sobre Vuex:** API más simple y moderna, mejor soporte con Vue 3 y DevTools.
- **Axios interceptors:** El token se inyecta automáticamente en cada petición y los 401 redirigen al login sin tener que gestionarlo en cada vista.
- **Router guards:** La protección de rutas está centralizada en el router, separando la lógica de autenticación de los componentes.
- **Componentes UI reutilizables:** `AppCard` y `StatusBadge` son componentes genéricos que se usan en múltiples vistas, evitando duplicación de estilos.

## Estructura del proyecto

src/
├── components/
│   └── ui/
│       ├── AppCard.vue       # Tarjeta reutilizable
│       └── StatusBadge.vue   # Badge de estado de cita
├── services/
│   ├── api.js                # Instancia de Axios con interceptors
│   ├── auth.js               # Llamadas de autenticación
│   └── appointments.js       # Llamadas de citas
├── stores/
│   └── auth.js               # Store de Pinia para autenticación
├── router/
│   └── index.js              # Rutas y guards
└── views/
├── auth/
│   ├── LoginView.vue
│   └── RegisterView.vue
├── patient/
│   ├── PatientDashboard.vue
│   └── NewAppointment.vue
└── doctor/
└── DoctorDashboard.vue


## Funcionalidades

### Paciente
- Login y registro con selección de rol
- Ver listado de citas con filtros por estado
- Crear nueva cita seleccionando médico, fecha y hora
- Ver detalle de cada cita

### Médico
- Dashboard con contador de citas pendientes y confirmadas
- Ver listado de citas de sus pacientes
- Confirmar, completar o cancelar citas
- Filtrar citas por estado

## Instalación local

### Requisitos
- Node 20+
- Docker (opcional)

### Con Docker

```bash
# 1. Clona el repositorio
git clone https://github.com/AdrianRomeroRamirez/medqueue-app.git
cd medqueue-app

# 2. Instala dependencias
docker run --rm -it -v $(pwd):/app -w /app node:20 npm install

# 3. Inicia el servidor de desarrollo
docker run --rm -it -v $(pwd):/app -w /app -p 5173:5173 node:20 npm run dev -- --host
```

### Sin Docker

```bash
npm install
npm run dev
```

La app estará disponible en http://localhost:5173

### Variables de entorno

Crea un archivo `.env` en la raíz:

```env
VITE_API_URL=http://localhost:8000/api
```

### Usuarios de prueba

| Email | Password | Rol |
|-------|----------|-----|
| garcia@medqueue.com | password | Médico |
| martinez@medqueue.com | password | Médico |
| adrian@medqueue.com | password | Paciente |
| laura@medqueue.com | password | Paciente |

## Qué mejoraría con más tiempo

- Notificaciones en tiempo real con WebSockets (Laravel Echo + Pusher)
- Tests con Vitest y Vue Testing Library
- Modo oscuro
- Vista de calendario para las citas
- PWA para acceso desde móvil
- Migración a TypeScript