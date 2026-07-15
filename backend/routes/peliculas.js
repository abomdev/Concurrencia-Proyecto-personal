import { Router } from 'express'
import { db } from '../db.js'

export const peliculasRouter = Router()

peliculasRouter.get('/peliculas', (req, res) => {
  const peliculas = db.prepare('SELECT * FROM peliculas ORDER BY nombre').all()
  res.json(peliculas)
})

peliculasRouter.get('/peliculas/:id/funciones', (req, res) => {
  const funciones = db
    .prepare('SELECT * FROM funciones WHERE pelicula_id = ? ORDER BY horario')
    .all(req.params.id)

  res.json(funciones)
})
