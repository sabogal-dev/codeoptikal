import { useState } from 'react'
import { useNavigate } from 'react-router'
import { guardarSesion } from '@/shared/session'
import { login } from '../api/loginApi'

export function useLogin() {
  const navigate = useNavigate()
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)

  async function enviar(e) {
    e.preventDefault()
    const datos = new FormData(e.currentTarget)

    setCargando(true)
    setError(null)
    try {
      const sesion = await login(datos.get('usuario'), datos.get('clave'))
      guardarSesion(sesion)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  return { enviar, cargando, error }
}
