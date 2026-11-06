import * as service from './usuarios.service.js';

export async function login(req, res) {
    const { usuario, clave } = req.body;
    const resultado = await service.login(usuario, clave)
    res.json(resultado);
}   