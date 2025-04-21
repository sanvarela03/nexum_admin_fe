import { useField } from 'formik'
import { Input } from '@heroui/react'
import { EyeFilledIcon, EyeSlashFilledIcon } from './PasswordIcons'

interface HeroInputProps {
  label?: string
  name: string
  type: string
  placeholder?: string
  className?: string
  isPassword?: boolean
  isVisible?: boolean
  toggleVisibility?: () => void
}

const HeroInput = ({ label, ...props }: HeroInputProps) => {
  const [field, meta] = useField(props)

  const isInvalid = meta.touched && !!meta.error

  return (
    <>
      {label && <label htmlFor={props.name}>{label}</label>}
      <Input
        {...field}
        {...props}
        id={props.name}
        isInvalid={isInvalid}
        type={
          props.isPassword
            ? props.isVisible
              ? 'text'
              : 'password'
            : props.type
        }
        endContent={
          props.isPassword && (
            <button
              aria-label="toggle password visibility"
              className="focus:outline-none"
              type="button"
              onClick={props.toggleVisibility}
            >
              {props.isVisible ? (
                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          )
        }
      />

      {isInvalid && <div className="error-msg">{meta.error}</div>}
    </>
  )
}

export default HeroInput
