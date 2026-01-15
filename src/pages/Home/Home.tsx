// import { Button } from '@heroui/react'
// import { Image } from '@heroui/react'
import Test3D from '../../components/3D/Test3D'
import SparklingSphere from '../../components/SparklingSphere'

function Home() {
  return (
    <div className="relative h-full w-full">
      <div className="absolute bottom-0 left-0 right-0 top-0 dark:bg-[radial-gradient(circle_500px_at_50%_200px,#3e3e3e,transparent)]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
          <div className="grid grid-cols-2 gap-4  rounded-lg ">
            <div className="flex items-center justify-center">
              {/* <Image
          isZoomed
          isBlurred
          alt="HeroUI Album Cover"
          radius="md"
          src="/nexum-v2.svg"
          width={500}
          /> */}

              {/* <SparklingSphere /> */}
              <Test3D />
            </div>
            <div className="flex flex-col justify-center  gap-6">
              <div className="mt-0">
                <h2 className="text-2xl font-extrabold mb-2">¿Qué es Nexum?</h2>
                <p className="text-justify">
                  Nexum es una plataforma digital que conecta a trabajadores
                  calificados del sector de la construcción con clientes que
                  requieren servicios seguros, justos y confiables. Nuestra
                  misión es dignificar el trabajo, formalizar el sector y
                  fomentar prácticas sostenibles en cada proyecto de
                  construcción.
                </p>
              </div>
              <div className="">
                <h2 className="text-2xl font-extrabold mb-2">
                  ¿Cómo funciona?
                </h2>
                <p className="text-justify">
                  Nexum funciona como un puente entre trabajadores y clientes.
                  Los trabajadores pueden registrarse en la plataforma, crear su
                  perfil y ofrecer sus servicios. Los clientes pueden buscar
                  trabajadores según sus necesidades, revisar perfiles y
                  contratar a los más adecuados para sus proyectos. Además,
                  Nexum ofrece herramientas de gestión y pago seguro para
                  facilitar la relación laboral.
                </p>
              </div>
            </div>
            <div className="p-2">
              <h2 className="text-2xl font-extrabold mb-2">Misión</h2>
              <p className="text-justify">
                La misión de Nexum es conectar a trabajadores calificados del
                sector de la construcción con clientes que requieren servicios
                seguros, justos y confiables. Lo hacemos mediante una plataforma
                digital inclusiva y accesible, que promueve la formalización
                laboral y genera oportunidades de empleo digno.
              </p>
            </div>
            <div className="p-2">
              <h2 className="text-2xl font-extrabold mb-2">Visión</h2>
              <p className="text-justify">
                La visión de Nexum es transformar la industria de la
                construcción en América Latina hacia un modelo moderno e
                inclusivo, impulsando la innovación tecnológica. Aspiramos a ser
                la plataforma líder en la región, expandiendo nuestro impacto
                social y ambiental con proyectos que generen desarrollo, empleo
                digno y formalización del sector.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
