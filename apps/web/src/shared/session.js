const CLAVE = 'sesion'

export function guardarSesion(sesion) {
  localStorage.setItem(CLAVE, JSON.stringify(sesion))
}

export function obtenerSesion() {
  const crudo = localStorage.getItem(CLAVE)
  return crudo ? JSON.parse(crudo) : null
}

export function cerrarSesion() {
  localStorage.removeItem(CLAVE)
}
