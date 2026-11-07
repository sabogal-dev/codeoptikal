const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export async function http(ruta, { method = 'GET', body } = {}) {
  let respuesta
  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new Error('No se pudo conectar con el servidor')
  }

  const datos = await respuesta.json().catch(() => null)

  if (!respuesta.ok) {
    throw new Error(datos?.error || 'Error inesperado')
  }

  return datos
}
