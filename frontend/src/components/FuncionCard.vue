<template>
  <button class="funcion-card" @click="$emit('elegir', funcion)">
    <h2 class="funcion-pelicula">{{ funcion.pelicula }}</h2>
    <p class="funcion-detalle">{{ funcion.sala }} - {{ funcion.horario }}</p>
  </button>
</template>

<script setup>
defineProps({
  funcion: {
    type: Object,
    required: true,
  },
})

defineEmits(['elegir'])
</script>
