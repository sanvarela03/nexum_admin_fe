import * as Yup from 'yup';
import {
  usernameValidation,
  passwordValidation,
  emailValidation,
  nameValidation,
  lastNameValidation,
  phoneValidation,
  confirmPasswordValidation,
  rolesValidation,
} from './fields/fieldValidation';

const validationMap: Record<string, Yup.AnySchema> = {
  username: usernameValidation,
  password: passwordValidation,
  confirmPassword: confirmPasswordValidation,
  email: emailValidation,
  name: nameValidation,
  lastName: lastNameValidation,
  phone: phoneValidation,
  roles: rolesValidation,
};

function createValidationSchema(fields: string[]) {
  const shape: Record<string, Yup.AnySchema> = {};

  fields.forEach(field => {
    if (validationMap[field]) {
      shape[field] = validationMap[field];
    } else {
      console.warn(`Validation for field "${field}" not found.`);
    }
  });

  return Yup.object().shape(shape);
}

export default createValidationSchema
