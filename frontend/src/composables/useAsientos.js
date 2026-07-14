import { ref } from 'vue'
import axios from 'axios'

export function useAsientos() {
  const asientos = ref([])
  const cargando = ref(false)
  const error = ref('')

  async function cargarAsientos(funcionId) {
    cargando.value = true
    error.value = ''

    try {
      const respuesta = await axios.get(`/api/funciones/${funcionId}/asientos`)
      asientos.value = respuesta.data
    } catch {
      error.value = 'No se pudo cargar el mapa de asientos.'
    } finally {
      cargando.value = false
    }
  }

  async function reservar(asientoId, nombreComprador) {
    try {
      await axios.post('/api/reservas', { asientoId, nombreComprador })
      const asiento = asientos.value.find((item) => item.id === asientoId)
      if (asiento) asiento.estado = 'reservado'
      return { exito: true }
    } catch (err) {
      if (err.response?.status === 409) {
        const asiento = asientos.value.find((item) => item.id === asientoId)
        if (asiento) asiento.estado = 'reservado'
        return { exito: false, mensaje: err.response.data.error }
      }
      return { exito: false, mensaje: 'Ocurrió un error al reservar. Intenta de nuevo.' }
    }
  }

  return {
    asientos,
    cargando,
    error,
    cargarAsientos,
    reservar,
  }
}
