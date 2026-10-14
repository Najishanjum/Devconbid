import React, { useMemo } from 'react';
import { createRoundedRectShape, PHONE_WIDTH, PHONE_HEIGHT, PHONE_DEPTH, CORNER_RADIUS } from './PhoneFrame';
import * as THREE from 'three';

interface BackCoverModelProps {
  coverColor: string;
  slot: '01' | '02';
}

export const BackCoverModel: React.FC<BackCoverModelProps> = ({ coverColor, slot }) => {
  // Back cover uses same rounded rect but slightly thinner
  const coverShape = useMemo(() => {
    return createRoundedRectShape(PHONE_WIDTH - 0.04, PHONE_HEIGHT - 0.04, CORNER_RADIUS - 0.02);
  }, []);

  const extrudeSettings: THREE.ExtrudeGeometryOptions = useMemo(() => ({
    depth: 0.06,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.02,
    bevelThickness: 0.02,
  }), []);

  // Sponsor printable area geometry (excludes camera island zone)
  const printAreaShape = useMemo(() => {
    // Printable zone: bottom 55% of cover, safe from camera island
    return createRoundedRectShape(PHONE_WIDTH - 0.5, PHONE_HEIGHT * 0.5, 0.18);
  }, []);

  const isSlot01 = slot === '01';

  return (
    <group position={[0, 0, -PHONE_DEPTH / 2 - 0.035]}>
      {/* Main Back Cover Shell */}
      <mesh castShadow receiveShadow>
        <extrudeGeometry args={[coverShape, extrudeSettings]} />
        <meshPhysicalMaterial
          color={coverColor}
          roughness={isSlot01 ? 0.6 : 0.5}
          metalness={isSlot01 ? 0.1 : 0.0}
          clearcoat={0.3}
          clearcoatRoughness={0.4}
        />
      </mesh>

      {/* Satin Micro-texture Overlay */}
      <mesh position={[0, 0, -0.07]}>
        <shapeGeometry args={[coverShape]} />
        <meshPhysicalMaterial
          color={coverColor}
          roughness={0.8}
          metalness={0.0}
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Sponsor Logo Printable Region Indicator */}
      <mesh position={[0, -PHONE_HEIGHT * 0.12, -0.072]}>
        <shapeGeometry args={[printAreaShape]} />
        <meshBasicMaterial
          color={isSlot01 ? '#3A3630' : '#E0D9CF'}
          transparent
          opacity={0.22}
        />
      </mesh>
    </group>
  );
};
