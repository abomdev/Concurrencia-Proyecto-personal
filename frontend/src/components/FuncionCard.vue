<template>
  <button class="funcion-card" @click="$emit('elegir', funcion)">
    <div class="funcion-poster">
      <img
        v-if="funcion.poster && !posterFallo"
        :src="funcion.poster"
        :alt="funcion.pelicula"
        class="funcion-poster-img"
        @error="posterFallo = true"
      />
      <div v-else class="funcion-poster-fallback">
        <span>{{ funcion.pelicula }}</span>
      </div>
      <span v-if="funcion.duracion_minutos" class="funcion-duracion">{{ funcion.duracion_minutos }} min</span>
    </div>

    <div class="funcion-info">
      <h2 class="funcion-pelicula">{{ funcion.pelicula }}</h2>
      <p class="funcion-detalle">{{ funcion.sala }} - {{ funcion.horario }}</p>
    </div>
  </button>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  funcion: {
    type: Object,
    required: true,
  },
})

defineEmits(['elegir'])

const posterFallo = ref(false)
</script>
