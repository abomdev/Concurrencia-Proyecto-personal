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

function sembrarSiHaceFalta() {
  const { total } = db.prepare('SELECT COUNT(*) AS total FROM funciones').get()
  if (total > 0) return

  const funcionesSemilla = [
    { pelicula: 'El Caballero Oscuro', sala: 'Sala 1', horario: '2026-07-12 18:30' },
    { pelicula: 'El Padrino', sala: 'Sala 2', horario: '2026-07-12 20:00' },
    { pelicula: 'Cadena Perpetua', sala: 'Sala 3', horario: '2026-07-12 21:15' },
  ]

  const insertarFuncion = db.prepare(
    'INSERT INTO funciones (pelicula, sala, horario) VALUES (?, ?, ?)',
  )
  const insertarAsiento = db.prepare(
    'INSERT INTO asientos (funcion_id, fila, numero) VALUES (?, ?, ?)',
  )

  const filas = ['A', 'B', 'C', 'D', 'E', 'F']
  const asientosPorFila = 8

  for (const funcion of funcionesSemilla) {
    const resultado = insertarFuncion.run(funcion.pelicula, funcion.sala, funcion.horario)
    const funcionId = resultado.lastInsertRowid

    for (const fila of filas) {
      for (let numero = 1; numero <= asientosPorFila; numero++) {
        insertarAsiento.run(funcionId, fila, numero)
      }
    }
  }
}

sembrarSiHaceFalta()
