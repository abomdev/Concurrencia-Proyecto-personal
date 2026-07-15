<template>
  <button class="pelicula-card" @click="$emit('elegir', pelicula)">
    <div class="pelicula-poster">
      <img
        v-if="pelicula.poster && !posterFallo"
        :src="pelicula.poster"
        :alt="pelicula.nombre"
        class="pelicula-poster-img"
        @error="posterFallo = true"
      />
      <div v-else class="pelicula-poster-fallback">
        <span>{{ pelicula.nombre }}</span>
      </div>
      <span v-if="pelicula.duracion_minutos" class="pelicula-duracion">{{ pelicula.duracion_minutos }} min</span>
    </div>

    <div class="pelicula-info">
      <h2 class="pelicula-nombre">{{ pelicula.nombre }}</h2>
      <p class="pelicula-badges">
        <span v-if="pelicula.genero" class="badge badge-genero">{{ pelicula.genero }}</span>
        <span v-if="pelicula.clasificacion" class="badge badge-clasificacion">{{ pelicula.clasificacion }}</span>
      </p>
    </div>
  </button>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  pelicula: {
    type: Object,
    required: true,
  },
})

defineEmits(['elegir'])

const posterFallo = ref(false)
</script>
