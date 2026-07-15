<template>
  <header class="app-header">
    <div class="app-header-inner">
      <span class="app-logo">Concurrencia</span>
      <nav class="app-nav">
        <button type="button" @click="$emit('ir-a-cartelera')">Cartelera</button>
        <button type="button">Promociones</button>
        <button type="button">Cines</button>
      </nav>
    </div>
  </header>
</template>

<script setup>
defineEmits(['ir-a-cartelera'])
</script>
