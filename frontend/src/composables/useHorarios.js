import { ref } from 'vue'
import { api } from '@/api'

export function useHorarios() {
  const horarios = ref([])
  const cargando = ref(false)
  const error = ref('')

  async function cargarHorarios(peliculaId) {
    cargando.value = true
    error.value = ''

    try {
      const respuesta = await api.get(`/peliculas/${peliculaId}/funciones`)
      horarios.value = respuesta.data
    } catch {
      error.value = 'No se pudieron cargar los horarios.'
    } finally {
      cargando.value = false
    }
  }

  return {
    horarios,
    cargando,
    error,
    cargarHorarios,
  }
}
