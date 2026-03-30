import { Avatar, Card, CardBody, CardHeader, Chip, Divider } from "@heroui/react";
import { MdEmail, MdPerson } from "react-icons/md";
import { FaShieldAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import { TokenService } from "@services";
import { AuthResponse } from "@app-types/auth";

export default function ProfileView() {
  const [user, setUser] = useState<AuthResponse|null>(null)

  useEffect(() => {
    const currentUser = TokenService.getUser()
    if (currentUser) {
      setUser(currentUser)
    }
  }, [])

  return (
    <div className="min-h-screen bg-default-50 p-6">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">

        {/* Header Card */}
        <Card className="w-full">
          <CardBody>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 p-4">
              <Avatar
                className="w-24 h-24 text-large"
                isBordered
                color="primary"
                fallback={user?.username.charAt(0).toUpperCase()}
              />
              <div className="flex flex-col gap-2 text-center md:text-left">
                <h1 className="text-2xl font-bold text-default-800">
                  {user?.username}
                </h1>
                <p className="text-default-400 text-sm">{user?.email}</p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {user?.roles.map((role) => (
                    <Chip
                      key={role}
                      color="primary"
                      variant="flat"
                      size="sm"
                      startContent={<FaShieldAlt className="ml-1" />}
                    >
                      {role.replace("ROLE_", "")}
                    </Chip>
                  ))}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Info Card */}
        <Card className="w-full">
          <CardHeader className="flex gap-2 pb-0">
            <MdPerson className="text-primary text-xl" />
            <h2 className="text-lg font-semibold text-default-700">
              Información de la cuenta
            </h2>
          </CardHeader>
          <Divider className="mt-3" />
          <CardBody className="flex flex-col gap-4">

            <div className="flex items-center gap-3">
              <div className="bg-primary-100 p-2 rounded-lg">
                <MdPerson className="text-primary text-lg" />
              </div>
              <div>
                <p className="text-xs text-default-400">Usuario</p>
                <p className="text-sm text-default-700">{user?.username}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-primary-100 p-2 rounded-lg">
                <MdEmail className="text-primary text-lg" />
              </div>
              <div>
                <p className="text-xs text-default-400">Correo electrónico</p>
                <p className="text-sm text-default-700">{user?.email}</p>
              </div>
            </div>

          </CardBody>
        </Card>

        {/* Token Card */}
        <Card className="w-full">
          <CardHeader className="pb-0">
            <h2 className="text-lg font-semibold text-default-700">Tokens</h2>
          </CardHeader>
          <Divider className="mt-3" />
          <CardBody className="flex flex-col gap-4">

            <div className="flex flex-col gap-1">
              <p className="text-xs text-default-400">Access Token</p>
              <p className="text-xs text-default-400 break-all bg-default-100 p-2 rounded-lg">
                {user?.token}
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <p className="text-xs text-default-400">Refresh Token</p>
              <p className="text-xs text-default-400 break-all bg-default-100 p-2 rounded-lg">
                {user?.refreshToken}
              </p>
            </div>

          </CardBody>
        </Card>

      </div>
    </div>
  )
}