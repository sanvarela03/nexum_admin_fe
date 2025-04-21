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

function AppNavbar() {
  const location = useLocation()
  return (
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
              src="../../public/nexum-v2.svg"
              width={60}
            />
            <p className="font-bold text-inherit">NEXUM</p>
          </NavbarBrand>
          <NavbarContent className="hidden sm:flex gap-4" justify="center">
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
          <NavbarContent justify="end">
            <NavbarItem className="hidden lg:flex">
              <Link href="/login">Ingresar</Link>
            </NavbarItem>
            <NavbarItem>
              <Button as={Link} color="primary" href="/signup" variant="flat">
                Registrarse
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Divider orientation="vertical" className="h-4" />
            </NavbarItem>
            <NavbarItem>
              <SwitchMode />
            </NavbarItem>
          </NavbarContent>
        </div>
      </Navbar>
    </div>
  )
}

export default AppNavbar
