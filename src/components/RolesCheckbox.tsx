import React from 'react'
import { useFormikContext } from 'formik'
import { Checkbox, CheckboxGroup } from '@heroui/react'
import { Values } from '../pages/Signup/Signup' // Adjust the import if needed

// List of available roles
const availableRoles = [
  'Administrador',
  'Moderador',
  'Cliente',
  'Trabajador',
]

const RolesCheckboxes = ({ name }: { name: string }) => {
  const { values, setFieldValue } = useFormikContext<Values>()

  console.log('name', name)

  // This function will be called for each checkbox toggle.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const role = e.target.value
    const currentRoles: string[] = values.roles || []

    if (e.target.checked) {
      setFieldValue('roles', [...currentRoles, role])
    } else {
      setFieldValue(
        'roles',
        currentRoles.filter((r) => r !== role)
      )
    }
  }

  return (
    <div role="group" aria-labelledby="checkbox-group">
      <CheckboxGroup>
        <p>Roles</p>
        {availableRoles.map((role) => (
          <Checkbox key={role} value={role} onChange={handleChange}>
            {role}
          </Checkbox>
        ))}
      </CheckboxGroup>
    </div>
  )
}

export default RolesCheckboxes
