<template>
  <span :class="['badge', `badge--${status}`]">
    {{ label }}
  </span>
</template>

<script setup>
const props = defineProps({
  status: {
    type: String,
    required: true,
  },
})

const labels = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  completed: 'Completada',
  cancelled: 'Cancelada',
}

const label = labels[props.status] || props.status
</script>

<style scoped>
.badge {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.badge--pending   { background: #fef3c7; color: #92400e; }
.badge--confirmed { background: #d1fae5; color: #065f46; }
.badge--completed { background: #dbeafe; color: #1e40af; }
.badge--cancelled { background: #fee2e2; color: #991b1b; }
</style>