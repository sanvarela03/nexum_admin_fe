import { Button } from '@heroui/react'
import React from 'react'
import SwitchMode from '../components/SwitchMode'

function Home() {
  return (
    <>
      <p>Hi</p>
      <Button
        radius="md"
        isLoading
        startContent={<p>😎</p>}
        endContent={<p>😉</p>}
      >
        Click me
      </Button>
      <Button isIconOnly radius="full">
        <p>🚀</p>
      </Button>
    </>
  )
}

export default Home
