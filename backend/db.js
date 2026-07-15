import { DatabaseSync } from 'node:sqlite'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { mkdirSync } from 'node:fs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataDir = join(__dirname, 'data')
mkdirSync(dataDir, { recursive: true })

export const db = new DatabaseSync(join(dataDir, 'cine.db'))

db.exec(`
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

const funcionesSemilla = [
  {
    pelicula: 'El Caballero Oscuro',
    sala: 'Sala 1',
    horario: '2026-07-12 18:30',
    poster: '/posters/el-caballero-oscuro.jpg',
    duracion_minutos: 152,
    sinopsis: 'Batman se enfrenta al Joker, un criminal que busca sumir Ciudad Gótica en el caos.',
  },
  {
    pelicula: 'El Padrino',
    sala: 'Sala 2',
    horario: '2026-07-12 20:00',
    poster: '/posters/el-padrino.jpg',
    duracion_minutos: 175,
    sinopsis: 'La historia de la familia Corleone y su lugar en el crimen organizado de Nueva York.',
  },
  {
    pelicula: 'Cadena Perpetua',
    sala: 'Sala 3',
    horario: '2026-07-12 21:15',
    poster: '/posters/cadena-perpetua.jpg',
    duracion_minutos: 142,
    sinopsis: 'Un hombre condenado injustamente se aferra a la esperanza durante años en prisión.',
  },
]

function migrarFunciones() {
  const columnas = db.prepare('PRAGMA table_info(funciones)').all().map((c) => c.name)
  if (!columnas.includes('poster')) db.exec('ALTER TABLE funciones ADD COLUMN poster TEXT')
  if (!columnas.includes('duracion_minutos')) {
    db.exec('ALTER TABLE funciones ADD COLUMN duracion_minutos INTEGER')
  }
  if (!columnas.includes('sinopsis')) db.exec('ALTER TABLE funciones ADD COLUMN sinopsis TEXT')
}

migrarFunciones()

// Completa poster/duracion/sinopsis en funciones que ya existian antes de esta migracion
// (quedaron en NULL al agregar las columnas), sin tocar sus reservas ya hechas.
function completarDatosExistentes() {
  const actualizar = db.prepare(
    'UPDATE funciones SET poster = ?, duracion_minutos = ?, sinopsis = ? '
    + 'WHERE pelicula = ? AND poster IS NULL',
  )
  for (const funcion of funcionesSemilla) {
    actualizar.run(funcion.poster, funcion.duracion_minutos, funcion.sinopsis, funcion.pelicula)
  }
}

completarDatosExistentes()

function sembrarSiHaceFalta() {
  const { total } = db.prepare('SELECT COUNT(*) AS total FROM funciones').get()
  if (total > 0) return

  const insertarFuncion = db.prepare(
    'INSERT INTO funciones (pelicula, sala, horario, poster, duracion_minutos, sinopsis) '
    + 'VALUES (?, ?, ?, ?, ?, ?)',
  )
  const insertarAsiento = db.prepare(
    'INSERT INTO asientos (funcion_id, fila, numero) VALUES (?, ?, ?)',
  )

  const filas = ['A', 'B', 'C', 'D', 'E', 'F']
  const asientosPorFila = 8

  for (const funcion of funcionesSemilla) {
    const resultado = insertarFuncion.run(
      funcion.pelicula,
      funcion.sala,
      funcion.horario,
      funcion.poster,
      funcion.duracion_minutos,
      funcion.sinopsis,
    )
    const funcionId = resultado.lastInsertRowid

    for (const fila of filas) {
      for (let numero = 1; numero <= asientosPorFila; numero++) {
        insertarAsiento.run(funcionId, fila, numero)
      }
    }
  }
}

sembrarSiHaceFalta()
