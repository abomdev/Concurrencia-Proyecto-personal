<template>
  <div class="horarios-lista">
    <p v-if="cargando" class="hint">Cargando horarios...</p>
    <p v-else-if="horarios.length === 0" class="hint">No hay horarios disponibles para esta película.</p>

    <button
      v-for="horario in horarios"
      :key="horario.id"
      type="button"
      class="horario-btn"
      @click="$emit('elegir', horario)"
    >
      <span class="horario-sala">{{ horario.sala }}</span>
      <span class="horario-hora">{{ horario.horario }}</span>
    </button>
  </div>
</template>

<script setup>
defineProps({
  horarios: {
    type: Array,
    required: true,
  },
  cargando: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['elegir'])
</script>
