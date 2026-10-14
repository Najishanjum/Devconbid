import React, { Suspense, useRef, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { PhoneFrame } from './PhoneFrame';
import { RearCameraAssembly } from './RearCameraAssembly';
import { BackCoverModel } from './BackCoverModel';
import { CAMERA_PRESETS, PresetView } from './PhoneViewPresets';

interface PhoneModelProps {
  slot: '01' | '02';
  autoRotate: boolean;
  targetPreset: PresetView;
  sponsorLogoUrl?: string | null;
}

const PhoneScene: React.FC<PhoneModelProps & { controlsRef: React.MutableRefObject<any> }> = ({
  slot,
  autoRotate,
  targetPreset,
  controlsRef,
  sponsorLogoUrl,
}) => {
  const groupRef = useRef<THREE.Group>(null!);
  const prevPreset = useRef<PresetView>(targetPreset);
  const animatingTo = useRef<{ pos: THREE.Vector3; target: THREE.Vector3 } | null>(null);
  const { camera } = useThree();

  // Kick off smooth camera animation when preset changes
  useEffect(() => {
    if (targetPreset !== prevPreset.current) {
      prevPreset.current = targetPreset;
      const preset = CAMERA_PRESETS[targetPreset];
      animatingTo.current = {
        pos: new THREE.Vector3(...preset.position),
        target: new THREE.Vector3(...preset.target),
      };
    }
  }, [targetPreset]);

  useFrame((_state, delta) => {
    // Auto rotate
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.35;
    }

    // Smooth camera transition
    if (animatingTo.current && controlsRef.current) {
      const { pos, target } = animatingTo.current;
      camera.position.lerp(pos, 0.08);
      controlsRef.current.target.lerp(target, 0.08);
      controlsRef.current.update();

      if (camera.position.distanceTo(pos) < 0.05) {
        camera.position.copy(pos);
        controlsRef.current.target.copy(target);
        controlsRef.current.update();
        animatingTo.current = null;
      }
    }
  });

  const coverColor = slot === '01' ? '#1E1C1A' : '#EBE4D9';

  return (
    <group ref={groupRef}>
      {/* Studio Lighting */}
      <ambientLight intensity={0.55} color="#F5F0EC" />
      <directionalLight
        position={[6, 10, 6]}
        intensity={1.8}
        color="#FFFFFF"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={40}
      />
      <directionalLight position={[-5, 5, -3]} intensity={0.6} color="#D8D0FF" />
      <pointLight position={[0, 8, 8]} intensity={0.5} color="#FFFFFF" />
      <pointLight position={[0, -4, -6]} intensity={0.25} color="#F0EBE0" />

      {/* Phone group – all geometry rotated so rear faces viewer */}
      <group rotation={[0, Math.PI, 0]}>
        <PhoneFrame />
        <RearCameraAssembly />
        <BackCoverModel coverColor={coverColor} slot={slot} />

        {/* Sponsor Logo Texture Plane attached to back surface */}
        {sponsorLogoUrl && <SponsorLogoDecal logoUrl={sponsorLogoUrl} />}
      </group>

      {/* Subtle ground shadow */}
      <ContactShadows
        position={[0, -4.5, 0]}
        opacity={0.22}
        scale={10}
        blur={2.2}
        far={6}
      />
    </group>
  );
};

interface SponsorLogoDecalProps {
  logoUrl: string;
}

const SponsorLogoDecal: React.FC<SponsorLogoDecalProps> = ({ logoUrl }) => {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    if (!logoUrl) return;
    const loader = new THREE.TextureLoader();
    loader.load(
      logoUrl,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        setTexture(tex);
      },
      undefined,
      () => setTexture(null)
    );
    return () => {
      texture?.dispose();
    };
  }, [logoUrl]);

  if (!texture) return null;

  return (
    // Positioned on the back cover surface (z rotated for rear-face-forward orientation)
    <mesh position={[0, -1.0, 3.75]} rotation={[0, 0, 0]}>
      <planeGeometry args={[2.0, 1.0]} />
      <meshBasicMaterial
        map={texture}
        transparent
        alphaTest={0.05}
        depthWrite={false}
        polygonOffset
        polygonOffsetFactor={-1}
      />
    </mesh>
  );
};

export interface InteractivePhoneViewerProps {
  slot: '01' | '02';
  sponsorLogoUrl?: string | null;
  className?: string;
}

