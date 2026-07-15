import { Router } from 'express'
import { db } from '../db.js'

export const funcionesRouter = Router()

funcionesRouter.get('/funciones/:id/asientos', (req, res) => {
  const asientos = db
    .prepare('SELECT id, fila, numero, estado FROM asientos WHERE funcion_id = ? ORDER BY fila, numero')
    .all(req.params.id)

  res.json(asientos)
})
