import { Canvas, useThree } from '@react-three/fiber'
import {
  GizmoHelper,
  GizmoViewport,
  OrbitControls,
  PerspectiveCamera,
} from '@react-three/drei'
import { Suspense, useEffect, useRef, useState } from 'react'
import GltfModel from './GltfModel'
import { Model } from './NEXUM-BASE-3'
import * as THREE from 'three'

const Experience = () => {
  return (
    <>
      <OrbitControls />
      <mesh>
        <boxGeometry />
        <meshNormalMaterial />
      </mesh>
    </>
  )
}

export default function Test3D() {
  function CameraHelper() {
    const camera = new THREE.PerspectiveCamera(60, 1, 1, 3)
    return (
      <group position={[3, 2, 8]}>
        <cameraHelper args={[camera]} />
      </group>
    )
  }

  function ActiveCameraHelper() {
    const { scene, camera } = useThree()
    const helperRef = useRef<THREE.CameraHelper>()

    useEffect(() => {
      const helper = new THREE.CameraHelper(camera)
      scene.add(helper)
      return () => {
        scene.remove(helper)
      }
    }, [camera, scene])

    return null
  }

  return (
    <div className="p-4">
      {/* border-2 border-red-500 rounded-lg p-2 w-96 h-96 */}
      <div className=" p-2 w-96 h-96">
        <Canvas camera={{ fov: 65, position: [8, 2, 2] }}>
          <ambientLight intensity={7} />
          <OrbitControls enableZoom={true} target={[-0.061, 0.056, -0.037]} />
          {/* <ActiveCameraHelper /> */}
          <Model />
          <gridHelper args={[10, 10]} />
          <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
            <GizmoViewport
              axisColors={['red', 'green', 'blue']}
              labelColor="white"
            />
          </GizmoHelper>
        </Canvas>
      </div>
    </div>
  )
}
