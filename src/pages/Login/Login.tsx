import { useState } from 'react'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import AuthService from '../../services/auth.service'
import { Formik, Form, useField } from 'formik'
import { Button, Input } from '@heroui/react'
import './Login.css'

export interface Values {
  username: string
  password: string
}

interface HeroInputProps {
  label?: string
  name: string
  type: string
  placeholder?: string
  className?: string
}

const HeroInput = ({ label, ...props }: HeroInputProps) => {
  const [field, meta] = useField(props)

  // We consider the field invalid if it has been touched and there is an error
  const isInvalid = meta.touched && !!meta.error

  return (
    <>
      {label && <label htmlFor={props.name}>{label}</label>}
      <Input
        {...field}
        {...props}
        id={props.name}
        /* The key piece: pass your "error state" prop here */
        isInvalid={isInvalid}
      />

      {isInvalid && (
        <div className="error-msg">{meta.error}</div>
      )}
    </>
  )
}

const Login = () => {
  const navigate: NavigateFunction = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')

  const validationSchema = () => {
    return Yup.object().shape({
      username: Yup.string()
        .required('Usuario requerido')
        .min(4, 'El nombre de usuario debe tener al menos 4 caracteres'),
      password: Yup.string()
        .required('Contraseña requerida')
        .min(5, 'La contraseña debe tener al menos 5 caracteres'),
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
        />

        <Button type="submit" disabled={loading}>
          {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </Button>

        {message && <div className="error-msg">{message}</div>}
      </Form>
    </Formik>
  )
}

export default Login
