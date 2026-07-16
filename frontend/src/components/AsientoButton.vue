<template>
  <button
    class="asiento"
    :class="{
      'asiento-reservado': asiento.estado === 'reservado',
      'asiento-seleccionado': seleccionado,
      'asiento-preferencial': asiento.tipo === 'Preferencial',
    }"
    :disabled="asiento.estado === 'reservado'"
    @click="$emit('seleccionar', asiento)"
  >
    {{ asiento.fila }}{{ asiento.numero }}
  </button>
</template>

<script setup>
defineProps({
  asiento: {
    type: Object,
    required: true,
  },
  seleccionado: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['seleccionar'])
</script>
