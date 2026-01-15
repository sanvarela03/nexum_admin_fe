import { useFrame, useLoader } from '@react-three/fiber'
import React, { useState, useRef } from 'react'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

interface GltfModelProps {
  modelPath: string
  scale?: number
  position?: [number, number, number]
}

export default function GltfModel({
  modelPath,
  scale = 40,
  position = [0, 0, 0],
}: GltfModelProps) {
  const ref = useRef()
  const gltf = useLoader(GLTFLoader, modelPath)
  const [hovered, hover] = useState(false)

  useFrame((state, delta) => (ref.current.rotation.y += 0.003))

  return (
    <>
      <primitive
        ref={ref}
        object={gltf.scene}
        position={position}
        scale={hovered ? scale * 1.2 : scale}
        onPointerOver={(event) => hover(true)}
        onPointerOut={(event) => hover(false)}
      />
    </>
  )
}
