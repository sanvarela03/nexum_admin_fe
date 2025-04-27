import { useState } from 'react'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import AuthService from '../../services/auth.service'
import { Formik, Form } from 'formik'
import { Button } from '@heroui/react'
import HeroInput from '../../components/HeroInput'
import './Login.css'

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

  const validationSchema = () => {
    return Yup.object().shape({
      username: Yup.string()
        .required('Usuario requerido')
        .min(4, 'El nombre de usuario debe tener al menos 4 caracteres'),
      password: Yup.string()
        .required('Contraseña requerida')
        .min(5, 'La contraseña debe tener al menos 5 caracteres'),
      // .matches(
      //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#^()_/-])[A-Za-z\d@$!%*?&.#^()_/-]+$/,
      //   'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial'
      // ),
    })
  }

  const handleLogin = ({ username, password }: Values) => {
    setMessage('')
    setLoading(true)

    AuthService.login(username, password).then(
      () => {
        navigate('/profile')
        window.location.reload()
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString()

        // const resMessage = error.message || error.toString()

        setLoading(false)
        console.log('Error en el login ->', error)
        setMessage(resMessage)
      }
    )
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
      )}
    </Formik>
  )
}

export default Login
