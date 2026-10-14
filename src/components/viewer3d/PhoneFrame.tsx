import React from 'react';
import * as THREE from 'three';

// iPhone 16 Pro dimensions in Three.js units (scaled from 71.5mm x 149.6mm x 8.25mm)
export const PHONE_WIDTH = 3.6;
export const PHONE_HEIGHT = 7.5;
export const PHONE_DEPTH = 0.42;
export const CORNER_RADIUS = 0.58;

// Reusable rounded box geometry generator using ExtrudeGeometry
export function createRoundedRectShape(width: number, height: number, radius: number): THREE.Shape {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  const w = width;
  const h = height;
  const r = Math.min(radius, w / 2, h / 2);

  shape.moveTo(x + r, y);
  shape.lineTo(x + w - r, y);
  shape.quadraticCurveTo(x + w, y, x + w, y + r);
  shape.lineTo(x + w, y + h - r);
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  shape.lineTo(x + r, y + h);
  shape.quadraticCurveTo(x, y + h, x, y + h - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);

  return shape;
}

export const PhoneFrame: React.FC = () => {
  // Shape for the phone body
  const bodyShape = React.useMemo(() => {
    return createRoundedRectShape(PHONE_WIDTH, PHONE_HEIGHT, CORNER_RADIUS);
  }, []);

  const extrudeSettings: THREE.ExtrudeGeometryOptions = React.useMemo(() => ({
    depth: PHONE_DEPTH,
    bevelEnabled: true,
    bevelSegments: 6,
    steps: 1,
    bevelSize: 0.05,
    bevelThickness: 0.05,
  }), []);

  // Screen shape with slight offset for slim bezel
  const screenShape = React.useMemo(() => {
    return createRoundedRectShape(PHONE_WIDTH - 0.18, PHONE_HEIGHT - 0.18, CORNER_RADIUS - 0.08);
  }, []);

  return (
    <group>
      {/* 1. Main Titanium Chassis / Rail Frame */}
      <mesh position={[0, 0, -PHONE_DEPTH / 2]} castShadow receiveShadow>
        <extrudeGeometry args={[bodyShape, extrudeSettings]} />
        <meshStandardMaterial
          color="#8A857D" // Apple Natural Titanium finish
          metalness={0.88}
          roughness={0.28}
          envMapIntensity={1.2}
        />
      </mesh>

      {/* 2. Front OLED Display Surface */}
      <mesh position={[0, 0, PHONE_DEPTH / 2 + 0.055]}>
        <shapeGeometry args={[screenShape]} />
        <meshPhysicalMaterial
          color="#070709"
          roughness={0.1}
          metalness={0.1}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
        />
      </mesh>

      {/* Front Dynamic Island Cutout (iPhone 16 Pro pill shape) */}
      <mesh position={[0, PHONE_HEIGHT / 2 - 0.65, PHONE_DEPTH / 2 + 0.057]}>
        <planeGeometry args={[1.05, 0.28]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Front Speaker Micro-slit at top edge */}
      <mesh position={[0, PHONE_HEIGHT / 2 - 0.22, PHONE_DEPTH / 2 + 0.057]}>
        <planeGeometry args={[0.7, 0.03]} />
        <meshBasicMaterial color="#2B2927" />
      </mesh>

      {/* 3. Side Buttons (Apple iPhone 16 Pro specifications) */}
      
      {/* Left Rail: Action Button */}
      <mesh position={[-PHONE_WIDTH / 2 - 0.08, 1.7, 0]} castShadow>
        <boxGeometry args={[0.08, 0.32, 0.14]} />
        <meshStandardMaterial color="#7D7871" metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Left Rail: Volume Up */}
      <mesh position={[-PHONE_WIDTH / 2 - 0.08, 1.05, 0]} castShadow>
        <boxGeometry args={[0.08, 0.55, 0.14]} />
        <meshStandardMaterial color="#7D7871" metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Left Rail: Volume Down */}
      <mesh position={[-PHONE_WIDTH / 2 - 0.08, 0.35, 0]} castShadow>
        <boxGeometry args={[0.08, 0.55, 0.14]} />
        <meshStandardMaterial color="#7D7871" metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Right Rail: Power / Side Button */}
      <mesh position={[PHONE_WIDTH / 2 + 0.08, 0.9, 0]} castShadow>
        <boxGeometry args={[0.08, 0.72, 0.14]} />
        <meshStandardMaterial color="#7D7871" metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Right Rail: iPhone 16 Pro Camera Control Button (Recessed sapphire capacitive) */}
      <mesh position={[PHONE_WIDTH / 2 + 0.06, -1.5, 0]}>
        <boxGeometry args={[0.05, 0.62, 0.12]} />
        <meshStandardMaterial color="#5E5A54" metalness={0.7} roughness={0.4} />
      </mesh>

      {/* Bottom Rail: USB-C Port Cutout */}
      <mesh position={[0, -PHONE_HEIGHT / 2 - 0.06, 0]}>
        <boxGeometry args={[0.5, 0.05, 0.16]} />
        <meshBasicMaterial color="#1A1817" />
      </mesh>

      {/* Bottom Rail: Speaker Holes */}
      {[-0.6, -0.8, -1.0, 0.6, 0.8, 1.0].map((xOffset) => (
        <mesh key={xOffset} position={[xOffset, -PHONE_HEIGHT / 2 - 0.06, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.06, 8]} />
          <meshBasicMaterial color="#1A1817" />
        </mesh>
      ))}

      {/* Antenna Bands on Titanium Perimeter */}
      {[-1.8, 1.8].map((yOffset) => (
        <mesh key={yOffset} position={[-PHONE_WIDTH / 2 - 0.05, yOffset, 0]}>
          <boxGeometry args={[0.03, 0.04, PHONE_DEPTH + 0.08]} />
          <meshBasicMaterial color="#6B6760" />
        </mesh>
      ))}
      {[-1.8, 1.8].map((yOffset) => (
        <mesh key={`r-${yOffset}`} position={[PHONE_WIDTH / 2 + 0.05, yOffset, 0]}>
          <boxGeometry args={[0.03, 0.04, PHONE_DEPTH + 0.08]} />
          <meshBasicMaterial color="#6B6760" />
        </mesh>
      ))}
    </group>
  );
};
