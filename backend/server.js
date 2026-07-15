import express from 'express'
import cors from 'cors'
import './db.js'
import { peliculasRouter } from './routes/peliculas.js'
import { funcionesRouter } from './routes/funciones.js'
import { reservasRouter } from './routes/reservas.js'

const app = express()
const PORT = 4000

app.use(cors())
app.use(express.json())

app.use('/api', peliculasRouter)
app.use('/api', funcionesRouter)
app.use('/api', reservasRouter)

app.listen(PORT, () => {
  console.log(`Backend de boletería escuchando en http://localhost:${PORT}`)
})
