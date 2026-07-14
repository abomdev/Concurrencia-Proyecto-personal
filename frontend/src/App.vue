<template>
  <main class="container">
    <header class="header">
      <h1>Boletería de Cine</h1>
      <p class="subtitle">Elige tu función y reserva un asiento.</p>
    </header>

    <section v-if="!funcionSeleccionada" class="view">
      <p v-if="cargandoFunciones" class="hint">Cargando funciones...</p>
      <p v-else-if="errorFunciones" class="error-banner">{{ errorFunciones }}</p>

      <div v-else class="funciones-grid">
        <FuncionCard
          v-for="funcion in funciones"
          :key="funcion.id"
          :funcion="funcion"
          @elegir="elegirFuncion"
        />
      </div>
    </section>

    <section v-else class="view">
      <button class="btn-link" @click="volverAFunciones">&larr; Volver a funciones</button>

      <h2 class="funcion-titulo">{{ funcionSeleccionada.pelicula }}</h2>
      <p class="funcion-detalle">{{ funcionSeleccionada.sala }} - {{ funcionSeleccionada.horario }}</p>

      <p v-if="cargandoAsientos" class="hint">Cargando asientos...</p>

      <SeatMap
        v-else
        :asientos="asientos"
        :asiento-seleccionado-id="asientoSeleccionadoId"
        @seleccionar="seleccionarAsiento"
      />

      <div class="reserva-panel">
        <label class="field">
          <span>Nombre del comprador</span>
          <input v-model.trim="nombreComprador" type="text" placeholder="Tu nombre" />
        </label>

        <button
          class="btn btn-primary"
          :disabled="!asientoSeleccionadoId || !nombreComprador || reservando"
          @click="confirmarReserva"
        >
          {{ reservando ? 'Reservando...' : 'Reservar' }}
        </button>

        <p v-if="mensaje" class="mensaje" :class="{ 'mensaje-error': !mensajeExito }">
          {{ mensaje }}
        </p>
      </div>
    </section>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useFunciones } from '@/composables/useFunciones'
import { useAsientos } from '@/composables/useAsientos'
import FuncionCard from '@/components/FuncionCard.vue'
import SeatMap from '@/components/SeatMap.vue'

const {
  funciones,
  cargando: cargandoFunciones,
  error: errorFunciones,
  cargarFunciones,
} = useFunciones()

const { asientos, cargando: cargandoAsientos, cargarAsientos, reservar } = useAsientos()

const funcionSeleccionada = ref(null)
const asientoSeleccionadoId = ref(null)
const nombreComprador = ref('')
const reservando = ref(false)
const mensaje = ref('')
const mensajeExito = ref(false)

onMounted(() => {
  cargarFunciones()
})

function elegirFuncion(funcion) {
  funcionSeleccionada.value = funcion
  asientoSeleccionadoId.value = null
  mensaje.value = ''
  cargarAsientos(funcion.id)
}

function volverAFunciones() {
  funcionSeleccionada.value = null
  asientos.value = []
  mensaje.value = ''
}

function seleccionarAsiento(asiento) {
  if (asiento.estado === 'reservado') return
  asientoSeleccionadoId.value = asiento.id
  mensaje.value = ''
}

async function confirmarReserva() {
  reservando.value = true
  mensaje.value = ''

  const resultado = await reservar(asientoSeleccionadoId.value, nombreComprador.value)

  mensajeExito.value = resultado.exito
  mensaje.value = resultado.exito ? '¡Reserva confirmada!' : resultado.mensaje

  if (resultado.exito) {
    asientoSeleccionadoId.value = null
  }

  reservando.value = false
}
</script>
