import { UserService }  from '@services'
import './users.css'
import { useEffect, useState } from 'react'
import { Session, UserEdit, UserResponse } from '@app-types/user'
import { AppTable, HeroInput } from '@components'
import { addToast, Button, Chip, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tooltip, User } from '@heroui/react'
import { formatearFecha, createValidationSchema, formatearFechaLegible } from '@utils';
import { EditIcon, EyeIcon } from '@components/icons'
import React from 'react'
import { Formik, Form } from 'formik'
import { MdLogout, MdPersonAdd, MdPersonOff } from "react-icons/md";

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

export default function Users() {
  const [users, setUsers] = useState<UserResponse[]>([])
  const [isEditOpen, setIsEditOpen] = React.useState(false)
  const [sessions, setSessions] = useState<Session[]>([])
  const [isSessionOpen, setIsSessionOpen] = React.useState(false)
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

  const onSessionClick = (sessions: Session[]) => {
    setSessions(sessions)
    setIsSessionOpen(true)
  }

  const disableUser = async (user: UserResponse) => {
    try {
      await UserService.disableUser(user.userId)
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
      setUsers(response.data.map(u => {u.imgUrl = null; return u;}) || [])
      showToast('Lista de usuarios', 'Se cargó la lista de usuarios exitosamente', 'success')
    } catch (error) {
      showToast('Lista de usuarios', 'Error cargando la lista de usuarios', 'danger')
      console.error('Error fetching users:', error)
    }
  }

  const logoutUser = async (user: UserResponse) => {
    try {
      await UserService.logoutUser(user.userId)
      showToast('Cerrar sesión', 'Se cerró la sesión del usuario exitosamente', 'success')
    } catch (error) {
      showToast('Cerrar sesión', 'Error al cerrar la sesión del usuario', 'danger')
      console.error('Error logging out user:', error)
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
    { name: 'ID', uid: 'userId' },
    { name: 'NOMBRE', uid: 'firstName' },
    { name: 'USUARIO', uid: 'username' },
    { name: 'ROLES', uid: 'roles' },
    { name: 'SESIONES ACTIVAS', uid: 'sessions' },
    { name: 'ESTADO', uid: 'isEnabled' },
    { name: 'ÚLTIMO INICIO DE SESIÓN', uid: 'lastLogin' },
    { name: 'INGRESO A LA PLATAFORMA', uid: 'dateJoined' },
    { name: 'ACCIONES', uid: 'actions' },
  ]

  const getColorFromString = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 60%, 50%)`;
  };

  const renderCell = React.useCallback(
    (user: UserResponse, columnKey: string) => {
      const cellValue = user[columnKey as keyof UserResponse]

      switch (columnKey) {
        case 'userId':
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">{user.userId}</p>
            </div>
          )
        case 'firstName': {
          const fullName = `${user.firstName} ${user.lastName}`;
          const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();

          const fallbackColor = getColorFromString(fullName);

          const isFallback = !user.imgUrl;

          console.log(`Rendering user ${fullName} with fallback color ${fallbackColor} and isFallback=${isFallback}`)

          return (
            <User
              name={fullName}
              description={user.email}
              avatarProps={{
                radius: 'lg',
                src: user.imgUrl || undefined,
                name: initials,
                style: !user.imgUrl
                  ? { backgroundColor: getColorFromString(fullName), color: 'white' }
                  : undefined,
              }}
            >
              {user.email}
            </User>
          );
        }
        case 'roles':
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

        case 'lastLogin':
          return (
            <Tooltip
              content={
                <span className="text-xs">
                  {formatearFechaLegible(user.lastLogin)}
                </span>
              }
            >
              <div className="flex flex-col">
                <p className="text-bold text-sm capitalize text-default-400">
                  {formatearFecha(user.lastLogin)}
                </p>
              </div>
            </Tooltip>
          )

        case 'dateJoined':
          return (
            <Tooltip
              content={
                <span className="text-xs">
                  {formatearFechaLegible(user.dateJoined)}
                </span>
              }
            >
              <div className="flex flex-col">
                <p className="text-bold text-sm capitalize text-default-400">
                  {formatearFecha(user.dateJoined)}
                </p>
              </div>
            </Tooltip>
          )
        case 'username':
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">{user.username}</p>
            </div>
          )
        case 'sessions':
          return (
            <div
              onClick={() => {
                if (user.sessions.length) {
                  onSessionClick(user.sessions)
                }
              }}
              className="flex flex-col items-center">
              <p className="text-bold text-sm capitalize underline">{user.sessions.length}</p>
            </div>
          )
        case 'isEnabled':
          return (
            <Chip
              className="capitalize"
              color={user.isEnabled ? 'success' : 'danger'}
              size="sm"
              variant="flat"
            >
              {user.isEnabled ? 'active' : 'disabled'}
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
              <Tooltip
                color={user.isEnabled ? "danger" : "success"}
                content={user.isEnabled ? "Deshabilitar usuario" : "Habilitar usuario"}
              >
                <span
                  onClick={() => disableUser(user)}
                  className={`text-lg cursor-pointer active:opacity-50 ${
                    user.isEnabled ? "text-danger" : "text-success"
                  }`}
                >
                  {user.isEnabled ? <MdPersonOff /> : <MdPersonAdd />}
                </span>
              </Tooltip>
              {user.sessions.length > 0 && (
                <Tooltip color="warning" content="Cerrar sesión del usuario">
                  <span
                    onClick={() => logoutUser(user)}
                    className="text-lg text-warning cursor-pointer active:opacity-50"
                  >
                    <MdLogout />
                  </span>
                </Tooltip>)
              }
            </div>
          )
        default:
          return JSON.stringify(cellValue)
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
              id: userToEdit.userId || 0,
              username: userToEdit.username || "",
              name: userToEdit.firstName || "",
              lastName: userToEdit.lastName || "",
              email: userToEdit.email || "",
              phone: userToEdit.phone || "",
              password: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleUserEdit}
          >
            {({ isValid, dirty }) => (
              <Form className="space-y-4">
                <ModalContent>
                  <ModalHeader>Editar Usuario</ModalHeader>
                  <ModalBody>
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
                  </ModalBody>
                  <ModalFooter className="flex justify-end gap-2">
                    <Button
                      variant="flat"
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
      <Modal
        isOpen={isSessionOpen}
        onOpenChange={setIsSessionOpen}
        size="md"
        isDismissable
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <span>Sesiones activas</span>
            <span className="text-sm text-default-400 font-normal">
              {sessions.length} sesión(es) encontrada(s)
            </span>
          </ModalHeader>
          <ModalBody className="pb-6 overflow-y-auto max-h-[60vh]">
            <div className="flex flex-col gap-6">
              {sessions.map((session, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-4 border border-default-200 rounded-lg p-4"
                >
                  <p className="text-sm font-bold text-default-700">
                    Sesión {index + 1} de {sessions.length}
                  </p>

                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold text-default-600">Dispositivo</p>
                    <p className="text-sm text-default-400">{session.deviceName}</p>
                  </div>

                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold text-default-600">Token</p>
                    <p className="text-xs text-default-400 break-all bg-default-100 p-2 rounded-lg">
                      {session.token}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold text-default-600">Fecha de creación</p>
                    <p className="text-sm text-default-400">
                      {formatearFechaLegible(session.sessionCreatedAt)}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold text-default-600">Fecha de expiración</p>
                    <p className="text-sm text-default-400">
                      {formatearFechaLegible(session.sessionExpiryDate)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
