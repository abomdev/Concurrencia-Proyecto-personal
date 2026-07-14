import { ref } from 'vue'
import axios from 'axios'

export function useFunciones() {
  const funciones = ref([])
  const cargando = ref(false)
  const error = ref('')

  async function cargarFunciones() {
    cargando.value = true
    error.value = ''

    try {
      const respuesta = await axios.get('/api/funciones')
      funciones.value = respuesta.data
    } catch {
      error.value = 'No se pudieron cargar las funciones. ¿Está corriendo el backend?'
    } finally {
      cargando.value = false
    }
  }

  return {
    funciones,
    cargando,
    error,
    cargarFunciones,
  }
}
