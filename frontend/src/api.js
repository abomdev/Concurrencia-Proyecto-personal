import axios from 'axios'

// En dev, la ruta relativa /api pasa por el proxy de vite.config.js hacia
// localhost:4000. En produccion (Vercel) no hay proxy, asi que VITE_API_URL
// (definida en .env.production) apunta directo al backend que cada visitante
// corre en su propia PC.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
})
