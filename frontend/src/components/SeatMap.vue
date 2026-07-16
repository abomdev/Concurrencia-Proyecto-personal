<template>
  <div class="seat-map">
    <div class="pantalla">Pantalla</div>

    <div v-for="fila in filas" :key="fila" class="seat-row">
      <span class="fila-label">{{ fila }}</span>
      <AsientoButton
        v-for="asiento in asientosPorFila[fila]"
        :key="asiento.id"
        :asiento="asiento"
        :seleccionado="asiento.id === asientoSeleccionadoId"
        @seleccionar="$emit('seleccionar', asiento)"
      />
    </div>

    <div class="leyenda">
      <span><span class="muestra muestra-disponible"></span> Disponible</span>
      <span><span class="muestra muestra-seleccionado"></span> Seleccionado</span>
      <span><span class="muestra muestra-reservado"></span> Reservado</span>
    </div>

    <div class="leyenda">
      <span v-if="precioRegular"><span class="muestra muestra-regular"></span> Regular (${{ precioRegular.toLocaleString('es-CL') }})</span>
      <span v-if="precioPreferencial"><span class="muestra muestra-preferencial"></span> Preferencial (${{ precioPreferencial.toLocaleString('es-CL') }})</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import AsientoButton from './AsientoButton.vue'

const props = defineProps({
  asientos: {
    type: Array,
    required: true,
  },
  asientoSeleccionadoId: {
    type: Number,
    default: null,
  },
})

defineEmits(['seleccionar'])

const filas = computed(() => [...new Set(props.asientos.map((a) => a.fila))].sort())

const asientosPorFila = computed(() => {
  const grupos = {}
  for (const asiento of props.asientos) {
    if (!grupos[asiento.fila]) grupos[asiento.fila] = []
    grupos[asiento.fila].push(asiento)
  }
  return grupos
})

const precioRegular = computed(() => props.asientos.find((a) => a.tipo === 'Regular')?.precio)
const precioPreferencial = computed(
  () => props.asientos.find((a) => a.tipo === 'Preferencial')?.precio,
)
</script>
