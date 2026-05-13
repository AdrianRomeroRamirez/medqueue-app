<template>
  <div class="card">
    <div v-if="title" class="card__header">
      <h3 class="card__title">{{ title }}</h3>
    </div>
    <div class="card__body">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: null,
  },
})
</script>

<style scoped>
.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
  overflow: hidden;
}
.card__header {
  padding: 16px 20px;
  border-bottom: 1px solid #f1f5f9;
}
.card__title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
}
.card__body {
  padding: 20px;
}
</style>