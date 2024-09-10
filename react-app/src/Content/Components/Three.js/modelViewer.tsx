import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';


type ModelProps = {
  path: string;
  position: [number, number, number];
  rotation: number;
};

const Model: React.FC<ModelProps> = ({ path, position, rotation }) => {
  const { scene } = useGLTF(path);
  const modelRef = useRef<THREE.Object3D>(null);

  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.position.set(...position);
      modelRef.current.rotation.y = rotation;
      modelRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
        }
      });
    }
  }, [position, rotation]);

  return <primitive object={scene} ref={modelRef} />;
};

const SceneViewer: React.FC = () => {
  const controlsRef = useRef<any>(null);


//   const moveToPosition = (position: [number, number, number], looking: [number, number, number]) => {
//     if (controlsRef.current) {
//       controlsRef.current.object.position.set(...position);
//       controlsRef.current.object.lookAt(new THREE.Vector3(...looking));
//       controlsRef.current.update();
//     }
//   };

  

  return (
    <div style={{ position: 'relative', width: '100%', height: '70vh', margin: 'auto' }}>
      <Canvas shadows gl={{ antialias: true }} style={{ background: '#505051' }}>
        <Suspense fallback={null}>
          <directionalLight 
            position={[0, 0, 0]} 
            intensity={2.4} 
            castShadow 
          />
            <pointLight position={[0,5.9,0]} intensity={125} castShadow/>
           
                  {/* <axesHelper args={[5]} /> */}
          <Model path="/Models/Last.glb" position={[0, 0, -1]} rotation={0} />

          <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
            <planeGeometry args={[100, 100]} />
            <shadowMaterial opacity={0.5} />
          </mesh>

          <OrbitControls ref={controlsRef} maxDistance={6} minDistance={2.5} maxPolarAngle={1.5} />

       
        </Suspense>
      </Canvas>
    </div>
  );
};

export default SceneViewer;