export const InteractivePhoneViewer: React.FC<InteractivePhoneViewerProps> = ({
  slot,
  sponsorLogoUrl,
  className = '',
}) => {
  const [autoRotate, setAutoRotate] = useState(false);
  const [activePreset, setActivePreset] = useState<PresetView>('three-quarter');
  const [webglFailed, setWebglFailed] = useState(false);
  const controlsRef = useRef<any>(null);

  const handlePresetChange = useCallback((preset: PresetView) => {
    setActivePreset(preset);
    setAutoRotate(false); // stop auto-rotate when user picks preset
  }, []);

  const handleZoomIn = () => {
    if (controlsRef.current) {
      const controls = controlsRef.current;
      controls.dollyIn(1.3);
      controls.update();
    }
  };

  const handleZoomOut = () => {
    if (controlsRef.current) {
      const controls = controlsRef.current;
      controls.dollyOut(1.3);
      controls.update();
    }
  };

  const handleReset = () => {
    setActivePreset('three-quarter');
    setAutoRotate(false);
  };

  if (webglFailed) {
    return (
      <div className={`flex flex-col items-center justify-center bg-[#F8F7FA] rounded-[24px] border border-[#ECEBF0] min-h-[340px] p-8 text-center ${className}`}>
        <div className="text-4xl mb-3">📱</div>
        <p className="text-sm font-semibold text-[#22212A] mb-1">3D Viewer Unavailable</p>
        <p className="text-xs text-[#777681] max-w-xs">
          Your browser doesn't support WebGL or hardware acceleration is disabled. The interactive 3D viewer requires WebGL to run.
        </p>
      </div>
    );
  }

  const preset = CAMERA_PRESETS[activePreset];

  return (
    <div className={`relative flex flex-col gap-3 ${className}`}>
      {/* Viewer Canvas Container */}
      <div
        className="relative w-full rounded-[24px] overflow-hidden border border-[#ECEBF0] shadow-saas-lg bg-[#F5F2EE]"
        style={{ aspectRatio: '4/3', minHeight: 280 }}
        onContextMenu={(e) => e.preventDefault()}
      >
        <Suspense
          fallback={
            <div className="absolute inset-0 flex items-center justify-center bg-[#F5F2EE]">
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-full border-2 border-[#A58BFA] border-t-transparent animate-spin" />
                <span className="text-xs text-[#777681]">Loading 3D Model…</span>
              </div>
            </div>
          }
        >
          <Canvas
            camera={{
              position: preset.position,
              fov: 42,
              near: 0.1,
              far: 100,
            }}
            dpr={[1, Math.min(window.devicePixelRatio, 2)]}
            shadows
            gl={{ antialias: true, alpha: false, preserveDrawingBuffer: false }}
            onCreated={({ gl }) => {
              gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
              gl.toneMapping = THREE.ACESFilmicToneMapping;
              gl.toneMappingExposure = 1.05;
            }}
          >
            <color attach="background" args={['#F5F2EE']} />

            <PhoneScene
              slot={slot}
              autoRotate={autoRotate}
              targetPreset={activePreset}
              controlsRef={controlsRef}
              sponsorLogoUrl={sponsorLogoUrl}
            />

            <OrbitControls
              ref={controlsRef}
              enablePan={false}
              enableDamping
              dampingFactor={0.07}
              minDistance={7}
              maxDistance={22}
              minPolarAngle={Math.PI * 0.08}
              maxPolarAngle={Math.PI * 0.92}
              target={new THREE.Vector3(...preset.target)}
              makeDefault
            />
          </Canvas>
        </Suspense>

        {/* Hint overlay */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none">
          <span className="text-[11px] text-[#777681] bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border border-[#ECEBF0] shadow-sm font-medium">
            Drag to rotate · Scroll or pinch to zoom
          </span>
        </div>
      </div>

      {/* Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Preset Buttons */}
        <div className="flex flex-wrap gap-1.5">
          {(Object.keys(CAMERA_PRESETS) as PresetView[]).map((key) => (
            <button
              key={key}
              onClick={() => handlePresetChange(key)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                activePreset === key
                  ? 'bg-[#24232E] text-white shadow-sm'
                  : 'bg-white border border-[#ECEBF0] text-[#777681] hover:text-[#22212A] hover:border-[#DDDCE3]'
              }`}
            >
              {CAMERA_PRESETS[key].label}
            </button>
          ))}
        </div>

        {/* Zoom & Reset Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="w-8 h-8 rounded-lg bg-white border border-[#ECEBF0] text-[#777681] hover:text-[#22212A] hover:border-[#DDDCE3] flex items-center justify-center text-sm font-bold transition-all"
          >
            +
          </button>
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="w-8 h-8 rounded-lg bg-white border border-[#ECEBF0] text-[#777681] hover:text-[#22212A] hover:border-[#DDDCE3] flex items-center justify-center text-sm font-bold transition-all"
          >
            −
          </button>
          <button
            onClick={handleReset}
            title="Reset View"
            className="px-2.5 py-1 rounded-lg bg-white border border-[#ECEBF0] text-[11px] font-medium text-[#777681] hover:text-[#22212A] hover:border-[#DDDCE3] transition-all"
          >
            Reset
          </button>
          <button
            onClick={() => setAutoRotate((v) => !v)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
              autoRotate
                ? 'bg-[#A58BFA] text-white shadow-sm'
                : 'bg-white border border-[#ECEBF0] text-[#777681] hover:text-[#22212A]'
            }`}
          >
            {autoRotate ? '⏸ Rotate' : '▶ Rotate'}
          </button>
        </div>
      </div>
    </div>
  );
};
