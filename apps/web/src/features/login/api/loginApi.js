import { http } from '@/shared/http'

export function login(usuario, clave) {
  return http('/api/usuarios/login', {
    method: 'POST',
    body: { usuario, clave },
  })
}
