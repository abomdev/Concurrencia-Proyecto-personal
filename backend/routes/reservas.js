import { Router } from 'express'
import crypto from 'node:crypto'
import { db } from '../db.js'

export const reservasRouter = Router()

reservasRouter.post('/reservas', (req, res) => {
  const { asientoId, nombreComprador } = req.body

  if (!asientoId || !nombreComprador || !nombreComprador.trim()) {
    return res.status(400).json({ error: 'Faltan datos: asientoId y nombreComprador son obligatorios.' })
  }

  try {
    db.exec('BEGIN IMMEDIATE')

    // Único punto donde se decide la concurrencia: el UPDATE solo afecta una fila
    // si el asiento sigue "disponible" en el mismo instante en que se ejecuta.
    // Si otra reserva ya lo tomó, changes será 0 y no hay condición de carrera posible.
    const resultado = db
      .prepare("UPDATE asientos SET estado = 'reservado' WHERE id = ? AND estado = 'disponible'")
      .run(asientoId)

    if (resultado.changes === 0) {
      db.exec('ROLLBACK')
      return res.status(409).json({ error: 'Este asiento ya no está disponible.' })
    }

    const reservaId = crypto.randomUUID()
    db.prepare(
      'INSERT INTO reservas (id, asiento_id, nombre_comprador, creado_en) VALUES (?, ?, ?, ?)',
    ).run(reservaId, asientoId, nombreComprador.trim(), new Date().toISOString())

    db.exec('COMMIT')

    res.status(201).json({ reservaId, asientoId, estado: 'reservado' })
  } catch (error) {
    try {
      db.exec('ROLLBACK')
    } catch {
      // no había transacción abierta, nada que revertir
    }
    res.status(500).json({ error: 'Error al procesar la reserva.' })
  }
})
