import { DatabaseSync } from 'node:sqlite'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { mkdirSync } from 'node:fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataDir = join(__dirname, 'data')
mkdirSync(dataDir, { recursive: true })

export const db = new DatabaseSync(join(dataDir, 'cine.db'))

db.exec(`
  CREATE TABLE IF NOT EXISTS peliculas (
    id INTEGER PRIMARY KEY,
    nombre TEXT NOT NULL UNIQUE,
    poster TEXT,
    duracion_minutos INTEGER,
    sinopsis TEXT,
    genero TEXT,
    clasificacion TEXT
  );

  CREATE TABLE IF NOT EXISTS funciones (
    id INTEGER PRIMARY KEY,
    pelicula TEXT NOT NULL,
    sala TEXT NOT NULL,
    horario TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS asientos (
    id INTEGER PRIMARY KEY,
    funcion_id INTEGER NOT NULL,
    fila TEXT NOT NULL,
    numero INTEGER NOT NULL,
    estado TEXT NOT NULL DEFAULT 'disponible',
    UNIQUE(funcion_id, fila, numero)
  );

  CREATE TABLE IF NOT EXISTS reservas (
    id TEXT PRIMARY KEY,
    asiento_id INTEGER NOT NULL,
    nombre_comprador TEXT NOT NULL,
    creado_en TEXT NOT NULL
  );
`)

const peliculasSemilla = [
  {
    nombre: 'El Caballero Oscuro',
    poster: '/posters/el-caballero-oscuro.jpg',
    duracion_minutos: 152,
    sinopsis: 'Batman se enfrenta al Joker, un criminal que busca sumir Ciudad Gótica en el caos.',
    genero: 'Acción',
    clasificacion: '+14',
  },
  {
    nombre: 'El Padrino',
    poster: '/posters/el-padrino.jpg',
    duracion_minutos: 175,
    sinopsis: 'La historia de la familia Corleone y su lugar en el crimen organizado de Nueva York.',
    genero: 'Drama',
    clasificacion: '+18',
  },
  {
    nombre: 'Cadena Perpetua',
    poster: '/posters/cadena-perpetua.jpg',
    duracion_minutos: 142,
    sinopsis: 'Un hombre condenado injustamente se aferra a la esperanza durante años en prisión.',
    genero: 'Drama',
    clasificacion: '+14',
  },
  {
    nombre: 'Pulp Fiction',
    poster: '/posters/pulp-fiction.jpg',
    duracion_minutos: 154,
    sinopsis: 'Las vidas de dos sicarios, un boxeador y una pareja de asaltantes se entrelazan en una serie de historias de crimen en Los Ángeles.',
    genero: 'Crimen',
    clasificacion: '+18',
  },
  {
    nombre: 'Forrest Gump',
    poster: '/posters/forrest-gump.jpg',
    duracion_minutos: 142,
    sinopsis: 'Un hombre de buen corazón e intelecto limitado atraviesa décadas de la historia de Estados Unidos dejando una huella inesperada en cada una.',
    genero: 'Drama',
    clasificacion: '+14',
  },
  {
    nombre: 'Matrix',
    poster: '/posters/matrix.jpg',
    duracion_minutos: 136,
    sinopsis: 'Un programador descubre que la realidad que conoce es una simulación y se une a la resistencia humana contra las máquinas que la controlan.',
    genero: 'Ciencia Ficción',
    clasificacion: '+14',
  },
  {
    nombre: 'El Señor de los Anillos: El Retorno del Rey',
    poster: '/posters/el-senor-de-los-anillos-el-retorno-del-rey.jpg',
    duracion_minutos: 201,
    sinopsis: 'La comunidad enfrenta la batalla final contra las fuerzas de Sauron mientras Frodo se acerca al Monte del Destino para destruir el anillo.',
    genero: 'Fantasía',
    clasificacion: '+14',
  },
  {
    nombre: 'Coco',
    poster: '/posters/coco.jpg',
    duracion_minutos: 105,
    sinopsis: 'Un niño con sueños de músico es transportado a la Tierra de los Muertos, donde descubre la verdadera historia de su familia.',
    genero: 'Animación',
    clasificacion: 'TE',
  },
  {
    nombre: 'El Exorcista',
    poster: '/posters/el-exorcista.jpg',
    duracion_minutos: 122,
    sinopsis: 'Una madre busca ayuda cuando su hija comienza a mostrar signos de una posesión demoníaca inexplicable.',
    genero: 'Terror',
    clasificacion: '+18',
  },
]

const FILAS_PREFERENCIAL = ['C', 'D']
const PRECIOS_POR_TIPO = { Regular: 4000, Preferencial: 6000 }

function tipoDeFila(fila) {
  return FILAS_PREFERENCIAL.includes(fila) ? 'Preferencial' : 'Regular'
}

