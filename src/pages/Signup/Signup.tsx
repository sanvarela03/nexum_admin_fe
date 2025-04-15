import { useState } from 'react'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import AuthService from '../../services/auth.service'
import { Formik, Form, useField } from 'formik'
import { Button, Input } from '@heroui/react'
import RolesCheckboxes from './RolesCheckbox'
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

const Register = () => {
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
      email: Yup.string().required('Correo requerido').email('Correo inválido'),
      name: Yup.string().required('Nombre requerido'),
      lastName: Yup.string().required('Apellido requerido'),
      phone: Yup.string().required('Teléfono requerido'),
      roles: Yup.array().of(Yup.string()),
    })
  }

  const roles: Record<string, string> = {
    'Usuario'      : 'ROLE_USER',
    'Administrador': 'ROLE_ADMIN',
    'Moderador'    : 'ROLE_MODERATOR',
  }

  const handleSignup = (formValue: Values) => {
    setMessage('')
    setLoading(true)
    const formData = new FormData();

    // Iterate and append form values including roles conversion
    (Object.keys(formValue) as (keyof typeof formValue)[]).forEach((key) => {
      const value = formValue[key]
      if (Array.isArray(value)) {
        let str = ''
        value.forEach((item, index) => str = index === 0 ? `${roles[item]}` : `${str}, ${roles[item]}`)
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
          (error.response && error.response.data && error.response.data.message) ||
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
        email: '',
        name: '',
        lastName: '',
        phone: '',
        roles: [],
      }}
      validationSchema={validationSchema}
      onSubmit={handleSignup}
    >
      <Form className="container-login">
        <h1 className="text-4xl font-bold text-center text-indigo-600 mb-6">
          Crear cuenta
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

        {/* Roles are handled via a custom RolesCheckboxes component */}
        <RolesCheckboxes name="roles" />

        <Button type="submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Crear cuenta'}
        </Button>

        {message && <div className="error-msg">{message}</div>}
      </Form>
    </Formik>
  )
}

export default Register
