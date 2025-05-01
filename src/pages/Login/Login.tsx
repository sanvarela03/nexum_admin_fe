import { useState } from 'react'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import { AuthService } from '@services'
import { Formik, Form } from 'formik'
import { Button } from '@heroui/react'
import { HeroInput } from '@components'
import './Login.css'
import { createValidationSchema } from '@utils'

export interface Values {
  username: string
  password: string
}

const Login = () => {
  const navigate: NavigateFunction = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const toggleVisibility = () => setIsVisible(!isVisible)

  const validationSchema = createValidationSchema(['username', 'password'])

  const handleLogin = async ({ username, password }: Values) => {
    setMessage('')
    setLoading(true)

    try {
      await AuthService.login(username, password)
      navigate('/profile')
      window.location.reload()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()

      setLoading(false)
      console.log('Error en el login ->', error)
      setMessage(resMessage)
    }
  }

  return (
    <Formik
      initialValues={{
        username: '',
        password: '',
      }}
      validationSchema={validationSchema}
      onSubmit={handleLogin}
    >
      {({ isValid, dirty }) => (
        <div className="flex items-center justify-center min-h-full">
          <Form className="container-login">
            <h1 className="text-4xl font-bold text-center text-indigo-600 mb-6">
              Iniciar sesión
            </h1>

            {/* Using our custom HeroInput for each text field */}
            <HeroInput
              name="username"
              type="text"
              placeholder="Usuario"
              label="Usuario"
            />

            <HeroInput
              name="password"
              type="password"
              placeholder="Contraseña"
              label="Contraseña"
              isPassword={true}
              isVisible={isVisible}
              toggleVisibility={toggleVisibility}
            />

            <Button
              type="submit"
              disabled={loading || !isValid || !dirty}
              className="form-button"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Button>

            {message && <div className="error-msg">{message}</div>}
          </Form>
        </div>
      )}
    </Formik>
  )
}

export default Login
