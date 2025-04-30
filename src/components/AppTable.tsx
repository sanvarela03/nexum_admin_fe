import React from 'react'

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@heroui/react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { UserResponse } from '@types/user'

import { formatearFecha } from '@utils'
import { EyeIcon, EditIcon, DeleteIcon } from '@components/icons'

import HeroInput from './HeroInput'

interface ColumnDefinition {
  name: string
  uid: string
}

// const statusColorMap = {
//   active: 'success',
//   paused: 'danger',
//   vacation: 'warning',
// }

export default function AppTable({ userList, columns }: { userList: UserResponse[], columns: ColumnDefinition[] }) {

  const [isEditOpen, setIsEditOpen] = React.useState(false)
  const [userToEdit, setUserToEdit] = React.useState<UserResponse | null>(null)
  const [isBeingUpdated, setIsBeingUpdated] = React.useState<boolean>(false)

  // 2️⃣ handler that kicks the modal open
  const onEditClick = (user: UserResponse) => {
    setUserToEdit(user)
    setIsEditOpen(true)
  }

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

        email: Yup.string().required('Correo requerido').email('Correo inválido'),

        name: Yup.string().required('Nombre requerido'),

        lastName: Yup.string().required('Apellido requerido'),

        phone: Yup.string()
          .required('Teléfono requerido')
          .matches(
            /^[\d+-]+$/,
            'El teléfono solo puede contener números, "+" o "-"'
          ),

      })
    }

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
              <Tooltip content="Details">
                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                  <EyeIcon />
                </span>
              </Tooltip>
              <Tooltip content="Edit user">
                <span
                  onClick={() => onEditClick(user)}
                  className="text-lg text-default-400 cursor-pointer active:opacity-50"
                >
                  <EditIcon />
                </span>
              </Tooltip>
              <Tooltip color="danger" content="Delete user">
                <span className="text-lg text-danger cursor-pointer active:opacity-50">
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
      <Table aria-label="Example table with custom cells">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={userList}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey as string)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Modal
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        size="md"
        isDismissable
      >
        {userToEdit && (
          <Formik
            initialValues={{
              username: userToEdit.username || "",
              firstName: userToEdit.firstName || "",
              lastName: userToEdit.lastName || "",
              email: userToEdit.email || "",
              phone: userToEdit.phone || "",
              password: "", // blank by default
            }}
            validationSchema={validationSchema} // ← use Yup here
            onSubmit={() => setIsEditOpen(false)}
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
                      Editar
                    </Button>
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
