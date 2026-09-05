"use client";

import { Canvas, useFrame } from '@react-three/fiber';
import {
  Html,
  OrbitControls,
  Environment,
  ContactShadows,
} from '@react-three/drei';
import { Suspense, useRef, useMemo } from 'react';
import * as THREE from 'three';

// Floating geometric shapes (procedural, no model loading)
function FloatingShapes() {
  const meshes = useRef<THREE.Mesh[]>([]);
  const elapsedRef = useRef(0);

  useFrame((state, delta) => {
    elapsedRef.current += delta;
    const time = elapsedRef.current;
    
    meshes.current.forEach((mesh, i) => {
      mesh.rotation.x += delta * (0.1 + i * 0.05);
      mesh.rotation.y += delta * (0.15 + i * 0.03);
      
      // Gentle floating motion
      mesh.position.y += Math.sin(time + i) * delta * 0.3;
      mesh.position.x += Math.cos(time + i * 2) * delta * 0.2;
    });
  });

  return (
    <>
      {/* Solar Panel - Main Hero Object */}
      <group position={[0, 0.5, 0]}>
        <mesh
          ref={(el) => meshes.current[0] = el!}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[3.5, 0.15, 2.2]} />
          <meshPhysicalMaterial
            color="#1a1a2e"
            metalness={0.3}
            roughness={0.4}
            clearcoat={0.5}
            clearcoatRoughness={0.1}
          />
        </mesh>
        
        {/* Solar cells grid */}
        <group position={[0, 0.1, 0]}>
          {Array.from({ length: 6 }).map((_, row) =>
            Array.from({ length: 10 }).map((_, col) => (
              <mesh
                key={`${row}-${col}`}
                position={[
                  -1.55 + col * 0.34,
                  0.02,
                  -0.9 + row * 0.36
                ]}
                castShadow
              >
                <boxGeometry args={[0.28, 0.02, 0.28]} />
                <meshPhysicalMaterial
                  color="#0d1b2a"
                  metalness={0.8}
                  roughness={0.1}
                  clearcoat={1}
                  clearcoatRoughness={0.05}
                  emissive="#003d6b"
                  emissiveIntensity={0.15}
                />
              </mesh>
            ))
          )}
        </group>
        
        {/* Frame */}
        <mesh position={[0, 0.05, 0]} castShadow>
          <boxGeometry args={[3.7, 0.25, 2.4]} />
          <meshStandardMaterial color="#2d2d44" metalness={0.5} roughness={0.3} />
        </mesh>
      </group>

      {/* Floating Energy Particles */}
      <EnergyParticles count={150} radius={4} />

      {/* Inverter Box */}
      <group position={[-3.5, -0.5, 2]}>
        <mesh
          ref={(el) => meshes.current[1] = el!}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[1.2, 1.8, 0.8]} />
          <meshPhysicalMaterial
            color="#1e1e3f"
            metalness={0.4}
            roughness={0.3}
            clearcoat={0.3}
          />
        </mesh>
        <mesh position={[0, 0, 0.42]} castShadow>
          <planeGeometry args={[0.8, 1.2]} />
          <meshStandardMaterial
            color="#000"
            emissive="#00ff88"
            emissiveIntensity={0.3}
          />
        </mesh>
      </group>

      {/* Battery */}
      <group position={[3.5, -0.3, -2]}>
        <mesh
          ref={(el) => meshes.current[2] = el!}
          castShadow
          receiveShadow
        >
          <cylinderGeometry args={[0.6, 0.6, 1.5, 16]} />
          <meshPhysicalMaterial
            color="#2a2a4a"
            metalness={0.6}
            roughness={0.2}
            clearcoat={0.5}
          />
        </mesh>
        <mesh position={[0, 0.85, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
          <meshStandardMaterial color="#444" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0.62]} castShadow>
          <cylinderGeometry args={[0.55, 0.55, 0.05, 16]} />
          <meshStandardMaterial
            color="#00ff88"
            emissive="#00ff88"
            emissiveIntensity={0.5}
          />
        </mesh>
      </group>
    </>
  );
}

// Energy particles flowing between components
function EnergyParticles({ count = 100, radius = 5 }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const seed = (i * 9301 + 49297) % 233280;
      const normalized = seed / 233280;
      const theta = normalized * Math.PI * 2;
      const phi = Math.acos(2 * (((i * 37) % 101) / 100) - 1);
      const r = radius * (0.5 + (((i * 53) % 101) / 100) * 0.5);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count, radius]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  const material = useMemo(() =>
    new THREE.PointsMaterial({
      color: 0xffaa00,
      size: 0.04,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }), []);

  const ref = useRef<THREE.Points>(null);
  const elapsedRef = useRef(0);
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.05;
      ref.current.rotation.x += delta * 0.02;
      
      const pos = ref.current.geometry.attributes.position;
      elapsedRef.current += delta;
      const time = elapsedRef.current;
      for (let i = 0; i < count; i++) {
        pos.array[i * 3 + 1] += Math.sin(time + i * 0.1) * delta * 0.1;
      }
      pos.needsUpdate = true;
    }
  });

  return <points ref={ref} geometry={geometry} material={material} />;
}

// Sun light with animated rays
function SunLight() {
  return (
    <>
      <directionalLight
        position={[10, 15, 5]}
        intensity={3}
        color="#fff8e7"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={50}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
        shadow-bias={-0.0001}
      />
      <ambientLight color="#fff8e7" intensity={0.5} />
      
      {/* Sun glow */}
      <mesh position={[10, 15, 5]}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial
          color="#fff8e7"
          transparent
          opacity={0.15}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}

// Ground plane with subtle grid
function GroundPlane() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
        <planeGeometry args={[50, 50, 50, 50]} />
        <meshStandardMaterial
          color="#0a0a1a"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>
      <ContactShadows opacity={0.4} scale={20} blur={2} far={10} />
    </>
  );
}

// Main Scene Component
function HeroSceneContent() {
  return (
    <>
      <SunLight />
      <GroundPlane />
      <FloatingShapes />
      <Environment
        preset="warehouse"
        background={false}
        ground={false}
      />
    </>
  );
}

export function HeroScene() {
  return (
    <div className="relative w-full h-full min-h-[360px] sm:min-h-[500px] lg:min-h-[600px]">
      <Canvas
        gl={{ 
          antialias: true, 
          alpha: true, 
          powerPreference: 'high-performance',
          preserveDrawingBuffer: true,
          logarithmicDepthBuffer: true,
        }}
        camera={{ position: [0, 2, 6], fov: 35 }}
        shadows="percentage"
        dpr={[1, 1.5]}
        className="w-full h-full"
      >
        <Suspense fallback={<Html center className="text-orange-500">Loading 3D Scene...</Html>}>
          <HeroSceneContent />
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          autoRotate={true}
          autoRotateSpeed={0.3}
          target={[0, 0, 0]}
          minPolarAngle={0.4}
          maxPolarAngle={1.2}
        />
      </Canvas>
      
      {/* Decorative overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-8 left-8 w-32 h-0.5 bg-gradient-to-r from-orange-500 to-transparent" />
        <div className="absolute top-8 left-8 w-0.5 h-32 bg-gradient-to-b from-orange-500 to-transparent" />
        <div className="absolute bottom-8 right-8 w-32 h-0.5 bg-gradient-to-l from-amber-500 to-transparent" />
        <div className="absolute bottom-8 right-8 w-0.5 h-32 bg-gradient-to-t from-amber-500 to-transparent" />
      </div>
    </div>
  );
}
