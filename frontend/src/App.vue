<template>
  <AppHeader @ir-a-cartelera="volverACartelera" />

  <main class="container">
    <section v-if="!peliculaSeleccionada" class="view">
      <div class="buscador">
        <input v-model.trim="busqueda" type="text" placeholder="Buscar película..." />
        <select v-model="generoSeleccionado">
          <option v-for="genero in generos" :key="genero" :value="genero">{{ genero }}</option>
        </select>
      </div>

      <p v-if="cargandoPeliculas" class="hint">Cargando cartelera...</p>
      <p v-else-if="errorPeliculas" class="error-banner">{{ errorPeliculas }}</p>
      <p v-else-if="peliculasFiltradas.length === 0" class="hint">No hay películas que coincidan con la búsqueda.</p>

      <div v-else class="peliculas-grid">
        <PeliculaCard
          v-for="pelicula in peliculasFiltradas"
          :key="pelicula.id"
          :pelicula="pelicula"
          @elegir="elegirPelicula"
        />
      </div>
    </section>

    <section v-else-if="!funcionSeleccionada" class="view">
      <button class="btn-link" @click="volverACartelera">&larr; Volver a cartelera</button>

      <div
        class="funcion-hero"
        :style="peliculaSeleccionada.poster ? { backgroundImage: `url(${peliculaSeleccionada.poster})` } : {}"
      >
        <div class="funcion-hero-overlay">
          <h2 class="funcion-titulo">{{ peliculaSeleccionada.nombre }}</h2>
          <p class="funcion-detalle">
            <span v-if="peliculaSeleccionada.genero">{{ peliculaSeleccionada.genero }}</span>
            <span v-if="peliculaSeleccionada.clasificacion"> - {{ peliculaSeleccionada.clasificacion }}</span>
            <span v-if="peliculaSeleccionada.duracion_minutos"> - {{ peliculaSeleccionada.duracion_minutos }} min</span>
          </p>
          <p v-if="peliculaSeleccionada.sinopsis" class="funcion-sinopsis">{{ peliculaSeleccionada.sinopsis }}</p>
        </div>
      </div>

      <h3 class="horarios-titulo">Elige un horario</h3>
      <p v-if="errorHorarios" class="error-banner">{{ errorHorarios }}</p>
      <HorarioSelector v-else :horarios="horarios" :cargando="cargandoHorarios" @elegir="elegirHorario" />
    </section>

    <section v-else class="view">
      <button class="btn-link" @click="volverAHorarios">&larr; Volver a horarios</button>

      <div
        class="funcion-hero"
        :style="peliculaSeleccionada.poster ? { backgroundImage: `url(${peliculaSeleccionada.poster})` } : {}"
      >
        <div class="funcion-hero-overlay">
          <h2 class="funcion-titulo">{{ peliculaSeleccionada.nombre }}</h2>
          <p class="funcion-detalle">
            {{ funcionSeleccionada.sala }} - {{ funcionSeleccionada.horario }}
            <span v-if="peliculaSeleccionada.duracion_minutos"> - {{ peliculaSeleccionada.duracion_minutos }} min</span>
          </p>
          <p v-if="peliculaSeleccionada.sinopsis" class="funcion-sinopsis">{{ peliculaSeleccionada.sinopsis }}</p>
        </div>
      </div>

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
import { computed, onMounted, ref } from 'vue'
import { usePeliculas } from '@/composables/usePeliculas'
import { useHorarios } from '@/composables/useHorarios'
import { useAsientos } from '@/composables/useAsientos'
import AppHeader from '@/components/AppHeader.vue'
import PeliculaCard from '@/components/PeliculaCard.vue'
import HorarioSelector from '@/components/HorarioSelector.vue'
import SeatMap from '@/components/SeatMap.vue'

const {
  peliculas,
  cargando: cargandoPeliculas,
  error: errorPeliculas,
  cargarPeliculas,
} = usePeliculas()

const {
  horarios,
  cargando: cargandoHorarios,
  error: errorHorarios,
  cargarHorarios,
} = useHorarios()

const { asientos, cargando: cargandoAsientos, cargarAsientos, reservar } = useAsientos()

const peliculaSeleccionada = ref(null)
const funcionSeleccionada = ref(null)
const asientoSeleccionadoId = ref(null)
const nombreComprador = ref('')
const reservando = ref(false)
const mensaje = ref('')
const mensajeExito = ref(false)

const busqueda = ref('')
const generoSeleccionado = ref('Todos')

const generos = computed(() => [
  'Todos',
  ...new Set(peliculas.value.map((p) => p.genero).filter(Boolean)),
])

const peliculasFiltradas = computed(() => peliculas.value.filter((pelicula) => {
  const coincideNombre = pelicula.nombre.toLowerCase().includes(busqueda.value.toLowerCase())
  const coincideGenero = generoSeleccionado.value === 'Todos' || pelicula.genero === generoSeleccionado.value
  return coincideNombre && coincideGenero
}))

onMounted(() => {
  cargarPeliculas()
})

function elegirPelicula(pelicula) {
  peliculaSeleccionada.value = pelicula
  funcionSeleccionada.value = null
  cargarHorarios(pelicula.id)
}

function elegirHorario(horario) {
  funcionSeleccionada.value = horario
  asientoSeleccionadoId.value = null
  mensaje.value = ''
  cargarAsientos(horario.id)
}

function volverAHorarios() {
  funcionSeleccionada.value = null
  asientos.value = []
  mensaje.value = ''
}

function volverACartelera() {
  peliculaSeleccionada.value = null
  funcionSeleccionada.value = null
  horarios.value = []
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
