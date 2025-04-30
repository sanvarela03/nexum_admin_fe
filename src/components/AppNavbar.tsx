import {
  Button,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Image,
  Divider,
} from '@heroui/react'
import { NavigateFunction, useLocation, useNavigate } from 'react-router-dom'
import SwitchMode from './SwitchMode'
import { TokenService, AuthService } from '@services'

function AppNavbar() {
  const location = useLocation()
  const token = TokenService.getLocalAccessToken()
  const navigate: NavigateFunction = useNavigate()

  const onSignOut = async () => {
    await AuthService.logout()
    navigate('/login')
  }

  return (
    <Navbar
      shouldHideOnScroll={false}
      isBordered
      className="py-4"
      height="2rem"
      maxWidth="full"
    >
      <div className="flex w-full items-center justify-between">
        {/* Navbar Brand - Left-aligned logo */}
        <NavbarBrand className="flex items-center gap-3">
          <Image
            isZoomed
            isBlurred
            alt="HeroUI Album Cover"
            radius="md"
            src="/nexum-v2.svg"
            width={60}
          />
          <p className="font-bold text-inherit">NEXUM</p>
        </NavbarBrand>

        {/* Center Navigation Links (Hidden on small screens) */}
        <NavbarContent className="hidden lg:flex gap-4" justify="center">
          <NavbarItem>
            <Link color="foreground" href="/home">
              Inicio
            </Link>
          </NavbarItem>
          <NavbarItem isActive={location.pathname === '/'}>
            <Link color="foreground" aria-current="page" href="/">
              Administrador
            </Link>
          </NavbarItem>
        </NavbarContent>

        {/* Right Side (Login, Signup, Theme Switch) */}
        <NavbarContent justify="end">
          {token ? (
            <NavbarItem>
              <Button as={Link} color="danger" href="/signup" variant="flat" onClick={onSignOut}>
                Cerrar Sesión
              </Button>
            </NavbarItem>
          ) : (
            <>
              <NavbarItem>
                <Link href="/login">Ingresar</Link>
              </NavbarItem>
              <NavbarItem>
                <Button as={Link} color="primary" href="/signup" variant="flat">
                  Registrarse
                </Button>
              </NavbarItem>
            </>
          )}

          <NavbarItem>
            <Divider orientation="vertical" className="h-4" />
          </NavbarItem>

          <NavbarItem>
            <SwitchMode />
          </NavbarItem>
        </NavbarContent>
      </div>
    </Navbar>
  )
}

export default AppNavbar
