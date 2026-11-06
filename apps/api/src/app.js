import express from 'express';
import cors from 'cors';
import { usuariosRoutes } from './modules/usuarios/index.js';

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({
        status: 'ok'
    });
});


app.use('/api/usuarios', usuariosRoutes)

app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  if (status === 500) console.error(err);
  res.status(status).json({ error: status === 500 ? 'Error interno' : err.message });
});



export default app;