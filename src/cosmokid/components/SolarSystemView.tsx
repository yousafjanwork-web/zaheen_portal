import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars as DreiStars, PerspectiveCamera } from "@react-three/drei";
import { Planet3D } from "./Planet3D";
import { PLANETS, PlanetData } from "../data/spaceData";

interface SolarSystemViewProps {
  onPlanetClick: (planet: PlanetData) => void;
  hoveredPlanet: string | null;
  setHoveredPlanet: (id: string | null) => void;
}

export const SolarSystemView = ({ onPlanetClick, hoveredPlanet, setHoveredPlanet }: SolarSystemViewProps) => {
  return (
    <div className="w-full h-full cursor-grab active:cursor-grabbing">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 40, 100]} fov={45} />
        <OrbitControls enablePan={false} minDistance={20} maxDistance={200} autoRotate={false} />
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 0, 0]} intensity={3} color="#FFCC00" castShadow />
        <Suspense fallback={null}>
          <mesh>
            <sphereGeometry args={[6, 32, 32]} />
            <meshStandardMaterial color="#FFD700" emissive="#FF8C00" emissiveIntensity={2} />
          </mesh>
          {PLANETS.map((planet) => (
            <React.Fragment key={planet.id}>
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[planet.distance - 0.1, planet.distance + 0.1, 128]} />
                <meshBasicMaterial color="white" transparent opacity={0.1} />
              </mesh>
              <Planet3D planet={planet} onClick={onPlanetClick} hoveredPlanet={hoveredPlanet} setHoveredPlanet={setHoveredPlanet} />
            </React.Fragment>
          ))}
          <DreiStars radius={300} depth={60} count={20000} factor={7} saturation={0} fade speed={1} />
        </Suspense>
      </Canvas>
    </div>
  );
};
