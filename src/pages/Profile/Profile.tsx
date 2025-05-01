import { TokenService, UserService }  from '@services'
import './profile.css'
import { useEffect, useState } from 'react'
import { UserEdit, UserResponse } from '@types/user'
import { AppTable, HeroInput } from '@components'
import { addToast, Button, Chip, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tooltip, User } from '@heroui/react'
import { formatearFecha, createValidationSchema } from '@utils';
import { DeleteIcon, EditIcon, EyeIcon } from '@components/icons'
import React from 'react'
import { Formik, Form } from 'formik'

interface UserEditForm {
  id: number
  username: string
  email: string
  password: string
  name: string
  lastName: string
  phone: string
}

type ColorToast = 'default' | 'foreground' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | undefined

export default function Profile() {
  const user = TokenService.getUser()

  const [users, setUsers] = useState<UserResponse[]>([])
  const [isEditOpen, setIsEditOpen] = React.useState(false)
  const [userToEdit, setUserToEdit] = React.useState<UserResponse | null>(null)
  const [isVisible, setIsVisible] = React.useState<boolean>(false)
  const [isBeingUpdated, setIsBeingUpdated] = React.useState<boolean>(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const toggleVisibility = () => setIsVisible(!isVisible)

  const showToast = (toastTitle: string, toastMessage: string, toastType: ColorToast) => {
    addToast({
      hideIcon: true,
      title: toastTitle,
      description: toastMessage,
      classNames: {
        closeButton: "opacity-100 absolute top-2 right-2",
      },
      closeIcon: (
        <svg
          fill="none"
          height="32"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="32"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      ),
      color: toastType,
    })
  }

  const onEditClick = (user: UserResponse) => {
    setUserToEdit(user)
    setIsEditOpen(true)
  }

  const disableUser = async (user: UserResponse) => {
    try {
      await UserService.disableUser(user.id)
      fetchUsers()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      showToast('Deshabilitar usuario', 'Error al dehabilitar al usuario', 'danger')
      console.error('Error disabling user:', error)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await UserService.getUsers()
      setUsers(response.data || [])
      showToast('Lista de usuarios', 'Se cargó la lista de usuarios exitosamente', 'success')
    } catch (error) {
      showToast('Lista de usuarios', 'Error cargando la lista de usuarios', 'danger')
      console.error('Error fetching users:', error)
    }
  }

  const handleUserEdit = async (formValues: UserEditForm) => {
    setIsBeingUpdated(true)
    setErrorMessage('')
    try {
      const userEdit: UserEdit = {
        id: formValues.id,
        firstName: formValues.name,
        lastName: formValues.lastName,
        username: formValues.username,
        email: formValues.email,
        phone: String(formValues.phone),
        password: formValues.password,
      }
      await UserService.editUser(userEdit)
      setIsEditOpen(false)
      setIsBeingUpdated(false)
      showToast('Editar usuario', 'El usuario se editó exitosamente', 'success')
      setTimeout(() => fetchUsers(), 3000)
    } catch (error) {
      setIsBeingUpdated(false)
      showToast('Error', 'Error al editar al usuario', 'danger')
      console.error(error)
    }
  }

  const validationSchema = createValidationSchema([
    'username',
    'password',
    'email',
    'name',
    'lastName',
    'phone',
  ])

  useEffect(() => {
    fetchUsers()
  }, [])

  const columns = [
    { name: 'ID', uid: 'id' },
    { name: 'NOMBRE', uid: 'name' },
    { name: 'USUARIO', uid: 'username' },
    { name: 'ROLES', uid: 'role' },
    { name: 'ESTADO', uid: 'status' },
    { name: 'ULTIMO INGRESO', uid: 'last_login' },
    { name: 'INGRESO', uid: 'date_joined' },
    { name: 'ACCIONES', uid: 'actions' },
  ]

  const renderCell = React.useCallback(
    (user: UserResponse, columnKey: string) => {
      const cellValue = user[columnKey as keyof UserResponse]

      switch (columnKey) {
        case 'id':
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">{user.id}</p>
            </div>
          )
        case 'name':
          return (
            <User
              avatarProps={{ radius: 'lg', src: user.imgUrl }}
              description={user.email}
              name={user.firstName + ' ' + user.lastName}
            >
              {user.email}
            </User>
          )
        case 'role':
          return user.roles.map((role: string) => (
            <Chip
              key={role}
              className="capitalize"
              color={'primary'}
              size="sm"
              variant="flat"
            >
              {role}
            </Chip>
          ))

        case 'last_login':
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize text-default-400">
                {formatearFecha(user.lastLogin)}
              </p>
            </div>
          )

        case 'date_joined':
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize text-default-400">
                {formatearFecha(user.dateJoined)}
              </p>
            </div>
          )
        case 'username':
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">{user.username}</p>
            </div>
          )
        case 'status':
          return (
            <Chip
              className="capitalize"
              color={user.enabled ? 'success' : 'danger'}
              size="sm"
              variant="flat"
            >
              {user.enabled ? 'active' : 'disabled'}
            </Chip>
          )
        case 'actions':
          return (
            <div className="relative flex items-center gap-2">
              <Tooltip content="Detalles">
                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                  <EyeIcon />
                </span>
              </Tooltip>
              <Tooltip content="Editar usuario">
                <span
                  onClick={() => onEditClick(user)}
                  className="text-lg text-default-400 cursor-pointer active:opacity-50"
                >
                  <EditIcon />
                </span>
              </Tooltip>
              <Tooltip color="danger" content="Deshabilitar usuario">
                <span
                  onClick={() => disableUser(user)}
                  className="text-lg text-danger cursor-pointer active:opacity-50"
                >
                  <DeleteIcon />
                </span>
              </Tooltip>
            </div>
          )
        default:
          return cellValue
      }
    },
    []
  )

  return (
    <>
      <div className="profile-container">
        <div>
          <AppTable list={users || []} columns={columns} renderCell={renderCell}/>
        </div>
      </div>
      <Modal
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        size="md"
        isDismissable
      >
        {userToEdit && (
          <Formik
            initialValues={{
              id: userToEdit.id || 0,
              username: userToEdit.username || "",
              name: userToEdit.firstName || "",
              lastName: userToEdit.lastName || "",
              email: userToEdit.email || "",
              phone: userToEdit.phone || "",
              password: "",
            }}
            validationSchema={validationSchema} // ← use Yup here
            onSubmit={handleUserEdit}
          >
            {({ isValid, dirty }) => (
              <Form className="space-y-4">
                <ModalContent>
                  <ModalHeader>Editar Usuario</ModalHeader>
                  <ModalBody>
                    {/** Same fields as before **/}
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

                    {/* firstName, lastName, email, phone… */}
                  </ModalBody>
                  <ModalFooter className="flex justify-end gap-2">
                    <Button
                      variant="flat" // or "flat"
                      size="sm"
                      onClick={() => setIsEditOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      variant="solid"
                      size="sm"
                      color="primary"
                      disabled={isBeingUpdated || !isValid || !dirty}
                      className={`transition-opacity ${
                        isBeingUpdated || !isValid || !dirty
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      { isBeingUpdated ? 'Editando...' : 'Editar' }
                    </Button>
                    { errorMessage && <div className="error-msg">{errorMessage}</div> }
                  </ModalFooter>
                </ModalContent>
              </Form>
            )}
          </Formik>
        )}
      </Modal>
    </>
  )
}
