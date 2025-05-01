import * as Yup from 'yup';

export const usernameValidation: Yup.StringSchema<string> = Yup.string()
  .required('Usuario requerido')
  .min(4, 'El nombre de usuario debe tener al menos 4 caracteres')

export const passwordValidation: Yup.StringSchema<string> = Yup.string()
  .required('Contraseña requerida')
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#^()_/-])[A-Za-z\d@$!%*?&.#^()_/-]+$/,
    'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial'
  )

export const confirmPasswordValidation: Yup.StringSchema<string, Yup.AnyObject> = Yup.string()
  .required('Confirmación de contraseña requerida')
  .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden')

export const emailValidation: Yup.StringSchema<string> = Yup.string()
  .required('Correo requerido')
  .email('Correo inválido')

export const nameValidation: Yup.StringSchema<string> = Yup.string()
  .required('Nombre requerido')

export const lastNameValidation: Yup.StringSchema<string> = Yup.string()
  .required('Apellido requerido')

export const phoneValidation: Yup.StringSchema<string> = Yup.string()
  .required('Teléfono requerido')
  .matches(
    /^[\d+-]+$/,
    'El teléfono solo puede contener números, "+" o "-"'
  )

export const rolesValidation: Yup.ArraySchema<(string | undefined)[] | undefined, Yup.AnyObject, string> =
  Yup.array().of(Yup.string())
