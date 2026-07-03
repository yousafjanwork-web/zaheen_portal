import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Html } from "@react-three/drei";
import * as THREE from "three";
import { PlanetData } from "../data/spaceData";

interface Planet3DProps {
  planet: PlanetData;
  onClick: (planet: PlanetData) => void;
  hoveredPlanet: string | null;
  setHoveredPlanet: (id: string | null) => void;
  isDetailed?: boolean;
}

export const Planet3D = ({
  planet,
  onClick,
  hoveredPlanet,
  setHoveredPlanet,
  isDetailed = false,
}: Planet3DProps) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const groupRef = useRef<THREE.Group>(null!);
  const isHovered = hoveredPlanet === planet.id;

  useFrame((state, delta) => {
    if (!isDetailed) {
      meshRef.current.rotation.y += delta * 0.5;
      const time = state.clock.getElapsedTime();
      const angle = time * planet.speed;
      groupRef.current.position.x = Math.cos(angle) * planet.distance;
      groupRef.current.position.z = Math.sin(angle) * planet.distance;
    } else {
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh
          ref={meshRef}
          onClick={(e) => {
            e.stopPropagation();
            onClick(planet);
          }}
          onPointerOver={() => {
            setHoveredPlanet(planet.id);
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            setHoveredPlanet(null);
            document.body.style.cursor = "auto";
          }}
        >
          <sphereGeometry args={[planet.size, 32, 32]} />
          <meshStandardMaterial
            color={planet.color}
            roughness={0.7}
            metalness={0.3}
            emissive={planet.color}
            emissiveIntensity={isHovered ? 0.4 : 0.1}
          />
          {!isDetailed && isHovered && (
            <Html distanceFactor={10} position={[0, planet.size + 1, 0]}>
              <div className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full whitespace-nowrap text-white font-bold text-sm pointer-events-none select-none shadow-xl">
                {planet.name.en}
              </div>
            </Html>
          )}
          {planet.id === "saturn" && (
            <mesh rotation={[Math.PI / 2.5, 0, 0]}>
              <ringGeometry args={[planet.size * 1.4, planet.size * 2.2, 64]} />
              <meshStandardMaterial
                color="#C5AB6E"
                transparent
                opacity={0.6}
                side={THREE.DoubleSide}
              />
            </mesh>
          )}
        </mesh>
      </Float>
    </group>
  );
};
