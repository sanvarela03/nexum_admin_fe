import { useState } from 'react'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import AuthService from '../../services/auth.service'
import { Formik, Form } from 'formik'
import { Button } from '@heroui/react'
import RolesCheckboxes from './RolesCheckbox'
import HeroInput from '../../components/HeroInput'
import './Signup.css'

export interface Values {
  username: string
  password: string
  email: string
  name: string
  lastName: string
  phone: string
  roles: string[]
}

const Register = () => {
  const navigate: NavigateFunction = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState<boolean>(false)
  const toggleVisibility = () => setIsVisible(!isVisible)
  const toggleConfirmPasswordVisibility = () =>
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible)

  const validationSchema = () => {
    return Yup.object().shape({
      username: Yup.string()
        .required('Usuario requerido')
        .min(4, 'El nombre de usuario debe tener al menos 4 caracteres'),

      password: Yup.string()
        .required('Contraseña requerida')
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#^()_/-])[A-Za-z\d@$!%*?&.#^()_/-]+$/,
          'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial'
        ),

      confirmPassword: Yup.string()
        .required('Confirmación de contraseña requerida')
        .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden'),

      email: Yup.string().required('Correo requerido').email('Correo inválido'),

      name: Yup.string().required('Nombre requerido'),

      lastName: Yup.string().required('Apellido requerido'),

      phone: Yup.string()
        .required('Teléfono requerido')
        .matches(
          /^[\d+\-]+$/,
          'El teléfono solo puede contener números, "+" o "-"'
        ),

      roles: Yup.array().of(Yup.string()),
    })
  }

  const roles: Record<string, string> = {
    Usuario: 'ROLE_USER',
    Administrador: 'ROLE_ADMIN',
    Moderador: 'ROLE_MODERATOR',
  }

  const handleSignup = (formValue: Values) => {
    setMessage('')
    setLoading(true)
    const formData = new FormData()

    // Iterate and append form values including roles conversion
    ;(Object.keys(formValue) as (keyof typeof formValue)[]).forEach((key) => {
      const value = formValue[key]
      if (Array.isArray(value)) {
        let str = ''
        value.forEach(
          (item, index) =>
            (str = index === 0 ? `${roles[item]}` : `${str}, ${roles[item]}`)
        )
        formData.append(key, str) // Adjust key name if required by your backend
      } else {
        formData.append(key, value)
      }
    })

    AuthService.register(formData).then(
      () => {
        console.log('success')
        navigate('/login')
        window.location.reload()
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString()

        setLoading(false)
        console.error('Error en el signup ->', error)
        setMessage(resMessage)
      }
    )
  }

  return (
    <Formik
      initialValues={{
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        name: '',
        lastName: '',
        phone: '',
        roles: [],
      }}
      validationSchema={validationSchema}
      onSubmit={handleSignup}
    >
      {({ isValid, dirty }) => (
        <Form className="container-signup">
          <h1 className="text-4xl font-bold text-center text-indigo-600 mb-6">
            Crear cuenta
          </h1>

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
          <HeroInput
            name="confirmPassword"
            type="password"
            placeholder="Confirmar Contraseña"
            label="Confirmar Contraseña"
            isPassword={true}
            isVisible={isConfirmPasswordVisible}
            toggleVisibility={toggleConfirmPasswordVisibility}
          />
          <HeroInput
            name="email"
            type="email"
            placeholder="Correo"
            label="Correo"
          />
          <HeroInput
            name="name"
            type="text"
            placeholder="Nombre"
            label="Nombre"
          />
          <HeroInput
            name="lastName"
            type="text"
            placeholder="Apellido"
            label="Apellido"
          />
          <HeroInput
            name="phone"
            type="text"
            placeholder="Teléfono"
            label="Teléfono"
          />

          <RolesCheckboxes name="roles" />

          <Button
            type="submit"
            disabled={loading || !isValid || !dirty}
            className="form-button"
          >
            {loading ? 'Registrando...' : 'Crear cuenta'}
          </Button>

          {message && <div className="error-msg">{message}</div>}
        </Form>
      )}
    </Formik>
  )
}

export default Register