const horariosSemilla = [
  {
    pelicula: 'El Caballero Oscuro',
    horarios: [
      { sala: 'Sala 1', horario: '2026-07-12 18:30' },
      { sala: 'Sala 1', horario: '2026-07-12 21:30' },
      { sala: 'Sala 3', horario: '2026-07-13 20:15' },
    ],
  },
  {
    pelicula: 'El Padrino',
    horarios: [
      { sala: 'Sala 2', horario: '2026-07-12 20:00' },
      { sala: 'Sala 4', horario: '2026-07-13 17:45' },
    ],
  },
  {
    pelicula: 'Cadena Perpetua',
    horarios: [
      { sala: 'Sala 3', horario: '2026-07-12 21:15' },
      { sala: 'Sala 2', horario: '2026-07-13 19:00' },
      { sala: 'Sala 1', horario: '2026-07-14 16:30' },
    ],
  },
  {
    pelicula: 'Pulp Fiction',
    horarios: [
      { sala: 'Sala 2', horario: '2026-07-12 22:30' },
      { sala: 'Sala 4', horario: '2026-07-13 20:30' },
    ],
  },
  {
    pelicula: 'Forrest Gump',
    horarios: [
      { sala: 'Sala 1', horario: '2026-07-13 15:00' },
      { sala: 'Sala 3', horario: '2026-07-14 18:00' },
    ],
  },
  {
    pelicula: 'Matrix',
    horarios: [
      { sala: 'Sala 4', horario: '2026-07-12 19:15' },
      { sala: 'Sala 1', horario: '2026-07-14 21:00' },
      { sala: 'Sala 2', horario: '2026-07-15 20:00' },
    ],
  },
  {
    pelicula: 'El Señor de los Anillos: El Retorno del Rey',
    horarios: [
      { sala: 'Sala 3', horario: '2026-07-12 17:00' },
      { sala: 'Sala 2', horario: '2026-07-14 16:00' },
    ],
  },
  {
    pelicula: 'Coco',
    horarios: [
      { sala: 'Sala 4', horario: '2026-07-13 14:30' },
      { sala: 'Sala 1', horario: '2026-07-14 13:00' },
      { sala: 'Sala 3', horario: '2026-07-15 15:30' },
    ],
  },
  {
    pelicula: 'El Exorcista',
    horarios: [
      { sala: 'Sala 2', horario: '2026-07-13 23:00' },
      { sala: 'Sala 4', horario: '2026-07-14 22:45' },
    ],
  },
]

// Agrega pelicula_id a funciones si falta. Las columnas legado (pelicula, poster,
// duracion_minutos, sinopsis) NO se vuelven a agregar aqui: una vez migradas a
// peliculas y eliminadas de funciones (mas abajo), deben quedar afuera para siempre.
function migrarFunciones() {
  const columnas = db.prepare('PRAGMA table_info(funciones)').all().map((c) => c.name)
  if (!columnas.includes('pelicula_id')) {
    db.exec('ALTER TABLE funciones ADD COLUMN pelicula_id INTEGER')
  }
}

migrarFunciones()

// Agrega tipo/precio a asientos si faltan, y completa los valores de los asientos
// que ya existian antes de esta migracion segun su fila (sin tocar su estado).
function migrarAsientos() {
  const columnas = db.prepare('PRAGMA table_info(asientos)').all().map((c) => c.name)
  if (!columnas.includes('tipo')) {
    db.exec("ALTER TABLE asientos ADD COLUMN tipo TEXT NOT NULL DEFAULT 'Regular'")
  }
  if (!columnas.includes('precio')) db.exec('ALTER TABLE asientos ADD COLUMN precio INTEGER')

  const pendientes = db.prepare('SELECT id, fila FROM asientos WHERE precio IS NULL').all()
  if (pendientes.length === 0) return

  const actualizar = db.prepare('UPDATE asientos SET tipo = ?, precio = ? WHERE id = ?')
  for (const asiento of pendientes) {
    const tipo = tipoDeFila(asiento.fila)
    actualizar.run(tipo, PRECIOS_POR_TIPO[tipo], asiento.id)
  }
}

migrarAsientos()

