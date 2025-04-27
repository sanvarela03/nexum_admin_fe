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
import { useLocation } from 'react-router-dom'
import SwitchMode from './SwitchMode'
import TokenService from '../services/token.service'

function AppNavbar() {
  const location = useLocation()
  const token = TokenService.getLocalAccessToken()

  return (
<<<<<<< Updated upstream
    <div>
      <Navbar
        shouldHideOnScroll={false}
        isBordered
        className="w-full py-4"
        height="2rem"
        maxWidth="lg"
      >
        <div className="flex w-full items-center justify-between px-4">
          <NavbarBrand className="flex-row gap-5 mr-10 ml-0">
            {/* <img
            className="h-45 w-45  object-cover"
            src="../../public/nexum-v2.svg"
            alt=""
            /> */}
            <Image
              isZoomed
              isBlurred
              alt="HeroUI Album Cover"
              className="mr-3"
              radius="md"
              src="/nexum-v2.svg"
              width={60}
            />
            <p className="font-bold text-inherit">NEXUM</p>
          </NavbarBrand>
          <NavbarContent className="hidden sm:flex gap-4" justify="center">
=======
    <Navbar shouldHideOnScroll={false} isBordered className="w-full py-4" height="2rem" maxWidth="lg">
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
            <Link color="foreground" href="/home">Inicio</Link>
          </NavbarItem>
          <NavbarItem isActive={location.pathname === '/'}>
            <Link color="foreground" aria-current="page" href="/">Administrador</Link>
          </NavbarItem>
        </NavbarContent>

        {/* Right Side (Login, Signup, Theme Switch) */}
        <NavbarContent justify="end">
          {token ? (
>>>>>>> Stashed changes
            <NavbarItem>
              <Button as={Link} color="danger" href="/signup" variant="flat">
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
