import React, { useMemo } from 'react';
import * as THREE from 'three';
import { createRoundedRectShape, PHONE_DEPTH } from './PhoneFrame';

export const RearCameraAssembly: React.FC = () => {
  // Camera island rounded plateau shape
  const plateauShape = useMemo(() => {
    return createRoundedRectShape(1.65, 1.65, 0.4);
  }, []);

  const plateauExtrude: THREE.ExtrudeGeometryOptions = useMemo(() => ({
    depth: 0.1,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.04,
    bevelThickness: 0.04,
  }), []);

  // Three large Pro lens positions (triangular layout)
  const lenses = [
    { id: 'main', x: -0.38, y: 0.38, label: '48MP Main' },
    { id: 'ultrawide', x: -0.38, y: -0.38, label: '48MP Ultra Wide' },
    { id: 'telephoto', x: 0.38, y: 0.0, label: '12MP 5x Telephoto' },
  ];

  return (
    <group position={[-0.78, 2.35, -PHONE_DEPTH / 2 - 0.06]}>
      {/* 1. Camera Plateau Island (raised glass with frosted satin finish) */}
      <mesh castShadow receiveShadow>
        <extrudeGeometry args={[plateauShape, plateauExtrude]} />
        <meshPhysicalMaterial
          color="#22201D"
          roughness={0.25}
          metalness={0.5}
          clearcoat={0.8}
          clearcoatRoughness={0.15}
        />
      </mesh>

      {/* 2. Three Triangular Pro Lenses */}
      {lenses.map((lens) => (
        <group key={lens.id} position={[lens.x, lens.y, -0.1]}>
          {/* Raised Titanium Lens Outer Ring */}
          <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.34, 0.34, 0.12, 32]} />
            <meshStandardMaterial
              color="#A39E96"
              metalness={0.92}
              roughness={0.2}
            />
          </mesh>

          {/* Stepped Inner Black Barrel */}
          <mesh position={[0, 0, -0.06]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.26, 0.26, 0.04, 32]} />
            <meshStandardMaterial color="#111111" roughness={0.6} />
          </mesh>

          {/* Optical Sapphire Element with multi-coating reflection */}
          <mesh position={[0, 0, -0.075]}>
            <circleGeometry args={[0.2, 32]} />
            <meshPhysicalMaterial
              color="#081426"
              roughness={0.05}
              metalness={0.2}
              clearcoat={1.0}
              clearcoatRoughness={0.05}
            />
          </mesh>

          {/* Inner Sensor Pupil */}
          <mesh position={[0, 0, -0.077]}>
            <circleGeometry args={[0.09, 24]} />
            <meshBasicMaterial color="#020814" />
          </mesh>
        </group>
      ))}

      {/* 3. True Tone Flash (Top Right) */}
      <group position={[0.38, 0.52, -0.07]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.03, 24]} />
          <meshStandardMaterial color="#FFF1C2" roughness={0.3} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0, -0.018]}>
          <circleGeometry args={[0.08, 16]} />
          <meshBasicMaterial color="#FFDD80" />
        </mesh>
      </group>

      {/* 4. LiDAR Scanner Sensor (Bottom Right) */}
      <mesh position={[0.38, -0.48, -0.07]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.11, 0.11, 0.03, 24]} />
        <meshStandardMaterial color="#1C1A18" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* 5. Rear Microphone Pinhole */}
      <mesh position={[0.55, -0.2, -0.07]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.02, 16]} />
        <meshBasicMaterial color="#0A0908" />
      </mesh>
    </group>
  );
};
