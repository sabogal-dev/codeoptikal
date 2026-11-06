import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { buscarPorNombre } from './usuarios.repository.js';
import { AppError } from '../../shared/errors.js';

export async function login(nombre, clave) {
  if (typeof nombre !== 'string' || typeof clave !== 'string' || !nombre || !clave) {
    throw new AppError('Usuario y clave son obligatorios', 400);
  }

  const usuario = await buscarPorNombre(nombre.trim().toLowerCase());

  if (!usuario || !usuario.activo) {
    throw new AppError('Credenciales inválidas', 401);
  }

  const coincide = await bcrypt.compare(clave, usuario.password_hash);
  if (!coincide) {
    throw new AppError('Credenciales inválidas', 401);
  }

  const token = jwt.sign(                                           
    { id: usuario.id, rol: usuario.rol },
    process.env.JWT_SECRET,                                               
    { expiresIn: '90d' }                                           
  );

  return {
    token,
    usuario: { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol },
  };
}
