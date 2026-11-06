import db from '../../shared/db.js';

export function buscarPorNombre(nombre) {
  return db('usuarios')                                  
    .whereRaw('lower(nombre) = ?', [nombre])
    .first();                                        
}
