import { ref } from 'vue'
import { api } from '@/api'

export function usePeliculas() {
  const peliculas = ref([])
  const cargando = ref(false)
  const error = ref('')

  async function cargarPeliculas() {
    cargando.value = true
    error.value = ''

    try {
      const respuesta = await api.get('/peliculas')
      peliculas.value = respuesta.data
    } catch {
      error.value = 'No se pudieron cargar las películas. ¿Está corriendo el backend?'
    } finally {
      cargando.value = false
    }
  }

  return {
    peliculas,
    cargando,
    error,
    cargarPeliculas,
  }
}
