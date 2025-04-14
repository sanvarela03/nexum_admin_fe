import { useState } from 'react'
import { NavigateFunction, useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import AuthService from '../../services/auth.service'
import { ErrorMessage, Field, Formik, Form } from 'formik'
import { Button } from '@heroui/react'
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

    (Object.keys(formValue) as (keyof typeof formValue)[]).forEach((key) => {
      const value = formValue[key]
      if (Array.isArray(value)) {
        let str = ''
        value.forEach((item, index) => str = (index === 0) ? `${roles[item]}` : `${str}, ${roles[item]}`)
        formData.append(key, str) // Use 'key' directly or `${key}[]` depending on backend
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
        <div>
          <Field
            className="login-field"
            name="username"
            type="text"
            placeholder="Usuario"
          />
          <ErrorMessage name="username" component="div" className="error-msg" />
        </div>
        <div>
          <Field
            className="login-field"
            name="password"
            type="password"
            placeholder="Contraseña"
          />
          <ErrorMessage name="password" component="div" className="error-msg" />
        </div>
        <div>
          <Field
            className="login-field"
            name="email"
            type="text"
            placeholder="Correo"
          />
          <ErrorMessage name="email" component="div" className="error-msg" />
        </div>
        <div>
          <Field
            className="login-field"
            name="name"
            type="text"
            placeholder="Nombre"
          />
          <ErrorMessage name="name" component="div" className="error-msg" />
        </div>
        <div>
          <Field
            className="login-field"
            name="lastName"
            type="text"
            placeholder="Apellido"
          />
          <ErrorMessage name="lastName" component="div" className="error-msg" />
        </div>
        <div>
          <Field
            className="login-field"
            name="phone"
            type="text"
            placeholder="Teléfono"
          />
          <ErrorMessage name="phone" component="div" className="error-msg" />
        </div>
        <div>
          <label>Selecciona roles:</label>
          <RolesCheckboxes />
          <ErrorMessage name="roles" component="div" className="error-msg" />
        </div>
        <Button type="submit" disabled={loading}>
          {loading && (
            <span className="spinner-border spinner-border-sm"></span>
          )}
          <span>{'Continuar >'}</span>
        </Button>
        {message && (
          <div className="form-group">
            <div className="alert alert-danger" role="alert">
              {message}
            </div>
          </div>
        )}
      </Form>
    </Formik>
  )
}

export default Register
