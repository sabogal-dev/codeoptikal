import { useLogin } from '../hooks/useLogin'
import { LoginForm } from './LoginForm'

export function LoginPage() {
  const { enviar, cargando, error } = useLogin()

  return <LoginForm onSubmit={enviar} cargando={cargando} error={error} />
}