// Migra funciones que todavia tienen los datos de la pelicula en sus propias
// columnas (formato viejo) hacia la tabla peliculas, sin tocar sus asientos/reservas.
// No-op una vez que la columna legado 'pelicula' ya fue eliminada de funciones.
function backfillPeliculasDesdeFunciones() {
  const columnas = db.prepare('PRAGMA table_info(funciones)').all().map((c) => c.name)
  if (!columnas.includes('pelicula')) return

  const legado = db
    .prepare(
      'SELECT DISTINCT pelicula, poster, duracion_minutos, sinopsis FROM funciones '
      + 'WHERE pelicula_id IS NULL',
    )
    .all()
  if (legado.length === 0) return

  const buscarPelicula = db.prepare('SELECT id FROM peliculas WHERE nombre = ?')
  const crearPelicula = db.prepare(
    'INSERT INTO peliculas (nombre, poster, duracion_minutos, sinopsis, genero, clasificacion) '
    + 'VALUES (?, ?, ?, ?, ?, ?)',
  )
  const asignarPeliculaId = db.prepare(
    'UPDATE funciones SET pelicula_id = ? WHERE pelicula = ? AND pelicula_id IS NULL',
  )

  for (const fila of legado) {
    const semilla = peliculasSemilla.find((p) => p.nombre === fila.pelicula)

    let peliculaId = buscarPelicula.get(fila.pelicula)?.id
    if (!peliculaId) {
      const datos = semilla ?? {
        nombre: fila.pelicula,
        poster: fila.poster,
        duracion_minutos: fila.duracion_minutos,
        sinopsis: fila.sinopsis,
        genero: null,
        clasificacion: null,
      }
      const resultado = crearPelicula.run(
        datos.nombre,
        datos.poster,
        datos.duracion_minutos,
        datos.sinopsis,
        datos.genero,
        datos.clasificacion,
      )
      peliculaId = resultado.lastInsertRowid
    }

    asignarPeliculaId.run(peliculaId, fila.pelicula)
  }
}

backfillPeliculasDesdeFunciones()

// Limpia las columnas de funciones que quedaron redundantes tras moverse a peliculas.
// Se salta a si misma si ya se ejecuto en un arranque anterior (columna 'pelicula'
// ya no existe), y se niega a borrar si todavia queda algo sin migrar (defensivo).
function eliminarColumnasRedundantesDeFunciones() {
  const columnas = db.prepare('PRAGMA table_info(funciones)').all().map((c) => c.name)
  if (!columnas.includes('pelicula')) return

  const { pendientes } = db
    .prepare('SELECT COUNT(*) AS pendientes FROM funciones WHERE pelicula_id IS NULL')
    .get()
  if (pendientes > 0) {
    console.warn(
      `No se eliminaron columnas redundantes de funciones: quedan ${pendientes} fila(s) sin pelicula_id.`,
    )
    return
  }

  for (const columna of ['pelicula', 'poster', 'duracion_minutos', 'sinopsis']) {
    try {
      db.exec(`ALTER TABLE funciones DROP COLUMN ${columna}`)
    } catch (error) {
      console.warn(`No se pudo eliminar la columna '${columna}' de funciones:`, error.message)
    }
  }
}

eliminarColumnasRedundantesDeFunciones()

function sembrarPeliculasFaltantes() {
  const insertar = db.prepare(
    'INSERT OR IGNORE INTO peliculas (nombre, poster, duracion_minutos, sinopsis, genero, clasificacion) '
    + 'VALUES (?, ?, ?, ?, ?, ?)',
  )
  for (const pelicula of peliculasSemilla) {
    insertar.run(
      pelicula.nombre,
      pelicula.poster,
      pelicula.duracion_minutos,
      pelicula.sinopsis,
      pelicula.genero,
      pelicula.clasificacion,
    )
  }
}

sembrarPeliculasFaltantes()

function sembrarFuncionesFaltantes() {
  const buscarPeliculaId = db.prepare('SELECT id FROM peliculas WHERE nombre = ?')
  const buscarFuncion = db.prepare(
    'SELECT id FROM funciones WHERE pelicula_id = ? AND sala = ? AND horario = ?',
  )
  const insertarFuncion = db.prepare(
    'INSERT INTO funciones (pelicula_id, sala, horario) VALUES (?, ?, ?)',
  )
  const insertarAsiento = db.prepare(
    'INSERT INTO asientos (funcion_id, fila, numero, tipo, precio) VALUES (?, ?, ?, ?, ?)',
  )

  const filas = ['A', 'B', 'C', 'D', 'E', 'F']
  const asientosPorFila = 8

  for (const entrada of horariosSemilla) {
    const peliculaId = buscarPeliculaId.get(entrada.pelicula)?.id
    if (!peliculaId) continue

    for (const horario of entrada.horarios) {
      const existente = buscarFuncion.get(peliculaId, horario.sala, horario.horario)
      if (existente) continue

      const resultado = insertarFuncion.run(peliculaId, horario.sala, horario.horario)
      const funcionId = resultado.lastInsertRowid

      for (const fila of filas) {
        const tipo = tipoDeFila(fila)
        const precio = PRECIOS_POR_TIPO[tipo]
        for (let numero = 1; numero <= asientosPorFila; numero++) {
          insertarAsiento.run(funcionId, fila, numero, tipo, precio)
        }
      }
    }
  }
}

sembrarFuncionesFaltantes()
